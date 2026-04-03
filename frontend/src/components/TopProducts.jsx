import { useNavigate, useLocation } from 'react-router-dom'
import { addToCart, getDefaultAddQuantity } from '../utils/cart'

function TopProducts() {
  const navigate = useNavigate()
  const location = useLocation()

  const products = [
    { 
      id: 1, 
      name: "Whole Grain Bread", 
      price: 330, 
      image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop&q=80" 
    },
    { 
      id: 2, 
      name: "Berry Pastry", 
      price: 330, 
      image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&h=300&fit=crop&q=80" 
    },
    { 
      id: 3, 
      name: "French Baguette", 
      price: 330, 
      image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop&q=80" 
    },
    { 
      id: 4, 
      name: "Round Loaf", 
      price: 330, 
      image: "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=400&h=300&fit=crop&q=80" 
    },
    { 
      id: 5, 
      name: "Braided Pastry", 
      price: 330, 
      image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&h=300&fit=crop&q=80" 
    },
    { 
      id: 6, 
      name: "Spiral Bread", 
      price: 330, 
      image: "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=400&h=300&fit=crop&q=80" 
    },
    {
      id: 7,
      name: 'Garlic Bread',
      price: 290,
      image: 'https://images.unsplash.com/photo-1573140247632-e8f6fa7d9436?w=400&h=300&fit=crop&q=80',
    },
  ]

  const addProductToCartFlow = (product) => {
    const productToAdd = {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: getDefaultAddQuantity(product),
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
    <section className="top-products">
      <h2 className="section-title">Top Products</h2>
      <div className="products-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <div className="product-price">₹{product.price}</div>
            <div className="product-image">
              <img 
                src={product.image} 
                alt={product.name} 
                className="product-img"
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&h=300&fit=crop&q=80";
                }}
              />
            </div>
            <div className="product-info">
              <h3 className="product-name">{product.name}</h3>
              {product.id === 7 && (
                <p className="product-default-qty-hint">Add puts 4 in your cart — change qty on checkout</p>
              )}
              <div className="product-actions">
                <button 
                  className="info-icon"
                  onClick={(e) => {
                    e.stopPropagation()
                    alert(`${product.name}\nPrice: ₹${product.price}`)
                  }}
                >
                  i
                </button>
                <button
                  type="button"
                  className="add-button"
                  onClick={() => addProductToCartFlow(product)}
                >
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

export default TopProducts

