// src/redux/qualification/qualificationSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getQualifications } from "@/service/qualifications/qualification.service";
import { Qualification } from "@/types/qualicationTypes";

// Slice state type
interface QualificationState {
    items: Qualification[];
    loading: boolean;
    error: string | null;
}

// Initial state
const initialState: QualificationState = {
    items: [],
    loading: false,
    error: null,
};

export const fetchQualifications = createAsyncThunk<
    Qualification[],
    void,
    { rejectValue: string }
>(
    "qualifications/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            const response = await getQualifications();
            if (response && Array.isArray(response.data)) {
                return response.data as Qualification[];
            }

            if (response && Array.isArray(response)) {
                return response as Qualification[];
            }

            if (response?.data?.data && Array.isArray(response.data.data)) {
                return response.data.data as Qualification[];
            }

            throw new Error("Invalid response structure");
        } catch (err) {
            return rejectWithValue("Failed to fetch qualifications");
        }
    }
);


// Slice
const qualificationSlice = createSlice({
    name: "qualifications",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchQualifications.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchQualifications.fulfilled, (state, action) => {
                state.items = action.payload;
                state.loading = false;
            })
            .addCase(fetchQualifications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? "Unknown error";
            });
    },
});

export default qualificationSlice.reducer;
