import { useEffect } from 'react'
import Hero from '../components/Hero'
import Highlights from '../components/Highlights'
import About from '../components/About'
import Counter from '../components/Counter'
import Courses from '../components/Courses'
import WhyChoose from '../components/WhyChoose'
import Certification from '../components/Certification'
import Testimonials from '../components/Testimonials'
import Faq from '../components/Faq'
import Partners from '../components/Partners'
import Cta from '../components/Cta'

export default function Home() {
  useEffect(() => {
    document.title = 'Mark Education Academy | Professional Computer & Accounting Training in Bangalore'
  }, [])

  return (
    <>
      <Hero />
      <Highlights />
      <About />
      <Counter />
      <Courses />
      <WhyChoose />
      <Certification />
      <Testimonials />
      <Faq />
      <Partners />
      <Cta href="#enquiry" />
    </>
  )
}
