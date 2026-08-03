"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useAppSelector } from "@/libs/redux/hooks"
import { signOutUser } from "@/libs/firebase/auth"

export default function AuthedLayout({ children }) {
  const { user, loading } = useAppSelector((state) => state.auth)
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth")
    }
  }, [loading, user, router])

  const handleSignOut = async () => {
    await signOutUser()
    router.replace("/auth")
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-gray-500">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <header className="bg-brand-700 text-white px-4 py-3 flex items-center justify-between">
        <span className="font-semibold">Next Js Dashboard</span>
        <div className="flex items-center gap-3 text-sm">
          <span>{user.displayName || user.email}</span>
          <button
            onClick={handleSignOut}
            className="bg-brand-600 hover:bg-brand-500 px-3 py-1 rounded"
          >
            Sign out
          </button>
        </div>
      </header>
      <main>{children}</main>
    </div>
  )
}
