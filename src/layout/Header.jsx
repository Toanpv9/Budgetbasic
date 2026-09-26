import { useEffect, useState } from 'react'
import Icon from '../components/Icon.jsx'
import SubNav from './SubNav.jsx'
import { navigate } from '../router.js'
import { SEARCH_INDEX } from '../pages.jsx'
import { openChat, showMessage } from '../dialogs.js'
import { usePersistentState } from '../utils/usePersistentState.js'

const MENU = [
  {
    label: 'Learn', href: '#/learn', items: [
      ['Budgeting Basics', '#/learn/budgeting-basics'],
      ['Needs vs Wants', '#/learn/needs-wants-game'],
      ['Money Mistakes', '#/learn/money-mistakes'],
      ['Infographic Library', '#/library'],
    ],
  },
  {
    label: 'Tools', href: '#/tools', items: [
      ['50-30-20 Rule', '#/tools/50-30-20-calculator'],
      ['Savings Goals', '#/tools/savings-goals'],
      ['Expense Planner', '#/tools/expense-planner'],
    ],
  },
  { label: 'Ask Bee Bot', onClick: openChat },
  {
    label: 'Connect', href: '#/contact', items: [
      ['About', '#/contact/about'],
      ['Feedback', '#/contact/feedback'],
      ['Contact', '#/contact/contact-info'],
    ],
  },
]

const TIPS = [
  { icon: 'Lightbulb', text: 'Save 20,000 VND per milk tea = 7,300,000 VND a year!' },
  { icon: 'SlidersHorizontal', text: 'The 50/30/20 rule: spend with a plan, reach financial freedom sooner!' },
  { icon: 'Target', text: "Don't save what is left after spending; spend what is left after saving." },
]

const menuLink = 'px-3 py-2 rounded-full font-heading text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-colors'

function searchSite(query) {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean)
  if (!words.length) return null
  const ranked = SEARCH_INDEX.map((entry) => ({ entry, score: words.filter((w) => entry.text.includes(w)).length }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
  return ranked[0]?.entry ?? null
}

function useNow() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(timer)
  }, [])
  return now
}

function Account({ user }) {
  if (!user) {
    return (
      <a href="#/account" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-700 text-white hover:bg-emerald-500 hover:text-emerald-900 font-semibold text-sm transition-colors">
        <Icon name="LogIn" size={18} />
        <span className="hidden sm:inline">Sign in</span>
      </a>
    )
  }
  return (
    <a href="#/account" title="Your profile" className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full hover:bg-slate-200 transition-colors">
      <span className="relative">
        <img alt="" src="avatar.jpg" className="w-8 h-8 rounded-full object-cover" />
        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-slate-50"></span>
      </span>
      <span className="hidden sm:flex flex-col leading-tight">
        <span className="text-sm font-bold text-slate-900 max-w-[8rem] truncate">{user.name.split(' ')[0]}</span>
        <span className="text-[11px] font-bold text-amber-700">{user.role === 'admin' ? 'Admin' : 'Student'}</span>
      </span>
    </a>
  )
}

export default function Header({ page, sectionId, user }) {
  const now = useNow()
  const [query, setQuery] = useState('')
  const [paused, setPaused] = useState(false)
  const [dark, setDark] = usePersistentState('theme-dark', false)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])

  const onSearch = (e) => {
    if (e.key !== 'Enter') return
    const hit = searchSite(query)
    if (hit) navigate(hit.path)
    else showMessage('No results', `Bee couldn't find anything for "${query}". Try "budget", "saving" or "needs".`)
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-50/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="relative z-20 h-20 max-w-7xl mx-auto px-6 flex items-center justify-between gap-4">
        <a href="#/home" className="flex items-center gap-2 group shrink-0">
          <img alt="BudgetBee logo" src="logo-mark.png" width="44" height="44" className="h-11 w-11 object-contain transition-transform group-hover:rotate-6" />
          <span className="flex flex-col">
            <span className="font-heading text-xl font-semibold text-emerald-700 tracking-tight leading-none group-hover:text-emerald-500 transition-colors">BudgetBee</span>
            <span className="font-heading text-xs font-bold text-slate-600 leading-tight mt-0.5">Smart money for students</span>
          </span>
        </a>

        <nav className="hidden xl:flex items-center gap-1" aria-label="Main">
          {MENU.map((m) =>
            m.items ? (
              <div key={m.label} className="relative group">
                <a href={m.href} className={`flex items-center gap-1 ${menuLink}`}>
                  {m.label} <Icon name="ChevronDown" size={18} />
                </a>
                <div className="absolute left-0 top-full pt-2 w-64 hidden group-hover:block group-focus-within:block">
                  <div className="p-1 bg-white rounded-2xl shadow-[0_12px_28px_-6px_rgba(16,185,129,0.12)] flex flex-col gap-0.5">
                    {m.items.map(([label, href]) => (
                      <a key={href} href={href} className="px-3 py-2 rounded-2xl font-heading text-sm font-semibold text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-colors">
                        {label}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <button key={m.label} type="button" onClick={m.onClick} className={menuLink}>{m.label}</button>
            ),
          )}
        </nav>

        <div className="flex items-center gap-2 shrink-0">
          <label className="hidden md:flex items-center relative w-48 lg:w-56">
            <span className="sr-only">Search the site</span>
            <Icon name="Search" size={18} className="absolute left-3 text-slate-600" />
            <input
              id="bb-search"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={onSearch}
              placeholder="Search lessons, tools..."
              className="w-full pl-9 pr-8 py-1.5 rounded-full bg-slate-100 font-body text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:bg-white transition-colors"
            />
          </label>
          <div className="hidden lg:flex flex-col items-end pr-2" aria-live="off">
            <span className="font-heading text-xs text-emerald-700 font-bold tracking-tight">{now.toLocaleTimeString('en-US')}</span>
            <span className="font-heading text-[11px] text-slate-600">
              {now.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
          <button
            type="button"
            aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
            onClick={() => setDark((d) => !d)}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors"
          >
            <Icon name={dark ? 'Sun' : 'Moon'} size={20} />
          </button>
          <Account user={user} />
        </div>
      </div>

      <div className="w-full bg-slate-100 border-b border-slate-200 py-2">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between gap-2">
          <div className="shrink-0 flex items-center gap-1 font-heading text-sm text-amber-700 font-bold mr-4">
            <Icon name="Megaphone" size={18} /> Money tip:
          </div>
          <div className="overflow-hidden relative flex-1">
            <div className={`ticker-track font-body text-sm text-slate-900 flex items-center gap-12 font-medium ${paused ? 'is-paused' : ''}`}>
              {[...TIPS, ...TIPS].map((tip, i) => (
                <span key={i} className="inline-flex items-center gap-1.5" aria-hidden={i >= TIPS.length}>
                  <Icon name={tip.icon} size={16} className="shrink-0" /> {tip.text}
                </span>
              ))}
            </div>
          </div>
          <button
            type="button"
            aria-label={paused ? 'Resume ticker' : 'Pause ticker'}
            title="Pause / Resume"
            onClick={() => setPaused((p) => !p)}
            className="shrink-0 flex items-center justify-center w-7 h-7 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-900 transition-colors"
          >
            <Icon name={paused ? 'Play' : 'Pause'} size={16} />
          </button>
        </div>
      </div>

      <SubNav page={page} sectionId={sectionId} />
    </header>
  )
}
