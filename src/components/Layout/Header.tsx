import { selectAuth } from '@/store/auth/selectors'
import { logout } from '@/store/auth/slice'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { createStyles, Container, Box, Group, Text } from '@mantine/core'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Clock from '../Clock'
import { translateSession } from '@/utils/renderEnums'
import { formatDate } from '@/utils/formats'

const useStyles = createStyles((theme) => ({
	header: {
		paddingTop: theme.spacing.sm,
		backgroundColor: theme.fn.variant({
			variant: 'filled',
			color: theme.primaryColor,
		}).background,
		// borderBottom: `1px solid ${
		// 	theme.fn.variant({ variant: 'filled', color: theme.primaryColor })
		// 		.background
		// }`,
		marginBottom: 0,
	},

	mainSection: {
		paddingBottom: theme.spacing.sm,
	},
}))

const SimpleHeader = () => {
	const { classes } = useStyles()
	const navigate = useNavigate()
	const authData = useAppSelector(selectAuth)
	const { information, isAuthenticated } = authData

	useEffect(() => {
		if (!isAuthenticated) {
			navigate('/login')
		}
	}, [isAuthenticated])

	const roomName = information?.isCheckupRoom
		? `${information?.roomType} ${information?.department?.toLowerCase()} ${
				information?.roomNumber
		  } - Tầng ${information?.floor}`
		: `${information?.roomType} ${information?.roomNumber} - Tầng ${information?.floor}`

	return (
		<div className={classes.header}>
			<Container size="xl" className={classes.mainSection}>
				<Group position="apart">
					<Group>
						<Text color="white" size="xl" weight={'bolder'}>
							{roomName}
						</Text>
						{information?.isCheckupRoom ? (
							information?.doctor ? (
								<Text color="white" weight={500}>
									Bác sĩ phụ trách: {information?.doctor}
								</Text>
							) : (
								<Text color="white" size="sm" weight={500}>
									Ngoài giờ làm việc
								</Text>
							)
						) : (
							<></>
						)}
					</Group>
					<Group>
						{information?.isCheckupRoom ? (
							<Box>
								<Text size="sm" color="white" weight={500}>
									Ca {translateSession(authData?.information?.session ?? 0)}:{' '}
									{formatDate(
										authData?.information?.sessionStart ?? '',
										'HH:mm'
									)}{' '}
									-{' '}
									{formatDate(authData?.information?.sessionEnd ?? '', 'HH:mm')}
								</Text>
							</Box>
						) : (
							<></>
						)}

						<Clock />
					</Group>
				</Group>
			</Container>
		</div>
	)
}

export default SimpleHeader
