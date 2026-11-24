import logo from '../assets/logo.webp'
import { EMAIL, PHONE, PHONE_HREF, POPULAR_COURSES, QUICK_LINKS } from '../data/content'
import { FillIcon, SOCIAL, SmartLink } from './ui'

const heading =
  'relative mb-[22px] pb-3 font-serif text-[1.35rem] font-semibold text-white after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-[34px] after:bg-brand'
const link = 'transition-all duration-250 hover:pl-1.5 hover:text-white'
const contactIcon = 'mt-1 size-4 shrink-0 fill-[#8fb5dc]'

export default function Footer() {
  return (
    <footer id="contact" className="bg-ink-dark text-[.9rem] text-[#a9adb3]">
      <div className="wrap grid grid-cols-[1.4fr_1fr_1fr_1.3fr] gap-[50px] pt-20 pb-[50px] max-lg:grid-cols-2 max-sm:grid-cols-1">
        <div>
          <div className="mb-5 inline-block rounded bg-white px-4 py-3">
            <img src={logo} alt="Mark Education Academy" className="h-[46px] w-auto" />
          </div>
          <p>An ISO 9001:2015 certified institute providing quality, result-oriented training in Bangalore since 2004.</p>
          <div className="mt-[22px] flex gap-2.5">
            {SOCIAL.map((s) => (
              <a
                key={s.name}
                href="#"
                aria-label={s.label}
                className="grid size-[38px] place-items-center rounded-full border border-[#444] transition duration-300 hover:border-brand hover:bg-brand"
              >
                <FillIcon name={s.name} className="size-[15px] fill-white" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h5 className={heading}>Quick Links</h5>
          <ul>
            {QUICK_LINKS.map((l) => (
              <li key={l.label} className="mb-2.5">
                <SmartLink href={l.href} className={link}>{l.label}</SmartLink>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h5 className={heading}>Popular Courses</h5>
          <ul>
            {POPULAR_COURSES.map((c) => (
              <li key={c.label} className="mb-2.5">
                <SmartLink href={c.href} className={link}>{c.label}</SmartLink>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h5 className={heading}>Head Office</h5>
          <ul>
            <li className="mb-2.5 flex items-start gap-3">
              <FillIcon name="pin" className={contactIcon} />
              <span>Mark Education Academy,<br />Address line, Bengaluru – 560 000</span>
            </li>
            <li className="mb-2.5 flex items-start gap-3">
              <FillIcon name="phone" className={contactIcon} />
              <a href={PHONE_HREF} className="hover:text-white">{PHONE}</a>
            </li>
            <li className="mb-2.5 flex items-start gap-3">
              <FillIcon name="mail" className={contactIcon} />
              <span>{EMAIL}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-[#383838] py-[22px] text-[.82rem]">
        <div className="wrap flex flex-wrap justify-between gap-2.5">
          <span>&copy; {new Date().getFullYear()} Mark Education Academy. All Rights Reserved.</span>
          <span>
            <a href="#" className="hover:text-white">Privacy Policy</a> &nbsp;·&nbsp;{' '}
            <a href="#" className="hover:text-white">Terms</a>
          </span>
        </div>
      </div>
    </footer>
  )
}
