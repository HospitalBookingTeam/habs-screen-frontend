import { lazy, Suspense, useEffect, useLayoutEffect } from 'react'
import { Routes, Route, Outlet, Navigate, useNavigate } from 'react-router-dom'
import { Container, LoadingOverlay } from '@mantine/core'
import { selectAuth, selectIsAuthenticated } from '@/store/auth/selectors'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import SimpleVerticalLayout from '@/components/Layout/SimpleVerticalLayout'
import { selectTime } from '@/store/config/selectors'
import { useLazyGetTimeQuery } from '@/store/config/api'
import { useLazyGetCurrentDoctorQuery } from '@/store/auth/api'
import { updateAuthInfo } from '@/store/auth/slice'

const Login = lazy(() => import('@/pages/auth'))
const Queue = lazy(() => import('@/pages/queue'))

const NotFound = lazy(() => import('@/components/NotFound/NotFoundPage'))

function App() {
	const isAuthenticated = useAppSelector(selectIsAuthenticated)
	const authData = useAppSelector(selectAuth)
	const configTime = useAppSelector(selectTime)
	const [triggerTimeConfig] = useLazyGetTimeQuery()
	const [triggerGetDoctor] = useLazyGetCurrentDoctorQuery()
	const dispatch = useAppDispatch()

	useEffect(() => {
		const getTime = async () => {
			await triggerTimeConfig()
		}
		if (isAuthenticated && configTime === null) {
			getTime()
		}
	}, [isAuthenticated, configTime])

	useEffect(() => {
		const getDoc = async (id: number) => {
			await triggerGetDoctor({ id })
				.unwrap()
				.then((resp) => dispatch(updateAuthInfo({ ...resp })))
		}
		if (isAuthenticated && authData?.information?.id) {
			getDoc(authData?.information?.id)
		}
	}, [isAuthenticated])
	return (
		<Suspense fallback={<LoadingOverlay visible={true} />}>
			<Routes>
				<Route path="/" element={<Outlet />}>
					<Route element={<RequireAuth />}>
						<Route index element={<Queue />} />
					</Route>

					<Route path="/login" element={<IsUserRedirect />}>
						<Route index element={<Login />} />
					</Route>
				</Route>
				<Route path="*" element={<NotFound />} />
			</Routes>
		</Suspense>
	)
}

const RequireAuth = () => {
	const isAuthenticated = useAppSelector(selectIsAuthenticated)

	const navigate = useNavigate()
	useLayoutEffect(() => {
		if (isAuthenticated) return
		navigate('/login')
	}, [isAuthenticated, navigate])

	return isAuthenticated ? (
		<SimpleVerticalLayout>
			<Outlet />
		</SimpleVerticalLayout>
	) : (
		<Navigate to={'/login'} />
	)
}
const IsUserRedirect = () => {
	const isAuthenticated = useAppSelector(selectIsAuthenticated)
	return !isAuthenticated ? (
		<Container
			size="xl"
			sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
		>
			<Outlet />
		</Container>
	) : (
		<Navigate to={'/'} />
	)
}

export default App
