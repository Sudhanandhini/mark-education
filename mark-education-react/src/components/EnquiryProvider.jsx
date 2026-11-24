import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { COURSE_PAGES } from '../data/coursePages'
import EnquiryModal from './EnquiryModal'

const EnquiryContext = createContext({ openEnquiry: () => {} })

/** Lets any component open the enquiry popup: const { openEnquiry } = useEnquiry() */
export const useEnquiry = () => useContext(EnquiryContext)

export function EnquiryProvider({ children }) {
  const [open, setOpen] = useState(false)
  const [course, setCourse] = useState('')
  const { pathname, hash } = useLocation()

  // On a course page, pre-select that course unless the caller passes one
  const pageCourse = pathname.startsWith('/courses/') ? COURSE_PAGES[pathname.split('/')[2]]?.enquiryCourse || '' : ''

  const openEnquiry = useCallback(
    (preselect) => {
      setCourse(typeof preselect === 'string' ? preselect : pageCourse)
      setOpen(true)
    },
    [pageCourse],
  )
  const close = useCallback(() => setOpen(false), [])

  // Close when navigating to another page
  useEffect(() => setOpen(false), [pathname, hash])

  const value = useMemo(() => ({ openEnquiry }), [openEnquiry])

  return (
    <EnquiryContext.Provider value={value}>
      {children}
      <EnquiryModal open={open} onClose={close} defaultCourse={course} />
    </EnquiryContext.Provider>
  )
}
