import { ArrowDownRight, ArrowRight, ArrowUpRight, Bell, ExternalLink } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Product } from "@/types/product";
import { formatDateTime, formatPercent, formatRub } from "@/utils/format";
import { getPriceChange } from "@/utils/product";

const sourceTone = {
  MockMarket: "text-cyan-300",
  TechStore: "text-violet-300",
  HomeHub: "text-amber-300",
};

export function ProductsTable({ products }: { products: Product[] }) {
  const t = useTranslations("ProductsTable");
  const productNames = useTranslations("Products");
  const locale = useLocale();
  const statusMeta = {
    dropped: {
      label: t("dropped"),
      classes: "border-emerald-400/20 bg-emerald-400/8 text-emerald-300",
      Icon: ArrowDownRight,
    },
    increased: {
      label: t("increased"),
      classes: "border-red-400/20 bg-red-400/8 text-red-300",
      Icon: ArrowUpRight,
    },
    stable: {
      label: t("stable"),
      classes: "border-slate-400/20 bg-slate-400/8 text-slate-300",
      Icon: ArrowRight,
    },
  };

  if (!products.length) {
    return (
      <div className="grid min-h-72 place-items-center p-8 text-center">
        <div>
          <p className="text-sm font-medium">{t("emptyTitle")}</p>
          <p className="mt-2 text-xs text-[#6d7c90]">
            {t("emptyText")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[980px] border-collapse text-left">
        <thead className="sticky top-0 bg-[#0d141e] text-[10px] uppercase tracking-[0.12em] text-[#607087]">
          <tr>
            <th className="px-5 py-3 font-semibold">{t("product")}</th>
            <th className="px-4 py-3 font-semibold">{t("source")}</th>
            <th className="px-4 py-3 text-right font-semibold">{t("current")}</th>
            <th className="px-4 py-3 text-right font-semibold">{t("target")}</th>
            <th className="px-4 py-3 text-right font-semibold">{t("minMax")}</th>
            <th className="px-4 py-3 font-semibold">{t("status")}</th>
            <th className="px-5 py-3 text-right font-semibold">{t("checked")}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#182534]">
          {products.map((product) => {
            const status = statusMeta[product.status];
            const change = getPriceChange(product.currentPrice, product.previousPrice);
            const alert = product.currentPrice <= product.targetPrice;
            return (
              <tr key={product.id} className="group bg-[#0b1119] transition hover:bg-[#0e1722]">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <span
                      className={`grid size-8 shrink-0 place-items-center rounded-md border ${
                        alert
                          ? "border-emerald-400/25 bg-emerald-400/8 text-emerald-300"
                          : "border-[#223142] bg-[#111b26] text-[#728399]"
                      }`}
                    >
                      {alert ? <Bell size={14} /> : <span className="text-[10px] font-bold">₽</span>}
                    </span>
                    <div className="min-w-0">
                      <Link
                        className="focus-ring flex items-center gap-1.5 rounded text-[13px] font-medium text-[#dbe5ef] hover:text-cyan-300"
                        href={`/products/${product.id}`}
                      >
                        {productNames.has(product.id) ? productNames(product.id) : product.name}
                        <ExternalLink size={11} className="opacity-0 transition group-hover:opacity-80" />
                      </Link>
                      {alert && (
                        <span className="mt-1 block text-[10px] font-medium text-emerald-400">
                          {t("targetReached")}
                        </span>
                      )}
                    </div>
                  </div>
                </td>
                <td className={`px-4 py-4 text-xs font-medium ${sourceTone[product.source]}`}>
                  {product.source}
                </td>
                <td className="tabular px-4 py-4 text-right">
                  <p className="text-[13px] font-semibold text-[#e6edf5]">{formatRub(product.currentPrice, locale)}</p>
                  <p className={`mt-1 text-[10px] ${change > 0 ? "text-red-400" : change < 0 ? "text-emerald-400" : "text-[#6b7b8f]"}`}>
                    {formatPercent(change, locale)}
                  </p>
                </td>
                <td className="tabular px-4 py-4 text-right text-xs text-[#9ba9b9]">
                  {formatRub(product.targetPrice, locale)}
                </td>
                <td className="tabular px-4 py-4 text-right text-[11px] text-[#77879a]">
                  <span className="text-emerald-400/85">{formatRub(product.minPrice, locale)}</span>
                  <span className="mx-1.5 text-[#3f4d5e]">/</span>
                  <span className="text-red-400/85">{formatRub(product.maxPrice, locale)}</span>
                </td>
                <td className="px-4 py-4">
                  <span className={`inline-flex items-center gap-1 rounded border px-2 py-1 text-[10px] font-medium ${status.classes}`}>
                    <status.Icon size={12} />
                    {status.label}
                  </span>
                </td>
                <td className="tabular px-5 py-4 text-right text-[11px] text-[#65758a]">
                  {formatDateTime(product.updatedAt, locale)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
