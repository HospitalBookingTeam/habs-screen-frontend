import { lazy, Suspense, useEffect, useLayoutEffect } from 'react'
import { Routes, Route, Outlet, Navigate, useNavigate } from 'react-router-dom'
import { Container, LoadingOverlay } from '@mantine/core'
import { selectIsAuthenticated } from '@/store/auth/selectors'
import { useAppSelector } from '@/store/hooks'
import SimpleVerticalLayout from '@/components/Layout/SimpleVerticalLayout'
import { selectTime } from '@/store/config/selectors'
import { useLazyGetTimeQuery } from '@/store/config/api'

const Login = lazy(() => import('@/pages/auth'))
const Queue = lazy(() => import('@/pages/queue'))

const NotFound = lazy(() => import('@/components/NotFound/NotFoundPage'))

function App() {
	const isAuthenticated = useAppSelector(selectIsAuthenticated)
	const configTime = useAppSelector(selectTime)
	const [triggerTimeConfig] = useLazyGetTimeQuery()
	useEffect(() => {
		const getTime = async () => {
			await triggerTimeConfig()
		}
		if (isAuthenticated && configTime === null) {
			getTime()
		}
	}, [isAuthenticated, configTime])
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
