function AboutUs() {
  return (
    <section className="about-us">
      <div className="about-decorative">
        <img 
          src="https://images.unsplash.com/photo-1593113598332-cd288d649433?w=200&h=300&fit=crop&q=80" 
          alt="Wheat" 
          className="about-wheat"
        />
        <img 
          src="https://images.unsplash.com/photo-1509440159596-0249088772ff?w=250&h=200&fit=crop&q=80" 
          alt="Bread" 
          className="about-bread"
        />
      </div>
      <div className="about-content">
        <h2 className="about-title">About us</h2>
        <p className="about-text">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod 
          tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, 
          quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </p>
        <button className="read-more-button">Read More</button>
      </div>
    </section>
  )
}

export default AboutUs

