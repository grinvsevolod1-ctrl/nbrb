import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// Verify Telegram WebApp initData
function verifyTelegramWebAppData(initData: string, botToken: string): boolean {
  try {
    const urlParams = new URLSearchParams(initData);
    const hash = urlParams.get("hash");
    if (!hash) return false;

    urlParams.delete("hash");
    const dataCheckArr: string[] = [];
    urlParams.sort();
    urlParams.forEach((value, key) => {
      dataCheckArr.push(`${key}=${value}`);
    });
    const dataCheckString = dataCheckArr.join("\n");

    const secretKey = crypto
      .createHmac("sha256", "WebAppData")
      .update(botToken)
      .digest();

    const calculatedHash = crypto
      .createHmac("sha256", secretKey)
      .update(dataCheckString)
      .digest("hex");

    return calculatedHash === hash;
  } catch {
    return false;
  }
}

// Format message for Telegram
function formatMessage(data: {
  telegramId: number;
  telegramUsername?: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  phone: string;
  birthDate: string;
  currentCity: string;
  occupation?: string;
  workplace?: string;
  education?: string;
  about?: string;
  participantNumber: string;
}): string {
  const lines = [
    `<b>НОВЫЙ УЧАСТНИК GREEN CARD 2026</b>`,
    ``,
    `<b>Telegram:</b>`,
    `ID: <code>${data.telegramId}</code>`,
    data.telegramUsername ? `Username: @${data.telegramUsername}` : `Username: не указан`,
    ``,
    `<b>Личные данные:</b>`,
    `ФИО: ${data.lastName} ${data.firstName}${data.middleName ? ` ${data.middleName}` : ""}`,
    `Телефон: <code>${data.phone}</code>`,
    `Дата рождения: ${data.birthDate}`,
    `Город: ${data.currentCity}`,
  ];

  if (data.occupation || data.workplace || data.education || data.about) {
    lines.push(``);
    lines.push(`<b>Дополнительно:</b>`);
    if (data.occupation) lines.push(`Род деятельности: ${data.occupation}`);
    if (data.workplace) lines.push(`Место работы: ${data.workplace}`);
    if (data.education) lines.push(`Образование: ${data.education}`);
    if (data.about) lines.push(`О себе: ${data.about}`);
  }

  lines.push(``);
  lines.push(`<b>Номер билета:</b> <code>${data.participantNumber}</code>`);
  lines.push(``);
  lines.push(`#greencard2026 #participant`);

  return lines.join("\n");
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { initData, formData, participantNumber, phone } = body;

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const adminChatId = process.env.TELEGRAM_ADMIN_CHAT_ID;

    if (!botToken || !adminChatId) {
      return NextResponse.json(
        { success: false, error: "Server configuration error" },
        { status: 500 }
      );
    }

    // Verify Telegram initData
    if (initData && !verifyTelegramWebAppData(initData, botToken)) {
      return NextResponse.json(
        { success: false, error: "Invalid authentication" },
        { status: 403 }
      );
    }

    // Parse user data from initData
    let telegramId = 0;
    let telegramUsername = "";
    
    if (initData) {
      try {
        const urlParams = new URLSearchParams(initData);
        const userParam = urlParams.get("user");
        if (userParam) {
          const userData = JSON.parse(userParam);
          telegramId = userData.id || 0;
          telegramUsername = userData.username || "";
        }
      } catch {
        // Silent fail
      }
    }

    // Format and send message to admin
    const message = formatMessage({
      telegramId,
      telegramUsername,
      firstName: formData.firstName || "",
      lastName: formData.lastName || "",
      middleName: formData.middleName || "",
      phone: phone || "",
      birthDate: formData.birthDate || "",
      currentCity: formData.currentCity || "",
      occupation: formData.occupation || "",
      workplace: formData.workplace || "",
      education: formData.education || "",
      about: formData.about || "",
      participantNumber,
    });

    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: adminChatId,
          text: message,
          parse_mode: "HTML",
        }),
      }
    );

    if (!telegramResponse.ok) {
      return NextResponse.json(
        { success: false, error: "Failed to send notification" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
