import { createSlice } from "@reduxjs/toolkit";

const electionSlice = createSlice({
  name: "election",
  initialState: {
    actualElection: {},
    elections: [],
  },
  reducers: {
    setElection: (state, action) => {
      state.actualElection = { ...action.payload };
    },
    setElections: (state, action) => {
      state.elections = [...action.payload];
    },
  },
});

export const { setElection, setElections } = electionSlice.actions;
export default electionSlice.reducer;
