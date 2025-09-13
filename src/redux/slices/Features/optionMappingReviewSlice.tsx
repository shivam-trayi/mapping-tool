// src/redux/slices/testing/optionMappingReviewSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { OptionReviewParams, getOptionQueryReviewMapping } from "@/service/answers/answer.Service";

interface OptionReviewState {
    items: any[];
    loading: boolean;
    error: string | null;
}

const initialState: OptionReviewState = {
    items: [],
    loading: false,
    error: null,
};

export const fetchOptionReviewMapping = createAsyncThunk(
    "optionMappingReview/fetchOptionReviewMapping",
    async (params: OptionReviewParams, { rejectWithValue }) => {
        try {
            const data = await getOptionQueryReviewMapping(params);
            return data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

const optionMappingReviewSlice = createSlice({
    name: "optionMappingReview",
    initialState,
    reducers: {
        resetOptionMappingReview: (state) => {
            state.items = [];
            state.loading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchOptionReviewMapping.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOptionReviewMapping.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchOptionReviewMapping.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { resetOptionMappingReview } = optionMappingReviewSlice.actions;
export default optionMappingReviewSlice.reducer;
