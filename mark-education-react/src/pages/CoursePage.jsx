import { useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { CountUp } from '../components/Counter'
import { EnquiryForm } from '../components/Faq'
import { FillIcon, Icon, Reveal, cn } from '../components/ui'
import { PHONE, PHONE_HREF, WEBSITE } from '../data/content'
import { COURSE_PAGES, COURSE_PAGE_LIST, GOOGLE_RATING, SERVICES, YEARS_EXCELLENCE } from '../data/coursePages'
import { useInView } from '../hooks/useInView'
import { COURSE_DETAILS } from '../data/courseDetails'
import CourseDetailPage from './CourseDetailPage'

/* ---------- Themed building blocks (colours come from CSS vars set on the page root) ---------- */

const tBtn =
  'inline-flex items-center justify-center gap-2.5 whitespace-nowrap rounded px-[30px] py-3.5 text-[.85rem] font-bold uppercase tracking-[.08em] transition duration-300 ease-smooth'
const tBtnPrimary = `${tBtn} bg-(--c) text-white shadow-[0_10px_24px_-8px_var(--c)] hover:-translate-y-0.5 hover:bg-(--c-dark)`
const tBtnLine = `${tBtn} border border-ink text-ink-dark hover:border-ink-dark hover:bg-ink-dark hover:text-white`

function TEyebrow({ children, center, light }) {
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

function TTitle({ children, className, light, as: Tag = 'h2' }) {
  return (
    <Tag
      className={cn(
        'mt-3.5 mb-[18px] font-serif text-[length:clamp(2rem,4vw,3rem)] font-semibold leading-[1.15] [&_em]:italic',
        light ? 'text-white [&_em]:text-(--c-alt)' : 'text-ink-dark [&_em]:text-(--c)',
        className,
      )}
    >
      {children}
    </Tag>
  )
}

function Stars({ className }) {
  return <span className={cn('tracking-[2px] text-gold', className)}>★★★★★</span>
}

/** Gold "Certified 100%" shield, echoing the flyer badge. */
function CertifiedShield({ className }) {
  return (
    <svg viewBox="0 0 120 130" className={className} aria-hidden="true">
      <path d="M60 4 L108 22 V62 C108 94 86 116 60 126 C34 116 12 94 12 62 V22 Z" fill="#E8B33A" />
      <path d="M60 14 L98 28 V62 C98 88 81 106 60 115 C39 106 22 88 22 62 V28 Z" fill="#fff" />
      <path d="M60 20 L92 32 V62 C92 85 77 101 60 109 C43 101 28 85 28 62 V32 Z" fill="#E8B33A" />
      <path d="M44 34l2.4 5 5.4.6-4 3.7 1.1 5.3L44 46l-4.9 2.6 1.1-5.3-4-3.7 5.4-.6z M60 28l3 6.2 6.8.8-5 4.6 1.4 6.7L60 43l-6.2 3.3 1.4-6.7-5-4.6 6.8-.8z M76 34l2.4 5 5.4.6-4 3.7 1.1 5.3L76 46l-4.9 2.6 1.1-5.3-4-3.7 5.4-.6z" fill="#fff" />
      <rect x="2" y="54" width="116" height="24" rx="3" fill="#E8B33A" stroke="#fff" strokeWidth="3" />
      <text x="60" y="71.5" textAnchor="middle" fontFamily="Mulish, sans-serif" fontWeight="800" fontSize="15" fill="#fff" letterSpacing="1">CERTIFIED</text>
      <text x="60" y="98" textAnchor="middle" fontFamily="Mulish, sans-serif" fontWeight="800" fontSize="17" fill="#fff">100%</text>
    </svg>
  )
}

/** "18 Years of Excellence" mark with an arc that draws itself in. */
function YearsMark({ className }) {
  const [ref, inView] = useInView()
  return (
    <div ref={ref} className={cn('flex items-center gap-2', className)}>
      <div className="relative grid size-[62px] shrink-0 place-items-center">
        <svg viewBox="0 0 64 64" className="absolute inset-0 -rotate-[110deg]" aria-hidden="true">
          <circle
            cx="32" cy="32" r="29" fill="none" stroke="var(--c)" strokeWidth="3.5" strokeLinecap="round"
            strokeDasharray="182" strokeDashoffset={inView ? 55 : 182}
            style={{ transition: 'stroke-dashoffset 1.4s cubic-bezier(.25,.8,.25,1) .2s' }}
          />
        </svg>
        <b className="font-sans text-[1.7rem] font-extrabold leading-none text-(--c)">{YEARS_EXCELLENCE}</b>
      </div>
      <div className="text-[.78rem] font-extrabold uppercase leading-[1.15] tracking-[.06em] text-(--c-dark)">
        Years of<br />Excellence
      </div>
    </div>
  )
}

/* ---------- Sections ---------- */

function CourseHero({ course }) {
  const arch = course.photoShape === 'arch'
  return (
    <section className="relative overflow-hidden bg-linear-135 from-[#f7f8fa] to-(--c-soft) pt-12 pb-[130px] max-sm:pb-16">
      {/* soft diagonal light bands + halftone dots, as on the flyers */}
      <span className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(135deg,rgba(255,255,255,.55)_0_90px,transparent_90px_240px)] opacity-70" />
      <span className="pointer-events-none absolute top-24 left-[46%] size-[120px] animate-[floaty_7s_ease-in-out_infinite] rounded-full bg-[radial-gradient(color-mix(in_oklab,var(--c)_45%,transparent)_1.6px,transparent_1.6px)] bg-size-[11px_11px] max-lg:hidden" />
      <span className="pointer-events-none absolute top-40 left-[52%] size-16 animate-[floaty_5s_ease-in-out_infinite_.8s] rounded-full bg-(--c)/20 max-lg:hidden" />

      <div className="wrap relative z-[2] grid grid-cols-[1.05fr_1fr] items-center gap-16 max-lg:grid-cols-1 max-lg:gap-14">
        <Reveal variant="left">
          <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-2 text-[.8rem] font-semibold text-ink-mid">
            <Link to="/" className="hover:text-(--c)">Home</Link>
            <span className="text-line">/</span>
            <Link to="/#courses" className="hover:text-(--c)">Courses</Link>
            <span className="text-line">/</span>
            <span className="text-(--c)">{course.name}</span>
          </nav>

          <span className="inline-flex items-center gap-2 rounded-[40px] border border-(--c)/35 bg-white px-4 py-[7px] text-[.72rem] font-extrabold uppercase tracking-[.14em] text-(--c) before:size-[7px] before:rounded-full before:bg-(--c)">
            {course.partner}
          </span>

          <TTitle as="h1" className="mt-5 mb-4 text-[length:clamp(2.6rem,5.2vw,4.4rem)] leading-[1.05]">
            {course.title}
          </TTitle>
          <p className="mb-3 max-w-[540px] text-[1.12rem] font-semibold text-ink-dark">{course.tagline}</p>
          <p className="mb-8 max-w-[540px] text-ink-mid">{course.intro}</p>

          <div className="flex flex-wrap gap-3.5">
            <a href="#enquiry" className={tBtnPrimary}>Get Free Demo Class</a>
            <a href={course.brochureFile} download className={tBtnLine}>
              Download Brochure
            </a>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-5">
            <YearsMark />
            <span className="h-10 w-px bg-line max-sm:hidden" />
            <div>
              <div className="flex items-center gap-2">
                <b className="text-[1.6rem] font-extrabold leading-none text-gold">{GOOGLE_RATING}</b>
                <Stars className="text-[1rem]" />
              </div>
              <small className="text-[.78rem] font-bold uppercase tracking-[.08em] text-ink-mid">Google Reviews</small>
            </div>
            <span className="h-10 w-px bg-line max-sm:hidden" />
            <div className="flex items-center gap-2.5">
              <CertifiedShield className="h-12 w-auto" />
              <small className="text-[.78rem] font-bold uppercase leading-[1.25] tracking-[.08em] text-ink-mid">
                100%<br />Certified
              </small>
            </div>
          </div>
        </Reveal>

        <Reveal variant="right" className="relative mx-auto w-full max-w-[500px]">
          {arch ? (
            <div className="relative">
              <span className="absolute inset-0 translate-x-5 translate-y-5 rounded-[28px] border-2 border-(--c)/40" />
              <div className="relative overflow-hidden rounded-[28px] bg-white shadow-[0_30px_60px_-20px_rgba(11,37,69,.35)]">
                <img src={course.photo} alt={`${course.name} student`} className="aspect-[900/1165] w-full object-cover" />
              </div>
            </div>
          ) : (
            <div className="relative mx-auto aspect-square w-[92%]">
              <span className="absolute -inset-5 animate-[spin_40s_linear_infinite] rounded-full border-2 border-dashed border-(--c)/35" />
              <span className="absolute -inset-1.5 rounded-full bg-[conic-gradient(from_200deg,var(--c),transparent_45%,transparent_70%,var(--c))]" />
              <div className="relative size-full overflow-hidden rounded-full border-[10px] border-white bg-white shadow-[0_30px_60px_-20px_rgba(11,37,69,.4)]">
                <img src={course.photo} alt={`${course.name} classroom`} className="size-full scale-[1.14] object-cover" />
              </div>
            </div>
          )}

          <div className="absolute top-[12%] -left-8 flex animate-floaty items-center gap-3 rounded-xl bg-white px-4 py-3 shadow-card max-sm:-left-2">
            <CertifiedShield className="h-11 w-auto" />
            <div>
              <b className="block text-[.9rem] font-extrabold text-ink-dark">Certified 100%</b>
              <small className="text-[.72rem] text-ink-mid">On course completion</small>
            </div>
          </div>
          <div className="absolute -right-4 bottom-[10%] flex animate-[floaty_6s_ease-in-out_infinite_1s] items-center gap-3 rounded-xl bg-white px-4 py-3 shadow-card max-sm:-right-2">
            <span className="grid size-10 place-items-center rounded-full bg-(--c-soft) text-(--c)">
              <Icon name="sparkle" className="size-5" />
            </span>
            <div>
              <b className="block text-[.9rem] font-extrabold text-ink-dark">Free Demo Class</b>
              <small className="text-[.72rem] text-ink-mid">Register today</small>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function Services() {
  return (
    <section className="relative z-[6] -mt-[70px] max-sm:mt-0">
      <div className="wrap">
        <Reveal className="grid grid-cols-4 bg-white shadow-soft max-lg:grid-cols-2 max-sm:grid-cols-1">
          {SERVICES.map((s, i) => (
            <div
              key={s.title}
              className={cn(
                'group flex items-start gap-4 border-line px-7 py-8 transition duration-300 hover:bg-(--c)',
                i < 3 && 'border-r max-lg:border-r-0',
                i === 0 && 'max-lg:border-r',
                i === 2 && 'max-lg:border-r',
                i < 2 && 'max-lg:border-b',
                'max-sm:border-r-0 max-sm:border-b',
              )}
            >
              <span className="grid size-[50px] shrink-0 place-items-center rounded-full bg-(--c-soft) text-(--c) transition duration-300 group-hover:bg-white/15 group-hover:text-white">
                <Icon name={s.icon} />
              </span>
              <div>
                <h4 className="mb-1 font-serif text-[1.3rem] leading-[1.2] text-ink-dark group-hover:text-white">{s.title}</h4>
                <p className="text-[.86rem] text-ink-mid group-hover:text-white/85">{s.text}</p>
              </div>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  )
}

const FEATURES = [
  'Certificate on course completion',
  'Practical lab on an individual system',
  'Placement assistance & interview prep',
  'Morning, evening & weekend batches',
]

const ProgramLink = ({ href, ...rest }) => (href ? <Link to={href} {...rest} /> : <a href="#enquiry" {...rest} />)

function Programs({ course }) {
  return (
    <section className="section-pad">
      <div className="wrap grid grid-cols-[1.25fr_1fr] items-start gap-14 max-lg:grid-cols-1">
        <div>
          <Reveal>
            <TEyebrow>{course.name}</TEyebrow>
            <TTitle>{course.programsTitle}</TTitle>
          </Reveal>
          <ul className="mt-8 flex flex-col gap-3.5">
            {course.programs.map((p, i) => (
              <Reveal as="li" key={p.title} delay={`${i * 0.08}s`}>
                <ProgramLink
                  href={p.href}
                  className={cn(
                    'group relative flex items-center gap-5 overflow-hidden rounded-xl border border-line bg-white px-6 py-5 transition-all duration-350 ease-smooth',
                    'hover:translate-x-1.5 hover:border-(--c)/40 hover:shadow-soft',
                    'before:absolute before:inset-y-0 before:left-0 before:w-[3px] before:scale-y-0 before:bg-(--c) before:transition-transform before:duration-350 hover:before:scale-y-100',
                    'max-sm:gap-4 max-sm:px-4',
                  )}
                >
                  <span className="grid size-11 shrink-0 place-items-center rounded-lg border-2 border-(--c) bg-(--c) text-white shadow-[0_8px_18px_-8px_var(--c)] transition duration-300 group-hover:bg-white group-hover:text-(--c)">
                    <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M5 12.5l4.5 4.5L19 7" />
                    </svg>
                  </span>
                  <div className="flex-1">
                    <h3 className="font-serif text-[1.4rem] font-semibold leading-[1.2] text-ink-dark">{p.title}</h3>
                    <p className="mt-0.5 text-[.88rem] text-ink-mid">{p.text}</p>
                  </div>
                  <span className="font-serif text-[2.2rem] font-bold leading-none text-(--c)/15 max-sm:hidden">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </ProgramLink>
              </Reveal>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-6 lg:sticky lg:top-[110px]">
          <Reveal variant="right">
            <div className="relative overflow-hidden rounded-[18px] bg-linear-135 from-(--c-dark) to-(--c) px-8 py-9 text-white">
              <span className="absolute -top-16 -right-16 size-52 rounded-full border-[34px] border-white/8" />
              <span className="relative grid size-14 place-items-center rounded-full bg-white/15">
                <Icon name={course.highlight.icon} className="size-7" />
              </span>
              <h3 className="relative mt-5 font-serif text-[1.9rem] font-semibold leading-[1.15]">{course.highlight.title}</h3>
              <p className="relative mt-2 mb-6 text-white/80">{course.highlight.text}</p>
              <a href="#enquiry" className={cn(tBtn, 'relative bg-white text-(--c-dark) hover:bg-ink-dark hover:text-white')}>
                Register Now →
              </a>
            </div>
          </Reveal>

          {course.photo2 ? (
            <Reveal variant="right" className="overflow-hidden rounded-[18px] border-[6px] border-white shadow-soft">
              <img src={course.photo2} alt="Group learning session" loading="lazy" className="aspect-[4/3] w-full object-cover" />
            </Reveal>
          ) : (
            <Reveal variant="right" className="rounded-[18px] border border-line bg-ink-light p-7">
              <h4 className="mb-4 font-serif text-[1.4rem] font-semibold text-ink-dark">Every program includes</h4>
              <ul className="flex flex-col gap-3">
                {FEATURES.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-[.92rem] text-ink">
                    <span className="grid size-6 shrink-0 place-items-center rounded-full bg-(--c-soft) text-(--c)">
                      <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M5 12.5l4.5 4.5L19 7" />
                      </svg>
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  )
}

function Stats() {
  const items = [
    { value: YEARS_EXCELLENCE, suffix: '+', label: 'Years of Excellence' },
    { value: Number(GOOGLE_RATING), decimals: 1, suffix: '★', label: 'Google Rating' },
    { value: 100, suffix: '%', label: 'Certified Students' },
    { value: 2000, suffix: '+', label: 'Students Every Year' },
  ]
  return (
    <section className="relative overflow-hidden bg-(--c-dark) py-20 text-white">
      <span className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(135deg,rgba(255,255,255,.04)_0_80px,transparent_80px_200px)]" />
      <div className="wrap relative grid grid-cols-4 max-lg:grid-cols-2 max-lg:gap-y-[30px]">
        {items.map((c, i) => (
          <div
            key={c.label}
            className={cn('border-white/15 px-5 py-2.5 text-center', i < 3 && 'border-r', i === 1 && 'max-lg:border-r-0')}
          >
            <div className="font-serif text-[length:clamp(2.6rem,5vw,3.8rem)] font-semibold leading-none">
              <CountUp end={c.value} decimals={c.decimals} />
              <sup className="ml-1 text-[.45em] text-(--c-alt)">{c.suffix}</sup>
            </div>
            <p className="mt-2.5 text-[.8rem] uppercase tracking-[.18em] text-white/70">{c.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function Brochure({ course }) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <section className="section-pad relative overflow-hidden bg-ink-light">
      <span className="pointer-events-none absolute -top-24 -left-24 size-[420px] rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--c)_14%,transparent),transparent_70%)]" />
      <div className="wrap relative grid grid-cols-[1fr_.9fr] items-center gap-16 max-lg:grid-cols-1">
        <Reveal variant="left">
          <TEyebrow>Course Brochure</TEyebrow>
          <TTitle>Everything in <em>One Page</em></TTitle>
          <p className="max-w-[520px] text-ink-mid">
            Programs, services and certification details for the {course.name} course — save it, share it, or keep it handy for your counselling session.
          </p>

          <div className="mt-8 grid max-w-[520px] grid-cols-2 gap-4 max-sm:grid-cols-1">
            <a href={PHONE_HREF} className="group flex items-center gap-3.5 rounded-xl border border-line bg-white p-4 transition duration-300 hover:border-(--c)">
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-(--c-soft) text-(--c) transition group-hover:bg-(--c) group-hover:text-white">
                <FillIcon name="phone" className="size-[18px] fill-current" />
              </span>
              <div>
                <small className="block text-[.72rem] uppercase tracking-[.1em] text-ink-mid">Call us</small>
                <b className="text-[.98rem] text-ink-dark">{PHONE}</b>
              </div>
            </a>
            <a href={`https://${WEBSITE}`} target="_blank" rel="noreferrer" className="group flex items-center gap-3.5 rounded-xl border border-line bg-white p-4 transition duration-300 hover:border-(--c)">
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-(--c-soft) text-(--c) transition group-hover:bg-(--c) group-hover:text-white">
                <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
                  <circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 2.7 3.8 5.7 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3z" />
                </svg>
              </span>
              <div className="min-w-0">
                <small className="block text-[.72rem] uppercase tracking-[.1em] text-ink-mid">Website</small>
                <b className="block truncate text-[.92rem] text-ink-dark">{WEBSITE}</b>
              </div>
            </a>
          </div>

          <div className="mt-8 flex flex-wrap gap-3.5">
            <a href={course.brochureFile} download className={tBtnPrimary}>Download Brochure ↓</a>
            <button type="button" onClick={() => setOpen(true)} className={tBtnLine}>View Full Size</button>
          </div>
        </Reveal>

        <Reveal variant="right" className="relative mx-auto w-full max-w-[400px]">
          <span className="absolute inset-0 rotate-6 rounded-[18px] bg-(--c)/20" />
          <span className="absolute inset-0 -rotate-3 rounded-[18px] bg-white shadow-soft" />
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label={`View ${course.name} brochure`}
            className="group relative block w-full cursor-zoom-in overflow-hidden rounded-[18px] border-[6px] border-white shadow-[0_30px_60px_-20px_rgba(11,37,69,.35)] transition duration-500 ease-smooth hover:-translate-y-2 hover:rotate-1"
          >
            <img src={course.brochure} alt={`${course.name} course brochure`} loading="lazy" className="w-full" />
            <span className="absolute inset-0 grid place-items-center bg-brand-deep/0 transition duration-300 group-hover:bg-brand-deep/35">
              <span className="translate-y-3 rounded-full bg-white px-5 py-2.5 text-[.8rem] font-bold uppercase tracking-[.08em] text-ink-dark opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                Click to enlarge
              </span>
            </span>
          </button>
        </Reveal>
      </div>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${course.name} brochure`}
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-[200] flex animate-[rise_.3s_ease_both] justify-center overflow-y-auto bg-brand-deep/85 p-6 backdrop-blur-sm"
        >
          <button
            type="button"
            aria-label="Close"
            onClick={() => setOpen(false)}
            className="fixed top-5 right-5 grid size-11 place-items-center rounded-full bg-white text-xl text-ink-dark shadow-card hover:bg-(--c) hover:text-white"
          >
            ×
          </button>
          <img
            src={course.brochureFile}
            alt={`${course.name} course brochure`}
            onClick={(e) => e.stopPropagation()}
            className="h-max w-full max-w-[640px] rounded-xl shadow-2xl"
          />
        </div>
      )}
    </section>
  )
}

const STEPS = [
  { title: 'Fill the form', text: 'Takes less than a minute.' },
  { title: 'Talk to a counsellor', text: 'We call you back to plan your batch.' },
  { title: 'Attend a free demo', text: 'Experience a class before you join.' },
]

function Enquiry({ course }) {
  return (
    <section id="enquiry" className="section-pad bg-white">
      <div className="wrap grid grid-cols-[1.1fr_1fr] items-start gap-[60px] max-lg:grid-cols-1 max-lg:gap-[50px]">
        <Reveal>
          <TEyebrow>Admissions Open</TEyebrow>
          <TTitle>Register Now &amp; Get a <em>Free Demo Class</em></TTitle>
          <p className="max-w-[520px] text-ink-mid">
            Limited seats in every batch. Book your free demo for the {course.name} course and see our practical training method first-hand.
          </p>
          <ol className="mt-9 flex flex-col">
            {STEPS.map((s, i) => (
              <li key={s.title} className="relative flex gap-5 pb-8 last:pb-0">
                {i < STEPS.length - 1 && <span className="absolute top-12 bottom-0 left-[23px] w-px bg-line" />}
                <span className="relative grid size-12 shrink-0 place-items-center rounded-full border-2 border-(--c) bg-white font-serif text-[1.3rem] font-bold text-(--c)">
                  {i + 1}
                </span>
                <div className="pt-1.5">
                  <h4 className="text-[1.05rem] font-extrabold text-ink-dark">{s.title}</h4>
                  <p className="text-[.9rem] text-ink-mid">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </Reveal>
        <EnquiryForm key={course.slug} defaultCourse={course.enquiryCourse} className="bg-(color:--c-dark)" />
      </div>
    </section>
  )
}

function OtherCourses({ current }) {
  const others = COURSE_PAGE_LIST.filter((c) => c.slug !== current)
  return (
    <section className="section-pad bg-ink-light">
      <div className="wrap">
        <Reveal className="text-center">
          <TEyebrow center>Explore More</TEyebrow>
          <TTitle>Other Popular <em>Courses</em></TTitle>
        </Reveal>
        <div className="mt-10 grid grid-cols-2 gap-7 max-lg:grid-cols-1">
          {others.map((c, i) => (
            <Reveal key={c.slug} delay={`${i * 0.1}s`}>
              <Link
                to={`/courses/${c.slug}`}
                style={{ '--o': c.theme.c }}
                className="group flex h-full items-center gap-6 overflow-hidden rounded-[18px] border border-line bg-white p-5 transition-all duration-400 ease-smooth hover:-translate-y-1.5 hover:border-(--o) hover:shadow-soft max-sm:flex-col max-sm:items-start"
              >
                <div className="size-[120px] shrink-0 overflow-hidden rounded-xl bg-ink-light max-sm:h-[180px] max-sm:w-full">
                  <img src={c.photo} alt="" loading="lazy" className="size-full object-cover transition duration-700 ease-smooth group-hover:scale-110" />
                </div>
                <div className="flex-1">
                  <small className="text-[.7rem] font-extrabold uppercase tracking-[.14em] text-(--o)">{c.partner}</small>
                  <h3 className="mt-1 font-serif text-[1.6rem] font-semibold leading-[1.15] text-ink-dark">{c.navLabel}</h3>
                  <p className="mt-1 text-[.88rem] text-ink-mid">{c.programs.length} programs · Certified training</p>
                  <span className="mt-3 inline-flex items-center gap-2 text-[.8rem] font-bold uppercase tracking-[.08em] text-(--o)">
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

/** /courses/:slug: a single-course detail page if one exists, else the flyer-style family page (Excel, Tally Prime). */
export default function CoursePage() {
  const { slug } = useParams()
  const detail = COURSE_DETAILS[slug]
  return detail ? <CourseDetailPage key={slug} course={detail} /> : <FlyerCoursePage key={slug} slug={slug} />
}

function FlyerCoursePage({ slug }) {
  const course = COURSE_PAGES[slug]

  useEffect(() => {
    if (course) document.title = `${course.metaTitle} | Mark Education Academy`
  }, [course])

  if (!course) return <Navigate to="/" replace />

  const { c, dark, soft, alt } = course.theme
  return (
    // key: remount (and replay animations) when switching between course pages
    <div key={slug} style={{ '--c': c, '--c-dark': dark, '--c-soft': soft, '--c-alt': alt }}>
      <CourseHero course={course} />
      <Services />
      <Programs course={course} />
      <Stats />
      <Brochure course={course} />
      <Enquiry course={course} />
      <OtherCourses current={slug} />
    </div>
  )
}
