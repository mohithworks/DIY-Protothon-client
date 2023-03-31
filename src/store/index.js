import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from '@reduxjs/toolkit';
import auth from './auth';

import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const rootReducer = (asyncReducers) => (state, action) => {
    const combinedReducer = combineReducers({
        auth,
        ...asyncReducers,
    })
    return combinedReducer(state, action)
}

const pC = { 
    key: 'root',
    storage,
}    

const pR = persistReducer(pC, rootReducer())

export const store = configureStore({
    reducer: pR
});
export const persistor = persistStore(store);