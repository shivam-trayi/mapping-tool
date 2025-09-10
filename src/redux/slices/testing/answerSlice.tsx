import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  insertAnswerMappingReviewApi,
} from "@/service/answers/answer.Service";

// Thunk for API call
export const insertAnswerMapping = createAsyncThunk(
  "answers/insertAnswerMapping",
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = await insertAnswerMappingReviewApi(payload);
      return response;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Something went wrong");
    }
  }
);


interface AnswerState {
  loading: boolean;
  success: boolean;
  error: string | null;
}

const initialState: AnswerState = {
  loading: false,
  success: false,
  error: null,
};

const answerSlice = createSlice({
  name: "answers",
  initialState,
  reducers: {
    resetAnswerState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(insertAnswerMapping.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(insertAnswerMapping.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.error = null;
      })
      .addCase(insertAnswerMapping.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetAnswerState } = answerSlice.actions;
export default answerSlice.reducer;
