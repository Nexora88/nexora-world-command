export function safeCountryCode(value?: string | null): string {
  return typeof value === "string" ? value.trim().toUpperCase() : "";
}

export function safeCountryName(value?: string | null, fallback = "UNKNOWN"): string {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}
