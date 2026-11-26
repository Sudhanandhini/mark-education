import { useEffect } from 'react'
import Cta from '../components/Cta'
import { useEnquiry } from '../components/EnquiryProvider'
import PageBanner from '../components/PageBanner'
import { Eyebrow, Ic, Icon, Lead, Reveal, SmartLink, Title, btn, cn } from '../components/ui'
import { coursePageFor, enquiryCourseFor } from '../data/content'
import client1 from '../assets/clients/718533519-66757664-7e50-4e68-8186-d95b22c8045d.gif'
import client2 from '../assets/clients/718533520-b8961e87-0ec0-45ab-87f6-5cbd6daa1108.jpg'
import client3 from '../assets/clients/718533521-317f792f-aa8a-4506-b09a-c375b29277f9.jpg'
import client4 from '../assets/clients/718533522-156d36fd-91ca-494a-9d9b-9e36a63a8eaa.png'
import client5 from '../assets/clients/718533524-109946e6-54cb-4f9d-a211-d269294a8da3.png'
import client6 from '../assets/clients/718533525-5a9b2fc1-0d48-40eb-8887-121bfa6ebe12.jpeg'
import client7 from '../assets/clients/718533526-c31327ff-76b6-4eed-8c38-2e727a9cb4ee.jpg'
import client8 from '../assets/clients/718533527-02727674-23f9-4eb6-9829-5e0a418d3f20.jpg'
import client9 from '../assets/clients/718533528-166037c5-6ec6-458d-ba0f-368effebc4ba.jpg'
import client10 from '../assets/clients/718533530-148fbce7-4296-47c3-bf89-cd1a31cf59a7.jpeg'
import client11 from '../assets/clients/718533531-44c0510d-1dd2-4766-822f-4b5863b1075a.jpg'
import client12 from '../assets/clients/718533532-e23e2041-e44e-4a09-89a5-d603d45fd207.jpg'
import client13 from '../assets/clients/718533533-1dafdfc2-d6b2-4acf-853f-124a86a2b7bf.png'
import client14 from '../assets/clients/718533534-99cb3dd1-7e69-4eb4-86a4-13a6ba19cd2e.jpg'
import client15 from '../assets/clients/718533535-d4d5e38c-79d7-4c4a-8dbe-ddbc594b9d29.jpg'
import client16 from '../assets/clients/718533536-4ded9033-d621-41b0-8ce7-ddc7b929f1b4.png'
import client17 from '../assets/clients/718533537-06ff3c5f-e732-48a7-a587-b46dbee62b46.jpg'
import client18 from '../assets/clients/718533539-366931f5-3b74-493e-ba85-72a3ef110c3e.jpg'
import client19 from '../assets/clients/718533551-55bd3ab2-c02f-43a4-a20c-762c538297ac.png'

const BANNER = 'https://images.unsplash.com/photo-1781246435700-afec19012b45?auto=format&fit=crop&w=1800&q=70'

