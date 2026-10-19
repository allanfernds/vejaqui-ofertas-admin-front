"use client";

import { GripVertical, Star, Trash2, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { MAX_IMAGE_SIZE_BYTES, uploadService } from "@/services/upload.service";
import type { UploadedAsset } from "@/types/upload";

export interface OfferImageValue {
  url: string;
  publicId: string;
  altText?: string | null;
  position?: number;
  isPrimary?: boolean;
}

interface ImageUploaderProps {
  images: OfferImageValue[];
  onChange: (images: OfferImageValue[]) => void;
  maxImages?: number;
  disabled?: boolean;
  optionalHint?: string;
}

const ACCEPT = "image/jpeg,image/png,image/webp";

export function ImageUploader({
  images,
  onChange,
  maxImages = 10,
  disabled,
  optionalHint,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  async function uploadFiles(files: FileList | File[]) {
    const remaining = maxImages - images.length;
    const selected = Array.from(files).slice(0, remaining);

    if (selected.length === 0) {
      toast.error(`Você pode enviar até ${maxImages} imagens.`);
      return;
    }

    setIsUploading(true);
    try {
      const uploaded: UploadedAsset[] = [];
      for (const file of selected) {
        uploaded.push(await uploadService.upload(file));
      }

      const next = [
        ...images,
        ...uploaded.map((asset, index) => ({
          url: asset.url,
          publicId: asset.publicId,
          isPrimary: images.length === 0 && index === 0,
          position: images.length + index,
        })),
      ];
      onChange(next);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não conseguimos enviar a imagem.");
    } finally {
      setIsUploading(false);
    }
  }

  function setPrimary(publicId: string) {
    onChange(
      images.map((image, index) => ({
        ...image,
        isPrimary: image.publicId === publicId,
        position: index,
      })),
    );
  }

  function removeImage(publicId: string) {
    const next = images.filter((image) => image.publicId !== publicId);
    if (next.length > 0 && !next.some((image) => image.isPrimary)) {
      next[0] = { ...next[0], isPrimary: true };
    }
    onChange(next.map((image, index) => ({ ...image, position: index })));
  }

  function moveImage(from: number, to: number) {
    if (to < 0 || to >= images.length) {
      return;
    }
    const next = [...images];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onChange(next.map((image, index) => ({ ...image, position: index })));
  }

  return (
    <div className="space-y-3">
      <div
        className={`rounded-2xl border border-dashed p-6 text-center transition-colors ${
          isDragging ? "border-primary bg-primary/5" : "border-border bg-muted/30"
        }`}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          if (!disabled && event.dataTransfer.files.length > 0) {
            void uploadFiles(event.dataTransfer.files);
          }
        }}
      >
        <Upload className="mx-auto mb-3 size-6 text-muted-foreground" aria-hidden />
        <p className="text-sm font-medium">Arraste as imagens ou selecione do aparelho</p>
        <p className="mt-1 text-xs text-muted-foreground">
          JPEG, PNG ou WEBP. Até 5 MB cada. Máximo de {maxImages} imagens.
        </p>
        {optionalHint ? <p className="mt-2 text-sm text-muted-foreground">{optionalHint}</p> : null}
        <Button
          type="button"
          variant="outline"
          className="mt-4 h-10"
          disabled={disabled || isUploading || images.length >= maxImages}
          onClick={() => inputRef.current?.click()}
        >
          {isUploading ? "Enviando..." : "Selecionar imagens"}
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT}
          multiple={maxImages > 1}
          className="sr-only"
          onChange={(event) => {
            if (event.target.files) {
              void uploadFiles(event.target.files);
              event.target.value = "";
            }
          }}
        />
      </div>

      {images.length > 0 ? (
        <ul className="grid gap-3 sm:grid-cols-2">
          {images.map((image, index) => (
            <li key={image.publicId} className="overflow-hidden rounded-xl border bg-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image.url} alt="" className="h-36 w-full object-cover" />
              <div className="flex flex-wrap items-center gap-2 p-3">
                <Button
                  type="button"
                  size="sm"
                  variant={image.isPrimary ? "default" : "outline"}
                  onClick={() => setPrimary(image.publicId)}
                >
                  <Star className="size-3.5" aria-hidden />
                  {image.isPrimary ? "Principal" : "Tornar principal"}
                </Button>
                {maxImages > 1 ? (
                  <>
                    <Button
                      type="button"
                      size="icon-sm"
                      variant="outline"
                      aria-label="Mover para cima"
                      disabled={index === 0}
                      onClick={() => moveImage(index, index - 1)}
                    >
                      <GripVertical className="size-3.5" />
                    </Button>
                    <Button
                      type="button"
                      size="icon-sm"
                      variant="outline"
                      aria-label="Mover para baixo"
                      disabled={index === images.length - 1}
                      onClick={() => moveImage(index, index + 1)}
                    >
                      <GripVertical className="size-3.5 rotate-90" />
                    </Button>
                  </>
                ) : null}
                <Button
                  type="button"
                  size="icon-sm"
                  variant="destructive"
                  aria-label="Remover imagem"
                  onClick={() => removeImage(image.publicId)}
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      ) : null}
      <p className="sr-only">Tamanho máximo permitido: {MAX_IMAGE_SIZE_BYTES / (1024 * 1024)} MB</p>
    </div>
  );
}
