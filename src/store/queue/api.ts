import { CheckinRequest, QueueDetail, TestDetail } from '@/entities/queue'
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
		checkin: build.mutation<(QueueDetail | TestDetail)[], CheckinRequest>({
			query: (body) => ({
				url: `checkin`,
				method: 'POST',
				body,
			}),
			async onQueryStarted({ ...patch }, { dispatch, queryFulfilled }) {
				try {
					const { data: updatedData } = await queryFulfilled
					let patchResult
					patchResult = dispatch(
						queueApi.util.updateQueryData('getQueue', undefined, (draft) => {
							return updatedData as QueueDetail[]
						})
					)
					patchResult = dispatch(
						queueApi.util.updateQueryData(
							'getTestQueue',
							undefined,
							(draft) => {
								return updatedData as TestDetail[]
							}
						)
					)
				} catch {}
			},
		}),
	}),
})

export const { useGetQueueQuery, useGetTestQueueQuery, useCheckinMutation } =
	queueApi
