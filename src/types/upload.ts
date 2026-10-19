export interface CloudinarySignature {
  signature: string;
  timestamp: number;
  apiKey: string;
  cloudName?: string;
  folder?: string;
}

export interface UploadedAsset {
  url: string;
  publicId: string;
  width: number;
  height: number;
}

export interface ProductImageInput {
  url: string;
  publicId: string;
  altText?: string | null;
  position?: number;
  isPrimary?: boolean;
}

export interface ProductImage {
  id: string;
  productId: string;
  url: string;
  publicId: string;
  altText: string | null;
  position: number;
  isPrimary: boolean;
  createdAt: string;
}
