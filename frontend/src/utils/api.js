/**
 * Client-only API: auth and orders persist in localStorage (no backend).
 */

const STORAGE_USERS = 'bakery_users'
const STORAGE_ORDERS = 'bakery_orders'
const STORAGE_SESSION_USER = 'bakery_session_user'

const getAuthToken = () => localStorage.getItem('authToken')
const setAuthToken = (token) => localStorage.setItem('authToken', token)
const removeAuthToken = () => {
  localStorage.removeItem('authToken')
  localStorage.removeItem(STORAGE_SESSION_USER)
}

const readJson = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

const writeJson = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value))
}

const getUsers = () => readJson(STORAGE_USERS, [])
const saveUsers = (users) => writeJson(STORAGE_USERS, users)

const getOrdersStore = () => readJson(STORAGE_ORDERS, [])
const saveOrdersStore = (orders) => writeJson(STORAGE_ORDERS, orders)

const getSessionUser = () => readJson(STORAGE_SESSION_USER, null)

const setSessionUser = (user) => {
  if (user) writeJson(STORAGE_SESSION_USER, user)
  else localStorage.removeItem(STORAGE_SESSION_USER)
}

const delay = (ms) => new Promise((r) => setTimeout(r, ms))

function computeOrderTotal(items, type) {
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const deliveryFee = type === 'delivery' ? 50 : 0
  const tax = subtotal * 0.18
  return subtotal + deliveryFee + tax
}

function normalizeOrderPayload(orderData, user) {
  const { type, items, delivery_info: d, dine_in_info: dIn, payment_method: pay } = orderData
  const id = crypto.randomUUID()
  const order_reference = `BKY-${id.replace(/-/g, '').slice(0, 8).toUpperCase()}`
  const base = {
    id,
    order_reference,
    payment_method: pay || 'cod',
    type,
    items,
    status: 'pending',
    created_at: new Date().toISOString(),
    user_id: user.id,
    user_name: user.name,
    user_email: user.email,
    user_phone: user.phone,
    total: computeOrderTotal(items, type),
  }

  if (type === 'delivery' && d) {
    return {
      ...base,
      recipient_name: (d.recipient_name || '').trim() || user.name,
      phone: d.phone,
      address: d.address,
      city: d.city,
      zipCode: d.zipCode,
      instructions: d.instructions || '',
    }
  }

  if (type === 'dine-in' && dIn) {
    return {
      ...base,
      tableNumber: dIn.tableNumber,
      guests: dIn.guests,
      date: dIn.date,
      time: dIn.time,
    }
  }

  return base
}

export const authAPI = {
  signup: async (userData) => {
    await delay(120)
    const { name, email, password, phone } = userData
    const users = getUsers()
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error('An account with this email already exists')
    }
    const id = crypto.randomUUID()
    const user = { id, name, email, password, phone }
    users.push(user)
    saveUsers(users)

    const session = { id, name, email, phone }
    setAuthToken(`local_${id}`)
    setSessionUser(session)

    return { access_token: getAuthToken(), user: session }
  },

  signin: async (email, password) => {
    await delay(120)
    const users = getUsers()
    const user = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    )
    if (!user) {
      throw new Error('Invalid email or password')
    }
    const session = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
    }
    setAuthToken(`local_${user.id}`)
    setSessionUser(session)

    return { access_token: getAuthToken(), user: session }
  },

  signout: () => {
    removeAuthToken()
    setSessionUser(null)
  },

  getCurrentUser: async () => {
    await delay(30)
    if (!getAuthToken()) {
      throw new Error('Not authenticated')
    }
    const session = getSessionUser()
    if (!session) {
      removeAuthToken()
      throw new Error('Session expired')
    }
    return session
  },
}

export const ordersAPI = {
  createOrder: async (orderData) => {
    await delay(150)
    if (!getAuthToken()) {
      throw new Error('Please sign in to place an order')
    }
    const user = getSessionUser()
    if (!user) {
      throw new Error('Please sign in to place an order')
    }
    const order = normalizeOrderPayload(orderData, user)
    const orders = getOrdersStore()
    orders.unshift(order)
    saveOrdersStore(orders)
    return order
  },

  getOrders: async () => {
    await delay(80)
    if (!getAuthToken()) throw new Error('Not authenticated')
    const user = getSessionUser()
    if (!user) throw new Error('Not authenticated')
    return getOrdersStore().filter((o) => o.user_id === user.id)
  },

  getOrder: async (orderId) => {
    await delay(50)
    const order = getOrdersStore().find((o) => o.id === orderId)
    if (!order) throw new Error('Order not found')
    return order
  },
}

export const adminAPI = {
  getOrders: async () => {
    await delay(80)
    if (!getAuthToken()) throw new Error('Not authenticated')
    return [...getOrdersStore()]
  },

  updateOrderStatus: async (orderId, newStatus) => {
    await delay(80)
    const orders = getOrdersStore()
    const idx = orders.findIndex((o) => o.id === orderId)
    if (idx === -1) throw new Error('Order not found')
    orders[idx] = { ...orders[idx], status: newStatus }
    saveOrdersStore(orders)
    return orders[idx]
  },
}

export { getAuthToken, setAuthToken, removeAuthToken }
