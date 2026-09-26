import { load, save } from '../utils/storage.js'

const EVENT = 'bb:admin-change'
const notify = () => window.dispatchEvent(new Event(EVENT))

export function onAdminChange(callback) {
  const events = [EVENT, 'bb:auth-change', 'bb:feedback-change', 'storage']
  events.forEach((e) => window.addEventListener(e, callback))
  return () => events.forEach((e) => window.removeEventListener(e, callback))
}

export const deviceType = () => (/Mobi|Android|iPhone|iPad/i.test(navigator.userAgent) ? 'mobile' : 'desktop')

export const getEvents = () => load('events', [])

export function logEvent(type, data = {}) {
  const events = getEvents()
  events.push({ type, at: new Date().toISOString(), device: deviceType(), ...data })
  save('events', events.slice(-1000))
  notify()
}

export const getAudit = () => load('audit', [])

export function logAudit(action, detail) {
  save('audit', [{ at: new Date().toISOString(), action, detail }, ...getAudit()].slice(0, 200))
  notify()
}

export const DEFAULT_SETTINGS = {
  antiFlood: 5,
  blacklist: ['http', 'www.', 'bit.ly', 'free money', 'easy money', 'casino', 'crypto', 'zalo', 'telegram'],
  captcha: true,
}
export const getSettings = () => ({ ...DEFAULT_SETTINGS, ...load('settings', {}) })

export function saveSettings(settings) {
  save('settings', settings)
  notify()
}

export function spamReasons(text, settings = getSettings()) {
  const t = (text || '').toLowerCase()
  const reasons = []
  const hits = settings.blacklist.filter((w) => w && t.includes(w.toLowerCase()))
  if (hits.length) reasons.push(`Blacklisted: ${hits.join(', ')}`)
  if (/(.)\1{6,}/.test(t)) reasons.push('Repeated characters')
  if (/[A-Z]{12,}/.test(text || '')) reasons.push('Too many capitals')
  if (/(\d[\s.-]?){9,}/.test(t)) reasons.push('Contains a phone number')
  return reasons
}

export function isFlooding(userId, settings = getSettings()) {
  if (!userId) return false
  const since = Date.now() - 60_000
  return getEvents().filter((e) => e.userId === userId && (e.type === 'chat' || e.type === 'feedback') && Date.parse(e.at) > since).length > settings.antiFlood
}

export const getDecisions = () => load('moderation', {})

export function decide(itemId, decision) {
  save('moderation', { ...getDecisions(), [itemId]: decision })
  notify()
}

export function downloadCsv(filename, rows) {
  if (!rows.length) return
  const headers = Object.keys(rows[0])
  const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`
  const csv = [headers.join(','), ...rows.map((r) => headers.map((h) => esc(r[h])).join(','))].join('\n')
  const url = URL.createObjectURL(new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' }))
  const a = Object.assign(document.createElement('a'), { href: url, download: filename })
  a.click()
  URL.revokeObjectURL(url)
}

