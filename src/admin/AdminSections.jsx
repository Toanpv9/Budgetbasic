import { useState } from 'react'
import Icon from '../components/Icon.jsx'
import { useAnchor } from '../anchors.js'
import { Btn, Initials, Kpi, LineChart, Panel, Pill, Stars } from './AdminParts.jsx'
import { fmtDate, inHours, isFuture, nowMs, timeAgo } from './format.js'
import { deleteUser, updateUser } from '../auth.js'
import { deleteFeedback, updateFeedback } from '../feedbackStore.js'
import { decide, downloadCsv, logAudit, saveSettings } from './adminStore.js'
import { clearAll, listKeys } from '../utils/storage.js'

const HOUR = 3_600_000
const DAY = 24 * HOUR

export function Overview({ data, notify }) {
  const anchor = useAnchor('overview')
  const change = data.loginsPrevMonth ? Math.round(((data.loginsThisMonth - data.loginsPrevMonth) / data.loginsPrevMonth) * 100) : null
  const exportUsers = () => {
    downloadCsv('budgetbee-users.csv', data.students.map((u) => ({
      id: u.id, name: u.name, email: u.email, school: u.school, status: u.status ?? 'active', logins: u.loginCount ?? 0, joined: u.createdAt, lastLogin: u.lastLogin ?? '', notes: u.notes ?? '',
    })))
    logAudit('EXPORT', 'Exported users CSV')
  }
  const scan = () => {
    notify(`Spam scan finished: ${data.queue.length} item(s) need review in the moderation queue.`)
    logAudit('SPAM SCAN', `${data.queue.length} item(s) flagged`)
  }

  return (
    <div id="overview" ref={anchor} className="flex flex-col gap-6 scroll-mt-24">
      <Panel>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <h1 className="font-heading text-2xl lg:text-3xl text-slate-900 font-extrabold">BudgetBee Admin Center</h1>
            <div className="flex flex-wrap gap-2 mt-3">
              <Pill tone="green"><span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> 99.98% uptime (simulated)</Pill>
              <Pill tone="gray">Version 2.4.1</Pill>
              <Pill tone="blue">Data: this browser (localStorage)</Pill>
            </div>
            <p className="text-sm text-slate-600 mt-3 max-w-2xl">
              Monitor {data.students.length} student profiles, {data.loginTotal} sign-ins, feedback and spam on this device.
            </p>
          </div>
          <div className="flex gap-3">
            <Btn icon="Download" onClick={exportUsers} className="!px-5 !py-3 !text-sm">Export CSV</Btn>
            <Btn tone="primary" icon="RefreshCw" onClick={scan} className="!px-5 !py-3 !text-sm">Run spam scan</Btn>
          </div>
        </div>
      </Panel>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        <Kpi label="Students" value={data.students.length} icon="Users" hint={`+${data.newThisMonth} this month`} />
        <Kpi label="Sign-ins this month" value={data.loginsThisMonth} icon="LogIn" tone="amber" hint={change === null ? 'No data last month' : `${change >= 0 ? '+' : ''}${change}% vs last month`} />
        <Kpi label="Active now" value={data.activeNow} icon="User" tone="blue" hint="Last 15 min, this device" />
        <Kpi label="Banned / locked" value={data.restricted} icon="Ban" tone="red" hint={`${data.students.length ? ((data.restricted / data.students.length) * 100).toFixed(1) : 0}% of students`} />
        <Kpi label="To moderate" value={data.queue.length} icon="ShieldCheck" tone="amber" hint="Spam rule matches" />
        <Kpi
          label="Feedback"
          value={data.feedback.length}
          icon="Send"
          tone="blue"
          hint={<span className="inline-flex items-center gap-1">{data.unread} unread • avg {data.avgRating.toFixed(1)} <Icon name="Star" size={12} className="text-amber-400 fill-amber-400" /></span>}
        />
      </div>
    </div>
  )
}

