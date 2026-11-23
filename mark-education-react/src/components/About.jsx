import { ABOUT_FEATURES, ABOUT_IMAGES, PHONE, PHONE_HREF } from '../data/content'
import { Eyebrow, Ic, Reveal, SmartLink, Title, btnPrimary } from './ui'

export default function About({ readMore = true }) {
  return (
    <section id="about" className="section-pad">
      <div className="wrap grid grid-cols-2 items-center gap-20 max-lg:grid-cols-1 max-lg:gap-[60px]">
        <Reveal
          variant="left"
          className="group relative pr-[70px] pb-[70px] max-lg:mx-auto max-lg:w-full max-lg:max-w-[540px] max-sm:pr-10 max-sm:pb-[50px]"
        >
          <span className="absolute top-5 right-[30px] -z-10 size-[120px] bg-[radial-gradient(var(--color-brand)_1.4px,transparent_1.4px)] bg-size-[14px_14px] opacity-25" />
          <div className="img-wipe aspect-[4/4.6] overflow-hidden rounded-[200px_200px_8px_8px] bg-brand-soft">
            <img
              src={ABOUT_IMAGES.main}
              alt="Students learning in a computer classroom"
              loading="lazy"
              className="size-full object-cover transition-transform duration-1200 ease-smooth group-hover:scale-105"
            />
          </div>
          <div className="img-wipe wipe-delay absolute right-0 bottom-0 aspect-square w-[48%] overflow-hidden rounded-lg border-8 border-white bg-brand-soft shadow-soft">
            <img src={ABOUT_IMAGES.inset} alt="College student" loading="lazy" className="size-full object-cover" />
          </div>
          <div className="absolute top-10 -left-7 grid size-[136px] animate-floaty place-items-center rounded-full bg-brand text-center text-white shadow-[0_18px_40px_rgba(0,89,168,.3)] max-sm:-left-1.5 max-sm:size-[104px]">
            <span className="absolute -inset-2.5 animate-spin-slow rounded-full border-[1.5px] border-dashed border-brand/45" />
            <div>
              <b className="block font-serif text-[2.6rem] leading-none max-sm:text-[2rem]">20+</b>
              <span className="text-[.66rem] uppercase leading-[1.35] tracking-[.14em]">Years of<br />Excellence</span>
            </div>
          </div>
        </Reveal>

        <Reveal variant="right">
          <Eyebrow>About Us</Eyebrow>
          <Title>A Trusted Name in <em>Quality Education</em> in Bangalore</Title>
          <p className="mb-4 text-ink-mid">
            <strong>Mark Education Academy</strong> is one of the well-established institutes renowned for its quality education in
            Bangalore. Our innovative training methodology is the result of years of research by educationists &amp; Human Resource
            professionals, and is recognised by several Government and Non-Government organisations.
          </p>
          <p className="mb-4 text-ink-mid">
            Our value-based curriculum is built on industry requirements — acting as a bridge between corporate needs and skilled,
            job-ready candidates, all at very nominal fees.
          </p>
          <div className="mt-7 mb-[34px] grid grid-cols-2 gap-4 max-sm:grid-cols-1">
            {ABOUT_FEATURES.map((f) => (
              <div
                key={f.text}
                className="flex items-center gap-3.5 rounded-[10px] border border-line p-4 transition duration-300 hover:border-brand hover:bg-brand-soft"
              >
                <Ic name={f.icon} className="size-11" />
                <b className="text-[.92rem] leading-[1.3] text-ink-dark">{f.text}</b>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-[26px]">
            {readMore && <SmartLink href="/about" className={btnPrimary}>Read More</SmartLink>}
            <a href={PHONE_HREF} className="flex items-center gap-3">
              <Ic name="phone" className="bg-ink-light" />
              <div>
                <small className="block text-[.75rem] text-ink-mid">Call for admission</small>
                <b className="font-serif text-[1.3rem] text-ink-dark">{PHONE}</b>
              </div>
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
