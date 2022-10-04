export interface CheckinRequest {
	isCheckupRecord: boolean
	qrCode: string
}

export type QueueDetail = {
	id: number
	status: number
	numericalOrder: number
	estimatedStartTime: string
	patientName: string
	patientId: number
	isReExam: boolean
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
