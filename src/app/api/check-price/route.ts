import { NextResponse } from "next/server";
import { checkProductPrice } from "@/services/priceService";
import { checkPriceSchema } from "@/utils/schemas";

export async function POST(request: Request) {
  const result = checkPriceSchema.safeParse(await request.json());
  if (!result.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: result.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  try {
    return NextResponse.json(await checkProductPrice(result.data.productId));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Price check failed";
    return NextResponse.json(
      { error: message },
      { status: message === "Product not found" ? 404 : 500 },
    );
  }
}
