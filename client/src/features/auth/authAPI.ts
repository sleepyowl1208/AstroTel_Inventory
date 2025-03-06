// import axios from "axios";

// const API_URL = "http://127.0.0.1:8000"

// // export const login = async(email: string, password: string) => {
// //     const response = await axios.post(`${API_URL}/login`, {email, password });
// //     return response.data;
// //     // this response.data should contain { email, token, role }
// // }

// export const loginUser = async (email: string, password: string) => {
//     const response = await axios.post(`${API_URL}/auth/login`, 
//         new URLSearchParams({
//             username: email, // Use "username" instead of "email"
//             password: password,
//         }),
//         { headers: { "Content-Type": "application/json" } }
//     );
//     return response.data;
// };

import axios, { AxiosError } from "axios";

const BASE_URL = "http://127.0.0.1:8000";

export const loginUser = async (email: string, password: string): Promise<unknown> => {
  try {
    const response = await axios.post(
      `${BASE_URL}/auth/login`,
      { email, password },
      {
        headers: { "Content-Type": "application/json" }, // Ensure JSON format
      }
    );

    console.log("Login successful:", response.data);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error("Login failed:", error.response?.data || error.message);
      return null;
    }
    console.error("An unknown error occurred", error);
    return null;
  }
};
