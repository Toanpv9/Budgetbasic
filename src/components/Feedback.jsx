import { useEffect, useState } from 'react'
import { Card, Field, Section, SectionHeading, inputClass, primaryButton } from './ui.jsx'
import samples from '../data/sample-feedback.json'
import Icon from './Icon.jsx'
import BeeMark from './BeeMark.jsx'
import { isMuted, useCurrentUser } from '../auth.js'
import { addFeedback, getFeedback, onFeedbackChange } from '../feedbackStore.js'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const EMPTY = { name: '', email: '', rating: 0, category: 'general', comments: '' }
const CATEGORIES = [['general', 'General comment'], ['suggestion', 'Suggestion / new lesson idea'], ['bug', 'Bug report'], ['praise', 'Something I love']]
const AVATAR_COLORS = ['bg-emerald-500', 'bg-amber-400', 'bg-blue-400', 'bg-emerald-700', 'bg-amber-700', 'bg-blue-700']
const FILTERS = [
  ['all', 'All', () => true],
  ['5', '5 stars', (f) => f.rating === 5],
  ['4', '4 stars', (f) => f.rating === 4],
  ['low', '3 stars or less', (f) => f.rating <= 3],
]
const SORTS = {
  newest: ['Newest first', (a, b) => b.order - a.order],
  highest: ['Highest rating', (a, b) => b.rating - a.rating || b.order - a.order],
  lowest: ['Lowest rating', (a, b) => a.rating - b.rating || b.order - a.order],
}

function validate(form) {
  const errors = {}
  if (form.name.trim().length < 2) errors.name = 'Please enter your name (at least 2 characters).'
  if (!form.email.trim()) errors.email = 'Please enter your email.'
  else if (!EMAIL_RE.test(form.email.trim())) errors.email = 'Please enter a valid email, e.g. name@example.com.'
  if (!form.rating) errors.rating = 'Please choose a rating from 1 to 5 stars.'
  if (form.comments.trim().length < 10) errors.comments = 'Please write at least 10 characters.'
  return errors
}

function StarPicker({ value, onChange }) {
  const [hover, setHover] = useState(0)
  return (
    <div className="flex gap-1" role="radiogroup" aria-label="Rating" onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={value === n}
          aria-label={`${n} star${n > 1 ? 's' : ''}`}
          onMouseEnter={() => setHover(n)}
          onClick={() => onChange(n)}
          className="leading-none transition-transform hover:scale-110"
        >
          <Icon name="Star" size={28} className={(hover || value) >= n ? 'text-amber-400 fill-amber-400' : 'text-slate-300 fill-slate-300'} />
        </button>
      ))}
    </div>
  )
}

function StarRow({ value, size = 20 }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Icon key={n} name="Star" size={size} className={n <= Math.round(value) ? 'text-amber-400 fill-amber-400' : 'text-slate-300 fill-slate-300'} />
      ))}
    </span>
  )
}

