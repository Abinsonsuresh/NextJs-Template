import { configureStore } from "@reduxjs/toolkit"
import commonDataReducer from "../slices/commonDataSlice"
import authReducer from "../slices/authSlice"

const store = configureStore({
  reducer: {
    commonData: commonDataReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Firebase user objects aren't plain serializable
    }),
})

export default store
