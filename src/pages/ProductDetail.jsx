import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { useCartStore } from '../store/cartStore'
import ImageSlider from '../components/ImageSlider'
import PriceTag from '../components/PriceTag'

const INGREDIENTS_DETAIL = [
  { name: 'Coconut Oil', emoji: '🥥', benefit: 'Deeply nourishes scalp, prevents breakage, and strengthens hair roots.' },
  { name: 'Castor Oil', emoji: '🌱', benefit: 'Thickens hair, moisturizes deeply, and boosts overall volume.' },
  { name: 'Fenugreek Seeds', emoji: '🌾', benefit: 'Reduces dandruff, controls hair fall, and enhances hair thickness.' },
  { name: 'Holy Basil (Tulsi)', emoji: '🌿', benefit: 'Fights scalp infections, soothes irritation, and promotes healthy growth.' },
  { name: 'Henna Leaves', emoji: '🍃', benefit: 'Conditions naturally, adds shine, and strengthens the hair shaft.' },
  { name: 'Amla', emoji: '🫐', benefit: 'Rich in Vitamin C, strengthens roots, and darkens hair naturally.' },
  { name: 'Bhringraj', emoji: '🌻', benefit: 'Stimulates growth, reduces hair fall, and strengthens from the root.' },
  { name: 'Vetiver (Khus)', emoji: '🌾', benefit: 'Cools the scalp, strengthens roots, calms irritation, and promotes shine.' },
  { name: 'Black Sesame', emoji: '⚫', benefit: 'Darkens hair, strengthens roots, and prevents premature graying.' },
  { name: 'Curry Leaves', emoji: '🍃', benefit: 'Promotes hair pigmentation, reduces fall, and strengthens follicles.' },
  { name: 'Hibiscus', emoji: '🌺', benefit: 'Stimulates growth, prevents graying, and adds natural hair volume.' },
  { name: 'Neem', emoji: '🌿', benefit: 'Prevents dandruff, fights bacteria, and promotes a healthy scalp.' },
  { name: 'Aloe Vera', emoji: '🌵', benefit: 'Hydrates scalp, reduces dandruff, and soothes inflammation naturally.' },
  { name: 'Rosemary', emoji: '🌱', benefit: 'Increases blood circulation, reduces flakes, and promotes new growth.' },
  { name: 'Brahmi', emoji: '🍀', benefit: 'Nourishes follicles, reduces fall, and promotes thickness and shine.' },
  { name: 'Shikakai', emoji: '🌾', benefit: 'Natural cleanser that conditions hair and prevents scalp issues.' },
  { name: 'Paneer Rose', emoji: '🌹', benefit: 'Soothes scalp, adds natural fragrance, improves blood flow, and enhances softness.' },
]

const HOW_TO_USE = [
  { step: '01', title: 'Apply to Scalp & Roots', desc: 'Part your hair into sections. Apply oil directly to scalp using fingertips or applicator bottle. Massage gently in circular motions for 5–10 minutes to boost circulation and stimulate hair follicles.' },
  { step: '02', title: 'Spread to Hair Length', desc: 'After massaging the scalp, apply the remaining oil along the length of your hair. Focus on the ends, especially if you have dry or damaged tips. This nourishes the hair strands and improves texture.' },
  { step: '03', title: 'Let It Soak In', desc: 'Leave the oil on for at least 1 hour. For deeper treatment, wrap hair with a towel or shower cap and leave it overnight. This allows the herbs to fully absorb and repair your scalp and hair.' },
  { step: '04', title: 'Wash with Mild Shampoo', desc: 'Use a gentle, sulfate-free herbal shampoo to wash off the oil. You may need two rinses depending on hair thickness. Avoid harsh chemical shampoos that strip away natural oils.' },
]

