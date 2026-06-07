"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LoaderCircle, Plus, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { PRODUCT_SOURCES } from "@/types/product";
import { createProductSchema, type CreateProductFormValues } from "@/utils/schemas";

async function createProduct(values: CreateProductFormValues, errorMessage: string) {
  const response = await fetch("/api/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });
  if (!response.ok) throw new Error(errorMessage);
  return response.json();
}

export function AddProductForm() {
  const t = useTranslations("Form");
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const schema = createProductSchema({
    nameMin: t("validation.nameMin"),
    nameMax: t("validation.nameMax"),
    url: t("validation.url"),
    targetPositive: t("validation.targetPositive"),
    targetMax: t("validation.targetMax"),
  });
  const form = useForm<CreateProductFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      url: "",
      source: "MockMarket",
      targetPrice: 0,
    },
  });
  const mutation = useMutation({
    mutationFn: (values: CreateProductFormValues) =>
      createProduct(values, t("createError")),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      form.reset();
      setOpen(false);
    },
  });

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("open-add-product", handler);
    return () => window.removeEventListener("open-add-product", handler);
  }, []);

  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [open]);

  if (!open) return null;

  const fieldClass =
    "focus-ring mt-1.5 w-full rounded-md border border-[#263747] bg-[#080d14] px-3 py-2.5 text-sm text-[#e3eaf2] placeholder:text-[#465568]";

  return (
    <div
      className="fixed inset-0 z-[70] grid place-items-center bg-black/75 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-product-title"
      onMouseDown={(event) => {
        if (event.currentTarget === event.target) setOpen(false);
      }}
    >
      <div className="panel w-full max-w-lg rounded-xl bg-[#0b1119] shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#1c2938] px-5 py-4">
          <div>
            <h2 id="add-product-title" className="text-sm font-semibold">{t("title")}</h2>
            <p className="mt-1 text-[11px] text-[#6d7d91]">{t("subtitle")}</p>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="focus-ring rounded-md p-2 text-[#7f8fa3] hover:bg-white/5 hover:text-white"
            aria-label={t("close")}
          >
            <X size={18} />
          </button>
        </div>

        <form
          className="space-y-4 p-5"
          noValidate
          onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
        >
          <label className="block text-xs font-medium text-[#aebac8]">
            {t("name")}
            <input
              {...form.register("name")}
              className={fieldClass}
              placeholder={t("namePlaceholder")}
              autoFocus
            />
            {form.formState.errors.name && (
              <span className="mt-1.5 block text-[11px] text-red-400">{form.formState.errors.name.message}</span>
            )}
          </label>

          <label className="block text-xs font-medium text-[#aebac8]">
            {t("url")}
            <input
              {...form.register("url")}
              className={fieldClass}
              placeholder={t("urlPlaceholder")}
              inputMode="url"
            />
            {form.formState.errors.url && (
              <span className="mt-1.5 block text-[11px] text-red-400">{form.formState.errors.url.message}</span>
            )}
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-xs font-medium text-[#aebac8]">
              {t("source")}
              <select {...form.register("source")} className={fieldClass}>
                {PRODUCT_SOURCES.map((source) => (
                  <option key={source} value={source}>{source}</option>
                ))}
              </select>
            </label>
            <label className="block text-xs font-medium text-[#aebac8]">
              {t("targetPrice")}
              <input
                {...form.register("targetPrice", { valueAsNumber: true })}
                className={fieldClass}
                type="number"
                min="1"
                step="10"
              />
              {form.formState.errors.targetPrice && (
                <span className="mt-1.5 block text-[11px] text-red-400">{form.formState.errors.targetPrice.message}</span>
              )}
            </label>
          </div>

          {mutation.isError && (
            <p className="rounded-md border border-red-400/20 bg-red-400/8 px-3 py-2 text-xs text-red-300">
              {mutation.error.message}
            </p>
          )}

          <div className="flex justify-end gap-3 border-t border-[#192636] pt-4">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="focus-ring rounded-md border border-[#263747] px-4 py-2.5 text-xs font-medium text-[#91a0b2] hover:bg-white/5"
            >
              {t("cancel")}
            </button>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="focus-ring flex min-w-36 items-center justify-center gap-2 rounded-md bg-cyan-400 px-4 py-2.5 text-xs font-semibold text-[#031016] hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {mutation.isPending ? <LoaderCircle size={16} className="animate-spin" /> : <Plus size={16} />}
              {t("submit")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
