import * as THREE from 'three'

export const CHAPTERS = [
  { id: 'vision', title: 'Vision & Foundation', sub: 'Building with Purpose', text: 'We began with a vision to build a technology-focused organization that combines digital publishing expertise with modern software and cloud technologies.' },
  { id: 'publishing', title: 'Digital Publishing', sub: 'Transforming Content Digitally', text: 'We started by focusing on digital publishing and content conversion, making information structured, accessible, and ready for modern platforms.' },
  { id: 'expanding', title: 'Expanding Capabilities', sub: 'Growing Beyond Publishing', text: 'As technology evolved, we expanded our expertise into software development, digital solutions, and technology services to meet changing business needs.' },
  { id: 'integration', title: 'Technology Integration', sub: 'Connecting Technology & Innovation', text: 'We embraced modern software, cloud, and digital technologies to build reliable, scalable, and efficient solutions for our clients.' },
  { id: 'integrated', title: 'Integrated Solutions', sub: 'One Technology Partner', text: 'Today, JAA Tech brings publishing technology, software development, and cloud-based solutions together to deliver integrated digital experiences.' },
  { id: 'ahead', title: 'Looking Ahead', sub: 'Evolving for the Future', text: 'We continue to strengthen our technical capabilities, explore emerging technologies, and expand our services to create lasting value for our clients.' },
]

const SERIF = '"Playfair Display", Georgia, serif'
const HAND = 'Caveat, "Segoe Script", "Bradley Hand", cursive'
const MONO = '"JetBrains Mono", Menlo, Consolas, monospace'
const INK = '#2b0b21', BURG = '#880058', GOLD = '#3f8f47', PAPER = '#f7f0e7'
export const PW = 768, PH = 1036

const mk = (w, h, fn) => {
  const c = document.createElement('canvas'); c.width = w; c.height = h
  const g = c.getContext('2d'); fn(g, w, h)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8
  return t
}
const rr = (g, x, y, w, h, r) => { g.beginPath(); g.roundRect(x, y, w, h, r) }
const wrap = (g, t, x, y, mw, lh) => {
  let l = ''
  for (const w of t.split(' ')) {
    const n = l ? l + ' ' + w : w
    if (g.measureText(n).width > mw && l) { g.fillText(l, x, y); y += lh; l = w } else l = n
  }
  g.fillText(l, x, y); return y
}
const grain = (g, w, h, n, rgb, a) => {
  for (let i = 0; i < n; i++) { g.fillStyle = `rgba(${rgb},${Math.random() * a})`; g.fillRect(Math.random() * w, Math.random() * h, 1.6, 1.6) }
}
const bars = (g, x, y, w, n, lh, seedShift = 0, col = 'rgba(43,11,33,.28)') => {
  g.fillStyle = col
  for (let i = 0; i < n; i++) {
    const ww = w * (i === n - 1 ? .55 : .9 + ((i * 37 + seedShift) % 10) / 100)
    rr(g, x, y + i * lh, Math.min(ww, w), 7, 3.5); g.fill()
  }
}

