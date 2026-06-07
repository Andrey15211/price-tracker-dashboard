import type { SourceAdapter } from "@/adapters/sourceAdapter.interface";
import type { Product } from "@/types/product";

export class MockAdapter implements SourceAdapter {
  readonly source: Product["source"];

  constructor(source: Product["source"]) {
    this.source = source;
  }

  async checkPrice(product: Product): Promise<number> {
    const direction = Math.random() - 0.55;
    const change = direction * 0.065;
    return Math.max(100, Math.round((product.currentPrice * (1 + change)) / 10) * 10);
  }
}
