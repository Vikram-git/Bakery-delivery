import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import TopProducts from '../components/TopProducts'
import PromoBanner from '../components/PromoBanner'
import ExploreMore from '../components/ExploreMore'
import AboutUs from '../components/AboutUs'
import FeaturedTreats from '../components/FeaturedTreats'
import Footer from '../components/Footer'

function Home() {
  const [activeCategory, setActiveCategory] = useState('Cake')
  const location = useLocation()

  useEffect(() => {
    // Scroll to products section if coming from order page
    if (location.state?.addToCart || location.state?.browseProducts) {
      setTimeout(() => {
        // Scroll to Top Products section
        const topProductsSection = document.getElementById('top-products-section')
        if (topProductsSection) {
          // Calculate offset to account for navbar
          const offset = 80
          const elementPosition = topProductsSection.getBoundingClientRect().top
          const offsetPosition = elementPosition + window.pageYOffset - offset

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          })
        }
      }, 100)
    }
  }, [location.state])

  return (
    <div className="app">
      <Navbar />
      <Hero />
      <div id="top-products-section">
        <TopProducts />
      </div>
      <PromoBanner />
      <div id="explore-more-section">
        <ExploreMore activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
      </div>
      <AboutUs />
      <FeaturedTreats />
      <Footer />
    </div>
  )
}

export default Home


