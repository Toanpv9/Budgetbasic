import { useState } from 'react'
import Icon from '../components/Icon.jsx'
import tips from '../data/spending-tips.json'


function FlipCard({ tip }) {
  const [flipped, setFlipped] = useState(false)
  const face = 'absolute inset-0 w-full h-full p-6 rounded-3xl flex flex-col justify-between [backface-visibility:hidden]'
  return (
    <button
      type="button"
      onClick={() => setFlipped((f) => !f)}
      aria-pressed={flipped}
      className="h-80 w-full text-left cursor-pointer [perspective:1000px]"
    >
      <div className={`relative w-full h-full duration-500 [transform-style:preserve-3d] ${flipped ? '[transform:rotateY(180deg)]' : ''}`}>
        <div className={`${face} bg-white shadow-sm border border-slate-200`}>
          <div className="flex flex-col gap-2">
            <span className={`w-12 h-12 rounded-full flex items-center justify-center ${tip.honey ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`} aria-hidden="true">
              <Icon name={tip.icon} size={24} />
            </span>
            <span className={`font-heading text-xs uppercase font-bold tracking-wider ${tip.tone}`}>{tip.label}</span>
            <h3 className="font-heading text-lg text-slate-900 font-bold">{tip.title}</h3>
            <p className="font-body text-sm text-slate-600 leading-relaxed">{tip.teaser}</p>
          </div>
          <div className={`flex items-center justify-between font-semibold text-sm ${tip.honey ? 'text-amber-700' : 'text-emerald-700'}`}>
            <span>Tap to flip</span>
            <Icon name="ArrowLeftRight" size={18} />
          </div>
        </div>
        <div className={`${face} [transform:rotateY(180deg)] shadow-md ${tip.honey ? 'bg-amber-400 text-amber-900' : 'bg-emerald-700 text-white'}`}>
          <div className="flex flex-col gap-2">
            <span className={`font-heading text-xs uppercase font-bold tracking-wide ${tip.honey ? '' : 'text-emerald-100'}`}>{tip.backTitle}</span>
            <p className="font-body text-sm leading-relaxed">
              {Array.isArray(tip.back) ? tip.back.map((line) => <span key={line} className="block">{line}</span>) : tip.back}
            </p>
          </div>
          <span className="font-heading text-xs underline self-end opacity-90">Tap to close</span>
        </div>
      </div>
    </button>
  )
}

export default function SpendingTips() {
  return (
    <section id="spending-tips" className="w-full bg-slate-50 py-16 lg:py-20 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col items-center text-center gap-2 mb-12">
          <span className="px-3.5 py-1 rounded-full bg-amber-100 text-amber-950 font-heading text-xs font-bold">Pocket tips</span>
          <h2 className="font-heading text-2xl lg:text-3xl text-slate-900 font-bold">3 valuable spending tips from BudgetBee</h2>
          <p className="font-body text-sm sm:text-base text-slate-600 max-w-xl">Tap a card to flip it and see a practical fix for each habit.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tips.map((tip) => <FlipCard key={tip.label} tip={tip} />)}
        </div>
      </div>
    </section>
  )
}
