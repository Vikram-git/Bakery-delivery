import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './Services.css'

function Services() {
  const services = [
    {
      id: 1,
      title: "Custom Cake Orders",
      description: "Create your perfect cake for any occasion. We offer custom designs, flavors, and sizes to make your celebration special.",
      icon: "🎂",
      features: ["Custom designs", "Multiple flavors", "Various sizes", "Delivery available"]
    },
    {
      id: 2,
      title: "Bread Subscription",
      description: "Get fresh, artisan bread delivered to your door weekly or monthly. Choose from our selection of premium breads.",
      icon: "🍞",
      features: ["Weekly delivery", "Monthly plans", "Fresh baked", "Multiple varieties"]
    },
    {
      id: 3,
      title: "Catering Services",
      description: "Professional catering for events, parties, and corporate gatherings. We provide delicious pastries and baked goods.",
      icon: "🥐",
      features: ["Event catering", "Corporate orders", "Custom menus", "On-site service"]
    },
    {
      id: 4,
      title: "Baking Classes",
      description: "Learn the art of baking from our expert bakers. Join our classes and master the techniques of professional baking.",
      icon: "👨‍🍳",
      features: ["Beginner friendly", "Expert instructors", "Hands-on learning", "Take home recipes"]
    },
    {
      id: 5,
      title: "Wholesale Orders",
      description: "Bulk orders for restaurants, cafes, and businesses. Get premium quality baked goods at wholesale prices.",
      icon: "📦",
      features: ["Bulk pricing", "Regular supply", "Quality guarantee", "Flexible terms"]
    },
    {
      id: 6,
      title: "Special Dietary Options",
      description: "We cater to all dietary needs including gluten-free, vegan, sugar-free, and keto-friendly options.",
      icon: "🌱",
      features: ["Gluten-free", "Vegan options", "Sugar-free", "Keto-friendly"]
    }
  ]

  return (
    <div className="app">
      <Navbar />
      <div className="services-page">
        <div className="services-hero">
          <h1 className="services-main-title">Our Services</h1>
          <p className="services-subtitle">Discover what we offer to make your bakery experience exceptional</p>
        </div>

        <div className="services-container">
          <div className="services-grid">
            {services.map((service) => (
              <div key={service.id} className="service-card">
                <div className="service-icon">{service.icon}</div>
                <h3 className="service-title">{service.title}</h3>
                <p className="service-description">{service.description}</p>
                <ul className="service-features">
                  {service.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
                <button className="service-button">Learn More</button>
              </div>
            ))}
          </div>
        </div>

        <div className="services-cta">
          <h2 className="cta-title">Ready to Get Started?</h2>
          <p className="cta-text">Contact us today to discuss your needs and let us create something special for you.</p>
          <a href="/contact" className="cta-button">Contact Us</a>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Services

