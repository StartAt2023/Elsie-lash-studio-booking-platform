import { en } from "@/locales/en";
import { zh } from "@/locales/zh";
import type { MessageDict } from "@/locales/en";

export type { MessageDict } from "@/locales/en";

export const LOCALES = ["en", "zh"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";
export const LOCALE_STORAGE_KEY = "elsie-lash-locale";

export const messages: Record<Locale, MessageDict> = { en, zh };

function getByPath(obj: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, part) => {
    if (acc == null || typeof acc !== "object") return undefined;
    return (acc as Record<string, unknown>)[part];
  }, obj);
}

export function interpolate(
  template: string,
  params?: Record<string, string | number | undefined | null>
) {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (_, k: string) => {
    const v = params[k];
    if (v == null || v === "") return "";
    return String(v);
  });
}

/** Looks up a dot path on the active message tree; returns a string for translation keys. */
export function formatMessage(
  msgs: MessageDict,
  key: string,
  params?: Record<string, string | number | undefined | null>
) {
  const v = getByPath(msgs, key);
  if (typeof v !== "string") return key;
  return interpolate(v, params);
}

export function isLocale(s: string | null | undefined): s is Locale {
  return s === "en" || s === "zh";
}

export function getLocaleDateTag(locale: Locale): string {
  return locale === "zh" ? "zh-CN" : "en-AU";
}
