import { Room } from './room'

export type AuthUser = {
	id: number
	username: string
	name: string
}

export type AuthState = {
	token: string
	isAuthenticated: boolean
}

export type AuthForm = {
	username: string
	password: string
}
