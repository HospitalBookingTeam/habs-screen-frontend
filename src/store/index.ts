import { combineReducers, configureStore } from '@reduxjs/toolkit'
import storage from 'redux-persist/es/storage'
import authReducer from './auth/slice'
import configReducer from './config/slice'
import {
	persistStore,
	persistReducer,
	FLUSH,
	REHYDRATE,
	PAUSE,
	PERSIST,
	PURGE,
	REGISTER,
} from 'redux-persist'
import { api } from '@/store/api'
import { doctorApi } from '@/store/doctorApi'
import { setupListeners } from '@reduxjs/toolkit/dist/query'
import { rtkQueryErrorLogger } from './middleware/apiListener'
import { queueApi } from './queue/api'

const persistConfig = {
	key: 'root',
	storage,
	whitelist: ['auth'],
}

const rootReducer = combineReducers({
	[api.reducerPath]: api.reducer,
	[doctorApi.reducerPath]: doctorApi.reducer,
	[queueApi.reducerPath]: queueApi.reducer,
	auth: authReducer,
	config: configReducer,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
	reducer: persistedReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
			},
		}).concat(
			api.middleware,
			queueApi.middleware,
			doctorApi.middleware,
			rtkQueryErrorLogger
		),
})

setupListeners(store.dispatch)
export const persistor = persistStore(store)

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
