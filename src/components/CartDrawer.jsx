import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useCartStore } from '../store/cartStore'
import PriceTag from './PriceTag'

// This is a slide-in cart drawer — controlled via a global state atom
// We'll use a simple window event to toggle it
export let openCartDrawer = () => {}
export let closeCartDrawer = () => {}

import { useState, useEffect } from 'react'

export default function CartDrawer() {
  const [isOpen, setIsOpen] = useState(false)
  const { items, removeFromCart, updateQuantity, getTotalPrice, getTotalSavings } = useCartStore()

  useEffect(() => {
    openCartDrawer = () => setIsOpen(true)
    closeCartDrawer = () => setIsOpen(false)
  }, [])

  const totalPrice = getTotalPrice()
  const totalSavings = getTotalSavings()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
          />
          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full max-w-sm bg-white z-50 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-5 bg-gradient-to-r from-green-800 to-green-700 text-white flex items-center justify-between">
              <div>
                <h2 className="font-display text-xl font-bold">Your Cart 🛒</h2>
                <p className="text-sm text-green-200">{items.length} item{items.length !== 1 ? 's' : ''}</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center gap-4 py-10">
                  <div className="text-6xl animate-float">🌿</div>
                  <p className="font-display text-xl text-forest">Your cart is empty</p>
                  <p className="text-gray-500 text-sm">Add some natural goodness!</p>
                  <Link
                    to="/cart"
                    onClick={() => setIsOpen(false)}
                    className="btn-forest mt-2"
                  >
                    Browse Products
                  </Link>
                </div>
              ) : (
                items.map(item => {
                  const price = item.is_offer_active
                    ? (item.special_price || item.offer_price || item.mrp)
                    : item.mrp
                  return (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="bg-gray-50 rounded-2xl p-3 flex gap-3"
                    >
                      <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-gradient-to-br from-green-50 to-amber-50">
                        {item.images?.[0] ? (
                          <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-2xl">🌿</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-forest leading-tight line-clamp-1">{item.name}</p>
                        <p className="text-xs text-amber-600 font-medium mb-1">{item.size}</p>
                        <p className="text-sm font-bold text-green-700">₹{price}</p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-6 h-6 rounded-full bg-white border border-gray-200 text-forest font-bold text-sm flex items-center justify-center hover:bg-red-50 hover:border-red-200 transition-colors"
                          >−</button>
                          <span className="text-sm font-semibold w-4 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-6 h-6 rounded-full bg-white border border-gray-200 text-forest font-bold text-sm flex items-center justify-center hover:bg-green-50 hover:border-green-200 transition-colors"
                          >+</button>
                        </div>
                      </div>
                      <div className="flex flex-col items-end justify-between">
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-gray-300 hover:text-red-500 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                        <p className="text-sm font-bold text-forest">₹{price * item.quantity}</p>
                      </div>
                    </motion.div>
                  )
                })
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-4 border-t border-gray-100 bg-white space-y-3">
                {totalSavings > 0 && (
                  <div className="bg-green-50 rounded-xl p-3 flex items-center justify-between">
                    <span className="text-green-700 text-sm font-medium">🎉 You're saving</span>
                    <span className="text-green-700 font-bold">₹{totalSavings}</span>
                  </div>
                )}
                <div className="flex items-center justify-between px-1">
                  <span className="font-semibold text-gray-700">Total</span>
                  <span className="font-display font-bold text-xl text-forest">₹{totalPrice}</span>
                </div>
                <Link
                  to="/checkout"
                  onClick={() => setIsOpen(false)}
                  className="btn-primary w-full text-center block"
                >
                  Proceed to Checkout →
                </Link>
                <Link
                  to="/cart"
                  onClick={() => setIsOpen(false)}
                  className="block text-center text-sm text-gray-500 hover:text-forest transition-colors"
                >
                  View Full Cart
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
