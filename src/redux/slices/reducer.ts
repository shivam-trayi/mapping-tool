// src/redux/rootReducer.ts
import qualificationSlice from "./Features/qualificationSlice";
import languageSlice from "./Features/languageSlice";
import clientSlice from "./Features/clientSlice";
import questionMappingSlice from "./Features/questionSlice";
import mappingReviewSlice from "./Features/createmMppingReviewSlice";
import selectedMappingSlice from "./Features/selectedMappingSlice";
import answerSlice from "./Features/answerSlice";
import optionMappingReviewSlice from "./Features/optionMappingReviewSlice";


const reducer = {
  qualifications: qualificationSlice,
  languages: languageSlice,
  clients: clientSlice,
  questionMappings: questionMappingSlice,
  mappingReview: mappingReviewSlice, 
  selectedMapping: selectedMappingSlice,
  answers: answerSlice, 
  optionMappingReview: optionMappingReviewSlice, 

};

export default reducer;