/* ---------------- cover / spine / edges ---------------- */
export const coverTexture = () => mk(1024, 1440, (g, w, h) => {
  const gr = g.createLinearGradient(0, 0, w, h)
  gr.addColorStop(0, '#8f0060'); gr.addColorStop(.55, '#700049'); gr.addColorStop(1, '#4e0032')
  g.fillStyle = gr; g.fillRect(0, 0, w, h)
  grain(g, w, h, 60000, '0,0,0', .16); grain(g, w, h, 30000, '255,120,120', .05)
  const foil = g.createLinearGradient(0, 0, w, 0)
  foil.addColorStop(0, '#4f9f57'); foil.addColorStop(.35, '#b8f0be'); foil.addColorStop(.6, '#7cca85'); foil.addColorStop(1, '#3f8a49')
  g.strokeStyle = foil; g.lineWidth = 6; g.strokeRect(70, 70, w - 140, h - 140)
  g.lineWidth = 2; g.strokeRect(92, 92, w - 184, h - 184)
  ;[[70, 70], [w - 70, 70], [70, h - 70], [w - 70, h - 70]].forEach(([x, y]) => { g.fillStyle = foil; g.beginPath(); g.arc(x, y, 12, 0, 7); g.fill() })
  g.fillStyle = foil; g.textAlign = 'center'
  g.font = `600 150px ${SERIF}`; g.letterSpacing = '14px'; g.fillText('JAA', w / 2, 560)
  g.font = `600 96px ${SERIF}`; g.fillText('TECH', w / 2, 680)
  g.letterSpacing = '0px'
  g.fillRect(w / 2 - 150, 740, 300, 3)
  g.font = `italic 500 40px ${SERIF}`; g.fillText('Our Journey', w / 2, 820)
  g.font = `600 22px ${SERIF}`; g.letterSpacing = '5px'; g.fillText('BETTER CONTENT. A BRIGHTER FUTURE.', w / 2, 1240)
  // small emblem: open book
  g.strokeStyle = foil; g.lineWidth = 5; g.beginPath()
  g.moveTo(w / 2, 1040); g.quadraticCurveTo(w / 2 - 80, 1000, w / 2 - 150, 1030); g.lineTo(w / 2 - 150, 1110)
  g.quadraticCurveTo(w / 2 - 80, 1085, w / 2, 1120); g.quadraticCurveTo(w / 2 + 80, 1085, w / 2 + 150, 1110)
  g.lineTo(w / 2 + 150, 1030); g.quadraticCurveTo(w / 2 + 80, 1000, w / 2, 1040); g.moveTo(w / 2, 1040); g.lineTo(w / 2, 1120); g.stroke()
})
export const bumpTexture = () => mk(512, 512, (g, w, h) => {
  g.fillStyle = '#808080'; g.fillRect(0, 0, w, h)
  for (let i = 0; i < 26000; i++) { const v = 90 + Math.random() * 90 | 0; g.fillStyle = `rgb(${v},${v},${v})`; g.fillRect(Math.random() * w, Math.random() * h, 2, 2) }
})
export const spineTexture = () => mk(256, 1024, (g, w, h) => {
  g.fillStyle = '#5a003b'; g.fillRect(0, 0, w, h); grain(g, w, h, 12000, '0,0,0', .18)
  g.fillStyle = '#8fd69a'
  ;[70, 84, h - 84, h - 70].forEach(y => g.fillRect(20, y, w - 40, 4))
  ;[300, 316, h - 316, h - 300].forEach(y => g.fillRect(20, y, w - 40, 3))
  g.save(); g.translate(w / 2, h / 2); g.rotate(-Math.PI / 2)
  g.textAlign = 'center'; g.font = `600 46px ${SERIF}`; g.letterSpacing = '10px'; g.fillText('JAA TECH', 0, 16); g.restore()
})
export const endpaperTexture = () => mk(256, 256, (g, w, h) => {
  g.fillStyle = '#efe3d3'; g.fillRect(0, 0, w, h)
  g.strokeStyle = 'rgba(136,0,88,.22)'; g.lineWidth = 1.4
  for (let y = 0; y <= h; y += 32) for (let x = 0; x <= w; x += 32) { g.beginPath(); g.arc(x, y, 12, 0, Math.PI * 2); g.stroke(); g.beginPath(); g.arc(x + 16, y + 16, 12, 0, Math.PI * 2); g.stroke() }
})
export const edgeTexture = (vertical) => {
  const t = mk(vertical ? 256 : 16, vertical ? 16 : 256, (g, w, h) => {
    g.fillStyle = '#efe2c8'; g.fillRect(0, 0, w, h); g.fillStyle = 'rgba(120,90,50,.32)'
    for (let i = 0; i < 64; i++) vertical ? g.fillRect(i * 4, 0, 1.2, h) : g.fillRect(0, i * 4, w, 1.2)
  })
  t.wrapS = t.wrapT = THREE.RepeatWrapping; return t
}
export const radial = (rgb, a, size = 256) => mk(size, size, (g, w, h) => {
  const gr = g.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2)
  gr.addColorStop(0, `rgba(${rgb},${a})`); gr.addColorStop(.5, `rgba(${rgb},${a * .35})`); gr.addColorStop(1, `rgba(${rgb},0)`)
  g.fillStyle = gr; g.fillRect(0, 0, w, h)
})

