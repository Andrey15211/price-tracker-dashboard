"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useLocale, useTranslations } from "next-intl";
import type { PriceHistoryPoint } from "@/types/priceHistory";
import { formatRub } from "@/utils/format";

export function PriceHistoryChart({
  history,
  targetPrice,
}: {
  history: PriceHistoryPoint[];
  targetPrice: number;
}) {
  const t = useTranslations("Chart");
  const locale = useLocale();
  const data = history.map((point) => ({
    ...point,
    label: new Intl.DateTimeFormat(locale === "en" ? "en-US" : "ru-RU", { day: "2-digit", month: "short" }).format(
      new Date(point.checkedAt),
    ),
  }));

  return (
    <div className="h-[300px] w-full md:h-[360px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 14, right: 12, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="#172433" strokeDasharray="3 5" vertical={false} />
          <XAxis
            dataKey="label"
            stroke="#506176"
            tick={{ fill: "#65768a", fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            minTickGap={28}
          />
          <YAxis
            domain={["dataMin - 1500", "dataMax + 1500"]}
            stroke="#506176"
            tick={{ fill: "#65768a", fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${Math.round(value / 1000)}k`}
            width={40}
          />
          <Tooltip
            cursor={{ stroke: "#355168", strokeDasharray: "3 3" }}
            contentStyle={{
              background: "#0b121b",
              border: "1px solid #243548",
              borderRadius: "7px",
              fontSize: "11px",
              color: "#dce6f0",
              boxShadow: "0 12px 30px rgba(0,0,0,.35)",
            }}
            labelStyle={{ color: "#7f91a6", marginBottom: "5px" }}
            formatter={(value) => [formatRub(Number(value), locale), t("price")]}
          />
          <ReferenceLine
            y={targetPrice}
            stroke="#35d07f"
            strokeDasharray="5 5"
            strokeOpacity={0.7}
            label={{ value: t("target"), fill: "#35d07f", fontSize: 10, position: "insideTopRight" }}
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#34c7e8"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: "#071019", stroke: "#64dff5", strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
