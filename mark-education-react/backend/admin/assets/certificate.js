/*
 * Mark Education certificate: live preview, QR code and PDF.
 * Geometry is in "sheet px" of the original 1414 × 2000 certificate (same as CertificateDoc.jsx).
 *
 *   MarkCert.render(sheetEl, data, { qrUrl })     fill the HTML preview
 *   MarkCert.verifyUrl(certificateNo)             public verification URL (what the QR encodes)
 *   MarkCert.qrSvg(text) / MarkCert.qrPng(text)   QR code as SVG markup / PNG data URL
 *   MarkCert.pdf(data, { qr: true })              → Promise<jsPDF>
 */
(function () {
  'use strict'

  const BLUE = '#0B5DA7'
  const THEMES = {
    blue: { frame: BLUE, swoosh: BLUE, title: '#000000', text: '#111111', accent: BLUE, parent: '#000000', label: BLUE, value: '#222222', verify: BLUE, signer: '#333333' },
    orange: { frame: '#E8991A', swoosh: '#FBB92F', title: '#000000', text: '#111111', accent: '#E8991A', parent: '#000000', label: '#E8991A', value: '#222222', verify: '#E8991A', signer: '#333333' },
    grey: { frame: '#646464', swoosh: '#5E5E5E', title: BLUE, text: BLUE, accent: '#5E5E5E', parent: BLUE, label: '#5E5E5E', value: BLUE, verify: '#5E5E5E', signer: BLUE },
  }
  const themeFor = (course = '') => (/excel/i.test(course) ? 'orange' : /power\s*bi/i.test(course) ? 'grey' : 'blue')

  /* ---------- QR ---------- */
  function qrMatrix(text) {
    const qr = window.qrcode(0, 'M') // type 0 = smallest version that fits
    qr.addData(text)
    qr.make()
    const n = qr.getModuleCount()
    return { n, dark: (r, c) => qr.isDark(r, c) }
  }

  function qrSvg(text) {
    const { n, dark } = qrMatrix(text)
    let d = ''
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (dark(r, c)) d += `M${c} ${r}h1v1h-1z`
    return `<svg viewBox="0 0 ${n} ${n}" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges" role="img" aria-label="QR code"><rect width="${n}" height="${n}" fill="#fff"/><path d="${d}" fill="#000"/></svg>`
  }

  function qrPng(text, size = 600, margin = 4) {
    const { n, dark } = qrMatrix(text)
    const cell = Math.floor(size / (n + margin * 2))
    const px = cell * (n + margin * 2)
    const cv = document.createElement('canvas')
    cv.width = cv.height = px
    const g = cv.getContext('2d')
    g.fillStyle = '#fff'
    g.fillRect(0, 0, px, px)
    g.fillStyle = '#000'
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (dark(r, c)) g.fillRect((c + margin) * cell, (r + margin) * cell, cell, cell)
    return cv.toDataURL('image/png')
  }

  /** Site root = the admin folder's parent (works in any sub-folder, e.g. /mark-edu/). */
  function verifyUrl(no) {
    return new URL(`../verify-certificate?no=${encodeURIComponent(no)}`, location.href).href
  }

  /* ---------- HTML preview ---------- */
  function render(sheet, data, opts = {}) {
    sheet.querySelectorAll('[data-p]').forEach((el) => {
      const v = String(data[el.dataset.p] ?? '').trim()
      el.textContent = v || el.dataset.empty || ''
      el.classList.toggle('is-empty', !v)
      if (el.dataset.size) {
        // shrink long names / courses to stay on one line, like the real certificate
        const len = Math.max((v || el.dataset.empty).length, 1)
        el.style.fontSize = `${(el.dataset.size * Math.min(1, el.dataset.max / len)) / 14.14}cqw`
      }
    })
    const soft = sheet.querySelector('.c-soft')
    if (soft) soft.hidden = !String(data.software || '').trim()

    const box = sheet.querySelector('.c-qr')
    if (box) {
      box.hidden = opts.qr === false
      if (opts.qrUrl) box.innerHTML = qrSvg(opts.qrUrl)
    }
    sheet.className = `cert t-${themeFor(data.course)}${data.status === 'revoked' ? ' is-revoked' : ''}`
  }

  /* ---------- PDF (vector, A4 portrait) ---------- */
  function loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => {
        const cv = document.createElement('canvas')
        cv.width = img.naturalWidth
        cv.height = img.naturalHeight
        cv.getContext('2d').drawImage(img, 0, 0)
        resolve({ url: cv.toDataURL('image/png'), w: img.naturalWidth, h: img.naturalHeight })
      }
      img.onerror = () => reject(new Error(`Could not load ${src}`))
      img.src = src
    })
  }

  async function pdf(data, opts = {}) {
    const withQr = opts.qr !== false
    const { jsPDF } = window.jspdf
    const doc = new jsPDF({ unit: 'pt', format: 'a4', orientation: 'portrait', compress: true })
    const W = doc.internal.pageSize.getWidth()
    const S = W / 1414 // sheet px → pt
    const P = (v) => v * S
    const t = THEMES[themeFor(data.course)]
    const [logo, sign] = await Promise.all([loadImage('assets/cert-logo.png'), loadImage('assets/cert-signature.png')])

    doc.setProperties({ title: `Certificate ${data.certificateNo} - ${data.name}`, author: 'Mark Education Academy', subject: 'Certificate of Merit' })

    // frame, white card, swoosh clipped to the card
    doc.setFillColor(t.frame)
    doc.rect(0, 0, W, doc.internal.pageSize.getHeight(), 'F')
    doc.setFillColor('#FFFFFF')
    doc.roundedRect(P(46), P(62), P(1322), P(1876), P(40), P(40), 'F')
    doc.saveGraphicsState()
    doc.roundedRect(P(46), P(62), P(1322), P(1876), P(40), P(40), null)
    doc.clip()
    doc.discardPath()
    doc.setDrawColor(t.swoosh)
    doc.setLineWidth(P(17))
    doc.lines([[P(170), P(-170), P(390), P(-208), P(582), P(-180)]], P(30), P(1960), [1, 1], 'S', false)
    doc.circle(P(707), P(1813), P(100), 'S')
    doc.restoreGraphicsState()

    // logo (top right)
    const logoW = 1414 * 0.279
    doc.addImage(logo.url, 'PNG', P(1414 - 1414 * 0.068 - logoW), P(2000 * 0.056), P(logoW), P((logoW * logo.h) / logo.w))

    const CX = 707
    const centered = (text, y, size, color, bold = false, maxChars = 0, maxW = 1414 * 0.86) => {
      doc.setFont('helvetica', bold ? 'bold' : 'normal')
      let s = maxChars ? size * Math.min(1, maxChars / Math.max(text.length, 1)) : size
      doc.setFontSize(P(s))
      while (doc.getTextWidth(text) > P(maxW) && s > 8) doc.setFontSize(P((s *= 0.95)))
      doc.setTextColor(color)
      doc.text(text, P(CX), P(y), { align: 'center', baseline: 'middle' })
    }

    centered('Certificate of Merit', 345, 108, t.title, true)
    centered('This Certificate is awarded to', 483, 36, t.text)
    centered(data.name, 578, 72, t.accent, true, 24)
    centered('Son/Daughter/Spouse of', 668, 36, t.text)
    centered(data.parentName, 770, 44, t.parent, true, 34)
    centered('For Successfully Completing', 875, 36, t.text)
    centered(data.course, 1000, 64, t.accent, true, 28)
    centered(`and Securing  ${data.grade}`, 1105, 36, t.text)

    // label + value on one line, starting at x (or ending at x when right-aligned)
    const pair = (label, value, x, y, size, alignRight = false) => {
      doc.setFontSize(P(size))
      doc.setFont('helvetica', 'bold')
      const lw = doc.getTextWidth(label)
      doc.setFont('helvetica', 'normal')
      const vw = doc.getTextWidth(value)
      const gap = P(size * 0.6)
      const x0 = alignRight ? P(x) - lw - gap - vw : P(x)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(t.label)
      doc.text(label, x0, P(y), { baseline: 'middle' })
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(t.value)
      doc.text(value, x0 + lw + gap, P(y), { baseline: 'middle' })
    }
    pair('Centre:', data.institution, 1414 * 0.079, 1328, 27)
    pair('Certificate Number:', data.certificateNo, 1414 * (1 - 0.088), 1328, 27, true)

    // issue details
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(P(25.5))
    doc.setTextColor(t.value)
    const issue = [`Place of Issue:  ${data.placeOfIssue}`, `Date Certified:  ${data.certificateDate}`]
    if (String(data.software || '').trim()) issue.push(`Software : ${data.software}`)
    issue.forEach((line, i) => doc.text(line, P(1414 * 0.079), P(1412 + 16 + i * 32), { baseline: 'middle' }))

    // QR code box (bottom right)
    const RX = 1414 * 0.71 + (1414 * 0.26) / 2 // centre of the right column
    if (withQr) {
      const bx = 1414 * 0.759, by = 2000 * 0.674, bw = 1414 * 0.162, bh = 2000 * 0.12
      doc.setDrawColor('#111111')
      doc.setLineWidth(P(2.5))
      doc.setFillColor('#FFFFFF')
      doc.roundedRect(P(bx), P(by), P(bw), P(bh), P(22), P(22), 'FD')
      const { n, dark } = qrMatrix(verifyUrl(data.certificateNo))
      const size = Math.min(bw, bh) - 32
      const qx = bx + (bw - size) / 2, qy = by + (bh - size) / 2, cell = size / n
      doc.setFillColor('#000000')
      for (let r = 0; r < n; r++) {
        // merge horizontal runs of dark modules into one rectangle (smaller, cleaner PDF)
        for (let c = 0; c < n; c++) {
          if (!dark(r, c)) continue
          let e = c
          while (e + 1 < n && dark(r, e + 1)) e++
          doc.rect(P(qx + c * cell), P(qy + r * cell), P((e - c + 1) * cell) + 0.05, P(cell) + 0.05, 'F')
          c = e
        }
      }
    }

    // verify text
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(P(26))
    doc.setTextColor(t.verify)
    doc.text('VERIFY ME', P(RX), P(1596 + 16), { align: 'center', baseline: 'middle' })
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(P(20.5))
    doc.setTextColor('#222222')
    doc.text('markeducationacademy.com', P(RX), P(1596 + 44), { align: 'center', baseline: 'middle' })

    // signature + signer
    const sw = 1414 * 0.132
    doc.addImage(sign.url, 'PNG', P(1414 * 0.765), P(2000 * 0.855), P(sw), P((sw * sign.h) / sign.w))
    doc.setFontSize(P(22.5))
    doc.setTextColor(t.signer)
    ;['Manjunath', 'Centre Head', 'Mark Education Academy', 'Bengaluru'].forEach((line, i) =>
      doc.text(line, P(RX), P(1772 + 14 + i * 29), { align: 'center', baseline: 'middle' }),
    )

    return doc
  }

  window.MarkCert = { render, pdf, qrSvg, qrPng, verifyUrl, themeFor }
})()
