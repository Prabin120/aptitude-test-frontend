import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface ICodingQuestion {
  code: string
  language: string
  questionNo: string
  type: string
}

interface CodingState {
  codes: {
    [type: string]: {
      [questionNo: string]: {
        [language: string]: string
      }
    }
  }
}

const initialState: CodingState = {
  codes: {},
}

export const userCodeSlice = createSlice({
  name: "userCode",
  initialState,
  reducers: {
    setUserCodeState: (state, action: PayloadAction<ICodingQuestion>) => {
      const { type, questionNo, language, code } = action.payload
      state.codes = {
        ...state.codes,
        [type]: {
          ...state.codes[type],
          [questionNo]: {
            ...state.codes[type]?.[questionNo],
            [language]: code,
          },
        },
      }
    },
    clearUserCodeState: (state) => {
      state.codes = {}
    },
  },
})

export const { setUserCodeState, clearUserCodeState } = userCodeSlice.actions

export const userCodeReducer = userCodeSlice.reducer

