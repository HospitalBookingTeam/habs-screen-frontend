import { SessionType } from '@/utils/renderEnums'

export interface CheckinRequest {
	isCheckupRecord: boolean
	qrCode: string
}

export interface QueueDetail {
	id: number
	status: number
	numericalOrder: number
	estimatedStartTime: string
	checkinTime: string
	patientName: string
	patientId: number
	isReExam: boolean
	isKickedFromQueue?: any
	session: SessionType
}

export interface TestDetail {
	id: number
	date: string
	numericalOrder: number
	status: number
	resultFileLink: string
	patientName: string
	operationId: number
	operationName: string
	roomNumber: string
	floor: string
	roomId: number
	patientId: number
	checkupRecordId: number
	doctorName: any
	doctorId: any
}

export type ICheckinResponse = {
	message: string
	success: boolean
	queue: QueueDetail[]
}

export type ICheckinTestResponse = {
	message: string
	success: boolean
	queue: TestDetail[]
}
