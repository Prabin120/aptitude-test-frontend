import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
export interface IUserState {
  name: string;
  email: string;
  avatarUrl: string;
  mobile: string;
  institute?: string;
}

export const userInitialState = {
  name: "",
  email: "",
  avatarUrl: "",
  mobile: "",
  institute: "",
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