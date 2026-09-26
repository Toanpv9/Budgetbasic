import Icon from '../components/Icon.jsx'
import BeeMark from '../components/BeeMark.jsx'

export default function Hero() {
  return (
    <section className="relative w-full overflow-hidden bg-white py-16 lg:py-20 border-b border-slate-200">
      <div className="absolute -top-40 -left-20 w-96 h-96 rounded-full bg-amber-400/10 blur-3xl pointer-events-none"></div>
      <div className="absolute top-20 -right-20 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none"></div>
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 flex flex-col items-start gap-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-950 font-heading text-sm shadow-sm">
              <Icon name="BadgeCheck" size={18} className="text-amber-700" />
              <span className="font-bold">Made for Vietnamese students</span>
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl text-slate-900 tracking-tight font-extrabold leading-tight">
              Master Your Student Money with{' '}
              <span className="text-emerald-700 underline decoration-amber-400 decoration-wavy underline-offset-8">BudgetBee</span>{' '}
              <BeeMark size={36} className="inline-block align-middle" />
            </h1>
            <p className="font-body text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed">
              A 4-step journey that helps you manage your pocket money, balance daily needs with confidence, and start saving steadily from
              your first year at university, without the stress.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-1 w-full sm:w-auto">
              <a
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-emerald-700 text-white font-semibold text-base shadow-md hover:bg-emerald-500 hover:text-emerald-900 hover:-translate-y-0.5 active:scale-95 transition-all"
                href="#/home/4-step-journey"
              >
                <Icon name="Rocket" size={20} />
                <span>Start learning (4-step journey)</span>
              </a>
              <a
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-900 font-semibold text-base shadow-sm hover:-translate-y-0.5 active:scale-95 transition-all"
                href="#/tools/50-30-20-calculator"
              >
                <Icon name="Calculator" size={20} className="text-amber-700" />
                <span>Try the 50-30-20 calculator</span>
              </a>
            </div>
            <div className="grid grid-cols-3 gap-3 pt-3 w-full bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div className="flex flex-col">
                <span className="font-heading text-xl lg:text-2xl text-emerald-700 font-extrabold">15,000+</span>
                <span className="font-body text-sm text-slate-600 font-medium">Students learning</span>
              </div>
              <div className="flex flex-col">
                <span className="font-heading text-xl lg:text-2xl text-amber-700 font-extrabold">94%</span>
                <span className="font-body text-sm text-slate-600 font-medium">Less impulse spending</span>
              </div>
              <div className="flex flex-col">
                <span className="font-heading text-xl lg:text-2xl text-emerald-700 font-extrabold">100%</span>
                <span className="font-body text-sm text-slate-600 font-medium">Non-profit</span>
              </div>
            </div>
            <p className="text-xs text-slate-600 -mt-2">* Illustrative figures for a student project demo.</p>
            <a href="#/info/sitemap" className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 hover:underline">
              <Icon name="Map" size={18} /> New here? View the full sitemap
            </a>
          </div>
          <div className="lg:col-span-5 relative flex justify-center items-center">
            <div className="relative w-full max-w-md sm:h-[440px] rounded-3xl bg-gradient-to-tr from-slate-100 to-slate-300 p-8 shadow-xl flex items-center justify-center border border-slate-200">
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]"></div>
              <img
                alt="NextGen BudgetBee logo: a graduate bee holding a piggy bank"
                className="w-72 h-72 sm:w-80 sm:h-80 object-contain drop-shadow-2xl z-10 transition-transform duration-500 hover:scale-105"
                src="logo-hero.webp"
                width="640"
                height="640"
              />
              <div className="absolute -bottom-4 -left-4 bg-white text-slate-900 p-3.5 rounded-2xl shadow-lg border border-slate-200 flex items-center gap-3 z-20">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">
                  <Icon name="PiggyBank" size={22} />
                </div>
                <div className="flex flex-col">
                  <span className="font-heading text-xs text-slate-600">Saved this month</span>
                  <span className="font-heading text-sm text-emerald-700 font-bold">+500,000 VND</span>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 bg-white text-slate-900 p-3.5 rounded-2xl shadow-lg border border-slate-200 flex items-center gap-3 z-20">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-bold">
                  <Icon name="ShieldCheck" size={22} />
                </div>
                <div className="flex flex-col">
                  <span className="font-heading text-xs text-slate-600">Safe spending</span>
                  <span className="font-heading text-sm text-amber-700 font-bold">50-30-20 Standard</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
