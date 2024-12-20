import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IAptitudeQuestion {
    questionNo: string;
    answer: number | number[];
    questionKind: string;
}

interface AptitudeState {
    questions: IAptitudeQuestion[];
}

const initialState: AptitudeState = {
    questions: [],
};

export const aptiSlice = createSlice({
    name: "aptiTest",
    initialState,
    reducers: {
        setAptiTestState: (state, action: PayloadAction<IAptitudeQuestion>) => {
            const index = state.questions.findIndex(
                (question) => question.questionNo === action.payload.questionNo
            );
            if (index === -1) {
                state.questions.push(action.payload);
            } else {
                state.questions[index] = { ...state.questions[index], ...action.payload };
            }
        },
        clearAptiTestState: (state) => {
            state.questions = [];
        },
    },
});

export const { setAptiTestState, clearAptiTestState } = aptiSlice.actions;

export const aptitudeReducer = aptiSlice.reducer;
