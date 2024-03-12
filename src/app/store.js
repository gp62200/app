import {configureStore} from '@reduxjs/toolkit';
import authReducer from "../features/auth/authSlice"
import attReducer from "../features/att/attSlice"
export const store=configureStore({
    reducer:{
        auth:authReducer,
        att:attReducer
    },
})