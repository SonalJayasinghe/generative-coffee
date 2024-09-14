import { DeepPartial } from "ai";
import { z } from "zod";

export const selectCoffeeSchema = z.object({
  products: z.array(
    z.object({
      name: z.string().describe("the name of the product"),
      price: z.number().describe("the price of the product"),
    })
  ).describe("the names and prices of the products available at the coffee shop"),
});

export type SelectCoffeeSchema = DeepPartial<typeof selectCoffeeSchema>;