/* ---------------- book pages ---------------- */
const paper = (g, w, h, side, folio) => {
  g.fillStyle = PAPER; g.fillRect(0, 0, w, h)
  const gr = g.createLinearGradient(side === 'R' ? 0 : w, 0, side === 'R' ? w * .24 : w * .76, 0)
  gr.addColorStop(0, 'rgba(90,60,30,.42)'); gr.addColorStop(1, 'rgba(90,60,30,0)')
  g.fillStyle = gr; g.fillRect(0, 0, w, h)
  grain(g, w, h, 3000, '120,90,50', .06)
  g.fillStyle = 'rgba(43,11,33,.5)'; g.textAlign = 'center'
  g.font = `600 17px ${SERIF}`; g.letterSpacing = '5px'; g.fillText('JAA TECH · OUR JOURNEY', w / 2, 64); g.letterSpacing = '0px'
  if (folio) { g.font = `italic 500 22px ${SERIF}`; g.fillText(String(folio), w / 2, h - 50) }
}
const ornament = (g, x, y, w = 180) => {
  g.strokeStyle = GOLD; g.lineWidth = 2; g.beginPath(); g.moveTo(x - w / 2, y); g.lineTo(x - 16, y); g.moveTo(x + 16, y); g.lineTo(x + w / 2, y); g.stroke()
  g.fillStyle = GOLD; g.beginPath(); g.moveTo(x, y - 9); g.lineTo(x + 9, y); g.lineTo(x, y + 9); g.lineTo(x - 9, y); g.fill()
}

