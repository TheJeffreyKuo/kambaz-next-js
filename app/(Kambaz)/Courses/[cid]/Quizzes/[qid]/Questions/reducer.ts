import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  questions: [] as any[],
};
const questionsSlice = createSlice({
  name: "questions",
  initialState,
  reducers: {
    setQuestions: (state, { payload }) => { state.questions = payload; },
    addQuestion: (state, { payload }) => { state.questions = [...state.questions, payload]; },
    deleteQuestion: (state, { payload: questionId }) => {
      state.questions = state.questions.filter((q: any) => q._id !== questionId);
    },
    updateQuestion: (state, { payload }) => {
      state.questions = state.questions.map((q: any) => q._id === payload._id ? payload : q);
    },
  },
});
export const { setQuestions, addQuestion, deleteQuestion, updateQuestion } = questionsSlice.actions;
export default questionsSlice.reducer;
