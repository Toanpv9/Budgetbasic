import { useState } from 'react'
import { Card, Field, Section, SectionHeading, inputClass, primaryButton, secondaryButton } from './ui.jsx'
import Icon from './Icon.jsx'
import { DEMO_ADMIN, deleteUser, register, signIn, signOut, useCurrentUser } from '../auth.js'
import { getFeedback } from '../feedbackStore.js'
import { load } from '../utils/storage.js'

function SignInForm({ onSwitch }) {
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState({})
  const submit = (e) => {
    e.preventDefault()
    const result = signIn(email)
    if (result.errors) setErrors(result.errors)
  }
  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-4">
      <Field label="Email" error={errors.email}>
        <input className={inputClass} type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" />
      </Field>
      <button type="submit" className={primaryButton}><Icon name="LogIn" size={18} /> Sign in</button>
      <button type="button" className="text-sm text-emerald-700 font-semibold hover:underline" onClick={() => { setEmail(DEMO_ADMIN.email); setErrors({}) }}>
        Use the demo admin profile
      </button>
      <p className="text-sm text-slate-600 text-center">
        New here? <button type="button" className="text-emerald-700 font-bold hover:underline" onClick={onSwitch}>Create a profile</button>
      </p>
    </form>
  )
}

function RegisterForm({ onSwitch }) {
  const [form, setForm] = useState({ name: '', email: '', school: '' })
  const [errors, setErrors] = useState({})
  const [agree, setAgree] = useState(false)
  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value })
  const submit = (e) => {
    e.preventDefault()
    if (!agree) return setErrors({ agree: 'Please confirm you understand this is a demo profile.' })
    const result = register(form)
    if (result.errors) setErrors(result.errors)
  }
  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-4">
      <Field label="Name" error={errors.name}>
        <input className={inputClass} autoComplete="name" value={form.name} onChange={set('name')} maxLength={50} placeholder="Your name" />
      </Field>
      <Field label="Email" error={errors.email}>
        <input className={inputClass} type="email" autoComplete="email" value={form.email} onChange={set('email')} maxLength={80} placeholder="name@example.com" />
      </Field>
      <Field label="University / College (optional)">
        <input className={inputClass} value={form.school} onChange={set('school')} maxLength={80} placeholder="e.g. Aptech Computer Education" />
      </Field>
      <label className="flex items-start gap-2 text-sm text-slate-600">
        <input type="checkbox" className="mt-1 accent-[#006c49]" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
        <span>I understand this profile is saved only in this browser, has no password, and is for learning only.</span>
      </label>
      {errors.agree && <span className="text-xs text-red-700 font-semibold" role="alert">{errors.agree}</span>}
      <button type="submit" className={primaryButton}><Icon name="UserPlus" size={18} /> Create profile</button>
      <p className="text-sm text-slate-600 text-center">
        Already have a profile? <button type="button" className="text-emerald-700 font-bold hover:underline" onClick={onSwitch}>Sign in</button>
      </p>
    </form>
  )
}

function Profile({ user }) {
  const [confirm, setConfirm] = useState(false)
  const expenses = load(`user:${user.id}:expenses`, null)
  const goal = load(`user:${user.id}:savings-goal`, null)
  const myFeedback = getFeedback().filter((f) => f.userId === user.id).length
  const stats = [
    ['ReceiptText', 'Saved expenses', expenses ? expenses.length : 0, '#/tools/expense-planner'],
    ['PiggyBank', 'Savings goal', goal ? goal.name : '—', '#/tools/savings-goals'],
    ['Send', 'Feedback sent', myFeedback, '#/contact/feedback'],
  ]
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <img src="avatar.jpg" alt="" className="w-16 h-16 rounded-full object-cover ring-4 ring-amber-100" />
        <div>
          <p className="text-xl font-extrabold text-slate-900">{user.name}</p>
          <p className="text-sm text-slate-600">{user.email}{user.school ? ` • ${user.school}` : ''}</p>
          <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${user.role === 'admin' ? 'bg-blue-100 text-blue-950' : 'bg-amber-100 text-amber-950'}`}>
            {user.role === 'admin' ? 'Admin (demo)' : 'Student'}
          </span>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {stats.map(([icon, label, value, href]) => (
          <a key={label} href={href} className="p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors">
            <Icon name={icon} size={20} className="text-emerald-700" />
            <p className="text-xs text-slate-600 mt-2">{label}</p>
            <p className="font-bold text-slate-900 truncate">{value}</p>
          </a>
        ))}
      </div>
      <p className="text-sm text-slate-600">
        While you are signed in, your Expense Planner, Savings Goal and 50/30/20 inputs are saved in this browser and come back after a reload.
      </p>
      <div className="flex flex-wrap gap-2">
        {user.role === 'admin' && (
          <a href="#/admin" className={primaryButton}><Icon name="LayoutDashboard" size={18} /> Open admin dashboard</a>
        )}
        <button type="button" className={secondaryButton} onClick={signOut}><Icon name="LogOut" size={18} /> Sign out</button>
        {user.role !== 'admin' && (
          confirm ? (
            <span className="flex items-center gap-2 text-sm">
              Delete profile and all saved data?
              <button type="button" className="px-3 py-1.5 rounded-full bg-red-700 text-white font-semibold" onClick={() => deleteUser(user.id)}>Yes, delete</button>
              <button type="button" className="px-3 py-1.5 rounded-full bg-slate-200 font-semibold" onClick={() => setConfirm(false)}>Cancel</button>
            </span>
          ) : (
            <button type="button" className="px-4 py-2 rounded-full text-red-700 font-semibold text-sm hover:bg-red-100" onClick={() => setConfirm(true)}>
              <Icon name="Trash2" size={16} /> Delete my profile
            </button>
          )
        )}
      </div>
    </div>
  )
}

export default function Account() {
  const user = useCurrentUser()
  const [mode, setMode] = useState('signin')

  return (
    <Section id="account" tone="lowest">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5 flex flex-col gap-4">
          <SectionHeading
            eyebrow="Your space"
            title={user ? `Hi, ${user.name.split(' ')[0]}!` : mode === 'signin' ? 'Sign in to BudgetBee' : 'Create your BudgetBee profile'}
            description="Save your expenses, savings goal and calculator inputs on this device, and keep track of the feedback you send."
          />
          <img src="logo-hero.webp" alt="" className="w-56 self-center lg:self-start -mt-4" width="640" height="640" />
        </div>
        <Card className="lg:col-span-7 !p-8">
          {user ? (
            <Profile user={user} />
          ) : (
            <>
              <div className="flex gap-1 p-1 rounded-full bg-slate-50 mb-6" role="tablist" aria-label="Sign in or register">
                {[['signin', 'Sign in'], ['register', 'Create profile']].map(([key, label]) => (
                  <button key={key} type="button" role="tab" aria-selected={mode === key} onClick={() => setMode(key)}
                    className={`flex-1 py-2 rounded-full text-sm font-bold transition-colors ${mode === key ? 'bg-emerald-700 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>
                    {label}
                  </button>
                ))}
              </div>
              {mode === 'signin' ? <SignInForm onSwitch={() => setMode('register')} /> : <RegisterForm onSwitch={() => setMode('signin')} />}
            </>
          )}
          <p className="mt-6 flex items-start gap-2 text-xs text-slate-600 border-t border-slate-200 pt-4">
            <Icon name="Lock" size={16} className="text-amber-700" />
            Demo accounts: no password is used and nothing is sent to a server. Profiles live only in this browser. Never enter bank details here.
          </p>
        </Card>
      </div>
    </Section>
  )
}
