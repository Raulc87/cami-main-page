import { C } from './constants/colors'
import { useReveal } from './hooks/useReveal'
import { useEvents } from './hooks/useEvents'
import { isEventsApiConfigured } from './api/events'
import EventsTicker from './components/EventsTicker'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Events from './components/Events'
import EventsSkeleton from './components/EventsSkeleton'
import Services from './components/Services'
import Gallery from './components/Gallery'
import Process from './components/Process'
import Values from './components/Values'
import Testimonials from './components/Testimonials'
import CTA from './components/CTA'
import Footer from './components/Footer'

export default function App() {
  // Single IntersectionObserver for the whole page — passed as prop to each section.
  // All element IDs (data-rid) must be unique across components.
  const r = useReveal()
  // One `events` request for the page. While it is pending the ticker and the section keep
  // their room (CMP-102, no layout jump when they arrive); they go away when status is
  // 'hidden' (FFR-004), the room closing smoothly (`.evt-reserve` in global.css).
  const { status, sinpe, events, refetch } = useEvents()
  const room = status === 'hidden' ? ' evt-reserve-closed' : ''
  // The placeholders stay mounted after 'hidden': the room can only shrink while it still has
  // content to measure, and an unmounted placeholder would close it at once.
  const placeholders = isEventsApiConfigured() && status !== 'ready'

  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      {/* ── Global glow orbs ──────────────────────────────── */}
      <div style={{
        position: 'fixed', top: -80, right: -80, width: 480, height: 480,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(44,62,90,0.09) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 0,
      }} />
      <div style={{
        position: 'fixed', bottom: -80, left: -80, width: 380, height: 380,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(201,164,171,0.11) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 0,
      }} />

      {/* ── Sections ──────────────────────────────────────── */}
      <div className={`evt-reserve${room}`}>
        <div className="evt-reserve-inner">
          {status === 'ready' && <EventsTicker events={events} />}
          {placeholders && <div className="evt-ticker" aria-hidden="true" />}
        </div>
      </div>
      <Nav />
      <main>
        <Hero r={r} />
        <div className={`evt-reserve${room}`}>
          <div className="evt-reserve-inner">
            {status === 'ready' && <Events events={events} sinpe={sinpe} onRefetch={refetch} />}
            {placeholders && <EventsSkeleton />}
          </div>
        </div>
        <Services r={r} />
        <Gallery r={r} />
        <Process r={r} />
        <Values r={r} />
        <Testimonials r={r} />
        <CTA r={r} />
      </main>
      <Footer />
    </div>
  )
}
