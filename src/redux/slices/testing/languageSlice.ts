// src/redux/slices/testing/languageSlice.ts
import { getLanguages } from "@/service/qualifications/language.service";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

export interface Language {
  id: string;
  name: string;
}

interface LanguageState {
  items: Language[];
  loading: boolean;
  error: string | null;
}

const initialState: LanguageState = {
  items: [],
  loading: false,
  error: null,
};

// Async thunk
export const fetchLanguages = createAsyncThunk<
  Language[],   // return type
  void,         // argument type
  { rejectValue: string }
>(
  "languages/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getLanguages();

      // assume response format -> { data: [{ id, name }, ...] }
      if (response?.data && Array.isArray(response.data)) {
        return response.data as Language[];
      }

      throw new Error("Invalid response structure");
    } catch (err) {
      return rejectWithValue("Failed to fetch languages");
    }
  }
);

const languageSlice = createSlice({
  name: "languages",
  initialState,
  reducers: {
    resetLanguagesState: (state) => {
      state.items = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLanguages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLanguages.fulfilled, (state, action: PayloadAction<Language[]>) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchLanguages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Unknown error";
      });
  },
});

export const { resetLanguagesState } = languageSlice.actions;
export default languageSlice.reducer;
