const u = (id, w = 1200) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=75`

export const PHONE = '+91 80954 88880'
export const PHONE_HREF = 'tel:+918095488880'
export const EMAIL = 'info@markeducation.in'
export const WEBSITE = 'www.markeducationacademy.com'

/** Courses that have their own detail page (/courses/:slug). */
export function coursePageFor(title) {
  if (/power bi/i.test(title)) return '/courses/power-bi'
  if (/excel/i.test(title)) return '/courses/excel'
  if (/tally/i.test(title)) return '/courses/tally-prime'
  return null
}

/** Best link for a course title: its detail page, else its category on /courses. */
export function courseHref(title) {
  const page = coursePageFor(title)
  if (page) return page
  const tab = COURSE_TABS.find((t) => t.courses.some((c) => c.title === title || title.includes(c.title)))
  return tab ? `/courses#${tab.id}` : '/courses'
}

export const COURSE_MENU = [
  'Microsoft Office', 'CCOM – Office Management', 'Advanced Excel', 'Microsoft Excel with AI', 'Power BI',
  'Data Analytics Using Excel', 'Tally Prime – Basic', 'Tally Prime – Intermediate', 'Tally Prime – Advanced',
  'English Communication', 'Typing Course', 'SAP – SAP FICO', 'SAP – SAP MM', 'Digital Statutory E-Filing',
  'GST Executive',
]

/** `match`: path prefix that marks the item active. `courseMenu`: dropdown built from COURSE_MENU. */
export const NAV = [
  { label: 'Home', href: '/', match: '/' },
  { label: 'About Us', href: '/about', match: '/about' },
  { label: 'Courses', href: '/courses', match: '/courses', courseMenu: true },
  { label: 'Academic Partners', href: '/#partners' },
  { label: 'Certificate Verification', href: '/#certification' },
  { label: 'Contact Us', href: '/contact', match: '/contact' },
]

export const SLIDES = [
  {
    pill: 'Since 2004 · Bangalore',
    title: <>Shaping Careers Through <em>Quality Education</em></>,
    text: 'Industry-focused, practical training by experienced trainers — with 100% placement assistance for every student.',
    primary: { label: 'Explore Courses', href: '/courses' },
    secondary: { label: 'Enquire Now', href: '#enquiry' },
    image: u('1517694712202-14dd9538aa97'),
  },
  {
    pill: 'Accounting & ERP',
    title: <>Master <em>Tally Prime, GST</em> &amp; SAP FICO</>,
    text: 'Become job-ready for accounting, finance and taxation roles with hands-on training on real business scenarios.',
    primary: { label: 'View Programs', href: '/courses#accounts' },
    secondary: { label: 'Contact Us', href: '/contact' },
    image: u('1672248652488-73f8a07e3307'),
  },
  {
    pill: 'Data & Analytics',
    title: <>Advanced Excel, <em>Power BI</em> &amp; Excel with AI</>,
    text: 'Turn data into decisions. Learn the analytics skills every modern workplace demands.',
    primary: { label: 'Start Learning', href: '/courses#data' },
    secondary: { label: 'Book a Demo', href: '#enquiry' },
    image: u('1551288049-bebda4e38f71'),
  },
]

export const HIGHLIGHTS = [
  { icon: 'shieldCheck', title: 'ISO Certified', text: 'ISO 9001:2015 quality standards' },
  { icon: 'user', title: 'Expert Trainers', text: 'Experienced industry faculty' },
  { icon: 'monitor', title: 'Practical Labs', text: 'Hands-on, system-based learning' },
  { icon: 'briefcase', title: '100% Placement', text: 'Dedicated placement assistance' },
]

export const ABOUT_FEATURES = [
  { icon: 'cap', text: 'Industry-oriented curriculum' },
  { icon: 'user', text: 'Experienced trainers' },
  { icon: 'money', text: 'Nominal course fees' },
  { icon: 'briefcase', text: '100% placement assistance' },
]

export const ABOUT_IMAGES = {
  main: u('1743834147172-37c12011b321'),
  inset: u('1484417894907-623942c8ee29', 800),
}

export const COUNTERS = [
  { value: 20, suffix: '+', label: 'Years of Excellence' },
  { value: 2000, suffix: '+', label: 'Students Every Year' },
  { value: 15, suffix: '+', label: 'Professional Courses' },
  { value: 100, suffix: '%', label: 'Placement Assistance' },
]

export const COUNTER_BG = 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1600&q=75'

