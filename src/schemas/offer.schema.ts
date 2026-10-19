import { z } from "zod";

import { BRAZILIAN_STATES } from "@/lib/states";

const stateValues = BRAZILIAN_STATES.map((state) => state.value) as [string, ...string[]];

const offerImageSchema = z.object({
  url: z.string().min(1, "Informe uma imagem."),
  publicId: z.string().min(1, "Informe uma imagem."),
  altText: z.string().optional().nullable(),
  position: z.number().int().min(0).optional(),
  isPrimary: z.boolean().optional(),
});

export const offerSchema = z
  .object({
    title: z.string().trim().min(3, "Informe o nome do produto.").max(150),
    categoryId: z.string().min(1, "Escolha uma categoria."),
    description: z.string().trim().min(3, "Informe uma descrição.").max(5000),
    images: z.array(offerImageSchema).min(1, "Informe uma imagem."),
    originalPrice: z.number().gt(0, "Informe um preço válido."),
    promotionalPrice: z.number().gt(0, "Informe um preço válido."),
    installments: z.number().int().min(1).max(48).nullable().optional(),
    saleUrl: z.url("Informe um link válido para comprar."),
    deliveryAvailable: z.boolean(),
    freeShipping: z.boolean(),
    shippingPrice: z.number().min(0).nullable().optional(),
    deliveryInformation: z.string().trim().max(500).optional().or(z.literal("")),
    useCompanyLocation: z.boolean(),
    city: z.string().trim().min(2, "Informe a cidade."),
    state: z.enum(stateValues, { error: "Informe o estado." }),
    startsAt: z.string().min(1, "Informe quando a oferta começa."),
    expiresAt: z.string().min(1, "Informe quando esta oferta termina."),
  })
  .superRefine((values, context) => {
    if (values.promotionalPrice >= values.originalPrice) {
      context.addIssue({
        code: "custom",
        path: ["promotionalPrice"],
        message: "O preço da oferta precisa ser menor que o preço original.",
      });
    }

    if (values.deliveryAvailable && !values.freeShipping) {
      if (values.shippingPrice == null || values.shippingPrice < 0) {
        context.addIssue({
          code: "custom",
          path: ["shippingPrice"],
          message: "Informe o valor do frete.",
        });
      }
    }

    const startsAt = new Date(values.startsAt);
    const expiresAt = new Date(values.expiresAt);

    if (Number.isNaN(expiresAt.getTime())) {
      context.addIssue({
        code: "custom",
        path: ["expiresAt"],
        message: "Informe quando esta oferta termina.",
      });
      return;
    }

    if (!Number.isNaN(startsAt.getTime()) && expiresAt <= startsAt) {
      context.addIssue({
        code: "custom",
        path: ["expiresAt"],
        message: "O fim da oferta precisa ser depois do início.",
      });
    }
  });

export type OfferFormValues = z.infer<typeof offerSchema>;

export function toProductOfferPayload(values: OfferFormValues) {
  return {
    title: values.title.trim(),
    description: values.description.trim(),
    categoryId: values.categoryId,
    images: values.images.map((image, index) => ({
      url: image.url,
      publicId: image.publicId,
      altText: image.altText ?? values.title,
      position: image.position ?? index,
      isPrimary: image.isPrimary ?? index === 0,
    })),
    originalPrice: values.originalPrice,
    promotionalPrice: values.promotionalPrice,
    saleUrl: values.saleUrl.trim(),
    installments: values.installments ?? null,
    deliveryAvailable: values.deliveryAvailable,
    freeShipping: values.deliveryAvailable ? values.freeShipping : false,
    shippingPrice:
      values.deliveryAvailable && !values.freeShipping ? (values.shippingPrice ?? null) : null,
    deliveryInformation:
      values.deliveryAvailable && values.deliveryInformation
        ? values.deliveryInformation.trim()
        : null,
    city: values.city.trim(),
    state: values.state,
    startsAt: new Date(values.startsAt).toISOString(),
    expiresAt: new Date(values.expiresAt).toISOString(),
  };
}
