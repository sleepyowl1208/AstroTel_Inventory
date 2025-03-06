import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface AuthState {
    user: { email: string | null; role: string | null; name: string | null };
    token: string | null;
    isAuthenticated: boolean;
}

const initialState: AuthState = {
    user: { 
        email: null, 
        role: localStorage.getItem("role") || null,  
        name: localStorage.getItem("name") || null,  // ✅ Retrieve name from localStorage
    },
    token: localStorage.getItem("token") || null,
    isAuthenticated: !!localStorage.getItem("token"),
};

const BASE_URL = "http://127.0.0.1:8000";

// ✅ Async thunk for login
export const loginUser = createAsyncThunk(
    "auth/loginUser",
    async (credentials: { email: string; password: string }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${BASE_URL}/auth/login`, credentials);
            console.log("response.data:", response.data);
            return response.data;  // ✅ Now contains { email, token, role, name }
        } catch (error: unknown) {  
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data || "Login failed");
            }
            return rejectWithValue("An unexpected error occurred");
        }
    }
);

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        loginSuccess: (state, action: PayloadAction<{ email: string; token: string; role: string; name: string }>) => {
            state.user.email = action.payload.email;
            state.user.role = action.payload.role;
            state.user.name = action.payload.name;  // ✅ Store name in Redux state
            state.token = action.payload.token;
            state.isAuthenticated = true;

            localStorage.setItem("token", action.payload.token);
            localStorage.setItem("role", action.payload.role);
            localStorage.setItem("name", action.payload.name);  // ✅ Store name in localStorage
        },
        logout: (state) => {
            state.user.email = null;
            state.user.role = null;
            state.user.name = null;  // ✅ Clear name on logout
            state.token = null;
            state.isAuthenticated = false;

            localStorage.removeItem("token");
            localStorage.removeItem("role");
            localStorage.removeItem("name");  // ✅ Remove name from localStorage
        }
    },
    extraReducers: (builder) => {
        builder.addCase(loginUser.fulfilled, (state, action: PayloadAction<{ email: string; token: string; role: string; name: string }>) => {
            state.user.email = action.payload.email;
            state.user.role = action.payload.role;
            state.user.name = action.payload.name;  // ✅ Store name in Redux state
            state.token = action.payload.token;
            state.isAuthenticated = true;

            localStorage.setItem("token", action.payload.token);
            localStorage.setItem("role", action.payload.role);
            localStorage.setItem("name", action.payload.name);  // ✅ Store name in localStorage
        });
    }
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
