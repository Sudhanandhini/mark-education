import { useEffect, useRef, useState } from 'react'
import { ENQUIRY_COURSES, FAQS } from '../data/content'
import { Eyebrow, Reveal, Title, btn, cn } from './ui'

function AccordionItem({ item, open, onToggle }) {
  const bodyRef = useRef(null)
  const [height, setHeight] = useState(0)

  useEffect(() => {
    const measure = () => setHeight(open && bodyRef.current ? bodyRef.current.scrollHeight : 0)
    measure()
    window.addEventListener('resize', measure, { passive: true })
    return () => window.removeEventListener('resize', measure)
  }, [open])

  return (
    <div
      className={cn(
        'mb-3 border transition-colors duration-300',
        open ? 'border-brand bg-white shadow-soft' : 'border-line bg-ink-light',
      )}
    >
      <button
        aria-expanded={open}
        onClick={onToggle}
        className={cn(
          'flex w-full items-center justify-between gap-5 px-6 py-5 text-left text-base font-bold',
          open ? 'text-brand' : 'text-ink-dark',
        )}
      >
        {item.q}
        <span
          className={cn(
            'relative size-7 shrink-0 rounded-full border transition duration-300',
            'before:absolute before:top-1/2 before:left-1/2 before:h-[1.5px] before:w-2.5 before:-translate-1/2 before:bg-current',
            'after:absolute after:top-1/2 after:left-1/2 after:h-[1.5px] after:w-2.5 after:-translate-1/2 after:bg-current after:transition-transform after:duration-300',
            open ? 'border-brand bg-brand text-white after:rotate-0' : 'border-line after:rotate-90',
          )}
        />
      </button>
      <div ref={bodyRef} className="overflow-hidden transition-[max-height] duration-400 ease-smooth" style={{ maxHeight: height }}>
        <p className="px-6 pb-[22px] text-[.93rem] text-ink-mid">{item.a}</p>
      </div>
    </div>
  )
}

const field =
  'w-full rounded border bg-white/6 px-4 py-3.5 text-[.92rem] leading-[normal] text-white outline-none transition duration-250 placeholder:text-[#9fb3c9] focus:border-[#8fb5dc] focus:bg-white/10'

export function EnquiryForm({ defaultCourse = '', className }) {
  const [invalid, setInvalid] = useState({})
  const [sent, setSent] = useState(false)

  useEffect(() => {
    if (!sent) return
    const t = setTimeout(() => setSent(false), 5000)
    return () => clearTimeout(t)
  }, [sent])

  const onSubmit = (e) => {
    e.preventDefault()
    const form = e.currentTarget
    const bad = {}
    form.querySelectorAll('[required]').forEach((el) => {
      if (!el.checkValidity()) bad[el.name] = true
    })
    setInvalid(bad)
    if (Object.keys(bad).length) return
    // Hook up to your backend / form service here
    form.reset()
    form.course.value = defaultCourse
    setSent(true)
  }

  const border = (name) => (invalid[name] ? 'border-[#e57373]' : 'border-white/18')

  return (
    <Reveal
      as="form"
      noValidate
      onSubmit={onSubmit}
      className={cn('sticky top-[110px] bg-brand-deep px-10 py-11 text-white max-lg:static max-sm:px-6 max-sm:py-[34px]', className)}
    >
      <h3 className="font-serif text-[2rem] font-semibold leading-[1.15]">Online Enquiry</h3>
      <p className="mt-2 mb-[26px] text-[.9rem] text-[#b9cbe0]">Fill in your details and our counsellor will get back to you shortly.</p>
      <div className="mb-3.5">
        <input type="text" name="name" placeholder="Full Name *" required className={cn(field, border('name'))} />
      </div>
      <div className="mb-3.5">
        <input type="tel" name="phone" placeholder="Mobile Number *" pattern="[0-9]{10}" required className={cn(field, border('phone'))} />
      </div>
      <div className="mb-3.5">
        <input type="email" name="email" placeholder="Email Address" className={cn(field, border('email'))} />
      </div>
      <div className="mb-3.5">
        <select name="course" required defaultValue={defaultCourse} className={cn(field, border('course'))}>
          <option value="" className="text-ink-dark">Select Course *</option>
          {ENQUIRY_COURSES.map((c) => (
            <option key={c} className="text-ink-dark">{c}</option>
          ))}
        </select>
      </div>
      <div className="mb-3.5">
        <textarea name="message" rows={3} placeholder="Message" className={cn(field, border('message'))} />
      </div>
      <button type="submit" className={cn(btn, 'w-full justify-center bg-white text-brand-deep hover:bg-brand hover:text-white')}>
        Submit Enquiry
      </button>
      {sent && <p className="mt-3 text-[.88rem] text-[#a9e0c0]">Thank you! We will contact you soon.</p>}
    </Reveal>
  )
}

export default function Faq() {
  const [open, setOpen] = useState(0)

  return (
    <section id="enquiry" className="section-pad bg-white">
      <div className="wrap grid grid-cols-[1.2fr_1fr] items-start gap-[60px] max-lg:grid-cols-1 max-lg:gap-[50px]">
        <Reveal>
          <Eyebrow>FAQ</Eyebrow>
          <Title>Frequently Asked <em>Questions</em></Title>
          <div className="mt-[34px]">
            {FAQS.map((f, i) => (
              <AccordionItem key={f.q} item={f} open={open === i} onToggle={() => setOpen(open === i ? null : i)} />
            ))}
          </div>
        </Reveal>
        <EnquiryForm />
      </div>
    </section>
  )
}
