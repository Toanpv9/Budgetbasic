import Hero from './sections/Hero.jsx'
import QuickFacts from './sections/QuickFacts.jsx'
import Journey from './sections/Journey.jsx'
import MoneyPreview from './sections/MoneyPreview.jsx'
import SpendingTips from './sections/SpendingTips.jsx'
import Infographics from './sections/Infographics.jsx'

import BudgetingBasics from './components/BudgetingBasics.jsx'
import SavingsGoal from './components/SavingsGoal.jsx'
import ExpensePlanner from './components/ExpensePlanner.jsx'
import { About, ContactDetails } from './components/ContactInfo.jsx'
import NeedsWantsGame from './components/NeedsWantsGame.jsx'
import { BudgetMethods, MoneyMistakes, ScamAlert, SpendingTraps } from './components/LearnExtras.jsx'
import { Personas, SavingsChallenge } from './components/ToolExtras.jsx'
import GlossaryFaq from './components/GlossaryFaq.jsx'
import HomeCarousel from './components/HomeCarousel.jsx'
import QuickTry from './components/QuickTry.jsx'
import Feedback from './components/Feedback.jsx'
import Calculator503020 from './components/Calculator503020.jsx'
import { Disclaimer, PrivacyNote, Sitemap } from './components/SiteInfo.jsx'
import Account from './components/Account.jsx'

export const PAGES = [
  {
    key: 'home',
    label: 'Home',
    sections: [
      { Component: Hero },
      { id: 'featured', label: 'Explore', keywords: 'featured slides explore highlights', Component: HomeCarousel },
      { id: 'quick-facts', label: 'Eye-Opening Facts', keywords: 'facts numbers statistics milk tea laptop compound interest', Component: QuickFacts },
      { id: '4-step-journey', label: '4-Step Journey', keywords: 'journey steps roadmap start', Component: Journey },
      { id: 'money-preview', label: 'See it in action', keywords: '50 30 20 split expense planner preview sample budget', Component: MoneyPreview },
      { id: 'quick-try', label: 'Try it', keywords: 'daily saver slider tip of the day random tip', Component: QuickTry },
    ],
  },
  {
    key: 'learn',
    label: 'Learn',
    sections: [
      { id: 'budgeting-basics', label: 'Budgeting Basics', keywords: 'income fixed variable expenses needs wants savings quiz sample budget badge worker bee', Component: BudgetingBasics },
      { id: 'budget-methods', label: 'Budget Methods', keywords: 'methods compare envelope zero-based pay yourself first 50/30/20', Component: BudgetMethods },
      { id: 'spending-traps', label: 'Spending Traps', keywords: 'traps fomo sale anchoring emotional psychology', Component: SpendingTraps },
      { id: 'needs-wants-game', label: 'Needs vs Wants Game', keywords: 'needs wants game mini-game sort', Component: NeedsWantsGame },
      { id: 'money-mistakes', label: 'Money Mistakes', keywords: 'mistakes impulse buying small expenses late payments subscriptions unplanned spending overspending', Component: MoneyMistakes },
      { id: 'spending-tips', label: 'Spending Tips', keywords: 'tips 24-hour rule grocery envelope', Component: SpendingTips },
      { id: 'scam-alert', label: 'Scam Alert', keywords: 'scam fraud qr fake bank sms job loan app safety', Component: ScamAlert },
    ],
  },
  {
    key: 'tools',
    label: 'Tools',
    sections: [
      { id: 'student-profiles', label: 'Student Profiles', keywords: 'persona profile example student minh lan huy', Component: Personas },
      { id: '50-30-20-calculator', label: '50/30/20 Calculator', keywords: '50 30 20 50/30/20 calculator rule income split formula ratio', Component: Calculator503020 },
      { id: 'savings-goals', label: 'Savings Goals', keywords: 'savings goal target months progress', Component: SavingsGoal },
      { id: 'expense-planner', label: 'Expense Planner', keywords: 'expense planner tracker add edit delete total balance sort date category food transport education entertainment shopping utilities', Component: ExpensePlanner },
      { id: 'savings-challenge', label: '30-Day Challenge', keywords: 'challenge 30 day habit honeycomb', Component: SavingsChallenge },
    ],
  },
  {
    key: 'library',
    label: 'Library',
    sections: [
      { id: 'infographics-library', label: 'Infographics', keywords: 'infographic poster pdf download emergency fund matrix search filter', Component: Infographics },
      { id: 'glossary-faq', label: 'Glossary & FAQ', keywords: 'glossary faq terms questions definition compound interest bnpl cic', Component: GlossaryFaq },
    ],
  },
  {
    key: 'contact',
    label: 'Contact',
    sections: [
      { id: 'about', label: 'About', keywords: 'about project privacy non-profit', Component: About },
      { id: 'feedback', label: 'Feedback', keywords: 'feedback rating email comments review', Component: Feedback },
      { id: 'feedback-wall', label: 'Feedback Wall', keywords: 'feedback wall reviews stories community sort', rendered: false },
      { id: 'contact-info', label: 'Contact', keywords: 'contact email phone social facebook instagram', Component: ContactDetails },
    ],
  },
  {
    key: 'info',
    label: 'Site Info',
    sections: [
      { id: 'sitemap', label: 'Sitemap', keywords: 'sitemap all pages map navigation', Component: Sitemap },
      { id: 'disclaimer', label: 'Educational Disclaimer', keywords: 'disclaimer educational not financial advice bank', Component: Disclaimer },
      { id: 'privacy', label: 'Privacy Note', keywords: 'privacy data storage cookies clear', Component: PrivacyNote },
    ],
  },
  {
    key: 'account',
    label: 'Account',
    hidden: true,
    sections: [{ id: 'account', label: 'Sign in / Profile', keywords: 'login sign in register account profile', Component: Account }],
  },
  {
    key: 'admin',
    label: 'Admin',
    hidden: true,
    noSearch: true,
    sections: [
      ['overview', 'Dashboard overview'],
      ['users', 'Users & bans'],
      ['moderation', 'Moderation & spam'],
      ['feedback', 'Feedback center'],
      ['stats', 'Sign-in statistics'],
      ['audit', 'Audit trail'],
      ['settings', 'Admin settings'],
    ].map(([id, label]) => ({ id, label, keywords: 'admin', rendered: false })),
  },
]

export const findPage = (key) => PAGES.find((p) => p.key === key) ?? PAGES[0]

export const SEARCH_INDEX = PAGES.filter((p) => !p.noSearch).flatMap((page) =>
  page.sections
    .filter((s) => s.id)
    .map((s) => ({ path: `#/${page.key}/${s.id}`, title: s.label, page: page.label, text: `${s.label} ${s.keywords} ${page.label}`.toLowerCase() })),
)
