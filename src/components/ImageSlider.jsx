import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/effect-fade'

export default function ImageSlider({ images = [], alt = 'Product', height = '500px', autoplay = true }) {
  if (!images.length) {
    return (
      <div
        className="w-full flex items-center justify-center bg-gradient-to-br from-green-50 to-amber-50 rounded-3xl text-8xl"
        style={{ height }}
      >
        🌿
      </div>
    )
  }

  if (images.length === 1) {
    return (
      <div
        className="w-full rounded-3xl overflow-hidden"
        style={{ height }}
      >
        <img
          src={images[0]}
          alt={alt}
          className="w-full h-full object-cover"
        />
      </div>
    )
  }

  return (
    <Swiper
      modules={[Navigation, Pagination, Autoplay, EffectFade]}
      navigation
      pagination={{ clickable: true }}
      autoplay={autoplay ? { delay: 4000, disableOnInteraction: false } : false}
      loop
      effect="fade"
      style={{ height, borderRadius: '24px', overflow: 'hidden' }}
    >
      {images.map((img, i) => (
        <SwiperSlide key={i}>
          <img
            src={img}
            alt={`${alt} ${i + 1}`}
            className="w-full h-full object-cover"
          />
        </SwiperSlide>
      ))}
    </Swiper>
  )
}
