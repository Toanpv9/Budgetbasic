import { useEffect, useState } from 'react'
import { getUsers } from '../auth.js'
import { isFuture, withinMs } from './format.js'
import { getFeedback } from '../feedbackStore.js'
import { getAudit, getDecisions, getEvents, getSettings, onAdminChange, spamReasons } from './adminStore.js'

const DAY = 86_400_000

export function useAdminData() {
  const [, setTick] = useState(0)
  useEffect(() => onAdminChange(() => setTick((t) => t + 1)), [])

  const users = getUsers()
  const students = users.filter((u) => u.role !== 'admin')
  const feedback = getFeedback()
  const events = getEvents()
  const settings = getSettings()
  const decisions = getDecisions()
  const logins = events.filter((e) => e.type === 'login' || e.type === 'register')

  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime()
  const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).getTime()
  const loginsThisMonth = logins.filter((e) => Date.parse(e.at) >= monthStart).length
  const loginsPrevMonth = logins.filter((e) => Date.parse(e.at) >= prevMonthStart && Date.parse(e.at) < monthStart).length

  const flaggedFeedback = feedback
    .filter((f) => f.status === 'flagged')
    .map((f) => ({ id: f.id, kind: 'feedback', userId: f.userId, name: f.name, text: f.text, at: f.createdAt, reasons: spamReasons(`${f.name} ${f.text}`, settings) }))
  const flaggedChat = events
    .filter((e) => e.type === 'chat')
    .map((e) => ({ id: `chat:${e.at}`, kind: 'chat', userId: e.userId, name: e.name, text: e.text, at: e.at, reasons: spamReasons(e.text, settings) }))
    .filter((c) => c.reasons.length && !decisions[c.id])
  const queue = [...flaggedFeedback, ...flaggedChat].sort((a, b) => b.at.localeCompare(a.at))

  const months = Array.from({ length: 6 }, (_, i) => {
    const start = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1)
    const end = new Date(now.getFullYear(), now.getMonth() - 4 + i, 1)
    return {
      label: start.toLocaleDateString('en-US', { month: 'short' }),
      value: logins.filter((e) => Date.parse(e.at) >= start && Date.parse(e.at) < end).length,
    }
  })
  const weeks = Array.from({ length: 8 }, (_, i) => {
    const end = now.getTime() - (7 - i) * 7 * DAY
    const start = end - 7 * DAY
    return { label: `W${i + 1}`, value: logins.filter((e) => Date.parse(e.at) > start && Date.parse(e.at) <= end).length }
  })

  const hours = Array(24).fill(0)
  logins.forEach((e) => { hours[new Date(e.at).getHours()] += 1 })
  const peak = hours.indexOf(Math.max(...hours))

  const daysByUser = {}
  logins.forEach((e) => { (daysByUser[e.userId] ??= new Set()).add(e.at.slice(0, 10)) })
  const returning = students.filter((u) => (daysByUser[u.id]?.size ?? 0) >= 2).length

  const mobile = logins.filter((e) => e.device === 'mobile').length

  const schools = {}
  students.forEach((u) => { if (u.school && u.school !== '—') schools[u.school] = (schools[u.school] ?? 0) + 1 })
  const topSchools = Object.entries(schools).sort((a, b) => b[1] - a[1]).slice(0, 4)

  const activeNow = new Set(events.filter((e) => withinMs(e.at, 15 * 60_000)).map((e) => e.userId)).size

  return {
    users, students, feedback, events, settings, queue, months, weeks, topSchools, activeNow,
    loginsThisMonth, loginsPrevMonth,
    newThisMonth: students.filter((u) => Date.parse(u.createdAt) >= monthStart).length,
    restricted: students.filter((u) => u.status === 'banned' || isFuture(u.lockedUntil)).length,
    avgRating: feedback.length ? feedback.reduce((s, f) => s + f.rating, 0) / feedback.length : 0,
    unread: feedback.filter((f) => !f.read && f.status !== 'flagged').length,
    peakHour: logins.length ? peak : null,
    retention: students.length ? Math.round((returning / students.length) * 100) : 0,
    mobileShare: logins.length ? Math.round((mobile / logins.length) * 100) : 0,
    loginTotal: logins.length,
    audit: getAudit(),
  }
}
