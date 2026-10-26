// Helpers shared by Events.jsx, EventsTicker.jsx and EventRegistration.jsx (kept out of the component modules).

export function formatEventDate(date, lang) {
  const [y, m, d] = date.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString(lang === 'es' ? 'es-CR' : 'en-US', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

export function cardId(eventCode) {
  return `evt-${eventCode}`
}

// Colón amount with a comma thousands separator in both languages (Cami's decision): ₡15,000.
// The participant emails (apps-script/Mail.js, formatAmount_) use the same format.
export function formatCrc(n) {
  return `₡${Number(n).toLocaleString('en-US')}`
}
