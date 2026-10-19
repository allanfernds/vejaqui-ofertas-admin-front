import { z } from "zod";

import { BRAZILIAN_STATES } from "@/lib/states";
import { normalizePostalCode } from "@/lib/masks";
import { normalizeCnpj, normalizeCpf, validateCnpj, validateCpf } from "@/utils/cpf-cnpj";

const stateValues = BRAZILIAN_STATES.map((state) => state.value) as [string, ...string[]];

export const companySchema = z
  .object({
    personType: z.enum(["PF", "PJ"]),
    document: z.string().trim().min(1, "Informe o CPF ou CNPJ."),
    name: z.string().trim().min(2, "Informe o nome da empresa.").max(150),
    legalName: z.string().trim().max(200).optional().or(z.literal("")),
    businessEmail: z.email("Informe um e-mail comercial válido."),
    phone: z.string().trim().min(10, "Informe um telefone válido."),
    whatsapp: z.string().optional().or(z.literal("")),
    postalCode: z.string().trim().min(8, "Informe um CEP válido."),
    street: z.string().trim().min(2, "Informe a rua."),
    number: z.string().trim().min(1, "Informe o número."),
    complement: z.string().trim().optional().or(z.literal("")),
    neighborhood: z.string().trim().min(2, "Informe o bairro."),
    city: z.string().trim().min(2, "Informe a cidade."),
    state: z.enum(stateValues, { error: "Informe o estado." }),
    logoUrl: z.string().optional().nullable(),
    logoPublicId: z.string().optional().nullable(),
  })
  .superRefine((values, context) => {
    if (values.personType === "PF" && !validateCpf(values.document)) {
      context.addIssue({
        code: "custom",
        path: ["document"],
        message: "Informe um CPF válido.",
      });
    }

    if (values.personType === "PJ" && !validateCnpj(values.document)) {
      context.addIssue({
        code: "custom",
        path: ["document"],
        message: "Informe um CNPJ válido.",
      });
    }
  });

export type CompanyFormValues = z.infer<typeof companySchema>;

export function toCreateCompanyPayload(values: CompanyFormValues) {
  return {
    personType: values.personType,
    document:
      values.personType === "PF"
        ? normalizeCpf(values.document)
        : normalizeCnpj(values.document),
    name: values.name.trim(),
    legalName: values.legalName?.trim() || null,
    businessEmail: values.businessEmail.trim(),
    phone: values.phone.replace(/\D/g, ""),
    whatsapp: values.whatsapp?.replace(/\D/g, "") || null,
    postalCode: normalizePostalCode(values.postalCode),
    street: values.street.trim(),
    number: values.number.trim(),
    complement: values.complement?.trim() || null,
    neighborhood: values.neighborhood.trim(),
    city: values.city.trim(),
    state: values.state,
    logoUrl: values.logoUrl || null,
    logoPublicId: values.logoPublicId || null,
  };
}
