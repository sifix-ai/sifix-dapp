"use client"

import { useEffect } from "react"
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAppStore } from "@/store/app-store"

type ToastType = "success" | "error" | "info" | "warning"

export function ToastContainer() {
  const { toasts, removeToast } = useAppStore()

  useEffect(() => {
    // Auto-remove toasts after 5 seconds
    const timers = toasts.map((toast) => {
      return setTimeout(() => {
        removeToast(toast.id)
      }, 5000)
    })

    return () => {
      timers.forEach(clearTimeout)
    }
  }, [toasts, removeToast])

  const getIcon = (type: ToastType) => {
    switch (type) {
      case "success":
        return <CheckCircle size={18} className="text-emerald-400" />
      case "error":
        return <AlertCircle size={18} className="text-red-400" />
      case "warning":
        return <AlertTriangle size={18} className="text-amber-400" />
      case "info":
        return <Info size={18} className="text-blue-400" />
    }
  }

  const getStyles = (type: ToastType) => {
    switch (type) {
      case "success":
        return "bg-emerald-500/10 border-emerald-500/20 text-emerald-100"
      case "error":
        return "bg-red-500/10 border-red-500/20 text-red-100"
      case "warning":
        return "bg-amber-500/10 border-amber-500/20 text-amber-100"
      case "info":
        return "bg-blue-500/10 border-blue-500/20 text-blue-100"
    }
  }

  // Convert message to string if it's an object
  const formatMessage = (message: any): string => {
    if (typeof message === 'string') {
      return message
    }
    if (typeof message === 'object' && message !== null) {
      // If it's an error object with message property
      if ('message' in message) {
        return String(message.message)
      }
      // If it's a plain object, try to stringify it
      try {
        return JSON.stringify(message)
      } catch {
        return 'An error occurred'
      }
    }
    return String(message)
  }

  return (
    <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none max-w-md">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            "pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-lg border backdrop-blur-sm shadow-lg animate-in slide-in-from-top-2 duration-300",
            getStyles(toast.type)
          )}
        >
          <div className="flex-shrink-0 mt-0.5">
            {getIcon(toast.type)}
          </div>
          <p className="text-sm font-medium flex-1 break-words">
            {formatMessage(toast.message)}
          </p>
          <button
            onClick={() => removeToast(toast.id)}
            className="flex-shrink-0 text-white/50 hover:text-white/80 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  )
}

// Re-export toast helper from store for convenience
export { toast } from "@/store/app-store"
