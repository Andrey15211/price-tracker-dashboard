import type { ProductStatus } from "@/types/product";

export function getPriceStatus(
  currentPrice: number,
  previousPrice: number,
): ProductStatus {
  const change = (currentPrice - previousPrice) / previousPrice;
  if (change <= -0.005) return "dropped";
  if (change >= 0.005) return "increased";
  return "stable";
}

export function getPriceChange(currentPrice: number, previousPrice: number) {
  return previousPrice === 0 ? 0 : (currentPrice - previousPrice) / previousPrice;
}
