import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

const BASE_URL = "http://127.0.0.1:8000";

// Create Axios instance
const api = axios.create({
    baseURL: BASE_URL,
});

// 🚀 Login Function: Stores Token
export const loginUser = async (email: string, password: string): Promise<unknown> => {
    try {
        const response = await axios.post(
            `${BASE_URL}/auth/login`,
            { email, password },
            { headers: { "Content-Type": "application/json" } }
        );

        if (response.data?.access_token) {
            console.log("✅ Login successful. Storing token...");

            localStorage.setItem("token", response.data.access_token);
            localStorage.setItem("refreshToken", response.data.refresh_token || ""); // Optional

            return response.data;
        } else {
            console.error("⚠️ No access token in response!");
            return null;
        }
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            console.error("❌ Login failed:", error.response?.data || error.message);
        } else {
            console.error("❌ Unknown login error", error);
        }
        return null;
    }
};

// 🔄 Attach Token to Every Request
api.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem("token");

        console.log("🚀 Sending Request with Token:", token);

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// 🔄 Handle Token Expiry & Refresh
api.interceptors.response.use(
    (response) => response,
    async (error: unknown) => {
        if (error instanceof AxiosError && error.response?.status === 401) {
            console.log("🔄 Token expired. Refreshing...");

            try {
                const refreshToken = localStorage.getItem("refreshToken");

                if (!refreshToken) {
                    console.error("❌ No refresh token. Redirecting to login...");
                    localStorage.removeItem("token");
                    localStorage.removeItem("refreshToken");
                    window.location.href = "/login";
                    return Promise.reject(error);
                }

                const res = await axios.post(`${BASE_URL}/auth/refresh`, { refresh_token: refreshToken });

                if (res.status === 200 && error.config) {
                    console.log("🔄 Token refreshed. Retrying request...");

                    localStorage.setItem("token", res.data.access_token);
                    error.config.headers.Authorization = `Bearer ${res.data.access_token}`;

                    return axios(error.config); // Retry original request
                } else {
                    console.error("❌ Refresh failed. Redirecting to login...");
                    localStorage.removeItem("token");
                    localStorage.removeItem("refreshToken");
                    window.location.href = "/login";
                }
            } catch (refreshError) {
                console.error("❌ Failed to refresh token", refreshError);
                localStorage.removeItem("token");
                localStorage.removeItem("refreshToken");
                window.location.href = "/login";
            }
        }

        return Promise.reject(error);
    }
);

export default api;
