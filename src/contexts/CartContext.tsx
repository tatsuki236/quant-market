import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export type CartItem = {
  productId: string;
  name: string;
  price: number;
  platform: string;
  market: string;
  image: string;
};

type CartContextType = {
  items: CartItem[];
  addItem: (item: CartItem) => boolean;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  totalPrice: number;
  itemCount: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = "quantmarket-cart";

function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore corrupted data
  }
  return [];
}

function saveCart(items: CartItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(loadCart);

  useEffect(() => {
    saveCart(items);
  }, [items]);

  const addItem = (item: CartItem): boolean => {
    if (items.some((i) => i.productId === item.productId)) {
      return false; // already in cart
    }
    setItems((prev) => [...prev, item]);
    return true;
  };

  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalPrice = items.reduce((sum, i) => sum + i.price, 0);
  const itemCount = items.length;

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clearCart, totalPrice, itemCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
}
