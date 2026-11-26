import { COURSE_TABS } from '../data/content'
import { COURSE_DETAIL_LIST } from '../data/courseDetails'
import { SmartLink, cn } from './ui'

/** Course pages grouped by catalogue category (Office, Excel & Analytics, Accounts, SAP, Soft Skills). */
export const COURSE_GROUPS = COURSE_TABS.map((t) => ({
  id: t.id,
  label: t.tab,
  courses: COURSE_DETAIL_LIST.filter((c) => c.category === t.id),
})).filter((g) => g.courses.length)

// desktop columns: SAP and Soft Skills share the last column
const COLUMNS = [['office'], ['data'], ['accounts'], ['sap', 'skills']]

function CourseLink({ c, onNavigate, active }) {
  return (
    <SmartLink
      href={`/courses/${c.slug}`}
      onClick={onNavigate}
      style={{ '--o': c.theme.c }}
      className={cn(
        'group/link flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[.9rem] font-semibold transition duration-200 hover:bg-ink-light hover:text-(--o)',
        active ? 'bg-ink-light text-(--o)' : 'text-ink-dark',
      )}
    >
      <span className="size-1.5 shrink-0 rounded-full bg-(--o) transition-transform duration-200 group-hover/link:scale-150" />
      {c.name}
    </SmartLink>
  )
}

/** Desktop dropdown panel (shown on hover / keyboard focus of the Courses item). */
export function CoursesMegaMenu({ pathname, onNavigate, onEnquire }) {
  const groups = Object.fromEntries(COURSE_GROUPS.map((g) => [g.id, g]))
  return (
    <div className="w-[min(960px,94vw)] overflow-hidden rounded-2xl border border-line bg-white shadow-[0_30px_60px_-20px_rgba(11,37,69,.35)]">
      <div className="grid grid-cols-4 gap-6 px-7 pt-7 pb-6">
        {COLUMNS.map((ids) => (
          <div key={ids.join()} className="flex flex-col gap-5">
            {ids.map((id) => groups[id] && (
              <div key={id}>
                <small className="mb-2 block border-b border-line pb-2 pl-2.5 text-[.7rem] font-extrabold uppercase tracking-[.14em] text-brand">
                  {groups[id].label}
                </small>
                <div className="flex flex-col">
                  {groups[id].courses.map((c) => (
                    <CourseLink key={c.slug} c={c} onNavigate={onNavigate} active={pathname === `/courses/${c.slug}`} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between gap-4 bg-brand-soft px-7 py-4">
        <p className="text-[.88rem] text-ink">
          <b className="text-ink-dark">Not sure which course?</b> Talk to our counsellor for a free demo.
        </p>
        <div className="flex items-center gap-5">
          <button type="button" onClick={onEnquire} aria-haspopup="dialog" className="text-[.8rem] font-bold uppercase tracking-[.08em] text-brand hover:text-brand-dark">
            Enquire Now
          </button>
          <SmartLink
            href="/courses"
            onClick={onNavigate}
            className="inline-flex items-center gap-2 rounded bg-brand px-4 py-2.5 text-[.78rem] font-bold uppercase tracking-[.08em] text-white transition hover:bg-brand-dark"
          >
            View All Courses <span aria-hidden="true">→</span>
          </SmartLink>
        </div>
      </div>
    </div>
  )
}

/** Mobile drawer: collapsible list under the Courses item. */
export function CoursesMobileList({ pathname, onNavigate }) {
  return (
    <div className="border-b border-line bg-ink-light/60 px-5 py-3">
      {COURSE_GROUPS.map((g) => (
        <div key={g.id} className="py-1.5">
          <small className="block px-2.5 pt-1 pb-1 text-[.66rem] font-extrabold uppercase tracking-[.14em] text-brand">{g.label}</small>
          {g.courses.map((c) => (
            <CourseLink key={c.slug} c={c} onNavigate={onNavigate} active={pathname === `/courses/${c.slug}`} />
          ))}
        </div>
      ))}
      <SmartLink href="/courses" onClick={onNavigate} className="mt-1 block px-2.5 py-2 text-[.82rem] font-bold uppercase tracking-[.08em] text-brand">
        View All Courses →
      </SmartLink>
    </div>
  )
}
