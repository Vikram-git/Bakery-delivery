import { useNavigate, useLocation } from 'react-router-dom'
import { addToCart, getDefaultAddQuantity } from '../utils/cart'

function FeaturedTreats() {
  const navigate = useNavigate()
  const location = useLocation()
  
  const treats = [
    { 
      id: 201, 
      name: "Puff Pastry", 
      price: 65, 
      image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&h=300&fit=crop&q=80" 
    },
    { 
      id: 202, 
      name: "Doughnuts", 
      price: 65, 
      image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop&q=80" 
    },
    { 
      id: 203, 
      name: "Brownies", 
      price: 65, 
      image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&h=300&fit=crop&q=80" 
    },
  ]

  const addTreatToCartFlow = (treat) => {
    const productToAdd = {
      id: treat.id,
      name: treat.name,
      price: treat.price,
      quantity: getDefaultAddQuantity(treat),
    }
    if (location.state?.addToCart) {
      addToCart(productToAdd)
      navigate('/order')
    } else {
      navigate('/order', {
        state: { selectedProducts: [productToAdd] },
      })
    }
  }

  return (
    <section className="featured-treats">
      <h2 className="section-title">Featured Treats</h2>
      <div className="treats-grid">
        {treats.map((treat) => (
          <div key={treat.id} className="treat-card">
            <div className="treat-image">
              <img src={treat.image} alt={treat.name} className="treat-img" />
            </div>
            <div className="treat-info">
              <h3 className="treat-name">{treat.name}</h3>
              <div className="treat-price">₹{treat.price}</div>
              <div className="product-actions" style={{ marginTop: '12px', justifyContent: 'center' }}>
                <button type="button" className="add-button" onClick={() => addTreatToCartFlow(treat)}>
                  Add
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default FeaturedTreats

