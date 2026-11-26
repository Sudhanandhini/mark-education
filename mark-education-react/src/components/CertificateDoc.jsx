import { useId } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import logo from '../assets/certificate/logo.png'
import signature from '../assets/certificate/signature.png'

/*
 * "Certificate of Merit": an HTML copy of the printed certificate (src/assets/7185283xx.jpg).
 * The original is 1414 × 2000 px. Positions are % of that size and font sizes are in cqw
 * (1cqw = 1% of the certificate width), so the whole certificate scales with its container.
 */

const BLUE = '#0B5DA7'
const THEMES = {
  // Tally Prime and anything else
  blue: { frame: BLUE, swoosh: BLUE, title: '#000', text: '#111', accent: BLUE, parent: '#000', label: BLUE, value: '#222', verify: BLUE, signer: '#333' },
  // Advanced Excel
  orange: { frame: '#E8991A', swoosh: '#FBB92F', title: '#000', text: '#111', accent: '#E8991A', parent: '#000', label: '#E8991A', value: '#222', verify: '#E8991A', signer: '#333' },
  // Power BI
  grey: { frame: '#646464', swoosh: '#5E5E5E', title: BLUE, text: BLUE, accent: '#5E5E5E', parent: BLUE, label: '#5E5E5E', value: BLUE, verify: '#5E5E5E', signer: BLUE },
}

export function themeFor(course = '') {
  if (/excel/i.test(course)) return 'orange'
  if (/power\s*bi/i.test(course)) return 'grey'
  return 'blue'
}

const px = (n) => `${n / 14.14}cqw` // original px → cqw
const fit = (text = '', size, maxChars) => px(size * Math.min(1, maxChars / Math.max(text.length, 1)))
const line = (y) => ({ top: `${y / 20}%` }) // y in original px → % of height

