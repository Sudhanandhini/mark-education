import { useEffect, useState } from 'react'
import { COUNTERS, COUNTER_BG } from '../data/content'
import { useInView } from '../hooks/useInView'
import { cn } from './ui'

export function CountUp({ end, decimals = 0, duration = 1800 }) {
  const [ref, inView] = useInView()
  const [val, setVal] = useState(0)

  useEffect(() => {
    if (!inView) return
    let raf
    const t0 = performance.now()
    const step = (t) => {
      const p = Math.min((t - t0) / duration, 1)
      const v = end * (1 - Math.pow(1 - p, 3))
      setVal(decimals ? v : Math.floor(v))
      if (p < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [inView, end, duration])

  return <span ref={ref}>{decimals ? val.toFixed(decimals) : val.toLocaleString('en-IN')}</span>
}

export default function Counter() {
  return (
    <section
      className="bg-cover bg-fixed bg-center py-20 text-white max-lg:bg-scroll"
      style={{ backgroundImage: `linear-gradient(rgba(11,37,69,.92),rgba(11,37,69,.92)),url('${COUNTER_BG}')` }}
    >
      <div className="wrap grid grid-cols-4 max-lg:grid-cols-2 max-lg:gap-y-[30px]">
        {COUNTERS.map((c, i) => (
          <div
            key={c.label}
            className={cn(
              'border-white/15 px-5 py-2.5 text-center',
              i < COUNTERS.length - 1 && 'border-r',
              i === 1 && 'max-lg:border-r-0',
            )}
          >
            <div className="font-serif text-[length:clamp(2.6rem,5vw,3.8rem)] font-semibold leading-none">
              <CountUp end={c.value} />
              <sup className="ml-0.5 text-[.5em] text-brand-pale">{c.suffix}</sup>
            </div>
            <p className="mt-2.5 text-[.8rem] uppercase tracking-[.18em] text-[#b9cbe0]">{c.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
