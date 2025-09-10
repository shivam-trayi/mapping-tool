// src/redux/rootReducer.ts
import qualificationSlice from "../slices/testing/qualificationSlice";
import languageSlice from "../slices/testing/languageSlice";
import clientSlice from "../slices/testing/clientSlice";
import questionMappingSlice from "../slices/testing/questionSlice";
import mappingReviewSlice from "../slices/testing/createmMppingReviewSlice";
import selectedMappingSlice from "../slices/testing/selectedMappingSlice";
import answerSlice from "../slices/testing/answerSlice";



const reducer = {
  qualifications: qualificationSlice,
  languages: languageSlice,
  clients: clientSlice,
  questionMappings: questionMappingSlice,
  mappingReview: mappingReviewSlice, // ✅ add reducer
  selectedMapping: selectedMappingSlice,
  answers: answerSlice, // ✅ add here



};

export default reducer;
