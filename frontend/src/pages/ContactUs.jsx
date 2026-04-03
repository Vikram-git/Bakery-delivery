import { useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './ContactUs.css'

function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      setError('Please fill in all required fields')
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address')
      return
    }

    // Simulate form submission
    console.log('Contact form submitted:', formData)
    setSubmitted(true)
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    })
    
    // Reset success message after 5 seconds
    setTimeout(() => {
      setSubmitted(false)
    }, 5000)
  }

  const contactInfo = [
    {
      icon: "📍",
      title: "Address",
      details: ["123 Main Street", "New York, NY 10001", "United States"]
    },
    {
      icon: "📞",
      title: "Phone",
      details: ["(456) 789-1011", "Mon-Sat: 8AM - 8PM"]
    },
    {
      icon: "✉️",
      title: "Email",
      details: ["info@bakery.com", "support@bakery.com"]
    },
    {
      icon: "🕒",
      title: "Hours",
      details: ["Monday - Saturday: 8AM - 8PM", "Sunday: 9AM - 6PM"]
    }
  ]

  return (
    <div className="app">
      <Navbar />
      <div className="contact-page">
        <div className="contact-hero">
          <h1 className="contact-main-title">Contact Us</h1>
          <p className="contact-subtitle">We'd love to hear from you. Get in touch with us!</p>
        </div>

        <div className="contact-container">
          <div className="contact-content">
            <div className="contact-info-section">
              <h2 className="section-title">Get in Touch</h2>
              <p className="section-description">
                Have a question or want to place a custom order? We're here to help! 
                Reach out to us through any of the following ways.
              </p>

              <div className="contact-info-grid">
                {contactInfo.map((info, index) => (
                  <div key={index} className="contact-info-card">
                    <div className="contact-info-icon">{info.icon}</div>
                    <h3 className="contact-info-title">{info.title}</h3>
                    {info.details.map((detail, idx) => (
                      <p key={idx} className="contact-info-detail">{detail}</p>
                    ))}
                  </div>
                ))}
              </div>

              <div className="social-links-section">
                <h3 className="social-title">Follow Us</h3>
                <div className="social-links">
                  <a href="#" className="social-link facebook">Facebook</a>
                  <a href="#" className="social-link instagram">Instagram</a>
                  <a href="#" className="social-link twitter">Twitter</a>
                  <a href="#" className="social-link pinterest">Pinterest</a>
                </div>
              </div>
            </div>

            <div className="contact-form-section">
              <h2 className="section-title">Send us a Message</h2>
              
              {submitted && (
                <div className="success-message">
                  Thank you for your message! We'll get back to you soon.
                </div>
              )}

              {error && (
                <div className="error-message">{error}</div>
              )}

              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Your name"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="phone">Phone</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="(123) 456-7890"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="subject">Subject</label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="What's this about?"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="message">Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="6"
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                <button type="submit" className="submit-button">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default ContactUs

