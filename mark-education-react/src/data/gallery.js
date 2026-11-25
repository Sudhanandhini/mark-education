/**
 * Gallery photos — loaded automatically from  src/assets/images/
 *
 * To add a photo: drop the file into src/assets/images/ (jpg, png or webp).
 * It appears in the gallery automatically, sorted by file name.
 * To give it a caption/category, add an entry to CAPTIONS below using the
 * first two characters of the file name (e.g. "21" for "21_my_photo.jpg").
 */

export const GALLERY_CATEGORIES = [
  { id: 'partnerships', label: 'College Partnerships' },
  { id: 'certificates', label: 'Certificate Ceremonies' },
  { id: 'batches', label: 'Certified Batches' },
  { id: 'events', label: 'Events & Programs' },
]

// Captions keyed by the file-name prefix (01, 02, …)
const CAPTIONS = {
  '01': { title: 'Certificate awarded to a student', category: 'certificates' },
  '02': { title: 'Partnership with St Claret College', category: 'partnerships' },
  '03': { title: 'Partnership with St Claret Pre University College', category: 'partnerships' },
  '04': { title: 'Partnership with Soundarya PU College', category: 'partnerships' },
  '05': { title: 'Certificates of merit presented', category: 'certificates' },
  '06': { title: 'Tally with Supply Chain Management — certificate facilitation 2025–26', category: 'certificates' },
  '07': { title: 'Students with their certificates', category: 'batches' },
  '08': { title: 'Certificate felicitation ceremony', category: 'certificates' },
  '09': { title: 'Partnership with Dr NSAM PU College', category: 'partnerships' },
  '10': { title: 'Partnership with Jnana Jyothi Degree College', category: 'partnerships' },
  '11': { title: 'Certified batch with faculty', category: 'batches' },
  '12': { title: 'Partnership with Seshadripuram First Grade College, Yelahanka', category: 'partnerships' },
  '13': { title: 'Partnership with Bishop Cotton Academy of Professional Management, Yelahanka', category: 'partnerships' },
  '14': { title: 'Certified students batch', category: 'batches' },
  '15': { title: 'Students receive their certificates', category: 'batches' },
  '16': { title: 'Proud certificate holders', category: 'batches' },
  '17': { title: 'Programme with faculty and guests', category: 'events' },
  '18': { title: 'Pragathi Skill Academy programme', category: 'events' },
  '19': { title: 'Certificate distribution — large batch', category: 'batches' },
  '20': { title: 'Certified students with their certificates', category: 'batches' },
}

// Vite bundles every image in the folder (hashed URLs, cached by the browser)
const files = import.meta.glob('../assets/images/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}', {
  eager: true,
  import: 'default',
})

export const GALLERY = Object.entries(files)
  .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
  .map(([path, src]) => {
    const name = path.split('/').pop()
    const info = CAPTIONS[name.slice(0, 2)] || {}
    return {
      src,
      title: info.title || 'Moments at Mark Education Academy',
      category: info.category || 'events',
    }
  })
