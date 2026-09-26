import { useEffect, useState } from 'react'
import { clearAll, load, remove, save } from './utils/storage.js'
import { logEvent } from './admin/adminStore.js'

const USERS_KEY = 'users'
const SESSION_KEY = 'session'
const EVENT = 'bb:auth-change'

export const DEMO_ADMIN = {
  id: 'admin',
  name: 'BudgetBee Admin',
  email: 'admin@budgetbee.demo',
  school: 'BudgetBee team',
  role: 'admin',
  createdAt: '2026-09-01T00:00:00.000Z',
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const notify = () => window.dispatchEvent(new Event(EVENT))

export function getUsers() {
  const users = load(USERS_KEY, [])
  return users.some((u) => u.id === DEMO_ADMIN.id) ? users : [DEMO_ADMIN, ...users]
}

function saveUsers(users) {
  save(USERS_KEY, users.filter((u) => u.id !== DEMO_ADMIN.id))
}

export function getCurrentUser() {
  const session = load(SESSION_KEY, null)
  const user = session ? getUsers().find((u) => u.id === session.userId) ?? null : null
  return user && !loginRestriction(user) ? user : null
}

export function validateProfile({ name, email }) {
  const errors = {}
  if (!name || name.trim().length < 2) errors.name = 'Please enter your name (at least 2 characters).'
  if (!email || !EMAIL_RE.test(email.trim())) errors.email = 'Please enter a valid email, e.g. name@example.com.'
  return errors
}

export function register({ name, email, school }) {
  const errors = validateProfile({ name, email })
  if (Object.keys(errors).length) return { errors }
  const users = getUsers()
  const normalized = email.trim().toLowerCase()
  if (users.some((u) => u.email === normalized)) return { errors: { email: 'A profile with this email already exists on this device. Sign in instead.' } }
  const user = {
    id: `u${Date.now().toString(36)}`,
    name: name.trim(),
    email: normalized,
    school: (school || '').trim(),
    role: 'student',
    status: 'active',
    createdAt: new Date().toISOString(),
  }
  saveUsers([...users, { ...user, loginCount: 1, lastLogin: user.createdAt }])
  save(SESSION_KEY, { userId: user.id, since: new Date().toISOString() })
  logEvent('register', { userId: user.id })
  notify()
  return { user }
}

export function signIn(email) {
  const normalized = (email || '').trim().toLowerCase()
  if (!EMAIL_RE.test(normalized)) return { errors: { email: 'Please enter a valid email.' } }
  const user = getUsers().find((u) => u.email === normalized)
  if (!user) return { errors: { email: 'No profile with this email on this device. Create one first.' } }
  const restriction = loginRestriction(user)
  if (restriction) return { errors: { email: restriction } }
  save(SESSION_KEY, { userId: user.id, since: new Date().toISOString() })
  const users = getUsers().map((u) => (u.id === user.id ? { ...u, lastLogin: new Date().toISOString(), loginCount: (u.loginCount ?? 0) + 1 } : u))
  saveUsers(users)
  logEvent('login', { userId: user.id })
  notify()
  return { user }
}

export function loginRestriction(user) {
  if (user.status === 'banned') return `This profile was banned by the admin${user.banReason ? `: ${user.banReason}` : ''}.`
  if (user.lockedUntil && Date.parse(user.lockedUntil) > Date.now()) {
    return `This profile is locked until ${new Date(user.lockedUntil).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}.`
  }
  return null
}

export const isMuted = (user) => !!(user?.mutedUntil && Date.parse(user.mutedUntil) > Date.now())

export function signOut() {
  remove(SESSION_KEY)
  notify()
}

export function updateUser(id, changes) {
  saveUsers(getUsers().map((u) => (u.id === id ? { ...u, ...changes } : u)))
  notify()
}

export function deleteUser(id) {
  if (id === DEMO_ADMIN.id) return
  saveUsers(getUsers().filter((u) => u.id !== id))
  clearAll(`user:${id}:`)
  if (load(SESSION_KEY, null)?.userId === id) remove(SESSION_KEY)
  notify()
}

export function useCurrentUser() {
  const [user, setUser] = useState(getCurrentUser)
  useEffect(() => {
    const refresh = () => setUser(getCurrentUser())
    window.addEventListener(EVENT, refresh)
    window.addEventListener('storage', refresh)
    return () => {
      window.removeEventListener(EVENT, refresh)
      window.removeEventListener('storage', refresh)
    }
  }, [])
  return user
}
