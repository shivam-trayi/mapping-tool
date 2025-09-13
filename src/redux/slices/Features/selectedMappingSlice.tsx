import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SelectedMappingState {
  lang: number | null;
  client: number | null;
}

const initialState: SelectedMappingState = {
  lang: null,
  client: null,
};

const selectedMappingSlice = createSlice({
  name: "selectedMapping",
  initialState,
  reducers: {
    setLang: (state, action: PayloadAction<number | null>) => {
      state.lang = action.payload;
    },
    setClient: (state, action: PayloadAction<number | null>) => {
      state.client = action.payload;
    },
    resetMapping: (state) => {
      state.lang = null;
      state.client = null;
    },
  },
});

export const { setLang, setClient, resetMapping } = selectedMappingSlice.actions;
export default selectedMappingSlice.reducer;
