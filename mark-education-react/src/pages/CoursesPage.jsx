import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Cta from '../components/Cta'
import Faq from '../components/Faq'
import PageBanner from '../components/PageBanner'
import { Eyebrow, Icon, Lead, Reveal, SmartLink, Title, cn } from '../components/ui'
import { COURSE_TABS, coursePageFor } from '../data/content'
import { COURSE_PAGE_LIST } from '../data/coursePages'

const BANNER = 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1800&q=70'

const ALL = COURSE_TABS.flatMap((t) => t.courses.map((c) => ({ ...c, cat: t.id, catLabel: t.tab })))

function Featured() {
  return (
    <section className="section-pad bg-white">
      <div className="wrap">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Eyebrow>Featured Programs</Eyebrow>
            <Title className="mb-0">Our Most <em>Popular</em> Courses</Title>
          </div>
          <Lead className="max-w-[420px]">Certified programs with dedicated pages — explore the curriculum, download the brochure and book a free demo.</Lead>
        </Reveal>

        <div className="mt-12 grid grid-cols-3 gap-7 max-lg:grid-cols-2 max-sm:grid-cols-1">
          {COURSE_PAGE_LIST.map((c, i) => (
            <Reveal key={c.slug} delay={`${i * 0.1}s`} className="h-full">
              <Link
                to={`/courses/${c.slug}`}
                style={{ '--o': c.theme.c, '--o-dark': c.theme.dark }}
                className="group flex h-full flex-col overflow-hidden rounded-[18px] border border-line bg-white transition-all duration-400 ease-smooth hover:-translate-y-2 hover:border-(--o) hover:shadow-[0_24px_50px_-20px_rgba(11,37,69,.35)]"
              >
                <div className="relative h-[230px] overflow-hidden bg-ink-light">
                  <img src={c.photo} alt="" loading="lazy" className="size-full object-cover object-top transition duration-700 ease-smooth group-hover:scale-110" />
                  <span className="absolute inset-0 bg-linear-180 from-transparent from-40% to-(--o-dark)/85" />
                  <span className="absolute bottom-4 left-5 rounded-[40px] bg-white/95 px-3 py-1 text-[.64rem] font-extrabold uppercase tracking-[.12em] text-(--o)">
                    {c.programs.length} Programs
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <small className="text-[.68rem] font-extrabold uppercase tracking-[.12em] text-(--o)">{c.partner}</small>
                  <h3 className="mt-1.5 font-serif text-[1.7rem] font-semibold leading-[1.15] text-ink-dark">{c.navLabel}</h3>
                  <ul className="mt-3 mb-5 flex flex-col gap-1.5">
                    {c.programs.slice(0, 3).map((p) => (
                      <li key={p.title} className="flex items-center gap-2 text-[.86rem] text-ink-mid">
                        <span className="size-1.5 shrink-0 rounded-full bg-(--o)" />
                        {p.title}
                      </li>
                    ))}
                  </ul>
                  <span className="mt-auto inline-flex items-center gap-2 text-[.8rem] font-bold uppercase tracking-[.08em] text-(--o)">
                    View Course <span className="transition-transform duration-300 group-hover:translate-x-1.5">→</span>
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

function Catalogue() {
  const { hash } = useLocation()
  const [filter, setFilter] = useState('all')

  // /courses#accounts etc. pre-selects that category
  useEffect(() => {
    const id = hash.slice(1)
    if (COURSE_TABS.some((t) => t.id === id)) setFilter(id)
  }, [hash])

  const list = useMemo(() => (filter === 'all' ? ALL : ALL.filter((c) => c.cat === filter)), [filter])
  const filters = [{ id: 'all', tab: 'All Courses', count: ALL.length }, ...COURSE_TABS.map((t) => ({ ...t, count: t.courses.length }))]

  return (
    <section id="catalogue" className="section-pad relative overflow-hidden bg-ink-light">
      {/* anchor targets for /courses#<category> */}
      {COURSE_TABS.map((t) => (
        <span key={t.id} id={t.id} className="absolute top-0 scroll-mt-[72px]" />
      ))}
      <span className="pointer-events-none absolute top-24 -left-44 size-[420px] rounded-full bg-[radial-gradient(circle,rgba(0,89,168,.08),transparent_70%)]" />

      <div className="wrap relative">
        <Reveal className="text-center">
          <Eyebrow center>Course Catalogue</Eyebrow>
          <Title>All {ALL.length} <em>Job-Oriented</em> Courses</Title>
          <Lead center>Every course includes hands-on practical training, an ISO-certified certificate and placement assistance.</Lead>
        </Reveal>

        <Reveal className="mt-10 mb-10 flex justify-center">
          <div className="flex flex-wrap justify-center gap-2" role="tablist">
            {filters.map((f) => {
              const on = f.id === filter
              return (
                <button
                  key={f.id}
                  role="tab"
                  aria-selected={on}
                  onClick={() => setFilter(f.id)}
                  className={cn(
                    'rounded-[40px] border px-5 py-2.5 text-[.86rem] font-bold transition-all duration-300',
                    on
                      ? 'border-brand bg-brand text-white shadow-[0_8px_20px_rgba(0,89,168,.3)]'
                      : 'border-line bg-white text-ink-mid hover:border-brand hover:text-brand',
                  )}
                >
                  {f.tab}
                  <span className={cn('ml-2 rounded-[20px] px-1.5 py-px text-[.7rem]', on ? 'bg-white/20' : 'bg-brand-soft text-brand')}>{f.count}</span>
                </button>
              )
            })}
          </div>
        </Reveal>

        <div className="grid grid-cols-3 gap-6 max-lg:grid-cols-2 max-sm:grid-cols-1">
          {list.map((c, i) => {
            const page = coursePageFor(c.title)
            return (
              <SmartLink
                key={`${filter}-${c.title}`}
                href={page || '#enquiry'}
                style={{ animationDelay: `${i * 60}ms` }}
                className={cn(
                  'group relative flex animate-rise flex-col overflow-hidden rounded-[14px] border border-line bg-white p-6 transition-all duration-350 ease-smooth',
                  'hover:-translate-y-1.5 hover:border-brand/40 hover:shadow-soft',
                  'after:absolute after:bottom-0 after:left-0 after:h-[3px] after:w-full after:origin-left after:scale-x-0 after:bg-brand after:transition-transform after:duration-500 hover:after:scale-x-100',
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="grid size-[52px] place-items-center rounded-xl bg-brand-soft text-brand transition duration-300 group-hover:bg-brand group-hover:text-white">
                    <Icon name={c.icon} />
                  </span>
                  <span className="rounded-[20px] bg-ink-light px-2.5 py-1 text-[.66rem] font-bold uppercase tracking-[.08em] text-ink-mid">{c.catLabel}</span>
                </div>
                <h3 className="mt-5 font-serif text-[1.45rem] font-semibold leading-[1.2] text-ink-dark">{c.title}</h3>
                <p className="mt-1.5 mb-5 text-[.88rem] text-ink-mid">{c.text}</p>
                <div className="mt-auto flex items-center justify-between">
                  <div className="flex gap-1.5">
                    <span className="rounded-[20px] bg-brand-soft px-2.5 py-[3px] text-[.7rem] font-bold text-brand">{c.level}</span>
                    <span className="rounded-[20px] bg-ink-light px-2.5 py-[3px] text-[.7rem] font-bold text-ink">Certificate</span>
                  </div>
                  <span className="text-[.76rem] font-bold uppercase tracking-[.08em] text-brand">
                    {page ? 'Details' : 'Enquire'} <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </span>
                </div>
              </SmartLink>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default function CoursesPage() {
  useEffect(() => {
    document.title = 'Courses | Mark Education Academy'
  }, [])

  return (
    <>
      <PageBanner
        crumb="Courses"
        eyebrow="Our Courses"
        title={<>Programs Designed for <em>Your Career</em></>}
        text="Computer, accounting, analytics and ERP courses — practical, certified and taught by experienced industry trainers."
        image={BANNER}
      />
      <Featured />
      <Catalogue />
      <Faq />
      <Cta />
    </>
  )
}
