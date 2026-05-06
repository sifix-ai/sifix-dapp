import { LucideIcon } from "lucide-react"

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 bg-white/[0.05] border border-white/[0.08] rounded-2xl flex items-center justify-center mb-6">
        <Icon className="w-8 h-8 text-white/40" />
      </div>
      
      <h3 className="text-xl font-semibold text-white mb-2">
        {title}
      </h3>
      
      <p className="text-white/60 max-w-md mb-6">
        {description}
      </p>
      
      {action && (
        <button
          onClick={action.onClick}
          className="px-6 py-3 bg-[#FF6363] hover:bg-[#FF6363]/90 text-white rounded-lg font-medium transition-all duration-200 hover:scale-105 active:scale-95"
        >
          {action.label}
        </button>
      )}
    </div>
  )
}
