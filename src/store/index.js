// store.js
import { configureStore } from "@reduxjs/toolkit";
import electionReducer from "./slices/electionSlice";
import boothReducer from "./slices/boothSlice";
import userReducer from "./slices/userSlice";

const store = configureStore({
  reducer: {
    election: electionReducer,
    booth: boothReducer,
    user: userReducer,
  },
});

export default store;
