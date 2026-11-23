import { WHY_LEFT, WHY_RIGHT } from '../data/content'
import { useInView } from '../hooks/useInView'
import { Eyebrow, Icon, Lead, Reveal, Title, cn } from './ui'

const LEFT_DELAYS = ['0s', '.15s', '.3s']
const RIGHT_DELAYS = ['.1s', '.25s', '.4s']

function WhyItem({ item, num, side, inView, delay }) {
  const left = side === 'l'
  return (
    <div
      className={cn(
        'group relative flex items-start gap-[18px] transition-[opacity,transform] duration-800 ease-smooth',
        left && 'flex-row-reverse text-right max-lg:flex-row max-lg:text-left',
        // connector line toward the centre emblem
        'after:absolute after:top-[31px] after:h-px after:w-[46px] max-xl:after:hidden',
        left
          ? 'after:-right-14 after:bg-linear-to-r after:from-brand-pale/60 after:to-transparent'
          : 'after:-left-14 after:bg-linear-to-l after:from-brand-pale/60 after:to-transparent',
        inView
          ? 'opacity-100 [transform:none]'
          : cn('opacity-0', left ? '[transform:translateX(-50px)]' : '[transform:translateX(50px)]', 'max-sm:[transform:translateY(30px)]'),
      )}
      style={{ transitionDelay: delay }}
    >
      <div className="relative grid size-[62px] shrink-0 place-items-center rounded-2xl border border-white/14 bg-white/6 text-brand-pale transition-all duration-400 ease-smooth group-hover:border-white group-hover:bg-white group-hover:text-brand group-hover:shadow-[0_0_0_8px_rgba(255,255,255,.06)]">
        <Icon name={item.icon} className="size-[26px] transition-transform duration-600 ease-smooth group-hover:[transform:rotateY(360deg)]" />
        <span
          className={cn(
            'absolute -top-[9px] grid size-6 place-items-center rounded-full border-2 border-brand-deep bg-brand text-[.64rem] font-extrabold text-white',
            left ? '-left-[9px] max-lg:left-auto max-lg:-right-[9px]' : '-right-[9px]',
          )}
        >
          {num}
        </span>
      </div>
      <div>
        <h4 className="mt-1 mb-1.5 font-serif text-[1.45rem] font-semibold leading-[1.2]">{item.title}</h4>
        <p className="text-[.88rem] text-[#b5c6d9]">{item.text}</p>
      </div>
    </div>
  )
}

function Emblem({ inView }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'relative grid aspect-square place-items-center transition-[opacity,transform] duration-1000 ease-smooth',
        'max-lg:col-span-full max-lg:row-start-1 max-lg:mx-auto max-lg:w-[280px] max-sm:w-[240px]',
        inView ? 'opacity-100 [transform:none]' : 'opacity-0 [transform:scale(.7)]',
      )}
    >
      <span className="absolute inset-0 animate-[spin_40s_linear_infinite] rounded-full border-[1.5px] border-dashed border-brand-pale/35">
        <i className="absolute -top-[5px] left-1/2 -ml-[4.5px] size-[9px] rounded-full bg-gold shadow-[0_0_14px_#F2B705]" />
      </span>
      <span className="absolute inset-[12%] animate-[spin_14s_linear_infinite_reverse] rounded-full border border-brand-pale/25">
        <i className="absolute -top-1.5 left-1/2 -ml-1.5 size-3 rounded-full bg-brand-pale shadow-[0_0_16px_#a9c8e8]" />
      </span>
      <span className="absolute inset-[26%] animate-ring-pulse rounded-full bg-white/6" />
      <div className="relative grid aspect-square w-[46%] place-items-center rounded-full bg-white text-center shadow-[0_20px_50px_rgba(0,0,0,.35)]">
        <div>
          <svg viewBox="0 0 120 92" className="mx-auto -mt-1.5 h-auto w-[62%] animate-[floaty_5s_ease-in-out_infinite]">
            <path d="M60 6 L114 30 L60 54 L6 30 Z" fill="#3A3A3A" />
            <path d="M28 42 L28 66 Q60 86 92 66 L92 42 L60 56 Z" fill="#3A3A3A" />
            <path d="M60 30 L104 33 L104 58" stroke="#F2B705" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M100 56h8l3 16h-14z" fill="#F2B705" />
            <circle cx="60" cy="30" r="4" fill="#F2B705" />
          </svg>
          <b className="mt-0.5 block font-serif text-[1.15rem] leading-none tracking-[.12em] text-ink-dark">MARK</b>
          <small className="text-[.58rem] font-extrabold uppercase tracking-[.16em] text-brand">Since 2004</small>
        </div>
      </div>
    </div>
  )
}

export default function WhyChoose() {
  const [ref, inView] = useInView()

  return (
    <section id="why" className="section-pad relative overflow-hidden bg-brand-deep text-white">
      {/* faint grid + central glow */}
      <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.035)_1px,transparent_1px)] bg-size-[56px_56px] [mask-image:radial-gradient(circle_at_50%_55%,#000_20%,transparent_75%)]" />
      <span className="pointer-events-none absolute top-[58%] left-1/2 size-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(0,89,168,.45),transparent_65%)]" />

      <div className="wrap relative z-[2]">
        <Reveal className="text-center">
          <Eyebrow center light>Why Mark</Eyebrow>
          <Title light>Why Students <em>Choose Us</em></Title>
          <Lead center light>We produce skilled manpower for industry through an innovative, practical training method.</Lead>
        </Reveal>

        <Reveal>
          <div
            ref={ref}
            className="mt-[70px] grid grid-cols-[1fr_330px_1fr] items-center gap-[60px] max-xl:grid-cols-[1fr_260px_1fr] max-xl:gap-10 max-lg:grid-cols-2 max-lg:gap-x-[30px] max-lg:gap-y-10 max-sm:grid-cols-1"
          >
            <div className="flex flex-col gap-[50px] max-lg:gap-[34px]">
              {WHY_LEFT.map((item, i) => (
                <WhyItem key={item.title} item={item} num={`0${i + 1}`} side="l" inView={inView} delay={LEFT_DELAYS[i]} />
              ))}
            </div>
            <Emblem inView={inView} />
            <div className="flex flex-col gap-[50px] max-lg:gap-[34px]">
              {WHY_RIGHT.map((item, i) => (
                <WhyItem key={item.title} item={item} num={`0${i + 4}`} side="r" inView={inView} delay={RIGHT_DELAYS[i]} />
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
