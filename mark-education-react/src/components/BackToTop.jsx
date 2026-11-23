import { useEffect, useState } from 'react'
import { cn } from './ui'

export default function BackToTop() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <button
      aria-label="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className={cn(
        'fixed right-6 bottom-6 z-90 size-[46px] rounded-full bg-brand text-[1.1rem] text-white shadow-soft transition duration-300 hover:bg-ink-dark',
        show ? 'visible translate-y-0 opacity-100' : 'invisible translate-y-5 opacity-0',
      )}
    >
      &#8593;
    </button>
  )
}