const ACCREDITATIONS = [
  {
    icon: 'monitor',
    tag: 'Microsoft',
    title: 'Microsoft Authorised Training Partner',
    text: 'Official training on Microsoft Office, Excel and Power BI, with Microsoft Office Specialist certification for eligible programs.',
    points: ['Microsoft Office & Excel with AI', 'Advanced Excel & Data Analytics', 'Power BI dashboards & DAX'],
    link: { label: 'Excel Courses', href: '/courses/excel' },
    color: 'var(--color-brand)',
  },
  {
    icon: 'ledger',
    tag: 'Tally',
    title: 'Authorised Tally Centre',
    text: 'The trusted, authorised Tally centre of North Bengaluru — learn accounting, GST, inventory and payroll on the latest Tally Prime.',
    points: ['Tally Prime Level 1, 2 & 3', 'Tally Prime Comprehensive', 'Tally Prime with Internship'],
    link: { label: 'Tally Courses', href: '/courses/tally-prime' },
    color: 'var(--color-brand)',
  },
  {
    icon: 'shieldCheck',
    tag: 'ISO',
    title: 'ISO 9001:2015 Certified',
    text: 'Our training, assessment and certification processes follow ISO 9001:2015 quality-management standards.',
    points: ['Standardised curriculum & assessment', 'Every certificate verifiable online', 'Regular quality audits'],
    link: { label: 'Verify a Certificate', href: '/verify-certificate' },
    color: 'var(--color-brand)',
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

const CLIENTS = [
  { logo: client1, name: 'Acharya Institutes' },
  { logo: client2, name: 'Brindavan Group of Institutions' },
  { logo: client3, name: 'JDCW' },
  { logo: client4, name: 'Bishop Cotton' },
  { logo: client5, name: 'NITTE Dr NSAM Pre University College' },
  { logo: client6, name: 'BGS College of Commerce, Malur' },
  { logo: client7, name: 'Ganga Institutions, Bangalore' },
  { logo: client8, name: 'Jnana Jyothi Educational Institutions' },
  { logo: client9, name: 'Kautilya Pre-University College' },
  { logo: client10, name: 'Soundarya Institute of Management & Science' },
  { logo: client11, name: 'Pragathi Group of Institutions' },
  { logo: client12, name: 'Hoysala Degree College' },
  { logo: client13, name: 'St. Claret Pre-University College' },
  { logo: client14, name: 'Soundarya Educational Trust' },
  { logo: client15, name: 'St. Claret College, Bengaluru' },
  { logo: client16, name: "St Paul's College" },
  { logo: client17, name: 'St. Claret Pre University College' },
  { logo: client18, name: 'RR Institutions' },
  { logo: client19, name: 'Vidya Soudha Group of Institutions' },
]

/* Technologies we train on, grouped by platform. Course titles match COURSE_TABS so links resolve to detail pages. */
const TECH = [
  { icon: 'table', name: 'Microsoft Excel', area: 'Spreadsheets & Analytics', partner: 'Microsoft Authorised', color: 'var(--color-brand)', courses: ['Advanced Excel', 'Microsoft Excel with AI', 'Data Analytics Using Excel'] },
  { icon: 'bars', name: 'Microsoft Power BI', area: 'Business Intelligence', partner: 'Microsoft Authorised', color: 'var(--color-brand)', courses: ['Power BI'] },
  { icon: 'monitor', name: 'Microsoft Office', area: 'Word · PowerPoint · Outlook', partner: 'Microsoft Authorised', color: 'var(--color-brand)', courses: ['Microsoft Office', 'CCOM – Office Management', 'Typing Course'] },
  { icon: 'ledger', name: 'Tally Prime', area: 'Accounting & Inventory', partner: 'Authorised Tally Centre', color: 'var(--color-brand)', courses: ['Tally Prime – Basic', 'Tally Prime – Intermediate', 'Tally Prime – Advanced'] },
  { icon: 'percent', name: 'GST & E-Filing', area: 'Taxation & Compliance', partner: 'Govt. Portals', color: 'var(--color-brand)', courses: ['GST Executive', 'Digital Statutory E-Filing'] },
  { icon: 'box', name: 'SAP ERP', area: 'Finance & Materials', partner: 'Industry Standard', color: 'var(--color-brand)', courses: ['SAP – SAP FICO', 'SAP – SAP MM'] },
  { icon: 'chat', name: 'English Communication', area: 'Soft Skills', partner: 'Career Skills', color: 'var(--color-brand)', courses: ['English Communication'] },
]
const courseLabel = (t) => t.replace(/^SAP – /, '')

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

function TechPartners() {
  const { openEnquiry } = useEnquiry()
  const total = TECH.reduce((n, t) => n + t.courses.length, 0)
  return (
    <section id="partners" className="section-pad relative overflow-hidden bg-ink-light">
      <span className="pointer-events-none absolute -top-32 -right-40 size-[460px] rounded-full bg-[radial-gradient(circle,rgba(0,89,168,.08),transparent_70%)]" />
      <div className="wrap relative">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Eyebrow>Academic Partners</Eyebrow>
            <Title className="mb-0">Technologies &amp; <em>Partners</em> We Train On</Title>
          </div>
          <Lead className="max-w-[440px]">
            {TECH.length} platforms, {total} job-oriented courses — taught on licensed software with our partners&apos; official curriculum.
          </Lead>
        </Reveal>

        <div className="mt-12 grid grid-cols-4 gap-6 max-xl:grid-cols-3 max-lg:grid-cols-2 max-sm:grid-cols-1">
          {TECH.map((t, i) => (
            <Reveal key={t.name} delay={`${(i % 4) * 0.08}s`} className="h-full">
              <article
                style={{ '--t': t.color }}
                className="group relative flex h-full flex-col overflow-hidden rounded-[18px] border border-line bg-white p-6 transition-all duration-400 ease-smooth hover:-translate-y-1.5 hover:border-(--t)/40 hover:shadow-[0_24px_50px_-24px_rgba(11,37,69,.35)]"
              >
                <span className="absolute inset-x-0 top-0 h-1 bg-(--t)" />
                <div className="flex items-start justify-between gap-3">
                  <span className="grid size-14 place-items-center rounded-2xl bg-(--t)/10 text-(--t) transition duration-400 group-hover:bg-(--t) group-hover:text-white">
                    <Icon name={t.icon} className="size-7" />
                  </span>
                  <span className="rounded-full bg-(--t)/10 px-2.5 py-1 text-right text-[.62rem] font-extrabold uppercase tracking-[.12em] text-(--t)">{t.partner}</span>
                </div>
                <h3 className="mt-5 font-serif text-[1.5rem] font-semibold leading-[1.15] text-ink-dark">{t.name}</h3>
                <small className="mt-0.5 text-[.72rem] font-bold uppercase tracking-[.1em] text-ink-mid">{t.area}</small>

                <ul className="mt-5 flex flex-col border-t border-line pt-2">
                  {t.courses.map((title) => {
                    const href = coursePageFor(title)
                    const row = 'flex w-full items-center justify-between gap-3 py-2 text-left text-[.88rem] font-semibold text-ink transition-colors hover:text-(--t) [&:hover>span]:translate-x-1 [&:hover>span]:opacity-100'
                    const arrow = <span className="text-(--t) opacity-40 transition duration-300" aria-hidden="true">→</span>
                    return (
                      <li key={title}>
                        {href ? (
                          <SmartLink href={href} className={row}>{courseLabel(title)} {arrow}</SmartLink>
                        ) : (
                          <button type="button" aria-haspopup="dialog" onClick={() => openEnquiry(enquiryCourseFor(title))} className={row}>
                            {courseLabel(title)} {arrow}
                          </button>
                        )}
                      </li>
                    )
                  })}
                </ul>
              </article>
            </Reveal>
          ))}

          {/* closing tile fills the 8th slot */}
          <Reveal delay=".24s" className="h-full">
            <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-[18px] bg-linear-135 from-brand-deep to-brand p-6 text-white">
              <span className="absolute -right-12 -bottom-12 size-44 rounded-full border-[28px] border-white/8" />
              <div className="relative">
                <span className="grid size-14 place-items-center rounded-2xl bg-white/12">
                  <Icon name="cap" className="size-7" />
                </span>
                <h3 className="mt-5 font-serif text-[1.5rem] font-semibold leading-[1.15]">Not sure which course fits you?</h3>
                <p className="mt-2 text-[.88rem] text-[#c3d3e6]">Book a free counselling session and demo class with our trainers.</p>
              </div>
              <div className="relative mt-6 flex flex-wrap gap-2.5">
                <button type="button" onClick={() => openEnquiry()} aria-haspopup="dialog" className={cn(btn, 'bg-white px-5 py-3 text-brand-deep hover:bg-ink-dark hover:text-white')}>
                  Free Demo
                </button>
                <SmartLink href="/courses" className={cn(btn, 'border border-white/50 px-5 py-3 text-white hover:bg-white hover:text-brand-deep')}>
                  All Courses
                </SmartLink>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function Clients() {
  return (
    <section className="section-pad bg-white">
      <div className="wrap">
        <Reveal className="text-center">
          <Eyebrow center>Our Clients</Eyebrow>
          <Title>Institutions That <em>Trust Us</em></Title>
          <Lead center>Colleges and institutions across Bengaluru that partner with Mark Education Academy for certification and skill-development programs.</Lead>
        </Reveal>

        <ul className="mx-auto mt-12 flex max-w-[1100px] flex-wrap justify-center gap-6 max-sm:gap-3">
          {CLIENTS.map((c, i) => (
            <Reveal
              as="li"
              key={c.name}
              delay={`${(i % 4) * 0.06}s`}
              className="w-[calc((100%-3*1.5rem)/4)] max-lg:w-[calc((100%-2*1.5rem)/3)] max-sm:w-[calc((100%-.75rem)/2)]"
            >
              <div
                title={c.name}
                className="group flex h-[160px] items-center justify-center overflow-hidden rounded-2xl border border-line bg-white p-6 transition duration-350 ease-smooth hover:-translate-y-1 hover:border-brand/40 hover:shadow-soft max-sm:h-[120px] max-sm:p-4"
              >
                <img
                  src={c.logo}
                  alt={c.name}
                  loading="lazy"
                  className="block h-full w-full object-contain transition duration-500 ease-smooth group-hover:scale-105"
                />
              </div>
            </Reveal>
          ))}
        </ul>
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
        position="center 60%"
      />
      <Clients />
      
      <Benefits />
      <Accreditations />
      <TechPartners />
      
      <TieUps />
      <Cta />
    </>
  )
}
