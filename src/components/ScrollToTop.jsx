import { useEffect, useState } from 'react'
import Icon from './Icon.jsx'

export default function ScrollToTop() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      setProgress(max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  const visible = progress > 8

  return (
    <>
      <div className="fixed top-0 left-0 right-0 h-1 z-[60] pointer-events-none" aria-hidden="true">
        <div className="h-full bg-gradient-to-r from-amber-400 to-emerald-700 transition-[width] duration-150" style={{ width: `${progress}%` }}></div>
      </div>
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Back to top"
        tabIndex={visible ? 0 : -1}
        className={`fixed bottom-24 right-7 z-40 w-12 h-12 rounded-full bg-emerald-700 text-white shadow-lg flex items-center justify-center transition-all duration-300 hover:-translate-y-1 focus-visible:ring-4 focus-visible:ring-emerald-500 ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <Icon name="ArrowUp" size={22} />
      </button>
    </>
  )
}
