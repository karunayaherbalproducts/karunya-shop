export default function PriceTag({ product, size = 'md' }) {
  const { mrp, offer_price, special_price, is_offer_active } = product

  const activePrice = is_offer_active
    ? (special_price || offer_price || mrp)
    : mrp

  const showOffer = is_offer_active && (offer_price || special_price)
  const savings = mrp - activePrice

  const sizeClasses = {
    sm: { mrp: 'text-xs', price: 'text-base', badge: 'text-xs px-1.5 py-0.5' },
    md: { mrp: 'text-sm', price: 'text-xl', badge: 'text-xs px-2 py-0.5' },
    lg: { mrp: 'text-base', price: 'text-3xl', badge: 'text-sm px-2.5 py-1' },
  }

  const sc = sizeClasses[size] || sizeClasses.md

  return (
    <div className="flex flex-wrap items-end gap-2">
      {showOffer ? (
        <>
          <span className={`font-display font-bold text-green-700 ${sc.price}`}>
            ₹{activePrice}
          </span>
          {offer_price && special_price && offer_price !== special_price && (
            <span className={`text-amber-600 font-semibold line-through ${sc.mrp}`}>
              ₹{offer_price}
            </span>
          )}
          <span className={`price-mrp ${sc.mrp}`}>₹{mrp}</span>
          {savings > 0 && (
            <span className={`bg-green-100 text-green-700 font-semibold rounded-full ${sc.badge}`}>
              Save ₹{savings}
            </span>
          )}
        </>
      ) : (
        <span className={`font-display font-bold text-forest ${sc.price}`}>
          ₹{mrp}
        </span>
      )}
    </div>
  )
}
