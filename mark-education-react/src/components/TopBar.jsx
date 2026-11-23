import { FillIcon, SOCIAL } from './ui'
import { EMAIL, PHONE } from '../data/content'

const item = 'inline-flex items-center gap-2'
const icon = 'size-3.5 fill-[#8fb5dc]'

export default function TopBar() {
  return (
    <div className="bg-ink-dark text-[.82rem] text-[#cfd3d8]">
      <div className="wrap flex flex-wrap items-center justify-between gap-4 py-[9px]">
        <div className="flex flex-wrap gap-[26px]">
          <span className={item}><FillIcon name="phone" className={icon} />{PHONE}</span>
          <span className={item}><FillIcon name="mail" className={icon} />{EMAIL}</span>
          <span className={`${item} max-sm:hidden`}><FillIcon name="clock" className={icon} />Mon – Sat : 8:00 AM – 8:00 PM</span>
        </div>
        <div className="flex gap-3.5 max-sm:hidden">
          {SOCIAL.map((s) => (
            <a key={s.name} href="#" aria-label={s.label} className="group">
              <FillIcon name={s.name} className={`${icon} transition-colors group-hover:fill-white`} />
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
