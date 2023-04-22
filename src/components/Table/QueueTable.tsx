import { QueueDetail } from '@/entities/queue'
import { formatDate } from '@/utils/formats'
import {
	CheckupRecordStatus,
	translateCheckupRecordStatus,
	translateSession,
} from '@/utils/renderEnums'
import {
	Badge,
	Text,
	Center,
	ScrollArea,
	useMantineTheme,
	Grid,
	Loader,
	Stack,
} from '@mantine/core'
import dayjs from 'dayjs'

interface QueueTableProps {
	data?: QueueDetail[]
	isLoading?: boolean
}

const statusColors: Record<number, string> = {
	[CheckupRecordStatus.CHECKED_IN]: 'green',
	[CheckupRecordStatus.DANG_KHAM]: 'cyan',
	[CheckupRecordStatus.CHECKED_IN_SAU_XN]: 'pink',
}

const QueueTable = ({ data, isLoading }: QueueTableProps) => {
	const theme = useMantineTheme()

	const rows = data?.map((item, index) => {
		const isEven = index % 2 === 0
		const isCheckedInAfterTest =
			item.status === CheckupRecordStatus.CHECKED_IN_SAU_XN

		const isLate =
			dayjs(item.checkinTime).isAfter(item.estimatedStartTime) &&
			!isCheckedInAfterTest
		return (
			<Grid
				key={item.id}
				sx={{
					backgroundColor: isCheckedInAfterTest
						? theme.colors.green[1]
						: isLate
						? theme.colors.red[1]
						: isEven
						? 'white'
						: theme.colors.gray[0],
					width: '100%',
				}}
				py="md"
			>
				<Grid.Col span={1} sx={{ textAlign: 'center' }}>
					<Text size="xl">{item.numericalOrder}</Text>
				</Grid.Col>
				<Grid.Col span={3}>
					<Text size="xl" weight={500}>
						{item.patientName}
					</Text>
				</Grid.Col>

				<Grid.Col span={2} sx={{ textAlign: 'center' }}>
					<Badge
						size="xl"
						color={statusColors[item.status]}
						variant={theme.colorScheme === 'dark' ? 'light' : 'outline'}
					>
						{translateCheckupRecordStatus(item.status, item.isReExam)}
					</Badge>
				</Grid.Col>

				<Grid.Col span={2}>
					<Text size="xl" align="center">
						{formatDate(item?.estimatedStartTime, 'HH:mm')}
					</Text>
				</Grid.Col>
				<Grid.Col span={2}>
					<Text size="xl" align="center">
						{formatDate(item?.checkinTime, 'HH:mm')}
					</Text>
				</Grid.Col>
				<Grid.Col span={2}>
					<Text align="center">
						<Badge
							size="xl"
							color={
								item?.session == 0
									? 'green'
									: item?.session == 1
									? 'blue'
									: 'orange'
							}
						>
							{translateSession(item?.session)}
						</Badge>
					</Text>
				</Grid.Col>
			</Grid>
		)
	})

	return (
		<>
			<Grid color="gray.1" pb="md" sx={{ width: '100%' }}>
				<Grid.Col span={1} sx={{ textAlign: 'center' }}>
					SKB
				</Grid.Col>
				<Grid.Col span={3}>Tên người bệnh</Grid.Col>
				<Grid.Col span={2} sx={{ textAlign: 'center' }}>
					Trạng thái
				</Grid.Col>
				<Grid.Col span={2}>
					<Text align="center">Giờ dự kiến</Text>
				</Grid.Col>
				<Grid.Col span={2}>
					<Text align="center">Giờ check in</Text>
				</Grid.Col>
				<Grid.Col span={2}>
					<Text align="center">Ca khám</Text>
				</Grid.Col>
			</Grid>
			<ScrollArea.Autosize maxHeight={'calc(100vh - 160px)'}>
				<Center
					sx={{
						height: 100,
						width: '100%',
						display: isLoading ? 'flex' : 'none',
					}}
				>
					<Loader size="lg" />
				</Center>
				<Stack sx={{ width: '100%' }} mt="sm">
					{rows}
				</Stack>
			</ScrollArea.Autosize>
		</>
	)
}

export default QueueTable
