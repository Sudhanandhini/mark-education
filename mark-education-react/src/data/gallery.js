/**
 * Gallery photos.
 *
 * To use your own photos:
 *   1. Put the image files in  public/gallery/   (e.g. public/gallery/lab-1.jpg)
 *   2. Change `src` to '/gallery/lab-1.jpg'  (no need for a separate thumbnail)
 *   3. Update `title` and `category`.
 *
 * `shape` controls the tile in the grid: 'tall' | 'wide' | 'square'.
 * The stock photos below are placeholders.
 */

export const GALLERY_CATEGORIES = [
  { id: 'classrooms', label: 'Classrooms' },
  { id: 'labs', label: 'Computer Labs' },
  { id: 'events', label: 'Events & Activities' },
  { id: 'achievements', label: 'Achievements' },
]

const unsplash = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=75`

export const GALLERY = [
  { src: unsplash('1743834147172-37c12011b321'), title: 'Interactive classroom session', category: 'classrooms', shape: 'tall' },
  { src: unsplash('1517694712202-14dd9538aa97'), title: 'Hands-on practical lab', category: 'labs', shape: 'wide' },
  { src: unsplash('1522202176988-66273c2fd55f'), title: 'Group study & discussion', category: 'events', shape: 'square' },
  { src: unsplash('1541339907198-e08756dedf3f'), title: 'Certification ceremony', category: 'achievements', shape: 'wide' },
  { src: unsplash('1524178232363-1fb2b075b655'), title: 'Lecture by industry trainer', category: 'classrooms', shape: 'wide' },
  { src: unsplash('1551288049-bebda4e38f71'), title: 'Power BI dashboard practice', category: 'labs', shape: 'square' },
  { src: unsplash('1523240795612-9a054b0db644'), title: 'Student collaboration', category: 'events', shape: 'tall' },
  { src: unsplash('1571260899304-425eee4c7efc'), title: 'Proud moment for our students', category: 'achievements', shape: 'square' },
  { src: unsplash('1509062522246-3755977927d7'), title: 'Batch in progress', category: 'classrooms', shape: 'square' },
  { src: unsplash('1498050108023-c5249f4df085'), title: 'Individual system for every student', category: 'labs', shape: 'tall' },
  { src: unsplash('1529390079861-591de354faf5'), title: 'Workshop & seminar', category: 'events', shape: 'wide' },
  { src: unsplash('1562774053-701939374585'), title: 'Our learning centre', category: 'achievements', shape: 'tall' },
  { src: unsplash('1606761568499-6d2451b23c66'), title: 'Focused learning environment', category: 'classrooms', shape: 'wide' },
  { src: unsplash('1460925895917-afdab827c52f'), title: 'Advanced Excel & analytics', category: 'labs', shape: 'wide' },
  { src: unsplash('1546410531-bb4caa6b424d'), title: 'Student activities', category: 'events', shape: 'square' },
  { src: unsplash('1554224155-6726b3ff858f'), title: 'Tally & GST training', category: 'achievements', shape: 'wide' },
  { src: unsplash('1580582932707-520aed937b7b'), title: 'Faculty guidance', category: 'classrooms', shape: 'tall' },
  { src: unsplash('1531482615713-2afd69097998'), title: 'Team project work', category: 'labs', shape: 'square' },
]
