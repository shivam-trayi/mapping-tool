import { insertMappingReview } from "@/service/questions/questions.service";
import { MappingReviewPayload } from "@/types/qualicationTypes";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

interface MappingReviewState {
  loading: boolean;
  success: boolean;
  error: string | null;
}

const initialState: MappingReviewState = {
  loading: false,
  success: false,
  error: null,
};

export const insertMappingReviewThunk = createAsyncThunk(
  "mappingReview/insert",
  async (payload: MappingReviewPayload, { rejectWithValue }) => {
    try {
      return await insertMappingReview(payload);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Insert failed");
    }
  }
);

const mappingReviewSlice = createSlice({
  name: "mappingReview",
  initialState,
  reducers: {
    resetReviewState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(insertMappingReviewThunk.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(insertMappingReviewThunk.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(insertMappingReviewThunk.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetReviewState } = mappingReviewSlice.actions;
export default mappingReviewSlice.reducer;
