import { useEffect, useRef, useState } from 'react'
import { SLIDES } from '../data/content'
import { Icon, Pill, SmartLink, arrowBtn, btnLine, btnPrimary, cn } from './ui'

const BOARD = 'M250 18 L492 122 L250 226 L8 122 Z'
const BODY = 'M112 168 L112 330 Q250 410 388 330 L388 168 L250 228 Z'

/** Shared SVG defs for the graduation-cap image mask. */
function CapDefs() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden="true">
      <defs>
        <path id="capBoard" d={BOARD} />
        <path id="capBody" d={BODY} />
        <clipPath id="capClip">
          <path d={BOARD} />
          <path d={BODY} />
        </clipPath>
        <linearGradient id="capShade" x1="0" y1="0" x2="0" y2="1">
          <stop offset=".45" stopColor="#0B2545" stopOpacity="0" />
          <stop offset="1" stopColor="#0B2545" stopOpacity=".5" />
        </linearGradient>
      </defs>
    </svg>
  )
}

function CapImage({ src, active }) {
  return (
    <svg className="block h-auto w-full overflow-visible" viewBox="0 0 500 440" aria-hidden="true">
      <g transform="translate(16 16)">
        <use href="#capBoard" fill="none" stroke="#0059A8" strokeWidth="1.5" opacity=".55" />
        <use href="#capBody" fill="none" stroke="#0059A8" strokeWidth="1.5" opacity=".55" />
      </g>
      <use href="#capBoard" fill="#3A3A3A" opacity=".9" transform="translate(0 12)" />
      <g clipPath="url(#capClip)">
        <rect width="500" height="440" fill="#0B2545" />
        <image
          href={src}
          width="500"
          height="440"
          preserveAspectRatio="xMidYMid slice"
          style={{
            transformBox: 'fill-box',
            transformOrigin: 'center',
            transform: active ? 'scale(1)' : 'scale(1.12)',
            transition: 'transform 6.5s ease',
          }}
        />
        <rect width="500" height="440" fill="url(#capShade)" />
      </g>
      <use href="#capBoard" fill="none" stroke="rgba(255,255,255,.55)" strokeWidth="1.5" />
      <g className="tassel">
        <path d="M250 122 L452 132" stroke="#F2B705" strokeWidth="5" strokeLinecap="round" fill="none" />
        <circle cx="250" cy="122" r="9" fill="#F2B705" />
        <path d="M452 132 L452 262" stroke="#F2B705" strokeWidth="5" strokeLinecap="round" />
        <path d="M440 258 h24 l8 52 h-40 z" fill="#F2B705" />
      </g>
    </svg>
  )
}

function FloatCard({ icon, value, label, active, className, delay }) {
  return (
    <div
      className={cn(
        'absolute z-[3] flex items-center gap-3 rounded-md bg-white px-[18px] py-3.5 shadow-card transition duration-800 ease-smooth',
        'max-sm:gap-2 max-sm:px-3 max-sm:py-[9px]',
        active ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0',
        className,
      )}
      style={{ transitionDelay: delay }}
    >
      <span className="grid size-[42px] shrink-0 place-items-center rounded-full bg-brand-soft text-brand max-sm:size-8">
        <Icon name={icon} className="size-5" />
      </span>
      <div>
        <b className="block font-serif text-[1.6rem] leading-none text-ink-dark max-sm:text-[1.15rem]">{value}</b>
        <small className="text-[.74rem] tracking-[.04em] text-ink-mid max-sm:text-[.66rem]">{label}</small>
      </div>
    </div>
  )
}

/** A slide button: a link (`href`) or an action (`onClick`, e.g. open the enquiry popup). */
function SlideButton({ action, className }) {
  if (!action) return null
  return action.onClick ? (
    <button type="button" onClick={action.onClick} aria-haspopup="dialog" className={className}>{action.label}</button>
  ) : (
    <SmartLink href={action.href} className={className}>{action.label}</SmartLink>
  )
}

