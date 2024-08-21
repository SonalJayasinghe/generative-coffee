import { DeepPartial } from "ai";
import { z } from "zod";

export const selectCoffeeSchema = z.object({
  message: z.string().describe("the short message from the barista"),
  products: z.array(z.string()).describe("the names of products available at the coffee shop"),
});

export type SelectCoffee = DeepPartial<typeof selectCoffeeSchema>;