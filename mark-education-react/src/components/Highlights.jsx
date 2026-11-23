import { HIGHLIGHTS } from '../data/content'
import { Ic, cn } from './ui'

// Divider borders per tile across the 4 → 2 → 1 column layouts
const BORDERS = [
  'border-r max-lg:border-b max-sm:border-r-0',
  'border-r max-lg:border-r-0 max-lg:border-b',
  'border-r max-sm:border-r-0 max-sm:border-b',
  'max-sm:border-b',
]

export default function Highlights() {
  return (
    <section className="relative z-[6] -mt-[70px] max-sm:mt-0">
      <div className="wrap">
        <div className="grid grid-cols-4 bg-white shadow-soft max-lg:grid-cols-2 max-sm:grid-cols-1">
          {HIGHLIGHTS.map((h, i) => (
            <div
              key={h.title}
              className={cn(
                'group flex items-start gap-4 border-line px-7 py-8 transition duration-300 hover:bg-brand hover:text-white',
                BORDERS[i],
              )}
            >
              <Ic name={h.icon} className="group-hover:bg-white/15 group-hover:text-white" />
              <div>
                <h4 className="mb-1 font-serif text-[1.3rem] leading-[1.2] text-ink-dark group-hover:text-white">{h.title}</h4>
                <p className="text-[.86rem] text-ink-mid group-hover:text-white">{h.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