export function Stats({ data }) {
  const anchor = useAnchor('stats')
  const [range, setRange] = useState('month')
  const points = range === 'month' ? data.months : data.weeks
  const peak = data.peakHour === null ? '—' : `${String(data.peakHour).padStart(2, '0')}:00 – ${String((data.peakHour + 1) % 24).padStart(2, '0')}:00`
  return (
    <div id="stats" ref={anchor} className="grid grid-cols-1 xl:grid-cols-12 gap-6 scroll-mt-24">
      <Panel
        className="xl:col-span-8"
        title="Sign-ins & student activity"
        icon="TrendingUp"
        subtitle={range === 'month' ? 'Sign-ins per month, last 6 months' : 'Sign-ins per week, last 8 weeks'}
        actions={[['month', 'By month'], ['week', 'By week']].map(([k, l]) => (
          <button key={k} type="button" aria-pressed={range === k} onClick={() => setRange(k)} className={`px-3 py-1.5 rounded-full text-xs font-bold ${range === k ? 'bg-emerald-700 text-white' : 'bg-slate-50'}`}>{l}</button>
        ))}
      >
        <LineChart points={points} />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
          <div className="p-4 rounded-2xl bg-slate-50"><p className="text-xs text-slate-600">Peak sign-in hour</p><p className="text-xl font-extrabold text-slate-900">{peak}</p></div>
          <div className="p-4 rounded-2xl bg-slate-50"><p className="text-xs text-slate-600">Returning students (2+ days)</p><p className="text-xl font-extrabold text-emerald-700">{data.retention}%</p></div>
          <div className="p-4 rounded-2xl bg-slate-50"><p className="text-xs text-slate-600">Avg. session (simulated)</p><p className="text-xl font-extrabold text-amber-700">4 min 18 s</p></div>
        </div>
      </Panel>
      <div className="xl:col-span-4 flex flex-col gap-6">
        <Panel title="Devices" icon="Laptop">
          {[['Mobile', data.mobileShare, 'bg-amber-400'], ['Desktop / laptop', 100 - data.mobileShare, 'bg-blue-700']].map(([label, pct, color]) => (
            <div key={label} className="mb-4">
              <div className="flex justify-between text-sm"><span className="font-semibold">{label}</span><span className="font-bold">{data.loginTotal ? pct : 0}%</span></div>
              <div className="h-2.5 rounded-full bg-slate-200 mt-1.5 overflow-hidden"><div className={`h-full ${color}`} style={{ width: `${data.loginTotal ? pct : 0}%` }}></div></div>
            </div>
          ))}
        </Panel>
        <Panel title="Top universities" icon="GraduationCap">
          {data.topSchools.length === 0 ? (
            <p className="text-sm text-slate-600">No universities yet. Students can add one when they create a profile.</p>
          ) : (
            <ol className="flex flex-col gap-3">
              {data.topSchools.map(([school, count], i) => (
                <li key={school} className="flex items-center gap-3">
                  <span className="w-7 h-7 shrink-0 rounded-full bg-emerald-100 text-emerald-950 text-xs font-bold flex items-center justify-center">{i + 1}</span>
                  <span className="flex-1 text-sm font-semibold text-slate-900">{school}</span>
                  <span className="text-sm font-bold">{count}</span>
                </li>
              ))}
            </ol>
          )}
        </Panel>
      </div>
    </div>
  )
}

function statusOf(u) {
  if (u.status === 'banned') return ['Banned', 'red']
  if (isFuture(u.lockedUntil)) return [`Locked until ${new Date(u.lockedUntil).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`, 'amber']
  if (isFuture(u.mutedUntil)) return ['Muted', 'amber']
  if (u.status === 'warned') return ['Warned', 'amber']
  return ['Active', 'green']
}

