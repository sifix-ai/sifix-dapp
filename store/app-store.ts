import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  address: string
  chainId: number
  isConnected: boolean
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
  
  // Notification state
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
      
      // Notification state
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
