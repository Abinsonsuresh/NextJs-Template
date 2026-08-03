"use client"

import { Provider } from "react-redux"
import { useEffect } from "react"
import { useAppDispatch } from "@/libs/redux/hooks"
import { setUser, clearUser } from "@/libs/redux/slices/authSlice"
import { subscribeToAuthChanges } from "@/libs/firebase/auth"
import { setCookie, deleteCookie } from "@/utils/cookies"
import store from "@/libs/redux/store/store"

function AuthListener({ children }) {
  const dispatch = useAppDispatch()

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges(async (firebaseUser) => {
      if (firebaseUser) {
        const token = await firebaseUser.getIdToken()
        setCookie("authToken", token)
        dispatch(
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
          }),
        )
      } else {
        deleteCookie("authToken")
        dispatch(clearUser())
      }
    })

    return () => unsubscribe()
  }, [dispatch])

  return children
}

export default function Providers({ children }) {
  return (
    <Provider store={store}>
      <AuthListener>{children}</AuthListener>
    </Provider>
  )
}
