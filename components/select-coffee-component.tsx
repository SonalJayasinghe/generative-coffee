"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SelectCoffee } from "../app/select-coffee";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ClientMessage, continueConversation } from "../app/actions";
import coffee from "@/public/coffee-mug.png";
import Image from "next/image";
import { useActions, useUIState } from "ai/rsc";
import { nanoid } from "nanoid";

export const SelectCoffeeComponent = ({
  selectCoffee,
}: {
  selectCoffee?: SelectCoffee;
}) => {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const [conversation, setConversation] = useUIState();
  const { continueConversation } = useActions();

  return (
    <div className="bg-neutral-100 flex flex-col flex-grow justify-start p-4 rounded-md w-fit ">
      <div className="text-xl font-semibold">Coffee Menu</div>
      <div className="text-sm text-neutral-600">Select a coffee to order</div>
      <div className=" mt-14 justify-start flex">
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setIsSubmitted(true);

            try{ 
            if (!selectedMethod) return;

            const prompt = `the user wants to order a ${selectedMethod}. 
              Please tell the subtotal and ask for the name, contact number, address and payment method (Credit Card / Cash) to complete the order.`;
            
            // const userChat = `I want to order a ${selectedMethod}`;
            // const userMessage: ClientMessage = {
            //   id: nanoid(),
            //   role: "user",
            //   display: userChat,
            // };
            // setConversation((currentConversation: ClientMessage[]) => [
            //   ...currentConversation,
            //   userMessage,
            // ]);
            
            // Continue the conversation
            const message = await continueConversation(prompt);

            setConversation((currentConversation: ClientMessage[]) => [
              ...currentConversation,
              message,
            ]);
          } catch (error) {
            setIsSubmitted(false);
          }

          }}
        >
          <ToggleGroup
            disabled={isSubmitted}
            type="single"
            value={selectedMethod!}
            onValueChange={setSelectedMethod}
          >
            {selectCoffee?.products &&
              selectCoffee.products.map((product) => (
                <ToggleGroupItem value={product?.name!} key={product?.name!}>
                  <div
                    className={`flex flex-col p-2 rounded-lg shadow-sm justify-start w-32 items-center transition-colors ${
                      selectedMethod === product?.name!
                        ? " bg-green-900 text-white"
                        : " bg-white hover:bg-green-50"
                    }`}
                  >
                    <Image src={coffee} alt="coffee" width={50} />
                    <div className="text-lg font-semibold">{product?.name}</div>
                    <div className="text-sm">LKR. {product?.price}</div>
                  </div>
                </ToggleGroupItem>
              ))}
          </ToggleGroup>
          <div className="flex mt-10 justify-end">
            {selectedMethod && (
              <Button
                
                type="submit"
                className="mt-4 bg-green-900 text-white cursor-pointer"
                disabled={isSubmitted}
              >
                Order
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
