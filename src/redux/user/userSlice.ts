import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
export interface IUserState {
  username: string;
  name: string;
  email: string;
  image: string;
  coins: number;
}

export const userInitialState = {
  username: "",
  name: "",
  email: "",
  image: "",
  coins: 0,
}

const initialState: IUserState = userInitialState;

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserState: (state, action: PayloadAction<IUserState>) => {
      return {...state, ...action.payload};
    },
  },
});

export const { setUserState } = userSlice.actions;
export const userReducer = userSlice.reducer;