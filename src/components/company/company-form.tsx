"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";

import { LogoUploader } from "@/components/company/logo-uploader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatPhone, formatPostalCode } from "@/lib/masks";
import { BRAZILIAN_STATES } from "@/lib/states";
import { companySchema, type CompanyFormValues } from "@/schemas/company.schema";
import { formatCnpj, formatCpf } from "@/utils/cpf-cnpj";

const CREATE_STEPS = ["Sua empresa", "Informações de contato", "Localização", "Identidade visual"] as const;
const EDIT_STEPS = ["Sua empresa", "Informações de contato", "Localização"] as const;

interface CompanyFormProps {
  mode: "create" | "edit";
  defaultValues?: Partial<CompanyFormValues>;
  onSubmit: (values: CompanyFormValues) => Promise<void>;
  submitLabel: string;
  submittingLabel: string;
  onCancel?: () => void;
}

export function CompanyForm({
  mode,
  defaultValues,
  onSubmit,
  submitLabel,
  submittingLabel,
  onCancel,
}: CompanyFormProps) {
  const [step, setStep] = useState(0);
  const steps = mode === "edit" ? EDIT_STEPS : CREATE_STEPS;
  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      personType: "PJ",
      document: "",
      name: "",
      legalName: "",
      businessEmail: "",
      phone: "",
      whatsapp: "",
      postalCode: "",
      street: "",
      number: "",
      complement: "",
      neighborhood: "",
      city: "",
      state: "BA",
      logoUrl: "",
      logoPublicId: "",
      ...defaultValues,
    },
  });

  const personType = useWatch({ control: form.control, name: "personType" });
  const selectedState = useWatch({ control: form.control, name: "state" });
  const logoUrl = useWatch({ control: form.control, name: "logoUrl" });
  const logoPublicId = useWatch({ control: form.control, name: "logoPublicId" });
  const stepFields: Array<Array<keyof CompanyFormValues>> = [
    ["personType", "name", "legalName", "document"],
    ["businessEmail", "phone", "whatsapp"],
    ["postalCode", "street", "number", "complement", "neighborhood", "city", "state"],
    [],
  ];

  async function handleNext() {
    const valid = await form.trigger(stepFields[step]);
    if (valid) {
      setStep((current) => Math.min(current + 1, steps.length - 1));
    }
  }

  return (
    <form
      className="space-y-6"
      onSubmit={form.handleSubmit(onSubmit)}
      noValidate
    >
      <div>
        <p className="text-sm font-medium text-primary">
          {step + 1} de {steps.length}
        </p>
        <h2 className="mt-1 text-xl font-semibold">{steps[step]}</h2>
      </div>

      {step === 0 ? (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="personType">Tipo</Label>
            <Select
              value={personType}
              onValueChange={(value) => {
                if (value === "PF" || value === "PJ") {
                  form.setValue("personType", value);
                }
              }}
              disabled={mode === "edit"}
            >
              <SelectTrigger id="personType" className="h-11 w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PF">Pessoa Física</SelectItem>
                <SelectItem value="PJ">Pessoa Jurídica</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">{personType === "PJ" ? "Nome fantasia" : "Nome"}</Label>
            <Input id="name" className="h-11" {...form.register("name")} />
            {form.formState.errors.name ? (
              <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
            ) : null}
          </div>
          {personType === "PJ" ? (
            <div className="space-y-2">
              <Label htmlFor="legalName">Razão social (opcional)</Label>
              <Input id="legalName" className="h-11" {...form.register("legalName")} />
            </div>
          ) : null}
          <div className="space-y-2">
            <Label htmlFor="document">{personType === "PF" ? "CPF" : "CNPJ"}</Label>
            <Input
              id="document"
              type="text"
              inputMode={personType === "PF" ? "numeric" : "text"}
              className="h-11"
              disabled={mode === "edit"}
              {...form.register("document", {
                onChange: (event) => {
                  const value =
                    personType === "PF"
                      ? formatCpf(event.target.value)
                      : formatCnpj(event.target.value);
                  form.setValue("document", value);
                },
              })}
            />
            {form.formState.errors.document ? (
              <p className="text-sm text-destructive">{form.formState.errors.document.message}</p>
            ) : null}
          </div>
        </div>
      ) : null}

      {step === 1 ? (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="businessEmail">E-mail comercial</Label>
            <Input id="businessEmail" type="email" className="h-11" {...form.register("businessEmail")} />
            {form.formState.errors.businessEmail ? (
              <p className="text-sm text-destructive">{form.formState.errors.businessEmail.message}</p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Telefone</Label>
            <Input
              id="phone"
              type="tel"
              className="h-11"
              {...form.register("phone", {
                onChange: (event) => form.setValue("phone", formatPhone(event.target.value)),
              })}
            />
            {form.formState.errors.phone ? (
              <p className="text-sm text-destructive">{form.formState.errors.phone.message}</p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="whatsapp">WhatsApp (se for diferente do telefone)</Label>
            <Input
              id="whatsapp"
              type="tel"
              className="h-11"
              {...form.register("whatsapp", {
                onChange: (event) => form.setValue("whatsapp", formatPhone(event.target.value)),
              })}
            />
          </div>
        </div>
      ) : null}

      {step === 2 ? (
        <div className="space-y-4">
          <p className="rounded-xl bg-accent px-4 py-3 text-sm">
            Usaremos sua cidade para ajudar a divulgar suas ofertas para pessoas da sua região.
          </p>
          <div className="space-y-2">
            <Label htmlFor="postalCode">CEP</Label>
            <Input
              id="postalCode"
              className="h-11"
              {...form.register("postalCode", {
                onChange: (event) => form.setValue("postalCode", formatPostalCode(event.target.value)),
              })}
            />
            {form.formState.errors.postalCode ? (
              <p className="text-sm text-destructive">{form.formState.errors.postalCode.message}</p>
            ) : null}
          </div>
          <div className="grid gap-4 sm:grid-cols-[1fr_8rem]">
            <div className="space-y-2">
              <Label htmlFor="street">Rua</Label>
              <Input id="street" className="h-11" {...form.register("street")} />
              {form.formState.errors.street ? (
                <p className="text-sm text-destructive">{form.formState.errors.street.message}</p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="number">Número</Label>
              <Input id="number" className="h-11" {...form.register("number")} />
              {form.formState.errors.number ? (
                <p className="text-sm text-destructive">{form.formState.errors.number.message}</p>
              ) : null}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="complement">Complemento (opcional)</Label>
            <Input id="complement" className="h-11" {...form.register("complement")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="neighborhood">Bairro</Label>
            <Input id="neighborhood" className="h-11" {...form.register("neighborhood")} />
            {form.formState.errors.neighborhood ? (
              <p className="text-sm text-destructive">{form.formState.errors.neighborhood.message}</p>
            ) : null}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="city">Cidade</Label>
              <Input id="city" className="h-11" {...form.register("city")} />
              {form.formState.errors.city ? (
                <p className="text-sm text-destructive">{form.formState.errors.city.message}</p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">Estado</Label>
              <Select
                value={selectedState}
                onValueChange={(value) => {
                  if (value) {
                    form.setValue("state", value);
                  }
                }}
              >
                <SelectTrigger id="state" className="h-11 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {BRAZILIAN_STATES.map((state) => (
                    <SelectItem key={state.value} value={state.value}>
                      {state.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.state ? (
                <p className="text-sm text-destructive">{form.formState.errors.state.message}</p>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}

      {mode === "create" && step === 3 ? (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">Você pode continuar sem uma logo.</p>
          <p className="text-sm text-muted-foreground">
            Adicionar uma logo ajuda seus clientes a reconhecer sua loja e transmite mais confiança.
          </p>
          <LogoUploader
            logo={logoUrl && logoPublicId ? { url: logoUrl, publicId: logoPublicId } : null}
            onChange={(logo) => {
              form.setValue("logoUrl", logo?.url ?? "");
              form.setValue("logoPublicId", logo?.publicId ?? "");
            }}
          />
        </div>
      ) : null}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        {step > 0 ? (
          <Button type="button" variant="outline" className="h-11" onClick={() => setStep(step - 1)}>
            Voltar
          </Button>
        ) : onCancel ? (
          <Button type="button" variant="outline" className="h-11" onClick={onCancel}>
            Cancelar
          </Button>
        ) : (
          <span />
        )}
        {step < steps.length - 1 ? (
          <Button type="button" className="h-11" onClick={() => void handleNext()}>
            Continuar
          </Button>
        ) : (
          <Button type="submit" className="h-11" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? submittingLabel : submitLabel}
          </Button>
        )}
      </div>
    </form>
  );
}
