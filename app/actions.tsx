"use server";

import { createAI, getMutableAIState, streamUI } from "ai/rsc";
import { openai, createOpenAI } from "@ai-sdk/openai";
import z from "zod";

import { ReactNode } from "react";
import { generateObject, tool } from "ai";
import { selectCoffeeSchema } from "./select-coffee";
import { SelectCoffeeComponent } from "../components/select-coffee-component";
import { nanoid } from "nanoid";
import { OrderSummaryComponent } from "@/components/order-summary-component";
import { OrderSummarySchema } from "./order-summary";

export interface ClientMessage {
  id: string;
  role: "user" | "assistant";
  display: ReactNode;
}

export interface ServerMessage {
  role: "user" | "assistant";
  content: string;
}

export async function continueConversation(
  input: string
): Promise<ClientMessage> {
  const history = getMutableAIState();

  const initialInstruction = {
    role: "assistant",
    content: `You are a helpful barista at a coffee shop called Sonal's Cafe. You are tasked with helping customers with their orders.
    \n\n
    Your coffee shop sells the following products:
    \n\n
    - Espresso @ LKR. 350.00
    - Latte @ LKR. 400.00
    - Cappuccino @ LKR. 450.00
    \n\n

    The following is the order process. You should follow exactly as described.:
    1. If the user does not specify the coffee type he wants, you should call the selectCoffee tool to help the user select a coffee.
    2. Then you should show the subtotal. Ask for the name, contact number, address and payment method (Credit Card / Cash).
    3. After the user provide the information, you should call the orderSummary tool to show the order summary.
    4. Say "Thank you for your order.

    IMPORTENT:
      if the user say Thank you, you should say "You're welcome. Have a great day!" and end the conversation.
    \n
    
    `,
  };

  const groq = createOpenAI({
    baseURL: "https://api.groq.com/openai/v1",
    apiKey: process.env.GROQ_API_KEY,
  });

  const result = await streamUI({
    model: openai("gpt-4o"),
    messages: [
      initialInstruction,
      ...history.get(),
      { role: "user", content: input },
    ],
    text: ({ content, done }) => {
      if (done) {
        history.done((messages: ServerMessage[]) => [
          ...messages,
          { role: "assistant", content },
        ]);
      }

      return <div>{content}</div>;
    },
    tools: {
      selectCoffee: {
        description:
          "Show the select coffee component to help the user select a coffee",
        parameters: z.object({}),
        generate: async function* () {
          yield <div> Loading.... </div>;
          const selecCoffee = await generateObject({
            model: openai("gpt-4o-mini"),
            schema: selectCoffeeSchema,
            prompt: `Your coffee shop sells the following products:
                     \n\n
                     - Espresso @ LKR. 350.00
                     - Latte @ LKR. 400.00
                     - Cappuccino @ LKR. 450.00`,
          });
          return <SelectCoffeeComponent selectCoffee={selecCoffee.object} />;
        },
      },

      orderSummary: {
        description:
          "After the user provides the name, contact number, address and payment method, show the order summary",
        parameters: z.object({
          products: z.array(
            z.object({
              name: z.string().describe("Name of the product"),
              quantity: z.number().describe("Quantity of the product"),
              price: z.number().describe("Price of the product"),
            })
          ),
          customerName: z.string().describe("Name of the customer"),
          customerContact: z
            .string()
            .describe("Contact number of the customer"),
          customerAdress: z.string().describe("Address of the customer"),
          customerPaymentMethod: z.enum(["Credit Card", "Cash"]).describe("Payment method of the customer"),
        }),
        generate: async function* ({
          customerName,
          customerContact,
          customerAdress,
          customerPaymentMethod,
          products,
        }) {
          yield <div> Loading.... </div>;
          const orderSummary = await generateObject({
            model: openai("gpt-4o-mini"),
            schema: OrderSummarySchema,
            schemaDescription: "Order Summary with customer information",
            prompt: `
          ${initialInstruction.content}

              Customer Name: ${customerName}
              Contact Number: ${customerContact}
              Address: ${customerAdress}
              Payment Method: ${customerPaymentMethod}

              Products:
              ${products.map((product) => `${product.name} x ${product.quantity}`).join("\n")}

              Total should be calculated based on the selected coffee type and quantity + delivery cost.
            `
          
          });
          return <OrderSummaryComponent orderSummary={orderSummary.object} />;
        },
      },


      
    },
  });

  return {
    id: nanoid(),
    role: "assistant",
    display: result.value,
  };
}

export const AI = createAI<ServerMessage[], ClientMessage[]>({
  actions: {
    continueConversation,
  },
  initialAIState: [],
  initialUIState: [],
});
