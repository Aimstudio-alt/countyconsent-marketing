import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import Stats from '@/components/Stats'
import TestimonialPullQuote from '@/components/TestimonialPullQuote'
import Problem from '@/components/Problem'
import HowItWorks from '@/components/HowItWorks'
import DemoSection from '@/components/DemoSection'
import Features from '@/components/Features'
import Compliance from '@/components/Compliance'
import Pricing from '@/components/Pricing'
import FAQ from '@/components/FAQ'
import Testimonial from '@/components/Testimonial'
import BookDemo from '@/components/BookDemo'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Stats />
        <TestimonialPullQuote />
        <Problem />
        <HowItWorks />
        <DemoSection />
        <Features />
        <Compliance />
        <Pricing />
        <FAQ />
        <Testimonial />
        <BookDemo />
      </main>
      <Footer />
    </>
  )
}