export default function CertificateDoc({ c, verifyUrl, watermark, revoked = false, className = '' }) {
  const t = THEMES[themeFor(c.course)]
  const clip = useId().replace(/:/g, '')

  const center = 'absolute inset-x-[6%] -translate-y-1/2 text-center leading-[1.15]'
  const poppins = { fontFamily: "'Poppins', 'Mulish', sans-serif" }
  const open = { fontFamily: "'Open Sans', 'Mulish', sans-serif" }

  return (
    <div
      className={`relative aspect-[1414/2000] w-full select-none overflow-hidden bg-white [container-type:inline-size] ${className}`}
      style={open}
      role="img"
      aria-label={`Certificate of Merit awarded to ${c.name} for ${c.course}, grade ${c.grade}, certificate number ${c.certificateNo}`}
    >
      {/* frame, white card, bottom-left swoosh */}
      <svg viewBox="0 0 1414 2000" className="absolute inset-0 size-full" aria-hidden="true">
        <defs>
          <clipPath id={clip}><rect x="46" y="62" width="1322" height="1876" rx="40" /></clipPath>
        </defs>
        <rect width="1414" height="2000" fill={t.frame} />
        <rect x="46" y="62" width="1322" height="1876" rx="40" fill="#fff" />
        <g clipPath={`url(#${clip})`} fill="none" stroke={t.swoosh} strokeWidth="17">
          <path d="M30 1960 C 200 1790 420 1752 612 1780" />
          <circle cx="707" cy="1813" r="100" />
        </g>
      </svg>

      <img src={logo} alt="" className="absolute right-[6.8%] top-[5.6%] w-[27.9%]" draggable="false" />

      <h3 className={center} style={{ ...line(345), color: t.title, fontSize: px(108), fontWeight: 700, letterSpacing: '-.01em' }}>
        Certificate of Merit
      </h3>

      <p className={center} style={{ ...line(483), ...poppins, color: t.text, fontSize: px(36) }}>This Certificate is awarded to</p>
      <p className={`${center} whitespace-nowrap`} style={{ ...line(578), color: t.accent, fontSize: fit(c.name, 72, 24), fontWeight: 700 }}>{c.name}</p>
      <p className={center} style={{ ...line(668), ...poppins, color: t.text, fontSize: px(36) }}>Son/Daughter/Spouse of</p>
      <p className={`${center} whitespace-nowrap`} style={{ ...line(770), color: t.parent, fontSize: fit(c.parentName, 44, 34), fontWeight: 700 }}>{c.parentName}</p>
      <p className={center} style={{ ...line(875), ...poppins, color: t.text, fontSize: px(36) }}>For Successfully Completing</p>
      <p className={`${center} whitespace-nowrap`} style={{ ...line(1000), color: t.accent, fontSize: fit(c.course, 64, 28), fontWeight: 700 }}>{c.course}</p>
      <p className={center} style={{ ...line(1105), ...poppins, color: t.text, fontSize: px(36) }}>
        and Securing&nbsp; {c.grade}
      </p>

      {/* bottom-left: centre + issue details */}
      <div className="absolute left-[7.9%] right-[44%] -translate-y-1/2 leading-[1.2]" style={{ ...line(1328), fontSize: px(27) }}>
        <b style={{ color: t.label }}>Centre:</b>&nbsp;&nbsp; <span style={{ ...poppins, color: t.value }}>{c.institution}</span>
      </div>
      <div className="absolute left-[7.9%] right-[30%]" style={{ top: `${1412 / 20}%`, ...poppins, color: t.value, fontSize: px(25.5), lineHeight: px(32) }}>
        <div>Place of Issue:&nbsp; {c.placeOfIssue}</div>
        <div>Date Certified:&nbsp; {c.certificateDate}</div>
        {c.software && <div>Software : {c.software}</div>}
      </div>

      {/* bottom-right: number, QR, verify, signature */}
      <div className="absolute right-[8.8%] -translate-y-1/2 whitespace-nowrap" style={{ ...line(1328), fontSize: px(27) }}>
        <b style={{ color: t.label }}>Certificate Number:</b>&nbsp;&nbsp; <span style={{ ...poppins, color: t.value }}>{c.certificateNo}</span>
      </div>

      <div
        className="absolute left-[75.9%] top-[67.4%] grid h-[12%] w-[16.2%] place-items-center bg-white"
        style={{ border: `${px(2.5)} solid #111`, borderRadius: px(22), padding: px(16) }}
      >
        {verifyUrl && <QRCodeSVG value={verifyUrl} level="M" marginSize={0} className="size-full" title="Scan to verify this certificate" />}
      </div>

      <div className="absolute left-[71%] right-[3%] text-center" style={{ top: `${1596 / 20}%` }}>
        <b className="block" style={{ color: t.verify, fontSize: px(26), letterSpacing: '.01em' }}>VERIFY ME</b>
        <span className="block" style={{ color: '#222', fontSize: px(20.5), marginTop: px(2) }}>markeducationacademy.com</span>
      </div>

      <img src={signature} alt="" className="absolute left-[76.5%] top-[85.5%] w-[13.2%]" draggable="false" />
      <div className="absolute left-[71%] right-[3%] text-center" style={{ top: `${1772 / 20}%`, color: t.signer, fontSize: px(22.5), lineHeight: px(29) }}>
        <div>Manjunath</div>
        <div>Centre Head</div>
        <div>Mark Education Academy</div>
        <div>Bengaluru</div>
      </div>

      {watermark && (
        <span
          className="pointer-events-none absolute left-1/2 top-[52%] -translate-x-1/2 -translate-y-1/2 -rotate-[28deg] font-extrabold uppercase tracking-[.12em]"
          style={{ color: 'rgba(20,30,45,.07)', fontSize: px(250) }}
          aria-hidden="true"
        >
          {watermark}
        </span>
      )}

      {revoked && (
        <span
          className="pointer-events-none absolute left-1/2 top-[45%] -translate-x-1/2 -translate-y-1/2 -rotate-[18deg] font-extrabold uppercase tracking-[.14em]"
          style={{ color: 'rgba(200,40,40,.78)', border: `${px(9)} solid rgba(200,40,40,.78)`, borderRadius: px(18), fontSize: px(150), padding: `${px(4)} ${px(40)}`, background: 'rgba(255,255,255,.55)' }}
          aria-hidden="true"
        >
          Revoked
        </span>
      )}
    </div>
  )
}
