import { useEffect, useRef, useState } from 'react'
import { useAnchor } from '../anchors.js'

export default function Reveal({ id, animate = true, children }) {
  const ref = useRef(null)
  const anchor = useAnchor(id)
  const [visible, setVisible] = useState(() => !animate || !('IntersectionObserver' in window))

  useEffect(() => {
    if (visible) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0, rootMargin: '0px 0px -8% 0px' },
    )
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [visible])

  return (
    <div
      ref={(el) => {
        ref.current = el
        anchor(el)
      }}
      className={`scroll-mt-36 ${animate ? `reveal ${visible ? 'is-visible' : ''}` : ''}`}
    >
      {children}
    </div>
  )
}
