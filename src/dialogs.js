const EVENT = 'bb:dialog'

export const showMessage = (title, text) =>
  window.dispatchEvent(new CustomEvent(EVENT, { detail: { type: 'message', title, text } }))

export const openLightbox = (title, src) =>
  window.dispatchEvent(new CustomEvent(EVENT, { detail: { type: 'lightbox', title, src } }))

export function onDialog(callback) {
  const handler = (e) => callback(e.detail)
  window.addEventListener(EVENT, handler)
  return () => window.removeEventListener(EVENT, handler)
}

export const openChat = () => window.dispatchEvent(new Event('bb:open-chat'))
