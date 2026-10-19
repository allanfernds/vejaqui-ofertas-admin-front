import { LEGAL_REVIEW_NOTICE } from "@/lib/legal";

export function LegalDraftBanner() {
  return (
    <div
      role="note"
      className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-950"
    >
      {LEGAL_REVIEW_NOTICE}
    </div>
  );
}
