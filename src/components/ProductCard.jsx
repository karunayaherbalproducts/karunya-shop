import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useCartStore } from '../store/cartStore'
import PriceTag from './PriceTag'

export default function ProductCard({ product, view = 'grid' }) {
  const [adding, setAdding] = useState(false)
  const [added, setAdded] = useState(false)
  const addToCart = useCartStore(s => s.addToCart)
  const navigate = useNavigate()

  const mainImage = product.images?.[0]
  const activePrice = (product.is_offer_active && product.special_price)
    ? product.special_price
    : (product.offer_price || product.mrp)

  const handleAddToCart = (e) => {
    e.preventDefault()
    setAdding(true)
    addToCart(product, 1)
    setTimeout(() => {
      setAdding(false)
      setAdded(true)
      setTimeout(() => setAdded(false), 2000)
    }, 400)
  }

  if (view === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="card flex gap-4 p-4 sm:gap-6 sm:p-6"
      >
        <Link to={`/product/${product.id}`} className="shrink-0">
          <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden bg-gradient-to-br from-green-50 to-amber-50">
            {mainImage ? (
              <img
                src={mainImage}
                alt={product.name}
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl">🌿</div>
            )}
          </div>
        </Link>
        <div className="flex-1 flex flex-col justify-between min-w-0">
          <div>
            <div className="flex items-start justify-between gap-2 flex-wrap">
              <div>
                <Link to={`/product/${product.id}`}>
                  <h3 className="font-display text-lg font-semibold text-forest hover:text-gold transition-colors leading-tight">
                    {product.name}
                  </h3>
                </Link>
                <span className="inline-block mt-1 px-3 py-0.5 bg-amber-100 text-amber-700 rounded-full text-xs font-semibold">
                  {product.size}
                </span>
              </div>
              {product.stock_status === 'in_stock' ? (
                <span className="shrink-0 text-xs text-green-600 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block"></span>In Stock
                </span>
              ) : (
                <span className="shrink-0 text-xs text-red-500 font-medium">Out of Stock</span>
              )}
            </div>
            <p className="mt-2 text-sm text-gray-500 line-clamp-2">{product.description}</p>
          </div>
          <div className="mt-3 flex items-center justify-between flex-wrap gap-3">
            <PriceTag product={product} size="md" />
            <div className="w-full sm:w-auto mt-2 sm:mt-0">
              <Link
                to={`/product/${product.id}`}
                className="btn-primary block w-full sm:w-auto text-center text-sm py-2 px-8"
              >
                Buy
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  // Grid view
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="card flex flex-col group"
    >
      <Link to={`/product/${product.id}`} className="block relative overflow-hidden bg-gradient-to-br from-green-50 to-amber-50 aspect-square">
        {product.is_offer_active && (
          <div className="absolute top-3 left-3 z-10">
            <span className="bg-gradient-to-r from-red-500 to-rose-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-md">
              SALE
            </span>
          </div>
        )}
        {product.stock_status !== 'in_stock' && (
          <div className="absolute inset-0 bg-white/60 z-10 flex items-center justify-center">
            <span className="bg-gray-800 text-white px-4 py-1.5 rounded-full text-sm font-semibold">Out of Stock</span>
          </div>
        )}
        {mainImage ? (
          <img
            src={mainImage}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl">🌿</div>
        )}
      </Link>

      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-1">
          <Link to={`/product/${product.id}`}>
            <h3 className="font-display text-base font-semibold text-forest hover:text-gold transition-colors leading-tight line-clamp-2">
              {product.name}
            </h3>
          </Link>
        </div>
        <span className="inline-block mb-3 px-3 py-0.5 bg-amber-100 text-amber-700 rounded-full text-xs font-semibold w-fit">
          {product.size}
        </span>

        <div className="mt-auto">
          <PriceTag product={product} size="md" />
          <div className="mt-3">
            <Link
              to={`/product/${product.id}`}
              className="btn-primary block w-full text-center text-sm py-2.5"
            >
              Buy
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