function FeedbackForm({ onSubmit, user }) {
  const blank = { ...EMPTY, name: user?.name ?? '', email: user?.email ?? '' }
  const [form, setForm] = useState(blank)
  const [touched, setTouched] = useState(false)
  const [sent, setSent] = useState(null)
  const errors = validate(form)
  const show = touched ? errors : {}
  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  const submit = (e) => {
    e.preventDefault()
    setTouched(true)
    if (Object.keys(errors).length) return
    if (isMuted(user)) return setSent({ muted: true })
    const saved = onSubmit({ name: form.name.trim(), email: form.email.trim(), rating: form.rating, category: form.category, text: form.comments.trim() })
    setSent({ name: form.name.trim(), flagged: saved.status === 'flagged' })
    setForm(blank)
    setTouched(false)
  }

  return (
    <Card className="lg:col-span-7">
      <form onSubmit={submit} noValidate className="flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Name" error={show.name}>
            <input className={inputClass} value={form.name} onChange={set('name')} maxLength={50} autoComplete="name" placeholder="Your name" />
          </Field>
          <Field label="Email" error={show.email}>
            <input className={inputClass} type="email" value={form.email} onChange={set('email')} maxLength={80} autoComplete="email" placeholder="name@example.com" />
          </Field>
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="font-heading text-sm text-slate-900 font-semibold">Rating</span>
          <StarPicker value={form.rating} onChange={(rating) => setForm({ ...form, rating })} />
          {show.rating && <span className="text-xs text-red-700 font-semibold" role="alert">{show.rating}</span>}
        </div>
        <Field label="Type">
          <select className={inputClass} value={form.category} onChange={set('category')}>
            {CATEGORIES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </Field>
        <Field label="Comments" error={show.comments}>
          <textarea className={`${inputClass} min-h-28`} value={form.comments} onChange={set('comments')} maxLength={500} placeholder="Tell us what you think..." />
        </Field>
        <button type="submit" className={`${primaryButton} self-start`}>
          <Icon name="Send" size={18} /> Send feedback
        </button>
        {sent && (
          <p className={`p-3 rounded-2xl text-sm font-semibold ${sent.muted ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-950'}`} role="status">
            {sent.muted
              ? 'Your profile is temporarily muted by the admin, so feedback cannot be sent right now.'
              : sent.flagged
                ? `Thanks, ${sent.name}! Your feedback was received and is waiting for admin review before it appears on the wall.`
                : (
                  <span className="flex items-center gap-1.5">
                    <Icon name="CircleCheck" size={16} className="shrink-0" /> Thank you, {sent.name}! Your feedback was received and added to the wall below.
                  </span>
                )}
          </p>
        )}
      </form>
    </Card>
  )
}

export default function Feedback() {
  const user = useCurrentUser()
  const [saved, setSaved] = useState(getFeedback)
  useEffect(() => onFeedbackChange(() => setSaved(getFeedback())), [])
  const entries = [
    ...samples.map((s, i) => ({ ...s, id: `s${i}`, order: i, sample: true })),
    ...saved
      .filter((f) => f.status !== 'hidden' && f.status !== 'flagged')
      .map((f) => ({ ...f, order: samples.length + Date.parse(f.createdAt) / 1e12, sample: false, mine: user && f.userId === user.id })),
  ]
  const [filter, setFilter] = useState('all')
  const [sort, setSort] = useState('newest')

  const add = (entry) => addFeedback({ ...entry, userId: user?.id ?? null })
  const match = FILTERS.find(([k]) => k === filter)[2]
  const visible = entries.filter(match).sort(SORTS[sort][1])
  const average = (entries.reduce((s, e) => s + e.rating, 0) / entries.length).toFixed(1)

  return (
    <>
      <Section id="feedback" tone="low">
        <SectionHeading
          eyebrow="Help us improve"
          title="Send feedback"
          description="Tell us what you like, what's confusing, or what you want to learn next."
        />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <FeedbackForm onSubmit={add} user={user} />
          <Card className="lg:col-span-5 flex flex-col items-center justify-center text-center gap-2 bg-gradient-to-br from-amber-100 to-white">
            <BeeMark size={48} />
            <p className="text-5xl font-extrabold text-slate-900">{average}</p>
            <StarRow value={average} size={24} />
            <p className="text-sm text-slate-600">Average rating from {entries.length} feedback cards</p>
          </Card>
        </div>
      </Section>

      <Section id="feedback-wall" tone="lowest">
        <SectionHeading eyebrow="Community" title="Feedback wall" description="Your feedback appears here straight away." />
        <p className="-mt-6 mb-6 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-300 text-xs text-slate-600">
          <Icon name="Info" size={16} />
          Cards marked “Sample” are demo content written for this student project, not real reviews.
        </p>

        <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter feedback by rating">
            {FILTERS.map(([key, label]) => (
              <button
                key={key}
                type="button"
                aria-pressed={filter === key}
                onClick={() => setFilter(key)}
                className={`px-3.5 py-1.5 rounded-full text-sm font-semibold transition-colors ${filter === key ? 'bg-emerald-700 text-white' : 'bg-slate-50 text-slate-900 hover:bg-slate-100'}`}
              >
                {label}
              </button>
            ))}
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-600">
            Sort
            <select className="px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-slate-900" value={sort} onChange={(e) => setSort(e.target.value)}>
              {Object.entries(SORTS).map(([k, [label]]) => <option key={k} value={k}>{label}</option>)}
            </select>
          </label>
        </div>

        {visible.length === 0 ? (
          <p className="text-sm text-slate-600" role="status">No feedback matches this filter yet.</p>
        ) : (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-5">
            {visible.map((f, i) => (
              <Card key={f.id} className={`mb-5 break-inside-avoid flex flex-col gap-3 ${f.mine ? 'ring-2 ring-emerald-700' : ''}`}>
                <div className="flex items-center gap-3">
                  <span className={`w-10 h-10 rounded-full ${AVATAR_COLORS[i % AVATAR_COLORS.length]} text-white font-bold flex items-center justify-center`} aria-hidden="true">
                    {f.name.charAt(0).toUpperCase()}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-900 truncate">{f.name}</p>
                    {f.school && <p className="text-xs text-slate-600 truncate">{f.school}</p>}
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${f.sample ? 'bg-slate-300 text-slate-600' : 'bg-emerald-700 text-white'}`}>
                    {f.sample ? 'Sample' : f.mine ? 'You' : new Date(f.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
                <StarRow value={f.rating} size={18} />
                <p className="text-sm text-slate-900 leading-relaxed">“{f.text}”</p>
              </Card>
            ))}
          </div>
        )}
      </Section>
    </>
  )
}
