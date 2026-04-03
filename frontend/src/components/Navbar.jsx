import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getAuthToken, authAPI } from '../utils/api'

function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userName, setUserName] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = () => {
      const token = getAuthToken()
      if (token) {
        setIsAuthenticated(true)
        // Fetch user info
        fetchUserInfo()
      } else {
        setIsAuthenticated(false)
        setUserName('')
      }
    }
    
    checkAuth()
    
    // Listen for storage changes (when user signs in/out in another tab)
    const handleStorageChange = (e) => {
      if (e.key === 'authToken') {
        checkAuth()
      }
    }
    
    // Listen for custom auth events
    const handleAuthChange = () => {
      checkAuth()
    }
    
    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('authChange', handleAuthChange)
    window.addEventListener('focus', checkAuth)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('authChange', handleAuthChange)
      window.removeEventListener('focus', checkAuth)
    }
  }, [])

  const fetchUserInfo = async () => {
    try {
      const user = await authAPI.getCurrentUser()
      setUserName(user.name || 'User')
    } catch (error) {
      authAPI.signout()
      setIsAuthenticated(false)
    }
  }

  const handleSignOut = () => {
    authAPI.signout()
    setIsAuthenticated(false)
    setUserName('')
    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event('authChange'))
    navigate('/')
  }

  return (
    <nav className="navbar">
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/order">Order</Link>
        <Link to="/contact">Contact Us</Link>
        <Link to="/services">Services</Link>
        {isAuthenticated ? (
          <>
            <Link to="/my-orders">My Orders</Link>
            <div className="user-menu">
              <span className="user-name">Hello, {userName}</span>
              <button onClick={handleSignOut} className="sign-out-btn">Sign Out</button>
            </div>
          </>
        ) : (
          <>
            <Link to="/signin">Sign In</Link>
            <Link to="/signup">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar


