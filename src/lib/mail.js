import { SITE } from './site.js'

const clean = v => String(v ?? '').replace(/\s+/g, ' ').trim()

/* Builds a plain-text email body from a list of [label, value] pairs. */
export function formatMailMessage(title, fields) {
  const lines = fields
    .filter(([, v]) => clean(v))
    .map(([label, v]) => `${label}: ${clean(v)}`)
  return `${title}\n\n${lines.join('\n')}\n\nSent from the JAA TECH website`
}

export function mailtoUrl(subject, body, recipients = [SITE.email]) {
  // keep the URL within safe length limits for mail clients
  const text = body.length > 1800 ? body.slice(0, 1797) + '...' : body
  return `mailto:${recipients.join(',')}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`
}

/* Opens the visitor's default email app with the message pre-filled
   for the configured recipient. Frontend only, no backend. */
export function openMail(subject, body, recipients) {
  const url = mailtoUrl(subject, body, recipients)
  window.location.href = url
  return url
}
