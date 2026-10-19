import { describe, expect, it } from "vitest";

import {
  formatCnpj,
  formatCpf,
  normalizeCnpj,
  normalizeCpf,
  validateCnpj,
  validateCpf,
} from "@/utils/cpf-cnpj";

describe("CPF", () => {
  it("accepts a valid CPF", () => {
    expect(validateCpf("52998224725")).toBe(true);
  });

  it("accepts a formatted valid CPF", () => {
    expect(validateCpf("529.982.247-25")).toBe(true);
  });

  it("rejects an invalid CPF", () => {
    expect(validateCpf("52998224724")).toBe(false);
  });

  it("rejects repeated digits", () => {
    expect(validateCpf("111.111.111-11")).toBe(false);
  });

  it("normalizes a formatted CPF", () => {
    expect(normalizeCpf("529.982.247-25")).toBe("52998224725");
  });

  it("formats a CPF", () => {
    expect(formatCpf("52998224725")).toBe("529.982.247-25");
  });
});

describe("numeric CNPJ", () => {
  it("accepts a valid numeric CNPJ", () => {
    expect(validateCnpj("11444777000161")).toBe(true);
  });

  it("accepts a formatted numeric CNPJ", () => {
    expect(validateCnpj("11.444.777/0001-61")).toBe(true);
  });

  it("rejects an invalid numeric CNPJ", () => {
    expect(validateCnpj("11444777000160")).toBe(false);
  });

  it("normalizes a formatted numeric CNPJ without dropping digits", () => {
    expect(normalizeCnpj("11.444.777/0001-61")).toBe("11444777000161");
  });

  it("formats a numeric CNPJ", () => {
    expect(formatCnpj("11444777000161")).toBe("11.444.777/0001-61");
  });
});

describe("alphanumeric CNPJ", () => {
  it("accepts the official RFB example", () => {
    expect(validateCnpj("12ABC34501DE35")).toBe(true);
    expect(validateCnpj("12.ABC.345/01DE-35")).toBe(true);
  });

  it("accepts 00.000.000/E08G-12", () => {
    expect(validateCnpj("00.000.000/E08G-12")).toBe(true);
    expect(validateCnpj("00000000E08G12")).toBe(true);
  });

  it("rejects an alphanumeric CNPJ with invalid check digits", () => {
    expect(validateCnpj("12ABC34501DE34")).toBe(false);
  });

  it("uppercases letters during normalization", () => {
    expect(normalizeCnpj("00.000.000/e08g-12")).toBe("00000000E08G12");
  });

  it("removes special characters without dropping letters", () => {
    expect(normalizeCnpj("12.abc.345/01de-35")).toBe("12ABC34501DE35");
  });

  it("does not use a digits-only strip that would break letters", () => {
    expect(normalizeCnpj("12ABC34501DE35").includes("ABC")).toBe(true);
  });

  it("formats an alphanumeric CNPJ", () => {
    expect(formatCnpj("12ABC34501DE35")).toBe("12.ABC.345/01DE-35");
  });
});
