import { createMockProducts } from "@/data/mockProducts";
import type { CreateProductInput, Product } from "@/types/product";
import { getPriceStatus } from "@/utils/product";

type MockStore = {
  products: Product[];
};

const globalStore = globalThis as typeof globalThis & {
  priceTrackerStore?: MockStore;
};

const store =
  globalStore.priceTrackerStore ??
  (globalStore.priceTrackerStore = { products: createMockProducts() });

export function listProducts() {
  return store.products;
}

export function getProduct(id: string) {
  return store.products.find((product) => product.id === id);
}

export function addProduct(input: CreateProductInput): Product {
  const id = `${input.name.toLowerCase().replace(/[^a-zа-я0-9]+/gi, "-").replace(/(^-|-$)/g, "")}-${Date.now()}`;
  const checkedAt = new Date().toISOString();
  const currentPrice = Math.round(input.targetPrice * 1.08);
  const product: Product = {
    id,
    ...input,
    currentPrice,
    targetPrice: input.targetPrice,
    minPrice: currentPrice,
    maxPrice: currentPrice,
    previousPrice: currentPrice,
    status: "stable",
    updatedAt: checkedAt,
    history: [{ id: `${id}-0`, productId: id, price: currentPrice, checkedAt }],
  };
  store.products.unshift(product);
  return product;
}

export function updateProductPrice(id: string, price: number) {
  const product = getProduct(id);
  if (!product) return undefined;

  const previousPrice = product.currentPrice;
  const checkedAt = new Date().toISOString();
  product.previousPrice = previousPrice;
  product.currentPrice = price;
  product.status = getPriceStatus(price, previousPrice);
  product.updatedAt = checkedAt;
  product.minPrice = Math.min(product.minPrice, price);
  product.maxPrice = Math.max(product.maxPrice, price);
  product.history.push({
    id: `${id}-${Date.now()}`,
    productId: id,
    price,
    checkedAt,
  });
  return product;
}
