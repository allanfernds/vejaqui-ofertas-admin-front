import { describe, expect, it } from "vitest";

import { companySchema, toCreateCompanyPayload } from "@/schemas/company.schema";

const validPj = {
  personType: "PJ" as const,
  document: "12.ABC.345/01DE-35",
  name: "Loja Exemplo",
  legalName: "Loja Exemplo LTDA",
  businessEmail: "contato@loja.com",
  phone: "(75) 99999-9999",
  whatsapp: "",
  postalCode: "44001-000",
  street: "Rua das Flores",
  number: "100",
  complement: "",
  neighborhood: "Centro",
  city: "Feira de Santana",
  state: "BA",
  logoUrl: "",
  logoPublicId: "",
};

describe("companySchema", () => {
  it("accepts PF with a valid CPF", () => {
    const result = companySchema.safeParse({
      ...validPj,
      personType: "PF",
      document: "529.982.247-25",
    });
    expect(result.success).toBe(true);
  });

  it("rejects PF with an invalid CPF", () => {
    const result = companySchema.safeParse({
      ...validPj,
      personType: "PF",
      document: "529.982.247-24",
    });
    expect(result.success).toBe(false);
  });

  it("accepts PJ with an alphanumeric CNPJ", () => {
    const result = companySchema.safeParse(validPj);
    expect(result.success).toBe(true);
  });

  it("rejects PJ with an invalid CNPJ", () => {
    const result = companySchema.safeParse({
      ...validPj,
      document: "12.ABC.345/01DE-34",
    });
    expect(result.success).toBe(false);
  });

  it("requires city and state", () => {
    const result = companySchema.safeParse({
      ...validPj,
      city: "",
      state: "",
    });
    expect(result.success).toBe(false);
  });

  it("allows a company without a logo", () => {
    const result = companySchema.safeParse(validPj);
    expect(result.success).toBe(true);
    if (result.success) {
      const payload = toCreateCompanyPayload(result.data);
      expect(payload.logoUrl).toBeNull();
      expect(payload.document).toBe("12ABC34501DE35");
    }
  });
});
