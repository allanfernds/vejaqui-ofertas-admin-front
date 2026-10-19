import { api } from "@/lib/api";
import { env } from "@/lib/env";
import type { ApiResponse } from "@/types/api";
import type { CloudinarySignature, UploadedAsset } from "@/types/upload";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

export function assertImageFile(file: File): void {
  if (!ALLOWED_TYPES.includes(file.type as (typeof ALLOWED_TYPES)[number])) {
    throw new Error("Use uma imagem JPEG, PNG ou WEBP.");
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    throw new Error("A imagem precisa ter no máximo 5 MB.");
  }
}

async function requestSignature(): Promise<CloudinarySignature> {
  const response = await api.post<ApiResponse<CloudinarySignature>>(
    "/uploads/cloudinary/signature",
    {},
  );
  return response.data;
}

export const uploadService = {
  async upload(file: File): Promise<UploadedAsset> {
    assertImageFile(file);

    const signature = await requestSignature();
    const cloudName = signature.cloudName || env.cloudinaryCloudName;
    const apiKey = signature.apiKey || env.cloudinaryApiKey;

    if (!cloudName || !apiKey) {
      throw new Error("O envio de imagens ainda não está configurado.");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", apiKey);
    formData.append("timestamp", String(signature.timestamp));
    formData.append("signature", signature.signature);

    if (signature.folder) {
      formData.append("folder", signature.folder);
    }

    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Não conseguimos enviar a imagem. Tente novamente.");
    }

    const payload = (await response.json()) as {
      secure_url?: string;
      url?: string;
      public_id?: string;
      width?: number;
      height?: number;
    };

    const url = payload.secure_url ?? payload.url;
    if (!url || !payload.public_id) {
      throw new Error("Não conseguimos enviar a imagem. Tente novamente.");
    }

    return {
      url,
      publicId: payload.public_id,
      width: payload.width ?? 0,
      height: payload.height ?? 0,
    };
  },
};
