import { CheckinRequest, QueueDetail, TestDetail } from '@/entities/queue'
import { api } from '../api'

export const queueApi = api.injectEndpoints({
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
		checkin: build.mutation<void, CheckinRequest>({
			query: (body) => ({
				url: `checkin`,
				method: 'POST',
				body,
			}),
		}),
	}),
})

export const { useGetQueueQuery, useGetTestQueueQuery, useCheckinMutation } =
	queueApi
