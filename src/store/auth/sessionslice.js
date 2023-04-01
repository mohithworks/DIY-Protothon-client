import { createSlice } from '@reduxjs/toolkit'

export const initialState = {}

export const sessionSlice = createSlice({
	name: 'auth/session',
	initialState,
	reducers: {
        setSession: (_, action) => action.payload,
        sessionLoggedOut: () => initialState,
	},
})

export const { setSession, sessionLoggedOut } = sessionSlice.actions

export default sessionSlice.reducer