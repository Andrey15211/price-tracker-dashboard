export const formatRub = (value: number, locale = "ru") =>
  new Intl.NumberFormat(locale === "en" ? "en-US" : "ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(value);

export const formatPercent = (value: number, locale = "ru") =>
  new Intl.NumberFormat(locale === "en" ? "en-US" : "ru-RU", {
    style: "percent",
    maximumFractionDigits: 1,
    signDisplay: "exceptZero",
  }).format(value);

export const formatDateTime = (value: string, locale = "ru") =>
  new Intl.DateTimeFormat(locale === "en" ? "en-US" : "ru-RU", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
