'use client'

import { AuthGuard } from '@/components/auth-guard'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-[#07080a]">
        {children}
      </div>
    </AuthGuard>
  )
}
