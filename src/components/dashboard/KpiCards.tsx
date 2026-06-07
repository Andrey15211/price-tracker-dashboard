import { BellRing, Boxes, CircleDollarSign, TrendingDown } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import type { Product } from "@/types/product";
import { formatPercent, formatRub } from "@/utils/format";
import { getPriceChange } from "@/utils/product";

export function KpiCards({ products }: { products: Product[] }) {
  const t = useTranslations("Kpi");
  const productNames = useTranslations("Products");
  const locale = useLocale();
  const alerts = products.filter((product) => product.currentPrice <= product.targetPrice);
  const averageChange =
    products.reduce(
      (sum, product) => sum + getPriceChange(product.currentPrice, product.previousPrice),
      0,
    ) / Math.max(products.length, 1);
  const bestDeal = [...products].sort(
    (a, b) =>
      (a.currentPrice - a.targetPrice) / a.targetPrice -
      (b.currentPrice - b.targetPrice) / b.targetPrice,
  )[0];

  const cards = [
    {
      label: t("trackedProducts"),
      value: String(products.length),
      detail: t("sources", { count: 3 }),
      icon: Boxes,
      tone: "cyan",
    },
    {
      label: t("activeAlerts"),
      value: String(alerts.length),
      detail: alerts.length ? t("targetReached") : t("noTriggers"),
      icon: BellRing,
      tone: "green",
    },
    {
      label: t("averageChange"),
      value: formatPercent(averageChange, locale),
      detail: t("previousCheck"),
      icon: TrendingDown,
      tone: averageChange > 0 ? "red" : "green",
    },
    {
      label: t("bestPrice"),
      value: bestDeal ? formatRub(bestDeal.currentPrice, locale) : "—",
      detail: bestDeal
        ? productNames.has(bestDeal.id)
          ? productNames(bestDeal.id)
          : bestDeal.name
        : t("noData"),
      icon: CircleDollarSign,
      tone: "cyan",
    },
  ] as const;

  const tones = {
    cyan: "border-cyan-400/20 bg-cyan-400/8 text-cyan-300",
    green: "border-emerald-400/20 bg-emerald-400/8 text-emerald-300",
    red: "border-red-400/20 bg-red-400/8 text-red-300",
  };

  return (
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label={t("ariaLabel")}>
      {cards.map(({ label, value, detail, icon: Icon, tone }) => (
        <article key={label} className="panel min-h-[148px] rounded-lg p-4">
          <div className="mb-5 flex items-start justify-between">
            <p className="min-h-8 text-[11px] font-medium uppercase tracking-[0.11em] text-[#738399]">
              {label}
            </p>
            <span className={`grid size-8 place-items-center rounded-md border ${tones[tone]}`}>
              <Icon size={16} />
            </span>
          </div>
          <p className="tabular text-2xl font-semibold tracking-tight text-[#f1f6fb]">{value}</p>
          <p className="mt-1 truncate text-[11px] text-[#64758a]">{detail}</p>
        </article>
      ))}
    </section>
  );
}
