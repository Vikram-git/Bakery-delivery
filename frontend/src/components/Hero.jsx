import { Link } from 'react-router-dom'

function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">
        <div className="hero-text">
          <h1 className="hero-subtitle">Delicious Cafe</h1>
          <h2 className="hero-title">Sweet Treats, Perfect Eats-</h2>
          <div className="hero-buttons">
            <Link to="/order" className="btn-primary">Shop Now</Link>
            <button className="btn-secondary">Learn More</button>
          </div>
        </div>
        <div className="hero-image">
          <div className="hero-decorative-elements">
            <img 
              src="https://images.unsplash.com/photo-1593113598332-cd288d649433?w=200&h=200&fit=crop&q=80" 
              alt="Wheat" 
              className="wheat-stalks-img"
            />
            <img 
              src="https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=100&h=100&fit=crop&q=80" 
              alt="Honey" 
              className="honey-dipper-img"
            />
          </div>
          <div className="cutting-board">
            <img 
              src="https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500&h=400&fit=crop&q=80" 
              alt="Cinnamon Rolls" 
              className="hero-pastries-img"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero

