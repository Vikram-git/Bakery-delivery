import { useNavigate, useLocation } from 'react-router-dom'
import { addToCart, getDefaultAddQuantity } from '../utils/cart'

function ExploreMore({ activeCategory, setActiveCategory }) {
  const navigate = useNavigate()
  const location = useLocation()
  const categories = ['Cake', 'Muffins', 'Croissant', 'Bread', 'Tart', 'Favorite']
  
  const exploreItems = [
    { 
      id: 101, 
      name: "Blueberry Muffins", 
      price: 120,
      image: "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=400&h=300&fit=crop&q=80" 
    },
    { 
      id: 102, 
      name: "Berry Cheesecake", 
      price: 450,
      image: "https://images.unsplash.com/photo-1524351199678-941a58a3df50?w=400&h=300&fit=crop&q=80" 
    },
    { 
      id: 103, 
      name: "Berry Tart", 
      price: 180,
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop&q=80" 
    },
    { 
      id: 104, 
      name: "Lemon Loaf", 
      price: 280,
      image: "https://images.unsplash.com/photo-1603532648955-039310d9ed75?w=400&h=300&fit=crop&q=80" 
    },
    { 
      id: 105, 
      name: "Chocolate Cake", 
      price: 450,
      image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop&q=80" 
    },
    { 
      id: 106, 
      name: "Chocolate Cupcake", 
      price: 80,
      image: "https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=400&h=300&fit=crop&q=80" 
    },
    {
      id: 7,
      name: 'Garlic Bread',
      price: 290,
      image: 'https://images.unsplash.com/photo-1573140247632-e8f6fa7d9436?w=400&h=300&fit=crop&q=80',
    },
  ]

  const addExploreItemToCartFlow = (item) => {
    const productToAdd = {
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: getDefaultAddQuantity(item),
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
    <section className="explore-more">
      <h2 className="section-title">Explore More</h2>
      <div className="category-tabs">
        {categories.map((category) => (
          <button
            key={category}
            className={`category-tab ${activeCategory === category ? 'active' : ''}`}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>
      <div className="explore-grid">
        {exploreItems.map((item) => (
          <div key={item.id} className="explore-item" style={{ position: 'relative' }}>
            <img src={item.image} alt={item.name} className="explore-image" />
            <div className="explore-item-overlay">
              <h4 className="explore-item-name">{item.name}</h4>
              <p className="explore-item-price">₹{item.price}</p>
              <button
                type="button"
                className="add-button explore-item-add"
                onClick={(e) => {
                  e.stopPropagation()
                  addExploreItemToCartFlow(item)
                }}
              >
                Add
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default ExploreMore

