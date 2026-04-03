import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <h2 className="footer-inspiration">Get Inspired!</h2>
      </div>
      <div className="footer-social">
        <a href="#" className="social-icon facebook">f</a>
        <a href="#" className="social-icon twitter">t</a>
        <a href="#" className="social-icon instagram">i</a>
        <a href="#" className="social-icon pinterest">p</a>
      </div>
      <div className="footer-content">
        <div className="footer-column">
          <h3 className="footer-column-title">About Us</h3>
          <p className="footer-text">(456) 789-1011</p>
          <p className="footer-text">123 Main Street, New York America.</p>
        </div>
        <div className="footer-column">
          <h3 className="footer-column-title">Explore</h3>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
            <li><Link to="/services">Services</Link></li>
          </ul>
        </div>
        <div className="footer-column">
          <h3 className="footer-column-title">Recent News</h3>
          <div className="recent-news">
            <div className="news-item">
              <img 
                src="https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=100&h=100&fit=crop&q=80" 
                alt="Puff pastry" 
                className="news-thumbnail"
              />
              <span className="news-title">Puff pastry</span>
            </div>
            <div className="news-item">
              <img 
                src="https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=100&h=100&fit=crop&q=80" 
                alt="Puff pastry" 
                className="news-thumbnail"
              />
              <span className="news-title">Puff pastry</span>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p className="copyright">©  Delicious Cafe</p>
      </div>
    </footer>
  )
}

export default Footer

