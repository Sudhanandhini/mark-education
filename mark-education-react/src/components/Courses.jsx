import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { COURSE_TABS } from '../data/content'
import { coursePageFor } from '../data/content'
import { Eyebrow, Icon, Lead, Pill, Reveal, SmartLink, Title, btn, cn } from './ui'

function CourseItem({ course, index }) {
  return (
    <SmartLink
      href={coursePageFor(course.title) || '#enquiry'}
      style={{ animationDelay: `${index * 90 + 120}ms`, animationDuration: '.55s' }}
      className={cn(
        'group relative flex animate-rise items-center gap-[18px] overflow-hidden rounded-xl border border-line bg-white px-[22px] py-5',
        'transition-all duration-350 ease-smooth hover:translate-x-1.5 hover:border-[#cfdcea] hover:shadow-soft',
        'before:absolute before:inset-y-0 before:left-0 before:w-[3px] before:scale-y-0 before:bg-brand before:transition-transform before:duration-350 before:ease-smooth hover:before:scale-y-100',
        'max-sm:gap-3.5 max-sm:p-4',
      )}
    >
      <span className="grid size-[52px] shrink-0 place-items-center rounded-xl bg-brand-soft text-brand transition duration-300 group-hover:bg-brand group-hover:text-white">
        <Icon name={course.icon} />
      </span>
      <div className="flex-1">
        <h3 className="font-serif text-[1.35rem] font-semibold leading-[1.2] text-ink-dark">{course.title}</h3>
        <p className="mt-[3px] mb-2 text-[.86rem] text-ink-mid">{course.text}</p>
        <div className="flex flex-wrap gap-2">
          {[course.level, 'Certificate', 'Practical'].map((chip, i) => (
            <span
              key={chip}
              className={cn(
                'rounded-[20px] px-2.5 py-[3px] text-[.7rem] font-bold tracking-[.04em]',
                i === 0 ? 'bg-brand-soft text-brand' : 'bg-ink-light text-ink',
              )}
            >
              {chip}
            </span>
          ))}
        </div>
      </div>
      <span className="grid size-10 shrink-0 place-items-center rounded-full border border-line text-ink-dark transition-all duration-350 group-hover:-rotate-45 group-hover:border-brand group-hover:bg-brand group-hover:text-white max-sm:hidden">
        &#8594;
      </span>
    </SmartLink>
  )
}

function Panel({ tab }) {
  // Zoom the feature image out after mount for a subtle Ken Burns effect
  const [zoomed, setZoomed] = useState(true)
  useEffect(() => {
    const t = setTimeout(() => setZoomed(false), 30)
    return () => clearTimeout(t)
  }, [])
  const count = tab.courses.length

  return (
    <div role="tabpanel" className="grid grid-cols-[.9fr_1.1fr] items-stretch gap-7 max-lg:grid-cols-1">
      <div className="relative min-h-[440px] animate-rise overflow-hidden rounded-[14px] bg-brand-deep max-lg:min-h-[320px]">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-[6s] ease-out"
          style={{ backgroundImage: `url('${tab.image}')`, transform: zoomed ? 'scale(1.08)' : 'scale(1)' }}
        />
        <div className="absolute inset-0 bg-linear-180 from-[rgba(11,37,69,.1)] from-20% to-[rgba(11,37,69,.92)]" />
        <div className="absolute top-6 right-6 z-[2] grid size-[84px] animate-[floaty_5s_ease-in-out_infinite] place-items-center rounded-full bg-white text-center text-[.62rem] font-extrabold uppercase leading-[1.3] tracking-[.1em] text-brand">
          <div>
            <b className="block font-serif text-[1.3rem] tracking-normal text-ink-dark">{count}</b>
            {count === 1 ? 'Course' : 'Courses'}
          </div>
        </div>
        <div className="absolute inset-x-8 bottom-8 z-[2] text-white max-sm:inset-x-[22px] max-sm:bottom-[22px]">
          <Pill className="border-white/35 bg-white/12 text-white backdrop-blur-[6px] before:bg-white">{tab.tab}</Pill>
          <h3 className="mt-4 mb-2 font-serif text-[2.2rem] font-semibold leading-[1.1] max-sm:text-[1.8rem]">{tab.heading}</h3>
          <p className="mb-[22px] text-[.92rem] text-[#c9d7e6]">{tab.blurb}</p>
          <a href="#enquiry" className={cn(btn, 'bg-white text-brand-deep hover:bg-brand hover:text-white')}>
            Enquire Now &#8594;
          </a>
        </div>
      </div>
      <div className="flex flex-col gap-3.5">
        {tab.courses.map((c, i) => (
          <CourseItem key={c.title} course={c} index={i} />
        ))}
      </div>
    </div>
  )
}

