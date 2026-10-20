// Helpers shared by Events.jsx and EventsTicker.jsx (kept out of the component modules).

export function formatEventDate(date, lang) {
  const [y, m, d] = date.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString(lang === 'es' ? 'es-CR' : 'en-US', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

export function cardId(eventCode) {
  return `evt-${eventCode}`
}