export const COURSE_TABS = [
  {
    id: 'office',
    tab: 'Office & Computers',
    heading: 'Office & Computer Skills',
    blurb: 'Build a strong foundation in everyday office tools.',
    image: u('1499750310107-5fef28a66643', 1000),
    courses: [
      { icon: 'monitor', title: 'Microsoft Office', text: 'Word, Excel, PowerPoint & Outlook — the complete basic package.', level: 'Beginner' },
      { icon: 'layout', title: 'CCOM – Office Management', text: 'Office tools, documentation & business workflows.', level: 'Diploma' },
      { icon: 'keyboard', title: 'Typing Course', text: 'Speed and accuracy in English typing with daily practice.', level: 'All Levels' },
    ],
  },
  {
    id: 'data',
    tab: 'Excel & Analytics',
    heading: 'Excel & Data Analytics',
    blurb: 'Turn raw data into clear business decisions.',
    image: u('1460925895917-afdab827c52f'),
    courses: [
      { icon: 'table', title: 'Advanced Excel', text: 'Formulas, lookups, pivots, macros & dashboards.', level: 'Intermediate' },
      { icon: 'sparkle', title: 'Microsoft Excel with AI', text: 'Copilot & AI features to automate Excel work.', level: 'New' },
      { icon: 'bars', title: 'Power BI', text: 'Data modelling, DAX and interactive BI dashboards.', level: 'Advanced' },
      { icon: 'trend', title: 'Data Analytics Using Excel', text: 'Clean, analyse and visualise data for insights.', level: 'Intermediate' },
    ],
  },
  {
    id: 'accounts',
    tab: 'Accounts & Taxation',
    heading: 'Accounts & Taxation',
    blurb: 'Job-ready accounting, GST and statutory compliance.',
    image: u('1554224155-6726b3ff858f'),
    courses: [
      { icon: 'ledger', title: 'Tally Prime – Basic', text: 'Ledgers, vouchers and financial statements.', level: 'Basic' },
      { icon: 'ledger', title: 'Tally Prime – Intermediate', text: 'Inventory, GST in Tally, payroll and banking.', level: 'Intermediate' },
      { icon: 'ledger', title: 'Tally Prime – Advanced', text: 'TDS, cost centres, audit and advanced reports.', level: 'Advanced' },
      { icon: 'percent', title: 'GST Executive', text: 'Registration, returns filing, invoicing & compliance.', level: 'Professional' },
      { icon: 'fileCheck', title: 'Digital Statutory E-Filing', text: 'Income tax, TDS, PF/ESI online filings.', level: 'Professional' },
    ],
  },
  {
    id: 'sap',
    tab: 'SAP',
    heading: 'SAP ERP Programs',
    blurb: 'Industry-standard ERP training for corporate careers.',
    image: u('1454165804606-c3d57bc86b40'),
    courses: [
      { icon: 'coin', title: 'SAP – SAP FICO', text: 'Financial Accounting & Controlling configuration.', level: 'Professional' },
      { icon: 'box', title: 'SAP – SAP MM', text: 'Procurement, inventory and invoice verification.', level: 'Professional' },
    ],
  },
  {
    id: 'skills',
    tab: 'Soft Skills',
    heading: 'Communication Skills',
    blurb: 'Speak with confidence at interviews and at work.',
    image: u('1434030216411-0b793f4b4173'),
    courses: [
      { icon: 'chat', title: 'English Communication', text: 'Spoken English, business communication & interviews.', level: 'All Levels' },
    ],
  },
]

export const WHY_LEFT = [
  { icon: 'cap', title: 'Research-based Method', text: 'Methodology developed by educationists & HR professionals over years.' },
  { icon: 'briefcase', title: 'Corporate Ready', text: 'Curriculum customised to real industry requirements and roles.' },
  { icon: 'clock', title: 'Flexible Batches', text: 'Morning, evening and weekend batches for students & professionals.' },
]
export const WHY_RIGHT = [
  { icon: 'star', title: 'Recognised Certificates', text: 'ISO certified institute with online certificate verification.' },
  { icon: 'money', title: 'Nominal Fees', text: 'Quality education made affordable for every aspiring student.' },
  { icon: 'users', title: 'Placement Support', text: 'Resume building, mock interviews and 100% placement assistance.' },
]

export const CERT_WHY = [
  { icon: 'trend', title: 'Career Advancement', text: 'Boost your prospects in accounting, finance, MIS and office administration roles.' },
  { icon: 'star', title: 'Industry Recognised', text: 'Training aligned to industry requirements, valued by employers across Bangalore.' },
  { icon: 'cap', title: 'Comprehensive Skills', text: 'From fundamentals to advanced — bookkeeping, taxation, analytics and ERP.' },
]

export const OFFERS = [
  { icon: 'percent', title: 'GST Compliance through Practice', text: 'Hands-on GST returns, e-Way bills and e-Invoicing on real business scenarios.' },
  { icon: 'monitor', title: 'Live Lab Training', text: 'Every student works on an individual system with licensed software.' },
  { icon: 'briefcase', title: 'Placement Assistance', text: 'Resume building, mock interviews and 100% placement assistance.' },
]

