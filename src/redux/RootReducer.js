import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

import TimerAndCheckInUserReducer from './reducers/TimerAndCheckInUser'
import CurrentUserReducer from './reducers/CurrentUserReducer'

const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    whitelist: [
        'current_user',
        'timer_checkin',
    ],
};
const rootReducer = combineReducers({
    current_user: CurrentUserReducer,
    timer_checkin: TimerAndCheckInUserReducer,
});
export default persistReducer(persistConfig, rootReducer);
