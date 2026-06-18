import { type NextRequest, NextResponse } from "next/server"

function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
}

interface Field {
  label: string
  value: unknown
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const fields: Field[] = [
      { label: "Фамилия", value: body.lastName },
      { label: "Имя", value: body.firstName },
      { label: "Отчество", value: body.middleName },
      { label: "Дата рождения", value: body.birthDate },
      { label: "Место рождения", value: body.birthPlace },
      { label: "Гражданство", value: body.citizenship },
      { label: "Серия и номер паспорта", value: body.passport },
      { label: "Кем выдан паспорт", value: body.passportIssuer },
      { label: "Адрес проживания", value: body.address },
      { label: "Основной телефон", value: body.phonePrimary },
      { label: "Доп. телефон", value: body.phoneSecondary },
      { label: "Телефон родственника", value: body.phoneRelative },
      { label: "Email", value: body.email },
      { label: "Telegram", value: body.telegram },
      { label: "Семейное положение", value: body.maritalStatus },
      { label: "Образование", value: body.education },
      { label: "Род деятельности", value: body.occupation },
      { label: "Статус политзаключённого", value: body.prisonerStatus },
      { label: "Срок преследования / заключения", value: body.persecutionPeriod },
      { label: "Доп. информация", value: body.details },
    ]

    const firstName = String(body.firstName ?? "").trim()
    const lastName = String(body.lastName ?? "").trim()
    const phonePrimary = String(body.phonePrimary ?? "").trim()

    if (!firstName || !lastName || !phonePrimary) {
      return NextResponse.json(
        { success: false, error: "Заполните имя, фамилию и основной телефон." },
        { status: 400 },
      )
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN
    const adminChatId = process.env.TELEGRAM_ADMIN_CHAT_ID

    if (!botToken || !adminChatId) {
      return NextResponse.json({ success: false, error: "Сервис временно недоступен." }, { status: 500 })
    }

    const lines: string[] = ["<b>НОВАЯ ЗАЯВКА — ДОКУМЕНТЫ</b>", ""]
    for (const f of fields) {
      const v = String(f.value ?? "").trim()
      if (v) lines.push(`<b>${escapeHtml(f.label)}:</b> ${escapeHtml(v)}`)
    }
    lines.push("", "#заявка #документы")

    const caption = lines.join("\n")
    const photoDataUrl = String(body.applicationPhoto ?? "")
    const photoName = String(body.applicationPhotoName ?? "application.jpg")

    // If a photo of the handwritten application was attached, send it with the
    // details as the caption (sendPhoto). Telegram captions are limited to
    // 1024 chars, so fall back to a separate text message when too long.
    if (photoDataUrl.startsWith("data:image/")) {
      const match = photoDataUrl.match(/^data:(image\/[^;]+);base64,(.+)$/)
      if (match) {
        const mime = match[1]
        const buffer = Buffer.from(match[2], "base64")
        const useCaption = caption.length <= 1024

        const form = new FormData()
        form.append("chat_id", adminChatId)
        if (useCaption) {
          form.append("caption", caption)
          form.append("parse_mode", "HTML")
        }
        form.append("photo", new Blob([buffer], { type: mime }), photoName)

        const photoResponse = await fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
          method: "POST",
          body: form,
        })

        if (!photoResponse.ok) {
          return NextResponse.json({ success: false, error: "Не удалось отправить заявку." }, { status: 500 })
        }

        // Send the details separately if the caption was too long to attach.
        if (!useCaption) {
          await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ chat_id: adminChatId, text: caption, parse_mode: "HTML" }),
          })
        }

        return NextResponse.json({ success: true })
      }
    }

    const telegramResponse = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: adminChatId,
        text: caption,
        parse_mode: "HTML",
      }),
    })

    if (!telegramResponse.ok) {
      return NextResponse.json({ success: false, error: "Не удалось отправить заявку." }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ success: false, error: "Внутренняя ошибка сервера." }, { status: 500 })
  }
}
