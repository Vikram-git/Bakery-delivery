import { Link, useLocation, Navigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './OrderConfirmation.css'

const STORAGE_KEY = 'bakery_last_order_confirmation'

const PAYMENT_LABELS = {
  cod: 'Cash on delivery / Pay at pickup',
  upi: 'UPI',
  card: 'Card',
  counter: 'Pay at the counter',
}

function loadStoredConfirmation() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function OrderConfirmation() {
  const location = useLocation()
  const data = location.state?.orderConfirmation || loadStoredConfirmation()

  if (!data) {
    return <Navigate to="/order" replace />
  }

  const {
    order_reference,
    type,
    total,
    items,
    payment_method,
    created_at,
    eta_line,
    delivery_summary,
    dine_in_summary,
  } = data

  const paymentLabel = PAYMENT_LABELS[payment_method] || payment_method

  return (
    <div className="app">
      <Navbar />
      <main className="order-confirmation">
        <div className="order-confirmation__card">
          <div className="order-confirmation__badge" aria-hidden="true">
            <span className="order-confirmation__check">✓</span>
          </div>
          <h1 className="order-confirmation__title">Order received</h1>
          <p className="order-confirmation__lead">
            Thank you. We’ve saved your order and will prepare it shortly.
          </p>

          <div className="order-confirmation__ref-block">
            <span className="order-confirmation__ref-label">Order reference</span>
            <span className="order-confirmation__ref-value">{order_reference}</span>
            <span className="order-confirmation__ref-hint">
              Quote this if you call or message us about your order.
            </span>
          </div>

          <p className="order-confirmation__eta">{eta_line}</p>

          <div className="order-confirmation__meta">
            <div>
              <span className="meta-label">Fulfillment</span>
              <span className="meta-value">
                {type === 'delivery' ? 'Delivery' : 'Dine-in reservation'}
              </span>
            </div>
            <div>
              <span className="meta-label">Payment</span>
              <span className="meta-value">{paymentLabel}</span>
            </div>
            {created_at && (
              <div>
                <span className="meta-label">Placed at</span>
                <span className="meta-value">
                  {new Date(created_at).toLocaleString(undefined, {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </span>
              </div>
            )}
          </div>

          {(delivery_summary || dine_in_summary) && (
            <div className="order-confirmation__address">
              <span className="meta-label">
                {type === 'delivery' ? 'Deliver to' : 'Reservation'}
              </span>
              <p className="order-confirmation__address-text">
                {type === 'delivery' ? delivery_summary : dine_in_summary}
              </p>
            </div>
          )}

          <div className="order-confirmation__items">
            <h2 className="order-confirmation__items-title">Your items</h2>
            <ul className="order-confirmation__list">
              {items.map((item) => (
                <li key={`${item.id}-${item.name}`}>
                  <span>
                    {item.quantity}× {item.name}
                  </span>
                  <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <div className="order-confirmation__total">
              <span>Order total (incl. tax)</span>
              <span>₹{Number(total).toFixed(2)}</span>
            </div>
          </div>

          <p className="order-confirmation__note">
            You’ll get updates by phone or email if we need to reach you. For changes, contact us
            within 15 minutes of placing this order.
          </p>

          <div className="order-confirmation__actions">
            <Link to="/" className="order-confirmation__btn order-confirmation__btn--primary">
              Back to home
            </Link>
            <Link to="/my-orders" className="order-confirmation__btn order-confirmation__btn--ghost">
              My orders
            </Link>
            <Link to="/order" className="order-confirmation__btn order-confirmation__btn--ghost">
              Place another order
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default OrderConfirmation
