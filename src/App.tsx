import Navbar from './components/Navbar'
import Hero from './components/Hero'
import VibeMachine from './components/VibeMachine'
import Tokenomics from './components/Tokenomics'
import Roadmap from './components/Roadmap'
import Footer from './components/Footer'

export default function App() {
  return (
    <div className="min-h-screen bg-dark-bg bg-grid">
      <Navbar />
      <Hero />
      <VibeMachine />
      <Tokenomics />
      <Roadmap />
      <Footer />
    </div>
  )
}
