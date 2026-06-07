import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function LocalizedNotFound() {
  const t = await getTranslations("NotFound");
  return (
    <div className="grid min-h-[65vh] place-items-center text-center">
      <div>
        <p className="tabular text-5xl font-semibold text-cyan-300">404</p>
        <h2 className="mt-4 text-base font-semibold">{t("title")}</h2>
        <Link
          className="focus-ring mt-5 inline-block rounded-md bg-cyan-400 px-4 py-2 text-xs font-semibold text-[#041016]"
          href="/"
        >
          {t("back")}
        </Link>
      </div>
    </div>
  );
}
