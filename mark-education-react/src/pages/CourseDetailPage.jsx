import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CountUp } from '../components/Counter'
import HomeHero from '../components/Hero'
import { useEnquiry } from '../components/EnquiryProvider'
import { Icon, Reveal, cn } from '../components/ui'
import { ENQUIRY_COURSES, HOURS, PHONE, PHONE_HREF } from '../data/content'
import { GOOGLE_RATING, YEARS_EXCELLENCE } from '../data/coursePages'
import { COURSE_DETAIL_LIST, WHY_MARK } from '../data/courseDetails'
import { useInView } from '../hooks/useInView'

/*
 * One page per course (/courses/<slug>), filled from src/data/courseDetails.jsx.
 * Colours come from CSS variables set on the page root (--c, --c-dark, --c-soft).
 */

const btn =
  'inline-flex items-center justify-center gap-2.5 whitespace-nowrap rounded px-[30px] py-3.5 text-[.85rem] font-bold uppercase tracking-[.08em] transition duration-300 ease-smooth'
const btnMain = `${btn} bg-(--c) text-white shadow-[0_10px_24px_-8px_var(--c)] hover:-translate-y-0.5 hover:bg-(--c-dark)`
const btnGhostLight = `${btn} border border-white/60 text-white hover:bg-white hover:text-(--c-dark)`
const btnLine = `${btn} border border-ink text-ink-dark hover:border-ink-dark hover:bg-ink-dark hover:text-white`

function Eyebrow({ children, center, light }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-3 text-[.78rem] font-bold uppercase tracking-[.22em] before:h-px before:w-9',
        center && 'after:h-px after:w-9',
        light ? 'text-white/80 before:bg-white/60 after:bg-white/60' : 'text-(--c) before:bg-(--c) after:bg-(--c)',
      )}
    >
      {children}
    </span>
  )
}

function H2({ children, className, light }) {
  return (
    <h2
      className={cn(
        'mt-3.5 mb-4 font-serif text-[length:clamp(2rem,4vw,2.9rem)] font-semibold leading-[1.15] [&_em]:italic',
        light ? 'text-white [&_em]:text-white/80' : 'text-ink-dark [&_em]:text-(--c)',
        className,
      )}
    >
      {children}
    </h2>
  )
}

