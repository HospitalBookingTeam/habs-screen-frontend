import { AuthForm } from '@/entities/auth'
import { retry } from '@reduxjs/toolkit/query/react'
import { api } from '../api'

export const authApi = api.injectEndpoints({
	endpoints: (build) => ({
		login: build.mutation<{ token: string }, any>({
			query: (credentials: AuthForm) => ({
				url: 'login',
				method: 'POST',
				body: credentials,
			}),
			extraOptions: {
				backoff: () => {
					// We intentionally error once on login, and this breaks out of retrying. The next login attempt will succeed.
					retry.fail({ fake: 'error' })
				},
			},
		}),
	}),
})

export const { useLoginMutation } = authApi

export const {
	endpoints: { login },
} = authApi
