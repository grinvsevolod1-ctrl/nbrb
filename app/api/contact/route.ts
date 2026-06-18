import { type NextRequest, NextResponse } from "next/server"

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const name = String(body.name ?? "").trim()
    const contact = String(body.contact ?? "").trim()
    const message = String(body.message ?? "").trim()

    if (!name || !contact) {
      return NextResponse.json({ success: false, error: "Заполните имя и контакт." }, { status: 400 })
    }

    if (name.length > 200 || contact.length > 200 || message.length > 2000) {
      return NextResponse.json({ success: false, error: "Слишком длинное сообщение." }, { status: 400 })
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN
    const adminChatId = process.env.TELEGRAM_ADMIN_CHAT_ID

    if (!botToken || !adminChatId) {
      return NextResponse.json({ success: false, error: "Сервис временно недоступен." }, { status: 500 })
    }

    const lines = [
      "<b>НОВОЕ ОБРАЩЕНИЕ С САЙТА</b>",
      "",
      `<b>Имя:</b> ${escapeHtml(name)}`,
      `<b>Контакт:</b> ${escapeHtml(contact)}`,
    ]
    if (message) {
      lines.push("", "<b>Сообщение:</b>", escapeHtml(message))
    }
    lines.push("", "#обращение #сайт")

    const telegramResponse = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: adminChatId,
        text: lines.join("\n"),
        parse_mode: "HTML",
      }),
    })

    if (!telegramResponse.ok) {
      return NextResponse.json({ success: false, error: "Не удалось отправить сообщение." }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ success: false, error: "Внутренняя ошибка сервера." }, { status: 500 })
  }
}
