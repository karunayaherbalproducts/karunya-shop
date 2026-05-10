import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { supabase } from '../lib/supabase'
import ProductCard from '../components/ProductCard'

const INGREDIENTS = [
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

const PROCESS_STEPS = [
  { step: '01', title: 'Sourcing & Cleaning', desc: 'Fresh, organic ingredients sourced from trusted growers. Every herb carefully handpicked and cleaned with filtered water to remove impurities.', icon: '🌿' },
  { step: '02', title: 'Drying & Grinding', desc: 'Harder herbs and seeds are naturally sun-dried to preserve their potency, then lightly crushed to release active nutrients during infusion.', icon: '☀️' },
  { step: '03', title: 'Oil Base Heating', desc: 'Traditional cold-pressed coconut oil and castor oil blend slowly heated in a thick-bottomed vessel until ready to absorb herbal essence.', icon: '🔥' },
  { step: '04', title: 'Herbal Infusion', desc: 'All 17 ingredients added gradually and simmered on low flame for several hours. The oil darkens naturally as herbal nutrients are fully absorbed.', icon: '⚗️' },
  { step: '05', title: 'Cooling & Settling', desc: 'Oil removed from flame and left to cool naturally for 24 hours, allowing the herbs to settle and infuse even more deeply.', icon: '🌙' },
  { step: '06', title: 'Filtering & Bottling', desc: 'Fine muslin cloth filtering produces a rich, aromatic, golden herbal oil — free from residues but full of natural goodness. Stored in sterile, airtight containers.', icon: '✨' },
]

const TESTIMONIALS = [
  { name: 'Sangeetha M.', location: 'Coimbatore', rating: 5, text: 'I love that it\'s completely chemical-free. My dandruff has reduced drastically and my scalp feels fresh. My mom and sister use it now too!' },
  { name: 'Divya P.', location: 'Bangalore', rating: 5, text: 'After trying so many products, I finally found one that works. My hair is no longer dry and frizzy. Thank you, Karunya!' },
  { name: 'Meenakshi K.', location: 'Madurai', rating: 5, text: 'This oil has become a weekend ritual. The 17 natural ingredients truly make a difference — my hair feels nourished and the shine is back.' },
  { name: 'Priya R.', location: 'Chennai', rating: 5, text: 'Been using for 3 months and my hair fall has reduced significantly. The fragrance is amazing and completely natural!' },
  { name: 'Lakshmi S.', location: 'Salem', rating: 5, text: 'Authentic Ayurvedic quality. You can feel the difference in just 2 weeks. My hair is thicker and stronger than ever.' },
]

const WHY_CHOOSE = [
  { icon: '🌿', title: '100% Natural & Handmade', desc: 'Every drop crafted by hand using traditional methods passed down through generations.' },
  { icon: '⚗️', title: '17 Powerful Herbs', desc: 'A synergistic blend of 17 time-tested Ayurvedic herbs working together for maximum benefit.' },
  { icon: '🚫', title: 'No Harmful Chemicals', desc: 'Zero artificial fragrances, preservatives, or synthetic additives. Pure nature in every bottle.' },
  { icon: '✅', title: 'Safe for All Hair Types', desc: 'Suitable for dry, oily, normal, curly, or straight hair. Gentle enough for daily use.' },
  { icon: '🏭', title: 'Small Batch Crafted', desc: 'Made in small batches to ensure quality control and maximum freshness of every bottle.' },
  { icon: '🌱', title: 'Sustainably Sourced', desc: 'Ingredients ethically sourced from trusted organic growers in Tamil Nadu and beyond.' },
]

const HERO_IMAGE = 'https://sqxqwmbqxpopfntfgfqz.supabase.co/storage/v1/object/public/product-images/hero/1777707106069.png'

export default function Home() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState('grid')
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  useEffect(() => {
    fetchProducts()
  }, [])

  async function fetchProducts() {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: true })
      if (!error && data) setProducts(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  // Fallback demo products if Supabase not configured
  const demoProducts = [
    { id: 'demo-100', name: 'Karunya Herbal Hair Oil', size: '100ml', description: '100% natural Ayurvedic hair oil with 17 powerful herbs.', mrp: 399, offer_price: 299, special_price: 249, is_offer_active: true, stock_status: 'in_stock', images: [] },
    { id: 'demo-500', name: 'Karunya Herbal Hair Oil', size: '500ml', description: '100% natural Ayurvedic hair oil with 17 powerful herbs.', mrp: 799, offer_price: 599, special_price: 499, is_offer_active: true, stock_status: 'in_stock', images: [] },
    { id: 'demo-1000', name: 'Karunya Herbal Hair Oil', size: '1000ml', description: '100% natural Ayurvedic hair oil with 17 powerful herbs.', mrp: 1499, offer_price: 999, special_price: null, is_offer_active: true, stock_status: 'in_stock', images: [] },
  ]

  const displayProducts = products.length > 0 ? products : demoProducts

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section ref={heroRef} className="relative h-screen min-h-[600px] flex items-center overflow-hidden">
        <motion.div className="absolute inset-0 z-0" style={{ y: heroY }}>
          {HERO_IMAGE ? (
            <img src={HERO_IMAGE} alt="Karunya Herbal Hair Oil" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-green-900 via-green-800 to-green-700" />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-transparent" />
        </motion.div>
        <motion.div className="relative z-10 container-max px-6 pt-20" style={{ opacity: heroOpacity }}>
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
            <div className="flex flex-wrap gap-2 mb-6">
              {['🍃 100% Natural', '🍃 Handmade', '🍃 No Chemicals'].map(b => (
                <span key={b} className="bg-white/20 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full border border-white/30">{b}</span>
              ))}
            </div>
            <h1 className="font-display text-4xl sm:text-5xl md:text-7xl font-bold text-white leading-tight max-w-3xl">
              Nature's Secret for <span className="text-amber-400">Lustrous Hair</span>
            </h1>
            <p className="mt-5 text-lg text-green-100 max-w-xl leading-relaxed">
              100% Natural · Handmade · No Chemicals · Ayurvedic Wisdom
            </p>
            <p className="mt-3 text-base text-green-200 max-w-lg">
              Crafted with 17 time-tested Ayurvedic herbs in Tamil Nadu — revitalize your scalp and restore your hair's natural strength, shine, and volume.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a href="#products" onClick={e => { e.preventDefault(); document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' }) }}
                className="btn-primary text-base px-8 py-4">
                Shop Now →
              </a>
              <a href="#ingredients" onClick={e => { e.preventDefault(); document.getElementById('ingredients')?.scrollIntoView({ behavior: 'smooth' }) }}
                className="bg-white/20 backdrop-blur-sm text-white border border-white/40 px-8 py-4 rounded-full font-semibold hover:bg-white/30 transition-all">
                17 Ingredients
              </a>
            </div>
          </motion.div>
        </motion.div>

      </section>

      {/* Trust Badges Bar */}
      <section className="bg-gradient-to-r from-green-800 to-green-700 py-4">
        <div className="container-max px-4">
          <div className="flex flex-wrap justify-center gap-6 sm:gap-10">
            {['🍃 100% Natural & Handmade', '🍃 No Artificial Fragrances', '🍃 Safe for All Hair Types', '🍃 Crafted in Small Batches'].map(b => (
              <span key={b} className="text-amber-300 text-sm font-medium">{b}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="section-padding bg-cream">
        <div className="container-max">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <span className="badge-natural mb-4 inline-block">Our Products</span>
            <h2 className="section-title mt-3">Choose Your Size</h2>
            <p className="mt-4 text-gray-600 max-w-xl mx-auto">Premium Ayurvedic hair oil available in three sizes to suit your needs</p>
          </motion.div>

          {/* View Toggle */}
          <div className="flex justify-end mb-6 gap-2">
            <button onClick={() => setViewMode('grid')} className={`p-2.5 rounded-xl border transition-all ${viewMode === 'grid' ? 'bg-forest text-white border-forest' : 'bg-white text-gray-500 border-gray-200 hover:border-forest'}`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
              </svg>
            </button>
            <button onClick={() => setViewMode('list')} className={`p-2.5 rounded-xl border transition-all ${viewMode === 'list' ? 'bg-forest text-white border-forest' : 'bg-white text-gray-500 border-gray-200 hover:border-forest'}`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
            </button>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {[1,2,3].map(i => (
                <div key={i} className="card h-80 animate-pulse bg-gray-100" />
              ))}
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {displayProducts.map(p => <ProductCard key={p.id} product={p} view="grid" />)}
            </div>
          ) : (
            <div className="space-y-4">
              {displayProducts.map(p => <ProductCard key={p.id} product={p} view="list" />)}
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section id="why" className="section-padding" style={{ background: 'linear-gradient(135deg, #0F2B1F 0%, #1B4332 100%)' }}>
        <div className="container-max">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <span className="bg-amber-500/20 text-amber-400 text-xs font-semibold px-4 py-1.5 rounded-full mb-4 inline-block tracking-widest uppercase">Why Choose Us</span>
            <h2 className="font-display text-4xl font-bold text-white mt-3">The Karunya Difference</h2>
            <p className="mt-4 text-green-300 max-w-xl mx-auto">At Karunya Herbal Hair Oil, we follow time-honored methods to craft a truly nourishing hair oil using ancient Ayurvedic wisdom.</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {WHY_CHOOSE.map((item, i) => (
              <motion.div key={item.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="glass rounded-2xl p-6 hover:bg-white/20 transition-all">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="font-display text-lg font-semibold text-amber-400 mb-2">{item.title}</h3>
                <p className="text-green-200 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Ingredients */}
      <section id="ingredients" className="section-padding bg-gradient-to-b from-amber-50 to-cream">
        <div className="container-max">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <span className="badge-natural mb-4 inline-block">17 Powerful Herbs</span>
            <h2 className="section-title mt-3">Ingredients & Benefits</h2>
            <p className="mt-4 text-gray-600 max-w-xl mx-auto">Discover the magic of our powerful blend of 17 time-tested herbs and natural oils that revitalize your scalp and restore your hair's natural strength.</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {INGREDIENTS.map((ing, i) => (
              <motion.div key={ing.name} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                className="bg-white rounded-2xl p-4 flex items-start gap-4 shadow-sm hover:shadow-md transition-shadow border border-amber-100">
                <span className="text-3xl shrink-0">{ing.emoji}</span>
                <div>
                  <h3 className="font-semibold text-forest text-sm mb-1">{ing.name}</h3>
                  <p className="text-gray-500 text-xs leading-relaxed">{ing.benefit}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Preparation Process */}
      <section id="process" className="section-padding bg-cream">
        <div className="container-max">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <span className="badge-natural mb-4 inline-block">Traditional Method</span>
            <h2 className="section-title mt-3">🍃 Our Preparation Process</h2>
            <p className="mt-4 text-gray-600 max-w-xl mx-auto">We follow a multi-step, natural infusion process to ensure every drop of oil captures the essence of these healing herbs.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PROCESS_STEPS.map((step, i) => (
              <motion.div key={step.step} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="card p-6 relative overflow-hidden">
                <div className="absolute top-4 right-4 font-display text-5xl font-bold text-green-100">{step.step}</div>
                <div className="text-4xl mb-4">{step.icon}</div>
                <h3 className="font-display text-lg font-semibold text-forest mb-2">{step.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Use */}
      <section id="howto" className="section-padding" style={{ background: 'linear-gradient(135deg, #1B4332 0%, #2D6A4F 100%)' }}>
        <div className="container-max">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <span className="bg-amber-500/20 text-amber-400 text-xs font-semibold px-4 py-1.5 rounded-full mb-4 inline-block tracking-widest uppercase">Usage Guide</span>
            <h2 className="font-display text-4xl font-bold text-white mt-3">🍃 How to Use</h2>
            <p className="mt-4 text-green-300 max-w-xl mx-auto">Follow these simple steps to get maximum benefits from Karunya Herbal Hair Oil.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              { step: '1', title: 'Apply to Scalp & Roots', desc: 'Part your hair into sections. Apply oil directly to scalp. Massage gently in circular motions for 5–10 minutes to boost circulation and stimulate hair follicles.' },
              { step: '2', title: 'Spread to Hair Length', desc: 'After massaging the scalp, apply the remaining oil along the length of your hair. Focus on the ends, especially if you have dry or damaged tips.' },
              { step: '3', title: 'Let It Soak In', desc: 'Leave the oil on for at least 1 hour. For deeper treatment, wrap hair with a towel or shower cap and leave overnight.' },
              { step: '4', title: 'Wash with Mild Shampoo', desc: 'Use a gentle, sulfate-free herbal shampoo to wash off. You may need two rinses. Avoid harsh chemical shampoos.' },
            ].map((item, i) => (
              <motion.div key={item.step} initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                className="glass rounded-2xl p-6 flex gap-4">
                <div className="w-10 h-10 rounded-full bg-amber-500 text-white font-bold text-lg flex items-center justify-center shrink-0">
                  {item.step}
                </div>
                <div>
                  <h3 className="font-semibold text-amber-400 mb-1">✅ {item.title}</h3>
                  <p className="text-green-200 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="section-padding bg-gradient-to-b from-cream to-amber-50">
        <div className="container-max">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <span className="badge-natural mb-4 inline-block">Customer Love</span>
            <h2 className="section-title mt-3">What Our Customers Say</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div key={t.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="card p-6">
                <div className="flex text-amber-400 text-xl mb-3">{'★'.repeat(t.rating)}</div>
                <p className="text-gray-600 text-sm leading-relaxed italic mb-4">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-700 to-green-500 flex items-center justify-center text-white font-bold">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-forest text-sm">{t.name}</p>
                    <p className="text-gray-400 text-xs">{t.location}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="section-padding bg-gradient-to-r from-amber-600 to-amber-500">
        <div className="container-max text-center">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">Ready to Transform Your Hair?</h2>
            <p className="text-amber-100 mb-8 max-w-md mx-auto">Join thousands of happy customers who have rediscovered their hair's natural beauty with Karunya.</p>
            <a href="#products" onClick={e => { e.preventDefault(); document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' }) }}
              className="bg-white text-amber-600 font-bold px-10 py-4 rounded-full hover:bg-amber-50 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 inline-block">
              Shop Now →
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