export const leftFront = () => mk(PW, PH, (g, w, h) => {
  paper(g, w, h, 'L', 'ii')
  g.textAlign = 'center'; g.fillStyle = BURG; g.font = `italic 500 34px ${SERIF}`; g.fillText('Contents', w / 2, 250)
  ornament(g, w / 2, 285)
  CHAPTERS.forEach((c, i) => {
    const y = 400 + i * 84
    g.textAlign = 'left'; g.fillStyle = GOLD; g.font = `600 26px ${SERIF}`; g.fillText('0' + (i + 1), 120, y)
    g.fillStyle = INK; g.font = `600 29px ${SERIF}`; g.fillText(c.title, 190, y)
    g.strokeStyle = 'rgba(43,11,33,.25)'; g.setLineDash([2, 7]); g.beginPath(); g.moveTo(190 + g.measureText(c.title).width + 24, y - 6); g.lineTo(w - 130, y - 6); g.stroke(); g.setLineDash([])
    g.textAlign = 'right'; g.font = `italic 500 26px ${SERIF}`; g.fillText(String(3 + i * 2), w - 100, y)
  })
})
export const titlePage = () => mk(PW, PH, (g, w, h) => {
  paper(g, w, h, 'R', 1)
  g.textAlign = 'center'; g.fillStyle = BURG
  g.font = `600 70px ${SERIF}`; g.letterSpacing = '8px'; g.fillText('OUR', w / 2, 400); g.fillText('JOURNEY', w / 2, 490); g.letterSpacing = '0px'
  ornament(g, w / 2, 560, 260)
  g.fillStyle = INK; g.font = `italic 500 30px ${SERIF}`; g.fillText('Better Content.', w / 2, 640); g.fillText('A Brighter Future.', w / 2, 684)
  g.fillStyle = GOLD; g.font = `600 22px ${SERIF}`; g.letterSpacing = '8px'; g.fillText('JAA TECH', w / 2, h - 150)
})
export const versoPage = (k) => mk(PW, PH, (g, w, h) => {
  const c = CHAPTERS[k]
  paper(g, w, h, 'L', 2 * k + 4)
  g.textAlign = 'center'
  g.fillStyle = 'rgba(136,0,88,.12)'; g.font = `700 300px ${SERIF}`; g.fillText('0' + (k + 1), w / 2, 400)
  let fs = 60; g.font = `600 ${fs}px ${SERIF}`
  while (g.measureText(c.title).width > w - 150 && fs > 30) { fs -= 2; g.font = `600 ${fs}px ${SERIF}` }
  g.fillStyle = BURG; g.fillText(c.title, w / 2, 490)
  ornament(g, w / 2, 530, 240)
  g.fillStyle = '#2b6b31'; g.font = `600 28px ${SERIF}`; g.letterSpacing = '1px'
  let sf = 28; while (g.measureText(c.sub).width > w - 130 && sf > 20) { sf -= 1; g.font = `600 ${sf}px ${SERIF}` }
  g.fillText(c.sub, w / 2, 590); g.letterSpacing = '0px'
  g.fillStyle = INK; g.font = `500 29px ${SERIF}`; wrapCenter(g, c.text, w / 2, 665, w - 190, 44)
})
const wrapCenter = (g, t, cx, y, mw, lh) => {
  const ws = t.split(' '); let l = ''; const lines = []
  for (const w of ws) { const n = l ? l + ' ' + w : w; if (g.measureText(n).width > mw && l) { lines.push(l); l = w } else l = n }
  lines.push(l); lines.forEach((s, i) => g.fillText(s, cx, y + i * lh))
}
export const endVerso = () => mk(PW, PH, (g, w, h) => {
  paper(g, w, h, 'L', 16)
  g.textAlign = 'center'; g.fillStyle = BURG; g.font = `italic 500 58px ${SERIF}`; g.fillText('Better Content.', w / 2, 430); g.fillText('A Brighter Future.', w / 2, 505)
  ornament(g, w / 2, 570, 240)
  g.fillStyle = GOLD; g.font = `600 22px ${SERIF}`; g.letterSpacing = '8px'; g.fillText('JAA TECH', w / 2, 640); g.letterSpacing = '0px'
})
export const backFace = () => mk(PW, PH, (g, w, h) => {
  paper(g, w, h, 'R', null)
  g.textAlign = 'center'; g.fillStyle = 'rgba(136,0,88,.5)'; g.font = `600 24px ${SERIF}`; g.letterSpacing = '9px'; g.fillText('JAA TECH', w / 2, h - 140)
})

