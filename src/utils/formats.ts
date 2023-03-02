import { Room } from '@/entities/room'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc)

export const formatDate = (date: string | number, format = 'DD/MM/YYYY') => {
	return dayjs(date).format(format)
}

export const getLocalTimeFromUTC = (date: number | string) => {
	return dayjs(date).utc().local().valueOf()
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
