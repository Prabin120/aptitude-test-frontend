import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ICodingQuestion {
    questionNo: string;
    code: string;
    language: string;
    passedTestCases: number;
    totalTestCases: number;
    questionKind: string;
}

// Initial state for coding questions
interface CodingState {
    questions: ICodingQuestion[];
}

const initialState: CodingState = {
    questions: [],
};

export const codeSlice = createSlice({
    name: "codeTest",
    initialState,
    reducers: {
        setCodingTestState: (state, action: PayloadAction<ICodingQuestion>) => {
            const index = state.questions.findIndex(
                (question) => question.questionNo === action.payload.questionNo
            );
            if (index === -1) {
                state.questions.push(action.payload);
            } else {
                state.questions[index] = { ...state.questions[index], ...action.payload };
            }
        },
        clearCodingTestState: (state) => {
            state.questions = [];
        },
    },
});

// Export actions
export const { setCodingTestState, clearCodingTestState } = codeSlice.actions;

export const codingTestReducer = codeSlice.reducer;