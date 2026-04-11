import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import Stats from '@/components/Stats'
import Problem from '@/components/Problem'
import HowItWorks from '@/components/HowItWorks'
import DemoSection from '@/components/DemoSection'
import Features from '@/components/Features'
import Compliance from '@/components/Compliance'
import Pricing from '@/components/Pricing'
import FAQ from '@/components/FAQ'
import BookDemo from '@/components/BookDemo'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Stats />
        <Problem />
        <HowItWorks />
        <DemoSection />
        <Features />
        <Compliance />
        <Pricing />
        <FAQ />
        <BookDemo />
      </main>
      <Footer />
    </>
  )
}
