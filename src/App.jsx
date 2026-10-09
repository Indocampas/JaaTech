import { motion, useScroll, useSpring } from 'framer-motion'
import Navbar from './components/Navbar.jsx'
import {
  Hero,
  About,
  Services,
  BookShowcase,
  Technology,
  Accessibility,
  CloudDistribution,
  Journey,
  Careers,
  Contact,
  Footer,
} from './sections/Sections.jsx'

export default function App() {
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24 })
  return (
    <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .7 }}>
      <motion.div className="progress" style={{ scaleX: progress }} />
      <Navbar />
      <Hero />
      <About />
      <Services />
      <BookShowcase />
      <Technology />
      <Accessibility />
      <CloudDistribution />
      <Journey />
      <Careers />
      <Contact />
      <Footer />
    </motion.main>
  )
}
