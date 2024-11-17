import { TOrders } from "./orderType";

export type TMenuItem = {
  _id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  menu: string;
}

export type TMenu = {
  _id: string;
  title: string;
  description: string;
  menuItems: TMenuItem[]
}

export type TRestaurant = {
  _id: string;
  user: string;
  restaurantName: string;
  city: string;
  country: string;
  deliveryTime: number;
  cuisines: string[];
  menus: TMenu[];
  imageUrl: string;
}

export type TSearchedRestaurant = {
  data: TRestaurant[]
}

export type TAllRestaurants = {
  data: TRestaurant[]
}

export type TRestaurantState = {
  loading: boolean;
  restaurant: TRestaurant | null;
  searchedRestaurant: TRestaurant[] | null;
  appliedFilter: string[];
  singleRestaurant: TRestaurant | null,
  allRestaurant: TRestaurant[] | null,
  restaurantOrder: TOrders[],
  createRestaurant: (formData: FormData) => Promise<void>;
  getRestaurant?: () => Promise<void>;
  updateRestaurant: (formData: FormData) => Promise<void>;
  searchRestaurant: (searchQuery: string, selectedCuisines: any) => Promise<void>;
  addMenuToRestaurant: (menu: TMenuItem) => void;
  updateMenuToRestaurant: (menu: TMenuItem) => void;
  manageAppliedFilter: (value:string) => void;
  removeAppliedFilter: () => void;
  getSingleRestaurant: (restaurantId:string) => Promise<void>;
  getAllRestaurant: () => Promise<void>;
  getRestaurantOrders: () => Promise<void>;
  updateRestaurantOrderStatus: (orderId:string, status:string) => Promise<void>;
}