const PREFIX = 'bb:'
const VERSION = 1

export function load(key, fallback, store = localStorage) {
  try {
    const raw = store.getItem(PREFIX + key)
    if (!raw) return fallback
    const { v, data } = JSON.parse(raw)
    return v === VERSION ? data : fallback
  } catch {
    return fallback
  }
}

export function save(key, data, store = localStorage) {
  try {
    store.setItem(PREFIX + key, JSON.stringify({ v: VERSION, data }))
    return true
  } catch {
    return false
  }
}

export function remove(key, store = localStorage) {
  try {
    store.removeItem(PREFIX + key)
  } catch {}
}

export function clearAll(prefix = '') {
  for (const store of [localStorage, sessionStorage]) {
    try {
      Object.keys(store)
        .filter((k) => k.startsWith(PREFIX + prefix))
        .forEach((k) => store.removeItem(k))
    } catch {}
  }
}

export function listKeys() {
  try {
    return Object.keys(localStorage)
      .filter((k) => k.startsWith(PREFIX))
      .map((k) => ({ key: k, bytes: (localStorage.getItem(k) || '').length }))
  } catch {
    return []
  }
}
