// only installs is @reduxjs/toolkit and react-redux
import { configureStore } from "@reduxjs/toolkit";
import loginReducer from './features/loginSlice';
import connectReducer from './features/connectSlice';


export const store = configureStore({
   reducer: {
      login: loginReducer,
      connect: connectReducer,
   },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;