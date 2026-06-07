import type { PriceHistoryPoint } from "@/types/priceHistory";
import type { Product, ProductSource } from "@/types/product";
import { getPriceStatus } from "@/utils/product";

type SeedProduct = {
  id: string;
  name: string;
  source: ProductSource;
  basePrice: number;
  targetPrice: number;
  currentPrice: number;
  phase: number;
};

const DAY = 86_400_000;

const seeds: SeedProduct[] = [
  { id: "sony-wh-1000xm5", name: "Наушники Sony WH-1000XM5", source: "TechStore", basePrice: 32990, targetPrice: 29990, currentPrice: 28990, phase: 1 },
  { id: "xiaomi-robot-s10", name: "Робот-пылесос Xiaomi Robot S10", source: "HomeHub", basePrice: 27990, targetPrice: 24990, currentPrice: 25990, phase: 2 },
  { id: "samsung-odyssey-g5", name: "Монитор Samsung Odyssey G5 27″", source: "TechStore", basePrice: 34990, targetPrice: 31990, currentPrice: 36490, phase: 3 },
  { id: "yandex-station-midi", name: "Умная колонка Яндекс Станция Миди", source: "MockMarket", basePrice: 15990, targetPrice: 13990, currentPrice: 13990, phase: 4 },
  { id: "logitech-mx-master-3s", name: "Мышь Logitech MX Master 3S", source: "TechStore", basePrice: 11990, targetPrice: 9990, currentPrice: 10490, phase: 5 },
  { id: "de-longhi-dinamica", name: "Кофемашина De'Longhi Dinamica", source: "HomeHub", basePrice: 64990, targetPrice: 57990, currentPrice: 61990, phase: 6 },
  { id: "apple-ipad-air-m2", name: "Планшет Apple iPad Air M2 11″", source: "MockMarket", basePrice: 79990, targetPrice: 72990, currentPrice: 76990, phase: 7 },
  { id: "bosch-serie-4", name: "Посудомоечная машина Bosch Serie 4", source: "HomeHub", basePrice: 57990, targetPrice: 51990, currentPrice: 49990, phase: 8 },
];

function createHistory(seed: SeedProduct): PriceHistoryPoint[] {
  const now = Date.now();
  const points = Array.from({ length: 24 }, (_, index) => {
    const wave = Math.sin((index + seed.phase) * 0.72) * seed.basePrice * 0.035;
    const trend = (index - 12) * seed.basePrice * -0.0013;
    const price = Math.round((seed.basePrice + wave + trend) / 10) * 10;
    return {
      id: `${seed.id}-${index}`,
      productId: seed.id,
      price,
      checkedAt: new Date(now - (23 - index) * DAY).toISOString(),
    };
  });

  points[points.length - 1].price = seed.currentPrice;
  return points;
}

export function createMockProducts(): Product[] {
  return seeds.map((seed) => {
    const history = createHistory(seed);
    const prices = history.map((point) => point.price);
    const previousPrice = history[history.length - 2].price;

    return {
      id: seed.id,
      name: seed.name,
      url: `https://example.com/products/${seed.id}`,
      source: seed.source,
      currentPrice: seed.currentPrice,
      targetPrice: seed.targetPrice,
      minPrice: Math.min(...prices),
      maxPrice: Math.max(...prices),
      previousPrice,
      status: getPriceStatus(seed.currentPrice, previousPrice),
      updatedAt: history[history.length - 1].checkedAt,
      history,
    };
  });
}
