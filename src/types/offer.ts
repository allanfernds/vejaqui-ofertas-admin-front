import type { Category } from "@/types/category";
import type { ProductImage } from "@/types/upload";

export type OfferStatus = "ACTIVE" | "PAUSED";
export type UiOfferStatus = "ACTIVE" | "PAUSED" | "ENDED";
export type OfferListStatusFilter = "ALL" | UiOfferStatus;

export interface Product {
  id: string;
  companyId: string;
  categoryId: string;
  title: string;
  slug: string;
  description: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  category: Pick<Category, "id" | "name" | "slug">;
  images: ProductImage[];
}

export interface Offer {
  id: string;
  productId: string;
  slug: string;
  originalPrice: string | number;
  promotionalPrice: string | number;
  saleUrl: string;
  installments: number | null;
  deliveryAvailable: boolean;
  freeShipping: boolean;
  shippingPrice: string | number | null;
  deliveryInformation: string | null;
  city: string;
  state: string;
  status: OfferStatus;
  startsAt: string;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
  product: Product;
}

export interface ProductOfferInput {
  title: string;
  description: string;
  categoryId: string;
  images: Array<{
    url: string;
    publicId: string;
    altText?: string | null;
    position?: number;
    isPrimary?: boolean;
  }>;
  originalPrice: number;
  promotionalPrice: number;
  saleUrl: string;
  installments?: number | null;
  deliveryAvailable?: boolean;
  freeShipping?: boolean;
  shippingPrice?: number | null;
  deliveryInformation?: string | null;
  city?: string;
  state?: string;
  startsAt?: string;
  expiresAt: string;
}

export type UpdateProductOfferInput = Partial<ProductOfferInput>;

export interface ListOffersQuery {
  search?: string;
  status?: UiOfferStatus;
  page?: number;
  limit?: number;
}

export interface ChangeOfferStatusInput {
  status: OfferStatus;
}
