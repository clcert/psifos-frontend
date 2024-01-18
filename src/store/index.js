// store.js
import { configureStore } from "@reduxjs/toolkit";
import electionReducer from "./slices/electionSlice";

const store = configureStore({
  reducer: {
    election: electionReducer,
  },
});

export default store;
