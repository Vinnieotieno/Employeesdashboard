import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    userInfo: localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')): null,
    newMessages: {},
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers:{
        setCredentials: (state, action) =>{
            state.userInfo = action.payload;
            localStorage.setItem('userInfo', JSON.stringify(action.payload))
        },
        logout: (state, action) =>{
            state.userInfo = null;
            localStorage.removeItem('userInfo')
        },
        addNotification: (state, {payload}) =>{
            if(state.newMessages[payload]){
                state.newMessages[payload] = state.newMessages[payload] + 1
            }else{
                state.newMessages[payload] = 1;
            }
        },
        resetNotification: (state, {payload}) =>{
            delete state.newMessages[payload]
        }
    }
})

export const {setCredentials, logout, addNotification, resetNotification} = authSlice.actions;

export default authSlice.reducer