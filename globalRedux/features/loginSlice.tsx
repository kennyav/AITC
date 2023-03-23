
import { createSlice } from '@reduxjs/toolkit';

export interface LoginState {
   value: boolean;
}

const initialState: LoginState = {
   value: false,
};

export const loginSlice = createSlice({
   name: 'login',
   initialState,
   reducers: {
      toggleState: (state, action) => { 
         state.value = action.payload; },
   },
});


export const { toggleState } = loginSlice.actions;

export default loginSlice.reducer;

