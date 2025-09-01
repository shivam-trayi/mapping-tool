// src/redux/qualification/qualificationSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { getQualifications } from "@/service/qualifications/qualification.service";
import { Qualification } from "@/types/qualicationTypes";

// Pagination type
interface Pagination {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

// Slice state
interface QualificationState {
    items: Qualification[];
    loading: boolean;
    error: string | null;
    pagination: Pagination | null;
}

// Initial state
const initialState: QualificationState = {
    items: [],
    loading: false,
    error: null,
    pagination: null,
};

// Parameters for fetching
interface FetchQualificationsParams {
    page: number;
    limit: number;
}

// Response type from API
interface FetchQualificationsResponse {
    data: Qualification[];
    pagination: Pagination;
}

// Async thunk
export const fetchQualifications = createAsyncThunk<
    FetchQualificationsResponse,
    FetchQualificationsParams,
    { rejectValue: string }
>(
    "qualifications/fetchAll",
    async ({ page, limit }, { rejectWithValue }) => {
        try {
            console.log("📦 Fetching page:", page, "limit:", limit);
            const response = await getQualifications({ page, limit });

            if (response?.data && Array.isArray(response.data.data)) {
                return {
                    data: response.data.data as Qualification[],
                    pagination: response.data.pagination as Pagination,
                };
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
            .addCase(
                fetchQualifications.fulfilled,
                (state, action: PayloadAction<FetchQualificationsResponse>) => {
                    state.items = action.payload.data;
                    state.pagination = action.payload.pagination;
                    state.loading = false;
                }
            )
            .addCase(fetchQualifications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? "Unknown error";
            });
    },
});

export default qualificationSlice.reducer;
