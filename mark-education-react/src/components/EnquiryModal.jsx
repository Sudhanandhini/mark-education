import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ENQUIRY_COURSES, PHONE, PHONE_HREF } from '../data/content'
import { Icon, cn } from './ui'

/* ---------- Validation ---------- */
const EMPTY = { course: '', subject: '', name: '', email: '', phone: '' }

const RULES = {
  course: (v) => (!v ? 'Please choose a course.' : ''),
  subject: (v) => {
    const t = v.trim()
    if (!t) return 'Please enter a subject.'
    if (t.length < 3) return 'Subject must be at least 3 characters.'
    return ''
  },
  name: (v) => {
    const t = v.trim()
    if (!t) return 'Please enter your name.'
    if (!/^[A-Za-z ]+$/.test(t)) return 'Name can contain letters and spaces only.'
    if (t.replace(/ /g, '').length < 2) return 'Name must be at least 2 letters.'
    return ''
  },
  email: (v) => {
    const t = v.trim()
    if (!t) return 'Please enter your email address.'
    if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(t)) return 'Enter a valid email, e.g. name@example.com'
    return ''
  },
  phone: (v) => {
    if (!v) return 'Please enter your mobile number.'
    if (!/^\d{10}$/.test(v)) return `Mobile number must be exactly 10 digits (${v.length}/10).`
    return ''
  },
}

// Strip disallowed characters as the user types
const SANITIZE = {
  name: (v) => v.replace(/[^A-Za-z ]/g, '').replace(/ {2,}/g, ' ').slice(0, 50),
  phone: (v) => v.replace(/\D/g, '').slice(0, 10),
  email: (v) => v.replace(/\s/g, '').slice(0, 80),
  subject: (v) => v.slice(0, 100),
}

const validateAll = (values) => Object.fromEntries(Object.keys(RULES).map((k) => [k, RULES[k](values[k])]))