export default function Courses() {
  const [active, setActive] = useState(COURSE_TABS[0].id)
  const btnRefs = useRef({})
  const [ink, setInk] = useState({ left: 6, width: 0 })

  const moveInk = () => {
    const b = btnRefs.current[active]
    if (b) setInk({ left: b.offsetLeft, width: b.offsetWidth })
  }

  useLayoutEffect(moveInk, [active])

  useEffect(() => {
    document.fonts?.ready.then(moveInk)
    window.addEventListener('resize', moveInk)
    return () => window.removeEventListener('resize', moveInk)
  })

  const tab = COURSE_TABS.find((t) => t.id === active)

  return (
    <section id="courses" className="section-pad relative overflow-hidden bg-ink-light">
      <span className="pointer-events-none absolute top-[120px] -left-[180px] size-[420px] rounded-full bg-[radial-gradient(circle,rgba(0,89,168,.08),transparent_70%)]" />
      <div className="wrap relative">
        <Reveal className="flex flex-wrap items-end justify-between gap-[30px]">
          <div>
            <Eyebrow>Our Courses</Eyebrow>
            <Title className="mb-0">
              Programs Designed
              <br />
              for <em>Your Career</em>
            </Title>
          </div>
          <div className="max-w-[430px]">
            <Lead>Choose from 15 job-oriented courses — each delivered with hands-on practical training and certification.</Lead>
            <SmartLink href="/courses" className="group mt-3 inline-flex items-center gap-2 text-[.82rem] font-bold uppercase tracking-[.08em] text-brand">
              View All Courses <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </SmartLink>
          </div>
        </Reveal>

        <Reveal className="mt-11 mb-9 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div role="tablist" className="relative inline-flex gap-1 whitespace-nowrap rounded-[50px] border border-line bg-white p-1.5">
            <span
              className="absolute inset-y-1.5 rounded-[40px] bg-brand shadow-[0_6px_18px_rgba(0,89,168,.3)] transition-[left,width] duration-450 ease-smooth"
              style={{ left: ink.left, width: ink.width }}
            />
            {COURSE_TABS.map((t) => {
              const on = t.id === active
              return (
                <button
                  key={t.id}
                  ref={(el) => (btnRefs.current[t.id] = el)}
                  role="tab"
                  aria-selected={on}
                  onClick={(e) => {
                    setActive(t.id)
                    e.currentTarget.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' })
                  }}
                  className={cn(
                    'relative z-[1] rounded-[40px] px-6 py-[11px] text-[.88rem] font-bold transition-colors duration-350',
                    'max-sm:px-4 max-sm:py-2.5 max-sm:text-[.82rem]',
                    on ? 'text-white' : 'text-ink-mid hover:text-ink-dark',
                  )}
                >
                  {t.tab}
                  <span
                    className={cn(
                      'ml-2 inline-grid h-[22px] min-w-[22px] place-items-center rounded-[20px] px-1.5 text-[.72rem] transition duration-350',
                      on ? 'bg-white/20 text-white' : 'bg-brand-soft text-brand',
                    )}
                  >
                    {t.courses.length}
                  </span>
                </button>
              )
            })}
          </div>
        </Reveal>

        <Panel key={tab.id} tab={tab} />
      </div>
    </section>
  )
}
