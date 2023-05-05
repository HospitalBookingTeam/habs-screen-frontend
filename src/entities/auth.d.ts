import { Room } from './room'

export interface AuthUser {
	id: number
	roomNumber: string
	floor: string
	note: string
	departmentId: number
	roomTypeId: number
	department: string
	roomType: string
	doctor: string
	isCheckupRoom: boolean
	sessionStart: string
	sessionEnd: string
	session: number
}

export type AuthState = {
	token: string
	isAuthenticated: boolean
	information?: AuthUser
}

export type AuthForm = {
	password: string
	roomId: number | null
}
