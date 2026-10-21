import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { FaEnvelope, FaTimes, FaPaperclip } from 'react-icons/fa'
import { formatMailMessage, openMail } from '../lib/mail.js'
import '../styles/forms.css'

const MAX_MB = 5
const OK_EXT = /\.(pdf|doc|docx)$/i
const EMPTY = { name: '', email: '', phone: '', role: '', location: '', level: 'Fresher', years: '', skills: '', message: '' }

export default function ApplyModal({ role, roles, onClose }) {
  const [f, setF] = useState({ ...EMPTY, role })
  const [file, setFile] = useState(null)
  const [err, setErr] = useState({})
  const [sent, setSent] = useState(null) // holds the message once submitted
  const first = useRef(null)

  useEffect(() => {
    const onKey = e => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    first.current?.focus()
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prev }
  }, [onClose])

  const set = e => {
    const { name, value } = e.target
    setF(p => ({ ...p, [name]: value }))
    setErr(p => ({ ...p, [name]: '' }))
  }

  const pick = e => {
    const x = e.target.files?.[0]
    if (!x) return setFile(null)
    if (!OK_EXT.test(x.name)) { setErr(p => ({ ...p, resume: 'Please upload a PDF, DOC or DOCX file.' })); e.target.value = ''; return }
    if (x.size > MAX_MB * 1024 * 1024) { setErr(p => ({ ...p, resume: `File is larger than ${MAX_MB} MB.` })); e.target.value = ''; return }
    setErr(p => ({ ...p, resume: '' })); setFile(x)
  }

  const validate = () => {
    const e = {}
    if (!f.name.trim()) e.name = 'Please enter your full name.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())) e.email = 'Please enter a valid email address.'
    if (!/^\+?\d{10,14}$/.test(f.phone.replace(/[\s-]/g, ''))) e.phone = 'Please enter a valid phone number.'
    if (!f.role) e.role = 'Please choose a job role.'
    if (!f.location.trim()) e.location = 'Please enter your location.'
    if (f.level === 'Experienced' && !f.years.trim()) e.years = 'Please enter your years of experience.'
    if (!f.skills.trim()) e.skills = 'Please list your key skills.'
    return e
  }

  const submit = ev => {
    ev.preventDefault()
    const e = validate()
    setErr(e)
    if (Object.keys(e).length) {
      document.getElementById('apply-' + Object.keys(e)[0])?.focus()
      return
    }
    const msg = formatMailMessage('New Job Application', [
      ['Job Role', f.role],
      ['Full Name', f.name],
      ['Email', f.email],
      ['Phone', f.phone],
      ['Location', f.location],
      ['Experience', f.level === 'Fresher' ? 'Fresher' : `${f.years} year(s)`],
      ['Skills', f.skills],
      ['Message', f.message],
      ['Resume', file ? `${file.name} (attached to this email)` : 'Not attached'],
    ])
    openMail(`Job Application - ${f.role} - ${f.name}`, msg)
    setSent({ msg, subject: `Job Application - ${f.role} - ${f.name}` })
  }

  const canShareFile = file && typeof navigator !== 'undefined' && navigator.canShare?.({ files: [file] })
  const shareResume = () => navigator.share({ files: [file], title: 'Resume - ' + f.name }).catch(() => {})

  return createPortal(
    <div className="apply-overlay" onMouseDown={e => e.target === e.currentTarget && onClose()}>
      <div className="apply-modal" role="dialog" aria-modal="true" aria-labelledby="apply-title">
        <button type="button" className="apply-close" onClick={onClose} aria-label="Close"><FaTimes /></button>

        {sent ? (
          <div className="apply-done">
            <span className="apply-done-ic"><FaEnvelope /></span>
            <h3 id="apply-title">Almost done!</h3>
            <p>Your email app has opened with your application for <b>{f.role}</b>. Press <b>Send</b> there to deliver it to JAA TECH.</p>
            {file && (
              <p className="apply-note"><FaPaperclip /> Then attach your resume <b>{file.name}</b> to the same email (websites cannot attach files to an email automatically).</p>
            )}
            <div className="apply-actions">
              <button type="button" className="contact-submit" onClick={() => openMail(sent.subject, sent.msg)}><span>Open email app again</span><span className="contact-arrow">→</span></button>
              {canShareFile && <button type="button" className="apply-ghost" onClick={shareResume}>Share resume file</button>}
              <button type="button" className="apply-ghost" onClick={onClose}>Close</button>
            </div>
          </div>
        ) : (
          <form onSubmit={submit} noValidate>
            <div className="contact-card-header">
              <span className="contact-eyebrow">Apply now</span>
              <h3 id="apply-title">Apply for this role</h3>
              <p>Fill in your details. They will open in your email app, ready to send to our HR team.</p>
            </div>

            <div className="contact-form-row">
              <Field id="name" label="Full Name" err={err.name}><input ref={first} id="apply-name" name="name" value={f.name} onChange={set} placeholder="Your full name" autoComplete="name" /></Field>
              <Field id="email" label="Email Address" err={err.email}><input id="apply-email" name="email" type="email" value={f.email} onChange={set} placeholder="you@example.com" autoComplete="email" /></Field>
            </div>
            <div className="contact-form-row">
              <Field id="phone" label="Phone Number" err={err.phone}><input id="apply-phone" name="phone" type="tel" inputMode="tel" value={f.phone} onChange={set} placeholder="+91 98765 43210" autoComplete="tel" /></Field>
              <Field id="role" label="Job Role" err={err.role}>
                <select id="apply-role" name="role" value={f.role} onChange={set}>
                  {roles.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </Field>
            </div>
            <div className="contact-form-row">
              <Field id="location" label="Location" err={err.location}><input id="apply-location" name="location" value={f.location} onChange={set} placeholder="City, State" autoComplete="address-level2" /></Field>
              <Field id="level" label="Experience">
                <div className="apply-seg" role="radiogroup" aria-label="Experience">
                  {['Fresher', 'Experienced'].map(v => (
                    <button key={v} type="button" role="radio" aria-checked={f.level === v} className={f.level === v ? 'on' : ''}
                      onClick={() => { setF(p => ({ ...p, level: v })); setErr(p => ({ ...p, years: '' })) }}>{v}</button>
                  ))}
                </div>
              </Field>
            </div>
            {f.level === 'Experienced' && (
              <Field id="years" label="Years of Experience" err={err.years}>
                <input id="apply-years" name="years" inputMode="decimal" value={f.years} onChange={set} placeholder="e.g. 2.5" />
              </Field>
            )}
            <Field id="skills" label="Skills" err={err.skills}><input id="apply-skills" name="skills" value={f.skills} onChange={set} placeholder="e.g. React, JavaScript, CSS" /></Field>
            <Field id="message" label="Short Message"><textarea id="apply-message" name="message" rows="3" value={f.message} onChange={set} placeholder="Tell us a little about yourself (optional)" /></Field>

            <div className="contact-field">
              <label htmlFor="apply-resume">Resume <em>(PDF, DOC, DOCX · max {MAX_MB} MB)</em></label>
              <label className={'apply-file' + (file ? ' has' : '')} htmlFor="apply-resume">
                <FaPaperclip /><span>{file ? file.name : 'Choose your resume'}</span>
              </label>
              <input id="apply-resume" className="apply-file-input" type="file" accept=".pdf,.doc,.docx" onChange={pick} />
              {err.resume && <small className="apply-err">{err.resume}</small>}
            </div>

            <button type="submit" className="contact-submit apply-mail"><span><FaEnvelope /> Submit via Email</span><span className="contact-arrow">→</span></button>
          </form>
        )}
      </div>
    </div>,
    document.body
  )
}

function Field({ id, label, err, children }) {
  return (
    <div className={'contact-field' + (err ? ' has-err' : '')}>
      <label htmlFor={'apply-' + id}>{label}</label>
      {children}
      {err && <small className="apply-err" role="alert">{err}</small>}
    </div>
  )
}
