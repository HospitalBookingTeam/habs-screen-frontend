import { Room } from '@/entities/room'
import dayjs from 'dayjs'

export const formatDate = (date: string, format = 'DD/MM/YYYY') => {
	return dayjs(date).format(format)
}

export const formatCurrency = (amount: number | string) => {
	return new Intl.NumberFormat('vi-VN', {
		style: 'currency',
		currency: 'VND',
	}).format(Number(amount))
}

export const formatRoomLabel = (room: Room, isGeneral = true) =>
	isGeneral
		? `${room.roomTypeName} ${room.departmentName?.toLowerCase()} ${
				room.roomNumber
		  } - Tầng ${room.floor}`
		: `${room.roomTypeName} ${room.roomNumber} - Tầng ${room.floor}`

export const formatRoomOptions = (rooms?: Room[], isGeneral = true) => {
	return rooms?.map((item) => ({
		value: item.id.toString(),
		label: formatRoomLabel(item, isGeneral),
	}))
}
