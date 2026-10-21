import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Play, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { Reveal, Title } from '../components/ui.jsx'
import './Team.css'

const DIR = '/assets/Jaa team/'
const src = (file) => encodeURI(DIR + file)

/* Every photo and video from the "Jaa team" folder.
   w / h are the real pixel dimensions, used so each tile keeps its
   true aspect ratio (nothing is cropped) and the layout doesn't jump. */
const MEDIA = [
  { type: 'image', file: 'team discussion.jpg', title: 'Team Discussion', tag: 'Life at JAA', w: 1428, h: 1071 },
  { type: 'video', file: 'birthday celebration.mp4', poster: 'posters/birthday-celebration.jpg', title: 'Birthday Celebration', tag: 'Celebrations', w: 478, h: 850 },
  { type: 'image', file: 'celebration1.jpg', title: 'Festive Celebration', tag: 'Celebrations', w: 1428, h: 1071 },
  { type: 'image', file: 'work at jaa tech.jpg', title: 'Work at JAA TECH', tag: 'Life at JAA', w: 1071, h: 1428 },
  { type: 'image', file: 'birthday1.jpg', title: 'Birthday Celebration', tag: 'Celebrations', w: 1600, h: 1200 },
  { type: 'video', file: 'celebration.mp4', poster: 'posters/celebration.jpg', title: 'Celebration Highlights', tag: 'Celebrations', w: 848, h: 478 },
  { type: 'image', file: 'team outing 1.jpg', title: 'Team Outing', tag: 'Outings', w: 1600, h: 1200 },
  { type: 'image', file: 'celebration3.jpg', title: 'Festive Day Together', tag: 'Celebrations', w: 1200, h: 1600 },
  { type: 'image', file: 'team outing 2.jpg', title: 'Game Day Outing', tag: 'Outings', w: 1600, h: 1200 },
  { type: 'video', file: '1st anniversary celebration.mp4', poster: 'posters/1st-anniversary-celebration.jpg', title: '1st Anniversary Celebration', tag: '1st Anniversary', w: 848, h: 478 },
  { type: 'image', file: '1st anniversary cake.jpg', title: '1st Anniversary Cake', tag: '1st Anniversary', w: 900, h: 1600 },
  { type: 'image', file: 'team outing 3.jpg', title: 'Badminton Outing', tag: 'Outings', w: 1428, h: 1071 },
  { type: 'video', file: '1st anniversary.mp4', poster: 'posters/1st-anniversary.jpg', title: '1st Anniversary Moments', tag: '1st Anniversary', w: 848, h: 478 },
  { type: 'image', file: 'director joining.jpg', title: 'Work at JAA', tag: 'Life at JAA', w: 1200, h: 1600 },
]

const FILTERS = ['All', 'Celebrations', '1st Anniversary', 'Outings', 'Life at JAA']

export function Team() {
  const [filter, setFilter] = useState('All')
  const [active, setActive] = useState(null) // index within `items`
  const lastTrigger = useRef(null)

  const items = useMemo(
    () => (filter === 'All' ? MEDIA : MEDIA.filter((m) => m.tag === filter)),
    [filter]
  )

  const photoCount = MEDIA.filter((m) => m.type === 'image').length
  const videoCount = MEDIA.length - photoCount

  const open = (i, e) => {
    lastTrigger.current = e.currentTarget
    setActive(i)
  }
  const close = useCallback(() => {
    setActive(null)
    lastTrigger.current?.focus?.()
  }, [])

  return (
    <section id="team" className="team-section">
      <div className="wrap">
        <Title
          eyebrow="Our People"
          title="Meet Our Team"
          sub="Behind every polished page is a group of curious, creative people who love what they do — and love doing it together. Here's a glimpse of life at JAA TECH."
        />

        <Reveal d={0.1}>
          <div className="team-toolbar">
            <div className="team-filters" role="tablist" aria-label="Filter team moments">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  type="button"
                  role="tab"
                  aria-selected={filter === f}
                  className={'team-chip' + (filter === f ? ' active' : '')}
                  onClick={() => setFilter(f)}
                >
                  {f}
                </button>
              ))}
            </div>
            <span className="team-count">{photoCount} photos · {videoCount} videos</span>
          </div>
        </Reveal>

        <div className="team-grid">
          <AnimatePresence initial={false}>
            {items.map((m, i) => (
              <motion.figure
                key={m.file + filter}
                className={'team-tile ' + m.type}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.6, delay: (i % 3) * 0.07, ease: [0.22, 1, 0.36, 1] }}
              >
                <button
                  type="button"
                  className="team-open"
                  onClick={(e) => open(i, e)}
                  aria-label={`${m.type === 'video' ? 'Play video' : 'View photo'}: ${m.title}`}
                >
                  <span className="team-frame" style={{ aspectRatio: `${m.w} / ${m.h}` }}>
                    <img
                      src={src(m.type === 'video' ? m.poster : m.file)}
                      alt={m.type === 'video' ? `${m.title} (video thumbnail)` : `${m.title} — JAA TECH team`}
                      loading="lazy"
                      decoding="async"
                      width={m.w}
                      height={m.h}
                    />
                    {m.type === 'video' && (
                      <span className="team-play" aria-hidden="true">
                        <Play size={22} fill="currentColor" />
                      </span>
                    )}
                    <span className="team-shade" aria-hidden="true" />
                    <figcaption className="team-cap">
                      <small>{m.type === 'video' ? 'Video · ' : ''}{m.tag}</small>
                      <b>{m.title}</b>
                    </figcaption>
                  </span>
                </button>
              </motion.figure>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {active !== null && items[active] && (
          <Lightbox items={items} index={active} setIndex={setActive} onClose={close} />
        )}
      </AnimatePresence>
    </section>
  )
}

function Lightbox({ items, index, setIndex, onClose }) {
  const m = items[index]
  const total = items.length
  const closeRef = useRef(null)

  const prev = useCallback(() => setIndex((i) => (i - 1 + total) % total), [setIndex, total])
  const next = useCallback(() => setIndex((i) => (i + 1) % total), [setIndex, total])

  useEffect(() => {
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowLeft') prev()
      else if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose, prev, next])

  return createPortal(
    <motion.div
      className="team-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={m.title}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
    >
      <button ref={closeRef} type="button" className="lb-btn lb-close" onClick={onClose} aria-label="Close">
        <X size={22} />
      </button>

      {total > 1 && (
        <>
          <button type="button" className="lb-btn lb-prev" onClick={(e) => { e.stopPropagation(); prev() }} aria-label="Previous">
            <ChevronLeft size={26} />
          </button>
          <button type="button" className="lb-btn lb-next" onClick={(e) => { e.stopPropagation(); next() }} aria-label="Next">
            <ChevronRight size={26} />
          </button>
        </>
      )}

      <div className="lb-stage" onClick={(e) => e.stopPropagation()}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={m.file}
            className="lb-media"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.22 }}
          >
            {m.type === 'video' ? (
              <video
                src={src(m.file)}
                poster={src(m.poster)}
                controls
                autoPlay
                playsInline
                preload="metadata"
              />
            ) : (
              <img src={src(m.file)} alt={`${m.title} — JAA TECH team`} />
            )}
          </motion.div>
        </AnimatePresence>
        <div className="lb-caption">
          <div>
            <small>{m.tag}</small>
            <b>{m.title}</b>
          </div>
          <span>{index + 1} / {total}</span>
        </div>
      </div>
    </motion.div>,
    document.body
  )
}

export default Team
