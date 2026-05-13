import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      addToCart: (product, quantity = 1) => {
        const items = get().items
        const existing = items.find(item => item.id === product.id)
        if (existing) {
          set({
            items: items.map(item =>
              item.id === product.id
                ? { ...item, quantity: Math.min(item.quantity + quantity, 10) }
                : item
            )
          })
        } else {
          set({ items: [...items, { ...product, quantity }] })
        }
      },

      removeFromCart: (id) => {
        set({ items: get().items.filter(item => item.id !== id) })
      },

      updateQuantity: (id, quantity) => {
        if (quantity < 1) {
          set({ items: get().items.filter(item => item.id !== id) })
        } else {
          set({
            items: get().items.map(item =>
              item.id === id ? { ...item, quantity: Math.min(quantity, 10) } : item
            )
          })
        }
      },

      clearCart: () => set({ items: [] }),

      getTotalItems: () => get().items.reduce((sum, item) => sum + item.quantity, 0),

      getTotalPrice: () =>
        get().items.reduce((sum, item) => {
          const price = (item.is_offer_active && item.special_price)
            ? item.special_price
            : (item.offer_price || item.mrp)
          return sum + price * item.quantity
        }, 0),

      getTotalMRP: () =>
        get().items.reduce((sum, item) => sum + item.mrp * item.quantity, 0),

      getTotalSavings: () => {
        const mrp = get().getTotalMRP()
        const price = get().getTotalPrice()
        return mrp - price
      },
    }),
    { name: 'karunya-cart' }
  )
)
