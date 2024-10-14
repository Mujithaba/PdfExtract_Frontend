import { createSlice,PayloadAction } from "@reduxjs/toolkit";
import { stat } from "fs";



const getStoredInfo = ()=>{
    const storeInfo = localStorage.getItem("userInfo");

    try {
        return storeInfo ? JSON.parse(storeInfo):null
    } catch (err) {
        localStorage.removeItem("userInfo");
        return null;
    }
}

const initialState = {
    userInfo:getStoredInfo(),
}

const authSlice = createSlice({
    name:"auth",
    initialState,
    reducers:{
        setCredential:(state,action:PayloadAction<any>)=>{
            (state.userInfo= action.payload),
            localStorage.setItem("userInfo",JSON.stringify(action.payload));
        },
        logOut:(state)=>{
            (state.userInfo=null),
            localStorage.removeItem("userInfo")
        },
    }
})


export const {setCredential,logOut}=authSlice.actions;
export default authSlice.reducer;