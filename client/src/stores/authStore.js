import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api from '../services/api'
import toast from 'react-hot-toast'

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      // Initialize auth from stored token
      initializeAuth: async () => {
        const token = localStorage.getItem('token')
        if (token) {
          try {
            set({ isLoading: true })
            const response = await api.get('/auth/me')
            set({
              user: response.data.data,
              token,
              isAuthenticated: true,
              isLoading: false
            })
          } catch (error) {
            // Token is invalid, clear it
            localStorage.removeItem('token')
            set({
              user: null,
              token: null,
              isAuthenticated: false,
              isLoading: false
            })
          }
        }
      },

      // Login
      login: async (credentials) => {
        try {
          set({ isLoading: true })
          const response = await api.post('/auth/login', credentials)
          const { token, data: user } = response.data
          
          localStorage.setItem('token', token)
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false
          })
          
          toast.success('Login successful!')
          return { success: true }
        } catch (error) {
          set({ isLoading: false })
          const message = error.response?.data?.message || 'Login failed'
          toast.error(message)
          return { success: false, message }
        }
      },

      // Register
      register: async (userData) => {
        try {
          set({ isLoading: true })
          const response = await api.post('/auth/register', userData)
          const { token, data: user } = response.data
          
          localStorage.setItem('token', token)
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false
          })
          
          toast.success('Registration successful!')
          return { success: true }
        } catch (error) {
          set({ isLoading: false })
          const message = error.response?.data?.message || 'Registration failed'
          toast.error(message)
          return { success: false, message }
        }
      },

      // Logout
      logout: async () => {
        try {
          await api.post('/auth/logout')
        } catch (error) {
          // Continue with logout even if API call fails
        } finally {
          localStorage.removeItem('token')
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false
          })
          toast.success('Logged out successfully')
        }
      },

      // Update user profile
      updateProfile: async (userData) => {
        try {
          set({ isLoading: true })
          const response = await api.put('/users/profile', userData)
          set({
            user: response.data.data,
            isLoading: false
          })
          toast.success('Profile updated successfully!')
          return { success: true }
        } catch (error) {
          set({ isLoading: false })
          const message = error.response?.data?.message || 'Update failed'
          toast.error(message)
          return { success: false, message }
        }
      },

      // Change password
      changePassword: async (passwordData) => {
        try {
          set({ isLoading: true })
          await api.put('/auth/password', passwordData)
          set({ isLoading: false })
          toast.success('Password changed successfully!')
          return { success: true }
        } catch (error) {
          set({ isLoading: false })
          const message = error.response?.data?.message || 'Password change failed'
          toast.error(message)
          return { success: false, message }
        }
      },

      // Forgot password
      forgotPassword: async (email) => {
        try {
          set({ isLoading: true })
          await api.post('/auth/forgot-password', { email })
          set({ isLoading: false })
          toast.success('Password reset email sent!')
          return { success: true }
        } catch (error) {
          set({ isLoading: false })
          const message = error.response?.data?.message || 'Failed to send reset email'
          toast.error(message)
          return { success: false, message }
        }
      },

      // Reset password
      resetPassword: async (token, password) => {
        try {
          set({ isLoading: true })
          const response = await api.put(`/auth/reset-password/${token}`, { password })
          const { token: newToken, data: user } = response.data
          
          localStorage.setItem('token', newToken)
          set({
            user,
            token: newToken,
            isAuthenticated: true,
            isLoading: false
          })
          
          toast.success('Password reset successful!')
          return { success: true }
        } catch (error) {
          set({ isLoading: false })
          const message = error.response?.data?.message || 'Password reset failed'
          toast.error(message)
          return { success: false, message }
        }
      },

      // Add to wishlist
      addToWishlist: async (productId) => {
        try {
          const response = await api.post(`/users/wishlist/${productId}`)
          set({ user: response.data.data })
          toast.success('Added to wishlist!')
          return { success: true }
        } catch (error) {
          const message = error.response?.data?.message || 'Failed to add to wishlist'
          toast.error(message)
          return { success: false, message }
        }
      },

      // Remove from wishlist
      removeFromWishlist: async (productId) => {
        try {
          const response = await api.delete(`/users/wishlist/${productId}`)
          set({ user: response.data.data })
          toast.success('Removed from wishlist!')
          return { success: true }
        } catch (error) {
          const message = error.response?.data?.message || 'Failed to remove from wishlist'
          toast.error(message)
          return { success: false, message }
        }
      },

      // Check if user is admin
      isAdmin: () => {
        const { user } = get()
        return user?.role === 'admin'
      },

      // Check if product is in wishlist
      isInWishlist: (productId) => {
        const { user } = get()
        return user?.wishlist?.some(item => item._id === productId) || false
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
)

export { useAuthStore }