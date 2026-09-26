import { GROUPS } from '../utils/budgetGroups.js'

export function Donut({ ratios }) {
  const r = 38
  const circumference = 2 * Math.PI * r
  const starts = GROUPS.map((_, i) => GROUPS.slice(0, i).reduce((sum, g) => sum + (ratios[g.key] / 100) * circumference, 0))
  return (
    <svg viewBox="0 0 100 100" className="w-48 h-48 -rotate-90" role="img" aria-label={`Needs ${ratios.needs}%, wants ${ratios.wants}%, savings ${ratios.savings}%`}>
      <circle cx="50" cy="50" r={r} fill="none" stroke="#e2e7ff" strokeWidth="12" />
      {GROUPS.map((g, i) => {
        const length = (ratios[g.key] / 100) * circumference
        return (
          <circle
            key={g.key}
            cx="50"
            cy="50"
            r={r}
            fill="none"
            stroke={g.color}
            strokeWidth="12"
            strokeDasharray={`${length} ${circumference}`}
            strokeDashoffset={-starts[i]}
            className="transition-all duration-700"
          />
        )
      })}
    </svg>
  )
}
