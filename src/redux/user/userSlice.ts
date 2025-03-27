import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
export interface IUserState {
  username: string;
  name: string;
  email: string;
  image: string;
  mobile: string;
  institute?: string;
}

export const userInitialState = {
  username: "",
  name: "",
  email: "",
  image: "",
  mobile: ""
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