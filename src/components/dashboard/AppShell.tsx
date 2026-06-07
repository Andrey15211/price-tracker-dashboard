"use client";

import {
  Activity,
  BellRing,
  Boxes,
  ChevronLeft,
  LayoutDashboard,
  Menu,
  Plus,
  Radar,
  Settings,
  X,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { useEffect, useState } from "react";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const t = useTranslations("Shell");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const isDetail = pathname.startsWith("/products/");
  const navigation = [
    { href: "/", label: t("overview"), icon: LayoutDashboard },
    { href: "/#products", label: t("products"), icon: Boxes },
    { href: "/#alerts", label: t("alerts"), icon: BellRing },
    { href: "/#activity", label: t("activity"), icon: Activity },
  ];

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  function switchLocale(nextLocale: "ru" | "en") {
    router.replace(pathname, { locale: nextLocale });
  }

  return (
    <div className="min-h-screen bg-[#06090f] text-[#e8eef6]">
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-[#192636] bg-[#080d14] transition-transform duration-200 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-17 items-center justify-between border-b border-[#192636] px-5">
          <Link href="/" className="focus-ring flex items-center gap-3 rounded">
            <span className="grid size-9 place-items-center rounded-lg border border-cyan-400/25 bg-cyan-400/10 text-cyan-300">
              <Radar size={19} strokeWidth={2} />
            </span>
            <span>
              <strong className="block text-[15px] tracking-tight">Price Pulse</strong>
              <span className="text-[10px] uppercase tracking-[0.18em] text-[#617086]">
                {t("console")}
              </span>
            </span>
          </Link>
          <button
            className="focus-ring rounded-md p-2 text-[#8b9aae] hover:bg-white/5 lg:hidden"
            onClick={() => setMobileOpen(false)}
            aria-label={t("closeNavigation")}
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-5" aria-label={t("mainNavigation")}>
          <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#536176]">
            {t("section")}
          </p>
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = item.href === "/" ? pathname === "/" : false;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`focus-ring flex min-h-10 items-center gap-3 rounded-md px-3 py-2.5 text-[13px] transition ${
                  active
                    ? "bg-cyan-400/9 text-cyan-200"
                    : "text-[#8796aa] hover:bg-white/[0.035] hover:text-[#dbe5f0]"
                }`}
              >
                <Icon size={17} strokeWidth={1.8} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-[#192636] p-3">
          <div className="mb-3 rounded-lg border border-[#1d2d3d] bg-[#0c141e] p-3">
            <div className="mb-2 flex items-center justify-between text-[11px]">
              <span className="text-[#7d8da2]">{t("mockAdapters")}</span>
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="size-1.5 rounded-full bg-emerald-400" />
                {t("online")}
              </span>
            </div>
            <div className="h-1 rounded-full bg-[#172330]">
              <div className="h-1 w-4/5 rounded-full bg-cyan-400/70" />
            </div>
          </div>
          <button className="focus-ring flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-[13px] text-[#6f7f93] hover:bg-white/[0.035]">
            <Settings size={17} />
            {t("settings")}
          </button>
        </div>
      </aside>

      {mobileOpen && (
        <button
          aria-label={t("closeNavigation")}
          className="fixed inset-0 z-40 bg-black/70 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-17 items-center justify-between border-b border-[#192636] bg-[#080d14]/95 px-4 backdrop-blur md:px-7">
          <div className="flex min-w-0 items-center gap-3">
            <button
              className="focus-ring rounded-md border border-[#223142] p-2 text-[#9aabba] lg:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label={t("openNavigation")}
            >
              <Menu size={18} />
            </button>
            {isDetail && (
              <Link
                href="/"
                className="focus-ring hidden items-center gap-1 rounded text-xs text-[#7f8fa4] hover:text-white sm:flex"
              >
                <ChevronLeft size={15} /> {t("overview")}
              </Link>
            )}
            <div className="min-w-0">
              <h1 className="truncate text-[15px] font-semibold tracking-tight md:text-base">
                {isDetail ? t("priceHistory") : t("priceMonitoring")}
              </h1>
              <p className="hidden text-[11px] text-[#617086] sm:block">
                {t("simulationFreshness")}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-md border border-[#203040] bg-[#0c141e] px-3 py-2 text-xs text-[#8392a5] md:flex">
              <span className="size-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#35d07f]" />
              {t("systemOperational")}
            </div>
            <div
              className="flex min-w-[70px] rounded-md border border-[#203040] bg-[#0c141e] p-0.5"
              aria-label={t("language")}
            >
              {(["ru", "en"] as const).map((value) => (
                <button
                  key={value}
                  onClick={() => switchLocale(value)}
                  className={`focus-ring min-w-8 rounded px-2 py-1.5 text-[10px] font-semibold uppercase ${
                    locale === value
                      ? "bg-[#1a2a3a] text-cyan-300"
                      : "text-[#68798e] hover:text-white"
                  }`}
                  aria-pressed={locale === value}
                >
                  {value}
                </button>
              ))}
            </div>
            {!isDetail && (
              <button
                onClick={() => window.dispatchEvent(new Event("open-add-product"))}
                aria-label={t("addProduct")}
                className="focus-ring flex min-h-9 min-w-9 items-center justify-center gap-2 rounded-md bg-cyan-400 px-3.5 py-2 text-xs font-semibold text-[#041016] transition hover:bg-cyan-300 sm:min-w-[142px]"
              >
                <Plus size={16} strokeWidth={2.5} />
                <span className="hidden sm:inline">{t("addProduct")}</span>
              </button>
            )}
          </div>
        </header>
        <main className="grid-lines min-h-[calc(100vh-68px)] p-4 md:p-7">{children}</main>
      </div>
    </div>
  );
}
