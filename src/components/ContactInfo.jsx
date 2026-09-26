import { Card, Section, SectionHeading } from './ui.jsx'
import Icon from './Icon.jsx'

export function About() {
  const points = [
    ['GraduationCap', 'Educational only', 'BudgetBee teaches budgeting, saving and smart spending. It is not a bank and never processes real transactions or stores your money.'],
    ['Users', 'Made for students', 'Examples, prices and tips are based on everyday student life in Vietnam.'],
    ['Lock', 'Your privacy', 'Nothing you type is sent to a server. Calculator and planner data stay in your browser tab and disappear when you reload.'],
  ]
  return (
    <Section id="about" tone="lowest">
      <SectionHeading
        eyebrow="About the project"
        title="About BudgetBee"
        description="BudgetBee (BudgetBasics) is a non-profit learning website that helps students take control of their money, one small habit at a time."
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {points.map(([icon, title, text]) => (
          <Card key={title} className="flex flex-col gap-2">
            <Icon name={icon} size={32} className="text-emerald-700" />
            <h3 className="font-heading text-lg text-slate-900 font-bold">{title}</h3>
            <p className="text-sm text-slate-600 leading-relaxed">{text}</p>
          </Card>
        ))}
      </div>
    </Section>
  )
}

const CONTACT_ROWS = [
  ['Mail', 'Email', 'support@budgetbee.org'],
  ['Phone', 'Phone (demo)', '+84 900 000 000'],
  ['MapPin', 'Location', 'Ho Chi Minh City, Vietnam'],
  ['Clock', 'Response time', 'Within 2 working days'],
]
const SOCIALS = [
  { name: 'Facebook', handle: '@budgetbee.demo', letter: 'f', color: 'bg-[#1877F2]' },
  { name: 'Instagram', handle: '@budgetbee.demo', letter: 'IG', color: 'bg-gradient-to-br from-[#F58529] via-[#DD2A7B] to-[#8134AF]' },
  { name: 'TikTok', handle: '@budgetbee.demo', icon: 'Music2', color: 'bg-[#111111]' },
  { name: 'YouTube', handle: 'BudgetBee Demo', icon: 'Play', color: 'bg-[#FF0000]' },
]

export function ContactDetails() {
  return (
    <Section id="contact-info" tone="low">
      <SectionHeading eyebrow="Get in touch" title="Contact us" dot="bg-emerald-500" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {CONTACT_ROWS.map(([icon, label, value]) => (
          <Card key={label} className="flex items-center gap-4">
            <span className="w-12 h-12 shrink-0 rounded-full bg-emerald-100 text-emerald-950 flex items-center justify-center">
              <Icon name={icon} size={24} />
            </span>
            <div className="min-w-0">
              <p className="text-xs text-slate-600">{label}</p>
              <p className="font-semibold text-slate-900 break-words">{value}</p>
            </div>
          </Card>
        ))}
      </div>

      <h3 className="font-heading text-lg text-slate-900 font-bold mt-10 mb-4">Follow BudgetBee</h3>
      <ul className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {SOCIALS.map((s) => (
          <li key={s.name}>
            <Card className="!p-4 flex items-center gap-3 hover:-translate-y-1 hover:shadow-md transition-all">
              <span className={`w-11 h-11 shrink-0 rounded-2xl ${s.color} text-white font-extrabold flex items-center justify-center`} aria-hidden="true">
                {s.icon ? <Icon name={s.icon} size={20} /> : s.letter}
              </span>
              <div className="min-w-0">
                <p className="font-bold text-slate-900">{s.name}</p>
                <p className="text-xs text-slate-600 truncate">{s.handle}</p>
              </div>
            </Card>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-xs text-slate-600">
        Phone number and social accounts are demo placeholders for this student project.
      </p>
    </Section>
  )
}
