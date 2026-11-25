import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Cta from '../components/Cta'
import PageBanner from '../components/PageBanner'
import { Eyebrow, Icon, Lead, Reveal, Title, cn } from '../components/ui'
import { GALLERY, GALLERY_CATEGORIES } from '../data/gallery'

const BANNER = 'https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?auto=format&fit=crop&w=1800&q=70'

/** Sized URL for Unsplash images; local images are returned unchanged. */
const sized = (src, w) => (src.includes('images.unsplash.com') ? `${src}&w=${w}` : src)

// optional per-photo crop; photos without `shape` keep their natural proportions
const SHAPE = { tall: 'aspect-[3/4] object-cover', wide: 'aspect-[4/3] object-cover', square: 'aspect-square object-cover' }
const catLabel = (id) => GALLERY_CATEGORIES.find((c) => c.id === id)?.label ?? id

/* ---------- Full-screen viewer ---------- */
function Lightbox({ items, index, onClose, onIndex }) {
  const item = items[index]
  const closeRef = useRef(null)
  const touchX = useRef(0)
  const stripRef = useRef(null)
  // functional updates so rapid key presses never use a stale index
  const prev = useCallback(() => onIndex((i) => (i - 1 + items.length) % items.length), [items.length, onIndex])
  const next = useCallback(() => onIndex((i) => (i + 1) % items.length), [items.length, onIndex])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowLeft') prev()
      else if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, prev, next])

  useEffect(() => {
    const last = document.activeElement
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    return () => {
      document.body.style.overflow = prevOverflow
      last?.focus?.()
    }
  }, [])

  // keep the active thumbnail visible
  useEffect(() => {
    stripRef.current?.children[index]?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
  }, [index])

  // preload neighbours for instant switching
  useEffect(() => {
    ;[index - 1, index + 1].forEach((i) => {
      const it = items[(i + items.length) % items.length]
      if (it) new Image().src = sized(it.src, 1600)
    })
  }, [index, items])

  const navBtn =
    'absolute top-1/2 z-[2] grid size-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-2xl text-white backdrop-blur transition hover:bg-white hover:text-ink-dark max-sm:size-10'

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${item.title} — photo ${index + 1} of ${items.length}`}
      className="fixed inset-0 z-[300] flex animate-[rise_.25s_ease_both] flex-col bg-[#081a33]/95 backdrop-blur-sm"
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        const dx = e.changedTouches[0].clientX - touchX.current
        if (Math.abs(dx) > 50) (dx < 0 ? next : prev)()
      }}
    >
      {/* top bar */}
      <div className="flex items-center justify-between px-6 py-4 text-white max-sm:px-4">
        <span className="font-serif text-[1.2rem]">
          <b className="text-[1.5rem]">{String(index + 1).padStart(2, '0')}</b>
          <span className="text-white/50"> / {String(items.length).padStart(2, '0')}</span>
        </span>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close gallery"
          className="grid size-11 place-items-center rounded-full bg-white/10 text-2xl transition duration-300 hover:rotate-90 hover:bg-white hover:text-ink-dark"
        >
          ×
        </button>
      </div>

      {/* image */}
      <div className="relative flex min-h-0 flex-1 items-center justify-center px-20 max-sm:px-3" onClick={(e) => e.target === e.currentTarget && onClose()}>
        <button type="button" onClick={prev} aria-label="Previous photo" className={cn(navBtn, 'left-6 max-sm:left-2')}>‹</button>
        <figure key={index} className="flex max-h-full max-w-full animate-[rise_.35s_ease_both] flex-col items-center">
          <img
            src={sized(item.src, 1600)}
            alt={item.title}
            className="max-h-[calc(100vh-240px)] max-w-full rounded-lg object-contain shadow-[0_30px_80px_rgba(0,0,0,.5)] max-sm:max-h-[calc(100vh-220px)]"
          />
          <figcaption className="mt-4 text-center text-white">
            <b className="block font-serif text-[1.4rem] font-semibold">{item.title}</b>
            <small className="text-[.74rem] font-bold uppercase tracking-[.16em] text-brand-pale">{catLabel(item.category)}</small>
          </figcaption>
        </figure>
        <button type="button" onClick={next} aria-label="Next photo" className={cn(navBtn, 'right-6 max-sm:right-2')}>›</button>
      </div>

      {/* thumbnails */}
      <div ref={stripRef} className="flex gap-2 overflow-x-auto px-6 py-4 [scrollbar-width:none] max-sm:hidden [&::-webkit-scrollbar]:hidden">
        {items.map((it, i) => (
          <button
            key={it.src}
            type="button"
            onClick={() => onIndex(i)}
            aria-label={`Show photo ${i + 1}: ${it.title}`}
            aria-current={i === index}
            className={cn(
              'h-16 w-24 shrink-0 overflow-hidden rounded-md border-2 transition duration-300',
              i === index ? 'border-white opacity-100' : 'border-transparent opacity-45 hover:opacity-90',
            )}
          >
            <img src={sized(it.src, 200)} alt="" className="size-full object-cover" loading="lazy" />
          </button>
        ))}
      </div>
    </div>
  )
}

/* ---------- Page ---------- */
export default function GalleryPage() {
  const [filter, setFilter] = useState('all')
  const [open, setOpen] = useState(null) // index into `list`

  useEffect(() => {
    document.title = 'Gallery | Mark Education Academy'
  }, [])

  const list = useMemo(() => (filter === 'all' ? GALLERY : GALLERY.filter((g) => g.category === filter)), [filter])
  const filters = [
    { id: 'all', label: 'All Photos', count: GALLERY.length },
    ...GALLERY_CATEGORIES.map((c) => ({ ...c, count: GALLERY.filter((g) => g.category === c.id).length })),
  ]
  const close = useCallback(() => setOpen(null), [])

  return (
    <>
      <PageBanner
        crumb="Gallery"
        eyebrow="Life at Mark"
        title={<>Our <em>Gallery</em></>}
        text="A glimpse of our classrooms, computer labs, events and the proud moments of our students."
        image={BANNER}
        position="center 55%"
      />

      <section className="section-pad bg-white">
        <div className="wrap">
          <Reveal className="text-center">
            <Eyebrow center>Moments</Eyebrow>
            <Title>Moments That <em>Matter</em></Title>
            <Lead center>College partnerships, certificate ceremonies and our proud certified batches. Click any photo to view it full screen.</Lead>
          </Reveal>

          <Reveal className="mt-10 mb-10 flex justify-center">
            <div className="flex flex-wrap justify-center gap-2" role="tablist" aria-label="Filter photos">
              {filters.map((f) => {
                const on = f.id === filter
                return (
                  <button
                    key={f.id}
                    role="tab"
                    aria-selected={on}
                    onClick={() => setFilter(f.id)}
                    className={cn(
                      'rounded-[40px] border px-5 py-2.5 text-[.86rem] font-bold transition-all duration-300',
                      on
                        ? 'border-brand bg-brand text-white shadow-[0_8px_20px_rgba(0,89,168,.3)]'
                        : 'border-line bg-white text-ink-mid hover:border-brand hover:text-brand',
                    )}
                  >
                    {f.label}
                    {/* <span className={cn('ml-2 rounded-[20px] px-1.5 py-px text-[.7rem]', on ? 'bg-white/20' : 'bg-brand-soft text-brand')}>{f.count}</span> */}
                  </button>
                )
              })}
            </div>
          </Reveal>

          {/* masonry grid */}
          <div className="columns-3 gap-5 max-lg:columns-2 max-sm:columns-1">
            {list.map((g, i) => (
              <button
                key={`${filter}-${g.src}`}
                type="button"
                onClick={() => setOpen(i)}
                aria-label={`Open photo: ${g.title}`}
                style={{ animationDelay: `${Math.min(i, 12) * 60}ms` }}
                className="group relative mb-5 block w-full animate-rise cursor-zoom-in overflow-hidden rounded-2xl bg-ink-light text-left break-inside-avoid focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                <img
                  src={sized(g.src, 800)}
                  alt={g.title}
                  loading="lazy"
                  className={cn('h-auto w-full transition duration-700 ease-smooth group-hover:scale-110', SHAPE[g.shape])}
                />
                <span className="absolute inset-0 bg-linear-180 from-transparent from-40% to-brand-deep/90 opacity-0 transition duration-500 group-hover:opacity-100 max-lg:opacity-100" />
                <span className="absolute inset-x-5 bottom-5 translate-y-3 text-white opacity-0 transition duration-500 ease-smooth group-hover:translate-y-0 group-hover:opacity-100 max-lg:translate-y-0 max-lg:opacity-100">
                  <small className="block text-[.68rem] font-bold uppercase tracking-[.16em] text-brand-pale">{catLabel(g.category)}</small>
                  <b className="block font-serif text-[1.35rem] font-semibold leading-tight">{g.title}</b>
                </span>
                <span className="absolute top-4 right-4 grid size-10 scale-50 place-items-center rounded-full bg-white text-brand opacity-0 shadow-card transition duration-500 ease-smooth group-hover:scale-100 group-hover:opacity-100">
                  <Icon name="search" className="size-[18px]" />
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <Cta />

      {open !== null && list[open] && <Lightbox items={list} index={open} onClose={close} onIndex={setOpen} />}
    </>
  )
}
