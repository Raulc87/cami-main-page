import { C } from './constants/colors'
import { useReveal } from './hooks/useReveal'
import Nav from './components/Nav'
import Hero from './components/Hero'
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
      <Nav />
      <Hero r={r} />
      <Services r={r} />
      <Gallery r={r} />
      <Process r={r} />
      <Values r={r} />
      <Testimonials r={r} />
      <CTA r={r} />
      <Footer />
    </div>
  )
}
