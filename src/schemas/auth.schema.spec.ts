import { describe, expect, it } from "vitest";

import { signUpSchema, toSignUpPayload } from "@/schemas/auth.schema";

const validSignUp = {
  name: "Ana Silva",
  email: "ana@loja.com",
  password: "senha-segura",
  confirmPassword: "senha-segura",
  termsAccepted: true,
};

describe("signUpSchema", () => {
  it("requires the terms checkbox", () => {
    const result = signUpSchema.safeParse({ ...validSignUp, termsAccepted: false });
    expect(result.success).toBe(false);
  });

  it("does not default termsAccepted to true", () => {
    const result = signUpSchema.safeParse({
      name: "Ana Silva",
      email: "ana@loja.com",
      password: "senha-segura",
      confirmPassword: "senha-segura",
    });
    expect(result.success).toBe(false);
  });

  it("sends versions and never sends acceptedAt", () => {
    const payload = toSignUpPayload(validSignUp);
    expect(payload.termsAccepted).toBe(true);
    expect(payload.privacyPolicyAccepted).toBe(true);
    expect(payload.termsVersion).toBe("1.0");
    expect(payload.privacyPolicyVersion).toBe("1.0");
    expect(payload).not.toHaveProperty("acceptedAt");
  });
});
