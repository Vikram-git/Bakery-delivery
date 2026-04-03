import { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { ordersAPI, getAuthToken } from '../utils/api'
import './MyOrders.css'

const STATUS_COLORS = {
  pending: '#ff9800',
  confirmed: '#2196f3',
  preparing: '#9c27b0',
  ready: '#4caf50',
  delivered: '#00bcd4',
  completed: '#4caf50',
  cancelled: '#f44336',
}

const PAYMENT_LABELS = {
  cod: 'Cash on delivery',
  upi: 'UPI',
  card: 'Card',
  counter: 'Pay at counter',
}

function formatPayment(method) {
  if (!method) return '—'
  return PAYMENT_LABELS[method] || method
}

function MyOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [expandedId, setExpandedId] = useState(null)
  const navigate = useNavigate()

  const loadOrders = useCallback(async () => {
    if (!getAuthToken()) {
      setLoading(false)
      navigate('/signin', { state: { from: '/my-orders' }, replace: true })
      return
    }
    try {
      setError('')
      setLoading(true)
      const list = await ordersAPI.getOrders()
      list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      setOrders(list)
    } catch (err) {
      setError(err.message || 'Could not load your orders.')
      setOrders([])
    } finally {
      setLoading(false)
    }
  }, [navigate])

  useEffect(() => {
    loadOrders()
  }, [loadOrders])

  useEffect(() => {
    const onOrdersUpdated = () => loadOrders()
    const onStorage = (e) => {
      if (e.key === 'bakery_orders') loadOrders()
    }
    window.addEventListener('ordersUpdated', onOrdersUpdated)
    window.addEventListener('storage', onStorage)
    return () => {
      window.removeEventListener('ordersUpdated', onOrdersUpdated)
      window.removeEventListener('storage', onStorage)
    }
  }, [loadOrders])

  const formatDate = (iso) => {
    if (!iso) return '—'
    try {
      return new Date(iso).toLocaleString(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short',
      })
    } catch {
      return iso
    }
  }

  return (
    <div className="app">
      <Navbar />
      <div className="my-orders-page">
        <div className="my-orders-inner">
          <header className="my-orders-header">
            <h1>My orders</h1>
            <p>Orders placed while signed in to this browser.</p>
          </header>

          <div className="my-orders-toolbar">
            <button type="button" className="my-orders-refresh" onClick={loadOrders}>
              Refresh
            </button>
          </div>

          {loading && <div className="my-orders-loading">Loading your orders…</div>}

          {!loading && error && <div className="my-orders-error">{error}</div>}

          {!loading && !error && orders.length === 0 && (
            <div className="my-orders-empty">
              <h2>No orders yet</h2>
              <p>When you place an order, it will show up here.</p>
              <Link to="/order">Start an order</Link>
            </div>
          )}

          {!loading && !error && orders.length > 0 && (
            <div className="my-orders-list">
              {orders.map((order) => {
                const open = expandedId === order.id
                const statusColor = STATUS_COLORS[order.status] || '#666'
                const itemsLine = order.items
                  .map((i) => `${i.quantity}× ${i.name}`)
                  .join(' · ')

                return (
                  <article key={order.id} className="my-order-card">
                    <div className="my-order-card__top">
                      <span className="my-order-card__ref">
                        {order.order_reference || order.id.slice(0, 8)}
                      </span>
                      <span className="my-order-card__date">{formatDate(order.created_at)}</span>
                    </div>
                    <div className="my-order-card__meta">
                      <span
                        className="my-order-badge"
                        style={{ backgroundColor: statusColor }}
                      >
                        {order.status || 'pending'}
                      </span>
                      <span className="my-order-type">
                        {order.type === 'delivery' ? '🚚 Delivery' : '🍽️ Dine-in'}
                      </span>
                      <span className="my-order-type">{formatPayment(order.payment_method)}</span>
                    </div>
                    <div className="my-order-card__total">₹{Number(order.total).toFixed(2)}</div>
                    <p className="my-order-items-preview">{itemsLine}</p>
                    <button
                      type="button"
                      className="my-order-toggle"
                      onClick={() => setExpandedId(open ? null : order.id)}
                      aria-expanded={open}
                    >
                      {open ? 'Hide details' : 'View details'}
                    </button>
                    {open && (
                      <div className="my-order-detail">
                        <span className="my-order-detail-label">Items</span>
                        <ul>
                          {order.items.map((item) => (
                            <li key={`${order.id}-${item.id}-${item.name}`}>
                              {item.quantity}× {item.name} — ₹
                              {(item.price * item.quantity).toFixed(2)}
                            </li>
                          ))}
                        </ul>
                        {order.type === 'delivery' && (
                          <>
                            <span className="my-order-detail-label">Delivery</span>
                            <div>
                              {order.recipient_name && <div>{order.recipient_name}</div>}
                              <div>
                                {[order.address, order.city, order.zipCode]
                                  .filter(Boolean)
                                  .join(', ')}
                              </div>
                              {order.phone && <div>Phone: {order.phone}</div>}
                              {order.instructions && (
                                <div>Note: {order.instructions}</div>
                              )}
                            </div>
                          </>
                        )}
                        {order.type === 'dine-in' && (
                          <>
                            <span className="my-order-detail-label">Reservation</span>
                            <div>
                              Table / name: {order.tableNumber}
                              <br />
                              Guests: {order.guests}
                              <br />
                              {order.date} at {order.time}
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </article>
                )
              })}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default MyOrders
