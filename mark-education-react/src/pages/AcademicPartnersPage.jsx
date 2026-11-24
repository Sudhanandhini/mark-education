import { useEffect } from 'react'
import Cta from '../components/Cta'
import { useEnquiry } from '../components/EnquiryProvider'
import PageBanner from '../components/PageBanner'
import Partners from '../components/Partners'
import { Eyebrow, Ic, Icon, Lead, Reveal, SmartLink, Title, btn, cn } from '../components/ui'

const BANNER = 'https://images.unsplash.com/photo-1756885427018-86c8c5969c5b?auto=format&fit=crop&w=1800&q=70'

const ACCREDITATIONS = [
  {
    icon: 'monitor',
    tag: 'Microsoft',
    title: 'Microsoft Authorised Training Partner',
    text: 'Official training on Microsoft Office, Excel and Power BI, with Microsoft Office Specialist certification for eligible programs.',
    points: ['Microsoft Office & Excel with AI', 'Advanced Excel & Data Analytics', 'Power BI dashboards & DAX'],
    link: { label: 'Excel Courses', href: '/courses/excel' },
    color: '#2fa84f',
  },
  {
    icon: 'ledger',
    tag: 'Tally',
    title: 'Authorised Tally Centre',
    text: 'The trusted, authorised Tally centre of North Bengaluru — learn accounting, GST, inventory and payroll on the latest Tally Prime.',
    points: ['Tally Prime Level 1, 2 & 3', 'Tally Prime Comprehensive', 'Tally Prime with Internship'],
    link: { label: 'Tally Courses', href: '/courses/tally-prime' },
    color: '#0b4ea2',
  },
  {
    icon: 'shieldCheck',
    tag: 'ISO',
    title: 'ISO 9001:2015 Certified',
    text: 'Our training, assessment and certification processes follow ISO 9001:2015 quality-management standards.',
    points: ['Standardised curriculum & assessment', 'Every certificate verifiable online', 'Regular quality audits'],
    link: { label: 'Verify a Certificate', href: '/verify-certificate' },
    color: '#c99700',
  },
]

const BENEFITS = [
  { icon: 'cap', title: 'Official Curriculum', text: 'Course content aligned with our partners’ latest syllabus and software versions.' },
  { icon: 'user', title: 'Certified Trainers', text: 'Faculty trained and experienced on the platforms they teach.' },
  { icon: 'star', title: 'Recognised Certificates', text: 'Certificates valued by employers and verifiable online.' },
  { icon: 'monitor', title: 'Licensed Software', text: 'Practice on genuine, up-to-date software on an individual system.' },
]

const TIE_UPS = [
  { icon: 'building', title: 'Colleges & Schools', text: 'Campus programs, add-on certification courses and student skilling drives.' },
  { icon: 'briefcase', title: 'Corporates', text: 'Customised Excel, Power BI, Tally and GST training for your teams.' },
  { icon: 'users', title: 'Placement Partners', text: 'Hire job-ready, certified candidates trained on industry tools.' },
]

