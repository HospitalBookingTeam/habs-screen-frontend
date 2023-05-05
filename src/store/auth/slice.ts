import { createSlice } from '@reduxjs/toolkit'
import { AuthState } from '@/entities/auth'
import { authApi } from '@/store/auth/api'
import { removeLocalItem } from '@/utils/storage'

const initialState: AuthState = {
	token: '',
	isAuthenticated: false,
	information: undefined,
}

export const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		logout: (state) => {
			state = { ...initialState }
			removeLocalItem('persist:root')
			return state
		},
		updateAuthInfo: (state, action) => {
			const { doctorName, ...rest } = action.payload
			return {
				...state,
				information: {
					...state.information,
					doctor: doctorName,
					...rest,
				},
			}
		},
	},
	extraReducers: (builder) => {
		builder
			.addMatcher(authApi.endpoints.login.matchPending, (state, action) => {
				console.log('pending', action)
			})
			.addMatcher(authApi.endpoints.login.matchFulfilled, (state, action) => {
				console.log('fulfilled', action)
				state.information = action.payload.information
				state.token = action.payload.token
				state.isAuthenticated = true
			})
			.addMatcher(authApi.endpoints.login.matchRejected, (state, action) => {
				console.log('rejected', action)
			})
	},
})

export const { logout, updateAuthInfo } = authSlice.actions

export default authSlice.reducer
