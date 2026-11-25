import { Link } from 'react-router-dom'
import { Eyebrow } from './ui'

/** Inner-page header: dark brand banner with a slow-zooming photo, breadcrumb and staggered title. */
/**
 * `position` sets which part of the photo stays visible (CSS background-position), e.g. 'center 20%'.
 * `fit="right"` shows the photo on the right half at banner height (good for small images or a
 * subject that should sit beside the title), fading its left edge into the background.
 */
export default function PageBanner({ eyebrow, title, text, crumb, image, position = 'center', fit = 'cover' }) {
  const rise = (i) => ({ className: 'animate-rise', style: { animationDelay: `${0.1 + i * 0.12}s` } })

  return (
    <section className="relative overflow-hidden bg-brand-deep py-[110px] text-white max-lg:py-24 max-sm:py-[72px]">
      {fit === 'right' ? (
        <div
          className="absolute inset-0 animate-kenburns bg-no-repeat [mask-image:linear-gradient(90deg,transparent_calc(100%-720px),#000_calc(100%-430px))]"
          style={{ backgroundImage: `url('${image}')`, backgroundPosition: position === 'center' ? 'right center' : position, backgroundSize: 'auto 100%' }}
        />
      ) : (
        <div className="absolute inset-0 animate-kenburns bg-cover" style={{ backgroundImage: `url('${image}')`, backgroundPosition: position }} />
      )}
      <span className="absolute inset-0 bg-linear-100 from-brand-deep from-25% via-brand-deep/75 via-50% to-brand-deep/30 max-lg:via-brand-deep/85 max-lg:to-brand-deep/60" />
      <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.04)_1px,transparent_1px)] bg-size-[56px_56px] [mask-image:linear-gradient(90deg,#000,transparent_70%)]" />

      {/* decorative rings */}
      <span className="pointer-events-none absolute top-1/2 right-[8%] size-[300px] -translate-y-1/2 animate-[spin_40s_linear_infinite] rounded-full border-[1.5px] border-dashed border-brand-pale/30 max-lg:hidden">
        <i className="absolute -top-[5px] left-1/2 size-2.5 rounded-full bg-gold shadow-[0_0_14px_#F2B705]" />
      </span>
      <span className="pointer-events-none absolute top-1/2 right-[calc(8%+50px)] size-[200px] -translate-y-1/2 animate-[spin_16s_linear_infinite_reverse] rounded-full border border-brand-pale/20 max-lg:hidden">
        <i className="absolute -bottom-1.5 left-1/2 size-3 rounded-full bg-brand-pale shadow-[0_0_16px_#a9c8e8]" />
      </span>
      <span className="pointer-events-none absolute bottom-8 left-[4%] size-[110px] animate-floaty bg-[radial-gradient(rgba(169,200,232,.4)_1.3px,transparent_1.3px)] bg-size-[14px_14px]" />

      <div className="wrap relative z-[2]">
        <nav aria-label="Breadcrumb" {...rise(0)} className="animate-rise mb-5 flex items-center gap-2 text-[.82rem] font-semibold text-white/70">
          <Link to="/" className="transition-colors hover:text-white">Home</Link>
          <span className="text-white/35">/</span>
          <span className="text-brand-pale">{crumb}</span>
        </nav>
        <div {...rise(1)}>
          <Eyebrow light>{eyebrow}</Eyebrow>
        </div>
        <h1
          {...rise(2)}
          className="animate-rise mt-3.5 max-w-[760px] font-serif text-[length:clamp(2.6rem,5.5vw,4.4rem)] font-semibold leading-[1.06] [&_em]:italic [&_em]:text-brand-pale"
        >
          {title}
        </h1>
        {text && (
          <p {...rise(3)} className="animate-rise mt-5 max-w-[600px] text-[1.05rem] text-[#c3d3e6]">
            {text}
          </p>
        )}
      </div>
    </section>
  )
}
