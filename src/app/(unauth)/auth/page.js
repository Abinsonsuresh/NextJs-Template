"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import {
  signInWithEmail,
  signUpWithEmail,
  signInWithGoogle,
  resetPassword,
} from "@/libs/firebase/auth"

export default function AuthPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get("redirect") || "/dashboard"

  const [mode, setMode] = useState("signin") // signin | signup
  const [form, setForm] = useState({ name: "", email: "", password: "" })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      if (mode === "signup") {
        await signUpWithEmail(form.name, form.email, form.password)
      } else {
        await signInWithEmail(form.email, form.password)
      }
      router.replace(redirectTo)
    } catch (err) {
      setError(friendlyError(err.code))
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    setError("")
    setLoading(true)
    try {
      await signInWithGoogle()
      router.replace(redirectTo)
    } catch (err) {
      console.error("Google sign in error:", err)
      // Fallback to error message if code isn't in our friendly list
      setError(
        err.code
          ? friendlyError(err.code)
          : err.message || "An unknown error occurred",
      )
      setLoading(false)
    }
  }

  const handleForgotPassword = async () => {
    if (!form.email) {
      setError("Enter your email above first, then click 'Forgot password'.")
      return
    }
    try {
      await resetPassword(form.email)
      setError("Password reset email sent.")
    } catch (err) {
      setError(friendlyError(err.code))
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-4">
      <h1 className="text-xl text-black font-bold text-center">
        {mode === "signin" ? "Sign in" : "Create account"}
      </h1>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        {mode === "signup" && (
          <input
            className="border rounded px-3 py-2 w-full"
            placeholder="Full name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        )}
        <input
          className="border rounded px-3 py-2 w-full"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          className="border rounded px-3 py-2 w-full"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
          minLength={6}
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-brand-600 hover:bg-brand-700 text-white w-full py-2 rounded font-medium"
        >
          {loading
            ? "Please wait..."
            : mode === "signin"
              ? "Sign in"
              : "Sign up"}
        </button>
      </form>

      {mode === "signin" && (
        <button
          onClick={handleForgotPassword}
          className="text-xs text-brand-600 hover:underline block text-black text-center w-full"
        >
          Forgot password?
        </button>
      )}

      <div className="flex items-center gap-2">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs text-black">OR</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      <button
        onClick={handleGoogle}
        disabled={loading}
        className="border w-full py-2 rounded font-medium text-black hover:bg-gray-50"
      >
        Continue with Google
      </button>

      <p className="text-sm text-center text-black">
        {mode === "signin"
          ? "Don't have an account?"
          : "Already have an account?"}{" "}
        <button
          onClick={() => {
            setError("")
            setMode(mode === "signin" ? "signup" : "signin")
          }}
          className="text-brand-600 font-medium hover:underline"
        >
          {mode === "signin" ? "Sign up" : "Sign in"}
        </button>
      </p>
    </div>
  )
}

function friendlyError(code) {
  const map = {
    "auth/email-already-in-use": "That email is already registered.",
    "auth/invalid-email": "That email address looks invalid.",
    "auth/weak-password": "Password should be at least 6 characters.",
    "auth/user-not-found": "No account found with that email.",
    "auth/wrong-password": "Incorrect password.",
    "auth/invalid-credential": "Incorrect email or password.",
    "auth/too-many-requests": "Too many attempts. Try again later.",
    "auth/popup-closed-by-user": "Sign-in was cancelled.",
  }
  return map[code] || "Something went wrong. Please try again."
}