const DEMO_PRODUCT = {
  id: 'demo-500',
  name: 'Karunya Herbal Hair Oil',
  size: '500ml',
  description: 'Our flagship Ayurvedic hair oil is a powerful blend of 17 time-tested herbs and natural oils that revitalize your scalp and restore your hair\'s natural strength, shine, and volume. Crafted with care using ancient Ayurvedic wisdom and made with love for your crown.',
  mrp: 799,
  offer_price: 599,
  special_price: 499,
  is_offer_active: true,
  stock_status: 'in_stock',
  images: [],
  ingredients: '17 Powerful Natural Ingredients: Coconut Oil, Castor Oil, Fenugreek Seeds, Holy Basil (Tulsi), Henna Leaves, Amla, Bhringraj, Vetiver, Black Sesame, Curry Leaves, Hibiscus, Neem, Aloe Vera, Rosemary, Brahmi, Shikakai, Paneer Rose',
  how_to_use: 'Apply to scalp, massage for 5-10 minutes, leave for 1 hour or overnight, wash with mild shampoo.',
}

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState('description')
  const [adding, setAdding] = useState(false)
  const [added, setAdded] = useState(false)
  const addToCart = useCartStore(s => s.addToCart)

  useEffect(() => {
    fetchProduct()
  }, [id])

  async function fetchProduct() {
    if (id?.startsWith('demo-')) {
      setProduct(DEMO_PRODUCT)
      setLoading(false)
      return
    }
    try {
      const { data, error } = await supabase.from('products').select('*').eq('id', id).single()
      if (!error && data) setProduct(data)
      else setProduct(DEMO_PRODUCT)
    } catch {
      setProduct(DEMO_PRODUCT)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = () => {
    if (!product) return
    setAdding(true)
    addToCart(product, quantity)
    setTimeout(() => {
      setAdding(false)
      setAdded(true)
      setTimeout(() => setAdded(false), 2000)
    }, 400)
  }

  const handleBuyNow = () => {
    if (!product) return
    addToCart(product, quantity)
    navigate('/checkout')
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-green-200 border-t-forest rounded-full" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <p className="text-6xl mb-4">🌿</p>
          <h2 className="font-display text-2xl text-forest">Product not found</h2>
          <Link to="/" className="btn-primary mt-4 inline-block">Back to Home</Link>
        </div>
      </div>
    )
  }

  const TABS = ['description', 'ingredients', 'how-to-use']

  return (
    <div className="min-h-screen pt-20 bg-cream">
      <div className="container-max section-padding">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-forest transition-colors">Home</Link>
          <span>/</span>
          <span className="text-forest font-medium">{product.name} — {product.size}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Images */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <ImageSlider images={product.images || []} alt={product.name} height="500px" autoplay />
          </motion.div>

          {/* Info */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="badge-natural">🍃 100% Natural</span>
              <span className="badge-natural">🌿 Ayurvedic</span>
              {product.is_offer_active && (
                <span className="bg-red-100 text-red-600 text-xs font-bold px-2.5 py-1 rounded-full">SPECIAL OFFER</span>
              )}
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-forest leading-tight">
              {product.name}
            </h1>
            <p className="mt-1 text-amber-600 font-semibold text-lg">{product.size}</p>

            {/* Price */}
            <div className="mt-4 p-4 bg-green-50 rounded-2xl">
              <PriceTag product={product} size="lg" />
            </div>

            {/* Stock */}
            <div className="mt-3 flex items-center gap-2">
              {product.stock_status === 'in_stock' ? (
                <>
                  <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-green-600 font-medium text-sm">In Stock — Ready to Ship</span>
                </>
              ) : (
                <>
                  <span className="w-2.5 h-2.5 bg-red-500 rounded-full" />
                  <span className="text-red-500 font-medium text-sm">Out of Stock</span>
                </>
              )}
            </div>

            {/* Qty Selector */}
            <div className="mt-6">
              <label className="text-sm font-semibold text-forest block mb-2">Quantity</label>
              <div className="flex items-center gap-3">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-full border-2 border-forest text-forest font-bold text-xl hover:bg-forest hover:text-white transition-all">
                  −
                </button>
                <span className="w-8 text-center font-bold text-lg">{quantity}</span>
                <button onClick={() => setQuantity(Math.min(10, quantity + 1))}
                  className="w-10 h-10 rounded-full border-2 border-forest text-forest font-bold text-xl hover:bg-forest hover:text-white transition-all">
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons (Desktop) */}
            <div className="hidden sm:flex mt-6 flex-col sm:flex-row gap-3">
              <button
                onClick={handleAddToCart}
                disabled={product.stock_status !== 'in_stock'}
                className={`flex-1 py-3.5 px-6 rounded-full font-bold text-base transition-all duration-300 ${
                  added ? 'bg-green-600 text-white' : adding ? 'bg-amber-400 text-white' : 'btn-primary'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {added ? '✓ Added to Cart!' : adding ? 'Adding...' : '🛒 Add to Cart'}
              </button>
              <button
                onClick={handleBuyNow}
                disabled={product.stock_status !== 'in_stock'}
                className="flex-1 btn-forest py-3.5 px-6 rounded-full font-bold text-base disabled:opacity-50"
              >
                ⚡ Buy Now
              </button>
            </div>

            {/* Trust Tags */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              {['🚚 Free Delivery', '✅ 100% Natural', '🔒 Secure Order', '💚 No Chemicals'].map(t => (
                <div key={t} className="flex items-center gap-2 text-sm text-gray-600 bg-white rounded-xl px-3 py-2 border border-gray-100">
                  {t}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="mt-16">
          <div className="flex gap-1 border-b border-gray-200 mb-8 overflow-x-auto">
            {TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-3 font-medium text-sm capitalize whitespace-nowrap border-b-2 transition-all ${
                  activeTab === tab
                    ? 'border-forest text-forest font-semibold'
                    : 'border-transparent text-gray-500 hover:text-forest'
                }`}
              >
                {tab.replace('-', ' ')}
              </button>
            ))}
          </div>

          <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            {activeTab === 'description' && (
              <div className="max-w-2xl">
                <p className="text-gray-600 leading-relaxed text-base">{product.description}</p>
                <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {['100% Natural', 'Handmade', 'No Chemicals', 'Ayurvedic', 'Small Batch', 'Tamil Nadu'].map(f => (
                    <div key={f} className="flex items-center gap-2 text-sm text-forest font-medium">
                      <span className="text-amber-500">✓</span> {f}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {activeTab === 'ingredients' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {INGREDIENTS_DETAIL.map(ing => (
                  <div key={ing.name} className="bg-white rounded-2xl p-4 flex items-start gap-3 shadow-sm border border-amber-100">
                    <span className="text-2xl">{ing.emoji}</span>
                    <div>
                      <h4 className="font-semibold text-forest text-sm">{ing.name}</h4>
                      <p className="text-gray-500 text-xs mt-1">{ing.benefit}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {activeTab === 'how-to-use' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
                {HOW_TO_USE.map(step => (
                  <div key={step.step} className="card p-5 flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-forest text-white font-bold flex items-center justify-center shrink-0 text-sm">{step.step}</div>
                    <div>
                      <h4 className="font-semibold text-forest mb-1">✅ {step.title}</h4>
                      <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </motion.div>
        </div>
      </div>

      {/* Sticky Mobile Action Bar */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 p-3 bg-white border-t border-gray-100 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] z-40 flex gap-2">
        <button
          onClick={handleAddToCart}
          disabled={product.stock_status !== 'in_stock'}
          className={`flex-1 py-3 px-2 rounded-xl font-bold text-sm transition-all duration-300 ${
            added ? 'bg-green-600 text-white' : adding ? 'bg-amber-400 text-white' : 'bg-green-50 text-forest border border-green-200'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {added ? '✓ Added' : adding ? '...' : '🛒 Add to Cart'}
        </button>
        <button
          onClick={handleBuyNow}
          disabled={product.stock_status !== 'in_stock'}
          className="flex-1 btn-forest py-3 px-2 rounded-xl font-bold text-sm disabled:opacity-50"
        >
          ⚡ Buy Now
        </button>
      </div>
    </div>
  )
}
