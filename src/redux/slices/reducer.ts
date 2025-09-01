// src/redux/rootReducer.ts
import testApiSlice from "./testing/testApiSlice";
import qualificationSlice from "../slices/testing/qualificationSlice";

console.log("🔵 [RootReducer] Initializing reducers...");

const reducer = {
  testApi: testApiSlice,
  qualifications: qualificationSlice,
};

export default reducer;
