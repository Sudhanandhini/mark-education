import { useEnquiry } from './EnquiryProvider'
import { btn, cn } from './ui'

export default function Cta() {
  const { openEnquiry } = useEnquiry()
  return (
    <section className="bg-brand py-16 text-white">
      <div className="wrap flex flex-wrap items-center justify-between gap-[30px]">
        <div>
          <h3 className="font-serif text-[length:clamp(1.8rem,3vw,2.5rem)] font-semibold leading-[1.2]">Ready to Build Your Career?</h3>
          <p className="text-[#d6e4f2]">Admissions open for the new batch — limited seats available.</p>
        </div>
        <button
          type="button"
          onClick={() => openEnquiry()}
          aria-haspopup="dialog"
          className={cn(btn, 'bg-white text-brand hover:bg-ink-dark hover:text-white')}
        >
          Apply Now →
        </button>
      </div>
    </section>
  )
}
