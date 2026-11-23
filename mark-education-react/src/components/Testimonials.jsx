import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { TESTIMONIALS } from '../data/content'
import { Eyebrow, Lead, Pill, Reveal, Title, arrowBtn, cn } from './ui'

const POS = [
  'z-[3] opacity-100 [transform:none]',
  'z-[2] opacity-70 [transform:translate(24px,24px)_scale(.96)] max-sm:[transform:translate(12px,14px)_scale(.97)]',
  'z-[1] opacity-40 [transform:translate(48px,48px)_scale(.92)] max-sm:[transform:translate(24px,28px)_scale(.94)]',
]
const OUT = 'z-[4] opacity-0 [transform:translateX(-80px)_rotate(-4deg)]'

function QuoteMark() {
  return (
    <svg viewBox="0 0 24 24" className="size-[46px] fill-brand opacity-15" aria-hidden="true">
      <path d="M9.6 5C5.9 6.5 3.5 9.6 3.5 13.6V19h6.6v-6.4H6.9c0-2.5 1.3-4.3 3.6-5.3zm10.4 0c-3.7 1.5-6.1 4.6-6.1 8.6V19h6.6v-6.4h-3.2c0-2.5 1.3-4.3 3.6-5.3z" />
    </svg>
  )
}

export default function Testimonials() {
  const [order, setOrder] = useState(() => TESTIMONIALS.map((_, i) => i))
  const [outCard, setOutCard] = useState(null)
  const [tick, setTick] = useState(0) // restarts the progress bar + autoplay timer
  const stageRef = useRef(null)
  const cardRefs = useRef([])

  const shift = useCallback((dir) => {
    setOrder((o) => {
      if (dir > 0) {
        const [first, ...rest] = o
        setOutCard(first)
        return [...rest, first]
      }
      return [o[o.length - 1], ...o.slice(0, -1)]
    })
    setTick((t) => t + 1)
  }, [])

  // Let the outgoing card fly away, then tuck it behind the stack
  useEffect(() => {
    if (outCard === null) return
    const t = setTimeout(() => setOutCard(null), 380)
    return () => clearTimeout(t)
  }, [outCard])

  // Autoplay every 7s, matching the progress bar
  useEffect(() => {
    const t = setTimeout(() => (document.hidden ? setTick((n) => n + 1) : shift(1)), 7000)
    return () => clearTimeout(t)
  }, [tick, shift])

  // Size the stage to the tallest card (cards are absolutely positioned)
  useLayoutEffect(() => {
    const fit = () => {
      const stage = stageRef.current
      const cards = cardRefs.current.filter(Boolean)
      if (!stage || !cards.length) return
      const pad = window.innerWidth <= 600 ? 30 : 50
      cards.forEach((c) => (c.style.position = 'relative'))
      const h = Math.max(...cards.map((c) => c.offsetHeight))
      cards.forEach((c) => (c.style.position = ''))
      stage.style.height = `${h + pad}px`
    }
    fit()
    document.fonts?.ready.then(fit)
    window.addEventListener('load', fit)
    window.addEventListener('resize', fit, { passive: true })
    return () => {
      window.removeEventListener('load', fit)
      window.removeEventListener('resize', fit)
    }
  }, [])

  const touchX = useRef(0)

  return (
    <section
      id="testimonials"
      className="section-pad relative overflow-hidden bg-ink-light before:pointer-events-none before:absolute before:-top-[60px] before:right-[4%] before:font-serif before:text-[30rem] before:leading-none before:text-brand/5 before:content-['\201C']"
    >
      <div className="wrap grid grid-cols-[.85fr_1.15fr] items-center gap-20 max-lg:grid-cols-1 max-lg:gap-[50px]">
        <Reveal variant="left">
          <Eyebrow>Testimonials</Eyebrow>
          <Title>What Our <em>Students Say</em></Title>
          <Lead>Real stories from students who built their careers with practical training at Mark Education Academy.</Lead>
          <div className="mt-[30px] mb-10 flex items-center gap-4">
            <div className="flex">
              {TESTIMONIALS.map((t, i) => (
                <img
                  key={t.name}
                  src={t.photo}
                  alt=""
                  loading="lazy"
                  className={cn(
                    'size-[52px] rounded-full border-[3px] border-ink-light bg-brand-soft object-cover text-[0px] text-transparent',
                    i > 0 && '-ml-3.5',
                  )}
                />
              ))}
              <span className="-ml-3.5 grid size-[52px] place-items-center rounded-full border-[3px] border-ink-light bg-brand text-[.8rem] font-extrabold text-white">
                2K+
              </span>
            </div>
            <p className="text-[.88rem] leading-[1.4] text-ink-mid">
              <b className="block font-serif text-[1.4rem] text-ink-dark">2000+ students</b>trained every year
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button className={cn(arrowBtn, 'size-[50px] text-[1.1rem]')} aria-label="Previous" onClick={() => shift(-1)}>
              &#8592;
            </button>
            <div className="h-[3px] max-w-[160px] flex-1 overflow-hidden rounded-[3px] bg-[#d9e1ea]">
              <i key={tick} className="block h-full w-0 animate-progress bg-brand" />
            </div>
            <button className={cn(arrowBtn, 'size-[50px] text-[1.1rem]')} aria-label="Next" onClick={() => shift(1)}>
              &#8594;
            </button>
          </div>
        </Reveal>

        <Reveal variant="right">
          <div
            ref={stageRef}
            className="relative pr-[50px] pb-[50px] max-sm:pr-6 max-sm:pb-[30px]"
            onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
            onTouchEnd={(e) => {
              const d = e.changedTouches[0].clientX - touchX.current
              if (Math.abs(d) > 50) shift(d < 0 ? 1 : -1)
            }}
          >
            {TESTIMONIALS.map((t, ci) => {
              const pos = order.indexOf(ci)
              return (
                <div
                  key={t.name}
                  ref={(el) => (cardRefs.current[ci] = el)}
                  aria-hidden={pos !== 0}
                  className={cn(
                    'absolute inset-[0_50px_50px_0] rounded-2xl bg-white px-11 pt-11 pb-9 shadow-[0_20px_50px_rgba(11,37,69,.10)] will-change-transform',
                    'transition-[transform,opacity] duration-700 ease-smooth',
                    'max-sm:inset-[0_24px_30px_0] max-sm:px-6 max-sm:pt-[30px] max-sm:pb-[26px]',
                    ci === outCard ? OUT : POS[Math.min(pos, 2)],
                  )}
                >
                  <div className="mb-5 flex items-center justify-between">
                    <span className="text-[1.1rem] tracking-[3px] text-gold">★★★★★</span>
                    <QuoteMark />
                  </div>
                  <blockquote className="font-serif text-[length:clamp(1.25rem,2vw,1.6rem)] italic leading-normal text-ink-dark">
                    {t.quote}
                  </blockquote>
                  <div className="mt-7 flex items-center gap-3.5 border-t border-line pt-[22px]">
                    <img
                      src={t.photo}
                      alt={t.name}
                      loading="lazy"
                      className="size-[58px] rounded-full bg-brand-soft object-cover text-[0px] text-transparent shadow-[0_0_0_3px_#fff,0_0_0_4px_var(--color-brand)]"
                    />
                    <div>
                      <b className="block text-base text-ink-dark">{t.name}</b>
                      <small className="text-[.82rem] text-ink-mid">{t.role}</small>
                    </div>
                    <Pill className="ml-auto px-3 py-[5px] text-[.64rem] max-sm:hidden">{t.tag}</Pill>
                  </div>
                </div>
              )
            })}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
