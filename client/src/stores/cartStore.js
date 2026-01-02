import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api from '../services/api'
import toast from 'react-hot-toast'

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      totalItems: 0,
      totalPrice: 0,
      appliedCoupon: null,
      discountAmount: 0,
      finalPrice: 0,
      isLoading: false,

      // Initialize cart from localStorage and sync with server
      initializeCart: async () => {
        const token = localStorage.getItem('token')
        if (token) {
          try {
            const response = await api.get('/cart')
            const cart = response.data.data
            set({
              items: cart.items || [],
              totalItems: cart.totalItems || 0,
              totalPrice: cart.totalPrice || 0,
              appliedCoupon: cart.appliedCoupon || null,
              discountAmount: cart.discountAmount || 0,
              finalPrice: cart.finalPrice || 0
            })
          } catch (error) {
            // If server cart fails, keep local cart
            console.error('Failed to sync cart with server:', error)
          }
        }
      },

      // Add item to cart
      addItem: async (product, quantity = 1, selectedVariants = []) => {
        try {
          set({ isLoading: true })
          
          const token = localStorage.getItem('token')
          if (token) {
            // Add to server cart
            const response = await api.post('/cart/add', {
              productId: product._id,
              quantity,
              selectedVariants
            })
            const cart = response.data.data
            set({
              items: cart.items,
              totalItems: cart.totalItems,
              totalPrice: cart.totalPrice,
              appliedCoupon: cart.appliedCoupon,
              discountAmount: cart.discountAmount,
              finalPrice: cart.finalPrice,
              isLoading: false
            })
          } else {
            // Add to local cart
            const { items } = get()
            const existingItemIndex = items.findIndex(item => 
              item.product._id === product._id &&
              JSON.stringify(item.selectedVariants) === JSON.stringify(selectedVariants)
            )

            let newItems
            if (existingItemIndex > -1) {
              newItems = [...items]
              newItems[existingItemIndex].quantity += quantity
            } else {
              newItems = [...items, {
                product,
                quantity,
                price: product.price,
                selectedVariants
              }]
            }

            const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0)
            const totalPrice = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)

            set({
              items: newItems,
              totalItems,
              totalPrice,
              finalPrice: totalPrice,
              isLoading: false
            })
          }
          
          toast.success('Added to cart!')
          return { success: true }
        } catch (error) {
          set({ isLoading: false })
          const message = error.response?.data?.message || 'Failed to add to cart'
          toast.error(message)
          return { success: false, message }
        }
      },

      // Update item quantity
      updateQuantity: async (productId, quantity, selectedVariants = []) => {
        try {
          set({ isLoading: true })
          
          const token = localStorage.getItem('token')
          if (token) {
            // Update server cart
            const response = await api.put('/cart/update', {
              productId,
              quantity,
              selectedVariants
            })
            const cart = response.data.data
            set({
              items: cart.items,
              totalItems: cart.totalItems,
              totalPrice: cart.totalPrice,
              appliedCoupon: cart.appliedCoupon,
              discountAmount: cart.discountAmount,
              finalPrice: cart.finalPrice,
              isLoading: false
            })
          } else {
            // Update local cart
            const { items } = get()
            const newItems = items.map(item => {
              if (item.product._id === productId &&
                  JSON.stringify(item.selectedVariants) === JSON.stringify(selectedVariants)) {
                return { ...item, quantity }
              }
              return item
            }).filter(item => item.quantity > 0)

            const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0)
            const totalPrice = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)

            set({
              items: newItems,
              totalItems,
              totalPrice,
              finalPrice: totalPrice,
              isLoading: false
            })
          }
          
          return { success: true }
        } catch (error) {
          set({ isLoading: false })
          const message = error.response?.data?.message || 'Failed to update cart'
          toast.error(message)
          return { success: false, message }
        }
      },

      // Remove item from cart
      removeItem: async (productId, selectedVariants = []) => {
        try {
          set({ isLoading: true })
          
          const token = localStorage.getItem('token')
          if (token) {
            // Remove from server cart
            await api.delete(`/cart/remove/${productId}`, {
              data: { selectedVariants }
            })
            const response = await api.get('/cart')
            const cart = response.data.data
            set({
              items: cart.items,
              totalItems: cart.totalItems,
              totalPrice: cart.totalPrice,
              appliedCoupon: cart.appliedCoupon,
              discountAmount: cart.discountAmount,
              finalPrice: cart.finalPrice,
              isLoading: false
            })
          } else {
            // Remove from local cart
            const { items } = get()
            const newItems = items.filter(item => 
              !(item.product._id === productId &&
                JSON.stringify(item.selectedVariants) === JSON.stringify(selectedVariants))
            )

            const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0)
            const totalPrice = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)

            set({
              items: newItems,
              totalItems,
              totalPrice,
              finalPrice: totalPrice,
              isLoading: false
            })
          }
          
          toast.success('Removed from cart!')
          return { success: true }
        } catch (error) {
          set({ isLoading: false })
          const message = error.response?.data?.message || 'Failed to remove from cart'
          toast.error(message)
          return { success: false, message }
        }
      },

      // Clear cart
      clearCart: async () => {
        try {
          const token = localStorage.getItem('token')
          if (token) {
            await api.delete('/cart/clear')
          }
          
          set({
            items: [],
            totalItems: 0,
            totalPrice: 0,
            appliedCoupon: null,
            discountAmount: 0,
            finalPrice: 0
          })
          
          return { success: true }
        } catch (error) {
          const message = error.response?.data?.message || 'Failed to clear cart'
          toast.error(message)
          return { success: false, message }
        }
      },

      // Apply coupon
      applyCoupon: async (couponCode) => {
        try {
          set({ isLoading: true })
          const response = await api.post('/cart/coupon', { code: couponCode })
          const cart = response.data.data
          
          set({
            appliedCoupon: cart.appliedCoupon,
            discountAmount: cart.discountAmount,
            finalPrice: cart.finalPrice,
            isLoading: false
          })
          
          toast.success('Coupon applied successfully!')
          return { success: true }
        } catch (error) {
          set({ isLoading: false })
          const message = error.response?.data?.message || 'Failed to apply coupon'
          toast.error(message)
          return { success: false, message }
        }
      },

      // Remove coupon
      removeCoupon: async () => {
        try {
          set({ isLoading: true })
          const response = await api.delete('/cart/coupon')
          const cart = response.data.data
          
          set({
            appliedCoupon: null,
            discountAmount: 0,
            finalPrice: cart.finalPrice,
            isLoading: false
          })
          
          toast.success('Coupon removed!')
          return { success: true }
        } catch (error) {
          set({ isLoading: false })
          const message = error.response?.data?.message || 'Failed to remove coupon'
          toast.error(message)
          return { success: false, message }
        }
      },

      // Get item count for specific product
      getItemCount: (productId, selectedVariants = []) => {
        const { items } = get()
        const item = items.find(item => 
          item.product._id === productId &&
          JSON.stringify(item.selectedVariants) === JSON.stringify(selectedVariants)
        )
        return item ? item.quantity : 0
      },

      // Check if cart is empty
      isEmpty: () => {
        const { items } = get()
        return items.length === 0
      },

      // Get cart summary
      getSummary: () => {
        const { totalItems, totalPrice, discountAmount, finalPrice, appliedCoupon } = get()
        return {
          totalItems,
          totalPrice,
          discountAmount,
          finalPrice,
          appliedCoupon,
          savings: discountAmount
        }
      }
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({
        items: state.items,
        totalItems: state.totalItems,
        totalPrice: state.totalPrice,
        appliedCoupon: state.appliedCoupon,
        discountAmount: state.discountAmount,
        finalPrice: state.finalPrice
      })
    }
  )
)

export { useCartStore }