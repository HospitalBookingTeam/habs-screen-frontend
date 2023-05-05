import { AuthForm } from '@/entities/auth'
import { persistor } from '@/store'
import {
	useGetRoomListQuery,
	useGetTestRoomListQuery,
	useLoginMutation,
} from '@/store/auth/api'
import { formatRoomOptions } from '@/utils/formats'
import { createStyles, Image, Text } from '@mantine/core'
import { Stack } from '@mantine/core'
import {
	Paper,
	LoadingOverlay,
	PasswordInput,
	Button,
	Title,
	Radio,
	Select,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { openModal } from '@mantine/modals'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const useStyles = createStyles((theme) => ({
	layout: {
		flexDirection: 'row',
		gap: 40,
		position: 'relative',
	},
	imageHolder: {
		borderRadius: 4,
		overflow: 'hidden',
		[`@media (max-width: ${theme.breakpoints.xl}px)`]: {
			display: 'none',
		},
	},
	formHolder: {
		maxWidth: 450,
		width: '100%',
		margin: '0 auto',
		position: 'relative',
	},
}))

type DepartmentType = 'general' | 'test'

const Login = () => {
	const [departmentType, setDepartmentType] =
		useState<DepartmentType>('general')
	const isTestDepartment = departmentType === 'test'

	const { classes } = useStyles()
	const [login, { isLoading }] = useLoginMutation()

	const { data: roomList, isLoading: isLoadingRoomList } = useGetRoomListQuery()
	const { data: testRoomList, isLoading: isLoadingTestRoomList } =
		useGetTestRoomListQuery(undefined, {
			skip: !isTestDepartment,
		})

	const navigate = useNavigate()

	const form = useForm({
		initialValues: {
			password: '',
			roomId: null,
		},

		validate: {
			password: (value) => (value.length > 0 ? null : true),
			roomId: (value) => (!!value && value > 0 ? null : true),
		},
	})

	const onSubmit = async (values: AuthForm) => {
		persistor.persist()
		await login({ ...values })
			.unwrap()
			.then(() => navigate('/'))
			.catch((error) => {
				openModal({
					children: (
						<>
							<Text color="red" weight={'bold'}>
								Lỗi đăng nhập. Vui lòng thử lại!
							</Text>
						</>
					),
					withCloseButton: false,
					centered: true,
				})
				form.reset()
			})
	}

	return (
		<Paper shadow="md" withBorder={true} p={30}>
			<form onSubmit={form.onSubmit(onSubmit)}>
				<Stack className={classes.layout}>
					<Stack justify="center" px={12} className={classes.formHolder}>
						<LoadingOverlay
							visible={isLoadingRoomList || isLoadingTestRoomList}
							overlayBlur={2}
						/>
						<Title order={2} align="center" mt="md" mb={50}>
							Chào mừng bạn
						</Title>

						<PasswordInput
							withAsterisk={true}
							autoComplete="current-password"
							label="Mật khẩu"
							placeholder="Vui lòng nhập"
							mt="md"
							size="md"
							{...form.getInputProps('password')}
						/>

						<Radio.Group
							value={departmentType}
							onChange={(value) => {
								setDepartmentType(value as DepartmentType)
								form.setFieldValue('roomId', null)
							}}
							label="Chọn loại phòng"
							withAsterisk={true}
						>
							<Radio value="general" label="Phòng khám" />
							<Radio value="test" label="Phòng xét nghiệm" />
						</Radio.Group>

						<Select
							withAsterisk={true}
							mt="md"
							size="md"
							label={!isTestDepartment ? 'Phòng khám' : 'Phòng xét nghiệm'}
							placeholder="Vui lòng chọn một"
							data={
								!isTestDepartment
									? formatRoomOptions(roomList ?? [])
									: formatRoomOptions(testRoomList ?? [], false)
							}
							searchable={true}
							nothingFound="Không tìm thấy"
							{...form.getInputProps('roomId')}
						/>

						<Button
							type="submit"
							fullWidth={true}
							mt="xl"
							size="md"
							loading={isLoading}
						>
							Đăng nhập
						</Button>
					</Stack>

					<Stack className={classes.imageHolder}>
						<Image src="images/auth-bg.jpg" />
					</Stack>
				</Stack>
			</form>
		</Paper>
	)
}

export default Login
