import { combineReducers } from '@reduxjs/toolkit'
import session from './sessionslice'
import user from './userslice'

const reducer = combineReducers({
    session,
    user
})

export default reducer