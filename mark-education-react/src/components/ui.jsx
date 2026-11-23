import { twMerge } from 'tailwind-merge'
import { Link } from 'react-router-dom'
import { useInView } from '../hooks/useInView'

export const cn = (...classes) => twMerge(classes.filter(Boolean).join(' '))

/* ---------- Stroke icons (24×24) ---------- */
const STROKE = {
  shieldCheck: <><path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6z" /><path d="M9 12l2 2 4-4" /></>,
  shield: <path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6z" />,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" /></>,
  users: <><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.9M16 3.1a4 4 0 010 7.8" /></>,
  monitor: <><rect x="3" y="4" width="18" height="12" rx="1" /><path d="M8 20h8M12 16v4" /></>,
  briefcase: <><rect x="3" y="7" width="18" height="13" rx="1" /><path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" /></>,
  cap: <><path d="M12 3l9 5-9 5-9-5z" /><path d="M7 10.5V16c0 1.5 2.2 3 5 3s5-1.5 5-3v-5.5" /></>,
  money: <path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />,
  phone: <path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3.1 19.5 19.5 0 01-6-6A19.8 19.8 0 012.1 4.2 2 2 0 014.1 2h3a2 2 0 012 1.7c.1 1 .4 1.9.7 2.8a2 2 0 01-.5 2.1L8 9.9a16 16 0 006 6l1.3-1.3a2 2 0 012.1-.4c.9.3 1.8.6 2.8.7a2 2 0 011.7 2z" />,
  layout: <><path d="M4 4h16v16H4z" /><path d="M4 9h16M9 9v11" /></>,
  keyboard: <><rect x="2" y="6" width="20" height="12" rx="1" /><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M7 14h10" /></>,
  table: <><path d="M4 4h16v16H4z" /><path d="M4 10h16M4 15h16M10 4v16" /></>,
  sparkle: <path d="M12 3l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" />,
  bars: <path d="M5 20V10M12 20V4M19 20v-7" />,
  trend: <><path d="M3 17l6-6 4 4 8-8" /><path d="M15 7h6v6" /></>,
  ledger: <><rect x="5" y="3" width="14" height="18" rx="1" /><path d="M9 7h6M9 11h6M9 15h3" /></>,
  percent: <><circle cx="12" cy="12" r="9" /><path d="M9 15l6-6M9.5 9.5h.01M14.5 14.5h.01" /></>,
  fileCheck: <><path d="M14 3H6a1 1 0 00-1 1v16a1 1 0 001 1h12a1 1 0 001-1V8z" /><path d="M14 3v5h5M9 14l2 2 4-4" /></>,
  coin: <><circle cx="12" cy="12" r="9" /><path d="M12 7v10M9 9.5c0-1 1.3-1.5 3-1.5s3 .7 3 2-1.3 1.7-3 2-3 .8-3 2 1.3 2 3 2 3-.5 3-1.5" /></>,
  box: <><path d="M3 7l9-4 9 4-9 4z" /><path d="M3 7v10l9 4 9-4V7M12 11v10" /></>,
  chat: <path d="M21 12a8 8 0 01-11.6 7.1L4 21l1.9-5.4A8 8 0 1121 12z" />,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  star: <path d="M12 2l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z" />,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3.5 7l8.5 6 8.5-6" /></>,
  checkCircle: <><path d="M9 12l2 2 4-4" /><circle cx="12" cy="12" r="9" /></>,
}

export function Icon({ name, className = 'size-6' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={className} aria-hidden="true">
      {STROKE[name]}
    </svg>
  )
}

/* ---------- Filled icons (contact + social) ---------- */
const FILL = {
  phone: 'M6.6 10.8a15.1 15.1 0 006.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 013 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1z',
  mail: 'M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2zm0 4l-8 5-8-5V6l8 5 8-5z',
  clock: 'M12 2a10 10 0 100 20 10 10 0 000-20zm.5 5v5.3l4.5 2.7-.8 1.2L11 13V7z',
  pin: 'M12 2a7 7 0 00-7 7c0 5.3 7 13 7 13s7-7.7 7-13a7 7 0 00-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z',
  facebook: 'M14 8V6c0-.9.6-1 1-1h3V1h-4c-3.6 0-5 2.6-5 5.5V8H6v4h3v11h5V12h3.5l.5-4z',
  instagram: 'M12 7a5 5 0 100 10 5 5 0 000-10zm0 8.2a3.2 3.2 0 110-6.4 3.2 3.2 0 010 6.4zM17.3 5.5a1.2 1.2 0 100 2.4 1.2 1.2 0 000-2.4zM12 2c-2.7 0-3 0-4.1.1C3.9 2.3 2.3 4 2.1 7.9 2 9 2 9.3 2 12s0 3 .1 4.1c.2 3.9 1.8 5.6 5.8 5.8 1.1.1 1.4.1 4.1.1s3 0 4.1-.1c3.9-.2 5.6-1.9 5.8-5.8.1-1.1.1-1.4.1-4.1s0-3-.1-4.1C21.7 4 20 2.3 16.1 2.1 15 2 14.7 2 12 2z',
  google: 'M21.4 10.2H12v3.9h5.4c-.5 2.4-2.6 3.9-5.4 3.9a6 6 0 010-12c1.5 0 2.8.5 3.8 1.4l2.9-2.9A10 10 0 1012 22c5.3 0 9.6-3.8 9.6-10 0-.6 0-1.2-.2-1.8z',
}

