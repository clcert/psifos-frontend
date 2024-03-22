import { createSlice } from "@reduxjs/toolkit";

const boothSlice = createSlice({
  name: "booth",
  initialState: {
    answers: [],
  },
  reducers: {
    setAnswers: (state, action) => {
      state.answers = [...action.payload];
    },
  },
});

export const { setAnswers } = boothSlice.actions;
export default boothSlice.reducer;
