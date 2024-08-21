import { AI } from "./actions";
import HomeUI from "./HomeUI";
import { SelectCoffeeComponent } from "./select-coffee-component";
export default function Page() {
    return (
      <>
        <AI>
          {/* <HomeUI /> */}
          <SelectCoffeeComponent />
        </AI>
      </>
    );
  }
  