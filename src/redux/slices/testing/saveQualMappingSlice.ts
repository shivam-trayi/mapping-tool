import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { saveQualMappings, getQualMappings, saveQualMappingReview } from "@/service/qualifications/qualification.service";
import { QualificationsMappingData } from "@/types/qualicationTypes";

interface QualificationState {
  loading: boolean;
  error: string | null;
}

const initialState: QualificationState = {
  loading: false,
  error: null,
};

// Async thunk
export const saveQualMapping = createAsyncThunk<void, QualificationsMappingData[], { rejectValue: string }>(
  "qualifications/saveQualMapping",
  async (bodyData, { rejectWithValue }) => {
    try {
      await saveQualMappings(bodyData);
    } catch (err) {
      return rejectWithValue("Failed to save qualifications");
    }
  }
);


export const getAllQualMapping = createAsyncThunk<
  unknown, // Type of returned data from API
  { memberId: string }, // argument type
  { rejectValue: string }
>(
  "qualifications/getQualificationDemographicsMappingReview",
  async (queryData, { rejectWithValue }) => {
    try {
      const response = await getQualMappings(queryData); // call API
      return response; // <-- return it!
    } catch (err) {
      return rejectWithValue("Failed to fetch qualifications");
    }
  }
);

export const saveQualMappingReviewData = createAsyncThunk<void, QualificationsMappingData[], { rejectValue: string }>(
  "qualifications/saveQualMapping",
  async (bodyData, { rejectWithValue }) => {
    try {
      await saveQualMappingReview(bodyData);
    } catch (err) {
      return rejectWithValue("Failed to save qualifications");
    }
  }
);


const saveQualMappingSlice = createSlice({
  name: "qualifications",
  initialState,
  reducers: {
    resetQualificationState: (state) => {
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(saveQualMapping.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveQualMapping.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(saveQualMapping.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Unknown error";
      });
  },
});

export const { resetQualificationState } = saveQualMappingSlice.actions;
export default saveQualMappingSlice.reducer;
