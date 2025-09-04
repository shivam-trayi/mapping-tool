// import { getClients } from "@/service/qualifications/qualification.service";
// import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

// // Client type
// export interface Client {
//   id: string;
//   name: string;
// }

// interface ClientState {
//   items: Client[];
//   loading: boolean;
//   error: string | null;
// }

// const initialState: ClientState = {
//   items: [],
//   loading: false,
//   error: null,
// };

// // Async thunk
// export const fetchClients = createAsyncThunk<
//   Client[],
//   void,
//   { rejectValue: string }
// >(
//   "clients/fetchAll",
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await getClients();

//       // assume backend -> { data: [{ id, name }, ...] }
//       if (response?.data && Array.isArray(response.data)) {
//         return response.data as Client[];
//       }

//       throw new Error("Invalid response structure");
//     } catch (err) {
//       return rejectWithValue("Failed to fetch clients");
//     }
//   }
// );

// const clientSlice = createSlice({
//   name: "clients",
//   initialState,
//   reducers: {
//     resetClientsState: (state) => {
//       state.items = [];
//       state.loading = false;
//       state.error = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchClients.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchClients.fulfilled, (state, action: PayloadAction<Client[]>) => {
//         state.loading = false;
//         state.items = action.payload;
//       })
//       .addCase(fetchClients.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload ?? "Unknown error";
//       });
//   },
// });

// export const { resetClientsState } = clientSlice.actions;
// export default clientSlice.reducer;

// src/redux/slices/testing/clientSlice.ts
import { getClients } from "@/service/qualifications/qualification.service";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

// Client type
export interface Client {
  id: string;
  name: string;
}

interface ClientState {
  items: Client[];
  loading: boolean;
  error: string | null;
  selectedClient: string | null;   // 👈 add selected client
}

const initialState: ClientState = {
  items: [],
  loading: false,
  error: null,
  selectedClient: null,
};

// Async thunk
export const fetchClients = createAsyncThunk<
  Client[],
  void,
  { rejectValue: string }
>(
  "clients/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getClients();

      // assume backend -> { data: [{ id, name }, ...] }
      if (response?.data && Array.isArray(response.data)) {
        return response.data as Client[];
      }

      throw new Error("Invalid response structure");
    } catch (err) {
      return rejectWithValue("Failed to fetch clients");
    }
  }
);

const clientSlice = createSlice({
  name: "clients",
  initialState,
  reducers: {
    resetClientsState: (state) => {
      state.items = [];
      state.loading = false;
      state.error = null;
      state.selectedClient = null;  // 👈 reset selected
    },
    setSelectedClient: (state, action: PayloadAction<string | null>) => {
      state.selectedClient = action.payload; // 👈 set selected client
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchClients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClients.fulfilled, (state, action: PayloadAction<Client[]>) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchClients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Unknown error";
      });
  },
});

export const { resetClientsState, setSelectedClient } = clientSlice.actions;
export default clientSlice.reducer;
