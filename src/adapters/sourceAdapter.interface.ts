import type { Product } from "@/types/product";

export interface SourceAdapter {
  readonly source: Product["source"];
  checkPrice(product: Product): Promise<number>;
}
