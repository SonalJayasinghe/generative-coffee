import { AI } from "./actions";
import HomeUI from "./HomeUI";
import { SelectCoffeeComponent } from "../components/select-coffee-component";
import { OrderSummaryComponent } from "@/components/order-summary-component";
export default function Page() {
  return (
    <>
      <AI>
        <HomeUI />
      </AI>
    </>
  );
}