function BanModal({ users, initialId, onClose }) {
  const [userId, setUserId] = useState(initialId ?? users[0]?.id ?? '')
  const [reason, setReason] = useState('')
  const [duration, setDuration] = useState('7d')
  const [error, setError] = useState('')
  const options = [['24h', '24 hours', DAY], ['7d', '7 days', 7 * DAY], ['30d', '30 days', 30 * DAY], ['forever', 'Permanent ban', null]]
  const confirm = () => {
    if (!userId) return setError('Choose a student.')
    if (reason.trim().length < 5) return setError('Write a reason (at least 5 characters).')
    const opt = options.find((o) => o[0] === duration)
    const user = users.find((u) => u.id === userId)
    if (opt[2]) updateUser(userId, { lockedUntil: new Date(nowMs() + opt[2]).toISOString(), banReason: reason.trim() })
    else updateUser(userId, { status: 'banned', banReason: reason.trim() })
    logAudit(opt[2] ? 'LOCK' : 'BAN', `${user.name} (${opt[1]}): ${reason.trim()}`)
    onClose()
  }
  return (
    <div className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Lock or ban a student">
      <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2"><Icon name="Ban" size={20} className="text-red-700" /> Lock / ban a student</h3>
          <button type="button" aria-label="Close" onClick={onClose} className="p-1.5 rounded-full hover:bg-slate-100"><Icon name="X" size={18} /></button>
        </div>
        <label className="flex flex-col gap-1 text-sm font-semibold">Student
          <select value={userId} onChange={(e) => setUserId(e.target.value)} className="px-3 py-2 rounded-5xl bg-slate-50 border border-slate-200 font-normal">
            {users.map((u) => <option key={u.id} value={u.id}>{u.name} ({u.email})</option>)}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm font-semibold">Reason
          <textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={3} maxLength={200} placeholder="e.g. Posting scam links" className="px-3 py-2 rounded-5xl bg-slate-50 border border-slate-200 font-normal" />
        </label>
        <fieldset className="flex flex-col gap-2 text-sm">
          <legend className="font-semibold mb-1">Duration</legend>
          {options.map(([key, label]) => (
            <label key={key} className="flex items-center gap-2"><input type="radio" name="ban-duration" checked={duration === key} onChange={() => setDuration(key)} className="accent-[#ba1a1a]" />{label}</label>
          ))}
        </fieldset>
        {error && <p className="text-xs text-red-700 font-semibold" role="alert">{error}</p>}
        <div className="flex justify-end gap-2">
          <Btn onClick={onClose}>Cancel</Btn>
          <Btn tone="danger" icon="Ban" onClick={confirm}>Confirm</Btn>
        </div>
      </div>
    </div>
  )
}

