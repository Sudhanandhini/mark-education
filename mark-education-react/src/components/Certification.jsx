import logo from '../assets/logo.webp'
import { CERT_WHY, OFFERS } from '../data/content'
import { Eyebrow, Ic, Lead, Pill, Reveal, SmartLink, Title, btn, cn } from './ui'

function Badge({ icon, title, sub, className }) {
  return (
    <div
      className={cn(
        'absolute z-[3] flex items-center gap-2.5 rounded-[10px] bg-white px-4 py-3 text-[.8rem] font-bold text-ink-dark shadow-card max-sm:px-3 max-sm:py-[9px] max-sm:text-[.72rem]',
        className,
      )}
    >
      <Ic name={icon} className="size-9" iconClass="size-[18px]" />
      <div>
        {title}
        <small className="block text-[.7rem] font-medium text-ink-mid">{sub}</small>
      </div>
    </div>
  )
}

function CertificateVisual() {
  return (
    <Reveal variant="left" className="relative grid place-items-center px-[30px] py-10 max-lg:mx-auto max-lg:w-full max-lg:max-w-[520px]">
      <span className="absolute aspect-square w-[92%] rounded-full bg-[radial-gradient(circle,var(--color-brand-soft)_0%,var(--color-brand-soft)_55%,transparent_56%)]">
        <span className="absolute -inset-[18px] animate-[spin_40s_linear_infinite] rounded-full border-[1.5px] border-dashed border-brand/30" />
      </span>

      <div className="relative w-[min(100%,360px)] animate-[floaty_7s_ease-in-out_infinite]">
        {/* stacked papers behind */}
        <span className="absolute inset-0 -rotate-7 rounded-lg border border-line bg-white shadow-soft" />
        <span className="absolute inset-0 rotate-4 rounded-lg border border-line bg-[#f9fbfd] shadow-soft" />

        <div className="relative z-[2] overflow-hidden rounded-lg bg-white px-[26px] pt-[30px] pb-6 text-center shadow-[0_24px_50px_rgba(11,37,69,.16)]">
          <span className="pointer-events-none absolute inset-2 rounded border-[3px] border-double border-brand/40" />
          <span className="pointer-events-none absolute top-[52%] left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-[24deg] font-serif text-[4rem] font-bold text-ink/6">
            Sample
          </span>
          <img src={logo} alt="Mark Education Academy" className="mx-auto mb-4 h-[38px] w-auto" />
          <h4 className="font-serif text-[1.8rem] font-semibold leading-[1.1] text-ink-dark">Certificate of Completion</h4>
          <p className="mt-2.5 mb-1 text-[.68rem] text-ink-mid">This certificate is proudly awarded to</p>
          <p className="font-serif text-[1.3rem] font-bold tracking-[.04em] text-brand">STUDENT NAME</p>
          <p className="mt-2.5 mb-1 text-[.68rem] text-ink-mid">for successfully completing the course</p>
          <p className="font-serif text-[1.12rem] italic text-ink-dark">Tally Prime – Advanced</p>
          <p className="mt-2.5 mb-1 text-[.68rem] text-ink-mid">with Grade A</p>
          <div className="mt-6 flex items-end justify-between text-left text-[.58rem] text-ink-mid">
            <div>
              Certificate No: ME-000000
              <br />
              Place: Bengaluru
            </div>
            <div className="grid size-[52px] place-items-center rounded-full bg-brand text-center font-serif text-[.6rem] font-bold leading-[1.1] text-white shadow-[0_0_0_4px_#fff,0_0_0_5px_var(--color-brand)]">
              ISO<br />9001<br />2015
            </div>
            <div className="min-w-[84px] border-t border-ink-mid pt-1 text-center">Director</div>
          </div>
        </div>
      </div>

      <Badge
        icon="checkCircle"
        title="Verified Online"
        sub="Instant verification"
        className="top-[18%] left-0 animate-[floaty_5s_ease-in-out_infinite_.5s] max-sm:-left-1.5"
      />
      <Badge
        icon="shield"
        title="ISO 9001:2015"
        sub="Certified institute"
        className="right-0 bottom-[14%] animate-[floaty_6s_ease-in-out_infinite_1s] max-sm:-right-1.5"
      />
    </Reveal>
  )
}

