type CurrencyFormatOptions = {
  compact?: boolean;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
};

const numberFormatterCache = new Map<string, Intl.NumberFormat>();

function getNumberFormatter(options: CurrencyFormatOptions = {}) {
  const {
    compact = false,
    minimumFractionDigits = compact ? 0 : 0,
    maximumFractionDigits = compact ? 1 : 0,
  } = options;

  const cacheKey = `${compact}-${minimumFractionDigits}-${maximumFractionDigits}`;
  const cachedFormatter = numberFormatterCache.get(cacheKey);
  if (cachedFormatter) return cachedFormatter;

  const formatter = new Intl.NumberFormat("en-LY", {
    style: "decimal",
    notation: compact ? "compact" : "standard",
    minimumFractionDigits,
    maximumFractionDigits,
  });

  numberFormatterCache.set(cacheKey, formatter);
  return formatter;
}

export function formatCurrencyLYD(value: number, options: CurrencyFormatOptions = {}) {
  return `${getNumberFormatter(options).format(value)} LYD`;
}
