import {
	CheckinRequest,
	ICheckinResponse,
	ICheckinTestResponse,
	QueueDetail,
	TestDetail,
} from '@/entities/queue'
import { createApi } from '@reduxjs/toolkit/dist/query/react'
import { baseQueryWithRetry } from '../api'

export const queueApi = createApi({
	reducerPath: 'queueApi',
	tagTypes: ['Auth', 'Queue'],
	baseQuery: baseQueryWithRetry,
	endpoints: (build) => ({
		getQueue: build.query<QueueDetail[], void>({
			query: () => ({
				url: 'checkup-queue',
			}),
			providesTags: (result = []) => [
				...result.map(({ id }) => ({ type: 'Queue', id } as const)),
				{ type: 'Queue' as const, id: 'LIST' },
			],
		}),
		getTestQueue: build.query<TestDetail[], void>({
			query: () => ({
				url: 'test-queue',
			}),
			providesTags: (result = []) => [
				...result.map(
					({ id }) => ({ type: 'Queue', id: `TEST${id}` } as const)
				),
				{ type: 'Queue' as const, id: 'TEST_LIST' },
			],
		}),
		checkin: build.mutation<
			ICheckinResponse,
			Omit<CheckinRequest, 'isCheckupRecord'>
		>({
			query: (body) => ({
				url: `checkin`,
				method: 'POST',
				body: {
					...body,
					isCheckupRecord: true,
				},
			}),
			async onQueryStarted({ ...patch }, { dispatch, queryFulfilled }) {
				try {
					const { data: updatedData } = await queryFulfilled
					const { success, queue } = updatedData
					if (success) {
						dispatch(
							queueApi.util.updateQueryData('getQueue', undefined, (draft) => {
								return queue as QueueDetail[]
							})
						)
					}
				} catch {}
			},
		}),
		checkinTest: build.mutation<
			ICheckinTestResponse,
			Omit<CheckinRequest, 'isCheckupRecord'>
		>({
			query: (body) => ({
				url: `checkin`,
				method: 'POST',
				body: {
					...body,
					isCheckupRecord: false,
				},
			}),
			async onQueryStarted({ ...patch }, { dispatch, queryFulfilled }) {
				try {
					const { data: updatedData } = await queryFulfilled
					const { success, queue } = updatedData
					if (success) {
						dispatch(
							queueApi.util.updateQueryData(
								'getTestQueue',
								undefined,
								(draft) => {
									return queue as TestDetail[]
								}
							)
						)
					}
				} catch {}
			},
		}),
	}),
})

export const {
	useGetQueueQuery,
	useGetTestQueueQuery,
	useCheckinMutation,
	useCheckinTestMutation,
} = queueApi