/* art (recto) pages, index = chapter */
export const artPage = (k) => mk(PW, PH, (g, w, h) => {
  paper(g, w, h, 'R', 2 * k + 5)
  g.lineCap = 'round'; g.lineJoin = 'round'
  if (k === 0) { // idea
    g.strokeStyle = BURG; g.lineWidth = 6
    g.beginPath(); g.arc(384, 380, 118, Math.PI * .78, Math.PI * 2.22); g.quadraticCurveTo(440, 470, 442, 520); g.lineTo(326, 520); g.quadraticCurveTo(328, 470, 292, 420); g.stroke()
    g.lineWidth = 5; ;[540, 566, 592].forEach(y => { g.beginPath(); g.moveTo(336, y); g.lineTo(432, y); g.stroke() })
    g.strokeStyle = GOLD; g.lineWidth = 4
    for (let i = 0; i < 9; i++) { const a = Math.PI * (1.1 + i * .1); g.beginPath(); g.moveTo(384 + Math.cos(a) * 158, 380 + Math.sin(a) * 158); g.lineTo(384 + Math.cos(a) * 205, 380 + Math.sin(a) * 205); g.stroke() }
    g.strokeStyle = BURG; g.lineWidth = 4; g.beginPath(); g.moveTo(350, 400); g.quadraticCurveTo(384, 340, 384, 440); g.moveTo(384, 440); g.quadraticCurveTo(384, 340, 420, 400); g.stroke()
    g.fillStyle = INK; g.textAlign = 'center'; g.font = `600 78px ${HAND}`; g.fillText('Our vision', w / 2, 730)
    g.font = `500 52px ${HAND}`; g.fillStyle = BURG; g.fillText('built with purpose', w / 2, 800)
    g.strokeStyle = GOLD; g.setLineDash([3, 9]); g.beginPath(); g.moveTo(180, 830); g.lineTo(w - 120, 830); g.stroke(); g.setLineDash([])
  } else if (k === 1) { // content
    g.textAlign = 'left'; g.fillStyle = BURG; g.font = `600 22px ${SERIF}`; g.letterSpacing = '8px'; g.fillText('CHAPTER ONE', 130, 190); g.letterSpacing = '0px'
    g.fillStyle = INK; g.font = `600 60px ${SERIF}`; g.fillText('Once upon', 130, 270); g.fillText('a manuscript', 130, 336)
    g.fillStyle = BURG; g.font = `700 150px ${SERIF}`; g.fillText('W', 128, 520)
    bars(g, 250, 430, w - 350, 3, 32, 3); bars(g, 130, 545, w - 230, 12, 32, 5)
    g.strokeStyle = 'rgba(196,42,146,.85)'; g.lineWidth = 4
    ;[[130, 577, 520], [130, 673, 440]].forEach(([x, y, l]) => { g.beginPath(); g.moveTo(x, y + 3); g.lineTo(x + l, y + 3); g.stroke() })
    g.fillStyle = BURG; g.font = `500 38px ${HAND}`; g.fillText('tighten ↑', w - 260, 590); g.fillText('lovely!', w - 210, 800)
    g.font = `600 30px ${SERIF}`; g.fillText('¶', 100, 928)
  } else if (k === 2) { // expanding capabilities: publishing at the core, services around it
    const cx = w / 2, cy = 400
    g.strokeStyle = 'rgba(136,0,88,.3)'; g.lineWidth = 3; g.setLineDash([6, 10])
    ;[300, 205].forEach(r => { g.beginPath(); g.arc(cx, cy, r, 0, 7); g.stroke() }); g.setLineDash([])
    const nodes = [['Software', -Math.PI / 2], ['Digital Solutions', Math.PI / 6], ['Tech Services', Math.PI * 5 / 6]]
    g.strokeStyle = GOLD; g.lineWidth = 4
    nodes.forEach(([, a]) => { g.beginPath(); g.moveTo(cx + Math.cos(a) * 108, cy + Math.sin(a) * 108); g.lineTo(cx + Math.cos(a) * 205, cy + Math.sin(a) * 205); g.stroke() })
    g.fillStyle = BURG; g.beginPath(); g.arc(cx, cy, 108, 0, 7); g.fill()
    g.fillStyle = '#fff'; g.textAlign = 'center'; g.font = `600 32px ${SERIF}`; g.fillText('Publishing', cx, cy + 11)
    nodes.forEach(([t, a]) => {
      const x = cx + Math.cos(a) * 205, y = cy + Math.sin(a) * 205
      g.fillStyle = '#3f8f47'; rr(g, x - 105, y - 30, 210, 60, 30); g.fill()
      g.fillStyle = '#fff'; g.font = `600 25px ${SERIF}`; g.fillText(t, x, y + 9)
    })
    g.fillStyle = BURG; g.font = `600 56px ${HAND}`; g.fillText('growing beyond publishing', w / 2, 850)
  } else if (k === 3) { // technology integration: layered stack
    const rows = [['Digital Experiences', '#3f8f47'], ['Cloud Platform', BURG], ['Software Services', '#3f8f47'], ['Content Foundation', BURG]]
    g.textAlign = 'center'
    rows.forEach(([t, c], i) => {
      const y = 190 + i * 118
      g.fillStyle = c; rr(g, 124, y, w - 248, 92, 16); g.fill()
      g.fillStyle = '#fff'; g.font = `600 33px ${SERIF}`; g.fillText(t, w / 2, y + 58)
      if (i < 3) { g.strokeStyle = GOLD; g.lineWidth = 4; g.beginPath(); g.moveTo(w / 2, y + 96); g.lineTo(w / 2, y + 114); g.stroke() }
    })
    ;['Reliable', 'Scalable', 'Efficient'].forEach((t, i) => {
      const x = w / 2 + (i - 1) * 190
      g.fillStyle = '#fff'; g.strokeStyle = BURG; g.lineWidth = 3; rr(g, x - 80, 720, 160, 54, 27); g.fill(); g.stroke()
      g.fillStyle = INK; g.font = `600 25px ${SERIF}`; g.fillText(t, x, 755)
    })
    g.fillStyle = BURG; g.font = `600 52px ${HAND}`; g.fillText('one connected stack', w / 2, 850)
  } else if (k === 4) { // integrated solutions: three disciplines, one partner
    const C = [[384, 310, 'rgba(136,0,88,.42)'], [300, 450, 'rgba(63,143,71,.45)'], [468, 450, 'rgba(90,40,110,.38)']]
    C.forEach(([x, y, c]) => { g.fillStyle = c; g.beginPath(); g.arc(x, y, 150, 0, 7); g.fill() })
    g.textAlign = 'center'; g.fillStyle = INK; g.font = `600 30px ${SERIF}`
    g.fillText('Publishing', 384, 235); g.fillText('Software', 238, 520); g.fillText('Cloud', 530, 520)
    g.fillStyle = '#fff'; g.beginPath(); g.arc(384, 402, 58, 0, 7); g.fill()
    g.fillStyle = BURG; g.font = `700 27px ${SERIF}`; g.fillText('JAA', 384, 397); g.fillText('TECH', 384, 427)
    g.fillStyle = BURG; g.font = `600 58px ${HAND}`; g.fillText('one technology partner', w / 2, 760)
    g.fillStyle = INK; g.font = `italic 500 30px ${SERIF}`; g.fillText('integrated digital experiences', w / 2, 830)
  } else { // looking ahead: rising growth
    const base = 640
    ;[100, 170, 250, 340, 440].forEach((hh, i) => { g.fillStyle = i % 2 ? '#3f8f47' : BURG; rr(g, 140 + i * 105, base - hh, 80, hh, 8); g.fill() })
    g.strokeStyle = '#2b6b31'; g.lineWidth = 6; g.beginPath(); g.moveTo(130, base - 130); g.quadraticCurveTo(360, base - 190, 640, base - 500); g.stroke()
    g.fillStyle = '#2b6b31'; g.beginPath(); g.moveTo(668, base - 530); g.lineTo(606, base - 508); g.lineTo(648, base - 466); g.closePath(); g.fill()
    g.strokeStyle = 'rgba(43,11,33,.35)'; g.lineWidth = 3; g.beginPath(); g.moveTo(110, base + 8); g.lineTo(w - 90, base + 8); g.stroke()
    g.textAlign = 'center'; g.fillStyle = INK; g.font = `500 32px ${SERIF}`
    ;['Stronger capabilities', 'Emerging technologies', 'Expanded services'].forEach((t, i) => { g.fillText('✦  ' + t, w / 2, 740 + i * 52) })
  }
})

