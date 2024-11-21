import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { useRestaurantStore } from "@/store/restaurantStore";

export type FilterOptionsState = {
  id: string;
  label: string;
};
// agar applied filter k andr ye item exixt krta hia toh iska mtlb checked hai
const filterOptions: FilterOptionsState[] = [
  { id: "burger", label: "Burger" },
  { id: "sandwich", label: "sandwich" },
  { id: "biryani", label: "Biryani" },
  { id: "continental", label: "Continental" },
  { id: "pizza", label: "pizza" },
  { id: "broast", label: "broast" },
  { id: "cake & bakery", label: "cake & Bakery" },
  { id: "desserts", label: "Desserts" },
  { id: "chinese", label: "Chinese" },
  { id: "pakistani", label: "Pakistani" },
  { id: "indian", label: "Indian" },
  { id: "japanese", label: "Japanese" },
  { id: "momos", label: "Momos" },
];

const FilterPage = () => {
  const { manageAppliedFilter, appliedFilter, removeAppliedFilter } = useRestaurantStore();
  
  const appliedFilterHandler = (value: string) => {
    manageAppliedFilter(value);
  };

  return (
    <div className="">
      <div className="flex items-center justify-between">
        <h1 className="font-medium text-lg">Filter by cuisines</h1>
        <Button variant={"link"} onClick={removeAppliedFilter}>Clear Filters</Button>
      </div>
      {filterOptions.map((option) => (
        <div key={option.id} className="flex items-center space-x-2 my-5">
          <Checkbox
            id={option.id}
            checked={appliedFilter.includes(option.label)}
            onClick={() => appliedFilterHandler(option.label)}
          />
          <Label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {option.label}
          </Label>
        </div>
      ))}
    </div>
  );
};

export default FilterPage;