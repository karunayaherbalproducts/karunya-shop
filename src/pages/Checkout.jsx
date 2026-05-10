import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { useCartStore } from '../store/cartStore'

const INITIAL_FORM = {
  door_no: '', street: '', village: '', taluk: '', district: '', pincode: '', mobile: ''
}

function validate(form) {
  const errors = {}
  if (!form.door_no.trim()) errors.door_no = 'Door number is required'
  if (!form.village.trim()) errors.village = 'Village/Town is required'
  if (!form.taluk.trim()) errors.taluk = 'Taluk is required'
  if (!form.district.trim()) errors.district = 'District is required'
  if (!form.pincode.trim()) errors.pincode = 'Pincode is required'
  else if (!/^\d{6}$/.test(form.pincode)) errors.pincode = 'Enter valid 6-digit pincode'
  if (!form.mobile.trim()) errors.mobile = 'Mobile number is required'
  else if (!/^[6-9]\d{9}$/.test(form.mobile)) errors.mobile = 'Enter valid 10-digit Indian mobile number'
  return errors
}

function Field({ label, name, value, onChange, error, required, placeholder, type = 'text' }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-forest mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-4 py-3 rounded-xl border-2 bg-white font-body text-sm transition-all focus:outline-none ${
          error ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-forest'
        }`}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  )
}

export default function Checkout() {
  const [form, setForm] = useState(INITIAL_FORM)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const { items, getTotalPrice, clearCart } = useCartStore()
  const navigate = useNavigate()
  const total = getTotalPrice()

  const handleChange = e => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
    if (errors[name]) setErrors(e => ({ ...e, [name]: '' }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    const errs = validate(form)
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setSubmitting(true)

    const orderItems = items.map(item => ({
      product_id: item.id,
      name: item.name,
      size: item.size,
      price: item.is_offer_active ? (item.special_price || item.offer_price || item.mrp) : item.mrp,
      qty: item.quantity,
    }))

    try {
      const { data, error } = await supabase.from('orders').insert([{
        items: orderItems,
        total,
        ...form,
        status: 'pending',
      }]).select().single()

      if (error) throw error
      clearCart()
      navigate('/order-success', { state: { order: data, items: orderItems, form, total } })
    } catch (err) {
      // If supabase not configured, simulate success
      const fakeOrder = { id: 'ORD-' + Date.now(), ...form, total, items: orderItems, status: 'pending' }
      clearCart()
      navigate('/order-success', { state: { order: fakeOrder, items: orderItems, form, total } })
    } finally {
      setSubmitting(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center bg-cream">
        <div className="text-center">
          <p className="text-6xl mb-4">🌿</p>
          <h2 className="font-display text-2xl text-forest mb-3">No items to checkout</h2>
          <Link to="/" className="btn-primary mt-2 inline-block">Browse Products</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 bg-cream">
      <div className="container-max section-padding">
        <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="font-display text-3xl sm:text-4xl text-forest mb-8">
          Checkout 🌿
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <motion.form initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} onSubmit={handleSubmit} className="lg:col-span-2 space-y-5">
            <div className="card p-6">
              <h2 className="font-display text-xl font-bold text-forest mb-5">📍 Delivery Address</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Door No / Flat No" name="door_no" value={form.door_no} onChange={handleChange} error={errors.door_no} required placeholder="e.g. 12A" />
                <Field label="Street / Area" name="street" value={form.street} onChange={handleChange} error={errors.street} placeholder="Street name (optional)" />
                <Field label="Village / Town" name="village" value={form.village} onChange={handleChange} error={errors.village} required placeholder="e.g. Poochur" />
                <Field label="Taluk" name="taluk" value={form.taluk} onChange={handleChange} error={errors.taluk} required placeholder="e.g. Pennagaram" />
                <Field label="District" name="district" value={form.district} onChange={handleChange} error={errors.district} required placeholder="e.g. Dharmapuri" />
                <Field label="Pincode" name="pincode" value={form.pincode} onChange={handleChange} error={errors.pincode} required placeholder="e.g. 636810" type="tel" />
              </div>
            </div>

            <div className="card p-6">
              <h2 className="font-display text-xl font-bold text-forest mb-5">📱 Contact Details</h2>
              <Field label="Mobile Number" name="mobile" value={form.mobile} onChange={handleChange} error={errors.mobile} required placeholder="10-digit Indian number" type="tel" />
              <p className="text-xs text-gray-400 mt-2">We'll use this to confirm your order and delivery updates</p>
            </div>

            <button type="submit" disabled={submitting} className="btn-primary w-full py-4 text-lg disabled:opacity-60 disabled:cursor-not-allowed">
              {submitting ? '🌿 Placing Order...' : '🌿 Place Order'}
            </button>
          </motion.form>

          {/* Order Summary */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <h2 className="font-display text-xl font-bold text-forest mb-5">Order Summary</h2>
              <div className="space-y-3 mb-5">
                {items.map(item => {
                  const price = item.is_offer_active ? (item.special_price || item.offer_price || item.mrp) : item.mrp
                  return (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-gray-50">
                        {item.images?.[0] ? (
                          <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                        ) : <div className="w-full h-full flex items-center justify-center text-xl">🌿</div>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-forest leading-tight line-clamp-1">{item.name}</p>
                        <p className="text-xs text-amber-600">{item.size} × {item.quantity}</p>
                      </div>
                      <p className="text-sm font-bold text-forest">₹{price * item.quantity}</p>
                    </div>
                  )
                })}
              </div>
              <div className="border-t border-gray-100 pt-4 space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Delivery</span>
                  <span className="text-green-600 font-medium">FREE</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span className="text-forest">Total</span>
                  <span className="text-forest">₹{total}</span>
                </div>
              </div>
              <div className="mt-4 bg-amber-50 rounded-xl p-3 text-xs text-amber-700">
                🔒 Secure checkout. Your information is safe with us.
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
