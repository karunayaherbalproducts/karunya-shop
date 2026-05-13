import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const socialLinks = [
  { name: 'WhatsApp', href: 'https://wa.me/919994436368', icon: '💬' },
  { name: 'Instagram', href: '#', icon: '📸' },
  { name: 'Facebook', href: '#', icon: '👥' },
]

const quickLinks = [
  { label: 'Home', to: '/' },
  { label: 'Products', to: '/#products' },
  { label: 'Ingredients', to: '/#ingredients' },
  { label: 'Process', to: '/#process' },
]

export default function Footer() {
  const location = useLocation()
  const navigate = useNavigate()

  const handleNavClick = (e, to) => {
    e.preventDefault()
    if (to.startsWith('/#')) {
      const id = to.replace('/#', '')
      if (location.pathname === '/' && location.hash === `#${id}`) {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
      } else {
        navigate(to)
      }
    } else {
      navigate(to)
    }
  }

  return (
    <footer
      className="relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0F2B1F 0%, #1B4332 50%, #0F2B1F 100%)' }}
      id="contact"
    >
      {/* Decorative */}
      <div className="absolute inset-0 hero-pattern opacity-20 pointer-events-none" />

      <div className="container-max section-padding relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="mb-4">
              <img 
                src="/logo-new.png" 
                alt="Karunya Herbal Hair Oil" 
                className="h-14 sm:h-16 object-contain"
                style={{ filter: 'brightness(0) invert(1)' }}
              />
            </div>
            <p className="text-green-200 text-sm leading-relaxed mb-5 max-w-xs">
              Crafted with love and ancient Ayurvedic wisdom in Tamil Nadu. 
              100% natural, handmade, and free from harmful chemicals.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map(s => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-amber-500/30 flex items-center justify-center text-lg transition-all hover:scale-110"
                  title={s.name}
                >
                  {s.icon}
                </a>
              ))}
            </div>
            {/* Trust Badges */}
            <div className="mt-5 flex flex-wrap gap-2">
              {['100% Natural', 'Handmade', 'No Chemicals', 'Ayurvedic'].map(b => (
                <span key={b} className="badge-natural text-xs">
                  🍃 {b}
                </span>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display text-lg font-semibold text-amber-400 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map(link => (
                <li key={link.label}>
                  <a
                    href={link.to}
                    onClick={(e) => handleNavClick(e, link.to)}
                    className="text-green-200 hover:text-amber-400 transition-colors text-sm flex items-center gap-2 cursor-pointer"
                  >
                    <span className="text-amber-600">→</span> {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display text-lg font-semibold text-amber-400 mb-4">Contact Us</h3>
            <div className="space-y-3">
              <a
                href="tel:+919994436368"
                className="flex items-start gap-3 text-green-200 hover:text-amber-400 transition-colors group"
              >
                <span className="text-xl mt-0.5">📞</span>
                <div>
                  <p className="text-xs text-green-400 mb-0.5">Phone / WhatsApp</p>
                  <p className="text-sm font-medium">+91 9994436368</p>
                </div>
              </a>
              <a
                href="mailto:karunayaherbalproducts@gmail.com"
                className="flex items-start gap-3 text-green-200 hover:text-amber-400 transition-colors"
              >
                <span className="text-xl mt-0.5">✉️</span>
                <div>
                  <p className="text-xs text-green-400 mb-0.5">Email</p>
                  <p className="text-sm font-medium break-all">karunayaherbalproducts@gmail.com</p>
                </div>
              </a>
              <div className="flex items-start gap-3 text-green-200">
                <span className="text-xl mt-0.5">📍</span>
                <div>
                  <p className="text-xs text-green-400 mb-0.5">Address</p>
                  <p className="text-sm">Poochur, Pennagaram, Dharmapuri<br/>Tamil Nadu — 636810</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-green-300 text-sm text-center">
            © {new Date().getFullYear()} Karunya Herbal Hair Oil. All rights reserved.
          </p>
          <p className="text-green-400 text-xs">
            🌿 Nature's Secret for Lustrous Hair
          </p>
        </div>
      </div>

      {/* WhatsApp floating button */}
      <motion.a
        href="https://wa.me/919994436368"
        target="_blank"
        rel="noopener noreferrer"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 2, type: 'spring' }}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl transition-all hover:scale-110 animate-pulse-gold"
        title="Chat on WhatsApp"
      >
        <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </motion.a>
    </footer>
  )
}
