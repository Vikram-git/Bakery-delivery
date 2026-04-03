function PromoBanner() {
  return (
    <section className="promo-banner">
      <div className="promo-decorative">
        <img 
          src="https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&h=150&fit=crop&q=80" 
          alt="Bread" 
          className="promo-bread-1"
        />
        <img 
          src="https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=200&h=150&fit=crop&q=80" 
          alt="Bread" 
          className="promo-bread-2"
        />
        <img 
          src="https://images.unsplash.com/photo-1593113598332-cd288d649433?w=150&h=200&fit=crop&q=80" 
          alt="Wheat" 
          className="promo-wheat"
        />
      </div>
      <div className="promo-content">
        <h2 className="promo-title">20% Off Your First Order</h2>
        <p className="promo-text">
          Suspendisse ac rhoncus nisl eu tempor urna. Curabitur vel biberling.
        </p>
        <button className="promo-button">Learn More</button>
      </div>
    </section>
  )
}

export default PromoBanner

