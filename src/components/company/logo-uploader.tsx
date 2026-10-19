"use client";

import { Upload } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { uploadService } from "@/services/upload.service";

export interface CompanyLogoValue {
  url: string;
  publicId: string;
}

interface LogoUploaderProps {
  logo: CompanyLogoValue | null;
  onChange: (logo: CompanyLogoValue | null) => void;
  disabled?: boolean;
}

const ACCEPT = "image/jpeg,image/png,image/webp";

export function LogoUploader({ logo, onChange, disabled }: LogoUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  async function uploadFile(file: File | undefined) {
    if (!file) {
      return;
    }

    setIsUploading(true);
    try {
      const uploaded = await uploadService.upload(file);
      onChange({ url: uploaded.url, publicId: uploaded.publicId });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não conseguimos enviar a logo.");
    } finally {
      setIsUploading(false);
    }
  }

  function openFilePicker() {
    inputRef.current?.click();
  }

  return (
    <div className="space-y-4">
      {logo ? (
        <div className="flex flex-col items-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logo.url}
            alt="Prévia da logo"
            className="size-32 rounded-2xl border bg-muted object-cover"
          />
          <div className="flex flex-wrap justify-center gap-2">
            <Button
              type="button"
              variant="outline"
              className="h-10"
              disabled={disabled || isUploading}
              onClick={openFilePicker}
            >
              {isUploading ? "Enviando..." : "Trocar imagem"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-10"
              disabled={disabled || isUploading}
              onClick={() => onChange(null)}
            >
              Remover
            </Button>
          </div>
        </div>
      ) : (
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
            if (!disabled) {
              void uploadFile(event.dataTransfer.files[0]);
            }
          }}
        >
          <Upload className="mx-auto mb-3 size-6 text-muted-foreground" aria-hidden />
          <p className="text-sm font-medium">Arraste a logo ou selecione do aparelho</p>
          <p className="mt-1 text-xs text-muted-foreground">JPEG, PNG ou WEBP. Até 5 MB.</p>
          <Button
            type="button"
            variant="outline"
            className="mt-4 h-10"
            disabled={disabled || isUploading}
            onClick={openFilePicker}
          >
            {isUploading ? "Enviando..." : "Selecionar logo"}
          </Button>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        className="sr-only"
        onChange={(event) => {
          void uploadFile(event.target.files?.[0]);
          event.target.value = "";
        }}
      />
    </div>
  );
}