const Tick = ({ className = 'size-3.5' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12.5l4.5 4.5L19 7" />
  </svg>
)

/* ---------- 1. Hero: same slider as the home page ---------- */
/** "Keyboard Typing Practice" → <>Keyboard Typing <em>Practice</em></> (home-style accent on the last words) */
function accent(text, words = 1) {
  const parts = text.trim().split(' ')
  if (parts.length < 3) return text
  const n = Math.min(words, parts.length - 1)
  return <>{parts.slice(0, -n).join(' ')} <em>{parts.slice(-n).join(' ')}</em></>
}
const firstSentence = (p) => p.split(/(?<=[.!?])\s/)[0]

function Hero({ c, onEnquire }) {
  const enquire = { label: 'Enquire Now', onClick: onEnquire }
  const demo = { label: 'Book a Free Demo', href: '#enquiry' }
  const photos = c.gallery?.length ? c.gallery : c.heroImages || []
  // supporting lines for the photo slides: the rest of the intro, then the overview
  const lines = [...c.intro.slice(1), ...(c.what || []), c.syllabusLead].filter(Boolean).map(firstSentence)

  // four different benefit points per photo slide (wrapping round the list), without full stops
  const pts = c.benefits.map((x) => x.replace(/\.$/, ''))
  const pointsFor = (i) => Array.from({ length: Math.min(4, pts.length) }, (_, k) => pts[(i * 4 + k) % pts.length])

  const slides = [
    { pill: c.heading, title: accent(c.tagline, 2), text: c.intro[0], image: c.photo, primary: enquire, secondary: demo, compact: true },
    ...photos.map((ph, i) => ({
      pill: c.name,
      title: accent(ph.caption),
      text: lines[i % Math.max(lines.length, 1)] || c.intro[0],
      points: pointsFor(i),
      image: ph.src,
      primary: enquire,
      secondary: demo,
      compact: true,
    })),
  ]
  const cards = [
    { icon: 'ledger', value: String(c.syllabus.length), label: 'Modules in syllabus' },
    { icon: 'shieldCheck', value: 'ISO', label: '9001:2015 Certified' },
  ]

  return (
    <HomeHero
      id="course-hero"
      slides={slides}
      cards={cards}
      top={
        <nav aria-label="Breadcrumb" className="relative z-[3] mb-4 flex animate-rise flex-wrap items-center gap-2 text-[.8rem] font-semibold text-ink-mid">
          <Link to="/" className="hover:text-brand">Home</Link>
          <span className="text-line">/</span>
          <Link to="/courses" className="hover:text-brand">Courses</Link>
          <span className="text-line">/</span>
          <span className="text-brand">{c.name}</span>
        </nav>
      }
    />
  )
}

/* ---------- 3. Overview: photo collage + tabs (Overview / About the course / Benefits) ---------- */
function AboutCollage({ c }) {
  const pics = [...(c.gallery || []), ...(c.heroImages || [])]
  const big = { src: c.photo, alt: `${c.name} training` }
  const small = pics[1] || pics[0]
  return (
    <div className="relative mx-auto w-full max-w-[520px] pr-10 pb-14 max-sm:pr-4 max-sm:pb-10">
      {/* decorations */}
      <span className="absolute -top-6 -left-6 size-28 rounded-full bg-[radial-gradient(color-mix(in_oklab,var(--c)_35%,transparent)_1.6px,transparent_1.6px)] bg-size-[12px_12px]" />
      <span className="absolute top-10 -right-2 size-40 animate-[spin_30s_linear_infinite] rounded-full border-2 border-dashed border-(--c)/25 motion-reduce:animate-none" />

      <div className="group relative overflow-hidden rounded-[26px] shadow-[0_30px_60px_-28px_rgba(11,37,69,.5)]">
        <img src={big.src} alt={big.alt} loading="lazy" className="aspect-[4/4.4] w-full object-cover transition duration-[1.2s] ease-smooth group-hover:scale-105" />
        <span className="absolute inset-0 bg-linear-180 from-transparent from-55% to-(--c-deep)/55" />
      </div>

      {small && (
        <div className="group absolute right-0 bottom-0 w-[52%] overflow-hidden rounded-[20px] border-[6px] border-white shadow-[0_24px_50px_-20px_rgba(11,37,69,.55)] max-sm:w-[56%]">
          <img src={small.src} alt={small.caption} loading="lazy" style={{ objectPosition: small.position }} className="aspect-[4/3] w-full object-cover transition duration-[1.2s] ease-smooth group-hover:scale-110" />
        </div>
      )}

      <div className="absolute top-8 -left-5 flex animate-floaty items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-card max-sm:-left-2">
        <span className="grid size-12 place-items-center rounded-xl bg-linear-135 from-(--c) to-(--c-dark) text-white">
          <Icon name="award" className="size-6" />
        </span>
        <div>
          <b className="block font-sans text-[1.5rem] font-extrabold leading-none text-ink-dark"><CountUp end={YEARS_EXCELLENCE} /><span className="text-(--c-alt)">+</span></b>
          <small className="text-[.72rem] font-bold uppercase tracking-[.08em] text-ink-mid">Years of excellence</small>
        </div>
      </div>
    </div>
  )
}

function About({ c }) {
  const moreIntro = c.intro.slice(1) // the hero shows the first intro paragraph
  const benefitsLabel = c.benefitsTitle === 'Course Highlights' ? 'Course Highlights' : 'Key Benefits'
  const tabs = [
    c.what?.length > 0 && { id: 'overview', label: 'Overview', icon: 'search' },
    moreIntro.length > 0 && { id: 'about', label: 'About the Course', icon: 'ledger' },
    { id: 'benefits', label: benefitsLabel, icon: 'star' },
  ].filter(Boolean)
  const [tab, setTab] = useState(tabs[0].id)
  const idx = Math.max(0, tabs.findIndex((t) => t.id === tab))

  return (
    <section className="section-pad relative overflow-clip bg-white">
      <span className="pointer-events-none absolute -top-24 -right-32 size-[420px] rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--c)_8%,transparent),transparent_70%)]" />
      <div className="wrap relative grid grid-cols-[.9fr_1.1fr] items-center gap-16 max-lg:grid-cols-1 max-lg:gap-12">
        <Reveal variant="left"><AboutCollage c={c} /></Reveal>

        <Reveal variant="right">
          <Eyebrow>Overview</Eyebrow>
          <H2>{c.whatTitle && c.what?.length ? c.whatTitle : <>About the <em>{c.name}</em> Course</>}</H2>

          {/* tabs with a sliding underline */}
          <div role="tablist" aria-label={`${c.name} overview`} className="relative mt-6 flex border-b border-line">
            {tabs.map((t) => (
              <button
                key={t.id}
                role="tab"
                id={`tab-${t.id}`}
                aria-selected={tab === t.id}
                aria-controls={`panel-${t.id}`}
                onClick={() => setTab(t.id)}
                className={cn(
                  'flex flex-1 items-center justify-center gap-2 px-3 pt-1 pb-3.5 text-[.88rem] font-bold transition-colors duration-300 max-sm:flex-col max-sm:gap-1 max-sm:text-[.76rem]',
                  tab === t.id ? 'text-(--c)' : 'text-ink-mid hover:text-ink-dark',
                )}
              >
                <Icon name={t.icon} className="size-[18px]" />
                {t.label}
              </button>
            ))}
            <span
              className="absolute -bottom-px h-[3px] rounded-full bg-linear-90 from-(--c) to-(--c-alt) transition-[left] duration-400 ease-smooth"
              style={{ width: `${100 / tabs.length}%`, left: `${(100 / tabs.length) * idx}%` }}
            />
          </div>

          {/* panel (re-mounted per tab so it animates in) */}
          <div key={tab} id={`panel-${tab}`} role="tabpanel" aria-labelledby={`tab-${tab}`} className="mt-6 min-h-[260px] animate-rise">
            {tab === 'overview' && (
              <>
                {c.what.map((p, i) => (
                  <p key={p.slice(0, 24)} className={cn('mt-3 first:mt-0 text-ink-mid', i === 0 && 'text-[1.06rem] font-semibold text-ink-dark')}>{p}</p>
                ))}
                {c.whatGroups && (
                  <div className="mt-5 grid grid-cols-2 gap-4 max-sm:grid-cols-1">
                    {c.whatGroups.map((g) => (
                      <div key={g.title} className="rounded-xl border border-line bg-ink-light/50 p-5 transition duration-300 hover:-translate-y-1 hover:border-(--c)/50 hover:bg-white hover:shadow-soft">
                        <b className="block font-serif text-[1.2rem] font-semibold leading-[1.2] text-(--c-dark)">{g.title}</b>
                        {g.lead && <p className="mt-1.5 mb-3 text-[.84rem] text-ink-mid">{g.lead}</p>}
                        <TopicList topics={g.items} cols={1} />
                      </div>
                    ))}
                  </div>
                )}
                {c.whatOutro && <p className="mt-4 text-ink-mid">{c.whatOutro}</p>}
              </>
            )}

            {tab === 'about' && (
              <div className="relative rounded-2xl bg-(--c-soft)/60 p-6 pl-7 before:absolute before:inset-y-5 before:left-0 before:w-1 before:rounded-full before:bg-linear-180 before:from-(--c) before:to-(--c-alt)">
                {moreIntro.map((p) => <p key={p.slice(0, 24)} className="mt-3 first:mt-0 text-ink">{p}</p>)}
              </div>
            )}

            {tab === 'benefits' && (
              <>
                {c.benefitsTitle !== benefitsLabel && <h3 className="font-serif text-[1.5rem] font-semibold leading-[1.2] text-ink-dark">{c.benefitsTitle}</h3>}
                {c.benefitsLead && <p className="mt-1.5 text-[.92rem] text-ink-mid">{c.benefitsLead}</p>}
                <ul className="mt-4 grid grid-cols-2 gap-2.5 max-sm:grid-cols-1">
                  {c.benefits.map((b, i) => (
                    <li key={b} className="group flex animate-rise items-start gap-3 rounded-xl border border-line bg-white px-3.5 py-3 text-[.9rem] text-ink transition duration-300 hover:-translate-y-0.5 hover:border-(--c)/40 hover:shadow-soft" style={{ animationDelay: `${i * 45}ms` }}>
                      <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-(--c-soft) text-(--c) transition duration-300 group-hover:bg-(--c) group-hover:text-white"><Tick /></span>
                      {b}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ---------- 3b. Photo gallery (optional) ---------- */
function Gallery({ c }) {
  const photos = c.gallery
  const [idx, setIdx] = useState(-1)
  const open = idx >= 0

  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') setIdx(-1)
      if (e.key === 'ArrowRight') setIdx((i) => (i + 1) % photos.length)
      if (e.key === 'ArrowLeft') setIdx((i) => (i - 1 + photos.length) % photos.length)
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open, photos?.length])

  if (!photos?.length) return null
  return (
    <section className="section-pad bg-white pt-0">
      <div className="wrap">
        <div className="grid grid-cols-4 gap-5 max-lg:grid-cols-2 max-sm:grid-cols-1">
          {photos.map((ph, i) => (
            <Reveal key={ph.caption} delay={`${i * 0.08}s`}>
              <button
                type="button"
                onClick={() => setIdx(i)}
                aria-label={`View photo: ${ph.caption}`}
                className="group relative block aspect-[4/3] w-full cursor-zoom-in overflow-hidden rounded-[16px] bg-ink-light shadow-soft"
              >
                <img src={ph.src} alt={ph.caption} loading="lazy" style={{ objectPosition: ph.position }} className="size-full object-cover transition duration-700 ease-smooth group-hover:scale-110" />
                <span className="absolute inset-0 bg-linear-180 from-transparent from-45% to-(--c-deep)/85 transition duration-300 group-hover:to-(--c-deep)/95" />
                <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 text-left">
                  <b className="font-serif text-[1.3rem] font-semibold leading-[1.15] text-white">{ph.caption}</b>
                  <span className="grid size-9 shrink-0 translate-y-2 place-items-center rounded-full bg-white/90 text-(--c-dark) opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    <Icon name="search" className="size-4" />
                  </span>
                </span>
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={photos[idx].caption}
          onClick={() => setIdx(-1)}
          className="fixed inset-0 z-[200] flex animate-[rise_.3s_ease_both] flex-col items-center justify-center gap-4 bg-brand-deep/90 p-6 backdrop-blur-sm"
        >
          <button type="button" aria-label="Close" onClick={() => setIdx(-1)} className="fixed top-5 right-5 grid size-11 place-items-center rounded-full bg-white text-xl text-ink-dark shadow-card hover:bg-(--c) hover:text-white">×</button>
          {photos.length > 1 && (
            <>
              <button type="button" aria-label="Previous photo" onClick={(e) => { e.stopPropagation(); setIdx((i) => (i - 1 + photos.length) % photos.length) }} className="fixed top-1/2 left-4 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-2xl text-ink-dark hover:bg-white max-sm:top-auto max-sm:bottom-6">‹</button>
              <button type="button" aria-label="Next photo" onClick={(e) => { e.stopPropagation(); setIdx((i) => (i + 1) % photos.length) }} className="fixed top-1/2 right-4 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-2xl text-ink-dark hover:bg-white max-sm:top-auto max-sm:bottom-6">›</button>
            </>
          )}
          <img src={photos[idx].src} alt={photos[idx].caption} onClick={(e) => e.stopPropagation()} className="max-h-[78vh] w-auto max-w-full rounded-xl shadow-2xl" />
          <p className="font-serif text-[1.4rem] text-white">{photos[idx].caption} <span className="ml-2 font-sans text-[.85rem] text-white/60">{idx + 1} / {photos.length}</span></p>
        </div>
      )}
    </section>
  )
}

/* ---------- 4. Syllabus (accordion) ---------- */
const topicCount = (m) => (m.groups ? m.groups.reduce((n, g) => n + g.topics.length, 0) : m.topics.length)

function TopicList({ topics, cols = 2 }) {
  return (
    <ul className={cn('grid gap-x-6 gap-y-2.5', cols === 2 && 'grid-cols-2 max-sm:grid-cols-1')}>
      {topics.map((t) => (
        <li key={t} className="flex items-start gap-2.5 text-[.92rem] text-ink">
          <span className="mt-[3px] grid size-[18px] shrink-0 place-items-center rounded-full bg-(--c-soft) text-(--c)"><Tick className="size-3" /></span>
          {t}
        </li>
      ))}
    </ul>
  )
}

function ModuleTopics({ m, open }) {
  // topics fade/slide in one after another when the module opens
  const item = (t, i) => (
    <li
      key={t}
      className="flex items-start gap-2.5 text-[.92rem] text-ink transition-all duration-400 ease-smooth"
      style={{ transitionDelay: open ? `${80 + i * 35}ms` : '0ms', opacity: open ? 1 : 0, transform: open ? 'none' : 'translateY(8px)' }}
    >
      <span className="mt-[3px] grid size-[18px] shrink-0 place-items-center rounded-full bg-(--c-soft) text-(--c)"><Tick className="size-3" /></span>
      {t}
    </li>
  )
  return (
    <div className="border-t border-line px-6 pt-5 pb-6 max-sm:px-4">
      {m.text && <p className="mb-4 text-[.92rem] font-semibold text-ink-dark">{m.text}</p>}
      {m.label && <small className="mb-3 block text-[.72rem] font-extrabold uppercase tracking-[.12em] text-(--c)">{m.label}</small>}
      {m.groups ? (
        <div className="grid grid-cols-2 gap-x-6 gap-y-5 max-sm:grid-cols-1">
          {m.groups.map((g) => (
            <div key={g.title}>
              <b className="mb-2 block text-[.88rem] font-extrabold text-ink-dark">{g.title}</b>
              <ul className="grid gap-y-2.5">{g.topics.map(item)}</ul>
            </div>
          ))}
        </div>
      ) : (
        <ul className="grid grid-cols-2 gap-x-6 gap-y-2.5 max-sm:grid-cols-1">{m.topics.map(item)}</ul>
      )}
    </div>
  )
}

/** Ring that fills as more modules are explored. */
function ProgressRing({ value, total }) {
  const r = 34
  const len = 2 * Math.PI * r
  const pct = total ? value / total : 0
  return (
    <div className="relative size-[92px] shrink-0">
      <svg viewBox="0 0 80 80" className="size-full -rotate-90" aria-hidden="true">
        <circle cx="40" cy="40" r={r} fill="none" stroke="rgba(255,255,255,.15)" strokeWidth="7" />
        <circle
          cx="40" cy="40" r={r} fill="none" stroke="var(--c-alt)" strokeWidth="7" strokeLinecap="round"
          strokeDasharray={len} strokeDashoffset={len * (1 - pct)}
          style={{ transition: 'stroke-dashoffset .8s cubic-bezier(.25,.8,.25,1)' }}
        />
      </svg>
      <span className="absolute inset-0 grid place-items-center text-center leading-none">
        <span>
          <b className="block text-[1.35rem] font-extrabold">{Math.round(pct * 100)}%</b>
          <small className="text-[.6rem] font-bold uppercase tracking-[.08em] text-white/70">explored</small>
        </span>
      </span>
    </div>
  )
}

function Syllabus({ c, onEnquire }) {
  const total = c.syllabus.length
  const [open, setOpen] = useState(() => new Set([0]))
  const [seen, setSeen] = useState(() => new Set([0]))
  const topics = c.syllabus.reduce((n, m) => n + topicCount(m), 0)
  const allOpen = open.size === total
  const furthest = open.size ? Math.max(...open) : -1

  const toggle = (i) => {
    setOpen((o) => {
      const n = new Set(o)
      n.has(i) ? n.delete(i) : n.add(i)
      return n
    })
    setSeen((s) => new Set(s).add(i))
  }
  const toggleAll = () => {
    if (allOpen) setOpen(new Set())
    else {
      const every = new Set(c.syllabus.map((_, i) => i))
      setOpen(every)
      setSeen(every)
    }
  }

  return (
    <section id="syllabus" className="section-pad relative overflow-clip bg-ink-light">
      <span className="pointer-events-none absolute -top-24 -left-24 size-[420px] rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--c)_14%,transparent),transparent_70%)]" />
      <span className="pointer-events-none absolute right-[30%] bottom-20 size-[120px] animate-[floaty_8s_ease-in-out_infinite] rounded-full bg-[radial-gradient(color-mix(in_oklab,var(--c)_28%,transparent)_1.5px,transparent_1.5px)] bg-size-[12px_12px] max-lg:hidden" />

      <div className="wrap relative grid grid-cols-[1.35fr_.65fr] items-start gap-12 max-lg:grid-cols-1">
        <div>
          <Reveal className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <Eyebrow>Course Syllabus</Eyebrow>
              <H2>{c.name} <em>Syllabus</em></H2>
              {c.syllabusLead && <p className="max-w-[620px] text-ink-mid">{c.syllabusLead}</p>}
            </div>
            <button
              type="button"
              onClick={toggleAll}
              className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-[.78rem] font-bold uppercase tracking-[.08em] text-(--c) transition hover:border-(--c) hover:bg-(--c) hover:text-white"
            >
              <svg viewBox="0 0 24 24" className={cn('size-4 transition-transform duration-300', allOpen && 'rotate-180')} fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>
              {allOpen ? 'Collapse all' : 'Expand all'}
            </button>
          </Reveal>

          {/* timeline of modules */}
          <ol className="relative mt-9 flex flex-col gap-3.5">
            {c.syllabus.map((m, i) => {
              const on = open.has(i)
              const n = String(i + 1).padStart(2, '0')
              return (
                <Reveal as="li" key={m.title} delay={`${Math.min(i, 10) * 0.05}s`} className="relative flex items-start gap-4 max-sm:gap-3">
                  {/* rail segment down to the next module (fills when a later module is open) */}
                  {i < total - 1 && (
                    <span className="absolute top-[34px] -bottom-[14px] left-[21px] w-0.5 overflow-hidden rounded bg-line max-sm:left-[17px]">
                      <span className="block size-full origin-top bg-linear-180 from-(--c) to-(--c-alt) transition-transform duration-500 ease-smooth" style={{ transform: `scaleY(${i < furthest ? 1 : 0})` }} />
                    </span>
                  )}
                  {/* node on the rail */}
                  <button
                    type="button"
                    onClick={() => toggle(i)}
                    aria-label={`${on ? 'Hide' : 'Show'} module ${i + 1} topics`}
                    className={cn(
                      'relative z-[1] mt-3 grid size-11 shrink-0 place-items-center rounded-full border-2 font-sans text-[.95rem] font-extrabold transition-all duration-400 max-sm:size-9 max-sm:text-[.8rem]',
                      on ? 'scale-110 border-(--c) bg-(--c) text-white shadow-[0_8px_20px_-6px_var(--c)]' : 'border-line bg-white text-(--c) hover:border-(--c)',
                    )}
                  >
                    {on && <span className="absolute inset-0 animate-[ring-pulse_2.2s_ease-out_infinite] rounded-full" />}
                    {n}
                  </button>

                  {/* module card */}
                  <div
                    className={cn(
                      'relative min-w-0 flex-1 overflow-hidden rounded-2xl border bg-white transition-all duration-400 ease-smooth',
                      'before:absolute before:inset-y-0 before:left-0 before:w-1 before:origin-top before:bg-linear-180 before:from-(--c) before:to-(--c-alt) before:transition-transform before:duration-500',
                      on ? 'border-(--c)/40 shadow-[0_18px_40px_-20px_rgba(0,63,122,.45)] before:scale-y-100' : 'border-line before:scale-y-0 hover:-translate-y-0.5 hover:border-(--c)/40 hover:shadow-soft',
                    )}
                  >
                    <button type="button" onClick={() => toggle(i)} aria-expanded={on} className={cn('flex w-full items-center gap-4 px-6 py-5 text-left transition-colors max-sm:px-4', on && 'bg-linear-90 from-(--c-soft) to-white')}>
                      <span className="min-w-0 flex-1">
                        <small className="text-[.68rem] font-extrabold uppercase tracking-[.14em] text-(--c)">Module {n}</small>
                        <b className="block font-serif text-[1.35rem] font-semibold leading-[1.2] text-ink-dark">{m.title}</b>
                      </span>
                      <span className={cn('shrink-0 rounded-full px-2.5 py-1 text-[.7rem] font-bold transition-colors max-sm:hidden', on ? 'bg-(--c) text-white' : 'bg-ink-light text-ink-mid')}>
                        {topicCount(m)} {m.groups ? 'activities' : 'topics'}
                      </span>
                      <span className={cn('grid size-8 shrink-0 place-items-center rounded-full border transition duration-400', on ? 'rotate-180 border-(--c) bg-(--c) text-white' : 'border-line text-ink-mid')}>
                        <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>
                      </span>
                    </button>
                    <div className={cn('grid transition-[grid-template-rows] duration-500 ease-smooth', on ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]')}>
                      <div className="overflow-hidden">
                        <ModuleTopics m={m} open={on} />
                      </div>
                    </div>
                  </div>
                </Reveal>
              )
            })}
          </ol>
        </div>

        {/* at-a-glance card */}
        <Reveal variant="right" className="lg:sticky lg:top-[110px]">
          <div className="relative overflow-hidden rounded-[22px] bg-linear-135 from-(--c-deep) via-(--c-dark) to-(--c) px-8 py-9 text-white shadow-[0_30px_60px_-28px_rgba(0,0,0,.5)]">
            <span className="absolute -top-16 -right-16 size-52 rounded-full border-[34px] border-white/8" />
            <span className="absolute -bottom-12 -left-12 size-36 animate-[spin_30s_linear_infinite] rounded-full border-2 border-dashed border-white/15" />
            <small className="relative text-[.72rem] font-extrabold uppercase tracking-[.16em] text-white/75">At a glance</small>

            <div className="relative mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-white/10 px-4 py-3.5 backdrop-blur">
                <b className="block font-sans text-[2.3rem] font-extrabold leading-none tracking-tight"><CountUp end={total} /></b>
                <small className="text-white/75">Modules</small>
              </div>
              <div className="rounded-2xl bg-white/10 px-4 py-3.5 backdrop-blur">
                <b className="block font-sans text-[2.3rem] font-extrabold leading-none tracking-tight"><CountUp end={topics} /><span className="text-[.55em] text-(--c-alt)">+</span></b>
                <small className="text-white/75">Topics</small>
              </div>
            </div>

            <div className="relative mt-5 flex items-center gap-4 rounded-2xl border border-white/15 p-4">
              <ProgressRing value={seen.size} total={total} />
              <p className="text-[.86rem] text-white/80">
                You've explored <b className="text-white">{seen.size}</b> of <b className="text-white">{total}</b> modules.
                <span className="mt-1 block text-[.78rem] text-white/60">{seen.size < total ? 'Open a module to see its topics.' : 'You have seen the full syllabus!'}</span>
              </p>
            </div>

            <ul className="relative mt-5 flex flex-col gap-2.5 text-[.9rem]">
              {['Practical, hands-on sessions', 'Real-time business examples', 'Course completion certificate', 'Flexible batch timings'].map((t) => (
                <li key={t} className="flex items-center gap-2.5"><span className="grid size-5 place-items-center rounded-full bg-(--c-alt) text-ink-dark"><Tick className="size-3" /></span>{t}</li>
              ))}
            </ul>
            <button
              type="button"
              onClick={onEnquire}
              aria-haspopup="dialog"
              className={cn(
                btn,
                'relative mt-7 w-full overflow-hidden bg-white text-(--c-dark) hover:bg-(--c-alt) hover:text-ink-dark',
                'after:absolute after:inset-y-0 after:-left-1/2 after:w-1/3 after:-skew-x-12 after:bg-linear-90 after:from-transparent after:via-white/70 after:to-transparent after:transition-[left] after:duration-700 hover:after:left-[120%]',
              )}
            >
              Get Fees &amp; Batch Details
            </button>
            <a href={PHONE_HREF} className="relative mt-3 block text-center text-[.86rem] font-bold text-white/85 hover:text-white">or call {PHONE}</a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ---------- 4b. Project training (optional) ---------- */
function Projects({ c }) {
  const pj = c.projects
  if (!pj) return null
  return (
    <section className="section-pad relative overflow-hidden bg-linear-135 from-(--c-deep) to-(--c-dark) text-white">
      <span className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(135deg,rgba(255,255,255,.04)_0_80px,transparent_80px_200px)]" />
      <div className="wrap relative">
        <Reveal className="text-center">
          <Eyebrow center light>Hands-On Projects</Eyebrow>
          <H2 light>{pj.title}</H2>
          {pj.lead && <p className="mx-auto max-w-[620px] text-white/80">{pj.lead}</p>}
        </Reveal>
        <div className="mt-12 grid grid-cols-3 gap-5 max-lg:grid-cols-2 max-sm:grid-cols-1">
          {pj.items.map((x, i) => (
            <Reveal key={x.title} delay={`${(i % 3) * 0.08}s`} className="h-full">
              <div className="group h-full rounded-[16px] border border-white/15 bg-white/[.06] p-6 backdrop-blur transition duration-350 hover:-translate-y-1.5 hover:border-white/40 hover:bg-white/[.12]">
                <span className="inline-block rounded-[40px] bg-(--c-alt) px-3 py-1 text-[.68rem] font-extrabold uppercase tracking-[.14em] text-ink-dark">Project {i + 1}</span>
                <h3 className="mt-4 font-serif text-[1.45rem] font-semibold leading-[1.2]">{x.title}</h3>
                <p className="mt-2 text-[.9rem] text-white/80">{x.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------- 5. Careers ---------- */
function RoleCard({ r, i }) {
  const n = String(i + 1).padStart(2, '0')
  return (
    <div
      className={cn(
        'group relative flex h-full gap-4 overflow-hidden rounded-2xl border border-line bg-white py-4 pr-5 pl-4 transition-all duration-400 ease-smooth',
        'hover:-translate-y-1 hover:border-(--c)/30 hover:shadow-[0_18px_40px_-18px_rgba(0,63,122,.45)]',
        // accent bar that grows on hover
        'before:absolute before:inset-y-0 before:left-0 before:w-1 before:origin-bottom before:scale-y-0 before:bg-linear-180 before:from-(--c) before:to-(--c-alt) before:transition-transform before:duration-400 hover:before:scale-y-100',
        // light sweep on hover
        'after:pointer-events-none after:absolute after:inset-y-0 after:-left-2/3 after:w-1/2 after:-skew-x-12 after:bg-linear-90 after:from-transparent after:via-white/80 after:to-transparent after:transition-[left] after:duration-700 hover:after:left-[130%]',
        r.text ? 'items-start' : 'items-center',
      )}
    >
      <span className="relative shrink-0">
        <span className="grid size-12 place-items-center rounded-xl bg-(--c-soft) text-(--c) transition duration-400 ease-smooth group-hover:-rotate-6 group-hover:bg-linear-135 group-hover:from-(--c) group-hover:to-(--c-dark) group-hover:text-white group-hover:shadow-[0_10px_20px_-8px_var(--c)]">
          <Icon name="briefcase" className="size-[22px]" />
        </span>
        <span className="absolute -top-1.5 -right-1.5 grid size-[22px] place-items-center rounded-full bg-white text-[.62rem] font-extrabold text-(--c) shadow-[0_2px_8px_rgba(11,37,69,.18)] ring-2 ring-white">
          {n}
        </span>
      </span>
      <span className="relative min-w-0 flex-1">
        <b className="block font-serif text-[1.28rem] font-semibold leading-[1.2] text-ink-dark transition-colors duration-300 group-hover:text-(--c-dark)">{r.title}</b>
        {r.text && <span className="mt-1 block text-[.88rem] leading-relaxed text-ink-mid">{r.text}</span>}
      </span>
      <span className="relative shrink-0 -translate-x-2 self-center text-[1.2rem] font-bold text-(--c) opacity-0 transition duration-300 group-hover:translate-x-0 group-hover:opacity-100" aria-hidden="true">→</span>
    </div>
  )
}

function Careers({ c, onEnquire }) {
  return (
    <section className="section-pad relative overflow-clip bg-white">
      {/* soft background shapes */}
      <span className="pointer-events-none absolute -top-40 -right-40 size-[520px] rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--c)_10%,transparent),transparent_70%)]" />
      <span className="pointer-events-none absolute bottom-10 left-[38%] size-[140px] animate-[floaty_8s_ease-in-out_infinite] rounded-full bg-[radial-gradient(color-mix(in_oklab,var(--c)_30%,transparent)_1.5px,transparent_1.5px)] bg-size-[12px_12px] max-lg:hidden" />

      <div className="wrap relative grid grid-cols-[.8fr_1.2fr] items-start gap-14 max-lg:grid-cols-1 max-lg:gap-10">
        {/* intro column */}
        <div className="lg:sticky lg:top-[110px]">
          <Reveal variant="left">
            <Eyebrow>Your Future</Eyebrow>
            <H2>{c.careersTitle || <>Career Opportunities After <em>{c.name}</em></>}</H2>
            <p className="text-ink-mid">{c.careersLead}</p>
          </Reveal>

          <Reveal variant="left" delay=".1s" className="relative mt-7 overflow-hidden rounded-[20px] bg-linear-135 from-(--c-deep) via-(--c-dark) to-(--c) p-7 text-white">
            <span className="absolute -top-14 -right-14 size-44 animate-[spin_30s_linear_infinite] rounded-full border-2 border-dashed border-white/20" />
            <span className="absolute -bottom-10 -left-10 size-32 rounded-full border-[22px] border-white/5" />
            <div className="relative flex items-end gap-3">
              <b className="font-sans text-[3.4rem] font-extrabold leading-none tracking-tight">
                <CountUp end={c.careers.length} />
                <sup className="ml-0.5 text-[.45em] text-(--c-alt)">+</sup>
              </b>
              <span className="pb-2 text-[.8rem] font-extrabold uppercase leading-[1.3] tracking-[.12em] text-white/80">Job roles<br />to explore</span>
            </div>
            <p className="relative mt-3 text-[.9rem] text-white/80">Get guidance on the right role for your profile, plus resume and interview support.</p>
            <button type="button" onClick={onEnquire} aria-haspopup="dialog" className={cn(btn, 'relative mt-5 bg-white px-6 py-3 text-(--c-dark) hover:bg-(--c-alt) hover:text-ink-dark')}>
              Get Career Guidance
            </button>
          </Reveal>

          {c.careersNote && (
            <Reveal variant="left" delay=".2s" className="mt-5 flex items-start gap-3 rounded-xl border border-[#f3e1a6] bg-[#fffaeb] px-5 py-4 text-[.86rem] text-[#7a5a00]">
              <Icon name="alert" className="mt-0.5 size-5 shrink-0" />
              <span><b>Note:</b> {c.careersNote}</span>
            </Reveal>
          )}
        </div>

        {/* role cards */}
        <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
          {c.careers.map((r, i) => (
            <Reveal key={r.title} variant="right" delay={`${Math.min(i, 9) * 0.06}s`} className="h-full">
              <RoleCard r={r} i={i} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------- 6. Industries + who can join ---------- */
const pick = (text, rules, fallback) => rules.find(([re]) => re.test(text))?.[1] || fallback

const industryIcon = (t) =>
  pick(t, [
    [/bank|financ|insurance/i, 'coin'],
    [/\bIT\b|software|technology|telecom/i, 'monitor'],
    [/health|hospital|pharma/i, 'shieldCheck'],
    [/retail|commerce|wholesale|trading|FMCG/i, 'box'],
    [/manufactur|engineering|automotive|chemical|oil|construction/i, 'building'],
    [/logistic|supply|distribution|transport/i, 'trend'],
    [/education|school|college|institution/i, 'cap'],
    [/account|audit|tax|chartered|GST/i, 'ledger'],
    [/marketing|sales/i, 'bars'],
    [/human|HR\b/i, 'users'],
    [/consult|service|BPO/i, 'chat'],
    [/government|court|legal/i, 'shield'],
  ], 'briefcase')

const audienceIcon = (t) =>
  pick(t, [
    [/student|PUC|school|college|graduate|\b(B\.?Com|BBA|BCA|MBA|B\.E|B\.?Tech|B\.?Sc|M\.?Com)\b/i, 'cap'],
    [/job seeker|aspirant|candidate/i, 'search'],
    [/account|finance|CA |CMA/i, 'coin'],
    [/owner|entrepreneur/i, 'building'],
    [/MIS|data|excel|analyst|report/i, 'bars'],
    [/sales|marketing/i, 'trend'],
    [/admin|office|front|reception|back office/i, 'layout'],
    [/HR|human/i, 'users'],
    [/procurement|purchase|inventory|supply|stores/i, 'box'],
    [/software|ERP|SAP|tally|computer/i, 'monitor'],
    [/beginner|anyone|individual|hesitate|interested/i, 'sparkle'],
    [/working|professional|staff|executive|employee/i, 'briefcase'],
  ], 'user')

function ChipRow({ items, reverse }) {
  const copy = (hidden) => (
    <ul className="flex shrink-0 gap-3 pr-3" aria-hidden={hidden || undefined}>
      {items.map((x) => (
        <li key={x} className="flex items-center gap-2.5 whitespace-nowrap rounded-full border border-white/15 bg-white/[.08] py-2 pr-5 pl-2 text-[.92rem] font-semibold text-white backdrop-blur transition duration-300 hover:border-white/50 hover:bg-white hover:text-(--c-dark)">
          <span className="grid size-8 place-items-center rounded-full bg-white/15 text-(--c-alt)"><Icon name={industryIcon(x)} className="size-4" /></span>
          {x}
        </li>
      ))}
    </ul>
  )
  return (
    <div
      className="flex w-max animate-[slide-half_linear_infinite] group-hover/marquee:[animation-play-state:paused] motion-reduce:animate-none"
      style={{ animationDuration: `${Math.max(items.length, 4) * 6}s`, animationDirection: reverse ? 'reverse' : 'normal' }}
    >
      {copy(false)}
      {copy(true)}
    </div>
  )
}

function Audience({ c, onEnquire }) {
  const ind = c.industries || []
  const rows = ind.length >= 6 ? [ind.slice(0, Math.ceil(ind.length / 2)), ind.slice(Math.ceil(ind.length / 2))] : ind.length ? [ind] : []
  return (
    <section className="section-pad bg-ink-light">
      <div className="wrap">
        {/* industries: moving chip rows on a brand band */}
        {rows.length > 0 && (
          <Reveal className="relative mb-10 overflow-hidden rounded-[28px] bg-linear-120 from-(--c-deep) via-(--c-dark) to-(--c) py-12 text-white max-sm:py-9">
            <span className="pointer-events-none absolute -top-24 -left-24 size-72 rounded-full border-[46px] border-white/5" />
            <span className="pointer-events-none absolute -right-10 -bottom-16 size-56 animate-[spin_40s_linear_infinite] rounded-full border-2 border-dashed border-white/15" />
            <div className="relative px-10 text-center max-sm:px-5">
              <Eyebrow center light>Where You Can Work</Eyebrow>
              <H2 light className="mb-2">{c.industriesTitle}</H2>
              <p className="mx-auto max-w-[620px] text-white/75">{c.industriesLead}</p>
            </div>
            <div className="group/marquee relative mt-9 flex flex-col gap-3 [mask-image:linear-gradient(90deg,transparent,#000_7%,#000_93%,transparent)]">
              {rows.map((r, i) => <ChipRow key={i} items={r} reverse={i % 2 === 1} />)}
            </div>
          </Reveal>
        )}

        {/* who can join */}
        <div className="grid grid-cols-[.75fr_1.5fr] items-start gap-10 rounded-[28px] bg-white p-10 shadow-soft max-lg:grid-cols-1 max-lg:gap-8 max-sm:p-6">
          <Reveal variant="left" className="lg:sticky lg:top-[110px]">
            <span className="relative grid size-16 place-items-center rounded-2xl bg-linear-135 from-(--c) to-(--c-dark) text-white shadow-[0_14px_28px_-12px_var(--c)]">
              <span className="absolute inset-0 animate-[ring-pulse_2.4s_ease-out_infinite] rounded-2xl" />
              <Icon name="users" className="size-8" />
            </span>
            <div className="mt-6"><Eyebrow>Eligibility</Eyebrow></div>
            <H2 className="mt-2">{c.audienceTitle || 'Who Can Join This Course?'}</H2>
            <p className="text-ink-mid">{c.audienceLead || `Our ${c.name} training is suitable for:`}</p>
            {c.audienceNote && (
              <p className="mt-5 flex items-start gap-3 rounded-xl border-l-4 border-(--c) bg-(--c-soft) px-4 py-3.5 text-[.88rem] text-(--c-dark)">
                <Icon name="checkCircle" className="mt-0.5 size-5 shrink-0" />
                <span>{c.audienceNote}</span>
              </p>
            )}
            <button type="button" onClick={onEnquire} aria-haspopup="dialog" className="mt-5 inline-flex items-center gap-2 text-[.82rem] font-bold uppercase tracking-[.08em] text-(--c) hover:text-(--c-dark)">
              Check your eligibility <span aria-hidden="true">→</span>
            </button>
          </Reveal>

          <ul className="grid grid-cols-2 gap-3.5 xl:grid-cols-3 max-sm:grid-cols-1">
            {c.audience.map((x, i) => (
              <Reveal as="li" key={x} delay={`${Math.min(i, 11) * 0.05}s`} className="h-full">
                <div className="group flex h-full items-center gap-3.5 rounded-2xl border border-line bg-ink-light/50 px-4 py-4 transition-all duration-350 ease-smooth hover:-translate-y-1 hover:border-(--c)/40 hover:bg-white hover:shadow-[0_14px_30px_-16px_rgba(0,63,122,.4)]">
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-white text-(--c) shadow-[0_4px_12px_-4px_rgba(11,37,69,.15)] transition duration-350 ease-smooth group-hover:scale-110 group-hover:rotate-[-8deg] group-hover:bg-(--c) group-hover:text-white">
                    <Icon name={audienceIcon(x)} className="size-5" />
                  </span>
                  <span className="text-[.92rem] font-semibold leading-snug text-ink-dark">{x}</span>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

/* ---------- 6b. Advantages + comparison (optional) ---------- */
function Extras({ c }) {
  const { advantages: adv, comparison: cmp } = c
  if (!adv && !cmp) return null
  return (
    <section className="section-pad bg-white">
      <div className={cn('wrap grid items-start gap-8', adv && cmp ? 'grid-cols-[.8fr_1.2fr] max-lg:grid-cols-1' : 'max-w-[980px]')}>
        {adv && (
          <Reveal variant="left" className="relative overflow-hidden rounded-[20px] bg-linear-135 from-(--c-dark) to-(--c) p-9 text-white max-sm:p-6">
            <span className="absolute -top-16 -right-16 size-52 rounded-full border-[34px] border-white/8" />
            <span className="relative grid size-14 place-items-center rounded-2xl bg-white/15"><Icon name="star" className="size-7" /></span>
            <h2 className="relative mt-5 font-serif text-[1.9rem] font-semibold leading-[1.15]">{adv.title}</h2>
            <ul className={cn('relative mt-6 grid gap-3', !cmp && 'grid-cols-2 gap-x-8 max-sm:grid-cols-1')}>
              {adv.items.map((a) => (
                <li key={a} className="flex items-start gap-3 text-[.94rem] text-white/90">
                  <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-white/20"><Tick /></span>
                  {a}
                </li>
              ))}
            </ul>
          </Reveal>
        )}
        {cmp && (
          <Reveal variant={adv ? 'right' : 'up'}>
            <Eyebrow>Compare</Eyebrow>
            <H2>{cmp.title}</H2>
            {cmp.lead && <p className="text-ink-mid">{cmp.lead}</p>}
            <div className="mt-6 overflow-hidden rounded-2xl border border-line">
              <table className="w-full text-left text-[.92rem]">
                <thead>
                  <tr>
                    {cmp.columns.map((h, i) => (
                      <th key={h} className={cn('px-5 py-4 font-serif text-[1.3rem] font-semibold', i === 1 ? 'bg-(--c) text-white' : 'bg-ink-light text-ink-dark')}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {cmp.rows.map((r) => (
                    <tr key={r[0]} className="border-t border-line transition-colors hover:bg-(--c-soft)/50">
                      <td className="px-5 py-3.5 text-ink">{r[0]}</td>
                      <td className="border-l border-line px-5 py-3.5 font-semibold text-ink-dark">{r[1]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {cmp.note && (
              <p className="mt-5 flex items-start gap-3 rounded-xl bg-(--c-soft) px-5 py-4 text-[.9rem] text-(--c-dark)">
                <Icon name="sparkle" className="mt-0.5 size-5 shrink-0" />
                <span>{cmp.note}</span>
              </p>
            )}
          </Reveal>
        )}
      </div>
    </section>
  )
}

/* ---------- 6c. Course levels side by side (optional) ---------- */
function Levels({ c }) {
  const lv = c.levels
  if (!lv) return null
  return (
    <section className="section-pad bg-white">
      <div className="wrap">
        <Reveal className="text-center">
          <Eyebrow center>Compare Levels</Eyebrow>
          <H2>{lv.title}</H2>
        </Reveal>
        <div className="mt-12 grid grid-cols-3 items-stretch gap-6 max-lg:grid-cols-1">
          {lv.items.map((x, i) => {
            const on = x.slug === c.slug
            const Card = on || !x.slug ? 'div' : Link
            return (
              <Reveal key={x.title} delay={`${i * 0.1}s`} className="h-full">
                <Card
                  {...(Card === Link ? { to: `/courses/${x.slug}` } : {})}
                  className={cn(
                    'group relative flex h-full flex-col rounded-[18px] border p-7 transition duration-350',
                    on ? 'border-(--c) bg-linear-135 from-(--c-dark) to-(--c) text-white shadow-[0_24px_50px_-20px_var(--c)] lg:-translate-y-3' : 'border-line bg-white hover:-translate-y-1.5 hover:border-(--c)/50 hover:shadow-soft',
                  )}
                >
                  {on && <span className="absolute -top-3 left-7 rounded-[40px] bg-(--c-alt) px-3 py-1 text-[.66rem] font-extrabold uppercase tracking-[.14em] text-ink-dark">This course</span>}
                  <small className={cn('text-[.7rem] font-extrabold uppercase tracking-[.16em]', on ? 'text-white/70' : 'text-(--c)')}>Level {i + 1}</small>
                  <h3 className={cn('mt-1 font-serif text-[1.7rem] font-semibold leading-[1.15]', on ? 'text-white' : 'text-ink-dark')}>{x.title}</h3>
                  <ul className="mt-5 mb-2 flex flex-col gap-2.5">
                    {x.points.map((pt) => (
                      <li key={pt} className={cn('flex items-start gap-2.5 text-[.92rem]', on ? 'text-white/90' : 'text-ink')}>
                        <span className={cn('mt-[3px] grid size-[18px] shrink-0 place-items-center rounded-full', on ? 'bg-white/20' : 'bg-(--c-soft) text-(--c)')}><Tick className="size-3" /></span>
                        {pt}
                      </li>
                    ))}
                  </ul>
                  {Card === Link && (
                    <span className="mt-auto inline-flex items-center gap-2 pt-4 text-[.78rem] font-bold uppercase tracking-[.08em] text-(--c)">
                      View Course <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                    </span>
                  )}
                </Card>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ---------- 7. Why Mark ---------- */
function WhyMark({ items = WHY_MARK, lead, title }) {
  const stats = [
    { end: YEARS_EXCELLENCE, suffix: '+', label: 'Years of excellence' },
    { end: Number(GOOGLE_RATING), decimals: 1, suffix: '★', label: 'Google rating' },
    { end: 2000, suffix: '+', label: 'Students every year' },
  ]
  const odd = items.length % 2 === 1
  return (
    <section className="section-pad relative overflow-clip bg-white">
      <span className="pointer-events-none absolute top-1/3 -left-48 size-[460px] rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--c)_9%,transparent),transparent_70%)]" />
      <div className="wrap relative grid grid-cols-[.8fr_1.2fr] items-start gap-14 max-lg:grid-cols-1 max-lg:gap-10">
        {/* intro + stats */}
        <div className="lg:sticky lg:top-[110px]">
          <Reveal variant="left">
            <Eyebrow>Why Us</Eyebrow>
            <H2>{title || <>Why Choose <em>Mark Education Academy?</em></>}</H2>
            <p className="text-ink-mid">{lead || 'At Mark Education Academy, we focus on practical learning and professional skill development.'}</p>
          </Reveal>

          <Reveal variant="left" delay=".1s" className="mt-7 grid grid-cols-3 gap-3">
            {stats.map((st) => (
              <div key={st.label} className="group rounded-2xl border border-line bg-white px-3 py-4 text-center transition duration-300 hover:-translate-y-1 hover:border-(--c)/40 hover:shadow-soft">
                <b className="block font-sans text-[1.7rem] font-extrabold leading-none tracking-tight text-(--c-dark)">
                  <CountUp end={st.end} decimals={st.decimals} />
                  <span className="ml-0.5 text-[.6em] text-(--c-alt)">{st.suffix}</span>
                </b>
                <small className="mt-1.5 block text-[.68rem] font-bold uppercase leading-tight tracking-[.08em] text-ink-mid">{st.label}</small>
              </div>
            ))}
          </Reveal>

          <Reveal variant="left" delay=".2s" className="mt-4 flex items-center gap-4 rounded-2xl bg-linear-120 from-(--c-deep) via-(--c-dark) to-(--c) p-5 text-white">
            <span className="relative grid size-14 shrink-0 place-items-center">
              <span className="absolute inset-0 animate-[spin_14s_linear_infinite] rounded-full border-2 border-dashed border-(--c-alt)/70" />
              <span className="grid size-11 place-items-center rounded-full bg-white/15"><Icon name="shieldCheck" className="size-6 text-(--c-alt)" /></span>
            </span>
            <div>
              <b className="block text-[1rem] font-extrabold">ISO 9001:2015 Certified</b>
              <small className="text-[.82rem] text-white/75">Quality training with online certificate verification</small>
            </div>
          </Reveal>
        </div>

        {/* points */}
        <ul className="grid grid-cols-2 gap-x-5 gap-y-3 max-sm:grid-cols-1">
          {items.map((w, i) => (
            <Reveal as="li" key={w.text} delay={`${Math.min(i, 12) * 0.05}s`} className={cn('h-full', odd && i === items.length - 1 && 'sm:col-span-2')}>
              <div
                className={cn(
                  'group relative flex h-full items-center gap-4 overflow-hidden rounded-2xl px-4 py-4 transition-all duration-350 ease-smooth',
                  'hover:-translate-y-0.5 hover:bg-(--c-soft)/70',
                  // underline that grows on hover
                  'after:absolute after:right-4 after:bottom-0 after:left-4 after:h-px after:bg-line after:transition-colors',
                  'before:absolute before:bottom-0 before:left-4 before:z-[1] before:h-0.5 before:w-0 before:bg-linear-90 before:from-(--c) before:to-(--c-alt) before:transition-[width] before:duration-500 hover:before:w-[calc(100%-2rem)]',
                )}
              >
                <span className="relative grid size-12 shrink-0 place-items-center rounded-full bg-(--c-soft) text-(--c) transition duration-350 ease-smooth group-hover:scale-110 group-hover:bg-(--c) group-hover:text-white group-hover:shadow-[0_10px_22px_-10px_var(--c)]">
                  <Icon name={w.icon} className="size-[22px]" />
                </span>
                <b className="flex-1 text-[.98rem] font-bold leading-snug text-ink-dark">{w.text}</b>
                <span className="font-serif text-[1.5rem] font-bold leading-none text-(--c)/15 transition-colors duration-300 group-hover:text-(--c)/40">{String(i + 1).padStart(2, '0')}</span>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* ---------- 8. Closing CTA ---------- */
function Closing({ c, onEnquire }) {
  // a course photo that differs from the hero: the last gallery photo when there is one
  const photo = c.closingPhoto || c.gallery?.[c.gallery.length - 1] || { src: c.photo, caption: c.name }
  return (
    <section className="relative isolate overflow-hidden py-20 text-white max-sm:py-14">
      {/* background photo (the course's banner photo) under a neutral dark tint for readable text */}
      <img
        src={c.closingBg || c.photo}
        alt=""
        aria-hidden="true"
        loading="lazy"
        className="absolute inset-0 -z-10 size-full animate-[kenburns_24s_ease-in-out_infinite_alternate] object-cover motion-reduce:animate-none"
      />
      <span className="pointer-events-none absolute inset-0 -z-10 bg-linear-90 from-[#0a0f16]/90 via-[#0a0f16]/75 to-[#0a0f16]/55" />
      {/* floating dots */}
      <span className="pointer-events-none absolute -bottom-28 -left-28 size-[360px] rounded-full border-[54px] border-white/5" />
      {[['12%', '18%', '0s', 'size-2'], ['46%', '82%', '1.2s', 'size-3'], ['70%', '8%', '2.1s', 'size-1.5'], ['22%', '58%', '.6s', 'size-1.5']].map(([top, left, delay, size]) => (
        <span key={top + left} className={cn('pointer-events-none absolute animate-[floaty_6s_ease-in-out_infinite] rounded-full bg-(--c-alt)/60', size)} style={{ top, left, animationDelay: delay }} />
      ))}

      <div className="wrap relative grid grid-cols-[1.1fr_.9fr] items-center gap-14 max-lg:grid-cols-1 max-lg:gap-12">
        {/* text */}
        <Reveal variant="left" className="max-lg:text-center">
          <Eyebrow light>Mark Education Academy</Eyebrow>
          <H2 light className="text-[length:clamp(2rem,3.6vw,2.8rem)]">{c.closingTitle}</H2>
          {c.closing.map((p) => (
            <p key={p.slice(0, 24)} className="mt-3 max-w-[600px] text-white/85 max-lg:mx-auto">{p}</p>
          ))}
          <p className="mt-6 flex items-center gap-3 text-[.86rem] font-extrabold uppercase tracking-[.14em] text-(--c-alt) max-lg:justify-center">
            <span className="h-px w-8 bg-(--c-alt)/60 max-lg:hidden" />
            {c.enrolLine}
          </p>
          {c.closingMotto && <p className="mt-1.5 font-serif text-[1.3rem] italic text-white/90">{c.closingMotto}</p>}

          <div className="mt-8 flex flex-wrap gap-3.5 max-lg:justify-center">
            <button
              type="button"
              onClick={onEnquire}
              aria-haspopup="dialog"
              className={cn(btn, 'relative bg-white text-(--c-dark) hover:-translate-y-0.5 hover:bg-(--c-alt) hover:text-ink-dark')}
            >
              <span className="absolute inset-0 animate-[ring-pulse_2.2s_ease-out_infinite] rounded motion-reduce:animate-none" />
              <span className="relative">Enquire Now</span>
            </button>
            <a href="#enquiry" className={btnGhostLight}>Book Your Free Demo Class</a>
          </div>
          <p className="mt-6 text-[.86rem] text-white/70">
            {c.contactLine} · <a href={PHONE_HREF} className="font-bold text-white hover:underline">{PHONE}</a>
          </p>
        </Reveal>

        {/* photo composition */}
        <Reveal variant="right" className="relative mx-auto w-full max-w-[480px] max-sm:max-w-[340px]">
          <span className="absolute -right-4 -bottom-4 size-full rounded-[28px] bg-(--c-alt)/25" />
          <div className="relative overflow-hidden rounded-[28px] border-[6px] border-white/90 shadow-[0_30px_60px_-20px_rgba(0,0,0,.55)]">
            <img
              src={photo.src}
              alt={photo.caption}
              loading="lazy"
              style={{ objectPosition: photo.position }}
              className="aspect-[4/3] w-full animate-[kenburns_18s_ease-in-out_infinite_alternate] object-cover motion-reduce:animate-none"
            />
            <span className="absolute inset-0 bg-linear-180 from-transparent from-60% to-(--c-deep)/50" />
          </div>

          {/* floating badges */}
          <div className="absolute -top-5 -left-6 flex animate-floaty items-center gap-3 rounded-xl bg-white px-4 py-3 text-ink-dark shadow-card max-sm:-left-2">
            <span className="grid size-10 place-items-center rounded-full bg-(--c-soft) text-(--c)"><Icon name="sparkle" className="size-5" /></span>
            <div>
              <b className="block text-[.9rem] font-extrabold">Free Demo Class</b>
              <small className="text-[.72rem] text-ink-mid">Book your seat today</small>
            </div>
          </div>
          <a href={PHONE_HREF} className="absolute -right-6 bottom-[18%] flex animate-[floaty_6s_ease-in-out_infinite_1s] items-center gap-3 rounded-xl bg-white px-4 py-3 text-ink-dark shadow-card transition hover:scale-105 max-sm:-right-2">
            <span className="relative grid size-10 place-items-center rounded-full bg-(--c) text-white">
              <span className="absolute inset-0 animate-[ring-pulse_2s_ease-out_infinite] rounded-full" />
              <Icon name="phone" className="relative size-5" />
            </span>
            <div>
              <small className="block text-[.68rem] font-bold uppercase tracking-[.1em] text-ink-mid">Call us</small>
              <b className="text-[.9rem] font-extrabold">{PHONE}</b>
            </div>
          </a>
          <div className="absolute -bottom-6 left-8 flex animate-[floaty_7s_ease-in-out_infinite_.5s] items-center gap-2.5 rounded-full bg-(--c-alt) px-4 py-2 text-ink-dark shadow-card">
            <Icon name="award" className="size-5" />
            <b className="text-[.8rem] font-extrabold">Course Certificate</b>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ---------- 9. Free demo: steps + enquiry form ---------- */
const NAME_RE = /^[A-Za-z][A-Za-z .']{1,59}$/
const PHONE_RE = /^\d{10}$/
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

function validateDemo(v) {
  const e = {}
  if (!v.name.trim()) e.name = 'Please enter your name.'
  else if (!NAME_RE.test(v.name.trim())) e.name = 'Use letters only.'
  if (!v.phone) e.phone = 'Please enter your mobile number.'
  else if (!PHONE_RE.test(v.phone)) e.phone = 'Enter a valid 10-digit mobile number.'
  if (v.email && !EMAIL_RE.test(v.email.trim())) e.email = 'Enter a valid email address.'
  if (!v.course) e.course = 'Please choose a course.'
  return e
}

const DEMO_ICONS = {
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" /></>,
  phone: <path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3.1 19.5 19.5 0 01-6-6A19.8 19.8 0 012.1 4.2 2 2 0 014.1 2h3a2 2 0 012 1.7c.1.9.4 1.8.7 2.7a2 2 0 01-.5 2.1L8 9.8a16 16 0 006 6l1.3-1.3a2 2 0 012.1-.4c.9.3 1.8.6 2.7.7a2 2 0 011.7 2z" />,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3.5 7l8.5 6 8.5-6" /></>,
  book: <><path d="M4 19.5A2.5 2.5 0 016.5 17H20V3H6.5A2.5 2.5 0 004 5.5z" /><path d="M4 19.5A2.5 2.5 0 006.5 22H20v-5" /></>,
  chat: <path d="M21 12a8 8 0 01-11.6 7.1L4 21l1.9-5.4A8 8 0 1121 12z" />,
}
const FieldIcon = ({ name }) => (
  <svg viewBox="0 0 24 24" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {DEMO_ICONS[name]}
  </svg>
)

/** Input with an icon and a label that floats up on focus / when filled. */
function FloatField({ id, label, icon, error, as = 'input', children, ...rest }) {
  const Tag = as
  const isSelect = as === 'select'
  return (
    <div className={cn('group/f relative', error && 'animate-[shake-x_.4s_ease]')}>
      <span className={cn('pointer-events-none absolute left-4 z-[1] transition-colors', as === 'textarea' ? 'top-4' : 'top-1/2 -translate-y-1/2', error ? 'text-[#ff9b9b]' : 'text-white/55 group-focus-within/f:text-(--c-alt)')}>
        <FieldIcon name={icon} />
      </span>
      <Tag
        id={id}
        placeholder=" "
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-err` : undefined}
        className={cn(
          'peer w-full rounded-xl border bg-white/[.07] pr-4 pl-12 text-[.95rem] text-white outline-none transition duration-250',
          'focus:bg-white/[.12] focus:shadow-[0_0_0_4px_rgba(255,255,255,.08)]',
          as === 'textarea' ? 'min-h-[110px] resize-y pt-6 pb-3' : 'h-[58px] pt-4',
          isSelect && 'appearance-none pr-10 [&>option]:text-ink-dark',
          error ? 'border-[#ff8a8a]' : 'border-white/15 hover:border-white/30 focus:border-(--c-alt)',
        )}
        {...rest}
      >
        {children}
      </Tag>
      <label
        htmlFor={id}
        className={cn(
          'pointer-events-none absolute left-12 origin-left font-semibold transition-all duration-200',
          isSelect
            ? 'top-2 text-[.7rem] uppercase tracking-[.08em] text-white/60'
            : cn(
                'top-2 text-[.7rem] uppercase tracking-[.08em] text-white/60',
                as === 'textarea'
                  ? 'peer-placeholder-shown:top-4 peer-placeholder-shown:text-[.95rem] peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-placeholder-shown:text-white/55'
                  : 'peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-[.95rem] peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-placeholder-shown:text-white/55',
                'peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-[.7rem] peer-focus:uppercase peer-focus:tracking-[.08em] peer-focus:text-(--c-alt)',
              ),
        )}
      >
        {label}
      </label>
      {isSelect && (
        <svg viewBox="0 0 24 24" className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-white/60" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
          <path d="M6 9l6 6 6-6" />
        </svg>
      )}
      {error && <small id={`${id}-err`} role="alert" className="mt-1.5 block pl-1 text-[.78rem] font-semibold text-[#ffb3b3]">{error}</small>}
    </div>
  )
}

function DemoForm({ c }) {
  const empty = { name: '', phone: '', email: '', course: c.enquiryCourse || '', message: '' }
  const [v, setV] = useState(empty)
  const [errors, setErrors] = useState({})
  const [sent, setSent] = useState(false)
  const set = (k) => (e) => {
    let val = e.target.value
    if (k === 'name') val = val.replace(/[^A-Za-z .']/g, '').replace(/\s{2,}/g, ' ')
    if (k === 'phone') val = val.replace(/\D/g, '').slice(0, 10)
    setV((o) => ({ ...o, [k]: val }))
    if (errors[k]) setErrors((o) => ({ ...o, [k]: undefined }))
  }
  const onSubmit = (e) => {
    e.preventDefault()
    const errs = validateDemo(v)
    setErrors(errs)
    if (Object.keys(errs).length) return
    // Hook up to your backend / form service here
    setSent(true)
  }

  return (
    <div className="relative">
      {/* glow + offset frame behind the form */}
      <span className="absolute -inset-3 rounded-[32px] bg-[conic-gradient(from_180deg,var(--c),var(--c-alt),var(--c),var(--c-dark),var(--c))] opacity-25 blur-2xl" />
      <span className="absolute -right-3 -bottom-3 size-full rounded-[26px] border-2 border-(--c-alt)/40" />
      <div className="relative overflow-hidden rounded-[26px] bg-linear-150 from-(--c-deep) via-(--c-dark) to-(--c) px-9 py-10 text-white shadow-[0_30px_60px_-24px_rgba(0,0,0,.45)] max-sm:px-6 max-sm:py-8">
        <span className="pointer-events-none absolute -top-20 -right-20 size-56 rounded-full border-[36px] border-white/5" />

        {sent ? (
          <div className="relative flex min-h-[460px] flex-col items-center justify-center text-center" role="status">
            <span className="grid size-20 place-items-center rounded-full bg-white/10 ring-8 ring-white/5">
              <svg viewBox="0 0 24 24" className="size-10 text-(--c-alt)" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12.5l4.5 4.5L19 7" strokeDasharray="24" strokeDashoffset="24" className="animate-[draw-tick_.6s_.2s_ease_forwards]" />
              </svg>
            </span>
            <h3 className="mt-6 font-serif text-[2rem] font-semibold">Thank you, {v.name.trim().split(' ')[0]}!</h3>
            <p className="mt-2 max-w-[320px] text-white/80">Our counsellor will call you on <b className="text-white">{v.phone}</b> with the fees, batch timings and your free demo slot.</p>
            <button type="button" onClick={() => { setV(empty); setSent(false) }} className="mt-7 text-[.8rem] font-bold uppercase tracking-[.1em] text-(--c-alt) hover:text-white">
              Send another enquiry
            </button>
          </div>
        ) : (
          <form noValidate onSubmit={onSubmit} className="relative">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[.68rem] font-extrabold uppercase tracking-[.14em] text-(--c-alt)">
              <span className="size-1.5 animate-pulse rounded-full bg-(--c-alt)" /> Admissions open
            </span>
            <h3 className="mt-3 font-serif text-[2rem] font-semibold leading-[1.15]">Online Enquiry</h3>
            <p className="mt-1.5 mb-7 text-[.9rem] text-white/70">Fill in your details and our counsellor will get back to you shortly.</p>

            <div className="flex flex-col gap-4">
              <FloatField id={`${c.slug}-name`} label="Full Name *" icon="user" value={v.name} onChange={set('name')} error={errors.name} autoComplete="name" maxLength={60} />
              <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
                <FloatField id={`${c.slug}-phone`} label="Mobile Number *" icon="phone" type="tel" inputMode="numeric" value={v.phone} onChange={set('phone')} error={errors.phone} autoComplete="tel" />
                <FloatField id={`${c.slug}-email`} label="Email Address" icon="mail" type="email" value={v.email} onChange={set('email')} error={errors.email} autoComplete="email" />
              </div>
              <FloatField id={`${c.slug}-course`} label="Course *" icon="book" as="select" value={v.course} onChange={set('course')} error={errors.course}>
                <option value="">Select a course</option>
                {ENQUIRY_COURSES.map((x) => <option key={x}>{x}</option>)}
              </FloatField>
              <FloatField id={`${c.slug}-message`} label="Message (optional)" icon="chat" as="textarea" rows={3} value={v.message} onChange={set('message')} />
            </div>

            <button
              type="submit"
              className={cn(
                btn,
                'group relative mt-6 w-full overflow-hidden bg-white text-(--c-dark) hover:-translate-y-0.5 hover:bg-(--c-alt) hover:text-ink-dark hover:shadow-[0_14px_30px_-12px_rgba(242,183,5,.6)]',
                'after:absolute after:inset-y-0 after:-left-1/2 after:w-1/3 after:-skew-x-12 after:bg-linear-90 after:from-transparent after:via-white/70 after:to-transparent after:transition-[left] after:duration-700 hover:after:left-[120%]',
              )}
            >
              <span className="relative">Get My Free Demo</span>
              <span className="relative transition-transform duration-300 group-hover:translate-x-1.5" aria-hidden="true">→</span>
            </button>
            <p className="mt-3.5 flex items-center justify-center gap-2 text-[.76rem] text-white/60">
              <Icon name="shieldCheck" className="size-4" /> Your details are safe with us. No spam.
            </p>
          </form>
        )}
      </div>
    </div>
  )
}

const DEMO_STEPS = [
  { icon: 'fileCheck', title: 'Fill the form', text: 'Takes less than a minute.' },
  { icon: 'chat', title: 'Talk to a counsellor', text: 'We call you back to plan your batch.' },
  { icon: 'monitor', title: 'Attend a free demo', text: 'Experience a class before you join.' },
]

function Demo({ c }) {
  const [ref, inView] = useInView(0.35)
  return (
    <section id="enquiry" className="section-pad relative scroll-mt-[80px] overflow-hidden bg-ink-light">
      <span className="pointer-events-none absolute -top-32 -left-32 size-[440px] rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--c)_10%,transparent),transparent_70%)]" />
      <span className="pointer-events-none absolute right-[42%] bottom-12 size-[120px] animate-[floaty_8s_ease-in-out_infinite] rounded-full bg-[radial-gradient(color-mix(in_oklab,var(--c)_30%,transparent)_1.5px,transparent_1.5px)] bg-size-[12px_12px] max-lg:hidden" />

      <div className="wrap relative grid grid-cols-[1fr_1.05fr] items-center gap-16 max-lg:grid-cols-1 max-lg:gap-12">
        <div>
          <Reveal variant="left">
            <Eyebrow>Free Demo Class</Eyebrow>
            <H2>Book Your <em>Free Demo</em> for {c.name}</H2>
            <p className="max-w-[520px] text-ink-mid">Fill in the form and our counsellor will call you back with the course fees, batch timings and a free demo slot.</p>
          </Reveal>

          {/* steps: the connecting line draws in, then each step lights up */}
          <ol ref={ref} className="relative mt-9 flex flex-col gap-4">
            <span className="absolute top-8 bottom-8 left-[27px] w-0.5 bg-line" />
            <span
              className="absolute top-8 bottom-8 left-[27px] w-0.5 origin-top bg-linear-180 from-(--c) to-(--c-alt) transition-transform duration-[1400ms] ease-smooth"
              style={{ transform: `scaleY(${inView ? 1 : 0})` }}
            />
            {DEMO_STEPS.map((st, i) => (
              <li
                key={st.title}
                className="group relative flex items-center gap-5 rounded-2xl p-1 pr-4 transition duration-500"
                style={{ transitionDelay: `${0.25 + i * 0.4}s`, opacity: inView ? 1 : 0.35 }}
              >
                <span
                  className="relative grid size-14 shrink-0 place-items-center rounded-full border-2 transition-all duration-500"
                  style={{
                    transitionDelay: `${0.25 + i * 0.4}s`,
                    borderColor: inView ? 'var(--c)' : 'var(--color-line)',
                    background: inView ? 'var(--c)' : '#fff',
                    color: inView ? '#fff' : 'var(--c)',
                  }}
                >
                  <Icon name={st.icon} className="size-6" />
                  <span className="absolute -top-1 -right-1 grid size-5 place-items-center rounded-full bg-(--c-alt) text-[.65rem] font-extrabold text-ink-dark">{i + 1}</span>
                </span>
                <div className="flex-1 rounded-xl bg-white px-5 py-3.5 shadow-[0_6px_18px_-12px_rgba(11,37,69,.35)] transition duration-300 group-hover:translate-x-1 group-hover:shadow-soft">
                  <h4 className="text-[1.02rem] font-extrabold text-ink-dark">{st.title}</h4>
                  <p className="text-[.88rem] text-ink-mid">{st.text}</p>
                </div>
              </li>
            ))}
          </ol>

          <Reveal variant="left" delay=".2s" className="mt-8">
            <small className="text-[.72rem] font-extrabold uppercase tracking-[.14em] text-ink-mid">What you'll get</small>
            <div className="mt-3 flex flex-wrap gap-2.5">
              {['Course fees', 'Batch timings', 'Free demo slot', 'Career guidance'].map((t) => (
                <span key={t} className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-3.5 py-1.5 text-[.84rem] font-semibold text-ink-dark transition duration-300 hover:-translate-y-0.5 hover:border-(--c) hover:text-(--c)">
                  <span className="grid size-4 place-items-center rounded-full bg-(--c) text-white"><Tick className="size-2.5" /></span>
                  {t}
                </span>
              ))}
            </div>
          </Reveal>

          <Reveal variant="left" delay=".3s" className="mt-7">
            <a href={PHONE_HREF} className="group inline-flex items-center gap-4 rounded-2xl border border-line bg-white py-3 pr-6 pl-3 transition duration-300 hover:border-(--c) hover:shadow-soft">
              <span className="relative grid size-12 place-items-center rounded-xl bg-(--c) text-white">
                <span className="absolute inset-0 animate-[ring-pulse_2.2s_ease-out_infinite] rounded-xl" />
                <FieldIcon name="phone" />
              </span>
              <span>
                <small className="block text-[.7rem] font-bold uppercase tracking-[.1em] text-ink-mid">Prefer to talk? Call us</small>
                <b className="text-[1.1rem] font-extrabold text-ink-dark transition-colors group-hover:text-(--c)">{PHONE}</b>
                <small className="block text-[.74rem] text-ink-mid">{HOURS}</small>
              </span>
            </a>
          </Reveal>
        </div>

        <Reveal variant="right">
          <DemoForm key={c.slug} c={c} />
        </Reveal>
      </div>
    </section>
  )
}

/* ---------- 10. Related ---------- */
function Related({ c }) {
  const same = COURSE_DETAIL_LIST.filter((x) => x.slug !== c.slug && x.category === c.category)
  const list = [...same, ...COURSE_DETAIL_LIST.filter((x) => x.slug !== c.slug && x.category !== c.category)].slice(0, 3)
  return (
    <section className="section-pad bg-ink-light">
      <div className="wrap">
        <Reveal className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Eyebrow>Explore More</Eyebrow>
            <H2 className="mb-0">Related <em>Courses</em></H2>
          </div>
          <Link to="/courses" className={btnLine}>All Courses</Link>
        </Reveal>
        <div className="mt-10 grid grid-cols-3 gap-6 max-lg:grid-cols-2 max-sm:grid-cols-1">
          {list.map((x, i) => (
            <Reveal key={x.slug} delay={`${i * 0.08}s`} className="h-full">
              <Link
                to={`/courses/${x.slug}`}
                style={{ '--o': x.theme.c, '--o-dark': x.theme.dark }}
                className="group flex h-full flex-col overflow-hidden rounded-[16px] border border-line bg-white transition-all duration-400 ease-smooth hover:-translate-y-2 hover:border-(--o) hover:shadow-soft"
              >
                <div className="relative h-[180px] overflow-hidden">
                  <img src={x.photo} alt="" loading="lazy" className="size-full object-cover transition duration-700 ease-smooth group-hover:scale-110" />
                  <span className="absolute inset-0 bg-linear-180 from-transparent from-40% to-(--o-dark)/80" />
                  <span className="absolute bottom-3 left-4 rounded-[40px] bg-white/95 px-3 py-1 text-[.64rem] font-extrabold uppercase tracking-[.12em] text-(--o)">{x.level}</span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-serif text-[1.45rem] font-semibold leading-[1.2] text-ink-dark">{x.name}</h3>
                  <p className="mt-1 mb-4 text-[.86rem] text-ink-mid">{x.summary}</p>
                  <span className="mt-auto inline-flex items-center gap-2 text-[.78rem] font-bold uppercase tracking-[.08em] text-(--o)">
                    View Course <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function CourseDetailPage({ course: c }) {
  const { openEnquiry } = useEnquiry()
  const onEnquire = () => openEnquiry(c.enquiryCourse)

  useEffect(() => {
    document.title = `${c.metaTitle} | Mark Education Academy`
    const meta = document.querySelector('meta[name="description"]')
    const prev = meta?.getAttribute('content')
    meta?.setAttribute('content', c.summaryLong || c.intro[0])
    return () => prev != null && meta?.setAttribute('content', prev)
  }, [c])

  const { c: main, dark, deep, soft, alt } = c.theme
  return (
    <div key={c.slug} style={{ '--c': main, '--c-dark': dark, '--c-deep': deep, '--c-soft': soft, '--c-alt': alt }}>
      <Hero c={c} onEnquire={onEnquire} />
      <About c={c} />
      <Gallery c={c} />
      <Syllabus c={c} onEnquire={onEnquire} />
      <Projects c={c} />
      <Careers c={c} onEnquire={onEnquire} />
      <Audience c={c} onEnquire={onEnquire} />
      <Extras c={c} />
      <Levels c={c} />
      <WhyMark items={c.why} lead={c.whyLead} title={c.whyTitle} />
      <Closing c={c} onEnquire={onEnquire} />
      <Demo c={c} />
      <Related c={c} />
    </div>
  )
}
