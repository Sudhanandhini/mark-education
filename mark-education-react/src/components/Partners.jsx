import { Eyebrow, Reveal, Title, cn } from './ui'

// Replace each tile's svg + text with <img src="partner-logo.png" alt="Partner"> when real logos are available
const LOGOS = {
  office: { title: 'Microsoft Office', sub: 'Productivity', svg: <><rect x="4" y="4" width="15" height="15" rx="2" fill="#0059A8" /><rect x="21" y="4" width="15" height="15" rx="2" fill="#3A3A3A" /><rect x="4" y="21" width="15" height="15" rx="2" fill="#3A3A3A" /><rect x="21" y="21" width="15" height="15" rx="2" fill="#0059A8" /></> },
  tally: { title: 'Tally Prime', sub: 'Accounting', svg: <><rect x="6" y="3" width="28" height="34" rx="3" fill="#0059A8" /><path d="M12 12h16M12 19h16M12 26h10" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" /></> },
  sap: { title: 'SAP', sub: 'ERP Solutions', svg: <><path d="M20 3l15 8v18l-15 8-15-8V11z" fill="#3A3A3A" /><path d="M20 3l15 8-15 8-15-8z" fill="#0059A8" /></> },
  powerbi: { title: 'Power BI', sub: 'Analytics', svg: <><rect x="5" y="22" width="7" height="14" rx="1.5" fill="#3A3A3A" /><rect x="16" y="13" width="7" height="23" rx="1.5" fill="#0059A8" /><rect x="27" y="4" width="7" height="32" rx="1.5" fill="#F2B705" /></> },
  gst: { title: 'GST Portal', sub: 'Taxation', svg: <><circle cx="20" cy="20" r="16" fill="#0059A8" /><path d="M13 27l14-14" stroke="#fff" strokeWidth="3" strokeLinecap="round" /><circle cx="14" cy="14" r="3" fill="#fff" /><circle cx="26" cy="26" r="3" fill="#fff" /></> },
  excelai: { title: 'Excel with AI', sub: 'Smart Tools', svg: <><rect x="4" y="6" width="26" height="28" rx="3" fill="#3A3A3A" /><path d="M10 14l8 12M18 14l-8 12" stroke="#fff" strokeWidth="2.8" strokeLinecap="round" /><path d="M32 4l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" fill="#0059A8" /></> },
  efiling: { title: 'e-Filing', sub: 'Income Tax', svg: <><path d="M8 3h17l8 8v26H8z" fill="#0059A8" /><path d="M25 3v8h8" fill="#7FA8D3" /><path d="M14 23l4 4 8-9" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" /></> },
  iso: { title: 'ISO 9001:2015', sub: 'Certified Quality', svg: <><circle cx="20" cy="20" r="16" fill="#3A3A3A" /><circle cx="20" cy="20" r="11" fill="none" stroke="#F2B705" strokeWidth="2" /><path d="M15 20l4 4 7-8" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" /></> },
}

const ROW_1 = ['office', 'tally', 'sap', 'powerbi', 'gst', 'excelai', 'efiling', 'iso']
const ROW_2 = ['gst', 'excelai', 'efiling', 'iso', 'office', 'tally', 'sap', 'powerbi']

function Tile({ id, hidden }) {
  const l = LOGOS[id]
  return (
    <div
      aria-hidden={hidden || undefined}
      className="flex h-[88px] shrink-0 items-center gap-3.5 rounded-xl border border-line bg-white px-[30px] opacity-65 grayscale transition duration-350 ease-smooth hover:border-brand hover:opacity-100 hover:shadow-soft hover:grayscale-0"
    >
      <svg viewBox="0 0 40 40" className="size-10 shrink-0">{l.svg}</svg>
      <div>
        <b className="block font-serif text-[1.3rem] font-bold leading-[1.1] text-ink-dark">{l.title}</b>
        <small className="text-[.7rem] uppercase tracking-[.14em] text-ink-mid">{l.sub}</small>
      </div>
    </div>
  )
}

function Marquee({ ids, reverse, className }) {
  return (
    <div className={cn('group overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]', className)}>
      <div
        className={cn(
          'flex w-max animate-marquee gap-[22px] group-hover:[animation-play-state:paused]',
          reverse && '[animation-direction:reverse]',
        )}
      >
        {/* rendered twice for a seamless loop */}
        {ids.map((id) => <Tile key={id} id={id} />)}
        {ids.map((id) => <Tile key={`${id}-clone`} id={id} hidden />)}
      </div>
    </div>
  )
}

export default function Partners() {
  return (
    <section id="partners" className="bg-ink-light py-20">
      <Reveal className="wrap text-center">
        <Eyebrow center>Academic Partners</Eyebrow>
        <Title className="mb-0">Technologies &amp; <em>Partners</em> We Train On</Title>
      </Reveal>
      <Marquee ids={ROW_1} className="mt-11" />
      <Marquee ids={ROW_2} reverse className="mt-5" />
    </section>
  )
}
