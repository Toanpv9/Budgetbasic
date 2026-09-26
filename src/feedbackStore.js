import { load, save } from './utils/storage.js'
import { logEvent, spamReasons } from './admin/adminStore.js'

const KEY = 'feedback'
const EVENT = 'bb:feedback-change'

export const getFeedback = () => load(KEY, [])

function write(list) {
  save(KEY, list)
  window.dispatchEvent(new Event(EVENT))
}

export function addFeedback({ userId = null, name, email, rating, category = 'general', text }) {
  const flagged = spamReasons(`${name} ${text}`).length > 0
  const entry = {
    id: `f${Date.now().toString(36)}`,
    userId,
    name,
    email,
    rating,
    category,
    text,
    read: false,
    status: flagged ? 'flagged' : 'new',
    createdAt: new Date().toISOString(),
  }
  write([entry, ...getFeedback()])
  logEvent('feedback', { userId, feedbackId: entry.id })
  return entry
}

export const updateFeedback = (id, changes) => write(getFeedback().map((f) => (f.id === id ? { ...f, ...changes } : f)))
export const deleteFeedback = (id) => write(getFeedback().filter((f) => f.id !== id))

export function onFeedbackChange(callback) {
  window.addEventListener(EVENT, callback)
  window.addEventListener('storage', callback)
  return () => {
    window.removeEventListener(EVENT, callback)
    window.removeEventListener('storage', callback)
  }
}
