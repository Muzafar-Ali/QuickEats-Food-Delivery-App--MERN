import { CartState } from "@/types/cartType";
import { TMenuItem } from "@/types/restaurantType";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";


export const useCartStore = create<CartState>()(persist((set) => ({
  cart: [],
  addToCart: (item: TMenuItem) => {
    set((state) => {
      const exisitingItem = state.cart.find((cartItem) => cartItem._id === item._id);
      if (exisitingItem) {
        // already added in cart then inc qty
        return {
          cart: state?.cart.map((cartItem) => cartItem._id === item._id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
          )
        };
      } else {
        // add cart
        return {
          cart: [...state.cart, { ...item, quantity: 1 }]
        }
      }
    })
  },
  clearCart: () => {
    set({ cart: [] });
  },
  removeFromTheCart: (id: string) => {
    set((state) => ({
      cart: state.cart.filter((item) => item._id !== id)
    }))
  },
  increaseQuantity: (id: string) => {
    set((state) => ({
      cart: state.cart.map((item) => item._id === id ? { ...item, quantity: item.quantity + 1 } : item)
    }))
  },
  decreasetQuantity: (id: string) => {
    set((state) => ({
      cart: state.cart.map((item) => item._id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item)
    }))
  }
}),
  {
    name: 'cart-name',
    storage: createJSONStorage(() => localStorage)
  }
))