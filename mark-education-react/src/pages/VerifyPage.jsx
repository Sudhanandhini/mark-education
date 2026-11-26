import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import CertificateDoc from '../components/CertificateDoc'
import Cta from '../components/Cta'
import { Icon, Reveal, SmartLink, btnPrimary, cn } from '../components/ui'

const API = `${import.meta.env.VITE_API_BASE ?? import.meta.env.BASE_URL.replace(/\/$/, '')}/api/verify.php`
const CERT_RE = /^[A-Z0-9-]{4,30}$/
const normalize = (v) => v.replace(/\s+/g, '').toUpperCase()
const verifyUrl = (no) => `${window.location.origin}${import.meta.env.BASE_URL}verify-certificate?no=${encodeURIComponent(no)}`

/* ---------- Hero illustration (animated SVG) ---------- */
function Illustration() {
  return (
    <svg viewBox="0 0 420 340" className="h-auto w-full" aria-hidden="true">
      <defs>
        <linearGradient id="vi-board" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#f1f5fb" />
        </linearGradient>
      </defs>
      {/* soft blobs */}
      <circle cx="80" cy="250" r="70" fill="#0059A8" opacity=".06" />
      <circle cx="350" cy="80" r="50" fill="#F2B705" opacity=".12" className="animate-[floaty_6s_ease-in-out_infinite]" />

      {/* clipboard */}
      <g className="animate-[floaty_7s_ease-in-out_infinite]">
        <rect x="120" y="40" width="200" height="270" rx="14" fill="#d9e2ee" />
        <rect x="130" y="50" width="180" height="250" rx="10" fill="url(#vi-board)" />
        <rect x="180" y="26" width="80" height="34" rx="8" fill="#0059A8" />
        <rect x="205" y="18" width="30" height="14" rx="5" fill="#003F7A" />
        <rect x="160" y="82" width="120" height="16" rx="4" fill="#0059A8" opacity=".85" />
        <rect x="160" y="108" width="90" height="8" rx="4" fill="#a9c8e8" />
        {[160, 200, 240].map((y, i) => (
          <g key={y}>
            <path
              d={`M160 ${y + 6} l7 7 13-14`}
              fill="none" stroke="#0059A8" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"
              strokeDasharray="40" strokeDashoffset="40"
              style={{ animation: `vi-draw .6s ${0.6 + i * 0.35}s ease forwards` }}
            />
            <rect x="192" y={y + 2} width={i === 1 ? 70 : 92} height="9" rx="4.5" fill="#c9d8ea" />
          </g>
        ))}
      </g>

      {/* ribbon badge */}
      <g className="animate-[floaty_5s_ease-in-out_infinite_.6s]">
        <path d="M86 150 l-14 52 20-8 12 18 10-50z" fill="#003F7A" />
        <path d="M124 150 l14 52 -20-8 -12 18 -10-50z" fill="#0059A8" />
        <g style={{ transformOrigin: '105px 130px', animation: 'spin 24s linear infinite' }}>
          {Array.from({ length: 16 }).map((_, i) => (
            <circle key={i} cx={105 + 36 * Math.cos((i / 16) * Math.PI * 2)} cy={130 + 36 * Math.sin((i / 16) * Math.PI * 2)} r="9" fill="#0059A8" />
          ))}
        </g>
        <circle cx="105" cy="130" r="36" fill="#0059A8" />
        <circle cx="105" cy="130" r="25" fill="#fff" />
        <path d="M94 131 l8 8 15-16" fill="none" stroke="#0059A8" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      {/* magnifier */}
      <g className="animate-[floaty_6s_ease-in-out_infinite_1.2s]">
        <circle cx="330" cy="210" r="30" fill="#fff" stroke="#3A3A3A" strokeWidth="8" />
        <circle cx="330" cy="210" r="18" fill="#e8f0f8" />
        <path d="M352 232 l26 26" stroke="#3A3A3A" strokeWidth="12" strokeLinecap="round" />
        <path d="M321 210 l6 6 11-11" fill="none" stroke="#2f9e5b" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      {/* sparkles */}
      {[[60, 70, 0], [380, 150, 0.8], [250, 320, 1.6]].map(([x, y, d]) => (
        <path
          key={x}
          d={`M${x} ${y - 9} l2.5 6.5 6.5 2.5 -6.5 2.5 -2.5 6.5 -2.5-6.5 -6.5-2.5 6.5-2.5z`}
          fill="#F2B705"
          style={{ transformOrigin: `${x}px ${y}px`, animation: `vi-twinkle 2.4s ${d}s ease-in-out infinite` }}
        />
      ))}
      <style>{`
        @keyframes vi-draw { to { stroke-dashoffset: 0 } }
        @keyframes vi-twinkle { 0%,100% { transform: scale(.4); opacity: .3 } 50% { transform: scale(1); opacity: 1 } }
      `}</style>
    </svg>
  )
}