const DEFAULT_CARDS = [
  { icon: 'users', value: '2000+', label: 'Students every year' },
  { icon: 'shieldCheck', value: 'ISO', label: '9001:2015 Certified' },
]

function Slide({ slide, index, active, cards, controls }) {
  const Heading = index === 0 ? 'h1' : 'h2'
  // Text children stagger in when the slide becomes active
  const item = (i) => ({
    className: cn('transition duration-800 ease-smooth', active ? 'translate-y-0 opacity-100' : 'translate-y-[26px] opacity-0'),
    style: { transitionDelay: active ? `${i * 0.12}s` : '0s' },
  })

  return (
    <div
      aria-hidden={!active}
      className={cn(
        '[grid-area:1/1] grid grid-cols-[1.05fr_1fr] gap-[70px] transition-[opacity,visibility] duration-900 ease-in-out',
        // compact (course) slides start at the top so shorter slides don't float in the middle
        slide.compact ? 'items-start' : 'items-center',
        'max-lg:grid-cols-1 max-lg:gap-14',
        active ? 'visible opacity-100' : 'invisible opacity-0',
      )}
    >
      <div className={slide.compact ? 'pt-6 max-lg:pt-0' : undefined}>
        <div {...item(0)}>
          <Pill>{slide.pill}</Pill>
        </div>
        <Heading
          {...item(1)}
          className={cn(
            item(1).className,
            'mt-[22px] mb-5 font-serif font-semibold leading-[1.08] text-ink-dark [&_em]:text-brand',
            slide.compact ? 'text-[length:clamp(2.1rem,3.6vw,3.2rem)]' : 'text-[length:clamp(2.4rem,4.8vw,4rem)]',
          )}
        >
          {slide.title}
        </Heading>
        <p {...item(2)} className={cn(item(2).className, 'max-w-[520px] text-[1.06rem] text-ink-mid', slide.points?.length ? 'mb-6' : 'mb-[34px]')}>
          {slide.text}
        </p>
        {slide.points?.length > 0 && (
          // optional key points (course slides)
          <ul className="mb-8 grid max-w-[560px] grid-cols-2 gap-x-6 gap-y-3 max-sm:grid-cols-1">
            {slide.points.map((pt, i) => (
              <li
                key={pt}
                className={cn('flex items-start gap-2.5 text-[.95rem] font-semibold text-ink-dark transition duration-700 ease-smooth', active ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0')}
                style={{ transitionDelay: active ? `${0.36 + i * 0.1}s` : '0s' }}
              >
                <span className="mt-0.5 grid size-[22px] shrink-0 place-items-center rounded-full bg-brand text-white shadow-[0_6px_14px_-6px_rgba(0,89,168,.8)]">
                  <svg viewBox="0 0 24 24" className="size-3" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7" /></svg>
                </span>
                {pt}
              </li>
            ))}
          </ul>
        )}
        <div {...item(slide.points?.length ? 4 : 3)} className={cn(item(slide.points?.length ? 4 : 3).className, 'flex flex-wrap gap-3.5')}>
          <SlideButton action={slide.primary} className={btnPrimary} />
          <SlideButton action={slide.secondary} className={btnLine} />
        </div>
        {controls}
      </div>

      <div className="relative w-[min(100%,560px)] justify-self-end max-lg:w-[min(100%,460px)] max-lg:justify-self-center">
        <CapImage src={slide.image} active={active} />
        <FloatCard
          {...cards[0]}
          active={active}
          delay=".5s"
          className="top-[46%] -left-[34px] max-sm:top-auto max-sm:-bottom-[6%] max-sm:-left-1"
        />
        <FloatCard
          {...cards[1]}
          active={active}
          delay=".7s"
          className="-right-1.5 bottom-[2%] max-sm:-right-1 max-sm:-bottom-[6%]"
        />
      </div>
    </div>
  )
}

/**
 * Home-page banner slider. Course pages reuse it with their own slides / stat cards:
 *   <Hero slides={[...]} cards={[...]} id="course-hero" top={<breadcrumb/>} />
 */
export default function Hero({ slides = SLIDES, cards = DEFAULT_CARDS, id = 'home', top = null }) {
  const [cur, setCur] = useState(0)
  const [paused, setPaused] = useState(false)
  const touchX = useRef(0)
  const total = slides.length
  const go = (i) => setCur((i + total) % total)

  // Auto-advance; restarts whenever the slide changes (manual or automatic)
  useEffect(() => {
    if (paused || total < 2) return
    const t = setTimeout(() => setCur((c) => (c + 1) % total), 6000)
    return () => clearTimeout(t)
  }, [cur, paused, total])

  useEffect(() => {
    const onVis = () => setPaused(document.hidden)
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [])

  // compact (course) slides show the controls right under their buttons, so short slides leave no gap
  const inline = slides.every((sl) => sl.compact)
  const controls = (
        <div className={cn('relative z-[3] flex items-center gap-[22px] max-sm:gap-3.5', inline ? 'mt-10 max-sm:mt-8' : 'mt-[46px] max-sm:mt-14')}>
          <button className={cn(arrowBtn, 'size-[46px] shrink-0 text-[1.05rem] max-sm:size-10')} aria-label="Previous" onClick={() => go(cur - 1)}>
            &#8592;
          </button>
          <div className="flex gap-2 max-sm:gap-1.5">
            {slides.map((_, i) => (
              <button
                key={i}
                aria-label={`Slide ${i + 1}`}
                onClick={() => go(i)}
                className={cn('h-[3px] transition-all duration-300', i === cur ? 'w-[46px] bg-brand max-sm:w-7' : 'w-[26px] bg-[#c9d3de] max-sm:w-3.5')}
              />
            ))}
          </div>
          <button className={cn(arrowBtn, 'size-[46px] shrink-0 text-[1.05rem] max-sm:size-10')} aria-label="Next" onClick={() => go(cur + 1)}>
            &#8594;
          </button>
          <span className="shrink-0 whitespace-nowrap font-serif text-[1.1rem] tracking-[.08em] text-ink-mid">
            <b className="text-[1.4rem] text-ink-dark">{String(cur + 1).padStart(2, '0')}</b> / {String(total).padStart(2, '0')}
          </span>
        </div>
  )

  return (
    <section
      id={id}
      className={cn('relative overflow-hidden bg-linear-135 from-[#F6F8FB] to-brand-soft', top ? 'pt-6 pb-20 max-sm:pt-5 max-sm:pb-14' : 'pt-[70px] pb-[140px] max-sm:pt-11 max-sm:pb-[70px]')}
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        const dx = e.changedTouches[0].clientX - touchX.current
        if (Math.abs(dx) > 50) go(cur + (dx < 0 ? 1 : -1))
      }}
    >
      {/* decorative glow + dot grid */}
      <span className="pointer-events-none absolute -top-[30%] -right-[12%] aspect-square w-[62%] rounded-full bg-[radial-gradient(circle,rgba(0,89,168,.10),rgba(0,89,168,0)_70%)]" />
      <span className="pointer-events-none absolute bottom-0 left-0 size-[260px] bg-[radial-gradient(rgba(58,58,58,.18)_1.2px,transparent_1.2px)] bg-size-[18px_18px] opacity-60" />

      <CapDefs />

      <div className="wrap">
        {top}
        <div className="relative z-[2] grid">
          {slides.map((s, i) => (
            <Slide key={i} slide={s} index={i} active={i === cur} cards={cards} controls={inline && total > 1 ? controls : null} />
          ))}
        </div>

        {total > 1 && !inline && controls}
      </div>
    </section>
  )
}
