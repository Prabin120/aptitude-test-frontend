import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ICodingQuestion {
    code: string;
    language: string;
    questionNo: string;
}

interface CodingState {
    codes: ICodingQuestion[];
}

const initialState: CodingState = {
    codes: [],
};

export const userCodeSlice = createSlice({
    name: "userCode",
    initialState,
    reducers: {
        setUserCodeState: (state, action: PayloadAction<ICodingQuestion>) => {
            const index = state.codes.findIndex(
                (question) => question.questionNo === action.payload.questionNo
            );
            if (index === -1) {
                state.codes.push(action.payload);
            } else {
                state.codes[index] = { ...state.codes[index], ...action.payload };
            }
        },
        clearUserCodeState: (state) => {
            state.codes = [];
        },
    },
});

export const { setUserCodeState, clearUserCodeState } = userCodeSlice.actions;

export const userCodeReducer = userCodeSlice.reducer;