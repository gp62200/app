import { createSlice } from "@reduxjs/toolkit";

const initialState={
    coordinates:null,
    error:null
}

const attSlice=createSlice({
    name:"att",
    initialState,
    reducers:{
        punchStart:(state)=>{
            state.error=null;

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

