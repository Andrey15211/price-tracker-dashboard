import { ArrowDownRight, ArrowRight, ArrowUpRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import type { PriceHistoryPoint } from "@/types/priceHistory";
import { formatDateTime, formatPercent, formatRub } from "@/utils/format";

export function PriceHistoryTable({ history }: { history: PriceHistoryPoint[] }) {
  const t = useTranslations("HistoryTable");
  const locale = useLocale();
  const rows = [...history].reverse().slice(0, 10);

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[560px] text-left">
        <thead className="bg-[#0d141e] text-[10px] uppercase tracking-[0.12em] text-[#607087]">
          <tr>
            <th className="px-5 py-3 font-semibold">{t("checkedAt")}</th>
            <th className="px-4 py-3 text-right font-semibold">{t("price")}</th>
            <th className="px-4 py-3 text-right font-semibold">{t("change")}</th>
            <th className="px-5 py-3 text-right font-semibold">{t("movement")}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#182534]">
          {rows.map((point, index) => {
            const previous = rows[index + 1];
            const change = previous ? (point.price - previous.price) / previous.price : 0;
            const Icon = change > 0 ? ArrowUpRight : change < 0 ? ArrowDownRight : ArrowRight;
            const tone = change > 0 ? "text-red-400" : change < 0 ? "text-emerald-400" : "text-[#718196]";
            return (
              <tr key={point.id} className="bg-[#0b1119] hover:bg-[#0e1722]">
                <td className="px-5 py-3 text-xs text-[#8c9bad]">{formatDateTime(point.checkedAt, locale)}</td>
                <td className="tabular px-4 py-3 text-right text-xs font-semibold">{formatRub(point.price, locale)}</td>
                <td className={`tabular px-4 py-3 text-right text-[11px] ${tone}`}>{formatPercent(change, locale)}</td>
                <td className={`px-5 py-3 ${tone}`}>
                  <Icon className="ml-auto" size={15} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
