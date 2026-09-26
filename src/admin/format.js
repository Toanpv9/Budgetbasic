export const fmtDate = (iso) => (iso ? new Date(iso).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }) : '—')

export function timeAgo(iso) {
  const s = Math.round((Date.now() - Date.parse(iso)) / 1000)
  if (s < 60) return 'just now'
  if (s < 3600) return `${Math.floor(s / 60)} min ago`
  if (s < 86400) return `${Math.floor(s / 3600)} h ago`
  return `${Math.floor(s / 86400)} d ago`
}

export const nowMs = () => Date.now()
export const isFuture = (iso) => Boolean(iso) && Date.parse(iso) > nowMs()
export const withinMs = (iso, ms) => nowMs() - Date.parse(iso) < ms
export const inHours = (h) => new Date(nowMs() + h * 3_600_000).toISOString()
