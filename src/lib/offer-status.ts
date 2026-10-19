import { isExpired } from "@/lib/date";
import type { Offer, UiOfferStatus } from "@/types/offer";

export function getUiOfferStatus(offer: Pick<Offer, "status" | "expiresAt">): UiOfferStatus {
  if (isExpired(offer.expiresAt)) {
    return "ENDED";
  }
  return offer.status;
}

export function getOfferStatusLabel(status: UiOfferStatus): string {
  switch (status) {
    case "ACTIVE":
      return "Ativa";
    case "PAUSED":
      return "Pausada";
    case "ENDED":
      return "Encerrada";
  }
}
