import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Cta from '../components/Cta'
import Faq from '../components/Faq'
import { useEnquiry } from '../components/EnquiryProvider'
import PageBanner from '../components/PageBanner'
import { Eyebrow, Icon, Lead, Reveal, SmartLink, Title, cn } from '../components/ui'
import { COURSE_TABS, coursePageFor, enquiryCourseFor } from '../data/content'
import { COURSE_PAGE_LIST } from '../data/coursePages'
import { COURSE_DETAILS, detailSlugFor } from '../data/courseDetails'

const BANNER = 'https://images.unsplash.com/photo-1722573783625-eceb04251036?auto=format&fit=crop&w=1800&q=70'

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
              <article
                style={{ '--o': c.theme.c, '--o-dark': c.theme.dark }}
                className="group relative flex h-full flex-col overflow-hidden rounded-[18px] border border-line bg-white transition-all duration-400 ease-smooth hover:-translate-y-2 hover:border-(--o) hover:shadow-[0_24px_50px_-20px_rgba(11,37,69,.35)]"
              >
                {/* whole card opens the course overview; program lines below open their own detail page */}
                <Link to={`/courses/${c.slug}`} className="absolute inset-0 z-[1]" aria-label={`View ${c.navLabel}`} />
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
                        {p.href ? (
                          <Link
                            to={p.href}
                            className="relative z-[2] inline-flex items-center gap-1 underline decoration-transparent underline-offset-4 transition-colors hover:text-(--o) hover:decoration-current [&:hover>span]:translate-x-0.5 [&:hover>span]:opacity-100"
                          >
                            {p.title}
                            <span className="text-[.8rem] opacity-0 transition duration-200" aria-hidden="true">→</span>
                          </Link>
                        ) : (
                          p.title
                        )}
                      </li>
                    ))}
                  </ul>
                  <span className="mt-auto inline-flex items-center gap-2 text-[.8rem] font-bold uppercase tracking-[.08em] text-(--o)">
                    View Course <span className="transition-transform duration-300 group-hover:translate-x-1.5">→</span>
                  </span>
                </div>
              </article>
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
  const { openEnquiry } = useEnquiry()
  const tabsRef = useRef(null)
  const [pill, setPill] = useState(null)

  // /courses#accounts etc. pre-selects that category
  useEffect(() => {
    const id = hash.slice(1)
    if (COURSE_TABS.some((t) => t.id === id)) setFilter(id)
  }, [hash])

  // sliding pill behind the active filter
  useLayoutEffect(() => {
    const measure = () => {
      const el = tabsRef.current?.querySelector('[aria-selected="true"]')
      if (el) setPill({ left: el.offsetLeft, top: el.offsetTop, width: el.offsetWidth, height: el.offsetHeight })
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [filter])

  const list = useMemo(() => (filter === 'all' ? ALL : ALL.filter((c) => c.cat === filter)), [filter])
  const filters = [{ id: 'all', tab: 'All Courses' }, ...COURSE_TABS]

  return (
    <section id="catalogue" className="section-pad relative overflow-hidden bg-ink-light">
      {/* anchor targets for /courses#<category> */}
      {COURSE_TABS.map((t) => (
        <span key={t.id} id={t.id} className="absolute top-0 scroll-mt-[72px]" />
      ))}
      <span className="pointer-events-none absolute top-24 -left-44 size-[420px] animate-[floaty_9s_ease-in-out_infinite] rounded-full bg-[radial-gradient(circle,rgba(0,89,168,.09),transparent_70%)]" />
      <span className="pointer-events-none absolute -right-40 bottom-10 size-[380px] animate-[floaty_11s_ease-in-out_infinite_1s] rounded-full bg-[radial-gradient(circle,rgba(242,183,5,.10),transparent_70%)]" />

      <div className="wrap relative">
        <Reveal className="text-center">
          <Eyebrow center>Course Catalogue</Eyebrow>
          <Title><em>Job-Oriented</em> Courses</Title>
          <Lead center>Every course includes hands-on practical training, an ISO-certified certificate and placement assistance.</Lead>
        </Reveal>

        <Reveal className="mt-10 mb-12 flex justify-center">
          <div ref={tabsRef} role="tablist" className="relative flex flex-wrap justify-center gap-2 rounded-[40px] bg-white p-1.5 shadow-soft max-md:rounded-2xl">
            {pill && (
              <span
                aria-hidden="true"
                className="absolute rounded-[40px] bg-brand shadow-[0_8px_20px_rgba(0,89,168,.32)] transition-all duration-500 ease-smooth"
                style={pill}
              />
            )}
            {filters.map((f) => {
              const on = f.id === filter
              return (
                <button
                  key={f.id}
                  role="tab"
                  aria-selected={on}
                  onClick={() => setFilter(f.id)}
                  className={cn(
                    'relative z-[1] rounded-[40px] px-5 py-2.5 text-[.86rem] font-bold transition-colors duration-300',
                    on ? 'text-white' : 'text-ink-mid hover:text-brand',
                  )}
                >
                  {f.tab}
                </button>
              )
            })}
          </div>
        </Reveal>

        <div className="grid grid-cols-3 gap-7 max-lg:grid-cols-2 max-sm:grid-cols-1">
          {list.map((c, i) => {
            const page = coursePageFor(c.title)
            const photo = COURSE_DETAILS[detailSlugFor(c.title)]?.photo || COURSE_TABS.find((t) => t.id === c.cat)?.image
            // courses with a detail page link to it; the rest open the enquiry popup
            const Card = page ? SmartLink : 'button'
            const cardProps = page
              ? { href: page }
              : { type: 'button', 'aria-haspopup': 'dialog', onClick: () => openEnquiry(enquiryCourseFor(c.title)) }
            return (
              <Card
                key={`${filter}-${c.title}`}
                {...cardProps}
                style={{ animationDelay: `${i * 70}ms` }}
                className={cn(
                  'group relative flex w-full animate-rise flex-col overflow-hidden rounded-[18px] border border-line bg-white text-left [animation-fill-mode:both]',
                  'transition-[translate,box-shadow,border-color] duration-400 ease-smooth hover:-translate-y-2 hover:border-brand/30 hover:shadow-[0_28px_55px_-24px_rgba(11,37,69,.4)]',
                  'after:absolute after:bottom-0 after:left-0 after:h-[3px] after:w-full after:origin-left after:scale-x-0 after:bg-linear-90 after:from-brand after:to-gold after:transition-transform after:duration-500 hover:after:scale-x-100',
                )}
              >
                {/* photo header */}
                <div className="relative h-[180px] overflow-hidden bg-brand-soft">
                  {photo && (
                    <img src={photo} alt="" loading="lazy" className="size-full object-cover transition duration-700 ease-smooth group-hover:scale-110" />
                  )}
                  <span className="absolute inset-0 bg-linear-180 from-brand-deep/5 via-brand-deep/20 to-brand-deep/75 transition-opacity duration-500 group-hover:opacity-90" />
                  {/* light sweep on hover */}
                  <span className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-white/25 opacity-0 blur-sm transition-[left,opacity] duration-700 ease-smooth group-hover:left-[120%] group-hover:opacity-100" />
                  <span className="absolute top-4 left-4 rounded-[20px] bg-white/95 px-2.5 py-1 text-[.62rem] font-extrabold uppercase tracking-[.12em] text-brand backdrop-blur">
                    {c.catLabel}
                  </span>
                  <span className="absolute top-4 right-4 rounded-[20px] bg-gold px-2.5 py-1 text-[.64rem] font-extrabold uppercase tracking-[.08em] text-brand-deep">
                    {c.level}
                  </span>
                </div>

                {/* floating icon */}
                <span className="absolute top-[152px] left-6 grid size-14 place-items-center rounded-2xl border-4 border-white bg-brand text-white shadow-[0_10px_22px_-8px_rgba(0,89,168,.6)] transition duration-500 ease-smooth group-hover:-translate-y-1 group-hover:rotate-[-8deg] group-hover:bg-brand-dark">
                  <Icon name={c.icon} className="size-6" />
                </span>

                <div className="flex flex-1 flex-col px-6 pt-10 pb-6">
                  <h3 className="font-serif text-[1.45rem] font-semibold leading-[1.2] text-ink-dark transition-colors duration-300 group-hover:text-brand">{c.title}</h3>
                  <p className="mt-1.5 mb-5 text-[.88rem] text-ink-mid">{c.text}</p>
                  <div className="mt-auto flex items-center justify-between border-t border-line pt-4">
                    <span className="inline-flex items-center gap-1.5 text-[.76rem] font-bold text-ink">
                      <Icon name="award" className="size-4 text-brand" /> Certificate
                    </span>
                    <span className="inline-flex items-center gap-2.5 text-[.76rem] font-bold uppercase tracking-[.08em] text-brand">
                      {page ? 'View Details' : 'Enquire Now'}
                      <span className="grid size-8 place-items-center rounded-full border border-brand/30 transition duration-300 group-hover:translate-x-1 group-hover:border-brand group-hover:bg-brand group-hover:text-white">
                        →
                      </span>
                    </span>
                  </div>
                </div>
              </Card>
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
