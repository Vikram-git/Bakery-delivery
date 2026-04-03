import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './Order.css'
import { ordersAPI, getAuthToken } from '../utils/api'
import { getCart, saveCart, mergeCart, clearCart } from '../utils/cart'

const CONFIRMATION_STORAGE = 'bakery_last_order_confirmation'

function normalizeIndianMobile(input) {
  const digits = String(input || '').replace(/\D/g, '')
  if (digits.length === 12 && digits.startsWith('91')) return digits.slice(2)
  if (digits.length === 11 && digits.startsWith('0')) return digits.slice(1)
  if (digits.length === 10) return digits
  return null
}

function validateCheckout({
  orderType,
  deliveryInfo,
  dineInInfo,
  paymentMethod,
  agreeTerms,
}) {
  if (!agreeTerms) {
    return 'Please confirm you agree to the order terms below.'
  }

  if (orderType === 'delivery') {
    const name = (deliveryInfo.recipient_name || '').trim()
    const address = (deliveryInfo.address || '').trim()
    const city = (deliveryInfo.city || '').trim()
    const zip = (deliveryInfo.zipCode || '').trim()
    const phone = normalizeIndianMobile(deliveryInfo.phone)

    if (name.length < 2) return 'Enter the recipient name (who we should ask for at the door).'
    if (address.length < 8) return 'Enter a complete street address (building, street, area).'
    if (city.length < 2) return 'Enter a valid city.'
    if (!/^\d{6}$/.test(zip)) return 'PIN code must be exactly 6 digits.'
    if (!phone) return 'Enter a valid 10-digit Indian mobile number (you can include +91).'
    if (!['cod', 'upi', 'card'].includes(paymentMethod)) {
      return 'Choose how you’d like to pay.'
    }
  } else {
    const table = (dineInInfo.tableNumber || '').trim()
    if (table.length < 1) return 'Enter your table number or reservation name.'
    if (!dineInInfo.date || !dineInInfo.time) return 'Choose date and time for your visit.'
    const [h, m] = dineInInfo.time.split(':').map(Number)
    const minutes = h * 60 + m
    if (minutes < 10 * 60 || minutes > 21 * 60 + 30) {
      return 'Dine-in is available between 10:00 AM and 9:30 PM. Please pick a time in that window.'
    }
    if (!['counter', 'upi', 'card'].includes(paymentMethod)) {
      return 'Choose how you’d like to pay.'
    }
  }

  return ''
}

