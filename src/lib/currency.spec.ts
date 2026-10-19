import { describe, expect, it } from "vitest";

import { formatCurrency, formatDiscountPercent, parseCurrencyInput } from "@/lib/currency";

describe("currency helpers", () => {
  it("formats BRL values", () => {
    expect(formatCurrency(1999.9)).toBe("R$ 1.999,90");
  });

  it("parses a Brazilian money input", () => {
    expect(parseCurrencyInput("199990")).toBe(1999.9);
  });

  it("calculates a visible discount", () => {
    expect(formatDiscountPercent(2499.9, 1999.9)).toBe(20);
  });
});
