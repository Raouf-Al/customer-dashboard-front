import { translationValueKeys } from "@/lib/translations";

type TranslationFn = (
  key: string,
  params?: Record<string, string | number>,
) => string;

type TranslationGroup = keyof typeof translationValueKeys;

export function translateDataValue(
  t: TranslationFn,
  group: TranslationGroup,
  value: string,
) {
  const groupKeys = translationValueKeys[group] as Record<string, string>;
  const key = groupKeys[value];
  return key ? t(key) : value;
}

export function translateMonthLabel(t: TranslationFn, month: string) {
  return translateDataValue(t, "month", month);
}
