import { AuthForm, AuthUser } from '@/entities/auth'
import { Room } from '@/entities/room'
import { retry } from '@reduxjs/toolkit/query/react'
import { api } from '../api'
import { doctorApi } from '../doctorApi'

export const authApi = api.injectEndpoints({
	endpoints: (build) => ({
		login: build.mutation<{ token: string; information: AuthUser }, any>({
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
		getCurrentDoctor: build.query<
			{
				doctorName: string
				session: number
				sessionStart: string
				sessionEnd: string
			},
			{ id: number }
		>({
			query: (params) => ({
				url: `login/${params.id}/current-doctor`,
			}),
		}),
	}),
})

export const doctorAuthApi = doctorApi.injectEndpoints({
	endpoints: (build) => ({
		getRoomList: build.query<Room[], void>({
			query: () => ({
				url: `rooms`,
			}),
			providesTags: (result = []) => [
				...result.map(({ id }) => ({ type: 'Auth', id } as const)),
				{ type: 'Auth' as const, id: 'ROOMS' },
			],
		}),
		getTestRoomList: build.query<Room[], void>({
			query: () => ({
				url: `rooms/exam-room`,
			}),
			providesTags: (result = []) => [
				...result.map(({ id }) => ({ type: 'Auth', id } as const)),
				{ type: 'Auth' as const, id: 'EXAM_ROOMS' },
			],
		}),
	}),
})

export const { useLoginMutation, useLazyGetCurrentDoctorQuery } = authApi

export const { useGetRoomListQuery, useGetTestRoomListQuery } = doctorAuthApi
