import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onIdTokenChanged,
  updateProfile,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth"
import { auth } from "./config"
import { setCookie, deleteCookie } from "@/utils/cookies"

export async function signUpWithEmail(name, email, password) {
  const cred = await createUserWithEmailAndPassword(auth, email, password)
  if (name) {
    await updateProfile(cred.user, { displayName: name })
  }
  const token = await cred.user.getIdToken()
  setCookie("authToken", token)
  return cred.user
}

export async function signInWithEmail(email, password) {
  const cred = await signInWithEmailAndPassword(auth, email, password)
  const token = await cred.user.getIdToken()
  setCookie("authToken", token)
  return cred.user
}

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider()
  const result = await signInWithPopup(auth, provider)
  const token = await result.user.getIdToken()
  setCookie("authToken", token)
  return result.user
}

export async function handleGoogleRedirectResult() {
  // Deprecated, no longer used with signInWithPopup
  return null
}

export async function signOutUser() {
  await signOut(auth)
  deleteCookie("authToken")
}

export async function resetPassword(email) {
  await sendPasswordResetEmail(auth, email)
}

// Keeps the cookie fresh on token refresh and syncs Redux state via
// providers.js. Not the first place the cookie gets set anymore —
// the email/Google sign-in functions above set it immediately on
// resolution to avoid a race with proxy.js's redirect check.
export function subscribeToAuthChanges(callback) {
  return onIdTokenChanged(auth, callback)
}
