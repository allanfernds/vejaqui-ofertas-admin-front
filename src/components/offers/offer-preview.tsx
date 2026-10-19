import { formatCurrency, formatDiscountPercent } from "@/lib/currency";

interface OfferPreviewProps {
  title: string;
  companyName: string;
  originalPrice: number;
  promotionalPrice: number;
  city: string;
  state: string;
  imageUrl?: string;
}

export function OfferPreview({
  title,
  companyName,
  originalPrice,
  promotionalPrice,
  city,
  state,
  imageUrl,
}: OfferPreviewProps) {
  const discount = formatDiscountPercent(originalPrice, promotionalPrice);

  return (
    <aside className="rounded-2xl border bg-card p-4 shadow-sm">
      <p className="mb-3 text-sm font-medium text-muted-foreground">Prévia da oferta</p>
      <div className="overflow-hidden rounded-xl border">
        <div className="aspect-[4/3] bg-muted">
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imageUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              A imagem aparece aqui
            </div>
          )}
        </div>
        <div className="space-y-2 p-4">
          <h3 className="font-semibold">{title || "Nome do produto"}</h3>
          <p className="text-sm text-muted-foreground">{companyName}</p>
          <div>
            <p className="text-sm text-muted-foreground line-through">
              De {formatCurrency(originalPrice)}
            </p>
            <p className="text-lg font-semibold text-primary">Por {formatCurrency(promotionalPrice)}</p>
            {discount ? (
              <p className="text-sm font-medium text-emerald-700">{discount}% de desconto</p>
            ) : null}
          </div>
          <p className="text-sm text-muted-foreground">
            {city || "Cidade"} - {state || "UF"}
          </p>
          <div className="rounded-lg bg-primary px-3 py-2 text-center text-sm font-medium text-primary-foreground">
            Ver oferta
          </div>
        </div>
      </div>
    </aside>
  );
}
