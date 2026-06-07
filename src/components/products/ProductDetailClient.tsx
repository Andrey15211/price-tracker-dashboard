"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertTriangle,
  BellRing,
  ExternalLink,
  LoaderCircle,
  RefreshCw,
  Target,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { PriceHistoryChart } from "@/components/charts/PriceHistoryChart";
import type { Product } from "@/types/product";
import { formatPercent, formatRub } from "@/utils/format";
import { getPriceChange } from "@/utils/product";
import { PriceHistoryTable } from "./PriceHistoryTable";

type Period = "7D" | "14D" | "30D" | "ALL";

async function fetchProduct(id: string, notFoundMessage: string, loadError: string): Promise<Product> {
  const response = await fetch(`/api/products/${id}`);
  if (!response.ok) throw new Error(response.status === 404 ? notFoundMessage : loadError);
  return (await response.json()).product;
}

async function checkPrice(productId: string, errorMessage: string) {
  const response = await fetch("/api/check-price", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productId }),
  });
  if (!response.ok) throw new Error(errorMessage);
  return response.json();
}

export function ProductDetailClient({ productId }: { productId: string }) {
  const t = useTranslations("Detail");
  const productNames = useTranslations("Products");
  const locale = useLocale();
  const [period, setPeriod] = useState<Period>("30D");
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ["product", productId],
    queryFn: () => fetchProduct(productId, t("notFound"), t("loadError")),
  });
  const mutation = useMutation({
    mutationFn: () => checkPrice(productId, t("checkError")),
    onSuccess: (data) => {
      queryClient.setQueryData(["product", productId], data.product);
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  if (query.isLoading) {
    return <div className="grid min-h-[60vh] place-items-center"><LoaderCircle className="animate-spin text-cyan-300" /></div>;
  }
  if (query.isError || !query.data) {
    return (
      <div className="panel mx-auto mt-20 max-w-md rounded-lg p-7 text-center">
        <AlertTriangle className="mx-auto mb-3 text-red-400" />
        <h2 className="text-sm font-semibold">{query.error?.message ?? t("notFound")}</h2>
      </div>
    );
  }

  const product = query.data;
  const periodLength = period === "ALL" ? product.history.length : Number(period.replace("D", ""));
  const history = product.history.slice(-periodLength);
  const change = getPriceChange(product.currentPrice, product.previousPrice);
  const alert = product.currentPrice <= product.targetPrice;

  return (
    <div className="mx-auto w-full max-w-[1500px] space-y-5">
      <section className="panel rounded-lg p-5 md:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <div className="mb-3 flex items-center gap-2">
              <span className="rounded border border-cyan-400/20 bg-cyan-400/8 px-2 py-1 text-[10px] font-semibold text-cyan-300">
                {product.source}
              </span>
              {alert && (
                <span className="flex items-center gap-1 rounded border border-emerald-400/20 bg-emerald-400/8 px-2 py-1 text-[10px] font-semibold text-emerald-300">
                  <BellRing size={11} /> {t("targetReached")}
                </span>
              )}
            </div>
            <h2 className="text-xl font-semibold tracking-tight md:text-2xl">
              {productNames.has(product.id) ? productNames(product.id) : product.name}
            </h2>
            <a
              href={product.url}
              target="_blank"
              rel="noreferrer"
              className="focus-ring mt-2 inline-flex items-center gap-1.5 rounded text-[11px] text-[#68798e] hover:text-cyan-300"
            >
              {t("openSource")} <ExternalLink size={12} />
            </a>
          </div>
          <button
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
            className="focus-ring flex items-center justify-center gap-2 rounded-md bg-cyan-400 px-4 py-2.5 text-xs font-semibold text-[#041016] hover:bg-cyan-300 disabled:opacity-60"
          >
            <RefreshCw size={15} className={mutation.isPending ? "animate-spin" : ""} />
            {t("checkPrice")}
          </button>
        </div>

        <div className="mt-6 grid gap-px overflow-hidden rounded-lg border border-[#1c2a39] bg-[#1c2a39] sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: t("currentPrice"), value: formatRub(product.currentPrice, locale), icon: change > 0 ? TrendingUp : TrendingDown, tone: change > 0 ? "text-red-400" : "text-emerald-400" },
            { label: t("targetPrice"), value: formatRub(product.targetPrice, locale), icon: Target, tone: "text-cyan-300" },
            { label: t("minimum"), value: formatRub(product.minPrice, locale), icon: TrendingDown, tone: "text-emerald-400" },
            { label: t("maximum"), value: formatRub(product.maxPrice, locale), icon: TrendingUp, tone: "text-red-400" },
          ].map(({ label, value, icon: Icon, tone }) => (
            <div key={label} className="bg-[#0b121b] p-4">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.11em] text-[#65758a]">
                <Icon size={14} className={tone} /> {label}
              </div>
              <p className="tabular mt-3 text-lg font-semibold">{value}</p>
            </div>
          ))}
        </div>
      </section>

      {mutation.isSuccess && (
        <div className={`rounded-md border px-4 py-3 text-xs ${mutation.data.alertTriggered ? "border-emerald-400/20 bg-emerald-400/8 text-emerald-300" : "border-cyan-400/20 bg-cyan-400/8 text-cyan-200"}`}>
          {t("newPrice", {
            price: formatRub(mutation.data.newPrice, locale),
            change: formatPercent(
              getPriceChange(mutation.data.newPrice, mutation.data.product.previousPrice),
              locale,
            ),
          })}
        </div>
      )}
      {mutation.isError && <div className="rounded-md border border-red-400/20 bg-red-400/8 px-4 py-3 text-xs text-red-300">{mutation.error.message}</div>}

      <section className="panel rounded-lg">
        <div className="flex flex-col gap-3 border-b border-[#192636] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xs font-semibold">{t("chartTitle")}</h2>
            <p className="mt-1 text-[10px] text-[#607087]">{t("chartDescription")}</p>
          </div>
          <div className="flex rounded-md border border-[#223142] bg-[#080d14] p-1">
            {(["7D", "14D", "30D", "ALL"] as Period[]).map((value) => (
              <button
                key={value}
                onClick={() => setPeriod(value)}
                className={`focus-ring rounded px-3 py-1.5 text-[10px] font-semibold transition ${
                  period === value ? "bg-[#172535] text-cyan-300" : "text-[#68798e] hover:text-white"
                }`}
              >
                {value === "ALL" ? t("all") : value}
              </button>
            ))}
          </div>
        </div>
        <div className="p-3 md:p-5">
          <PriceHistoryChart history={history} targetPrice={product.targetPrice} />
        </div>
      </section>

      <section className="panel rounded-lg">
        <div className="border-b border-[#192636] px-5 py-4">
          <h2 className="text-xs font-semibold">{t("historyTitle")}</h2>
          <p className="mt-1 text-[10px] text-[#607087]">{t("historyDescription")}</p>
        </div>
        <PriceHistoryTable history={history} />
      </section>
    </div>
  );
}
