type CurrencyFormatOptions = {
  compact?: boolean;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  locale?: string;
};

const currencyFormatterCache = new Map<string, Intl.NumberFormat>();
const decimalFormatterCache = new Map<string, Intl.NumberFormat>();

function resolveLocale(locale?: string) {
  if (locale) return locale;
  if (typeof document !== "undefined" && document.documentElement.lang === "ar") {
    return "ar-LY";
  }
  return "en-LY";
}

function getNumberFormatter(options: CurrencyFormatOptions = {}) {
  const {
    compact = false,
    minimumFractionDigits = compact ? 0 : 0,
    maximumFractionDigits = compact ? 1 : 0,
    locale,
  } = options;
  const resolvedLocale = resolveLocale(locale);

  const cacheKey = `${resolvedLocale}-${compact}-${minimumFractionDigits}-${maximumFractionDigits}`;
  const cachedFormatter = currencyFormatterCache.get(cacheKey);
  if (cachedFormatter) return cachedFormatter;

  const formatter = new Intl.NumberFormat(resolvedLocale, {
    style: "currency",
    currency: "LYD",
    currencyDisplay: "code",
    notation: compact ? "compact" : "standard",
    minimumFractionDigits,
    maximumFractionDigits,
  });

  currencyFormatterCache.set(cacheKey, formatter);
  return formatter;
}

export function formatNumber(
  value: number,
  options: CurrencyFormatOptions = {},
) {
  const {
    compact = false,
    minimumFractionDigits = compact ? 0 : 0,
    maximumFractionDigits = compact ? 1 : 0,
    locale,
  } = options;
  const resolvedLocale = resolveLocale(locale);
  const cacheKey = `${resolvedLocale}-${compact}-${minimumFractionDigits}-${maximumFractionDigits}`;
  const cachedFormatter = decimalFormatterCache.get(cacheKey);
  if (cachedFormatter) return cachedFormatter.format(value);

  const formatter = new Intl.NumberFormat(resolvedLocale, {
    style: "decimal",
    notation: compact ? "compact" : "standard",
    minimumFractionDigits,
    maximumFractionDigits,
  });

  decimalFormatterCache.set(cacheKey, formatter);
  return formatter.format(value);
}

export function formatCurrencyLYD(value: number, options: CurrencyFormatOptions = {}) {
  return getNumberFormatter(options).format(value);
}

/**
 * Rounds a percentage value to avoid floating-point display noise (e.g. 3.569999999999994 → 3.6).
 */
export function roundPercent(value: number, fractionDigits = 1): number {
  return Number.parseFloat(value.toFixed(fractionDigits));
}

/**
 * Formats a percentage change for UI (locale-aware; one decimal by default).
 */
export function formatPercentChange(
  value: number,
  options: { locale?: string; maximumFractionDigits?: number } = {},
): string {
  const maximumFractionDigits = options.maximumFractionDigits ?? 1;
  const rounded = roundPercent(value, maximumFractionDigits);
  return formatNumber(rounded, {
    locale: options.locale,
    minimumFractionDigits: 0,
    maximumFractionDigits,
  });
}
