import {
  insertMappingReview,
  updateConstantQuestionReviewMapping,
} from "@/service/questions/questions.service";
import {
  MappingReviewPayload,
  MappingReviewResponse,
} from "@/types/qualicationTypes";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

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

// ✅ Insert thunk
export const insertMappingReviewThunk = createAsyncThunk<
  MappingReviewResponse, // return type
  MappingReviewPayload,  // payload type
  { rejectValue: string } // reject type
>(
  "mappingReview/insert",
  async (payload, { rejectWithValue }) => {
    try {
      return await insertMappingReview(payload);
    } catch (err: unknown) {
      if (err instanceof Error) {
        return rejectWithValue(err.message);
      }
      return rejectWithValue("Insert failed");
    }
  }
);

// ✅ Update thunk
export const updateMappingReviewThunk = createAsyncThunk<
  MappingReviewResponse, // return type
  MappingReviewPayload,  // payload type
  { rejectValue: string } // reject type
>(
  "mappingReview/update",
  async (payload, { rejectWithValue }) => {
    try {
      // Ensure memberQuestionId is present for each optionData item
      const fixedPayload = {
        ...payload,
        optionData: payload.optionData
          .filter(item => typeof item.memberQuestionId === "number")
          .map(item => ({
            questionId: item.questionId,
            qualificationId: item.qualificationId,
            memberQuestionId: item.memberQuestionId as number,
          })),
      };
      return await updateConstantQuestionReviewMapping(fixedPayload);
    } catch (err: unknown) {
      if (err instanceof Error) {
        return rejectWithValue(err.message);
      }
      return rejectWithValue("Update failed");
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
      // INSERT
      .addCase(insertMappingReviewThunk.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(
        insertMappingReviewThunk.fulfilled,
        (state, action: PayloadAction<MappingReviewResponse>) => {
          state.loading = false;
          state.success = action.payload.success;
          state.error = null;
        }
      )
      .addCase(
        insertMappingReviewThunk.rejected,
        (state, action) => {
          state.loading = false;
          state.success = false;
          state.error = action.payload || "Insert failed";
        }
      )

      // UPDATE
      .addCase(updateMappingReviewThunk.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(
        updateMappingReviewThunk.fulfilled,
        (state, action: PayloadAction<MappingReviewResponse>) => {
          state.loading = false;
          state.success = action.payload.success;
          state.error = null;
        }
      )
      .addCase(
        updateMappingReviewThunk.rejected,
        (state, action) => {
          state.loading = false;
          state.success = false;
          state.error = action.payload || "Update failed";
        }
      );
  },
});

export const { resetReviewState } = mappingReviewSlice.actions;
export default mappingReviewSlice.reducer;
