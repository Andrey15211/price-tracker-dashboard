import Link from "next/link";
import ru from "../../messages/ru.json";

export default function GlobalNotFound() {
  return (
    <div className="grid min-h-screen place-items-center bg-[#06090f] px-4 text-center text-[#e8eef6]">
      <div>
        <p className="tabular text-5xl font-semibold text-cyan-300">404</p>
        <h1 className="mt-4 text-base font-semibold">{ru.NotFound.title}</h1>
        <Link
          className="focus-ring mt-5 inline-block rounded-md bg-cyan-400 px-4 py-2 text-xs font-semibold text-[#041016]"
          href="/ru"
        >
          {ru.NotFound.back}
        </Link>
      </div>
    </div>
  );
}
