import { motion, useMotionValue, useSpring } from 'framer-motion'

export const Reveal = ({ children, d = 0, y = 28, className, as = 'div' }) => {
  const M = motion[as]
  return <M className={className} initial={{ opacity: 0, y }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: .75, delay: d, ease: [0.22, 1, 0.36, 1] }}>{children}</M>
}

export const Title = ({ eyebrow, title, sub }) => <div className="title"><Reveal><span className="eyebrow">{eyebrow}</span></Reveal><Reveal d={.06}><h2>{title}</h2></Reveal><Reveal d={.12}><p className="sub">{sub}</p></Reveal></div>

export function Button({ children, variant = 'solid', href = '#contact' }) {
  const x = useMotionValue(0), y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 220, damping: 14 }), sy = useSpring(y, { stiffness: 220, damping: 14 })
  const move = e => { const r = e.currentTarget.getBoundingClientRect(); x.set((e.clientX - r.left - r.width / 2) * .18); y.set((e.clientY - r.top - r.height / 2) * .18) }
  return <motion.a href={href} className={'btn ' + variant} style={{ x: sx, y: sy }} onMouseMove={move} onMouseLeave={() => { x.set(0); y.set(0) }} whileTap={{ scale: .97 }}><span>{children}</span><i>→</i></motion.a>
}

export function Tilt({ children, className, max = 7 }) {
  const rx = useMotionValue(0), ry = useMotionValue(0)
  const srx = useSpring(rx, { stiffness: 150, damping: 15 }), sry = useSpring(ry, { stiffness: 150, damping: 15 })
  const move = e => { const r = e.currentTarget.getBoundingClientRect(); ry.set(((e.clientX - r.left) / r.width - .5) * max * 2); rx.set(-((e.clientY - r.top) / r.height - .5) * max * 2) }
  return <motion.div className={className} style={{ rotateX: srx, rotateY: sry, transformPerspective: 900 }} onMouseMove={move} onMouseLeave={() => { rx.set(0); ry.set(0) }}>{children}</motion.div>
}

const P = { doc:'M6 3h9l4 4v14H6zM14 3v5h5M9 13h7M9 17h7', code:'M9 8l-5 4 5 4M15 8l5 4-5 4M13 5l-2 14', leaf:'M5 19c0-9 5-14 14-14 0 9-5 14-14 14zM5 19l8-8', access:'M12 4h.01M5 8h14M12 8v6l-3 6M12 14l3 6', shield:'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6zM9 12l2 2 4-4', cloud:'M7 18a4 4 0 010-8 5.5 5.5 0 0110.5 1.5A3.3 3.3 0 0117 18z', net:'M12 5h.01M5 18h.01M19 18h.01M12 7v5M12 12l-6 5M12 12l6 5', book:'M4 5c3-1 6-1 8 1 2-2 5-2 8-1v13c-3-1-6-1-8 1-2-2-5-2-8-1zM12 6v13', cap:'M2 9l10-5 10 5-10 5zM6 11v5c3 2 9 2 12 0v-5', heart:'M12 20s-8-5-8-11a4.5 4.5 0 018-2.5A4.5 4.5 0 0120 9c0 6-8 11-8 11z', chart:'M5 20V10M11 20V4M17 20v-8M3 20h18', bldg:'M6 21V4h12v17M9 8h2M13 8h2M9 12h2M13 12h2M10 21v-4h4v4', layout:'M4 4h16v16H4zM4 10h16M10 10v10', tablet:'M7 3h10v18H7zM11 18h2', stack:'M12 3l9 5-9 5-9-5zM3 13l9 5 9-5', bulb:'M9 18h6M10 21h4M12 3a6 6 0 00-4 10c1 1 1 2 1 3h6c0-1 0-2 1-3a6 6 0 00-4-10z', pen:'M4 20l4-1 11-11-3-3L5 16zM14 6l3 3', gear:'M12 9a3 3 0 100 6 3 3 0 000-6zM12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1', user:'M12 12a4 4 0 100-8 4 4 0 000 8zM4 21c0-4 4-6 8-6s8 2 8 6' }
export const Icon = ({ n, s = 22 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d={P[n] || P.book} /></svg>

export const Logo = ({ big }) => <span className={'logo' + (big ? ' big' : '')}><img src="/assets/logo.webp" alt="JAA Tech" /></span>
