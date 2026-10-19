const brlFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function parseMoney(value: string | number | null | undefined): number {
  if (value == null || value === "") {
    return 0;
  }

  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
  }

  const normalized = value.replace(/\./g, "").replace(",", ".");
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function formatCurrency(value: string | number | null | undefined): string {
  return brlFormatter.format(parseMoney(value));
}

export function formatDiscountPercent(
  originalPrice: string | number,
  promotionalPrice: string | number,
): number | null {
  const original = parseMoney(originalPrice);
  const promotional = parseMoney(promotionalPrice);

  if (original <= 0 || promotional <= 0 || promotional >= original) {
    return null;
  }

  return Math.round(((original - promotional) / original) * 100);
}

export function parseCurrencyInput(raw: string): number {
  const digits = raw.replace(/\D/g, "");
  if (!digits) {
    return 0;
  }
  return Number(digits) / 100;
}

export function formatCurrencyInput(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value || 0);
}
