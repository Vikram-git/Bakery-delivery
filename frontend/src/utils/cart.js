// Cart lives in sessionStorage: empty each new browser session until the user clicks Add.

const CART_STORAGE_KEY = 'bakery_cart'
const LEGACY_LOCAL_KEY = 'bakery_cart'

function getStorage() {
  try {
    if (typeof sessionStorage === 'undefined') return null
    return sessionStorage
  } catch {
    return null
  }
}

function dropLegacyLocalCart() {
  try {
    if (localStorage.getItem(LEGACY_LOCAL_KEY)) {
      localStorage.removeItem(LEGACY_LOCAL_KEY)
    }
  } catch {
    /* ignore */
  }
}

dropLegacyLocalCart()

/** Product ids that add more than 1 on first Add (customer can change qty on the order page). */
const DEFAULT_ADD_QUANTITY_BY_ID = {
  7: 4, // Garlic Bread
}

/**
 * How many units to add when the customer clicks Add (default 1).
 * Garlic bread adds 4 by default; + / − on checkout still work.
 */
export function getDefaultAddQuantity(product) {
  if (!product) return 1
  const byId = DEFAULT_ADD_QUANTITY_BY_ID[product.id]
  if (byId != null) return byId
  const n = (product.name || '').toLowerCase()
  if (n.includes('garlic') && n.includes('bread')) return 4
  return 1
}

export const getCart = () => {
  const storage = getStorage()
  if (!storage) return []
  try {
    const cart = storage.getItem(CART_STORAGE_KEY)
    return cart ? JSON.parse(cart) : []
  } catch (error) {
    console.error('Error reading cart:', error)
    return []
  }
}

export const saveCart = (cart) => {
  const storage = getStorage()
  if (!storage) return
  try {
    storage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
  } catch (error) {
    console.error('Error saving cart:', error)
  }
}

export const addToCart = (product) => {
  const cart = getCart()
  const existingItem = cart.find((item) => item.id === product.id)

  if (existingItem) {
    const updatedCart = cart.map((item) =>
      item.id === product.id
        ? { ...item, quantity: item.quantity + (product.quantity || 1) }
        : item
    )
    saveCart(updatedCart)
    return updatedCart
  }

  const newCart = [
    ...cart,
    {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: product.quantity || 1,
    },
  ]
  saveCart(newCart)
  return newCart
}

export const clearCart = () => {
  const storage = getStorage()
  if (!storage) return
  try {
    storage.removeItem(CART_STORAGE_KEY)
  } catch (error) {
    console.error('Error clearing cart:', error)
  }
}

export const mergeCart = (newProducts) => {
  const existingCart = getCart()
  const mergedCart = [...existingCart]

  newProducts.forEach((newProduct) => {
    const existingItem = mergedCart.find((item) => item.id === newProduct.id)
    if (existingItem) {
      existingItem.quantity += newProduct.quantity || 1
    } else {
      mergedCart.push({
        id: newProduct.id,
        name: newProduct.name,
        price: newProduct.price,
        quantity: newProduct.quantity || 1,
      })
    }
  })

  saveCart(mergedCart)
  return mergedCart
}
