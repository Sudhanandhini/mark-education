import { useCallback, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import logo from '../assets/logo.webp'
import { COURSE_MENU, NAV, courseHref } from '../data/content'
import { COURSE_PAGES } from '../data/coursePages'
import EnquiryModal from './EnquiryModal'
import { SmartLink, btnPrimary, cn } from './ui'

const isMobile = () => window.innerWidth <= 991

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [subOpen, setSubOpen] = useState(null)
  const [enquiryOpen, setEnquiryOpen] = useState(false)
  const closeEnquiry = useCallback(() => setEnquiryOpen(false), [])
  const { pathname, hash } = useLocation()

  // Close the mobile drawer whenever the route changes
  useEffect(() => {
    setOpen(false)
    setSubOpen(null)
    setEnquiryOpen(false)
  }, [pathname, hash])

  // On a course page, pre-select that course in the enquiry popup
  const pageCourse = pathname.startsWith('/courses/') ? COURSE_PAGES[pathname.split('/')[2]]?.enquiryCourse : ''

  const isActive = (item) =>
    item.match === '/' ? pathname === '/' : !!item.match && pathname.startsWith(item.match)

  const childrenOf = (item) => (item.courseMenu ? [{ label: 'All Courses →', href: '/courses' }, ...COURSE_MENU.map((label) => ({ label, href: courseHref(label) }))] : null)

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

  const onLinkClick = (e, i, hasSub) => {
    if (!isMobile()) return
    if (hasSub) {
      e.preventDefault()
      setSubOpen((s) => (s === i ? null : i))
      return
    }
    setOpen(false)
  }

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
              {NAV.map((item, i) => {
                const children = childrenOf(item)
                const hasSub = !!children
                return (
                  <li key={item.label} className="group relative">
                    <SmartLink
                      href={item.href}
                      onClick={(e) => onLinkClick(e, i, hasSub)}
                      className={cn(
                        'flex items-center gap-1.5 whitespace-nowrap px-3 py-2.5 text-[.88rem] font-semibold transition-colors duration-250 hover:text-brand',
                        'max-xl:px-[9px] max-xl:text-[.84rem]',
                        'max-lg:justify-between max-lg:border-b max-lg:border-line max-lg:px-7 max-lg:py-3.5 max-lg:text-[.95rem]',
                        isActive(item)
                          ? "text-brand after:absolute after:inset-x-[13px] after:bottom-0.5 after:h-0.5 after:bg-brand max-lg:after:hidden"
                          : 'text-ink',
                      )}
                    >
                      {item.label}
                      {hasSub && (
                        <i className="size-2 translate-y-[-2px] rotate-45 border-r-[1.5px] border-b-[1.5px] border-current" />
                      )}
                    </SmartLink>
                    {hasSub && (
                      <div
                        className={cn(
                          'absolute top-full left-0 min-w-[250px] border-t-2 border-brand bg-white py-2.5 shadow-soft',
                          'invisible translate-y-2.5 opacity-0 transition duration-250 ease-smooth',
                          'group-hover:visible group-hover:translate-y-0 group-hover:opacity-100',
                          item.courseMenu && 'grid min-w-[520px] grid-cols-2',
                          // mobile: inline accordion
                          'max-lg:visible max-lg:static max-lg:min-w-0 max-lg:translate-y-0 max-lg:border-0 max-lg:bg-ink-light max-lg:py-1.5 max-lg:opacity-100 max-lg:shadow-none',
                          subOpen === i ? 'max-lg:block' : 'max-lg:hidden',
                        )}
                      >
                        {children.map((c) => (
                          <SmartLink
                            key={c.label}
                            href={c.href}
                            onClick={() => isMobile() && setOpen(false)}
                            className="block px-[22px] py-2 text-[.86rem] text-ink transition-all duration-200 hover:bg-brand-soft hover:pl-7 hover:text-brand"
                          >
                            {c.label}
                          </SmartLink>
                        ))}
                      </div>
                    )}
                  </li>
                )
              })}
              <li>
                <button
                  type="button"
                  onClick={() => setEnquiryOpen(true)}
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
            onClick={() => setEnquiryOpen(true)}
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
      <EnquiryModal open={enquiryOpen} onClose={closeEnquiry} defaultCourse={pageCourse} />
    </>
  )
}
