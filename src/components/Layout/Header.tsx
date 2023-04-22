import { selectAuth } from '@/store/auth/selectors'
import { logout } from '@/store/auth/slice'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { formatRoomLabel } from '@/utils/formats'
import { createStyles, Container, Button, Group, Text } from '@mantine/core'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Clock from '../Clock'

const useStyles = createStyles((theme) => ({
	header: {
		paddingTop: theme.spacing.sm,
		backgroundColor: theme.fn.variant({
			variant: 'filled',
			color: theme.primaryColor,
		}).background,
		borderBottom: `1px solid ${
			theme.fn.variant({ variant: 'filled', color: theme.primaryColor })
				.background
		}`,
		marginBottom: 0,
	},

	mainSection: {
		paddingBottom: theme.spacing.sm,
	},
	searchInput: {
		minWidth: 250,
		height: 36,
		paddingLeft: theme.spacing.sm,
		paddingRight: 5,
		borderRadius: theme.radius.md,
		color:
			theme.colorScheme === 'dark'
				? theme.colors.dark[2]
				: theme.colors.gray[5],
		backgroundColor:
			theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.white,
		border: `1px solid ${
			theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
		}`,

		'&:hover': {
			backgroundColor:
				theme.colorScheme === 'dark'
					? theme.fn.rgba(theme.colors.dark[5], 0.85)
					: theme.fn.rgba(theme.colors.gray[0], 0.85),
		},
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
					<Text color="white" size="xl">
						{roomName}
					</Text>
					<Group>
						{information?.isCheckupRoom ? (
							information?.doctor ? (
								<Text color="white" weight={'bolder'}>
									Bác sĩ phụ trách: {information?.doctor}
								</Text>
							) : (
								<Text color="white" size="sm">
									Ngoài giờ làm việc
								</Text>
							)
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
