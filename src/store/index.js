// store.js
import { configureStore } from "@reduxjs/toolkit";
import electionReducer from "./slices/electionSlice";
import boothReducer from "./slices/boothSlice";

const store = configureStore({
  reducer: {
    election: electionReducer,
    booth: boothReducer,
  },
});

export default store;
