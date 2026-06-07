import { z } from "zod";
import { PRODUCT_SOURCES } from "@/types/product";

export type ValidationMessages = {
  nameMin: string;
  nameMax: string;
  url: string;
  targetPositive: string;
  targetMax: string;
};

export const createProductSchema = (messages: ValidationMessages) =>
  z.object({
    name: z
      .string()
      .trim()
      .min(3, messages.nameMin)
      .max(120, messages.nameMax),
    url: z.url(messages.url),
    source: z.enum(PRODUCT_SOURCES),
    targetPrice: z
      .number()
      .positive(messages.targetPositive)
      .max(10_000_000, messages.targetMax),
  });

export const checkPriceSchema = z.object({
  productId: z.string().min(1, "productId is required"),
});

export type CreateProductFormValues = {
  name: string;
  url: string;
  source: (typeof PRODUCT_SOURCES)[number];
  targetPrice: number;
};
