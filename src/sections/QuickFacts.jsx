import Icon from '../components/Icon.jsx'
import facts from '../data/quick-facts.json'


const tagClass = (f) => (f.honey ? 'bg-amber-100 text-amber-950' : f.green ? 'bg-emerald-100 text-emerald-950' : 'bg-slate-200 text-slate-600')

export default function QuickFacts() {
  return (
    <section id="quick-facts" className="w-full bg-slate-50 py-16 lg:py-20 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col gap-1.5 mb-10">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
            <span className="font-heading text-xs text-amber-700 uppercase font-bold tracking-wider">Eye-Opening Facts</span>
          </div>
          <h2 className="font-heading text-2xl lg:text-3xl text-slate-900 font-bold">Money numbers every student should know</h2>
          <p className="font-body text-sm sm:text-base text-slate-600 max-w-2xl">
            Don&apos;t wait until you have a lot of money to start managing it. The small amounts you spend every day shape your financial future.{' '}
            <span className="text-xs">(Figures are illustrative examples for learning.)</span>
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {facts.map((f) => (
            <div key={f.tag} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <span className={`w-11 h-11 rounded-full flex items-center justify-center ${f.honey ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`} aria-hidden="true">
                  <Icon name={f.icon} size={22} />
                </span>
                <span className={`px-2.5 py-1 rounded-full font-heading text-xs font-bold ${tagClass(f)}`}>{f.tag}</span>
              </div>
              <div className="flex flex-col gap-1.5">
                <p className={`font-heading text-lg font-bold ${f.honey ? 'text-amber-700' : 'text-emerald-700'}`}>{f.value}</p>
                <p className="font-body text-sm text-slate-600 leading-relaxed">{f.text}</p>
              </div>
              <div className={`mt-5 pt-2 flex items-center gap-1.5 font-heading text-sm font-semibold ${f.footerHoney ? 'text-amber-700' : 'text-emerald-700'}`}>
                <Icon name={f.icon} size={18} /> {f.footer}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
