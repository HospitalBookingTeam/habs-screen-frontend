import { selectAuth } from '@/store/auth/selectors'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { useCheckinMutation } from '@/store/queue/api'
import { useForm } from '@mantine/form'
import { showNotification } from '@mantine/notifications'
import { Text } from '@mantine/core'
import { useEffect } from 'react'
import { logout } from '@/store/auth/slice'
import { useNavigate } from 'react-router-dom'

const Checkin = ({ refetch }: { refetch?: () => void }) => {
	const authData = useAppSelector(selectAuth)
	const isNotTestType = authData?.information?.roomType === 'Phòng khám'

	const dispatch = useAppDispatch()
	const navigate = useNavigate()
	const [checkinMutation] = useCheckinMutation()

	const form = useForm({
		initialValues: {
			qrCode: '',
		},
	})

	const onSubmit = async (values: { qrCode: string }) => {
		const { qrCode } = values
		await checkinMutation({ qrCode, isCheckupRecord: isNotTestType })
			.unwrap()
			.then(() => {
				refetch?.()
			})
			.catch(() => {
				showNotification({
					title: 'Lỗi',
					message: <Text>Không tìm thấy QR. Vui lòng thử lại</Text>,
					color: 'red',
				})
			})
			.finally(() => {
				form.reset()
			})
	}

	const handleKeyboard = ({
		repeat,
		metaKey,
		ctrlKey,
		shiftKey,
		key,
	}: globalThis.KeyboardEvent): any => {
		if (repeat) return

		// Handle both, `ctrl` and `meta`.
		if ((metaKey || ctrlKey) && shiftKey && key === 'L') {
			dispatch(logout())
		}
	}

	useEffect(() => {
		document.addEventListener('keydown', (e) => handleKeyboard(e))

		// Important to remove the listeners.
		return () =>
			document.removeEventListener('keydown', (e) => handleKeyboard(e))
	})

	return (
		<form
			style={{ opacity: 0, position: 'fixed' }}
			onSubmit={form.onSubmit(onSubmit)}
		>
			<input
				{...form.getInputProps('qrCode')}
				onBlur={(e) => e.currentTarget.focus()}
				autoFocus={true}
				autoComplete="off"
			/>
			<button hidden type="submit" />
		</form>
	)
}
export default Checkin
