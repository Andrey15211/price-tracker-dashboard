import { BellRing, CircleCheck, Clock3 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import type { Product } from "@/types/product";
import { formatDateTime, formatRub } from "@/utils/format";

export function AlertFeed({ products }: { products: Product[] }) {
  const t = useTranslations("Alerts");
  const productNames = useTranslations("Products");
  const locale = useLocale();
  const alerts = products
    .filter((product) => product.currentPrice <= product.targetPrice)
    .slice(0, 4);

  return (
    <aside id="alerts" className="panel rounded-lg">
      <div className="flex items-center justify-between border-b border-[#192636] px-4 py-3.5">
        <div className="flex items-center gap-2">
          <BellRing size={15} className="text-emerald-400" />
          <h2 className="text-xs font-semibold">{t("title")}</h2>
        </div>
        <span className="tabular text-[10px] text-[#65758a]">{t("active", { count: alerts.length })}</span>
      </div>
      <div className="divide-y divide-[#182534]">
        {alerts.length ? (
          alerts.map((product) => (
            <div key={product.id} className="p-4">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-md bg-emerald-400/8 text-emerald-400">
                  <CircleCheck size={14} />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-xs font-medium text-[#d8e1eb]">
                    {productNames.has(product.id) ? productNames(product.id) : product.name}
                  </p>
                  <p className="mt-1 text-[11px] text-[#728297]">
                    {t("priceBelow", {
                      current: formatRub(product.currentPrice, locale),
                      target: formatRub(product.targetPrice, locale),
                    })}
                  </p>
                  <p className="mt-2 flex items-center gap-1 text-[10px] text-[#526176]">
                    <Clock3 size={11} /> {formatDateTime(product.updatedAt, locale)}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-6 text-center text-xs text-[#68788d]">
            {t("empty")}
          </div>
        )}
      </div>
    </aside>
  );
}
