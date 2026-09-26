import { Card, Section, SectionHeading } from './ui.jsx'
import { useState } from 'react'
import { PAGES } from '../pages.jsx'
import { clearAll } from '../utils/storage.js'
import { openChat } from '../dialogs.js'
import Icon from './Icon.jsx'

const GROUPS = [
  { page: 'home', icon: 'Home', title: 'Home', note: 'Start here' },
  { page: 'learn', icon: 'BookOpen', title: 'Learn Budgeting', note: 'Knowledge and practice' },
  { page: 'tools', icon: 'ClipboardList', title: 'Practice Planning', note: 'Calculators and planners' },
  { page: 'library', icon: 'Search', title: 'Explore Resources', note: 'Infographics, search and filters' },
  { page: 'contact', icon: 'MessageCircle', title: 'Get Help / Connect', note: 'Chatbot, feedback, contact' },
  { page: 'info', icon: 'Info', title: 'Site information', note: 'Policies' },
]

export function Sitemap() {
  return (
    <Section id="sitemap" tone="lowest">
      <SectionHeading eyebrow="Find anything" title="Sitemap" description="Every page and section of BudgetBee in one place." />
      <nav aria-label="Sitemap" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {GROUPS.map((g) => {
          const page = PAGES.find((p) => p.key === g.page)
          const sections = page.sections.filter((s) => s.id)
          return (
            <Card key={g.page} className="flex flex-col gap-2">
              <a href={`#/${page.key}`} className="flex items-center gap-2 font-bold text-lg text-slate-900 hover:text-emerald-700">
                <Icon name={g.icon} size={20} /> {g.title}
              </a>
              <p className="text-xs text-slate-600 -mt-1">{g.note}</p>
              <ul className="flex flex-col gap-1 mt-1">
                {sections.map((s) => (
                  <li key={s.id}>
                    <a href={`#/${page.key}/${s.id}`} className="text-sm text-slate-600 hover:text-emerald-700 hover:underline">› {s.label}</a>
                  </li>
                ))}
                {g.page === 'contact' && (
                  <li>
                    <a href="#" onClick={(e) => { e.preventDefault(); openChat() }} className="text-sm text-slate-600 hover:text-emerald-700 hover:underline">› AI Q&amp;A Assistant (Bee Bot)</a>
                  </li>
                )}
              </ul>
            </Card>
          )
        })}
      </nav>
    </Section>
  )
}

export function Disclaimer() {
  const points = [
    'BudgetBee is an educational website made for a student web design competition.',
    'It is not a bank, financial institution or payment service, and it never processes real transactions.',
    'Calculators, examples and sample budgets use illustrative numbers. Results are estimates for learning only.',
    'Nothing on this site (including Bee Bot answers) is professional financial, legal or investment advice.',
    'For decisions about loans, credit cards or investments, talk to a qualified adviser, your bank or your family.',
  ]
  return (
    <Section id="disclaimer" tone="low">
      <SectionHeading eyebrow="Please read" title="Educational disclaimer" dot="bg-red-700" />
      <Card>
        <ul className="flex flex-col gap-3">
          {points.map((p) => (
            <li key={p} className="flex gap-3 text-slate-900"><Icon name="Info" size={24} className="text-amber-700" />{p}</li>
          ))}
        </ul>
      </Card>
    </Section>
  )
}

export function PrivacyNote() {
  const points = [
    ['CloudOff', 'No server, no database', 'BudgetBee has no backend. Nothing you type is uploaded or stored on a server.'],
    ['Hourglass', 'Guests: nothing is kept', 'If you are not signed in, calculator inputs and expenses live only in this tab and are cleared when you reload.'],
    ['User', 'Signed-in profiles: saved in your browser', 'A profile (name, email, school; no password) plus your expenses, savings goal, calculator inputs and feedback are saved in this browser (localStorage) so they come back after a reload. They never leave your device.'],
    ['Save', 'Small preferences', 'The visitor counter, 30-day challenge progress and list sort/filter choices are also remembered in this browser.'],
    ['Ban', 'No sensitive data', 'Never enter bank account numbers, card numbers, passwords or OTP codes on this site. We never ask for them.'],
  ]
  return (
    <Section id="privacy" tone="lowest">
      <SectionHeading eyebrow="Your data" title="Privacy note" dot="bg-emerald-500" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {points.map(([icon, title, text]) => (
          <Card key={title} className="flex gap-4">
            <span className="w-11 h-11 shrink-0 rounded-full bg-emerald-100 text-emerald-950 flex items-center justify-center">
              <Icon name={icon} size={24} />
            </span>
            <div>
              <h3 className="font-bold text-slate-900">{title}</h3>
              <p className="text-sm text-slate-600">{text}</p>
            </div>
          </Card>
        ))}
      </div>
      <ClearDataButton />
    </Section>
  )
}

function ClearDataButton() {
  const [step, setStep] = useState('idle')
  if (step === 'done') return <p className="mt-6 text-sm font-semibold text-emerald-700" role="status">All BudgetBee data was removed from this browser.</p>
  return (
    <div className="mt-6 flex flex-wrap items-center gap-3">
      {step === 'idle' ? (
        <button type="button" onClick={() => setStep('confirm')} className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-red-100 text-red-800 font-semibold text-sm">
          <Icon name="Trash2" size={18} /> Clear my saved data
        </button>
      ) : (
        <>
          <span className="text-sm text-slate-900">This removes all profiles, expenses, goals and feedback saved in this browser.</span>
          <button type="button" onClick={() => { clearAll(); setStep('done'); setTimeout(() => window.location.reload(), 900) }} className="px-4 py-2 rounded-full bg-red-700 text-white font-semibold text-sm">Yes, clear everything</button>
          <button type="button" onClick={() => setStep('idle')} className="px-4 py-2 rounded-full bg-slate-200 font-semibold text-sm">Cancel</button>
        </>
      )}
    </div>
  )
}
