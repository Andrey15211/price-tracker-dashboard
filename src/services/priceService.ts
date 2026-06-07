import { MockAdapter } from "@/adapters/mockAdapter";
import { getProduct, updateProductPrice } from "@/data/mockStore";
import type { ProductSource } from "@/types/product";

const adapters = new Map(
  (["MockMarket", "TechStore", "HomeHub"] as ProductSource[]).map((source) => [
    source,
    new MockAdapter(source),
  ]),
);

export async function checkProductPrice(productId: string) {
  const product = getProduct(productId);
  if (!product) throw new Error("Product not found");

  const adapter = adapters.get(product.source);
  if (!adapter) throw new Error(`No adapter configured for ${product.source}`);

  const newPrice = await adapter.checkPrice(product);
  const updatedProduct = updateProductPrice(product.id, newPrice);
  if (!updatedProduct) throw new Error("Product update failed");

  return {
    product: updatedProduct,
    newPrice,
    alertTriggered: newPrice <= updatedProduct.targetPrice,
  };
}
