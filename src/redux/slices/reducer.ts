// src/redux/rootReducer.ts
import qualificationSlice from "../slices/testing/qualificationSlice";
import languageSlice from "../slices/testing/languageSlice";
import clientSlice from "../slices/testing/clientSlice";



const reducer = {
  qualifications: qualificationSlice,
   languages: languageSlice,
   clients: clientSlice, 
};

export default reducer;
