import Link from "next/link";

import { OfferStatusBadge } from "@/components/offers/offer-status-badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/currency";
import { formatDate } from "@/lib/date";
import { getUiOfferStatus } from "@/lib/offer-status";
import type { Offer } from "@/types/offer";

interface OfferCardProps {
  offer: Offer;
  onToggleStatus?: (offer: Offer) => void;
  isUpdating?: boolean;
}

export function OfferCard({ offer, onToggleStatus, isUpdating }: OfferCardProps) {
  const status = getUiOfferStatus(offer);
  const primaryImage =
    offer.product.images.find((image) => image.isPrimary) ?? offer.product.images[0];

  return (
    <article className="overflow-hidden rounded-2xl border bg-card shadow-sm">
      <div className="grid gap-4 sm:grid-cols-[10rem_1fr]">
        <div className="aspect-square bg-muted sm:aspect-auto sm:h-full">
          {primaryImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={primaryImage.url} alt="" className="h-full w-full object-cover" />
          ) : null}
        </div>
        <div className="space-y-3 p-4 sm:p-5">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h2 className="font-semibold">{offer.product.title}</h2>
              <p className="text-sm text-muted-foreground">
                {offer.city} - {offer.state}
              </p>
            </div>
            <OfferStatusBadge status={status} />
          </div>
          <div className="text-sm">
            <p className="text-muted-foreground line-through">{formatCurrency(offer.originalPrice)}</p>
            <p className="text-base font-semibold">{formatCurrency(offer.promotionalPrice)}</p>
            <p className="mt-1 text-muted-foreground">Válida até {formatDate(offer.expiresAt)}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button render={<Link href={`/ofertas/${offer.id}`} />} variant="outline" className="h-10">
              Editar
            </Button>
            {status !== "ENDED" && onToggleStatus ? (
              <Button
                type="button"
                variant="outline"
                className="h-10"
                disabled={isUpdating}
                onClick={() => onToggleStatus(offer)}
              >
                {isUpdating ? "Atualizando..." : offer.status === "ACTIVE" ? "Pausar" : "Ativar"}
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}
