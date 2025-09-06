type PurchaseItem = {
  amount?: number; // optional precomputed line total
  purchaseRate?: number; // unit price
  quantity?: number; // qty
  discount?: number; // per-item % discount
  vat?: number; // per-item % VAT
};

export function calculateInvoiceTotals(
  purchaseItems: PurchaseItem[],
  discountPercentage?: number, // overall %
  vatPercentage?: number // overall %
): {
  TotalAmount: number;
  TotalDiscount: number;
  TotalVat: number;
  NetPayable: number;
} {
  const toNum = (v: unknown) => (Number.isFinite(Number(v)) ? Number(v) : 0);

  let totalAmount = 0;

  // Discount accumulators
  let itemWiseDiscount = 0;
  let baseWithoutItemDiscount = 0;

  // VAT accumulators
  let itemWiseVAT = 0;
  let baseWithoutItemVAT = 0;

  for (const p of purchaseItems ?? []) {
    const qty = toNum(p?.quantity);
    const rate = toNum(p?.purchaseRate);
    const base = toNum(p?.amount ?? rate * qty);

    totalAmount += base;

    // Per-item vs overall Discount
    const dPct = toNum(p?.discount);
    if (dPct > 0) {
      itemWiseDiscount += (base * dPct) / 100;
    } else {
      baseWithoutItemDiscount += base;
    }

    // Per-item vs overall VAT
    const vPct = toNum(p?.vat);
    if (vPct > 0) {
      itemWiseVAT += (base * vPct) / 100;
    } else {
      baseWithoutItemVAT += base;
    }
  }

  const overallDiscPct = Math.max(0, toNum(discountPercentage));
  const overallVatPct = Math.max(0, toNum(vatPercentage));

  const overallDiscount = (baseWithoutItemDiscount * overallDiscPct) / 100;
  const overallVAT = (baseWithoutItemVAT * overallVatPct) / 100;

  const TotalDiscount = itemWiseDiscount + overallDiscount;
  const TotalVat = itemWiseVAT + overallVAT;

  const TotalAmount = totalAmount;
  const NetPayable = TotalAmount - TotalDiscount + TotalVat;

  // round to 2 decimals
  const round2 = (n: number) => Number(n.toFixed(2));

  return {
    TotalAmount: round2(TotalAmount),
    TotalDiscount: round2(TotalDiscount),
    TotalVat: round2(TotalVat),
    NetPayable: round2(NetPayable),
  };
}
