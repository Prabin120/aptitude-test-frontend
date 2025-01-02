import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
export interface IUserState {
  id: string;
  name: string;
  email: string;
  image: string;
  mobile: string;
  institute?: string;
}

export const userInitialState = {
  id: "",
  name: "",
  email: "",
  image: "",
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