function Order() {
  const location = useLocation()
  const [orderType, setOrderType] = useState('delivery')
  const [deliveryInfo, setDeliveryInfo] = useState({
    recipient_name: '',
    address: '',
    city: '',
    zipCode: '',
    phone: '',
    instructions: '',
  })
  const [dineInInfo, setDineInInfo] = useState({
    tableNumber: '',
    guests: '1',
    date: '',
    time: '',
  })
  const [paymentDelivery, setPaymentDelivery] = useState('cod')
  const [paymentDineIn, setPaymentDineIn] = useState('counter')
  const [agreeTerms, setAgreeTerms] = useState(false)

  const [cart, setCart] = useState(() => {
    const savedCart = getCart()
    if (location.state?.selectedProducts) {
      return mergeCart(location.state.selectedProducts)
    }
    return savedCart
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const paymentMethod = orderType === 'delivery' ? paymentDelivery : paymentDineIn

  useEffect(() => {
    saveCart(cart)
  }, [cart])

  useEffect(() => {
    if (!getAuthToken()) {
      navigate('/signin', { state: { from: '/order' } })
    }
  }, [navigate])

  const updateQuantity = (id, change) => {
    setCart(
      cart.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity + change) } : item
      )
    )
  }

  const removeItem = (id) => {
    setCart(cart.filter((item) => item.id !== id))
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const deliveryFee = orderType === 'delivery' ? 50 : 0
  const gstAmount = subtotal * 0.18
  const total = subtotal + deliveryFee + gstAmount

  const handleDeliveryChange = (e) => {
    setDeliveryInfo({ ...deliveryInfo, [e.target.name]: e.target.value })
  }

  const handleDineInChange = (e) => {
    setDineInInfo({ ...dineInInfo, [e.target.name]: e.target.value })
  }

  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      setError('Your cart is empty. Add items from the menu before checkout.')
      return
    }

    const validationError = validateCheckout({
      orderType,
      deliveryInfo,
      dineInInfo,
      paymentMethod,
      agreeTerms,
    })
    if (validationError) {
      setError(validationError)
      return
    }

    setError('')
    setLoading(true)

    try {
      const orderData = {
        type: orderType,
        payment_method: paymentMethod,
        items: cart.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        ...(orderType === 'delivery'
          ? {
              delivery_info: {
                ...deliveryInfo,
                phone: normalizeIndianMobile(deliveryInfo.phone),
              },
            }
          : { dine_in_info: dineInInfo }),
      }

      const order = await ordersAPI.createOrder(orderData)

      const etaLine =
        orderType === 'delivery'
          ? 'Estimated delivery: 45–60 minutes after we confirm. Our rider will call the number on this order before arrival.'
          : 'We’ll have everything ready for your table at the time you chose. If you’re running late, call us—we’ll hold your slot for 15 minutes.'

      let delivery_summary = ''
      let dine_in_summary = ''
      if (orderType === 'delivery') {
        const r = (deliveryInfo.recipient_name || '').trim()
        delivery_summary = `${r} · ${deliveryInfo.address.trim()}, ${deliveryInfo.city.trim()} ${deliveryInfo.zipCode.trim()}\nPhone: ${normalizeIndianMobile(deliveryInfo.phone)}`
      } else {
        const d = new Date(dineInInfo.date)
        dine_in_summary = `Table / name: ${dineInInfo.tableNumber.trim()} · ${dineInInfo.guests} guest(s) · ${d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })} at ${dineInInfo.time}`
      }

      const confirmation = {
        order_reference: order.order_reference,
        type: orderType,
        total: order.total,
        items: order.items,
        payment_method: paymentMethod,
        created_at: order.created_at,
        eta_line: etaLine,
        delivery_summary,
        dine_in_summary,
      }

      try {
        sessionStorage.setItem(CONFIRMATION_STORAGE, JSON.stringify(confirmation))
      } catch {
        /* ignore quota */
      }

      clearCart()
      window.dispatchEvent(new Event('ordersUpdated'))
      navigate('/order/confirmation', { state: { orderConfirmation: confirmation } })
    } catch (err) {
      setError(err.message || 'We couldn’t place your order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app">
      <Navbar />
      <div className="order-container">
        <header className="order-header">
          <p className="order-header__eyebrow">Checkout</p>
          <h1>Place your order</h1>
          <p className="order-header__sub">
            Secure checkout · GST-inclusive pricing shown below · Local delivery &amp; dine-in
          </p>
        </header>

        <div className="order-type-selector" role="group" aria-label="Fulfillment type">
          <button
            type="button"
            className={`type-button ${orderType === 'delivery' ? 'active' : ''}`}
            onClick={() => setOrderType('delivery')}
          >
            <span className="type-icon" aria-hidden="true">
              🚚
            </span>
            <span>Delivery</span>
            <span className="type-button__hint">To your door</span>
          </button>
          <button
            type="button"
            className={`type-button ${orderType === 'dine-in' ? 'active' : ''}`}
            onClick={() => setOrderType('dine-in')}
          >
            <span className="type-icon" aria-hidden="true">
              🍽️
            </span>
            <span>Dine-in</span>
            <span className="type-button__hint">Pick up at table</span>
          </button>
        </div>

        <div className="order-content">
          <div className="order-form-section">
            {orderType === 'delivery' ? (
              <>
                <section className="checkout-section" aria-labelledby="sec-delivery">
                  <h2 id="sec-delivery" className="checkout-section__title">
                    <span className="checkout-section__step">1</span>
                    Delivery details
                  </h2>
                  <p className="checkout-section__help">
                    We deliver within our service area. Use the same phone you’ll answer when the rider
                    calls.
                  </p>
                  <div className="form-group">
                    <label htmlFor="recipient_name">Recipient name *</label>
                    <input
                      type="text"
                      id="recipient_name"
                      name="recipient_name"
                      value={deliveryInfo.recipient_name}
                      onChange={handleDeliveryChange}
                      autoComplete="name"
                      placeholder="Who should we ask for?"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="address">Street address *</label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={deliveryInfo.address}
                      onChange={handleDeliveryChange}
                      autoComplete="street-address"
                      placeholder="Flat / building, street, landmark"
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="city">City *</label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={deliveryInfo.city}
                        onChange={handleDeliveryChange}
                        autoComplete="address-level2"
                        placeholder="City"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="zipCode">PIN code *</label>
                      <input
                        type="text"
                        id="zipCode"
                        name="zipCode"
                        inputMode="numeric"
                        maxLength={6}
                        value={deliveryInfo.zipCode}
                        onChange={handleDeliveryChange}
                        autoComplete="postal-code"
                        placeholder="6 digits"
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">Mobile for delivery *</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={deliveryInfo.phone}
                      onChange={handleDeliveryChange}
                      autoComplete="tel"
                      placeholder="10-digit number or +91…"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="instructions">Delivery instructions (optional)</label>
                    <textarea
                      id="instructions"
                      name="instructions"
                      value={deliveryInfo.instructions}
                      onChange={handleDeliveryChange}
                      placeholder="Gate code, floor, leave at door, etc."
                      rows={3}
                    />
                  </div>
                </section>

                <section className="checkout-section" aria-labelledby="sec-pay-d">
                  <h2 id="sec-pay-d" className="checkout-section__title">
                    <span className="checkout-section__step">2</span>
                    Payment
                  </h2>
                  <fieldset className="payment-fieldset">
                    <legend className="visually-hidden">Payment method</legend>
                    <label className="payment-option">
                      <input
                        type="radio"
                        name="pay-d"
                        checked={paymentDelivery === 'cod'}
                        onChange={() => setPaymentDelivery('cod')}
                      />
                      <span className="payment-option__body">
                        <span className="payment-option__label">Cash on delivery</span>
                        <span className="payment-option__desc">Pay the rider when your order arrives</span>
                      </span>
                    </label>
                    <label className="payment-option">
                      <input
                        type="radio"
                        name="pay-d"
                        checked={paymentDelivery === 'upi'}
                        onChange={() => setPaymentDelivery('upi')}
                      />
                      <span className="payment-option__body">
                        <span className="payment-option__label">UPI</span>
                        <span className="payment-option__desc">We’ll share a QR / UPI ID when we confirm</span>
                      </span>
                    </label>
                    <label className="payment-option">
                      <input
                        type="radio"
                        name="pay-d"
                        checked={paymentDelivery === 'card'}
                        onChange={() => setPaymentDelivery('card')}
                      />
                      <span className="payment-option__body">
                        <span className="payment-option__label">Card</span>
                        <span className="payment-option__desc">Card or tap-to-pay with the rider</span>
                      </span>
                    </label>
                  </fieldset>
                </section>
              </>
            ) : (
              <>
                <section className="checkout-section" aria-labelledby="sec-dine">
                  <h2 id="sec-dine" className="checkout-section__title">
                    <span className="checkout-section__step">1</span>
                    Reservation details
                  </h2>
                  <p className="checkout-section__help">
                    Tell us where you’re seated (or the name on your booking). Kitchen hours: 10:00 –
                    21:30.
                  </p>
                  <div className="form-group">
                    <label htmlFor="tableNumber">Table number or reservation name *</label>
                    <input
                      type="text"
                      id="tableNumber"
                      name="tableNumber"
                      value={dineInInfo.tableNumber}
                      onChange={handleDineInChange}
                      placeholder="e.g. 12 or “Singh party”"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="guests">Guests</label>
                    <select
                      id="guests"
                      name="guests"
                      value={dineInInfo.guests}
                      onChange={handleDineInChange}
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                        <option key={num} value={num}>
                          {num} {num === 1 ? 'guest' : 'guests'}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="date">Date *</label>
                      <input
                        type="date"
                        id="date"
                        name="date"
                        value={dineInInfo.date}
                        onChange={handleDineInChange}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="time">Time *</label>
                      <input
                        type="time"
                        id="time"
                        name="time"
                        value={dineInInfo.time}
                        onChange={handleDineInChange}
                      />
                    </div>
                  </div>
                </section>

                <section className="checkout-section" aria-labelledby="sec-pay-i">
                  <h2 id="sec-pay-i" className="checkout-section__title">
                    <span className="checkout-section__step">2</span>
                    Payment
                  </h2>
                  <fieldset className="payment-fieldset">
                    <legend className="visually-hidden">Payment method</legend>
                    <label className="payment-option">
                      <input
                        type="radio"
                        name="pay-i"
                        checked={paymentDineIn === 'counter'}
                        onChange={() => setPaymentDineIn('counter')}
                      />
                      <span className="payment-option__body">
                        <span className="payment-option__label">Pay at the counter</span>
                        <span className="payment-option__desc">Settle the bill when you’re done</span>
                      </span>
                    </label>
                    <label className="payment-option">
                      <input
                        type="radio"
                        name="pay-i"
                        checked={paymentDineIn === 'upi'}
                        onChange={() => setPaymentDineIn('upi')}
                      />
                      <span className="payment-option__body">
                        <span className="payment-option__label">UPI</span>
                        <span className="payment-option__desc">Pay via QR at your table</span>
                      </span>
                    </label>
                    <label className="payment-option">
                      <input
                        type="radio"
                        name="pay-i"
                        checked={paymentDineIn === 'card'}
                        onChange={() => setPaymentDineIn('card')}
                      />
                      <span className="payment-option__body">
                        <span className="payment-option__label">Card</span>
                        <span className="payment-option__desc">Card or contactless at the counter</span>
                      </span>
                    </label>
                  </fieldset>
                </section>
              </>
            )}

            <section className="checkout-section checkout-section--terms" aria-labelledby="sec-terms">
              <h2 id="sec-terms" className="checkout-section__title">
                <span className="checkout-section__step">3</span>
                Review &amp; confirm
              </h2>
              <label className="terms-checkbox">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                />
                <span>
                  {orderType === 'delivery' ? (
                    <>
                      I confirm my address and phone are correct, I agree to the{' '}
                      <strong>₹{deliveryFee} delivery fee</strong>, and I understand baked goods are
                      prepared fresh — cancellations may not be possible after preparation starts.
                    </>
                  ) : (
                    <>
                      I confirm my reservation details are correct and I understand baked goods are
                      prepared fresh — cancellations may not be possible after preparation starts.
                    </>
                  )}
                </span>
              </label>
            </section>
          </div>

          <aside className="order-summary">
            <div className="order-summary__toolbar">
              <h2>Order summary</h2>
              {cart.length > 0 && (
                <button
                  type="button"
                  className="order-summary__link-btn"
                  onClick={() => navigate('/', { state: { addToCart: true } })}
                >
                  + Add items
                </button>
              )}
            </div>

            {error && <div className="order-error" role="alert">{error}</div>}

            <div className="cart-items">
              {cart.length === 0 ? (
                <div className="empty-cart">
                  <p>Your cart is empty</p>
                  <p className="empty-cart__hint">
                    Use the <strong>Add</strong> button on a product to put it in your cart—clicking a
                    photo alone won’t add anything.
                  </p>
                  <button
                    type="button"
                    className="empty-cart__btn"
                    onClick={() => navigate('/', { state: { browseProducts: true } })}
                  >
                    Browse products
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="cart-item">
                    <div className="item-info">
                      <h4>{item.name}</h4>
                      <p>₹{item.price.toFixed(2)} each</p>
                    </div>
                    <div className="item-controls">
                      <button type="button" onClick={() => updateQuantity(item.id, -1)} aria-label="Decrease quantity">
                        −
                      </button>
                      <span>{item.quantity}</span>
                      <button type="button" onClick={() => updateQuantity(item.id, 1)} aria-label="Increase quantity">
                        +
                      </button>
                      <button
                        type="button"
                        className="remove-btn"
                        onClick={() => removeItem(item.id)}
                        aria-label="Remove item"
                      >
                        ×
                      </button>
                    </div>
                    <div className="item-total">₹{(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                ))
              )}
            </div>

            <div className="order-totals">
              <div className="total-row">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              {orderType === 'delivery' && (
                <div className="total-row">
                  <span>Delivery</span>
                  <span>₹{deliveryFee.toFixed(2)}</span>
                </div>
              )}
              <div className="total-row total-row--muted">
                <span>
                  GST (18%)
                  <small className="tax-hint">CGST 9% + SGST 9% on subtotal</small>
                </span>
                <span>₹{gstAmount.toFixed(2)}</span>
              </div>
              <div className="total-row total-final">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>

            <button
              type="button"
              className="place-order-btn"
              onClick={handlePlaceOrder}
              disabled={cart.length === 0 || loading}
            >
              {loading ? 'Placing order…' : 'Confirm & place order'}
            </button>
            <p className="order-legal-note">
              By placing this order you authorise us to charge the total above according to your
              selected payment method. Prices include applicable GST.
            </p>
          </aside>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Order
