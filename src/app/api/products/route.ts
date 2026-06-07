import { NextResponse } from "next/server";
import { addProduct, listProducts } from "@/data/mockStore";
import { z } from "zod";
import { PRODUCT_SOURCES } from "@/types/product";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ products: listProducts() });
}

export async function POST(request: Request) {
  const result = z.object({
    name: z.string().trim().min(3).max(120),
    url: z.url(),
    source: z.enum(PRODUCT_SOURCES),
    targetPrice: z.coerce.number().positive().max(10_000_000),
  }).safeParse(await request.json());
  if (!result.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: result.error.flatten().fieldErrors },
      { status: 400 },
    );
  }
  return NextResponse.json({ product: addProduct(result.data) }, { status: 201 });
}
