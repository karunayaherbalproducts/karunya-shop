import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useCartStore } from '../store/cartStore'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { items, getTotalItems } = useCartStore()
  const navigate = useNavigate()
  const location = useLocation()
  const totalItems = getTotalItems()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  const isHome = location.pathname === '/'

  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'Products', to: '/#products' },
    { label: 'Ingredients', to: '/#ingredients' },
    { label: 'Process', to: '/#process' },
    { label: 'Contact', to: '/#contact' },
  ]

  const handleNavClick = (to) => {
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
    setMobileOpen(false)
  }

  return (
    <>
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled || !isHome
            ? 'bg-white/95 backdrop-blur-md shadow-lg'
            : 'bg-transparent'
        }`}
      >
        <div className="container-max px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center group">
              <img 
                src="/logo-new.png" 
                alt="Karunya Herbal Hair Oil" 
                className="h-12 sm:h-14 object-contain group-hover:scale-105 transition-transform"
                style={{ 
                  filter: scrolled || !isHome ? 'none' : 'brightness(0) invert(1)' 
                }}
              />
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map(link => (
                <button
                  key={link.label}
                  onClick={() => handleNavClick(link.to)}
                  className={`px-4 py-2 rounded-full text-sm font-medium font-body transition-all duration-200 hover:bg-forest hover:text-white ${
                    scrolled || !isHome ? 'text-gray-700' : 'text-white/90'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </div>

            {/* Right Icons */}
            <div className="flex items-center gap-3">
              {/* Cart Button */}
              <Link
                to="/cart"
                className={`relative p-2.5 rounded-full transition-all hover:scale-110 ${
                  scrolled || !isHome
                    ? 'text-forest hover:bg-green-50'
                    : 'text-white hover:bg-white/20'
                }`}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                </svg>
                {totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-amber-500 to-amber-600 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-md"
                  >
                    {totalItems > 9 ? '9+' : totalItems}
                  </motion.span>
                )}
              </Link>

              {/* Mobile Menu */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className={`md:hidden p-2 rounded-lg transition-colors ${
                  scrolled || !isHome ? 'text-forest' : 'text-white'
                }`}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  {mobileOpen
                    ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  }
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t border-gray-100 shadow-xl"
            >
              <div className="px-4 py-4 flex flex-col gap-1">
                {navLinks.map(link => (
                  <button
                    key={link.label}
                    onClick={() => handleNavClick(link.to)}
                    className="text-left px-4 py-3 rounded-xl text-gray-700 font-medium hover:bg-green-50 hover:text-forest transition-colors"
                  >
                    {link.label}
                  </button>
                ))}
                <Link
                  to="/cart"
                  className="mt-2 btn-forest text-center block"
                >
                  🛒 View Cart ({totalItems})
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  )
}
