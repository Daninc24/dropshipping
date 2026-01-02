import { Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuthStore } from './stores/authStore'
import { useCartStore } from './stores/cartStore'

// Layout Components
import Layout from './components/Layout/Layout'
import AdminLayout from './components/Layout/AdminLayout'

// Public Pages
import Home from './pages/Home'
import Shop from './pages/Shop'
import ProductDetail from './pages/ProductDetail'
import CategoryProducts from './pages/CategoryProducts'
import SearchResults from './pages/SearchResults'
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import ForgotPassword from './pages/Auth/ForgotPassword'
import ResetPassword from './pages/Auth/ResetPassword'
import About from './pages/About'
import Contact from './pages/Contact'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsOfService from './pages/TermsOfService'
import Careers from './pages/Careers'
import Press from './pages/Press'
import Support from './pages/Support'
import HelpCenter from './pages/HelpCenter'
import ShippingInfo from './pages/ShippingInfo'
import Returns from './pages/Returns'
import SizeGuide from './pages/SizeGuide'
import CookiePolicy from './pages/CookiePolicy'
import Accessibility from './pages/Accessibility'
import Categories from './pages/Categories'
import ApiTest from './pages/ApiTest'

// Protected User Pages
import Account from './pages/Account/Account'
import Profile from './pages/Account/Profile'
import Addresses from './pages/Account/Addresses'
import Orders from './pages/Account/Orders'
import OrderDetail from './pages/Account/OrderDetail'
import Wishlist from './pages/Account/Wishlist'
import Notifications from './pages/Account/Notifications'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'

// Admin Pages
import AdminDashboard from './pages/Admin/Dashboard'
import AdminProducts from './pages/Admin/Products'
import AdminProductForm from './pages/Admin/ProductForm'
import AdminCategories from './pages/Admin/Categories'
import AdminOrders from './pages/Admin/Orders'
import AdminUsers from './pages/Admin/Users'
import AdminReviews from './pages/Admin/Reviews'
import AdminCoupons from './pages/Admin/Coupons'
import AdminSettings from './pages/Admin/Settings'
import AdminAnalytics from './pages/Admin/Analytics'

// Route Guards
import ProtectedRoute from './components/Auth/ProtectedRoute'
import AdminRoute from './components/Auth/AdminRoute'

// Error Pages
import NotFound from './pages/NotFound'

function App() {
  const { initializeAuth } = useAuthStore()
  const { initializeCart } = useCartStore()

  useEffect(() => {
    // Initialize auth and cart on app start
    initializeAuth()
    initializeCart()
  }, [initializeAuth, initializeCart])

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="shop" element={<Shop />} />
        <Route path="categories" element={<Categories />} />
        <Route path="api-test" element={<ApiTest />} />
        <Route path="product/:slug" element={<ProductDetail />} />
        <Route path="categories/:categorySlug" element={<CategoryProducts />} />
        <Route path="search" element={<SearchResults />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="reset-password/:token" element={<ResetPassword />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="privacy-policy" element={<PrivacyPolicy />} />
        <Route path="terms" element={<TermsOfService />} />
        <Route path="careers" element={<Careers />} />
        <Route path="press" element={<Press />} />
        <Route path="support" element={<Support />} />
        <Route path="help" element={<HelpCenter />} />
        <Route path="shipping" element={<ShippingInfo />} />
        <Route path="returns" element={<Returns />} />
        <Route path="size-guide" element={<SizeGuide />} />
        <Route path="cookies" element={<CookiePolicy />} />
        <Route path="accessibility" element={<Accessibility />} />
        <Route path="cart" element={<Cart />} />
        
        {/* Protected User Routes */}
        <Route path="account" element={<ProtectedRoute><Account /></ProtectedRoute>}>
          <Route index element={<Profile />} />
          <Route path="addresses" element={<Addresses />} />
          <Route path="orders" element={<Orders />} />
          <Route path="orders/:orderId" element={<OrderDetail />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="notifications" element={<Notifications />} />
        </Route>
        <Route path="checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="products/new" element={<AdminProductForm />} />
        <Route path="products/:id/edit" element={<AdminProductForm />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="reviews" element={<AdminReviews />} />
        <Route path="coupons" element={<AdminCoupons />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route path="analytics" element={<AdminAnalytics />} />
      </Route>

      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App