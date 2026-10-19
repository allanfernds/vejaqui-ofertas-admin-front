const dateFormatter = new Intl.DateTimeFormat("pt-BR");
const dateTimeFormatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short",
});

export function parseIsoDate(value: string | Date): Date {
  return value instanceof Date ? value : new Date(value);
}

export function formatDate(value: string | Date): string {
  return dateFormatter.format(parseIsoDate(value));
}

export function formatDateTime(value: string | Date): string {
  return dateTimeFormatter.format(parseIsoDate(value)).replace(",", " às");
}

export function toDateTimeLocalValue(value: string | Date): string {
  const date = parseIsoDate(value);
  const timezoneOffset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - timezoneOffset).toISOString().slice(0, 16);
}

export function fromDateTimeLocalValue(value: string): string {
  return new Date(value).toISOString();
}

export function isExpired(expiresAt: string | Date, now = new Date()): boolean {
  return parseIsoDate(expiresAt).getTime() <= now.getTime();
}
