import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Order from './pages/Order'
import OrderConfirmation from './pages/OrderConfirmation'
import Services from './pages/Services'
import ContactUs from './pages/ContactUs'
import AdminDashboard from './pages/AdminDashboard'
import MyOrders from './pages/MyOrders'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/order" element={<Order />} />
        <Route path="/order/confirmation" element={<OrderConfirmation />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/my-orders" element={<MyOrders />} />
      </Routes>
    </Router>
  )
}

export default App