/* ---------- Field wrapper ---------- */
function Field({ id, label, icon, error, valid, hint, select, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-[.78rem] font-bold uppercase tracking-[.08em] text-ink-dark">
        {label} <span className="text-[#d64545]">*</span>
      </label>
      <div className="relative">
        <span className={cn('pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 transition-colors', error ? 'text-[#d64545]' : valid ? 'text-[#2f9e5b]' : 'text-ink-mid')}>
          <Icon name={icon} className="size-[18px]" />
        </span>
        {children}
        {select && !valid && (
          <span className="pointer-events-none absolute top-1/2 right-4 size-2 -translate-y-[70%] rotate-45 border-r-[1.5px] border-b-[1.5px] border-ink-mid" />
        )}
        {valid && (
          <span className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 animate-[rise_.3s_ease_both] text-[#2f9e5b]">
            <svg viewBox="0 0 24 24" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12.5l4.5 4.5L19 7" />
            </svg>
          </span>
        )}
      </div>
      <p id={`${id}-msg`} className={cn('mt-1 min-h-[18px] text-[.76rem] leading-snug', error ? 'text-[#d64545]' : 'text-ink-mid')} role={error ? 'alert' : undefined}>
        {error || hint}
      </p>
    </div>
  )
}

const inputCls = (error, valid) =>
  cn(
    'w-full rounded-md border bg-white py-3 pr-10 pl-11 text-[.94rem] leading-[normal] text-ink-dark outline-none transition duration-200 placeholder:text-[#a3a9b1]',
    'focus:shadow-[0_0_0_4px_rgba(0,89,168,.12)]',
    error ? 'border-[#d64545] focus:border-[#d64545] focus:shadow-[0_0_0_4px_rgba(214,69,69,.12)]' : valid ? 'border-[#2f9e5b]/60 focus:border-brand' : 'border-line focus:border-brand',
  )

/* ---------- Modal ---------- */
export default function EnquiryModal({ open, onClose, defaultCourse = '' }) {
  const [mounted, setMounted] = useState(open)
  const [shown, setShown] = useState(false)
  const [values, setValues] = useState(EMPTY)
  const [touched, setTouched] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | sent
  const firstRef = useRef(null)
  const lastFocus = useRef(null)

  // Mount → animate in; animate out → unmount
  useEffect(() => {
    if (open) {
      lastFocus.current = document.activeElement
      setMounted(true)
      setValues({ ...EMPTY, course: ENQUIRY_COURSES.includes(defaultCourse) ? defaultCourse : '' })
      setTouched({})
      setStatus('idle')
      const r = requestAnimationFrame(() => setShown(true))
      return () => cancelAnimationFrame(r)
    }
    setShown(false)
    const t = setTimeout(() => setMounted(false), 300)
    return () => clearTimeout(t)
  }, [open, defaultCourse])

  // Focus, scroll lock, Escape to close
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const t = setTimeout(() => firstRef.current?.focus(), 80)
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => {
      clearTimeout(t)
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
      lastFocus.current?.focus?.()
    }
  }, [open, onClose])

  if (!mounted) return null

  const errors = validateAll(values)
  const show = (k) => (touched[k] ? errors[k] : '')
  const ok = (k) => touched[k] && !errors[k]

  const set = (k) => (e) => {
    const v = SANITIZE[k] ? SANITIZE[k](e.target.value) : e.target.value
    setValues((s) => ({ ...s, [k]: v }))
  }
  const blur = (k) => () => setTouched((s) => ({ ...s, [k]: true }))

  const onSubmit = (e) => {
    e.preventDefault()
    setTouched({ course: true, subject: true, name: true, email: true, phone: true })
    const firstBad = Object.keys(RULES).find((k) => errors[k])
    if (firstBad) {
      document.getElementById(`enq-${firstBad}`)?.focus()
      return
    }
    setStatus('sending')
    // TODO: send `values` to your backend / form service here
    setTimeout(() => setStatus('sent'), 700)
  }

  const aria = (k) => ({ 'aria-invalid': !!show(k), 'aria-describedby': `enq-${k}-msg` })

  return createPortal(
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 max-sm:items-end max-sm:p-0">
      {/* backdrop */}
      <div
        onClick={onClose}
        className={cn('absolute inset-0 bg-brand-deep/60 backdrop-blur-[3px] transition-opacity duration-300', shown ? 'opacity-100' : 'opacity-0')}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="enq-title"
        className={cn(
          'relative grid max-h-[calc(100vh-2rem)] w-full max-w-[900px] grid-cols-[.78fr_1.22fr] overflow-hidden rounded-2xl bg-white shadow-[0_40px_80px_-20px_rgba(11,37,69,.5)] transition-all duration-300 ease-smooth',
          'max-lg:max-w-[560px] max-lg:grid-cols-1 max-sm:max-h-[94vh] max-sm:rounded-b-none',
          shown ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-6 scale-[.97] opacity-0',
        )}
      >
        {/* Left info panel */}
        <aside className="relative overflow-hidden bg-linear-160 from-brand-deep to-brand p-9 text-white max-lg:hidden">
          <span className="absolute -top-20 -right-20 size-60 animate-[spin_40s_linear_infinite] rounded-full border-[1.5px] border-dashed border-white/20" />
          <span className="absolute -bottom-24 -left-16 size-64 rounded-full border-[40px] border-white/6" />
          <span className="relative inline-flex items-center gap-2 text-[.72rem] font-bold uppercase tracking-[.2em] text-brand-pale before:h-px before:w-7 before:bg-brand-pale">
            Admissions Open
          </span>
          <h3 className="relative mt-4 font-serif text-[2.1rem] font-semibold leading-[1.1]">
            Start Your <em className="text-brand-pale">Career</em> Journey
          </h3>
          <ul className="relative mt-7 flex flex-col gap-3.5 text-[.92rem] text-white/85">
            {['Free career counselling', 'Free demo class', 'ISO-certified courses', '100% placement assistance'].map((t, i) => (
              <li key={t} className="flex animate-rise items-center gap-3" style={{ animationDelay: `${0.15 + i * 0.08}s` }}>
                <span className="grid size-6 place-items-center rounded-full bg-white/15">
                  <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 12.5l4.5 4.5L19 7" />
                  </svg>
                </span>
                {t}
              </li>
            ))}
          </ul>
          <a href={PHONE_HREF} className="relative mt-10 flex items-center gap-3 rounded-xl bg-white/10 p-4 transition hover:bg-white/15">
            <span className="grid size-11 place-items-center rounded-full bg-white text-brand">
              <Icon name="phone" className="size-5" />
            </span>
            <div>
              <small className="block text-[.7rem] uppercase tracking-[.12em] text-white/70">Prefer to call?</small>
              <b className="text-[1.05rem]">{PHONE}</b>
            </div>
          </a>
        </aside>

        {/* Form */}
        <div className="overflow-y-auto p-9 max-sm:p-6">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute top-4 right-4 z-[2] grid size-10 place-items-center rounded-full bg-ink-light text-xl text-ink-dark transition duration-300 hover:rotate-90 hover:bg-brand hover:text-white"
          >
            ×
          </button>

          {status === 'sent' ? (
            <div className="flex min-h-[420px] animate-rise flex-col items-center justify-center text-center">
              <span className="relative grid size-20 place-items-center rounded-full bg-[#2f9e5b] text-white shadow-[0_14px_30px_-8px_rgba(47,158,91,.6)]">
                <span className="absolute inset-0 animate-ring-pulse rounded-full" />
                <svg viewBox="0 0 24 24" className="size-10" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12.5l4.5 4.5L19 7" />
                </svg>
              </span>
              <h3 id="enq-title" className="mt-6 font-serif text-[2rem] font-semibold text-ink-dark">Thank you, {values.name.trim().split(' ')[0]}!</h3>
              <p className="mt-2 max-w-[360px] text-ink-mid">
                Your enquiry for <b className="text-ink-dark">{values.course}</b> has been received. Our counsellor will call you on <b className="text-ink-dark">{values.phone}</b> shortly.
              </p>
              <button type="button" onClick={onClose} className="mt-8 rounded bg-brand px-8 py-3.5 text-[.85rem] font-bold uppercase tracking-[.08em] text-white transition hover:bg-brand-dark">
                Close
              </button>
            </div>
          ) : (
            <form noValidate onSubmit={onSubmit}>
              <h3 id="enq-title" className="pr-10 font-serif text-[2rem] font-semibold leading-[1.1] text-ink-dark">
                Enquire <em className="text-brand">Now</em>
              </h3>
              <p className="mt-1.5 mb-6 text-[.9rem] text-ink-mid">All fields are mandatory. We&apos;ll get back to you within one working day.</p>

              <div className="grid grid-cols-2 gap-x-4 gap-y-1 max-sm:grid-cols-1">
                <div className="col-span-2 max-sm:col-span-1">
                  <Field id="enq-course" label="Course" icon="cap" error={show('course')} valid={ok('course')} select>
                    <select
                      ref={firstRef}
                      id="enq-course"
                      value={values.course}
                      onChange={(e) => {
                        set('course')(e)
                        setTouched((s) => ({ ...s, course: true }))
                      }}
                      onBlur={blur('course')}
                      {...aria('course')}
                      className={cn(inputCls(show('course'), ok('course')), 'cursor-pointer appearance-none', !values.course && 'text-[#a3a9b1]')}
                    >
                      <option value="">Select a course</option>
                      {ENQUIRY_COURSES.map((c) => (
                        <option key={c} value={c} className="text-ink-dark">{c}</option>
                      ))}
                    </select>
                  </Field>
                </div>

                <div className="col-span-2 max-sm:col-span-1">
                  <Field id="enq-subject" label="Subject" icon="chat" error={show('subject')} valid={ok('subject')}>
                    <input
                      id="enq-subject"
                      type="text"
                      placeholder="e.g. Batch timings and fees"
                      value={values.subject}
                      onChange={set('subject')}
                      onBlur={blur('subject')}
                      {...aria('subject')}
                      className={inputCls(show('subject'), ok('subject'))}
                    />
                  </Field>
                </div>

                <div className="col-span-2 max-sm:col-span-1">
                  <Field id="enq-name" label="Full Name" icon="user" error={show('name')} valid={ok('name')} hint="Letters and spaces only">
                    <input
                      id="enq-name"
                      type="text"
                      autoComplete="name"
                      placeholder="Your full name"
                      value={values.name}
                      onChange={set('name')}
                      onBlur={blur('name')}
                      {...aria('name')}
                      className={inputCls(show('name'), ok('name'))}
                    />
                  </Field>
                </div>

                <Field id="enq-email" label="Email" icon="mail" error={show('email')} valid={ok('email')}>
                  <input
                    id="enq-email"
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    placeholder="name@example.com"
                    value={values.email}
                    onChange={set('email')}
                    onBlur={blur('email')}
                    {...aria('email')}
                    className={inputCls(show('email'), ok('email'))}
                  />
                </Field>

                <Field id="enq-phone" label="Mobile Number" icon="phone" error={show('phone')} valid={ok('phone')} hint="10-digit mobile number">
                  <input
                    id="enq-phone"
                    type="tel"
                    autoComplete="tel-national"
                    inputMode="numeric"
                    maxLength={10}
                    placeholder="98XXXXXXXX"
                    value={values.phone}
                    onChange={set('phone')}
                    onBlur={blur('phone')}
                    {...aria('phone')}
                    className={inputCls(show('phone'), ok('phone'))}
                  />
                </Field>
              </div>

              <button
                type="submit"
                disabled={status === 'sending'}
                className="mt-3 inline-flex w-full items-center justify-center gap-2.5 rounded-md bg-brand px-8 py-4 text-[.86rem] font-bold uppercase tracking-[.08em] text-white shadow-[0_12px_26px_-10px_rgba(0,89,168,.7)] transition duration-300 hover:-translate-y-0.5 hover:bg-brand-dark disabled:cursor-wait disabled:opacity-80"
              >
                {status === 'sending' ? (
                  <>
                    <span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" /> Sending…
                  </>
                ) : (
                  <>Submit Enquiry →</>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>,
    document.body,
  )
}
