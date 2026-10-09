import { SITE } from './site.js'

const clean = v => String(v ?? '').replace(/\s+/g, ' ').trim()

/* Builds a neatly formatted WhatsApp message (WhatsApp renders *bold*). */
export function formatWhatsAppMessage(title, fields) {
  const lines = fields
    .filter(([, v]) => clean(v))
    .map(([label, v]) => `*${label}:* ${clean(v)}`)
  return `*${title}*\n\n${lines.join('\n')}\n\n_Sent from the JAA TECH website_`
}

export function whatsappUrl(text) {
  // wa.me URLs break past ~2000 chars, so keep the payload safe
  const body = text.length > 1500 ? text.slice(0, 1497) + '...' : text
  return `${SITE.whatsappLink}?text=${encodeURIComponent(body)}`
}

/* Opens WhatsApp (app on phones, WhatsApp Web on desktop) with the message
   pre-filled for the configured number. Frontend only, no backend. */
export function openWhatsApp(text) {
  const url = whatsappUrl(text)
  const win = window.open(url, '_blank', 'noopener,noreferrer')
  if (!win) window.location.href = url // popup blocked: navigate instead
  return url
}
