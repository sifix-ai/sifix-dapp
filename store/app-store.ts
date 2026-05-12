import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  address: string
  chainId: number
  isConnected: boolean
}

export interface Toast {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  timestamp: number
}

interface AppState {
  // User state
  user: User | null
  setUser: (user: User | null) => void
  
  // UI state
  isSidebarOpen: boolean
  toggleSidebar: () => void
  
  // Search state
  searchQuery: string
  setSearchQuery: (query: string) => void
  
  // Toast state (global notifications)
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id' | 'timestamp'>) => void
  removeToast: (id: string) => void
  
  // Legacy notification state (deprecated, use toasts instead)
  notifications: Array<{
    id: string
    type: 'success' | 'error' | 'warning' | 'info'
    message: string
    timestamp: number
  }>
  addNotification: (notification: Omit<AppState['notifications'][0], 'id' | 'timestamp'>) => void
  removeNotification: (id: string) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // User state
      user: null,
      setUser: (user) => set({ user }),
      
      // UI state
      isSidebarOpen: true,
      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
      
      // Search state
      searchQuery: '',
      setSearchQuery: (query) => set({ searchQuery: query }),
      
      // Toast state
      toasts: [],
      addToast: (toast) =>
        set((state) => ({
          toasts: [
            ...state.toasts,
            {
              ...toast,
              id: Math.random().toString(36).slice(2, 11),
              timestamp: Date.now(),
            },
          ],
        })),
      removeToast: (id) =>
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        })),
      
      // Legacy notification state
      notifications: [],
      addNotification: (notification) =>
        set((state) => ({
          notifications: [
            ...state.notifications,
            {
              ...notification,
              id: Math.random().toString(36).slice(2),
              timestamp: Date.now(),
            },
          ],
        })),
      removeNotification: (id) =>
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        })),
    }),
    {
      name: 'sifix-storage',
      partialize: (state) => ({ user: state.user }),
    }
  )
)

// Global toast helper functions
export const toast = {
  success: (message: string) => {
    useAppStore.getState().addToast({ type: 'success', message })
  },
  error: (message: string) => {
    useAppStore.getState().addToast({ type: 'error', message })
  },
  warning: (message: string) => {
    useAppStore.getState().addToast({ type: 'warning', message })
  },
  info: (message: string) => {
    useAppStore.getState().addToast({ type: 'info', message })
  },
}
