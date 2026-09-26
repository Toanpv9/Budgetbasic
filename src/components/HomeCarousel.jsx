import { useEffect, useRef, useState } from 'react'
import slides from '../data/home-slides.json'
import Icon from './Icon.jsx'

const AUTOPLAY_MS = 5000

export default function HomeCarousel() {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const touchX = useRef(null)
  const count = slides.length

  const go = (i) => setIndex((i + count) % count)

  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (paused || reduce) return
    const timer = window.setTimeout(() => setIndex((i) => (i + 1) % count), AUTOPLAY_MS)
    return () => window.clearTimeout(timer)
  }, [index, paused, count])

  const onKeyDown = (e) => {
    if (e.key === 'ArrowLeft') go(index - 1)
    if (e.key === 'ArrowRight') go(index + 1)
  }
  const onTouchEnd = (e) => {
    if (touchX.current === null) return
    const dx = e.changedTouches[0].clientX - touchX.current
    if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1))
    touchX.current = null
  }

  return (
    <section id="featured" className="w-full bg-white py-12 lg:py-16 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-end justify-between gap-4 mb-6">
          <div>
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-700">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span> What you can do here
            </p>
            <h2 className="font-heading text-2xl lg:text-3xl text-slate-900 font-bold mt-1">Explore BudgetBee</h2>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => go(index - 1)} aria-label="Previous slide" className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center">
              <Icon name="ChevronLeft" size={24} />
            </button>
            <button type="button" onClick={() => go(index + 1)} aria-label="Next slide" className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center">
              <Icon name="ChevronRight" size={24} />
            </button>
          </div>
        </div>

        <div
          className="relative overflow-hidden rounded-[2rem] shadow-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500"
          role="region"
          aria-roledescription="carousel"
          aria-label="Featured BudgetBee activities"
          tabIndex={0}
          onKeyDown={onKeyDown}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
          onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
          onTouchEnd={onTouchEnd}
        >
          <div className="flex transition-transform duration-700 ease-out" style={{ transform: `translateX(-${index * 100}%)` }}>
            {slides.map((s, i) => (
              <div
                key={s.title}
                className={`w-full shrink-0 bg-gradient-to-br ${s.bg} ${s.fg}`}
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${count}`}
                aria-hidden={i !== index}
              >
                <div className="grid grid-cols-1 md:grid-cols-5 items-center gap-6 p-8 md:p-12 min-h-[300px]">
                  <div className="md:col-span-3 flex flex-col gap-3">
                    <span className="self-start px-3 py-1 rounded-full bg-white/25 backdrop-blur text-xs font-bold uppercase tracking-wider">{s.eyebrow}</span>
                    <h3 className="text-3xl md:text-4xl font-extrabold leading-tight">{s.title}</h3>
                    <p className="text-base md:text-lg opacity-90 max-w-xl">{s.text}</p>
                    <a
                      href={s.link}
                      tabIndex={i === index ? 0 : -1}
                      className="self-start mt-2 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-slate-900 font-bold shadow-md hover:scale-105 transition-transform"
                    >
                      {s.cta} <Icon name="ArrowRight" size={20} />
                    </a>
                  </div>
                  <div className="md:col-span-2 flex justify-center" aria-hidden="true">
                    <span className={`w-40 h-40 md:w-52 md:h-52 rounded-full bg-white/20 flex items-center justify-center drop-shadow-xl ${i === index ? 'animate-[bee-float_4s_ease-in-out_infinite]' : ''}`}>
                      <Icon name={s.icon} size={88} strokeWidth={1.5} />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/10">
            <div key={`${index}-${paused}`} className="h-full bg-white/80" style={{ animation: paused ? 'none' : `slide-progress ${AUTOPLAY_MS}ms linear forwards`, width: paused ? '0%' : undefined }}></div>
          </div>
        </div>

        <div className="flex justify-center gap-2 mt-5" role="tablist" aria-label="Choose a slide">
          {slides.map((s, i) => (
            <button
              key={s.title}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Go to slide ${i + 1}: ${s.title}`}
              onClick={() => go(i)}
              className={`h-2.5 rounded-full transition-all ${i === index ? 'w-8 bg-emerald-700' : 'w-2.5 bg-slate-300 hover:bg-slate-500'}`}
            ></button>
          ))}
        </div>
      </div>
    </section>
  )
}
