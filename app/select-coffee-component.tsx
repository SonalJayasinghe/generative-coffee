"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SelectCoffee } from "./select-coffee";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
export const SelectCoffeeComponent = ({
  selectCoffee,
}: {
  selectCoffee?: SelectCoffee;
}) => {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  return (
    <div className="bg-neutral-100 h-96 flex flex-col flex-grow justify-start items-center p-4 rounded-md m-4 w-fit ">
        <div>What do you like to order?</div>
        <div className="mt-10">
          <ToggleGroup
            type="single"
            value={selectedMethod!}
            onValueChange={setSelectedMethod}
          >
            <ToggleGroupItem value="card">
              <Card
                className={`p-4 flex flex-col items-center ${
                  selectedMethod === "card"
                    ? "border-2 border-white"
                    : "border border-gray-600"
                }`}
              >
                <CardHeader>
                  <CardTitle>Card</CardTitle>
                </CardHeader>
              </Card>
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>
  );
};
