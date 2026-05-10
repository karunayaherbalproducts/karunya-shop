import { useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'

export default function OrderSuccess() {
  const { state } = useLocation()
  const confettiFired = useRef(false)
  const order = state?.order
  const items = state?.items || []
  const form = state?.form || {}
  const total = state?.total || 0

  useEffect(() => {
    if (!confettiFired.current) {
      confettiFired.current = true
      const fire = (particleRatio, opts) => {
        confetti(Object.assign({}, {
          origin: { y: 0.6 },
          colors: ['#1B4332', '#C9A84C', '#2D6A4F', '#E8C96B', '#FDF6EC'],
        }, opts, { particleCount: Math.floor(200 * particleRatio) }))
      }
      fire(0.25, { spread: 26, startVelocity: 55 })
      fire(0.2, { spread: 60 })
      fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 })
      fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 })
      fire(0.1, { spread: 120, startVelocity: 45 })
    }
  }, [])

  return (
    <div className="min-h-screen pt-20 bg-cream flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        {/* Success Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', damping: 15 }}
          className="card p-8 sm:p-12 text-center mb-6"
        >
          {/* Animated Checkmark */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', damping: 10 }}
            className="w-24 h-24 bg-gradient-to-br from-green-600 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl"
          >
            <motion.svg
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="w-12 h-12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <motion.path d="M5 13l4 4L19 7" />
            </motion.svg>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="font-display text-3xl sm:text-4xl font-bold text-forest mb-3"
          >
            Order Placed! 🌿
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-gray-600 text-lg leading-relaxed max-w-md mx-auto"
          >
            🌿 Thank you! Your Karunya order has been placed. We'll deliver nature's goodness to your doorstep soon.
          </motion.p>

          {order?.id && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-4 inline-block bg-green-50 border border-green-200 rounded-full px-5 py-2"
            >
              <span className="text-green-700 text-sm font-medium">Order ID: </span>
              <span className="text-green-800 font-bold text-sm">{String(order.id).slice(0, 13).toUpperCase()}</span>
            </motion.div>
          )}
        </motion.div>

        {/* Order Details */}
        {items.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="card p-6 mb-6"
          >
            <h2 className="font-display text-xl font-bold text-forest mb-4">Items Ordered</h2>
            <div className="space-y-3">
              {items.map((item, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="font-semibold text-forest text-sm">{item.name}</p>
                    <p className="text-xs text-amber-600">{item.size} × {item.qty}</p>
                  </div>
                  <p className="font-bold text-forest">₹{item.price * item.qty}</p>
                </div>
              ))}
              <div className="flex justify-between font-bold text-lg pt-2">
                <span className="text-forest">Total Paid</span>
                <span className="text-forest">₹{total}</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Delivery Address */}
        {form.village && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="card p-6 mb-6"
          >
            <h2 className="font-display text-xl font-bold text-forest mb-3">📍 Delivery Address</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              {[form.door_no, form.street, form.village, form.taluk, form.district, form.pincode].filter(Boolean).join(', ')}
            </p>
            {form.mobile && (
              <p className="mt-2 text-sm text-gray-600">📞 {form.mobile}</p>
            )}
          </motion.div>
        )}

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link to="/" className="btn-primary flex-1 text-center py-4 text-base">
            🌿 Continue Shopping
          </Link>
          <a
            href="https://wa.me/919994436368"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline flex-1 text-center py-4 text-base"
          >
            💬 Track via WhatsApp
          </a>
        </motion.div>

        {/* Note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center text-gray-400 text-sm mt-6"
        >
          Questions? Call us at{' '}
          <a href="tel:+919994436368" className="text-forest font-medium hover:underline">+91 9994436368</a>
        </motion.p>
      </div>
    </div>
  )
}
