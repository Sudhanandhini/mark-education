import { useEffect } from 'react'
import { EnquiryForm } from '../components/Faq'
import PageBanner from '../components/PageBanner'
import { Eyebrow, FillIcon, Icon, Reveal, SOCIAL, Title, btnPrimary, cn } from '../components/ui'
import { EMAIL, HOURS, MAP_QUERY, OFFICES, PHONE, PHONE_HREF } from '../data/content'

const BANNER = 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1800&q=70'

const INFO = [
  { icon: 'phone', label: 'Call Us', value: PHONE, href: PHONE_HREF, fill: true },
  { icon: 'mail', label: 'Email Us', value: EMAIL, href: `mailto:${EMAIL}`, fill: true },
  { icon: 'pin', label: 'Visit Us', value: 'Bengaluru, Karnataka', href: '#location', fill: true },
  { icon: 'clock', label: 'Working Hours', value: HOURS, fill: true },
]

function InfoCards() {
  return (
    <section className="relative z-[6] -mt-14 max-sm:mt-0 max-sm:pt-10">
      <div className="wrap grid grid-cols-4 gap-5 max-lg:grid-cols-2 max-sm:grid-cols-1">
        {INFO.map((c, i) => {
          const Tag = c.href ? 'a' : 'div'
          return (
            <Reveal key={c.label} delay={`${i * 0.08}s`}>
              <Tag
                href={c.href}
                className="group flex h-full flex-col items-start gap-4 rounded-[14px] bg-white p-6 shadow-soft transition duration-400 ease-smooth hover:-translate-y-1.5 hover:shadow-card"
              >
                <span className="grid size-[54px] place-items-center rounded-full bg-brand-soft text-brand transition duration-300 group-hover:bg-brand group-hover:text-white">
                  <FillIcon name={c.icon} className="size-[22px] fill-current" />
                </span>
                <div>
                  <small className="block text-[.72rem] font-bold uppercase tracking-[.14em] text-ink-mid">{c.label}</small>
                  <b className="mt-0.5 block text-[1.02rem] text-ink-dark">{c.value}</b>
                </div>
              </Tag>
            </Reveal>
          )
        })}
      </div>
    </section>
  )
}

function Offices() {
  return (
    <section id="location" className="section-pad bg-white">
      <div className="wrap grid grid-cols-[1fr_1.25fr] items-stretch gap-12 max-lg:grid-cols-1">
        <Reveal variant="left">
          <Eyebrow>Our Centres</Eyebrow>
          <Title>Head Office &amp; <em>Branch</em></Title>
          <div className="mt-8 flex flex-col gap-5">
            {OFFICES.map((o, i) => (
              <div
                key={o.type}
                className={cn(
                  'group relative overflow-hidden rounded-[14px] border p-6 transition duration-300',
                  i === 0 ? 'border-brand bg-brand-soft/60' : 'border-line hover:border-brand',
                )}
              >
                <span className="inline-flex items-center gap-2 rounded-[40px] bg-brand px-3 py-1 text-[.66rem] font-extrabold uppercase tracking-[.14em] text-white">
                  {o.type}
                </span>
                <h3 className="mt-3 font-serif text-[1.5rem] font-semibold text-ink-dark">{o.name}</h3>
                <p className="mt-2 flex items-start gap-2.5 text-[.92rem] text-ink-mid">
                  <FillIcon name="pin" className="mt-1 size-4 shrink-0 fill-brand" />
                  {o.address}
                </p>
                <a href={PHONE_HREF} className="mt-1.5 flex items-center gap-2.5 text-[.92rem] text-ink-mid hover:text-brand">
                  <FillIcon name="phone" className="size-4 shrink-0 fill-brand" />
                  {o.phone}
                </a>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal variant="right" className="relative min-h-[420px] overflow-hidden rounded-[18px] border-[6px] border-white bg-brand-soft shadow-card">
          <iframe
            title="Mark Education Academy location map"
            src={`https://www.google.com/maps?q=${encodeURIComponent(MAP_QUERY)}&output=embed`}
            className="absolute inset-0 size-full grayscale-[.3]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(MAP_QUERY)}`}
            target="_blank"
            rel="noreferrer"
            className={cn(btnPrimary, 'absolute bottom-5 left-5 shadow-card')}
          >
            Get Directions ↗
          </a>
        </Reveal>
      </div>
    </section>
  )
}

function Feedback() {
  return (
    <section id="enquiry" className="section-pad relative overflow-hidden bg-ink-light">
      <span className="pointer-events-none absolute -bottom-32 -left-32 size-[420px] rounded-full bg-[radial-gradient(circle,rgba(0,89,168,.08),transparent_70%)]" />
      <div className="wrap relative grid grid-cols-[1fr_1fr] items-start gap-[60px] max-lg:grid-cols-1 max-lg:gap-[50px]">
        <Reveal>
          <Eyebrow>Enquiry &amp; Feedback</Eyebrow>
          <Title>We&apos;d Love to <em>Hear From You</em></Title>
          <p className="max-w-[500px] text-ink-mid">
            Have a question about a course, batch timings or fees? Want to share feedback about your training? Send us a message and our counsellor will get back to you shortly.
          </p>
          <ul className="mt-8 flex flex-col gap-4">
            {['Free career counselling', 'Free demo class for every course', 'Reply within one working day'].map((t) => (
              <li key={t} className="flex items-center gap-3 text-ink">
                <span className="grid size-7 place-items-center rounded-full bg-brand text-white">
                  <Icon name="checkCircle" className="size-4" />
                </span>
                {t}
              </li>
            ))}
          </ul>
          <div className="mt-10">
            <small className="text-[.72rem] font-bold uppercase tracking-[.14em] text-ink-mid">Follow us</small>
            <div className="mt-3 flex gap-2.5">
              {SOCIAL.map((s) => (
                <a
                  key={s.name}
                  href="#"
                  aria-label={s.label}
                  className="grid size-11 place-items-center rounded-full border border-line bg-white transition duration-300 hover:-translate-y-1 hover:border-brand hover:bg-brand [&:hover_svg]:fill-white"
                >
                  <FillIcon name={s.name} className="size-4 fill-ink-dark transition-colors" />
                </a>
              ))}
            </div>
          </div>
        </Reveal>
        <EnquiryForm />
      </div>
    </section>
  )
}

export default function ContactPage() {
  useEffect(() => {
    document.title = 'Contact Us | Mark Education Academy'
  }, [])

  return (
    <>
      <PageBanner
        crumb="Contact Us"
        eyebrow="Get in Touch"
        title={<>Contact <em>Us</em></>}
        text="Visit our centre, call us or send an enquiry — our counsellors are happy to help you choose the right course."
        image={BANNER}
      />
      <InfoCards />
      <Offices />
      <Feedback />
    </>
  )
}
