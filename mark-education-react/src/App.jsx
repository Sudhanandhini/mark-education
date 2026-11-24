import { useEffect } from 'react'
import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import TopBar from './components/TopBar'
import Header from './components/Header'
import Footer from './components/Footer'
import BackToTop from './components/BackToTop'
import { EnquiryProvider } from './components/EnquiryProvider'
import Home from './pages/Home'
import CoursePage from './pages/CoursePage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import CoursesPage from './pages/CoursesPage'
import VerifyPage from './pages/VerifyPage'
import GalleryPage from './pages/GalleryPage'
import AcademicPartnersPage from './pages/AcademicPartnersPage'

/** Scroll to top on page change, or to the #section when the URL has a hash. */
function ScrollManager() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0)
      return
    }
    // wait a frame so the target page has rendered
    const t = setTimeout(() => document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth' }), 60)
    return () => clearTimeout(t)
  }, [pathname, hash])
  return null
}

function Layout() {
  return (
    <EnquiryProvider>
      <ScrollManager />
      <TopBar />
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
      <BackToTop />
    </EnquiryProvider>
  )
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="courses" element={<CoursesPage />} />
        <Route path="courses/:slug" element={<CoursePage />} />
        <Route path="gallery" element={<GalleryPage />} />
        <Route path="academic-partners" element={<AcademicPartnersPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="verify-certificate" element={<VerifyPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
