"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getErrorMessage } from "@/lib/api-error";
import { useAuth } from "@/providers/auth-provider";
import { signUpSchema, toSignUpPayload, type SignUpFormValues } from "@/schemas/auth.schema";

export function SignUpForm() {
  const router = useRouter();
  const { signUp } = useAuth();
  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      termsAccepted: false,
    },
  });

  async function onSubmit(values: SignUpFormValues) {
    try {
      await signUp(toSignUpPayload(values));
      toast.success("Conta criada com sucesso.");
      router.replace("/onboarding/empresa");
    } catch (error) {
      toast.error(getErrorMessage(error, "Não foi possível criar sua conta. Tente novamente."));
    }
  }

  return (
    <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <div className="space-y-2">
        <Label htmlFor="name">Seu nome</Label>
        <Input
          id="name"
          autoComplete="name"
          className="h-11"
          {...form.register("name")}
          aria-invalid={Boolean(form.formState.errors.name)}
        />
        {form.formState.errors.name ? (
          <p className="text-sm text-destructive" role="alert">
            {form.formState.errors.name.message}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          className="h-11"
          {...form.register("email")}
          aria-invalid={Boolean(form.formState.errors.email)}
        />
        {form.formState.errors.email ? (
          <p className="text-sm text-destructive" role="alert">
            {form.formState.errors.email.message}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Senha</Label>
        <Input
          id="password"
          type="password"
          autoComplete="new-password"
          className="h-11"
          {...form.register("password")}
          aria-invalid={Boolean(form.formState.errors.password)}
        />
        {form.formState.errors.password ? (
          <p className="text-sm text-destructive" role="alert">
            {form.formState.errors.password.message}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirme a senha</Label>
        <Input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          className="h-11"
          {...form.register("confirmPassword")}
          aria-invalid={Boolean(form.formState.errors.confirmPassword)}
        />
        {form.formState.errors.confirmPassword ? (
          <p className="text-sm text-destructive" role="alert">
            {form.formState.errors.confirmPassword.message}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <div className="flex items-start gap-3">
          <Checkbox
            id="termsAccepted"
            checked={useWatch({ control: form.control, name: "termsAccepted" })}
            onCheckedChange={(checked) => form.setValue("termsAccepted", checked === true, {
              shouldValidate: true,
            })}
            aria-invalid={Boolean(form.formState.errors.termsAccepted)}
          />
          <Label htmlFor="termsAccepted" className="text-sm leading-6 font-normal">
            Li e aceito os{" "}
            <Link href="/termos" className="font-medium text-primary underline-offset-4 hover:underline">
              Termos de Uso
            </Link>{" "}
            e declaro estar ciente da{" "}
            <Link href="/privacidade" className="font-medium text-primary underline-offset-4 hover:underline">
              Política de Privacidade
            </Link>
            .
          </Label>
        </div>
        {form.formState.errors.termsAccepted ? (
          <p className="text-sm text-destructive" role="alert">
            {form.formState.errors.termsAccepted.message}
          </p>
        ) : null}
      </div>

      <Button
        type="submit"
        className="h-11 w-full"
        disabled={form.formState.isSubmitting}
      >
        {form.formState.isSubmitting ? "Criando conta..." : "Criar conta"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Já tem uma conta?{" "}
        <Link href="/entrar" className="font-medium text-primary underline-offset-4 hover:underline">
          Entrar
        </Link>
      </p>
    </form>
  );
}