const face = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=160&q=75&h=160&crop=faces`

export const TESTIMONIALS = [
  {
    quote: 'The Tally Prime and GST course was extremely practical. The trainers explained every concept with real examples and I got placed as an accounts executive within a month.',
    name: 'Priya S.',
    role: 'Accounts Executive',
    tag: 'Tally & GST',
    photo: face('1476638305939-a09cd694566c'),
  },
  {
    quote: 'Advanced Excel and Power BI training at Mark completely changed how I work. The faculty is patient and the lab sessions are excellent.',
    name: 'Rahul K.',
    role: 'MIS Analyst',
    tag: 'Power BI',
    photo: face('1649433658557-54cf58577c68'),
  },
  {
    quote: 'Affordable fees, flexible timings and genuine placement support. I would recommend Mark Education Academy to anyone starting their career.',
    name: 'Arjun M.',
    role: 'SAP FICO Trainee',
    tag: 'SAP FICO',
    photo: face('1763014456088-5bbbb1f5cbc1'),
  },
]

export const FAQS = [
  { q: 'Who can join the courses at Mark Education Academy?', a: 'Students, graduates, working professionals and job seekers can all join. Most courses need only basic computer familiarity; we also offer beginner-level programs.' },
  { q: 'Do you provide placement assistance?', a: 'Yes. We offer 100% placement assistance including resume preparation, mock interviews and connecting students with our corporate network.' },
  { q: 'Will I receive a certificate after the course?', a: 'Every student who completes the course receives a certificate from our ISO 9001:2015 certified institute, verifiable online through Certificate Verification.' },
  { q: 'What are the batch timings?', a: 'We run morning, afternoon, evening and weekend batches. Please contact the head office or your nearest branch for the current schedule.' },
  { q: 'Is a free demo class available?', a: 'Yes, you can book a free demo class through the enquiry form or by visiting our centre.' },
]

export const ENQUIRY_COURSES = [
  'Microsoft Office', 'CCOM – Office Management', 'Advanced Excel', 'Microsoft Excel with AI', 'Power BI',
  'Data Analytics Using Excel', 'Tally Prime', 'English Communication', 'Typing Course', 'SAP FICO', 'SAP MM',
  'Digital Statutory E-Filing', 'GST Executive',
]

export const QUICK_LINKS = [
  { label: 'About Us', href: '/about' },
  { label: 'All Courses', href: '/courses' },
  { label: 'Academic Partners', href: '/#partners' },
  { label: 'Certificate Verification', href: '/#certification' },
  { label: 'Contact Us', href: '/contact' },
  { label: 'Feedback', href: '/contact#enquiry' },
  { label: 'Mandatory Disclosure', href: '#' },
]

export const POPULAR_COURSES = ['Advanced Excel', 'Tally Prime', 'SAP FICO', 'Power BI', 'GST Executive', 'English Communication']

/* ---------- About page ---------- */
export const HOURS = 'Mon – Sat : 8:00 AM – 8:00 PM'

export const MILESTONES = [
  { year: '2004', title: 'Founded in Bangalore', text: 'Mark Education Academy opens its doors with practical computer training.' },
  { year: 'ISO', title: 'ISO 9001:2015 Certified', text: 'Quality management certified, with online certificate verification.' },
  { year: 'Tally', title: 'Authorised Tally Centre', text: 'Recognised as a trusted, authorised Tally centre of North Bengaluru.' },
  { year: 'MS', title: 'Microsoft Authorised Training Partner', text: 'Microsoft Office Specialist certification for Excel and Office programs.' },
  { year: 'Today', title: '2000+ Students Every Year', text: '15+ job-oriented courses with 100% placement assistance.' },
]

export const VISION =
  'To be the most trusted skill-development institute in Bangalore — bridging the gap between education and employment for every aspiring student.'
export const MISSION =
  'To deliver practical, industry-oriented training at nominal fees, backed by certified trainers, individual lab systems and dedicated placement support.'

export const VALUES = [
  { icon: 'star', title: 'Quality First', text: 'ISO-certified standards in every program.' },
  { icon: 'monitor', title: 'Learning by Doing', text: 'Hands-on practice on real business scenarios.' },
  { icon: 'money', title: 'Affordable', text: 'Quality education at very nominal fees.' },
  { icon: 'briefcase', title: 'Career Focus', text: 'Every course designed around job roles.' },
]

/* ---------- Contact page ---------- */
// TODO: replace with real addresses / map location
export const OFFICES = [
  { type: 'Head Office', name: 'Mark Education Academy', address: 'Address line 1, Area, Bengaluru – 560 000', phone: PHONE },
  { type: 'Branch', name: 'Mark Education Academy – Branch', address: 'Branch address line, Area, Bengaluru – 560 000', phone: PHONE },
]
export const MAP_QUERY = 'Mark Education Academy, Bengaluru'
