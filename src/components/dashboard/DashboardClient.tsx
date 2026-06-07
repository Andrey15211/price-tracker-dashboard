"use client";

import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, LoaderCircle, RefreshCw } from "lucide-react";
import { useTranslations } from "next-intl";
import type { Product } from "@/types/product";
import { AddProductForm } from "@/components/forms/AddProductForm";
import { AlertFeed } from "./AlertFeed";
import { KpiCards } from "./KpiCards";
import { ProductsTable } from "@/components/products/ProductsTable";

async function fetchProducts(errorMessage: string): Promise<Product[]> {
  const response = await fetch("/api/products");
  if (!response.ok) throw new Error(errorMessage);
  const data = await response.json();
  return data.products;
}

export function DashboardClient() {
  const t = useTranslations("Dashboard");
  const query = useQuery({
    queryKey: ["products"],
    queryFn: () => fetchProducts(t("loadError")),
  });

  if (query.isLoading) {
    return (
      <div className="grid min-h-[65vh] place-items-center">
        <div className="text-center text-[#75859a]">
          <LoaderCircle className="mx-auto mb-3 animate-spin text-cyan-300" />
          <p className="text-xs">{t("loading")}</p>
        </div>
      </div>
    );
  }

  if (query.isError) {
    return (
      <div className="panel mx-auto mt-20 max-w-md rounded-lg p-7 text-center">
        <AlertTriangle className="mx-auto mb-3 text-red-400" />
        <h2 className="text-sm font-semibold">{t("unavailable")}</h2>
        <p className="mt-2 text-xs text-[#728297]">{query.error.message}</p>
        <button
          onClick={() => query.refetch()}
          className="focus-ring mx-auto mt-5 flex items-center gap-2 rounded-md bg-cyan-400 px-4 py-2 text-xs font-semibold text-[#041016]"
        >
          <RefreshCw size={14} /> {t("retry")}
        </button>
      </div>
    );
  }

  const products = query.data ?? [];

  return (
    <>
      <div className="mx-auto w-full max-w-[1600px] space-y-5">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.17em] text-cyan-400/75">
              {t("operationalSummary")}
            </p>
            <h2 className="mt-1.5 text-xl font-semibold tracking-tight md:text-2xl">
              {t("title")}
            </h2>
          </div>
          <button
            onClick={() => query.refetch()}
            className="focus-ring hidden items-center gap-2 rounded-md border border-[#223243] bg-[#0b121b] px-3 py-2 text-[11px] text-[#8393a7] hover:text-white sm:flex"
          >
            <RefreshCw size={13} className={query.isFetching ? "animate-spin" : ""} />
            {t("refresh")}
          </button>
        </div>

        <KpiCards products={products} />

        <div className="grid items-start gap-5 2xl:grid-cols-[minmax(0,1fr)_320px]">
          <section id="products" className="panel min-w-0 rounded-lg">
            <div className="flex items-center justify-between border-b border-[#192636] px-5 py-3.5">
              <div>
                <h2 className="text-xs font-semibold">{t("trackedProducts")}</h2>
                <p className="mt-1 text-[10px] text-[#607087]">{t("rangesDescription")}</p>
              </div>
              <span className="tabular rounded border border-[#223142] bg-[#0a1017] px-2 py-1 text-[10px] text-[#6f8094]">
                {t("positions", { count: products.length })}
              </span>
            </div>
            <ProductsTable products={products} />
          </section>
          <AlertFeed products={products} />
        </div>

        <section id="activity" className="border-t border-[#192636] pt-4 text-[11px] text-[#536377]">
          <span className="text-[#8797aa]">{t("dataSourceLabel")}</span>{" "}
          {t("dataSourceText")} {t("safetyText")}
        </section>
      </div>
      <AddProductForm />
    </>
  );
}