function Accreditations() {
  return (
    <section className="section-pad bg-white">
      <div className="wrap">
        <Reveal className="text-center">
          <Eyebrow center>Accreditations</Eyebrow>
          <Title>Authorised &amp; <em>Certified</em></Title>
          <Lead center>Our partnerships mean you learn from an authorised centre and earn certificates that carry weight.</Lead>
        </Reveal>

        <div className="mt-12 grid grid-cols-3 gap-7 max-lg:grid-cols-1">
          {ACCREDITATIONS.map((a, i) => (
            <Reveal key={a.title} delay={`${i * 0.1}s`} className="h-full">
              <article
                style={{ '--a': a.color }}
                className="group relative flex h-full flex-col overflow-hidden rounded-[18px] border border-line bg-white p-8 transition-all duration-400 ease-smooth hover:-translate-y-2 hover:border-(--a)/50 hover:shadow-[0_28px_60px_-28px_rgba(11,37,69,.4)] max-sm:p-6"
              >
                <span className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-(--a) transition-transform duration-500 group-hover:scale-x-100" />
                <span className="absolute -top-14 -right-14 size-44 rounded-full bg-(--a)/8 transition-transform duration-700 group-hover:scale-125" />

                <div className="relative flex items-center justify-between">
                  <span className="grid size-16 place-items-center rounded-2xl bg-(--a) text-white shadow-[0_12px_24px_-10px_var(--a)] transition-transform duration-500 group-hover:-rotate-6">
                    <Icon name={a.icon} className="size-8" />
                  </span>
                  <span className="rounded-full border border-(--a)/30 px-3 py-1 text-[.68rem] font-extrabold uppercase tracking-[.16em] text-(--a)">{a.tag}</span>
                </div>

                <h3 className="relative mt-6 font-serif text-[1.75rem] font-semibold leading-[1.15] text-ink-dark">{a.title}</h3>
                <p className="relative mt-2 text-[.92rem] text-ink-mid">{a.text}</p>

                <ul className="relative mt-5 mb-7 flex flex-col gap-2.5">
                  {a.points.map((p) => (
                    <li key={p} className="flex items-center gap-2.5 text-[.9rem] text-ink">
                      <span className="grid size-5 shrink-0 place-items-center rounded-full bg-(--a)/12 text-(--a)">
                        <svg viewBox="0 0 24 24" className="size-3" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M5 12.5l4.5 4.5L19 7" />
                        </svg>
                      </span>
                      {p}
                    </li>
                  ))}
                </ul>

                <SmartLink href={a.link.href} className="relative mt-auto inline-flex items-center gap-2 text-[.8rem] font-bold uppercase tracking-[.08em] text-(--a)">
                  {a.link.label} <span className="transition-transform duration-300 group-hover:translate-x-1.5">→</span>
                </SmartLink>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function Benefits() {
  return (
    <section className="section-pad relative overflow-hidden bg-brand-deep text-white">
      <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.035)_1px,transparent_1px)] bg-size-[56px_56px] [mask-image:radial-gradient(circle_at_50%_50%,#000_20%,transparent_75%)]" />
      <div className="wrap relative grid grid-cols-[.9fr_1.1fr] items-center gap-16 max-lg:grid-cols-1 max-lg:gap-10">
        <Reveal variant="left">
          <Eyebrow light>What It Means For You</Eyebrow>
          <Title light>The Partner <em>Advantage</em></Title>
          <Lead light>
            Learning at an authorised centre gives you the same curriculum, tools and certification standards that employers trust.
          </Lead>
        </Reveal>
        <div className="grid grid-cols-2 gap-5 max-sm:grid-cols-1">
          {BENEFITS.map((b, i) => (
            <Reveal key={b.title} variant="right" delay={`${i * 0.08}s`}>
              <div className="group h-full rounded-2xl border border-white/12 bg-white/5 p-6 transition duration-400 hover:-translate-y-1 hover:border-white/30 hover:bg-white/10">
                <span className="grid size-12 place-items-center rounded-xl bg-white/10 text-brand-pale transition duration-300 group-hover:bg-white group-hover:text-brand">
                  <Icon name={b.icon} />
                </span>
                <h4 className="mt-4 font-serif text-[1.35rem] font-semibold">{b.title}</h4>
                <p className="mt-1 text-[.88rem] text-[#b5c6d9]">{b.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function TieUps() {
  const { openEnquiry } = useEnquiry()
  return (
    <section className="section-pad bg-white">
      <div className="wrap">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Eyebrow>Institutional Tie-ups</Eyebrow>
            <Title className="mb-0">Partner <em>With Us</em></Title>
          </div>
          <Lead className="max-w-[440px]">We work with colleges, companies and recruiters to build job-ready skills. Let&apos;s talk about a partnership.</Lead>
        </Reveal>

        <div className="mt-10 grid grid-cols-3 gap-6 max-lg:grid-cols-1">
          {TIE_UPS.map((t, i) => (
            <Reveal key={t.title} delay={`${i * 0.08}s`}>
              <div className="group flex h-full gap-5 rounded-2xl border border-line bg-ink-light p-6 transition duration-300 hover:border-brand hover:bg-white hover:shadow-soft">
                <Ic name={t.icon} className="size-14 rounded-2xl bg-white group-hover:bg-brand group-hover:text-white" iconClass="size-7" />
                <div>
                  <h4 className="font-serif text-[1.4rem] font-semibold text-ink-dark">{t.title}</h4>
                  <p className="mt-1 text-[.9rem] text-ink-mid">{t.text}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="relative mt-10 flex flex-wrap items-center justify-between gap-6 overflow-hidden rounded-[18px] bg-linear-110 from-brand-deep to-brand px-10 py-8 text-white max-sm:px-6">
          <span className="absolute -top-20 -right-16 size-64 rounded-full border-[40px] border-white/6" />
          <div className="relative">
            <h3 className="font-serif text-[1.8rem] font-semibold leading-tight">Interested in a partnership?</h3>
            <p className="mt-1 text-[#c3d3e6]">Tell us about your institution or company and we&apos;ll get in touch.</p>
          </div>
          <div className="relative flex flex-wrap gap-3">
            <button type="button" onClick={() => openEnquiry()} aria-haspopup="dialog" className={cn(btn, 'bg-white text-brand-deep hover:bg-ink-dark hover:text-white')}>
              Send Enquiry
            </button>
            <SmartLink href="/contact" className={cn(btn, 'border border-white/50 text-white hover:bg-white hover:text-brand-deep')}>
              Contact Us
            </SmartLink>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export default function AcademicPartnersPage() {
  useEffect(() => {
    document.title = 'Academic Partners | Mark Education Academy'
  }, [])

  return (
    <>
      <PageBanner
        crumb="Academic Partners"
        eyebrow="Our Partners"
        title={<>Academic <em>Partners</em></>}
        text="Authorised training partnerships and certifications that make your Mark Education certificate count."
        image={BANNER}
        position="center 18%"
      />
      <Accreditations />
      <Benefits />
      <Partners />
      <TieUps />
      <Cta />
    </>
  )
}
