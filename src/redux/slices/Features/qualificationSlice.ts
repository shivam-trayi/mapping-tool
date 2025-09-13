// src/redux/slices/testing/qualificationSlice.ts
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
    search?: string;
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
    async ({ page, limit, search }, { rejectWithValue }) => {
        try {
            const response = await getQualifications({ page, limit, search });

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
    reducers: {
        // Optional: Reset state
        resetQualificationsState: (state) => {
            state.items = [];
            state.loading = false;
            state.error = null;
            state.pagination = null;
        },
    },
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

export const { resetQualificationsState } = qualificationSlice.actions;
export default qualificationSlice.reducer;
