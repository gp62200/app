import { createSlice } from "@reduxjs/toolkit";

const initialState={
    coordinates:null,
    err:null
}

const attSlice=createSlice({
    name:"att",
    initialState,
    reducer:{
        punchStart:(state)=>{
            state.error=null

        },
        punchSuccess:(state,action)=>{
            state.coordinates=action.payload.coordinates

        },
        punchFailure:(state,action)=>{

            state.error=action.payload

        }

    }
})

export const{punchStart,punchSuccess,punchFailure}=attSlice.actions;

export default attSlice.reducer