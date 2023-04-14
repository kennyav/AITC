
import { createSlice } from '@reduxjs/toolkit';

export interface ConnectState {
   value: boolean;
}

const initialState: ConnectState = {
   value: false,
};

export const connectSlice = createSlice({
   name: 'connect',
   initialState,
   reducers: {
      toggleConnectState: (state, action) => { 
         state.value = action.payload;
         console.log("Connect authenticated? ...", state.value) },
   },
});


export const { toggleConnectState } = connectSlice.actions;

export default connectSlice.reducer;

