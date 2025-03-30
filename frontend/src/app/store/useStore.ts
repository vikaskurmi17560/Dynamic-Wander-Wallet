import { create } from "zustand";

interface Trip {
  _id: string;
  tripName: string;
  state: string;
  city: string;
  destination: string;
}

interface CartStore {
  cart: Trip[];
  addToCart: (trip: Trip) => void;
  removeFromCart: (id: string) => void;
}

const useCartStore = create<CartStore>((set) => {
  const storedCart = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("cart") || "[]") : [];

  return {
    cart: storedCart,

    addToCart: (trip) =>
      set((state) => {
        const updatedCart = [...state.cart, trip];
        localStorage.setItem("cart", JSON.stringify(updatedCart)); 
        return { cart: updatedCart };
      }),

    removeFromCart: (id) =>
      set((state) => {
        const updatedCart = state.cart.filter((trip) => trip._id !== id);
        localStorage.setItem("cart", JSON.stringify(updatedCart)); 
        return { cart: updatedCart };
      }),
  };
});

export default useCartStore;
