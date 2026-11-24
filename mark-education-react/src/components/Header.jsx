import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import logo from '../assets/logo.webp'
import { NAV } from '../data/content'
import { useEnquiry } from './EnquiryProvider'
import { SmartLink, btnPrimary, cn } from './ui'

const isMobile = () => window.innerWidth <= 991

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { openEnquiry } = useEnquiry()
  const { pathname, hash } = useLocation()

  // Close the mobile drawer whenever the route changes
  useEffect(() => {
    setOpen(false)
  }, [pathname, hash])

  const isActive = (item) =>
    item.match === '/' ? pathname === '/' : !!item.match && pathname.startsWith(item.match)

  useEffect(() => {
    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 40)
        ticking = false
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
  }, [open])

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-100 border-b border-line bg-white transition-shadow duration-300',
          scrolled && 'shadow-[0_6px_24px_rgba(0,0,0,.07)]',
        )}
      >
        <div
          className={cn(
            'wrap flex items-center justify-between transition-[height] duration-300',
            scrolled ? 'h-[72px]' : 'h-[88px] max-sm:h-[74px]',
          )}
        >
          <SmartLink href="/" aria-label="Mark Education Academy – An ISO 9001:2015 Certified Company">
            <img
              src={logo}
              alt="Mark Education Academy"
              className={cn('w-auto transition-[height] duration-300', scrolled ? 'h-12' : 'h-[58px] max-sm:h-11')}
            />
          </SmartLink>

          <nav>
            <ul
              className={cn(
                'flex items-center gap-1',
                // mobile off-canvas drawer
                'max-lg:fixed max-lg:top-0 max-lg:right-0 max-lg:h-screen max-lg:w-[min(340px,86vw)] max-lg:flex-col max-lg:items-stretch max-lg:gap-0',
                'max-lg:overflow-y-auto max-lg:bg-white max-lg:pt-[90px] max-lg:pb-[30px] max-lg:shadow-[-10px_0_40px_rgba(0,0,0,.12)]',
                'max-lg:transition-transform max-lg:duration-400 max-lg:ease-smooth',
                open ? 'max-lg:translate-x-0' : 'max-lg:translate-x-full',
              )}
            >
              {NAV.map((item) => (
                <li key={item.label} className="relative">
                  <SmartLink
                    href={item.href}
                    onClick={() => isMobile() && setOpen(false)}
                    className={cn(
                      'flex items-center gap-1.5 whitespace-nowrap px-3 py-2.5 text-[.88rem] font-semibold transition-colors duration-250 hover:text-brand',
                      'max-xl:px-[9px] max-xl:text-[.84rem]',
                      'max-lg:justify-between max-lg:border-b max-lg:border-line max-lg:px-7 max-lg:py-3.5 max-lg:text-[.95rem]',
                      isActive(item)
                        ? 'text-brand after:absolute after:inset-x-[13px] after:bottom-0.5 after:h-0.5 after:bg-brand max-lg:after:hidden'
                        : 'text-ink',
                    )}
                  >
                    {item.label}
                  </SmartLink>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  onClick={() => openEnquiry()}
                  aria-haspopup="dialog"
                  className={cn(btnPrimary, 'ml-3.5 px-[22px] py-[11px] max-xl:hidden')}
                >
                  Enquire Now
                </button>
              </li>
            </ul>
          </nav>

          <div className="hidden items-center gap-3 max-xl:flex">
          <button
            type="button"
            onClick={() => openEnquiry()}
            aria-haspopup="dialog"
            className={cn(btnPrimary, 'px-4 py-2.5 text-[.75rem]')}
          >
            Enquire
          </button>
          <button
            aria-label="Menu"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
            className="relative z-[110] hidden size-10 flex-col justify-center gap-1.5 max-lg:flex"
          >
            <span className={cn('h-0.5 bg-ink-dark transition duration-300', open && 'translate-y-2 rotate-45')} />
            <span className={cn('h-0.5 bg-ink-dark transition duration-300', open && 'opacity-0')} />
            <span className={cn('h-0.5 bg-ink-dark transition duration-300', open && '-translate-y-2 -rotate-45')} />
          </button>
          </div>
        </div>
      </header>

      <div
        onClick={() => setOpen(false)}
        className={cn(
          'fixed inset-0 z-99 hidden bg-brand-deep/45 transition duration-300 max-lg:block',
          open ? 'visible opacity-100' : 'invisible opacity-0',
        )}
      />
    </>
  )
}
