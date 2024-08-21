"use server";

import { createAI, getMutableAIState, streamUI } from "ai/rsc";
import { openai, createOpenAI } from "@ai-sdk/openai";
import z from "zod";

import { ReactNode } from "react";
import { generateObject, tool } from "ai";
import { SelectCoffee, selectCoffeeSchema } from "./select-coffee";
import { SelectCoffeeComponent } from "./select-coffee-component";
import { nanoid } from "nanoid";

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
    role: "system",
    content: `You are a helpful barista at a coffee shop. You are tasked with helping customers with their orders.
    \n\n
    Your coffee shop sells the following products:
    \n\n
    - Espresso
    - Latte
    - Cappuccino
    \n\n

    `,
  };

  const groq = createOpenAI({
    baseURL: "https://api.groq.com/openai/v1",
    apiKey: process.env.GROQ_API_KEY,
  });

  const result = await streamUI({
    model: openai("gpt-4o-mini"),
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
        description: "Tell a joke based on the user's location",
        parameters: z.object({
          location: z.string().describe("The location of the user"),
        }),
        generate: async function* ({ location }) {
          yield <div> Loading.... </div>;
          const selecCoffee = await generateObject({
            model: openai("gpt-4o-mini"),
            schema: selectCoffeeSchema,
            prompt: `Tell a joke about ${location}`,
          });
          return <SelectCoffeeComponent selectCoffee={selecCoffee.object} />;
        },
      },
    },

    toolChoice: "auto",
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
