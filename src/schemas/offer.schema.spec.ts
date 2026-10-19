import { describe, expect, it } from "vitest";

import { offerSchema, toProductOfferPayload } from "@/schemas/offer.schema";

const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16);
const now = new Date().toISOString().slice(0, 16);

const validOffer = {
  title: "Smartphone Galaxy A55",
  categoryId: "11111111-1111-1111-1111-111111111111",
  description: "Aparelho em promoção.",
  images: [{ url: "https://res.cloudinary.com/demo/image.jpg", publicId: "demo/image", isPrimary: true }],
  originalPrice: 2499.9,
  promotionalPrice: 1999.9,
  installments: 10,
  saleUrl: "https://loja.exemplo.com/produto",
  deliveryAvailable: true,
  freeShipping: false,
  shippingPrice: 20,
  deliveryInformation: "Entregamos em Feira de Santana e região.",
  useCompanyLocation: true,
  city: "Feira de Santana",
  state: "BA",
  startsAt: now,
  expiresAt: tomorrow,
};

describe("offerSchema", () => {
  it("requires a title", () => {
    const result = offerSchema.safeParse({ ...validOffer, title: "" });
    expect(result.success).toBe(false);
  });

  it("requires a category", () => {
    const result = offerSchema.safeParse({ ...validOffer, categoryId: "" });
    expect(result.success).toBe(false);
  });

  it("requires at least one image", () => {
    const result = offerSchema.safeParse({ ...validOffer, images: [] });
    expect(result.success).toBe(false);
  });

  it("requires a valid price", () => {
    const result = offerSchema.safeParse({ ...validOffer, originalPrice: 0 });
    expect(result.success).toBe(false);
  });

  it("requires the offer price to be lower than the original", () => {
    const result = offerSchema.safeParse({
      ...validOffer,
      promotionalPrice: 3000,
    });
    expect(result.success).toBe(false);
  });

  it("requires shipping price when delivery is paid", () => {
    const result = offerSchema.safeParse({
      ...validOffer,
      deliveryAvailable: true,
      freeShipping: false,
      shippingPrice: null,
    });
    expect(result.success).toBe(false);
  });

  it("hides shipping validation when there is no delivery", () => {
    const result = offerSchema.safeParse({
      ...validOffer,
      deliveryAvailable: false,
      shippingPrice: null,
    });
    expect(result.success).toBe(true);
  });

  it("requires city and state", () => {
    const result = offerSchema.safeParse({ ...validOffer, city: "", state: "" });
    expect(result.success).toBe(false);
  });

  it("requires an expiration date after the start", () => {
    const result = offerSchema.safeParse({
      ...validOffer,
      startsAt: tomorrow,
      expiresAt: now,
    });
    expect(result.success).toBe(false);
  });

  it("accepts a complete valid offer", () => {
    const result = offerSchema.safeParse(validOffer);
    expect(result.success).toBe(true);
    if (result.success) {
      const payload = toProductOfferPayload(result.data);
      expect(payload.images[0]?.publicId).toBe("demo/image");
      expect(payload.promotionalPrice).toBe(1999.9);
    }
  });
});
