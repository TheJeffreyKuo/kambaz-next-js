import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  quizzes: [] as any[],
  draft: null as any,
};
const quizzesSlice = createSlice({
  name: "quizzes",
  initialState,
  reducers: {
    setQuizzes: (state, { payload: quizzes }) => {
      state.quizzes = quizzes;
    },
    addQuiz: (state, { payload: quiz }) => {
      state.quizzes = [...state.quizzes, quiz] as any;
    },
    deleteQuiz: (state, { payload: quizId }) => {
      state.quizzes = state.quizzes.filter(
        (q: any) => q._id !== quizId
      );
    },
    updateQuiz: (state, { payload: quiz }) => {
      state.quizzes = state.quizzes.map((q: any) =>
        q._id === quiz._id ? { ...q, ...quiz } : q
      ) as any;
    },
    setDraft: (state, { payload }) => {
      state.draft = payload;
    },
    updateDraft: (state, { payload }) => {
      state.draft = state.draft ? { ...state.draft, ...payload } : payload;
    },
    clearDraft: (state) => {
      state.draft = null;
    },
  },
});
export const {
  addQuiz, deleteQuiz, updateQuiz, setQuizzes,
  setDraft, updateDraft, clearDraft,
} = quizzesSlice.actions;
export default quizzesSlice.reducer;