export default function Certification() {
  return (
    <section id="certification" className="section-pad relative overflow-hidden bg-white">
      <div className="wrap grid grid-cols-[1fr_1.1fr] items-center gap-20 max-lg:grid-cols-1 max-lg:gap-[50px]">
        <CertificateVisual />
        <Reveal variant="right">
          <Eyebrow>Certification</Eyebrow>
          <Title>Why Choose <em>Mark Certification?</em></Title>
          <Lead>
            Every program ends with a certificate from our ISO 9001:2015 certified institute — backed by practical training that sharpens
            skills and boosts employability.
          </Lead>
          <ul className="mt-[30px] flex flex-col gap-1.5">
            {CERT_WHY.map((w, i) => (
              <li
                key={w.title}
                className={cn(
                  'relative flex gap-[18px] rounded-xl px-[18px] py-4 transition duration-300 hover:bg-ink-light',
                  i < CERT_WHY.length - 1 && 'after:absolute after:top-[70px] after:-bottom-3.5 after:left-[43px] after:w-px after:bg-line',
                )}
              >
                <Ic name={w.icon} className="rounded-xl bg-brand text-white shadow-[0_8px_20px_rgba(0,89,168,.25)]" />
                <div>
                  <h4 className="mb-0.5 text-[1.05rem] font-extrabold text-ink-dark">{w.title}</h4>
                  <p className="text-[.9rem] text-ink-mid">{w.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>

      <div className="wrap">
        <Reveal className="mt-20 mb-[30px] flex items-center gap-[18px] after:h-px after:flex-1 after:bg-line max-sm:mt-[60px]">
          <Pill>Key Offerings</Pill>
        </Reveal>

        <div className="grid grid-cols-3 gap-6 max-lg:grid-cols-2 max-sm:grid-cols-1">
          {OFFERS.map((o, i) => (
            <Reveal key={o.title} delay={`${i * 0.1}s`} className="h-full">
              <div
                className={cn(
                  'group relative h-full overflow-hidden rounded-[14px] bg-ink-light px-[30px] pt-[34px] pb-[30px] transition-all duration-400 ease-smooth',
                  'hover:-translate-y-2 hover:bg-white hover:shadow-soft',
                  'after:absolute after:bottom-0 after:left-0 after:h-[3px] after:w-full after:origin-left after:scale-x-0 after:bg-brand after:transition-transform after:duration-500 after:ease-smooth hover:after:scale-x-100',
                )}
              >
                <span className="absolute top-3 right-[22px] font-serif text-[4.2rem] font-bold leading-none text-brand/8">0{i + 1}</span>
                <Ic name={o.icon} className="mb-5 bg-white group-hover:bg-brand group-hover:text-white" />
                <h4 className="mb-2 font-serif text-[1.45rem] font-semibold leading-[1.2] text-ink-dark">{o.title}</h4>
                <p className="text-[.9rem] text-ink-mid">{o.text}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="relative mt-11 flex flex-wrap items-center justify-between gap-6 overflow-hidden rounded-[14px] bg-linear-110 from-brand-deep to-brand px-10 py-[30px] text-white max-sm:px-[22px] max-sm:py-[26px]">
          <span className="absolute -top-20 -right-[60px] size-[260px] rounded-full border-[40px] border-white/6" />
          <div className="relative flex items-center gap-[18px]">
            <Ic name="shieldCheck" className="size-14 bg-white/12 text-white" />
            <div>
              <h4 className="font-serif text-[1.6rem] font-semibold leading-[1.2]">Already have a certificate?</h4>
              <p className="text-[.9rem] text-[#c3d3e6]">Verify its authenticity instantly using your certificate number.</p>
            </div>
          </div>
          <SmartLink href="/verify-certificate" className={cn(btn, 'relative rounded-[40px] bg-white text-brand-deep hover:bg-ink-dark hover:text-white')}>
            Verify Your Certificate &#10003;
          </SmartLink>
        </Reveal>
      </div>
    </section>
  )
}
