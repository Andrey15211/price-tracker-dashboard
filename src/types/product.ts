import type { PriceHistoryPoint } from "./priceHistory";

export const PRODUCT_SOURCES = ["MockMarket", "TechStore", "HomeHub"] as const;
export type ProductSource = (typeof PRODUCT_SOURCES)[number];
export type ProductStatus = "stable" | "dropped" | "increased";

export interface Product {
  id: string;
  name: string;
  url: string;
  source: ProductSource;
  currentPrice: number;
  targetPrice: number;
  minPrice: number;
  maxPrice: number;
  previousPrice: number;
  status: ProductStatus;
  updatedAt: string;
  history: PriceHistoryPoint[];
}

export interface CreateProductInput {
  name: string;
  url: string;
  source: ProductSource;
  targetPrice: number;
}
