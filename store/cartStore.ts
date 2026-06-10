import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { CartItem, Product } from '@/types';

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  // Actions
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (product: Product, talla: string, precioFinal: number) => void;
  removeItem: (productId: string, talla: string) => void;
  updateQuantity: (productId: string, talla: string, quantity: number) => void;
  clearCart: () => void;
  // Computed helpers (as actions for simplicity)
  getItemCount: () => number;
  getSubtotal: () => number;
  getTotalSavings: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),

      addItem: (product, talla, precioFinal) => {
        set((state) => {
          const existing = state.items.find(
            (i) => i.product._id === product._id && i.talla === talla
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.product._id === product._id && i.talla === talla
                  ? { ...i, cantidad: i.cantidad + 1 }
                  : i
              ),
            };
          }
          return {
            items: [
              ...state.items,
              { product, talla, cantidad: 1, precioFinal },
            ],
          };
        });
      },

      removeItem: (productId, talla) =>
        set((state) => ({
          items: state.items.filter(
            (i) => !(i.product._id === productId && i.talla === talla)
          ),
        })),

      updateQuantity: (productId, talla, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId, talla);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.product._id === productId && i.talla === talla
              ? { ...i, cantidad: quantity }
              : i
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      getItemCount: () =>
        get().items.reduce((sum, i) => sum + i.cantidad, 0),

      getSubtotal: () =>
        get().items.reduce((sum, i) => sum + i.precioFinal * i.cantidad, 0),

      getTotalSavings: () =>
        get().items.reduce((sum, i) => {
          const originalPrice = i.product.precio_antes ?? i.product.precio;
          const saving = (originalPrice - i.precioFinal) * i.cantidad;
          return sum + Math.max(0, saving);
        }, 0),
    }),
    {
      name: 'ishyne-cart',
      storage: createJSONStorage(() =>
        typeof window !== 'undefined' ? localStorage : ({} as Storage)
      ),
    }
  )
);
