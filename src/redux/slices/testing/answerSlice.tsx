import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getOptionQueryReviewMapping,
  insertAnswerMappingReviewApi,
  OptionReviewParams,
  updateAnswerMappingApi,
  UpdateAnswerPayload,
} from "@/service/answers/answer.Service";

// Thunk for inserting mapping
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

// Thunk for updating mapping
export const updateAnswerMapping = createAsyncThunk(
  "answers/updateAnswerMapping",
  async (payload: UpdateAnswerPayload, { rejectWithValue }) => {
    try {
      const response = await updateAnswerMappingApi(payload);
      return response;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Failed to update answer mapping");
    }
  }
);


export const fetchOptionReview = createAsyncThunk(
  "answers/fetchOptionReview",
  async (params: OptionReviewParams, { rejectWithValue }) => {
    try {
      return await getOptionQueryReviewMapping(params);
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Failed to fetch review mapping");
    }
  }
);

interface AnswerState {
  loadingInsert: boolean;
  loadingUpdate: boolean;
  successInsert: boolean;
  successUpdate: boolean;
  errorInsert: string | null;
  errorUpdate: string | null;
}

const initialState: AnswerState = {
  loadingInsert: false,
  loadingUpdate: false,
  successInsert: false,
  successUpdate: false,
  errorInsert: null,
  errorUpdate: null,
};

const answerSlice = createSlice({
  name: "answers",
  initialState,
  reducers: {
    resetInsertState: (state) => {
      state.loadingInsert = false;
      state.successInsert = false;
      state.errorInsert = null;
    },
    resetUpdateState: (state) => {
      state.loadingUpdate = false;
      state.successUpdate = false;
      state.errorUpdate = null;
    },
  },
  extraReducers: (builder) => {
    // Insert Mapping
    builder
      .addCase(insertAnswerMapping.pending, (state) => {
        state.loadingInsert = true;
        state.successInsert = false;
        state.errorInsert = null;
      })
      .addCase(insertAnswerMapping.fulfilled, (state) => {
        state.loadingInsert = false;
        state.successInsert = true;
        state.errorInsert = null;
      })
      .addCase(insertAnswerMapping.rejected, (state, action) => {
        state.loadingInsert = false;
        state.successInsert = false;
        state.errorInsert = action.payload as string;
      });

    // Update Mapping
    builder
      .addCase(updateAnswerMapping.pending, (state) => {
        state.loadingUpdate = true;
        state.successUpdate = false;
        state.errorUpdate = null;
      })
      .addCase(updateAnswerMapping.fulfilled, (state) => {
        state.loadingUpdate = false;
        state.successUpdate = true;
        state.errorUpdate = null;
      })
      .addCase(updateAnswerMapping.rejected, (state, action) => {
        state.loadingUpdate = false;
        state.successUpdate = false;
        state.errorUpdate = action.payload as string;
      });
  },
});

export const { resetInsertState, resetUpdateState } = answerSlice.actions;
export default answerSlice.reducer;