/* ---------- Result states ---------- */
function Detail({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg bg-brand-soft text-brand">
        <Icon name={icon} className="size-[17px]" />
      </span>
      <div className="min-w-0">
        <small className="block text-[.72rem] font-bold uppercase tracking-[.08em] text-ink-mid">{label}</small>
        <b className="block break-words text-[1.02rem] font-bold text-brand-dark">{value || '—'}</b>
      </div>
    </div>
  )
}

function GradeTable({ grades, current }) {
  return (
    <Reveal className="mt-6 overflow-hidden rounded-2xl bg-white shadow-soft">
      <h3 className="bg-brand-soft px-6 py-4 font-serif text-[1.5rem] font-semibold text-ink-dark">Grade Description</h3>
      <table className="w-full text-left text-[.92rem]">
        <thead>
          <tr className="bg-[#f6f9fc] text-[.76rem] uppercase tracking-[.1em] text-ink-mid">
            <th className="px-6 py-3 font-bold">Grade</th>
            <th className="px-6 py-3 font-bold">Description</th>
          </tr>
        </thead>
        <tbody>
          {grades.map((g) => {
            const on = g.grade === current
            return (
              <tr key={g.grade} className={cn('border-t border-line transition-colors', on && 'bg-brand-soft/60')}>
                <td className="px-6 py-3.5">
                  <span className={cn('inline-grid h-8 min-w-8 place-items-center rounded-full px-2 text-[.8rem] font-extrabold text-white', on ? 'bg-brand' : 'bg-ink-mid')}>
                    {g.grade}
                  </span>
                  {on && <span className="ml-3 text-[.72rem] font-bold uppercase tracking-[.1em] text-brand">This certificate</span>}
                </td>
                <td className="px-6 py-3.5 font-semibold text-ink-dark">{g.description}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </Reveal>
  )
}

function VerifiedCard({ c, grades }) {
  const revoked = c.status === 'revoked'
  return (
    <div className="animate-rise">
      <div className="overflow-hidden rounded-2xl bg-white shadow-[0_24px_60px_-24px_rgba(11,37,69,.35)]">
        <div className={cn('relative flex items-center gap-4 overflow-hidden px-6 py-4 text-white', revoked ? 'bg-linear-90 from-[#b83232] to-[#d64545]' : 'bg-linear-90 from-brand-dark to-brand')}>
          <span className="absolute -top-10 -right-10 size-32 rounded-full border-[18px] border-white/10" />
          <span className="relative grid size-11 shrink-0 place-items-center rounded-full bg-white">
            {revoked ? (
              <Icon name="xCircle" className="size-7 text-[#d64545]" />
            ) : (
              <svg viewBox="0 0 24 24" className="size-6 text-brand" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12.5l4.5 4.5L19 7" strokeDasharray="24" strokeDashoffset="24" style={{ animation: 'vi-draw .5s .25s ease forwards' }} />
              </svg>
            )}
          </span>
          <div className="relative">
            <h2 className="font-serif text-[1.7rem] font-semibold leading-none">{revoked ? 'Certificate Revoked' : 'Certificate Verified'}</h2>
            <p className="mt-1 text-[.88rem] text-white/85">{revoked ? 'This certificate is no longer valid. Please contact the institute.' : 'Valid certificate found'}</p>
          </div>
        </div>

        <div className="grid grid-cols-[minmax(0,500px)_1fr] items-start gap-8 p-7 max-lg:grid-cols-1 max-sm:p-4">
          <div className="mx-auto w-full max-w-[500px] overflow-hidden rounded-lg shadow-[0_18px_40px_-18px_rgba(11,37,69,.45)]">
            <CertificateDoc c={c} verifyUrl={verifyUrl(c.certificateNo)} revoked={revoked} />
          </div>

          <div>
            <div className="mb-5 flex items-center justify-between gap-3">
              <h3 className="font-serif text-[1.6rem] font-semibold text-ink-dark">Certificate Details</h3>
              <span className={cn('rounded-full px-3 py-1 text-[.7rem] font-extrabold uppercase tracking-[.12em]', revoked ? 'bg-[#fdecec] text-[#a12c2c]' : 'bg-[#e9f7ef] text-[#1f6e41]')}>
                {revoked ? '✕ Revoked' : '✓ Authentic'}
              </span>
            </div>
            <div className="grid gap-5">
              <Detail icon="user" label="Awarded to" value={c.name} />
              <Detail icon="users" label="Son / Daughter / Spouse of" value={c.parentName} />
              <Detail icon="award" label="Course Completed" value={c.course} />
              <Detail icon="star" label="Grade Secured" value={c.grade} />
              <Detail icon="hash" label="Certificate Number" value={c.certificateNo} />
              <Detail icon="calendar" label="Date Certified" value={c.certificateDate} />
              <Detail icon="building" label="Centre" value={`${c.institution}${c.placeOfIssue ? `, ${c.placeOfIssue}` : ''}`} />
              {c.software && <Detail icon="ledger" label="Software" value={c.software} />}
            </div>
          </div>
        </div>
      </div>
      {!revoked && grades?.length > 0 && <GradeTable grades={grades} current={c.grade} />}
    </div>
  )
}

function MessageCard({ tone, title, message, number }) {
  const red = tone === 'error'
  return (
    <div className="animate-rise rounded-2xl bg-white p-8 text-center shadow-[0_24px_60px_-24px_rgba(11,37,69,.3)] max-sm:p-6">
      <span className={cn('mx-auto grid size-16 place-items-center rounded-full', red ? 'bg-[#fdecec] text-[#d64545]' : 'bg-[#fff6dc] text-[#b98900]')}>
        <Icon name={red ? 'xCircle' : 'alert'} className="size-8" />
      </span>
      <h2 className="mt-4 font-serif text-[1.9rem] font-semibold text-ink-dark">{title}</h2>
      {number && <p className="mt-1 font-mono text-[.95rem] font-bold tracking-wider text-ink-mid">{number}</p>}
      <p className="mx-auto mt-2 max-w-[460px] text-ink-mid">{message}</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <SmartLink href="/contact" className={btnPrimary}>Contact Us</SmartLink>
      </div>
    </div>
  )
}

function LoadingCard() {
  return (
    <div className="animate-rise overflow-hidden rounded-2xl bg-white shadow-soft" aria-busy="true" aria-label="Verifying certificate">
      <div className="h-[76px] animate-pulse bg-brand/20" />
      <div className="grid grid-cols-2 gap-6 p-8 max-sm:grid-cols-1">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex gap-3">
            <span className="size-8 animate-pulse rounded-lg bg-ink-light" />
            <div className="flex-1 space-y-2">
              <span className="block h-2.5 w-20 animate-pulse rounded bg-ink-light" />
              <span className="block h-3.5 w-40 animate-pulse rounded bg-ink-light" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ---------- Sample certificates (one per course colour) ---------- */
const SAMPLES = [
  { course: 'Tally Prime Foundation', software: 'Tally Prime', name: 'Ananya R Rao', parentName: 'Ramesh Rao', certificateNo: 'ME100001', certificateDate: '29-Jan-2026' },
  { course: 'Advanced Excel', software: 'Microsoft Office Excel', name: 'Kiran S Kumar', parentName: 'Suresh Kumar', certificateNo: 'ME100002', certificateDate: '14-Mar-2026' },
  { course: 'Power BI Data Analytics', software: 'Microsoft Power BI', name: 'Meera K Shetty', parentName: 'Kishore Shetty', certificateNo: 'ME100004', certificateDate: '02-Nov-2025' },
].map((x) => ({ grade: 'A+', institution: 'Mark Education Academy', placeOfIssue: 'Bengaluru', ...x }))

/* ---------- Annotated sample: what each part of the certificate means ----------
 * y = vertical centre of the field, box = [left, top, right, bottom] — all in % of the
 * certificate (matches the layout in CertificateDoc, which is 1414 × 2000 px).
 */
const PARTS = [
  { side: 'left', y: 28.9, box: [18, 26.4, 82, 31.4], label: 'Name', text: 'Full name of the student, exactly as registered at admission.' },
  { side: 'left', y: 38.5, box: [27, 36.5, 73, 40.5], label: 'Parent / Spouse Name', text: "Father's, mother's or spouse's name — helps tell apart students with the same name." },
  { side: 'right', y: 50, box: [14, 47.6, 86, 52.4], label: 'Course Name', text: 'The programme the student has successfully completed.' },
  { side: 'right', y: 55.3, box: [32, 53.5, 68, 57.1], label: 'Grade', text: 'Final grade secured in the course assessment. The grade description is shown when you verify.' },
  { side: 'left', y: 66.4, box: [6.5, 64.9, 56, 67.9], label: 'Centre Name', text: 'The Mark Education centre where the training was completed.' },
  { side: 'right', y: 66.4, box: [58, 64.9, 93, 67.9], label: 'Certificate Number', text: 'Unique number of this certificate. Enter it in the box above to verify it online.' },
  { side: 'left', y: 73.2, box: [6.5, 70.2, 60, 76.2], label: 'Issue Details', text: 'Place of issue, the date the certificate was awarded and the software / release studied.' },
  { side: 'right', y: 75.2, box: [72, 67, 96, 83.2], label: 'QR Code', text: 'Scan with any phone camera to open this certificate on our verification page instantly.' },
  { side: 'right', y: 90, box: [72, 85, 96, 95], label: 'Signatory Authority', text: 'Signature of the authorised centre head who issued the certificate.' },
].map((p, i) => ({ ...p, n: i + 1 }))

function Num({ n, className }) {
  return (
    <span className={cn('grid size-6 shrink-0 place-items-center rounded-full bg-brand text-[.7rem] font-extrabold text-white', className)}>{n}</span>
  )
}

function Callouts({ side }) {
  const left = side === 'left'
  return (
    <div className="relative max-lg:hidden">
      {PARTS.filter((p) => p.side === side).map((p) => (
        <div
          key={p.n}
          className={cn('absolute inset-x-0 flex -translate-y-1/2 items-center', !left && 'flex-row-reverse')}
          style={{ top: `${p.y}%` }}
        >
          <span className={cn('flex shrink-0 items-center gap-2 rounded-lg border border-line bg-white py-1.5 text-[.84rem] font-bold text-ink-dark shadow-soft', left ? 'pl-1.5 pr-3' : 'pl-3 pr-1.5 flex-row-reverse')}>
            <Num n={p.n} />
            {p.label}
          </span>
          <span className="h-0 flex-1 border-t-[1.5px] border-dashed border-brand/50" />
        </div>
      ))}
    </div>
  )
}

function AnnotatedCertificate() {
  const sample = SAMPLES[0]
  return (
    <div className="mt-12">
      <Reveal className="mx-auto grid max-w-[1080px] grid-cols-[1fr_minmax(0,460px)_1fr] max-lg:grid-cols-1">
        <Callouts side="left" />

        <div className="relative mx-auto w-full max-w-[460px]">
          <div className="overflow-hidden rounded-lg shadow-[0_24px_60px_-24px_rgba(11,37,69,.45)]">
            <CertificateDoc c={sample} watermark="Sample" verifyUrl={verifyUrl(sample.certificateNo)} />
          </div>

          {/* highlight boxes + connectors from the certificate edge */}
          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
            {PARTS.map((p) => {
              const [l, t, r, b] = p.box
              const left = p.side === 'left'
              return (
                <div key={p.n}>
                  <span
                    className="absolute rounded-md border-[1.5px] border-brand/70 bg-brand/[.04]"
                    style={{ left: `${l}%`, top: `${t}%`, width: `${r - l}%`, height: `${b - t}%` }}
                  >
                    <Num n={p.n} className="absolute -top-2.5 -left-2.5 size-5 text-[.62rem] lg:hidden" />
                  </span>
                  <span
                    className="absolute h-0 border-t-[1.5px] border-dashed border-brand/50 max-lg:hidden"
                    style={left ? { left: 0, width: `${l}%`, top: `${p.y}%` } : { left: `${r}%`, right: 0, top: `${p.y}%` }}
                  />
                  <span
                    className={cn('absolute size-0 -translate-y-1/2 border-y-[5px] border-y-transparent max-lg:hidden', left ? 'border-l-[7px] border-l-brand' : 'border-r-[7px] border-r-brand')}
                    style={left ? { left: `calc(${l}% - 7px)`, top: `${p.y}%` } : { left: `${r}%`, top: `${p.y}%` }}
                  />
                </div>
              )
            })}
          </div>
        </div>

        <Callouts side="right" />
      </Reveal>

      {/* explanation of every numbered part */}
      <div className="mx-auto mt-12 grid max-w-[1080px] grid-cols-3 gap-4 max-lg:grid-cols-2 max-sm:grid-cols-1">
        {PARTS.map((p, i) => (
          <Reveal key={p.n} delay={`${(i % 3) * 0.08}s`} className="flex gap-3 rounded-xl border border-line bg-white p-4 shadow-soft">
            <Num n={p.n} className="mt-0.5" />
            <div>
              <h4 className="text-[.95rem] font-bold text-ink-dark">{p.label}</h4>
              <p className="mt-1 text-[.86rem] leading-relaxed text-ink-mid">{p.text}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  )
}

function SampleCertificate() {
  return (
    <section className="section-pad bg-[#fafbfc]">
      <div className="wrap">
        <Reveal className="text-center">
          <h2 className="font-serif text-[length:clamp(2rem,4vw,2.8rem)] font-semibold text-ink-dark">Sample <em className="text-brand">Certificate</em></h2>
          <p className="mx-auto mt-2 max-w-[600px] text-ink-mid">
            Here is what each part of a Mark Education certificate means. Every certificate carries a unique <b className="text-ink-dark">Certificate Number</b> (next to the QR code). Enter it above, or scan the QR code, to verify.
          </p>
        </Reveal>

        <AnnotatedCertificate />

        <Reveal className="mt-20 text-center">
          <h3 className="font-serif text-[length:clamp(1.6rem,3vw,2.2rem)] font-semibold text-ink-dark">Certificate <em className="text-brand">Designs</em></h3>
          <p className="mx-auto mt-2 max-w-[560px] text-ink-mid">The colour of the certificate depends on the course. All designs carry the same details.</p>
        </Reveal>

        <div className="mx-auto mt-10 grid max-w-[1080px] grid-cols-3 gap-8 max-lg:grid-cols-2 max-sm:grid-cols-1">
          {SAMPLES.map((c, i) => (
            <Reveal key={c.course} delay={`${i * 0.1}s`} className={cn('mx-auto w-full max-w-[360px]', i === 2 && 'max-lg:col-span-2 max-sm:col-span-1')}>
              <div className="overflow-hidden rounded-lg shadow-[0_18px_40px_-20px_rgba(11,37,69,.45)] transition-[translate,box-shadow] duration-300 hover:-translate-y-1.5 hover:shadow-[0_28px_50px_-20px_rgba(11,37,69,.5)]">
                <CertificateDoc c={c} watermark="Sample" />
              </div>
              <p className="mt-3 text-center text-[.9rem] font-bold text-ink-dark">{c.course}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------- Page ---------- */
export default function VerifyPage() {
  const [params, setParams] = useSearchParams()
  const queryNo = normalize(params.get('no') || '')
  const [input, setInput] = useState(queryNo)
  const [inputError, setInputError] = useState('')
  const [state, setState] = useState({ status: queryNo ? 'loading' : 'idle' })
  const resultRef = useRef(null)

  useEffect(() => {
    document.title = 'Verify Certificate | Mark Education Academy'
  }, [])

  // Look up whenever ?no= changes (also supports shared links / QR codes)
  useEffect(() => {
    if (!queryNo) {
      setState({ status: 'idle' })
      return
    }
    setInput(queryNo)
    if (!CERT_RE.test(queryNo)) {
      setState({ status: 'invalid', number: queryNo })
      return
    }
    const ctrl = new AbortController()
    setState({ status: 'loading' })
    fetch(`${API}?certificate_no=${encodeURIComponent(queryNo)}`, { signal: ctrl.signal, headers: { Accept: 'application/json' } })
      .then(async (res) => {
        const body = await res.json().catch(() => null)
        if (res.ok && body?.found) setState({ status: 'found', data: body })
        else if (res.status === 404) setState({ status: 'notfound', number: queryNo, message: body?.message })
        else if (res.status === 422) setState({ status: 'invalid', number: queryNo, message: body?.message })
        else setState({ status: 'error', message: body?.message })
      })
      .catch((err) => {
        if (err.name !== 'AbortError') setState({ status: 'error' })
      })
    return () => ctrl.abort()
  }, [queryNo])

  // Bring the result into view once it arrives
  useEffect(() => {
    if (state.status !== 'idle' && state.status !== 'loading') {
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [state.status])

  const onSubmit = (e) => {
    e.preventDefault()
    const no = normalize(input)
    if (!no) return setInputError('Please enter your certificate number.')
    if (!CERT_RE.test(no)) return setInputError('Use 4–30 letters, digits or hyphens (e.g. ME100001).')
    setInputError('')
    if (no === queryNo) {
      // same number again → re-run the lookup
      setParams({}, { replace: true })
      setTimeout(() => setParams({ no }), 0)
    } else {
      setParams({ no })
    }
  }

  const hasResult = state.status !== 'idle'

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-linear-120 from-[#eef5fb] via-[#f7fafd] to-white py-20 max-lg:py-14">
        <span className="pointer-events-none absolute -top-24 -left-24 size-[360px] rounded-full bg-[radial-gradient(circle,rgba(0,89,168,.10),transparent_70%)]" />
        <div className="wrap relative grid grid-cols-[1.15fr_.85fr] items-center gap-12 max-lg:grid-cols-1">
          <div>
            <nav aria-label="Breadcrumb" className="mb-5 flex animate-rise items-center gap-2 text-[.8rem] font-semibold text-ink-mid">
              <SmartLink href="/" className="hover:text-brand">Home</SmartLink>
              <span className="text-line">/</span>
              <span className="text-brand">Certificate Verification</span>
            </nav>
            <h1 className="animate-rise font-serif text-[length:clamp(2.4rem,5vw,3.6rem)] font-semibold leading-[1.05] text-brand [animation-delay:.08s]">
              Verify Your <em className="text-ink-dark">Certificate</em>
            </h1>
            <p className="mt-5 max-w-[560px] animate-rise text-[1.02rem] text-ink-mid [animation-delay:.16s]">
              Validate your expertise with confidence! Verify your Mark Education Academy certificate and showcase your accredited skills to potential employers.
            </p>

            <form onSubmit={onSubmit} noValidate className="mt-8 max-w-[520px] animate-rise [animation-delay:.24s]">
              <label htmlFor="cert-no" className="mb-2 block text-[.76rem] font-bold uppercase tracking-[.1em] text-ink-dark">Certificate Number</label>
              <div className={cn('flex overflow-hidden rounded-lg border bg-white shadow-soft transition focus-within:shadow-[0_0_0_4px_rgba(0,89,168,.12)] max-sm:flex-col', inputError ? 'border-[#d64545]' : 'border-line focus-within:border-brand')}>
                <span className="grid place-items-center pl-4 text-ink-mid max-sm:hidden">
                  <Icon name="search" className="size-5" />
                </span>
                <input
                  id="cert-no"
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value.toUpperCase().replace(/[^A-Z0-9\s-]/g, '').slice(0, 30))
                    if (inputError) setInputError('')
                  }}
                  placeholder="e.g. ME100001"
                  autoComplete="off"
                  spellCheck="false"
                  aria-invalid={!!inputError}
                  aria-describedby="cert-no-msg"
                  className="min-w-0 flex-1 bg-transparent px-4 py-4 font-mono text-[1.02rem] font-bold tracking-wider text-ink-dark outline-none placeholder:font-sans placeholder:font-normal placeholder:tracking-normal placeholder:text-[#a3a9b1]"
                />
                <button
                  type="submit"
                  disabled={state.status === 'loading'}
                  className="inline-flex items-center justify-center gap-2 bg-brand px-7 py-4 text-[.84rem] font-bold uppercase tracking-[.08em] text-white transition hover:bg-brand-dark disabled:cursor-wait disabled:opacity-80"
                >
                  {state.status === 'loading' ? (
                    <><span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" /> Verifying…</>
                  ) : (
                    'Verify Certificate'
                  )}
                </button>
              </div>
              <p id="cert-no-msg" className={cn('mt-2 min-h-5 text-[.8rem]', inputError ? 'font-semibold text-[#d64545]' : 'text-ink-mid')} role={inputError ? 'alert' : undefined}>
                {inputError || 'Find the certificate number on the right side of your certificate, above the QR code.'}
              </p>
            </form>
          </div>

          <div className="mx-auto w-full max-w-[440px] animate-rise [animation-delay:.2s] max-lg:max-w-[360px]">
            <Illustration />
          </div>
        </div>
      </section>

      {/* Result */}
      {hasResult && (
        <section ref={resultRef} className="scroll-mt-[90px] bg-linear-180 from-[#eef5fb] to-[#f7fafd] py-14">
          <div className="wrap max-w-[1000px]">
            {state.status === 'loading' && <LoadingCard />}
            {state.status === 'found' && <VerifiedCard c={state.data.certificate} grades={state.data.grades} />}
            {state.status === 'notfound' && (
              <MessageCard
                tone="error"
                title="Certificate Not Found"
                number={state.number}
                message={state.message || 'No certificate matches this number. Please check the number on your certificate and try again.'}
              />
            )}
            {state.status === 'invalid' && (
              <MessageCard tone="warn" title="Invalid Certificate Number" number={state.number} message={state.message || 'Certificate numbers contain only letters, digits and hyphens.'} />
            )}
            {state.status === 'error' && (
              <MessageCard tone="warn" title="Service Unavailable" message={state.message || 'We could not reach the verification service. Please check your connection and try again in a moment.'} />
            )}
          </div>
        </section>
      )}

      {!hasResult && <SampleCertificate />}

      {/* CTA */}
      <section className="bg-white py-16">
        <div className="wrap">
          <Reveal className="flex flex-wrap items-center justify-between gap-6 rounded-2xl bg-brand-soft px-10 py-8 max-sm:px-6">
            <h3 className="font-serif text-[length:clamp(1.5rem,3vw,2rem)] font-semibold text-ink-dark">
              Learn, Earn, and Grow with <em className="text-brand">Mark Certification</em>
            </h3>
            <SmartLink href="/courses" className={btnPrimary}>View All Courses</SmartLink>
          </Reveal>
        </div>
      </section>

       <Cta />
    </>
  )
}
