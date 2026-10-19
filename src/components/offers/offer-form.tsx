"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { ImageUploader } from "@/components/offers/image-uploader";
import { OfferPreview } from "@/components/offers/offer-preview";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrencyInput, parseCurrencyInput } from "@/lib/currency";
import { toDateTimeLocalValue } from "@/lib/date";
import { BRAZILIAN_STATES } from "@/lib/states";
import { offerSchema, type OfferFormValues } from "@/schemas/offer.schema";
import type { Category } from "@/types/category";

interface OfferFormProps {
  categories: Category[];
  companyName: string;
  companyCity: string;
  companyState: string;
  defaultValues?: Partial<OfferFormValues>;
  onSubmit: (values: OfferFormValues) => Promise<void>;
  submitLabel: string;
  submittingLabel: string;
}

function defaultExpiresAt(): string {
  const date = new Date();
  date.setDate(date.getDate() + 7);
  return toDateTimeLocalValue(date);
}

export function OfferForm({
  categories,
  companyName,
  companyCity,
  companyState,
  defaultValues,
  onSubmit,
  submitLabel,
  submittingLabel,
}: OfferFormProps) {
  const form = useForm<OfferFormValues>({
    resolver: zodResolver(offerSchema),
    defaultValues: {
      title: "",
      categoryId: "",
      description: "",
      images: [],
      originalPrice: 0,
      promotionalPrice: 0,
      installments: null,
      saleUrl: "",
      deliveryAvailable: false,
      freeShipping: false,
      shippingPrice: null,
      deliveryInformation: "",
      useCompanyLocation: true,
      city: companyCity,
      state: companyState,
      startsAt: toDateTimeLocalValue(new Date()),
      expiresAt: defaultExpiresAt(),
      ...defaultValues,
    },
  });

  const values = form.watch();

  useEffect(() => {
    if (values.useCompanyLocation) {
      form.setValue("city", companyCity);
      form.setValue("state", companyState);
    }
  }, [companyCity, companyState, form, values.useCompanyLocation]);

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <section className="space-y-4 rounded-2xl border bg-card p-5 shadow-sm">
          <h2 className="text-lg font-semibold">Produto</h2>
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input id="title" className="h-11" {...form.register("title")} />
            {form.formState.errors.title ? (
              <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="categoryId">Categoria</Label>
            <Select
              value={values.categoryId}
              onValueChange={(value) => {
                if (value) {
                  form.setValue("categoryId", value, { shouldValidate: true });
                }
              }}
            >
              <SelectTrigger id="categoryId" className="h-11 w-full">
                <SelectValue placeholder="Escolha uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.categoryId ? (
              <p className="text-sm text-destructive">{form.formState.errors.categoryId.message}</p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea id="description" rows={5} {...form.register("description")} />
            {form.formState.errors.description ? (
              <p className="text-sm text-destructive">{form.formState.errors.description.message}</p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label>Imagens</Label>
            <ImageUploader
              images={values.images}
              onChange={(images) => form.setValue("images", images, { shouldValidate: true })}
            />
            {form.formState.errors.images ? (
              <p className="text-sm text-destructive">{form.formState.errors.images.message}</p>
            ) : null}
          </div>
        </section>

        <section className="space-y-4 rounded-2xl border bg-card p-5 shadow-sm">
          <h2 className="text-lg font-semibold">Preço</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="originalPrice">Preço original</Label>
              <Input
                id="originalPrice"
                inputMode="numeric"
                className="h-11"
                value={formatCurrencyInput(values.originalPrice)}
                onChange={(event) =>
                  form.setValue("originalPrice", parseCurrencyInput(event.target.value), {
                    shouldValidate: true,
                  })
                }
              />
              {form.formState.errors.originalPrice ? (
                <p className="text-sm text-destructive">
                  {form.formState.errors.originalPrice.message}
                </p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="promotionalPrice">Preço da oferta</Label>
              <Input
                id="promotionalPrice"
                inputMode="numeric"
                className="h-11"
                value={formatCurrencyInput(values.promotionalPrice)}
                onChange={(event) =>
                  form.setValue("promotionalPrice", parseCurrencyInput(event.target.value), {
                    shouldValidate: true,
                  })
                }
              />
              {form.formState.errors.promotionalPrice ? (
                <p className="text-sm text-destructive">
                  {form.formState.errors.promotionalPrice.message}
                </p>
              ) : null}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="installments">Parcelas (opcional)</Label>
            <Input
              id="installments"
              type="number"
              min={1}
              max={48}
              className="h-11"
              value={values.installments ?? ""}
              onChange={(event) =>
                form.setValue(
                  "installments",
                  event.target.value ? Number(event.target.value) : null,
                )
              }
            />
          </div>
        </section>

        <section className="space-y-4 rounded-2xl border bg-card p-5 shadow-sm">
          <h2 className="text-lg font-semibold">Onde comprar</h2>
          <div className="space-y-2">
            <Label htmlFor="saleUrl">Link para comprar</Label>
            <Input id="saleUrl" type="url" className="h-11" {...form.register("saleUrl")} />
            <p className="text-sm text-muted-foreground">
              Informe o link onde o cliente poderá comprar ou ver o produto.
            </p>
            {form.formState.errors.saleUrl ? (
              <p className="text-sm text-destructive">{form.formState.errors.saleUrl.message}</p>
            ) : null}
          </div>
        </section>

        <section className="space-y-4 rounded-2xl border bg-card p-5 shadow-sm">
          <h2 className="text-lg font-semibold">Entrega</h2>
          <fieldset className="space-y-3">
            <legend className="text-sm font-medium">Você faz entrega deste produto?</legend>
            <div className="flex gap-3">
              <Button
                type="button"
                variant={values.deliveryAvailable ? "default" : "outline"}
                onClick={() => form.setValue("deliveryAvailable", true)}
              >
                Sim
              </Button>
              <Button
                type="button"
                variant={!values.deliveryAvailable ? "default" : "outline"}
                onClick={() => form.setValue("deliveryAvailable", false)}
              >
                Não
              </Button>
            </div>
          </fieldset>
          {values.deliveryAvailable ? (
            <>
              <fieldset className="space-y-3">
                <legend className="text-sm font-medium">O frete é grátis?</legend>
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant={values.freeShipping ? "default" : "outline"}
                    onClick={() => form.setValue("freeShipping", true)}
                  >
                    Sim
                  </Button>
                  <Button
                    type="button"
                    variant={!values.freeShipping ? "default" : "outline"}
                    onClick={() => form.setValue("freeShipping", false)}
                  >
                    Não
                  </Button>
                </div>
              </fieldset>
              {!values.freeShipping ? (
                <div className="space-y-2">
                  <Label htmlFor="shippingPrice">Valor do frete</Label>
                  <Input
                    id="shippingPrice"
                    inputMode="numeric"
                    className="h-11"
                    value={formatCurrencyInput(values.shippingPrice ?? 0)}
                    onChange={(event) =>
                      form.setValue("shippingPrice", parseCurrencyInput(event.target.value), {
                        shouldValidate: true,
                      })
                    }
                  />
                  {form.formState.errors.shippingPrice ? (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.shippingPrice.message}
                    </p>
                  ) : null}
                </div>
              ) : null}
              <div className="space-y-2">
                <Label htmlFor="deliveryInformation">Informações sobre a entrega</Label>
                <Textarea
                  id="deliveryInformation"
                  placeholder="Entregamos em Feira de Santana e região."
                  {...form.register("deliveryInformation")}
                />
              </div>
            </>
          ) : null}
        </section>

        <section className="space-y-4 rounded-2xl border bg-card p-5 shadow-sm">
          <h2 className="text-lg font-semibold">Região da oferta</h2>
          <p className="text-sm text-muted-foreground">
            Essa informação nos ajuda a mostrar sua oferta para pessoas e grupos da região certa.
          </p>
          <div className="flex items-start gap-3">
            <Checkbox
              id="useCompanyLocation"
              checked={values.useCompanyLocation}
              onCheckedChange={(checked) => form.setValue("useCompanyLocation", checked === true)}
            />
            <Label htmlFor="useCompanyLocation" className="font-normal">
              Usar localização da minha empresa
            </Label>
          </div>
          {!values.useCompanyLocation ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="city">Cidade</Label>
                <Input id="city" className="h-11" {...form.register("city")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">Estado</Label>
                <Select
                  value={values.state}
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
              </div>
            </div>
          ) : null}
        </section>

        <section className="space-y-4 rounded-2xl border bg-card p-5 shadow-sm">
          <h2 className="text-lg font-semibold">Validade</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="startsAt">Início da oferta</Label>
              <Input id="startsAt" type="datetime-local" className="h-11" {...form.register("startsAt")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expiresAt">Fim da oferta</Label>
              <Input id="expiresAt" type="datetime-local" className="h-11" {...form.register("expiresAt")} />
              <p className="text-sm text-muted-foreground">
                Depois desta data a oferta deixa de aparecer automaticamente.
              </p>
              {form.formState.errors.expiresAt ? (
                <p className="text-sm text-destructive">{form.formState.errors.expiresAt.message}</p>
              ) : null}
            </div>
          </div>
        </section>

        <Button
          type="submit"
          className="h-12 w-full text-base sm:w-auto"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? submittingLabel : submitLabel}
        </Button>
      </form>

      <div className="lg:sticky lg:top-6 lg:self-start">
        <OfferPreview
          title={values.title}
          companyName={companyName}
          originalPrice={values.originalPrice}
          promotionalPrice={values.promotionalPrice}
          city={values.city}
          state={values.state}
          imageUrl={values.images.find((image) => image.isPrimary)?.url ?? values.images[0]?.url}
        />
      </div>
    </div>
  );
}
