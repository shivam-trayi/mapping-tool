import {
    getAllOptionText,
    getQuestionMappings,
    getQuestionReviewMappings,
    QuestionMappingItem,
    updateQuestionReviewMapping,
    updateOptions,
} from "@/service/questions/questions.service";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

interface QuestionMappingState {
    items: QuestionMappingItem[];
    reviewItems: QuestionMappingItem[];
    loading: boolean;
    error: string | null;
}

const initialState: QuestionMappingState = {
    items: [],
    reviewItems: [],
    loading: false,
    error: null,
};

interface FetchParams {
    memberType: string;
    memberId: number;
    langCode: number;
}

interface AnswerFetchParams {
  memberType: string;
  memberId: number;
  marketId: number;
  langCode: number;
  questionId: number;
}



interface QuestionMappingState {
    items: QuestionMappingItem[];
    reviewItems: QuestionMappingItem[];
    loading: boolean;
    error: string | null;
}

interface SaveReviewParams {
    memberType: string;
    memberId: string;
    optionData: {
        memberQuestionId: string;
        masterDemoId: number;
        masterQueryId: number;
    }[];
}


// ✅ existing thunk
export const fetchQuestionMappings = createAsyncThunk<
    QuestionMappingItem[],
    FetchParams,
    { rejectValue: string }
>("questionMappings/fetch", async ({ memberType, memberId, langCode }, { rejectWithValue }) => {
    try {
        const response = await getQuestionMappings({ memberType, memberId, langCode });
        if (response.success && response.data?.data) {
            return response.data.data;
        }
        return rejectWithValue("Failed to fetch question mappings");
    } catch {
        return rejectWithValue("Failed to fetch question mappings");
    }
});

// ✅ new thunk for review mapping
export const fetchQuestionReviewMappings = createAsyncThunk<
    QuestionMappingItem[],
    FetchParams,
    { rejectValue: string }
>("questionMappings/fetchReview", async ({ memberType, memberId, langCode }, { rejectWithValue }) => {
    try {
        const response = await getQuestionReviewMappings({ memberType, memberId, langCode });
        if (response.success && response.data?.data) {
            return response.data.data;
        }
        return rejectWithValue("Failed to fetch question review mappings");
    } catch {
        return rejectWithValue("Failed to fetch question review mappings");
    }
});


// ✅ New thunk for Save for Review
export const saveQuestionReviewMapping = createAsyncThunk<
  any,
  SaveReviewParams,
  { rejectValue: string }
>("questionMappings/saveReview", async (payload, { rejectWithValue }) => {
  try {
    const response = await updateQuestionReviewMapping(payload); // 👈 bodyData pass करो
    if (response.success) return response;
    return rejectWithValue("Failed to save review mapping");
  } catch (err) {
    return rejectWithValue("Failed to save review mapping");
  }
});

export const getAllAnswersList = createAsyncThunk<
  QuestionMappingItem[],
  AnswerFetchParams,
  { rejectValue: string }
>(
  "questionMappings/fetch",
  async ({ memberType, memberId, marketId, langCode, questionId }, { rejectWithValue }) => {
    try {
      const response = await getAllOptionText({
        memberType,
        memberId,
        marketId,
        langCode,
        questionId,
      });

      if (response.success && response.data?.data) {
        return response.data.data;
      }
      return rejectWithValue("Failed to fetch answers");
    } catch {
      return rejectWithValue("Failed to fetch answers");
    }
  }
);


// ✅ Thunk for updateOptions
export const updateOptionsThunk = createAsyncThunk<
  any,
  {
    qualificationId: number;
    questionId: number;
    memberId: number;
    langCode: number;
    options: { answerId: number; constantId: string }[];
  },
  { rejectValue: string }
>("questionMappings/updateOptions", async (payload, { rejectWithValue }) => {
  try {
    const response = await updateOptions(payload);
    if (response.success) return response;
    return rejectWithValue("Failed to update options");
  } catch (err) {
    return rejectWithValue("Failed to update options");
  }
});



const questionMappingSlice = createSlice({
    name: "questionMappings",
    initialState,
    reducers: {
        resetQuestionMappings: (state) => {
            state.items = [];
            state.reviewItems = [];
            state.loading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // normal mappings
            .addCase(fetchQuestionMappings.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchQuestionMappings.fulfilled, (state, action: PayloadAction<QuestionMappingItem[]>) => {
                state.items = action.payload;
                state.loading = false;
            })
            .addCase(fetchQuestionMappings.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? "Unknown error";
            })

            // review mappings
            .addCase(fetchQuestionReviewMappings.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchQuestionReviewMappings.fulfilled, (state, action: PayloadAction<QuestionMappingItem[]>) => {
                state.reviewItems = action.payload;
                state.loading = false;
            })
            .addCase(fetchQuestionReviewMappings.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? "Unknown error";
            })
            // handle save review
            .addCase(saveQuestionReviewMapping.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(saveQuestionReviewMapping.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(saveQuestionReviewMapping.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? "Unknown error";
            });
    },
});

export const { resetQuestionMappings } = questionMappingSlice.actions;
export default questionMappingSlice.reducer;
