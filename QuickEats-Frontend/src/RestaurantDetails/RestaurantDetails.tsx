// import { useRestaurantStore } from "@/store/useRestaurantStore";

import { Timer } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import RestuarantMenu from "./RestaurantMenu";
import { Badge } from "../components/ui/badge";

const RestaurantDetails = () => {
  const params = useParams();
  // const { singleRestaurant, getSingleRestaurant } = useRestaurantStore();

  // to be removed later starts
  const [singleRestaurant, setSingleRestaurant] = useState<any>({
      imageUrl: "pic",
      restaurantName: "one retaurant",
      cuisines: ["Italian", "Chinese", "Mexican"],
      deliveryTime: "8:10",
      menus: [
        {
          _id:1,
          name: "daal chawal",
          description:" dfkjsldfj sdjfkljsd djfkdjfdf jdfkj",
          price: 105,
          image: "foodImage"
        },
        {
          _id:1,
          name: "daal chawal",
          description:" dfkjsldfj sdjfkljsd djfkdjfdf jdfkj",
          price: 105,
          image: "foodImage"
        },
        {
          _id:1,
          name: "daal chawal",
          description:" dfkjsldfj sdjfkljsd djfkdjfdf jdfkj",
          price: 105,
          image: "foodImage"
        },
        {
          _id:1,
          name: "daal chawal",
          description:" dfkjsldfj sdjfkljsd djfkdjfdf jdfkj",
          price: 105,
          image: "foodImage"
        },
      ]
  });
  const getSingleRestaurant = (id: string) => {
    
  };
  // to be removed later ends
  

  useEffect(() => {
    getSingleRestaurant(params.id!); 
    
  }, [params.id]);
  console.log(singleRestaurant);
  
  return (
    <div className="max-w-6xl mx-auto my-10">
      <div className="w-full">
        <div className="relative w-full h-32 md:h-64 lg:h-72">
          <img
            src={singleRestaurant?.imageUrl || "Loading..."}
            alt="res_image"
            className="object-cover w-full h-full rounded-lg shadow-lg"
          />
        </div>
        <div className="flex flex-col md:flex-row justify-between">
          <div className="my-5">
            <h1 className="font-medium text-xl">{singleRestaurant?.restaurantName || "Loading..."}</h1>
            <div className="flex gap-2 my-2">
              {singleRestaurant?.cuisines.map((cuisine: string, idx: number) => (
                <Badge key={idx}>{cuisine}</Badge>
              ))}
            </div>
            <div className="flex md:flex-row flex-col gap-2 my-5">
              <div className="flex items-center gap-2">
                <Timer className="w-5 h-5" />
                <h1 className="flex items-center gap-2 font-medium">
                  Delivery Time: <span className="text-[#D19254]">{singleRestaurant?.deliveryTime || "NA"} mins</span>
                </h1>
              </div>
            </div>
          </div>
        </div>
       {singleRestaurant?.menus && <RestuarantMenu menus = {singleRestaurant?.menus!}/>} 
      </div>
    </div>
  );
};

export default RestaurantDetails;