export function FillIcon({ name, className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d={FILL[name]} />
    </svg>
  )
}

export const SOCIAL = [
  { name: 'facebook', label: 'Facebook' },
  { name: 'instagram', label: 'Instagram' },
  { name: 'google', label: 'Google Business' },
]

/* ---------- Round icon badge ---------- */
export function Ic({ name, className, iconClass = 'size-6' }) {
  return (
    <span
      className={cn(
        'grid size-[50px] shrink-0 place-items-center rounded-full bg-brand-soft text-brand transition duration-300',
        className,
      )}
    >
      <Icon name={name} className={iconClass} />
    </span>
  )
}

/* ---------- Typography ---------- */
export function Eyebrow({ children, center, light }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-3 text-[.78rem] font-bold uppercase tracking-[.22em]',
        'before:h-px before:w-9',
        center && 'after:h-px after:w-9',
        light
          ? 'text-brand-pale before:bg-brand-pale after:bg-brand-pale'
          : 'text-brand before:bg-brand after:bg-brand',
      )}
    >
      {children}
    </span>
  )
}

export function Title({ children, light, className }) {
  return (
    <h2
      className={cn(
        'mt-3.5 mb-[18px] font-serif text-[length:clamp(2rem,4vw,3rem)] font-semibold leading-[1.15] [&_em]:italic',
        light ? 'text-white [&_em]:text-brand-pale' : 'text-ink-dark [&_em]:text-brand',
        className,
      )}
    >
      {children}
    </h2>
  )
}

export function Lead({ children, center, light, className }) {
  return (
    <p className={cn('max-w-[620px]', light ? 'text-[#b5c6d9]' : 'text-ink-mid', center && 'mx-auto', className)}>
      {children}
    </p>
  )
}

export function Pill({ children, className }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-[40px] border border-brand/35 bg-white px-4 py-[7px] text-[.74rem] font-extrabold uppercase tracking-[.16em] text-brand',
        'before:size-[7px] before:rounded-full before:bg-brand',
        className,
      )}
    >
      {children}
    </span>
  )
}

/* ---------- Buttons ---------- */
export const btn =
  'inline-flex items-center gap-2.5 whitespace-nowrap rounded px-[30px] py-3.5 text-[.85rem] font-bold uppercase tracking-[.08em] transition duration-300 ease-smooth'
export const btnPrimary = `${btn} bg-brand text-white hover:bg-brand-dark hover:-translate-y-0.5`
export const btnLine = `${btn} border border-ink text-ink-dark hover:border-ink-dark hover:bg-ink-dark hover:text-white`

export const arrowBtn =
  'grid place-items-center rounded-full border border-line bg-white text-ink-dark transition duration-300 hover:border-brand hover:bg-brand hover:text-white'

/* ---------- Scroll reveal ---------- */
const HIDDEN = {
  up: '[transform:translateY(40px)]',
  left: '[transform:translateX(-50px)]',
  right: '[transform:translateX(50px)]',
}

/**
 * Fades/slides children in once scrolled into view. Adds the `in` class when
 * visible so descendant effects (e.g. `.img-wipe`) can hook onto it.
 * Uses `transform` so children can still animate the separate `translate` property on hover.
 */
export function Reveal({ as: Tag = 'div', variant = 'up', delay, className, style, children, ...rest }) {
  const [ref, inView] = useInView()
  return (
    <Tag
      ref={ref}
      className={cn(
        'transition-[opacity,transform] duration-900 ease-smooth',
        inView ? 'in opacity-100 [transform:none]' : `opacity-0 ${HIDDEN[variant]}`,
        className,
      )}
      style={{ transitionDelay: delay, ...style }}
      {...rest}
    >
      {typeof children === 'function' ? children(inView) : children}
    </Tag>
  )
}

/** Router <Link> for in-app paths ("/…"), plain <a> for hashes, tel:, external URLs. */
export function SmartLink({ href = '#', children, ...rest }) {
  if (href.startsWith('/')) {
    return (
      <Link to={href} {...rest}>
        {children}
      </Link>
    )
  }
  return (
    <a href={href} {...rest}>
      {children}
    </a>
  )
}
