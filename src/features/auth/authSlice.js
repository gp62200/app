import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';

const initialState={
   user:null,
   loading:false,
   error:null
  
}




const authSlice=createSlice({
    name:'auth',
    initialState,
    reducers:{
        loginStart:(state)=>{
            state.loading=true;
            state.error=null;
        },
        loginSuccess:(state,action)=>{
            console.log(action.payload.user)

            state.loading=false;
            state.user = action.payload.user;
                
        
        },
        loginFailure:(state,action)=>{
            console.log(action.payload)
            
            state.loading=false;
            state.error=action.payload;
        },
        logout: (state) => {
            state.user = null;
            state.loading = false;
            state.error = null;
          },
    }
})


export const{loginStart,loginSuccess,loginFailure,logout}=authSlice.actions;

export default authSlice.reducer