"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { LogoUploader, type CompanyLogoValue } from "@/components/company/logo-uploader";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getErrorMessage } from "@/lib/api-error";
import { useUpdateCompany } from "@/hooks/use-companies";

interface CompanyLogoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  companyId: string;
  companyName: string;
  currentLogoUrl?: string | null;
  currentLogoPublicId?: string | null;
}

export function CompanyLogoDialog({
  open,
  onOpenChange,
  companyId,
  companyName,
  currentLogoUrl,
  currentLogoPublicId,
}: CompanyLogoDialogProps) {
  const updateCompany = useUpdateCompany(companyId);
  const [logo, setLogo] = useState<CompanyLogoValue | null>(null);
  const hasCurrentLogo = Boolean(currentLogoUrl && currentLogoPublicId);

  useEffect(() => {
    if (!open) {
      return;
    }

    setLogo(
      currentLogoUrl && currentLogoPublicId
        ? { url: currentLogoUrl, publicId: currentLogoPublicId }
        : null,
    );
  }, [currentLogoPublicId, currentLogoUrl, open]);

  async function handleSave() {
    try {
      await updateCompany.mutateAsync({
        logoUrl: logo?.url ?? null,
        logoPublicId: logo?.publicId ?? null,
      });
      toast.success(logo ? "Logo salva com sucesso." : "Logo removida.");
      onOpenChange(false);
    } catch (error) {
      toast.error(getErrorMessage(error, "Não conseguimos salvar a logo. Tente novamente."));
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" aria-describedby="company-logo-description">
        <DialogHeader>
          <DialogTitle>{hasCurrentLogo ? "Trocar logo" : "Adicionar logo"}</DialogTitle>
          <DialogDescription id="company-logo-description">
            Envie a logo da {companyName}. JPEG, PNG ou WEBP, até 5 MB.
          </DialogDescription>
        </DialogHeader>

        <LogoUploader logo={logo} onChange={setLogo} disabled={updateCompany.isPending} />

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            type="button"
            className="h-10"
            disabled={updateCompany.isPending || (!logo && !hasCurrentLogo)}
            onClick={() => void handleSave()}
          >
            {updateCompany.isPending ? "Salvando..." : "Salvar logo"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