export function Users({ data, query }) {
  const [status, setStatus] = useState('all')
  const [open, setOpen] = useState(null)
  const [banFor, setBanFor] = useState(undefined)
  const q = query.trim().toLowerCase()
  const list = data.students.filter((u) => {
    const [label] = statusOf(u)
    const matchQ = !q || `${u.name} ${u.email} ${u.id} ${u.school}`.toLowerCase().includes(q)
    const matchS = status === 'all' || label.toLowerCase().startsWith(status)
    return matchQ && matchS
  })
  const act = (u, changes, action, detail) => {
    updateUser(u.id, changes)
    logAudit(action, `${u.name}${detail ? `: ${detail}` : ''}`)
  }

  return (
    <Panel
      id="users"
      title="Users & ban management"
      icon="Users"
      subtitle="Profiles saved in this browser. Lock, warn, ban or reward students."
      actions={
        <>
          <select value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Filter by status" className="px-3 py-2 rounded-full bg-slate-50 border border-slate-200 text-sm">
            <option value="all">All statuses</option><option value="active">Active</option><option value="warned">Warned</option>
            <option value="muted">Muted</option><option value="locked">Locked</option><option value="banned">Banned</option>
          </select>
          <Btn tone="danger" icon="Ban" onClick={() => setBanFor(null)}>Quick ban</Btn>
        </>
      }
    >
      {list.length === 0 ? (
        <p className="text-sm text-slate-600 py-6 text-center">No students match. Students appear here after they create a profile.</p>
      ) : (
        <div className="overflow-x-auto -mx-2">
          <table className="w-full text-sm min-w-[900px]">
            <thead className="text-left text-[11px] uppercase tracking-wider text-slate-600">
              <tr><th className="p-2">Student / ID</th><th className="p-2">Email & school</th><th className="p-2">Sign-ins</th><th className="p-2">Status</th><th className="p-2 w-56">Admin notes</th><th className="p-2 text-right">Actions</th></tr>
            </thead>
            <tbody>
              {list.map((u) => {
                const [label, tone] = statusOf(u)
                const blocked = u.status === 'banned' || isFuture(u.lockedUntil)
                return [
                  <tr key={u.id} className={`border-t border-slate-200 align-top ${u.status === 'banned' ? 'bg-red-100/20' : ''}`}>
                    <td className="p-2">
                      <div className="flex items-center gap-3">
                        <Initials name={u.name} tone={tone} />
                        <div>
                          <p className="font-bold text-slate-900">{u.name}</p>
                          <p className="text-[11px] font-mono text-slate-600">ID: {u.id}</p>
                          {(u.badges ?? []).map((b) => <Pill key={b} tone="blue" className="mt-1"><Icon name="Star" size={11} className="fill-current" /> {b}</Pill>)}
                        </div>
                      </div>
                    </td>
                    <td className="p-2"><p className="text-slate-900">{u.email}</p><p className="text-xs text-slate-600">{u.school || '—'}</p></td>
                    <td className="p-2"><Pill tone={(u.loginCount ?? 0) > 150 ? 'green' : 'gray'}>{u.loginCount ?? 0}</Pill></td>
                    <td className="p-2"><Pill tone={tone}>{label}</Pill>{u.banReason && blocked && <p className="text-[11px] text-red-700 mt-1">{u.banReason}</p>}</td>
                    <td className="p-2">
                      <textarea
                        defaultValue={u.notes ?? ''}
                        onBlur={(e) => e.target.value !== (u.notes ?? '') && act(u, { notes: e.target.value }, 'NOTE', 'updated admin note')}
                        rows={2}
                        aria-label={`Admin note for ${u.name}`}
                        placeholder="Add a note…"
                        className="w-full text-xs px-2 py-1.5 rounded-5xl bg-slate-50 border border-slate-200"
                      />
                    </td>
                    <td className="p-2">
                      <div className="flex flex-wrap justify-end gap-1.5">
                        <Btn icon="Eye" onClick={() => setOpen(open === u.id ? null : u.id)}>{open === u.id ? 'Hide' : 'Details'}</Btn>
                        {blocked ? (
                          <Btn tone="primary" icon="BadgeCheck" onClick={() => act(u, { status: 'active', lockedUntil: null, banReason: null }, 'UNBAN', 'restored access')}>Unban</Btn>
                        ) : (
                          <>
                            {u.status !== 'warned' && <Btn tone="amber" icon="CircleAlert" onClick={() => act(u, { status: 'warned' }, 'WARN', 'warning sent (simulated email)')}>Warn</Btn>}
                            <Btn tone="dangerSoft" icon="Lock" onClick={() => act(u, { lockedUntil: inHours(24), banReason: 'Temporary lock (24h)' }, 'LOCK', '24 hours')}>Lock 24h</Btn>
                            <Btn tone="danger" icon="Ban" onClick={() => setBanFor(u.id)}>Ban</Btn>
                          </>
                        )}
                        <Btn icon="BadgeCheck" onClick={() => {
                          const has = (u.badges ?? []).includes('Top contributor')
                          act(u, { badges: has ? [] : ['Top contributor'] }, has ? 'BADGE REMOVED' : 'BADGE', 'Top contributor')
                        }}>{(u.badges ?? []).length ? 'Remove badge' : 'Give badge'}</Btn>
                      </div>
                    </td>
                  </tr>,
                  open === u.id && (
                    <tr key={`${u.id}-details`} className="bg-slate-50">
                      <td colSpan="6" className="p-4 text-sm">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          <div><p className="text-xs text-slate-600">Joined</p><p className="font-semibold">{fmtDate(u.createdAt)}</p></div>
                          <div><p className="text-xs text-slate-600">Last sign-in</p><p className="font-semibold">{fmtDate(u.lastLogin)}</p></div>
                          <div><p className="text-xs text-slate-600">Feedback sent</p><p className="font-semibold">{data.feedback.filter((f) => f.userId === u.id).length}</p></div>
                          <div><p className="text-xs text-slate-600">Chat questions</p><p className="font-semibold">{data.events.filter((e) => e.type === 'chat' && e.userId === u.id).length}</p></div>
                        </div>
                        <div className="mt-3 flex gap-2">
                          <Btn icon="Mail" onClick={() => logAudit('MESSAGE', `Message to ${u.email} (simulated, not sent)`)}>Send message (simulated)</Btn>
                          <Btn tone="dangerSoft" icon="Trash2" onClick={() => { deleteUser(u.id); logAudit('DELETE', `${u.name} and all saved data`) }}>Delete profile</Btn>
                        </div>
                      </td>
                    </tr>
                  ),
                ]
              })}
            </tbody>
          </table>
        </div>
      )}
      {banFor !== undefined && <BanModal users={data.students.filter((u) => u.status !== 'banned')} initialId={banFor} onClose={() => setBanFor(undefined)} />}
    </Panel>
  )
}