/* ---------------- prop textures ---------------- */
export const glyph = (text, { font = SERIF, size = 180, color = '#a8e6b0', italic = false, w = 256, h = 256, weight = 600 } = {}) => mk(w, h, (g, W, Hh) => {
  g.textAlign = 'center'; g.textBaseline = 'middle'; g.shadowColor = 'rgba(147,220,155,.5)'; g.shadowBlur = 28
  g.fillStyle = color; g.font = `${italic ? 'italic ' : ''}${weight} ${size}px ${font}`; g.fillText(text, W / 2, Hh / 2 + size * .04)
})
export const hand = (t, color = '#ffffff') => glyph(t, { font: HAND, size: 96, color, w: 512, h: 160, weight: 600 })
export const chip = (t, fg = '#9ad7b0') => mk(384, 128, (g, w, h) => {
  g.fillStyle = 'rgba(28,14,20,.92)'; rr(g, 6, 6, w - 12, h - 12, 22); g.fill(); g.strokeStyle = 'rgba(154,215,176,.55)'; g.lineWidth = 3; g.stroke()
  g.fillStyle = fg; g.font = `600 44px ${MONO}`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(t, w / 2, h / 2 + 3)
})
export const bulb = () => mk(256, 256, (g) => {
  g.shadowColor = 'rgba(147,220,155,.8)'; g.shadowBlur = 30; g.strokeStyle = '#a8e6b0'; g.lineWidth = 8; g.lineCap = 'round'
  g.beginPath(); g.arc(128, 104, 56, Math.PI * .8, Math.PI * 2.2); g.quadraticCurveTo(160, 156, 160, 176); g.lineTo(96, 176); g.quadraticCurveTo(96, 156, 76, 138); g.stroke()
  g.beginPath(); g.moveTo(104, 198); g.lineTo(152, 198); g.moveTo(112, 220); g.lineTo(144, 220); g.stroke()
  g.lineWidth = 6; g.beginPath(); g.moveTo(108, 120); g.quadraticCurveTo(128, 84, 128, 140); g.moveTo(128, 140); g.quadraticCurveTo(128, 84, 148, 120); g.stroke()
})
export const manuscript = (title) => mk(300, 400, (g, w, h) => {
  g.fillStyle = '#f6ecd9'; rr(g, 4, 4, w - 8, h - 8, 6); g.fill()
  g.fillStyle = BURG; g.font = `600 28px ${SERIF}`; g.textAlign = 'left'; g.fillText(title, 32, 62)
  bars(g, 32, 96, w - 64, 13, 22, 3, 'rgba(43,11,33,.35)')
  g.strokeStyle = 'rgba(196,42,146,.8)'; g.lineWidth = 3; g.beginPath(); g.moveTo(32, 143); g.lineTo(200, 143); g.stroke()
})
export const coverMock = (c1, c2, t) => mk(240, 340, (g, w, h) => {
  const gr = g.createLinearGradient(0, 0, w, h); gr.addColorStop(0, c1); gr.addColorStop(1, c2); g.fillStyle = gr; rr(g, 2, 2, w - 4, h - 4, 8); g.fill()
  g.strokeStyle = 'rgba(255,240,210,.7)'; g.lineWidth = 2; g.strokeRect(16, 16, w - 32, h - 32)
  g.fillStyle = '#f9efd9'; g.textAlign = 'center'; g.font = `600 34px ${SERIF}`; g.fillText(t, w / 2, 130); g.fillRect(w / 2 - 34, 158, 68, 2)
})
export const swatch = (c) => mk(128, 128, (g) => { g.fillStyle = c; g.beginPath(); g.arc(64, 64, 52, 0, 7); g.fill(); g.strokeStyle = 'rgba(255,240,210,.85)'; g.lineWidth = 5; g.stroke() })
export const typeCard = () => mk(300, 300, (g, w, h) => {
  g.fillStyle = '#f6ecd9'; rr(g, 4, 4, w - 8, h - 8, 14); g.fill()
  g.fillStyle = BURG; g.textAlign = 'center'; g.font = `600 130px ${SERIF}`; g.fillText('Aa', w / 2, 170)
  g.fillStyle = INK; g.font = `italic 500 28px ${SERIF}`; g.fillText('Playfair Display', w / 2, 230)
})
export const gridCard = () => mk(300, 380, (g, w, h) => {
  g.fillStyle = '#f6ecd9'; rr(g, 4, 4, w - 8, h - 8, 10); g.fill(); g.strokeStyle = 'rgba(200,40,110,.6)'; g.lineWidth = 2; g.setLineDash([6, 6]); g.strokeRect(30, 30, w - 60, h - 60); g.setLineDash([])
  g.fillStyle = 'rgba(136,0,88,.75)'; g.fillRect(50, 52, w - 100, 70); g.fillStyle = 'rgba(43,11,33,.5)'; g.fillRect(50, 140, 100, 110); g.fillRect(166, 140, 84, 110); bars(g, 50, 275, w - 100, 4, 18)
})
export const tree = () => mk(320, 400, (g, w, h) => {
  g.fillStyle = 'rgba(28,14,20,.94)'; rr(g, 4, 4, w - 8, h - 8, 16); g.fill(); g.strokeStyle = 'rgba(154,215,176,.5)'; g.lineWidth = 3; g.stroke()
  g.font = `500 25px ${MONO}`; g.textAlign = 'left'
  ;[['book.epub', 0, '#f0d28a'], ['├ META-INF/', 1, '#9ad7b0'], ['│  container.xml', 2, '#e7b8c2'], ['├ OEBPS/', 1, '#9ad7b0'], ['│  content.opf', 2, '#e7b8c2'], ['│  nav.xhtml', 2, '#e7b8c2'], ['│  ch01.xhtml', 2, '#e7b8c2'], ['└ mimetype', 1, '#f6ead6']].forEach(([t, l, c], i) => { g.fillStyle = c; g.fillText(t, 26, 60 + i * 42) })
})
export const fileCard = () => mk(240, 300, (g, w, h) => {
  g.fillStyle = '#fbf6ec'; g.strokeStyle = BURG; g.lineWidth = 5
  g.beginPath(); g.moveTo(24, 16); g.lineTo(150, 16); g.lineTo(216, 82); g.lineTo(216, 284); g.lineTo(24, 284); g.closePath(); g.fill(); g.stroke()
  g.fillStyle = BURG; g.textAlign = 'center'; g.font = `700 54px ${SERIF}`; g.fillText('EPUB', w / 2, 190)
})
export const isbn = () => mk(360, 240, (g, w, h) => {
  g.fillStyle = '#fff'; rr(g, 4, 4, w - 8, h - 8, 10); g.fill(); g.fillStyle = '#20100f'
  for (let i = 0; i < 52; i++) g.fillRect(28 + i * 5.9, 34, (i * 7 % 3) + 1.5, 130)
  g.font = `500 22px ${MONO}`; g.textAlign = 'center'; g.fillText('ISBN 978-1-23456-789-7', w / 2, 204)
})
export const nodeLabel = (t) => mk(320, 96, (g, w, h) => {
  g.fillStyle = 'rgba(251,241,222,.95)'; rr(g, 6, 6, w - 12, h - 12, 44); g.fill(); g.strokeStyle = '#3f8f47'; g.lineWidth = 4; g.stroke()
  g.fillStyle = BURG; g.font = `600 38px ${SERIF}`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(t, w / 2, h / 2 + 2)
})
export const screen = (kind) => mk(384, 512, (g, w, h) => {
  g.fillStyle = kind === 'ereader' ? '#e9e0cf' : '#f7efe0'; g.fillRect(0, 0, w, h)
  g.fillStyle = BURG; g.font = `600 40px ${SERIF}`; g.textAlign = 'left'; g.fillText('Chapter 1', 36, 76)
  bars(g, 36, 112, w - 72, 11, 30, 2)
  g.fillStyle = 'rgba(43,11,33,.15)'; rr(g, 36, h - 60, w - 72, 7, 3); g.fill(); g.fillStyle = BURG; rr(g, 36, h - 60, (w - 72) * .42, 7, 3); g.fill()
})
export const dispose = (o) => Object.values(o).forEach(t => t?.dispose?.())
