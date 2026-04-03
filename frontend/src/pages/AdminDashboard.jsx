import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminAPI, getAuthToken } from '../utils/api'
import './AdminDashboard.css'

function AdminDashboard() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('all') // all, delivery, dine-in
  const [statusFilter, setStatusFilter] = useState('all') // all, pending, confirmed, etc.
  const navigate = useNavigate()

  useEffect(() => {
    // Check if user is authenticated
    if (!getAuthToken()) {
      navigate('/signin')
      return
    }
    fetchOrders()
  }, [navigate])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await adminAPI.getOrders()
      setOrders(data)
    } catch (err) {
      setError(err.message || 'Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await adminAPI.updateOrderStatus(orderId, newStatus)
      fetchOrders()
    } catch (err) {
      alert('Failed to update order status: ' + err.message)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    try {
      const date = new Date(dateString)
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return dateString
    }
  }

  const filteredOrders = orders.filter(order => {
    const typeMatch = filter === 'all' || order.type === filter
    const statusMatch = statusFilter === 'all' || order.status === statusFilter
    return typeMatch && statusMatch
  })

  const getStatusColor = (status) => {
    const colors = {
      pending: '#ff9800',
      confirmed: '#2196f3',
      preparing: '#9c27b0',
      ready: '#4caf50',
      delivered: '#00bcd4',
      completed: '#4caf50',
      cancelled: '#f44336'
    }
    return colors[status] || '#666'
  }

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="loading">Loading orders...</div>
      </div>
    )
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Manage Orders and Customers</p>
      </div>

      <div className="admin-filters">
        <div className="filter-group">
          <label>Order Type:</label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Orders</option>
            <option value="delivery">Delivery</option>
            <option value="dine-in">Dine-In</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Status:</label>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="preparing">Preparing</option>
            <option value="ready">Ready</option>
            <option value="delivered">Delivered</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <button onClick={fetchOrders} className="refresh-btn">Refresh</button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="orders-stats">
        <div className="stat-card">
          <h3>Total Orders</h3>
          <p>{orders.length}</p>
        </div>
        <div className="stat-card">
          <h3>Delivery Orders</h3>
          <p>{orders.filter(o => o.type === 'delivery').length}</p>
        </div>
        <div className="stat-card">
          <h3>Dine-In Orders</h3>
          <p>{orders.filter(o => o.type === 'dine-in').length}</p>
        </div>
        <div className="stat-card">
          <h3>Pending Orders</h3>
          <p>{orders.filter(o => o.status === 'pending').length}</p>
        </div>
      </div>

      <div className="orders-table-container">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ref</th>
              <th>Customer</th>
              <th>Contact</th>
              <th>Type</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan="9" className="no-orders">No orders found</td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td className="order-id">
                    {order.order_reference || `#${order.id.slice(-6)}`}
                  </td>
                  <td>
                    <div className="customer-info">
                      <strong>{order.user_name || 'N/A'}</strong>
                      <span className="customer-email">{order.user_email || 'N/A'}</span>
                    </div>
                  </td>
                  <td>
                    {order.type === 'delivery' ? (
                      <div>
                        <div>{order.phone || order.user_phone || 'N/A'}</div>
                        <div className="address-info">
                          {order.address}, {order.city} {order.zipCode}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div>Table: {order.tableNumber || 'N/A'}</div>
                        <div>Guests: {order.guests || 'N/A'}</div>
                        <div>{order.date} {order.time}</div>
                      </div>
                    )}
                  </td>
                  <td>
                    <span className={`order-type ${order.type}`}>
                      {order.type === 'delivery' ? '🚚 Delivery' : '🍽️ Dine-In'}
                    </span>
                  </td>
                  <td>
                    <div className="order-items">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="order-item">
                          {item.quantity}x {item.name}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="order-total">₹{order.total.toFixed(2)}</td>
                  <td>
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      className="status-select"
                      style={{ 
                        backgroundColor: getStatusColor(order.status),
                        color: '#fff',
                        border: 'none',
                        padding: '5px 10px',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="preparing">Preparing</option>
                      <option value="ready">Ready</option>
                      <option value="delivered">Delivered</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td>{formatDate(order.created_at)}</td>
                  <td>
                    <button
                      onClick={() => {
                        const details = `
Ref: ${order.order_reference || order.id}
Customer: ${order.user_name}
Email: ${order.user_email}
Phone: ${order.user_phone || order.phone}
Type: ${order.type}
Status: ${order.status}
Payment: ${order.payment_method || '—'}
Total: ₹${order.total}
Items: ${order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
${order.type === 'delivery' ? `Address: ${order.address}, ${order.city} ${order.zipCode}` : `Table: ${order.tableNumber}, Date: ${order.date} ${order.time}`}
                        `
                        alert(details)
                      }}
                      className="view-details-btn"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminDashboard

