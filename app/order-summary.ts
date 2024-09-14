import { DeepPartial } from "ai";
import { z } from "zod";

export const OrderSummarySchema = z.object({
    products: z.array(
        z.object({
            name: z.string().describe("the name of the product user wants to order"),
            price: z.number().describe("the price of the product"),
            quantity: z.number().describe("the quantity of the product user wants to order").default(1),
        })
    ).describe("the name, price and the quantity of the products that user ordered"),

    subtotal: z.number().describe("the total price of the order"),
    deliveryCost: z.number().describe("the delivery cost of the order").default(129.00),
    total: z.number().describe("the total cost of the order"),
    customerName: z.string().describe("Name of the customer"),
    customerContact: z.string().describe("Contact number of the customer"),
    customerAdress: z.string().describe("Address of the customer"),
    customerPaymentMethod: z.enum(["Credit Card", "Cash"]).describe("Payment method of the customer"),

});

export type OrderSummary = DeepPartial<typeof OrderSummarySchema>;