import { z } from "zod";

import { PRIVACY_POLICY_VERSION, TERMS_VERSION } from "@/lib/legal";

export const signInSchema = z.object({
  email: z.email("Informe um e-mail válido."),
  password: z.string().min(1, "Informe sua senha."),
});

export const signUpSchema = z
  .object({
    name: z.string().trim().min(2, "Informe seu nome.").max(120),
    email: z.email("Informe um e-mail válido."),
    password: z
      .string()
      .min(8, "A senha precisa ter pelo menos 8 caracteres.")
      .max(72, "A senha pode ter no máximo 72 caracteres."),
    confirmPassword: z.string().min(1, "Confirme sua senha."),
    termsAccepted: z.boolean(),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "As senhas não coincidem.",
    path: ["confirmPassword"],
  })
  .refine((values) => values.termsAccepted, {
    message: "Você precisa aceitar os Termos de Uso e a Política de Privacidade.",
    path: ["termsAccepted"],
  });

export type SignInFormValues = z.infer<typeof signInSchema>;
export type SignUpFormValues = z.infer<typeof signUpSchema>;

export function toSignUpPayload(values: SignUpFormValues) {
  return {
    name: values.name,
    email: values.email,
    password: values.password,
    termsAccepted: true as const,
    termsVersion: TERMS_VERSION,
    privacyPolicyAccepted: true as const,
    privacyPolicyVersion: PRIVACY_POLICY_VERSION,
  };
}
