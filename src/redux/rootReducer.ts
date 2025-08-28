// rootReducer.ts
import { combineReducers } from 'redux';
import storage from 'redux-persist/lib/storage';
import reducer from './slices/reducer';

// Root persist configuration
const rootPersistConfig = {
	key: 'root',
	storage,
	keyPrefix: 'redux-',
};
// Combining reducers
const rootReducer = combineReducers({
	...reducer,
	// other reducers can be added here
});

export type RootState = ReturnType<typeof rootReducer>;
export { rootPersistConfig, rootReducer };
