import { useEffect, useState } from 'react'

const REVISIT = 'bb:revisit'

export function parseHash(hash = window.location.hash) {
  const [page = 'home', section = null] = hash.replace(/^#\/?/, '').split('/').filter(Boolean)
  return { page, section }
}

export function useHashRoute() {
  const [route, setRoute] = useState(() => parseHash())

  useEffect(() => {
    const update = () => setRoute(parseHash())
    const onClick = (e) => {
      const link = e.target.closest?.('a[href^="#/"]')
      if (link && link.getAttribute('href') === window.location.hash) {
        e.preventDefault()
        update()
      }
    }
    window.addEventListener('hashchange', update)
    window.addEventListener(REVISIT, update)
    document.addEventListener('click', onClick)
    return () => {
      window.removeEventListener('hashchange', update)
      window.removeEventListener(REVISIT, update)
      document.removeEventListener('click', onClick)
    }
  }, [])

  return route
}

export function navigate(path) {
  if (window.location.hash === path) window.dispatchEvent(new Event(REVISIT))
  else window.location.hash = path
}
