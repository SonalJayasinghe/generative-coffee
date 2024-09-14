"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Separator } from "./ui/separator";
import { OrderSummary } from "@/app/order-summary";
import { Progress } from "@/components/ui/progress";

export const OrderSummaryComponent = ({
  orderSummary,
}: {
  orderSummary?: OrderSummary;
}) => {
  const time = new Date().toJSON().slice(0, 10);

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const increment = 100 / (5000 / 50);
    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prevProgress + increment;
      });
    }, 100);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-neutral-100 flex flex-col flex-grow justify-start p-4 rounded-md w-fit ">
      <div className=" justify-start flex">
        <div>
          <Card className="overflow-hidden w-96" x-chunk="dashboard-05-chunk-4">
            <CardHeader className="flex flex-row items-start bg-green-900">
              <div className="grid gap-0.5">
                <CardTitle className="group flex items-center gap-2 text-lg text-white">
                  Order 123456
                </CardTitle>
                <CardDescription className=" text-slate-200">
                  Date: {time}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-6 text-sm">
              <div className="grid gap-3">
                <div className="font-semibold">Order Details</div>
                <ul className="grid gap-3">
                  {orderSummary?.products!.map((product) => (
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        {product?.name} x <span>{product?.quantity}</span>
                      </span>
                      <span>LKR. {product?.price}</span>
                    </li>
                  ))}
                </ul>
                <Separator className="my-2" />

                <ul className="grid gap-3">
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>LKR. {orderSummary?.subtotal}</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">Delivery</span>
                    <span>LKR. {orderSummary?.deliveryCost}</span>
                  </li>
                  <li className="flex items-center justify-between font-semibold">
                    <span className="text-muted-foreground">Total</span>
                    <span>LKR. {orderSummary?.total}</span>
                  </li>
                </ul>
              </div>

              <Separator className="my-4" />
              <div className="grid gap-3">
                <div className="font-semibold">Delivery Information</div>
                <dl className="grid gap-3">
                  <div className="flex items-center justify-between">
                    <dt className="text-muted-foreground">Customer</dt>
                    <dd>{orderSummary?.customerName}</dd>
                  </div>

                  <div className="flex items-center justify-between">
                    <dt className="text-muted-foreground">Phone</dt>
                    <dd>
                      <a href="tel:">{orderSummary?.customerContact}</a>
                    </dd>
                  </div>

                  <div className="flex items-center justify-between">
                    <dt className="text-muted-foreground">Address</dt>
                    <dd>
                      <address>{orderSummary?.customerAdress}</address>
                    </dd>
                  </div>
                </dl>
              </div>
              <Separator className="my-4" />
              <div className="grid gap-3">
                <div className="font-semibold">Payment Information</div>
                <dl className="grid gap-3">
                  <div className="flex items-center justify-between">
                    <dt className="text-muted-foreground">Payment Method</dt>
                    <dd>{orderSummary?.customerPaymentMethod}</dd>
                  </div>
                </dl>
              </div>
              <Separator className="my-4" />
              <div className="grid gap-3">
                <div className="font-semibold">Order Status</div>
                <div className="flex flex-col items-center justify-center">
                  <Progress value={progress} />
                  {progress === 100 ? 
                    <div className="text-green-900 font-semibold">Coffee is Ready!</div>
                  :
                  <div className=" animate-pulse">Prepairing...</div>
                  }
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
