import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useCartStore } from '../store/cartStore'
import PriceTag from '../components/PriceTag'

export default function Cart() {
  const { items, removeFromCart, updateQuantity, getTotalPrice, getTotalMRP, getTotalSavings } = useCartStore()
  const total = getTotalPrice()
  const savings = getTotalSavings()

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-24 bg-cream flex items-center justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center px-4">
          <div className="text-8xl mb-6 animate-float">🌿</div>
          <h1 className="font-display text-3xl text-forest mb-3">Your cart is empty</h1>
          <p className="text-gray-500 mb-8">Add some natural goodness to your cart!</p>
          <Link to="/" className="btn-primary text-base px-8 py-4">Browse Products</Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 bg-cream">
      <div className="container-max section-padding">
        <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="font-display text-3xl sm:text-4xl text-forest mb-8">
          Shopping Cart 🛒
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, i) => {
              const price = item.is_offer_active
                ? (item.special_price || item.offer_price || item.mrp)
                : item.mrp
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="card p-4 sm:p-6 flex gap-4 sm:gap-6"
                >
                  <Link to={`/product/${item.id}`} className="shrink-0">
                    <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl overflow-hidden bg-gradient-to-br from-green-50 to-amber-50">
                      {item.images?.[0] ? (
                        <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl">🌿</div>
                      )}
                    </div>
                  </Link>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <Link to={`/product/${item.id}`}>
                          <h3 className="font-display text-lg font-semibold text-forest hover:text-gold transition-colors">{item.name}</h3>
                        </Link>
                        <span className="inline-block mt-1 px-3 py-0.5 bg-amber-100 text-amber-700 rounded-full text-xs font-semibold">{item.size}</span>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="text-gray-300 hover:text-red-500 transition-colors p-1">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                    <div className="mt-3">
                      <PriceTag product={item} size="sm" />
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 rounded-full border-2 border-forest text-forest font-bold hover:bg-forest hover:text-white transition-all text-sm"
                        >−</button>
                        <span className="font-bold text-base w-5 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 rounded-full border-2 border-forest text-forest font-bold hover:bg-forest hover:text-white transition-all text-sm"
                        >+</button>
                      </div>
                      <p className="font-display font-bold text-forest text-lg">₹{price * item.quantity}</p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Summary */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <h2 className="font-display text-xl font-bold text-forest mb-5">Order Summary</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                  <span>₹{getTotalMRP()}</span>
                </div>
                {savings > 0 && (
                  <div className="flex justify-between text-green-600 font-semibold">
                    <span>🎉 You Save</span>
                    <span>−₹{savings}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Delivery</span>
                  <span className="text-green-600 font-medium">FREE</span>
                </div>
                <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-lg">
                  <span className="text-forest">Total</span>
                  <span className="text-forest">₹{total}</span>
                </div>
              </div>
              {savings > 0 && (
                <div className="mt-4 bg-green-50 rounded-xl p-3 text-center">
                  <p className="text-green-700 text-sm font-medium">🌿 You're saving ₹{savings} on this order!</p>
                </div>
              )}
              <Link to="/checkout" className="btn-primary w-full text-center block mt-6 py-4">
                Proceed to Order →
              </Link>
              <Link to="/" className="block text-center text-sm text-gray-500 hover:text-forest mt-3 transition-colors">
                ← Continue Shopping
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
