"use client"

import { useAppSelector } from "@/libs/redux/hooks"

export default function DashboardPage() {
  const { user } = useAppSelector((state) => state.auth)

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold">
        Welcome, {user?.displayName || user?.email}
      </h1>
      <p className="text-gray-500 mt-1">
        This page acts as main dashboard screen
      </p>
    </div>
  )
}
