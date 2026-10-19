import { Badge } from "@/components/ui/badge";
import { getOfferStatusLabel } from "@/lib/offer-status";
import type { UiOfferStatus } from "@/types/offer";

export function OfferStatusBadge({ status }: { status: UiOfferStatus }) {
  const variant =
    status === "ACTIVE" ? "default" : status === "PAUSED" ? "secondary" : "outline";

  return <Badge variant={variant}>{getOfferStatusLabel(status)}</Badge>;
}
