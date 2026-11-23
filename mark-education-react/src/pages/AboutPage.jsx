import { useEffect } from 'react'
import About from '../components/About'
import Counter from '../components/Counter'
import Cta from '../components/Cta'
import PageBanner from '../components/PageBanner'
import Testimonials from '../components/Testimonials'
import WhyChoose from '../components/WhyChoose'
import { Eyebrow, Ic, Icon, Lead, Reveal, Title, cn } from '../components/ui'
import { MILESTONES, MISSION, VALUES, VISION } from '../data/content'

const BANNER = 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1800&q=70'

function Journey() {
  return (
    <section id="history" className="section-pad relative overflow-hidden bg-ink-light">
      <span className="pointer-events-none absolute top-20 -right-40 size-[420px] rounded-full bg-[radial-gradient(circle,rgba(0,89,168,.08),transparent_70%)]" />
      <div className="wrap relative">
        <Reveal className="text-center">
          <Eyebrow center>Our History</Eyebrow>
          <Title>A Journey of <em>Excellence</em></Title>
          <Lead center>From a single classroom in 2004 to one of Bangalore&apos;s trusted skill-development institutes.</Lead>
        </Reveal>

        <ol className="relative mt-16 max-lg:mt-12">
          {/* centre spine */}
          <span className="absolute inset-y-0 left-1/2 w-0.5 -translate-x-1/2 bg-linear-to-b from-brand/0 via-brand/35 to-brand/0 max-lg:left-[27px]" />
          {MILESTONES.map((m, i) => {
            const left = i % 2 === 0
            return (
              <li key={m.title} className="relative grid grid-cols-2 gap-16 pb-12 last:pb-0 max-lg:grid-cols-1 max-lg:gap-0 max-lg:pl-[76px]">
                <span className="absolute top-3 left-1/2 z-[2] grid size-14 -translate-x-1/2 place-items-center rounded-full border-4 border-ink-light bg-brand font-serif text-[.92rem] font-bold text-white shadow-[0_10px_24px_rgba(0,89,168,.3)] max-lg:left-0 max-lg:translate-x-0">
                  {m.year}
                </span>
                <Reveal
                  variant={left ? 'left' : 'right'}
                  className={cn(left ? 'col-start-1 text-right max-lg:text-left' : 'col-start-2 max-lg:col-start-1')}
                >
                  <div className="group relative rounded-[14px] bg-white p-7 shadow-soft transition duration-400 ease-smooth hover:-translate-y-1.5 hover:shadow-card">
                    <h3 className="font-serif text-[1.55rem] font-semibold leading-[1.2] text-ink-dark">{m.title}</h3>
                    <p className="mt-1.5 text-[.92rem] text-ink-mid">{m.text}</p>
                    <span
                      className={cn(
                        'absolute top-0 h-[3px] w-0 bg-brand transition-all duration-500 ease-smooth group-hover:w-full',
                        left ? 'right-0 max-lg:right-auto max-lg:left-0' : 'left-0',
                      )}
                    />
                  </div>
                </Reveal>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}

function VisionMission() {
  const cards = [
    { icon: 'trend', title: 'Our Vision', text: VISION, dark: true },
    { icon: 'cap', title: 'Our Mission', text: MISSION },
  ]
  return (
    <section id="vision-mission" className="section-pad bg-white">
      <div className="wrap">
        <Reveal className="text-center">
          <Eyebrow center>Vision &amp; Mission</Eyebrow>
          <Title>What Drives <em>Us Forward</em></Title>
        </Reveal>

        <div className="mt-12 grid grid-cols-2 gap-7 max-lg:grid-cols-1">
          {cards.map((c, i) => (
            <Reveal key={c.title} variant={i === 0 ? 'left' : 'right'}>
              <div
                className={cn(
                  'group relative h-full overflow-hidden rounded-[18px] p-10 transition duration-400 ease-smooth hover:-translate-y-1.5 max-sm:p-7',
                  c.dark ? 'bg-linear-135 from-brand-deep to-brand text-white' : 'border border-line bg-ink-light',
                )}
              >
                <span className={cn('absolute -top-16 -right-16 size-56 rounded-full border-[36px] transition-transform duration-700 group-hover:scale-110', c.dark ? 'border-white/6' : 'border-brand/6')} />
                <span className={cn('relative grid size-16 place-items-center rounded-2xl', c.dark ? 'bg-white/12' : 'bg-white text-brand shadow-soft')}>
                  <Icon name={c.icon} className="size-8" />
                </span>
                <h3 className={cn('relative mt-6 font-serif text-[2rem] font-semibold', c.dark ? 'text-white' : 'text-ink-dark')}>{c.title}</h3>
                <p className={cn('relative mt-2 text-[1.02rem] leading-[1.75]', c.dark ? 'text-white/80' : 'text-ink-mid')}>{c.text}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-7 grid grid-cols-4 gap-6 max-lg:grid-cols-2 max-sm:grid-cols-1">
          {VALUES.map((v, i) => (
            <Reveal key={v.title} delay={`${i * 0.08}s`}>
              <div className="group h-full rounded-[14px] border border-line p-6 transition duration-300 hover:border-brand hover:bg-brand-soft">
                <Ic name={v.icon} className="group-hover:bg-brand group-hover:text-white" />
                <h4 className="mt-4 font-serif text-[1.3rem] font-semibold text-ink-dark">{v.title}</h4>
                <p className="mt-1 text-[.88rem] text-ink-mid">{v.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function AboutPage() {
  useEffect(() => {
    document.title = 'About Us | Mark Education Academy'
  }, [])

  return (
    <>
      <PageBanner
        crumb="About Us"
        eyebrow="Since 2004"
        title={<>About <em>Mark Education</em> Academy</>}
        text="An ISO 9001:2015 certified institute shaping careers in Bangalore through practical, industry-focused training."
        image={BANNER}
      />
      <About readMore={false} />
      <Journey />
      <VisionMission />
      <div id="achievements">
        <Counter />
      </div>
      <WhyChoose />
      <Testimonials />
      <Cta />
    </>
  )
}
