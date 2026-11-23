import powerBiPhoto from '../assets/courses/power-bi-photo.webp'
import powerBiBrochure from '../assets/courses/power-bi-brochure.webp'
import excelPhoto from '../assets/courses/excel-photo.webp'
import excelBrochure from '../assets/courses/excel-brochure.webp'
import tallyPhoto from '../assets/courses/tally-prime-photo.webp'
import tallyPhoto2 from '../assets/courses/tally-prime-photo2.webp'
import tallyBrochure from '../assets/courses/tally-prime-brochure.webp'

/** Figures printed on the course flyers — change once here. */
export const YEARS_EXCELLENCE = 18
export const GOOGLE_RATING = '4.8'

export const SERVICES = [
  { icon: 'chat', title: 'Interactive Classes', text: 'Live, hands-on sessions on individual systems.' },
  { icon: 'user', title: 'Professional Mentors', text: 'Learn from experienced industry trainers.' },
  { icon: 'clock', title: 'Flexible Learning', text: 'Morning, evening and weekend batches.' },
  { icon: 'shieldCheck', title: 'Verified Certificates', text: 'ISO-certified, verifiable online.' },
]

/**
 * One entry per course sub-page (/courses/:slug).
 * `theme` colours are sampled from each flyer.
 */
export const COURSE_PAGES = {
  'power-bi': {
    slug: 'power-bi',
    name: 'Power BI',
    navLabel: 'Power BI Course',
    metaTitle: 'Power BI Course in Bangalore',
    theme: { c: '#5d7aa6', dark: '#3f5b85', soft: '#e9eef6', alt: '#e8b33a' },
    partner: 'Microsoft Authorised Training Partner',
    title: <>Power BI <em>Course</em></>,
    tagline: 'Join thousands of learners and start mastering new skills today.',
    intro:
      'Turn raw data into interactive dashboards and reports. Our Power BI program takes you from connecting data to publishing business-ready insights — all through practical, project-based training.',
    photo: powerBiPhoto,
    photoShape: 'arch',
    programsTitle: <>What You Will <em>Learn</em></>,
    programs: [
      { title: 'Data Connection & Power Query', text: 'Import, clean and transform data from Excel, databases and the web.' },
      { title: 'Data Modelling', text: 'Build relationships and star-schema models that scale.' },
      { title: 'DAX Calculations', text: 'Measures, calculated columns and time intelligence.' },
      { title: 'Interactive Dashboards', text: 'Visuals, slicers, drill-throughs and report design.' },
      { title: 'Publish & Share', text: 'Power BI Service, workspaces and scheduled refresh.' },
    ],
    highlight: {
      icon: 'shieldCheck',
      title: 'Microsoft Authorised Training Partner',
      text: 'Train at an authorised centre and earn a certificate that employers recognise.',
    },
    brochure: powerBiBrochure,
    brochureFile: '/brochures/mark-power-bi-brochure.jpg',
    enquiryCourse: 'Power BI',
  },

  excel: {
    slug: 'excel',
    name: 'Microsoft Office Excel',
    navLabel: 'Microsoft Excel Courses',
    metaTitle: 'Microsoft Office Excel Courses in Bangalore',
    theme: { c: '#2fa84f', dark: '#1d7a38', soft: '#e7f6eb', alt: '#1d7a38' },
    partner: 'Microsoft Authorised Training Partner',
    title: <>Microsoft Office <em>Excel</em></>,
    tagline: 'Certified by Microsoft. Register now and get a free demo class.',
    intro:
      'From smart formulas to AI-powered automation, our Excel programs make you the go-to data person in any office — with Microsoft Office Specialist certification.',
    photo: excelPhoto,
    photoShape: 'circle',
    programsTitle: <>Courses We <em>Offer</em></>,
    programs: [
      { title: 'Excel with AI', text: 'Copilot & AI features to automate everyday Excel work.' },
      { title: 'Data Analytics With Excel', text: 'Clean, analyse and visualise data for business insights.' },
      { title: 'Advanced Excel', text: 'Formulas, lookups, pivots, macros & dashboards.' },
    ],
    highlight: {
      icon: 'star',
      title: 'Certified by Microsoft',
      text: 'Microsoft Office Specialist certification on course completion.',
    },
    brochure: excelBrochure,
    brochureFile: '/brochures/mark-excel-brochure.jpg',
    enquiryCourse: 'Advanced Excel',
  },

  'tally-prime': {
    slug: 'tally-prime',
    name: 'Tally Prime',
    navLabel: 'Tally Prime Courses',
    metaTitle: 'Tally Prime Courses — Authorised Tally Centre, North Bengaluru',
    theme: { c: '#0b4ea2', dark: '#083a7a', soft: '#e6eef9', alt: '#e8b33a' },
    partner: 'Authorised Tally Centre · North Bengaluru',
    title: <>Tally <em>Prime</em></>,
    tagline: 'Ready to level up your skills? Attend our counselling and take your career to the next level!',
    intro:
      'The trusted, authorised Tally centre of North Bengaluru. Learn accounting, GST, inventory and payroll on Tally Prime with real business scenarios and internship options.',
    photo: tallyPhoto,
    photo2: tallyPhoto2,
    photoShape: 'circle',
    programsTitle: <>Programs Available on <em>Tally</em></>,
    programs: [
      { title: 'Tally Prime Level - 1', text: 'Ledgers, vouchers and financial statements.' },
      { title: 'Tally Prime Level - 2', text: 'Inventory, GST in Tally, payroll and banking.' },
      { title: 'Tally Prime Level - 3', text: 'TDS, cost centres, audit and advanced reports.' },
      { title: 'Tally Prime Comprehensive', text: 'All three levels in one complete program.' },
      { title: 'Tally Prime with Internship', text: 'Full course plus hands-on internship experience.' },
    ],
    highlight: {
      icon: 'checkCircle',
      title: 'The Trusted, Authorised Tally Centre',
      text: 'Of North Bengaluru — learn on the latest Tally Prime release.',
    },
    brochure: tallyBrochure,
    brochureFile: '/brochures/mark-tally-prime-brochure.jpg',
    enquiryCourse: 'Tally Prime',
  },
}

export const COURSE_PAGE_LIST = Object.values(COURSE_PAGES)
