import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios";

/*
  Note: reqres API is a demo. POST/PUT/DELETE return success but do not persist.
  We update local Redux state so UI shows expected behavior.
*/

export const fetchUsers = createAsyncThunk(
  "users/fetch",
  async (page = 1, { rejectWithValue }) => {
    try {
      const res = await api.get(`/users?page=${page}`);
      return res.data; // contains data, page, total_pages, per_page, etc.
    } catch (err) {
      return rejectWithValue(err.message || "Failed to load users");
    }
  }
);

export const createUser = createAsyncThunk(
  "users/create",
  async (body, { rejectWithValue }) => {
    try {
      const res = await api.post("/users", body);
      // reqres returns created object with id and createdAt; for UI we combine body + id
      return { id: res.data.id || Date.now(), ...body };
    } catch (err) {
      return rejectWithValue(err.message || "Create failed");
    }
  }
);

export const updateUser = createAsyncThunk(
  "users/update",
  async ({ id, body }, { rejectWithValue }) => {
    try {
      await api.put(`/users/${id}`, body);
      return { id, ...body };
    } catch (err) {
      return rejectWithValue(err.message || "Update failed");
    }
  }
);

export const deleteUser = createAsyncThunk(
  "users/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/users/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.message || "Delete failed");
    }
  }
);

const slice = createSlice({
  name: "users",
  initialState: {
    data: [],
    page: 1,
    totalPages: 1,
    perPage: 6,
    total: 0,
    loading: false,
    error: null,
  },
  reducers: {
    // local helper to set page (optional)
    setPage(state, action) {
      state.page = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchUsers.fulfilled, (s, a) => {
        s.loading = false;
        s.data = a.payload.data || [];
        s.page = a.payload.page || 1;
        s.perPage = a.payload.per_page || s.perPage;
        s.totalPages = a.payload.total_pages || 1;
        s.total = a.payload.total || s.data.length;
      })
      .addCase(fetchUsers.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      })

      .addCase(createUser.fulfilled, (s, a) => {
        s.data.unshift(a.payload); // put new user on top
        s.total += 1;
      })

      .addCase(updateUser.fulfilled, (s, a) => {
        const idx = s.data.findIndex((u) => u.id == a.payload.id);
        if (idx >= 0) s.data[idx] = a.payload;
      })

      .addCase(deleteUser.fulfilled, (s, a) => {
        s.data = s.data.filter((u) => u.id !== a.payload);
        s.total = Math.max(0, s.total - 1);
      });
  },
});

export const { setPage } = slice.actions;
export default slice.reducer;