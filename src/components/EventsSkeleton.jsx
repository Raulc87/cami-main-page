import { C } from '../constants/colors'

const CARDS = 3 // as many as the widest grid has in a row; the CSS shows fewer on narrow screens

// The room of the events section while the `events` request is pending (CMP-102): same padding
// and grid as the section, so the cards arrive in place instead of pushing the page down. Empty
// and hidden from assistive technology: it holds no content.
export default function EventsSkeleton() {
  return (
    <section
      className="section-pad evt-skeleton"
      aria-hidden="true"
      style={{ padding: '80px 56px', background: C.bg, position: 'relative', zIndex: 1 }}
    >
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div className="evt-skeleton-head" style={{ marginBottom: 52 }} />
        <div className="evt-grid">
          {Array.from({ length: CARDS }, (_, i) => (
            <div key={i} className="evt-card evt-skeleton-card" />
          ))}
        </div>
      </div>
    </section>
  )
}