export function Moderation({ data }) {
  const handle = (item, decision) => {
    const user = data.users.find((u) => u.id === item.userId)
    if (item.kind === 'feedback') {
      if (decision === 'approve') updateFeedback(item.id, { status: 'new' })
      else if (decision === 'delete') deleteFeedback(item.id)
      else updateFeedback(item.id, { status: 'hidden' })
    } else {
      decide(item.id, decision)
    }
    if (user && decision === 'mute') updateUser(user.id, { mutedUntil: inHours(48) })
    if (user && decision === 'delete') updateUser(user.id, { status: 'banned', banReason: 'Spam (moderation)' })
    logAudit(decision === 'approve' ? 'APPROVE' : decision === 'mute' ? 'MUTE 48H' : decision === 'delete' ? 'DELETE + BAN' : 'IGNORE', `${item.name}: “${item.text.slice(0, 40)}…”`)
  }
  return (
    <Panel id="moderation" title="Moderation & spam filter" icon="ShieldCheck" subtitle="Feedback and Bee Bot messages that break the spam rules wait here." actions={<Pill tone="red">{data.queue.length} waiting</Pill>}>
      <div className="p-4 rounded-2xl bg-slate-50 grid grid-cols-1 md:grid-cols-3 gap-2 text-sm mb-5">
        <p><strong className="text-emerald-700">Anti-flood:</strong> max {data.settings.antiFlood} messages / minute</p>
        <p><strong className="text-emerald-700">Blacklist:</strong> {data.settings.blacklist.length} words / links</p>
        <p><strong className="text-emerald-700">Captcha:</strong> {data.settings.captcha ? 'on (simulated)' : 'off'}</p>
      </div>
      {data.queue.length === 0 ? (
        <p className="flex items-center justify-center gap-2 text-sm text-slate-600 text-center py-6"><Icon name="PartyPopper" size={18} /> Nothing to moderate. Try posting feedback with a link like “bit.ly/…” to test the filter.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {data.queue.map((item) => (
            <li key={item.id} className="p-4 rounded-2xl border border-slate-200 bg-white">
              <div className="flex flex-wrap items-center gap-2">
                <Icon name={item.kind === 'chat' ? 'Bot' : 'Send'} size={16} className="text-slate-600" />
                <span className="font-bold text-slate-900">{item.name}</span>
                {item.reasons.map((r) => <Pill key={r} tone="red">{r}</Pill>)}
                <span className="ml-auto text-xs text-slate-600">{timeAgo(item.at)}</span>
              </div>
              <p className="mt-2 text-sm font-mono bg-slate-50 rounded-5xl p-3">“{item.text}”</p>
              <p className="text-xs text-slate-600 mt-1">Where: {item.kind === 'chat' ? 'Bee Bot chat' : 'Feedback form'}</p>
              <div className="flex flex-wrap justify-end gap-2 mt-3">
                <Btn onClick={() => handle(item, 'ignore')}>Ignore</Btn>
                <Btn tone="primary" icon="BadgeCheck" onClick={() => handle(item, 'approve')}>Not spam</Btn>
                <Btn tone="amber" icon="Clock" onClick={() => handle(item, 'mute')}>Mute 48h</Btn>
                <Btn tone="danger" icon="Ban" onClick={() => handle(item, 'delete')}>Delete & ban</Btn>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  )
}

const CATEGORY = { bug: ['Bug', 'red'], suggestion: ['Suggestion', 'blue'], praise: ['Praise', 'green'], general: ['General', 'gray'] }
const STATUS = { new: ['New', 'amber'], acknowledged: ['Acknowledged', 'green'], dev: ['Sent to dev', 'blue'], hidden: ['Hidden', 'gray'] }

export function FeedbackCenter({ data, query, notify }) {
  const [tab, setTab] = useState('all')
  const [selected, setSelected] = useState([])
  const q = query.trim().toLowerCase()
  const all = data.feedback.filter((f) => f.status !== 'flagged' && (!q || `${f.name} ${f.email} ${f.text}`.toLowerCase().includes(q)))
  const tabs = [
    ['all', 'All', () => true],
    ['unread', 'Unread', (f) => !f.read],
    ['five', '5 stars', (f) => f.rating === 5],
    ['bug', 'Bug reports', (f) => f.category === 'bug'],
  ]
  const list = all.filter(tabs.find((t) => t[0] === tab)[2])
  const set = (f, changes, action) => {
    updateFeedback(f.id, { read: true, ...changes })
    if (action) logAudit(action, `${f.name}: “${f.text.slice(0, 40)}…”`)
  }
  const toggle = (id) => setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]))
  const deleteSelected = () => {
    selected.forEach(deleteFeedback)
    logAudit('DELETE', `${selected.length} feedback item(s)`)
    setSelected([])
  }

  return (
    <Panel
      id="feedback"
      title="Feedback center"
      icon="Send"
      subtitle="Review what students send from the Contact page."
      actions={
        <>
          {selected.length > 0 && <Btn tone="dangerSoft" icon="Trash2" onClick={deleteSelected}>Delete selected ({selected.length})</Btn>}
          <Btn icon="Download" onClick={() => { downloadCsv('budgetbee-feedback.csv', data.feedback.map(({ id, name, email, rating, category, status, text, createdAt }) => ({ id, name, email, rating, category, status, text, createdAt }))); logAudit('EXPORT', 'Exported feedback CSV') }}>CSV</Btn>
        </>
      }
    >
      <div className="flex flex-wrap gap-2 mb-4" role="tablist" aria-label="Feedback filter">
        {tabs.map(([key, label, fn]) => (
          <button key={key} type="button" role="tab" aria-selected={tab === key} onClick={() => setTab(key)} className={`px-3 py-1.5 rounded-full text-xs font-bold ${tab === key ? 'bg-emerald-700 text-white' : 'bg-slate-50 hover:bg-slate-100'}`}>
            {label} ({all.filter(fn).length})
          </button>
        ))}
      </div>
      {list.length === 0 ? (
        <p className="text-sm text-slate-600 text-center py-6">No feedback here yet.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {list.map((f) => {
            const [cat, catTone] = CATEGORY[f.category] ?? CATEGORY.general
            const [st, stTone] = STATUS[f.status] ?? STATUS.new
            return (
              <li key={f.id} className={`p-4 rounded-2xl border ${f.read ? 'border-slate-200' : 'border-amber-400 bg-amber-100/20'}`}>
                <div className="flex flex-wrap items-center gap-2">
                  <input type="checkbox" checked={selected.includes(f.id)} onChange={() => toggle(f.id)} aria-label={`Select feedback from ${f.name}`} className="accent-[#006c49]" />
                  <span className="font-bold text-slate-900">{f.name}</span>
                  <span className="text-xs text-slate-600">{f.email}</span>
                  <Pill tone={catTone}>{cat}</Pill>
                  <span className="ml-auto"><Stars value={f.rating} /></span>
                </div>
                <p className="mt-2 text-sm text-slate-900">“{f.text}”</p>
                <div className="flex flex-wrap items-center gap-2 mt-3">
                  <span className="text-xs text-slate-600">{timeAgo(f.createdAt)}</span>
                  <Pill tone={stTone}>{st}</Pill>
                  <span className="ml-auto flex flex-wrap gap-1.5">
                    {f.status !== 'acknowledged' && <Btn tone="primary" icon="BadgeCheck" onClick={() => set(f, { status: 'acknowledged' }, 'ACKNOWLEDGE')}>Acknowledge</Btn>}
                    {f.category === 'bug' && f.status !== 'dev' && <Btn icon="Send" onClick={() => { set(f, { status: 'dev' }, 'SEND TO DEV'); notify('Simulated: this bug would be created as a ticket in the team tracker (e.g. Jira).') }}>Send to dev (simulated)</Btn>}
                    <Btn icon={f.status === 'hidden' ? 'Eye' : 'EyeOff'} onClick={() => set(f, { status: f.status === 'hidden' ? 'acknowledged' : 'hidden' }, f.status === 'hidden' ? 'SHOW' : 'HIDE')}>{f.status === 'hidden' ? 'Show on wall' : 'Hide'}</Btn>
                    <Btn tone="amber" icon="ShieldCheck" onClick={() => set(f, { status: 'flagged' }, 'TO MODERATION')}>Moderate</Btn>
                  </span>
                </div>
              </li>
            )
          })}
        </ul>
      )}
      <div className="flex flex-wrap justify-between items-center gap-2 mt-5 pt-4 border-t border-slate-200 text-sm">
        <span className="text-slate-600">Average rating: <strong className="text-slate-900">{data.avgRating.toFixed(1)} / 5</strong></span>
        <Btn icon="BadgeCheck" onClick={() => { data.feedback.forEach((f) => !f.read && updateFeedback(f.id, { read: true })); logAudit('MARK READ', 'All feedback') }}>Mark all as read</Btn>
      </div>
    </Panel>
  )
}

export function AuditTrail({ data }) {
  return (
    <Panel id="audit" title="Admin audit trail" icon="ReceiptText" subtitle="Every admin action on this device is recorded here.">
      {data.audit.length === 0 ? (
        <p className="text-sm text-slate-600">No admin actions yet.</p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
          {data.audit.slice(0, 12).map((a, i) => (
            <li key={`${a.at}${i}`} className="p-3 rounded-2xl bg-slate-50 text-sm">
              <p className="font-mono text-xs font-bold text-emerald-700">[{a.action}]</p>
              <p className="text-slate-900 mt-0.5 line-clamp-2">{a.detail}</p>
              <p className="text-[11px] text-slate-600 mt-1">{fmtDate(a.at)}</p>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  )
}

export function Settings({ data }) {
  const anchor = useAnchor('settings')
  const [flood, setFlood] = useState(data.settings.antiFlood)
  const [words, setWords] = useState(data.settings.blacklist.join(', '))
  const [captcha, setCaptcha] = useState(data.settings.captcha)
  const [saved, setSaved] = useState(false)
  const [confirmReset, setConfirmReset] = useState(false)
  const keys = listKeys()
  const save = () => {
    const blacklist = words.split(',').map((w) => w.trim()).filter(Boolean)
    saveSettings({ antiFlood: Math.max(1, Number(flood) || 5), blacklist, captcha })
    logAudit('SETTINGS', `Anti-flood ${flood}/min, ${blacklist.length} blacklist words, captcha ${captcha ? 'on' : 'off'}`)
    setSaved(true)
  }
  const exportAll = () => {
    const dump = Object.fromEntries(keys.map(({ key }) => [key, JSON.parse(localStorage.getItem(key))]))
    const url = URL.createObjectURL(new Blob([JSON.stringify(dump, null, 2)], { type: 'application/json' }))
    Object.assign(document.createElement('a'), { href: url, download: 'budgetbee-backup.json' }).click()
    URL.revokeObjectURL(url)
    logAudit('BACKUP', 'Exported all local data as JSON')
  }
  return (
    <div id="settings" ref={anchor} className="grid grid-cols-1 xl:grid-cols-2 gap-6 scroll-mt-24">
      <Panel title="Moderation settings" icon="SlidersHorizontal">
        <div className="flex flex-col gap-4 text-sm">
          <label className="flex flex-col gap-1 font-semibold">Anti-flood (max messages per minute)
            <input type="number" min="1" max="60" value={flood} onChange={(e) => { setFlood(e.target.value); setSaved(false) }} className="px-3 py-2 rounded-5xl bg-slate-50 border border-slate-200 font-normal w-32" />
          </label>
          <label className="flex flex-col gap-1 font-semibold">Blacklist (comma separated)
            <textarea rows={3} value={words} onChange={(e) => { setWords(e.target.value); setSaved(false) }} className="px-3 py-2 rounded-5xl bg-slate-50 border border-slate-200 font-normal" />
          </label>
          <label className="flex items-center gap-2 font-semibold">
            <input type="checkbox" checked={captcha} onChange={(e) => { setCaptcha(e.target.checked); setSaved(false) }} className="accent-[#006c49]" /> Captcha on public forms (simulated)
          </label>
          <div className="flex items-center gap-3">
            <Btn tone="primary" icon="Save" onClick={save}>Save settings</Btn>
            {saved && <span className="text-xs font-semibold text-emerald-700" role="status">Saved.</span>}
          </div>
        </div>
      </Panel>
      <Panel title="Storage & backup" icon="Save" subtitle="All data lives in this browser. There is no server database.">
        <ul className="flex flex-col divide-y divide-slate-200 text-xs font-mono max-h-48 overflow-y-auto">
          {keys.map((k) => <li key={k.key} className="py-1.5 flex justify-between gap-4"><span className="truncate">{k.key}</span><span className="text-slate-600">{(k.bytes / 1024).toFixed(1)} KB</span></li>)}
        </ul>
        <div className="flex flex-wrap gap-2 mt-4">
          <Btn icon="Download" onClick={exportAll}>Backup JSON</Btn>
          {confirmReset ? (
            <>
              <Btn tone="danger" onClick={() => { clearAll(); window.location.hash = '#/home'; window.location.reload() }}>Yes, reset everything</Btn>
              <Btn onClick={() => setConfirmReset(false)}>Cancel</Btn>
            </>
          ) : (
            <Btn tone="dangerSoft" icon="Trash2" onClick={() => setConfirmReset(true)}>Reset all local data</Btn>
          )}
        </div>
      </Panel>
    </div>
  )
}
