"use client"

import Link from "next/link"
import { useAppSelector } from "@/libs/redux/hooks"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function LandingPage() {
  const { user, loading } = useAppSelector((state) => state.auth)
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      router.replace("/dashboard")
    }
  }, [loading, user, router])

  return (
    <div className="text-center space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-brand-700">Movie Tracker</h1>
        <p className="text-gray-500 mt-2">
          Track every movie you watch — in theaters and on OTT — in one place.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6 text-left space-y-3">
        <Feature text="Log theater watches with screen, sound, and format details" />
        <Feature text="Track OTT movies and series across every platform" />
        <Feature text="See lifetime stats: hours watched, theaters visited, episodes seen" />
        <Feature text="Revisit your theater memories — first and last movie at each cinema" />
      </div>

      <div className="flex flex-col gap-3">
        <Link
          href="/auth"
          className="bg-brand-600 hover:bg-brand-700 text-white w-full py-2 rounded font-medium block"
        >
          Get started
        </Link>
        <Link href="/auth" className="text-brand-600 text-sm hover:underline">
          Already have an account? Sign in
        </Link>
      </div>
    </div>
  )
}

function Feature({ text }) {
  return (
    <div className="flex items-start gap-2">
      <span className="text-brand-600 mt-0.5">✓</span>
      <span className="text-sm text-gray-700">{text}</span>
    </div>
  )
}
