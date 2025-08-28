import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { testApi } from "../../../service/testing/testing.service";

// Async thunk
export const callTestApi = createAsyncThunk("testApi/call", async (_, { rejectWithValue }) => {
  try {
    const response: any = await testApi();
    return response;
  } catch (error: any) {
    return rejectWithValue(error.message || "Something went wrong");
  }
});

interface TestApiState {
  loading: boolean;
  error: string | null;
  data: any;
}

const initialState: TestApiState = {
  loading: false,
  error: null,
  data: null,
};

const testApiSlice = createSlice({
  name: "testApi",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(callTestApi.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(callTestApi.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(callTestApi.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { reducer } = testApiSlice;
export default reducer;
