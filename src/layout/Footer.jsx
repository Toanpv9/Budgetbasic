import Icon from '../components/Icon.jsx'
import { openChat } from '../dialogs.js'

const COLUMNS = [
  ['Learning', [
    ['Budgeting Basics', '#/learn/budgeting-basics'],
    ['Budget Methods', '#/learn/budget-methods'],
    ['Needs vs Wants', '#/learn/needs-wants-game'],
    ['Common money mistakes', '#/learn/money-mistakes'],
  ]],
  ['Tools', [
    ['50/30/20 calculator', '#/tools/50-30-20-calculator'],
    ['Savings Goals', '#/tools/savings-goals'],
    ['Infographic Library', '#/library'],
    ['Expense Planner', '#/tools/expense-planner'],
  ]],
  ['Community & Support', [
    ['About BudgetBee', '#/contact/about'],
    ['Feedback', '#/contact/feedback'],
    ['Ask Bee Bot', openChat],
    ['Contact Us', '#/contact/contact-info'],
    ['Sitemap', '#/info/sitemap'],
    ['Educational Disclaimer', '#/info/disclaimer'],
    ['Privacy Note', '#/info/privacy'],
  ]],
]
const link = 'font-body text-sm text-slate-600 hover:text-emerald-700 transition-colors text-left'

export default function Footer({ visits }) {
  return (
    <footer className="w-full bg-slate-50 border-t border-slate-200 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="font-heading text-xl text-emerald-700 font-bold">BudgetBee</span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-950 font-heading text-xs font-bold">Non-profit</span>
            </div>
            <p className="font-body text-sm text-slate-600 leading-relaxed">
              A non-profit financial education project for Vietnamese students, helping you take charge of your money and study with peace of mind.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 font-heading text-xs text-slate-900 font-semibold">
                <Icon name="GraduationCap" size={16} className="text-emerald-700" />
                <span id="bb-visit-count">{visits.toLocaleString('en-US')}</span> student visits
              </span>
            </div>
          </div>
          {COLUMNS.map(([title, links]) => (
            <div key={title} className="flex flex-col gap-2.5">
              <h2 className="font-heading text-sm text-slate-900 font-bold mb-1 uppercase tracking-wide">{title}</h2>
              {links.map(([label, target]) =>
                typeof target === 'function' ? (
                  <button key={label} type="button" onClick={target} className={link}>{label}</button>
                ) : (
                  <a key={label} href={target} className={link}>{label}</a>
                ),
              )}
            </div>
          ))}
        </div>
        <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-body text-sm text-slate-600 text-center sm:text-left">
            © {new Date().getFullYear()} BudgetBee (BudgetBasics). Built for a generation of financially independent students. For educational purposes only: BudgetBee is
            not a bank and does not process real transactions.
          </p>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-900 font-semibold text-sm transition-colors"
          >
            <Icon name="ArrowUp" size={18} /> Back to top
          </button>
        </div>
      </div>
    </footer>
  )
}
