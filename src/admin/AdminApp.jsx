import { useState } from 'react'
import Icon from '../components/Icon.jsx'
import { signOut, useCurrentUser } from '../auth.js'
import { useAdminData } from './useAdminData.js'
import { AuditTrail, FeedbackCenter, Moderation, Overview, Settings, Stats, Users } from './AdminSections.jsx'

const NAV = [
  ['overview', 'Dashboard overview', 'LayoutDashboard'],
  ['users', 'Users & bans', 'Users'],
  ['moderation', 'Moderation & spam', 'ShieldCheck'],
  ['feedback', 'Feedback center', 'Send'],
  ['stats', 'Sign-in statistics', 'TrendingUp'],
  ['settings', 'Settings', 'SlidersHorizontal'],
]

function Gate() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-sm border border-slate-200 flex flex-col items-center gap-3">
        <img src="logo-mark.png" alt="" className="w-16 h-16" />
        <h1 className="text-xl font-bold text-slate-900">Admins only</h1>
        <p className="text-sm text-slate-600">Sign in with the demo admin profile (admin@budgetbee.demo) to open the dashboard.</p>
        <a href="#/account" className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-emerald-700 text-white font-semibold text-sm"><Icon name="LogIn" size={18} /> Go to sign in</a>
        <a href="#/home" className="text-sm text-emerald-700 font-semibold hover:underline">Back to the student site</a>
      </div>
    </div>
  )
}

export default function AdminApp({ section }) {
  const me = useCurrentUser()
  const data = useAdminData()
  const [query, setQuery] = useState('')
  const [notice, setNotice] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)

  if (!me || me.role !== 'admin') return <Gate />
  const alerts = data.unread + data.queue.length
  const current = section ?? 'overview'

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <aside className={`fixed left-0 top-0 h-full w-72 bg-white shadow-[0_1px_8px_rgba(0,0,0,0.06)] z-50 flex flex-col transition-transform lg:translate-x-0 ${menuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-16 px-6 flex items-center gap-3 bg-slate-50/50">
          <img src="logo-mark.png" alt="BudgetBee logo" className="h-9 w-9" />
          <div className="flex flex-col leading-tight">
            <span className="font-heading text-lg text-emerald-700 font-bold">BudgetBee</span>
            <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">Admin hub</span>
          </div>
        </div>
        <div className="px-6 py-4">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-200 text-xs font-semibold text-slate-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> System: normal (simulated)
          </span>
        </div>
        <nav className="flex-1 px-4 flex flex-col gap-1" aria-label="Admin sections">
          {NAV.map(([id, label, icon]) => (
            <a key={id} href={`#/admin/${id}`} onClick={() => setMenuOpen(false)} aria-current={current === id ? 'page' : undefined}
              className={`flex items-center gap-3 px-4 py-3 rounded-full text-sm font-semibold transition-all ${current === id ? 'bg-emerald-700 text-white shadow-[0_4px_12px_rgba(0,108,73,0.18)]' : 'text-slate-600 hover:bg-slate-200 hover:text-slate-900'}`}>
              <Icon name={icon} size={18} /> {label}
            </a>
          ))}
        </nav>
        <div className="p-4">
          <a href="#/home" className="flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-slate-100 text-sm font-semibold hover:bg-slate-200">
            <Icon name="ChevronLeft" size={18} /> Back to student site
          </a>
        </div>
      </aside>
      {menuOpen && <button type="button" aria-label="Close menu" className="fixed inset-0 z-40 bg-black/30 lg:hidden" onClick={() => setMenuOpen(false)} />}

      <div className="lg:ml-72">
        <header className="sticky top-0 z-30 h-16 bg-slate-50/90 backdrop-blur-xl border-b border-slate-200 px-4 lg:px-8 flex items-center gap-4">
          <button type="button" className="lg:hidden p-2 rounded-full hover:bg-slate-100" aria-label="Open menu" onClick={() => setMenuOpen(true)}><Icon name="SlidersHorizontal" size={20} /></button>
          <label className="relative flex-1 max-w-md">
            <span className="sr-only">Search students and feedback</span>
            <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search students, IDs, emails, feedback…" className="w-full pl-10 pr-4 py-2 rounded-full bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </label>
          <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 text-xs font-semibold">
            <Icon name="Clock" size={14} /> {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
          <a href="#/admin/feedback" className="relative p-2 rounded-full hover:bg-slate-100" aria-label={`${alerts} items need attention`}>
            <Icon name="Megaphone" size={20} />
            {alerts > 0 && <span className="absolute -top-0.5 -right-0.5 min-w-5 h-5 px-1 rounded-full bg-red-700 text-white text-[10px] font-bold flex items-center justify-center">{alerts}</span>}
          </a>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex flex-col items-end leading-tight">
              <span className="text-sm font-bold">{me.name}</span>
              <span className="text-[11px] font-semibold text-amber-700">Super admin (demo)</span>
            </div>
            <img src="avatar.jpg" alt="" className="w-9 h-9 rounded-full object-cover" />
            <button type="button" onClick={signOut} aria-label="Sign out" className="p-2 rounded-full hover:bg-slate-100"><Icon name="LogOut" size={18} /></button>
          </div>
        </header>

        <main className="p-4 lg:p-8 flex flex-col gap-6 max-w-[1500px]">
          {notice && (
            <div className="p-3 rounded-2xl bg-blue-100 text-blue-950 text-sm font-semibold flex items-center gap-2" role="status">
              <Icon name="Info" size={18} /> <span className="flex-1">{notice}</span>
              <button type="button" aria-label="Dismiss" onClick={() => setNotice(null)}><Icon name="X" size={16} /></button>
            </div>
          )}
          <Overview data={data} notify={setNotice} />
          <Stats data={data} />
          <Users data={data} query={query} />
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
            <Moderation data={data} />
            <FeedbackCenter data={data} query={query} notify={setNotice} />
          </div>
          <AuditTrail data={data} />
          <Settings data={data} />
          <p className="text-xs text-slate-600 text-center pb-6">Demo admin dashboard for a student project. Data is stored only in this browser; server actions are simulated.</p>
        </main>
      </div>
    </div>
  )
}
