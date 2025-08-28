import { ApiResponse } from "@/types/authTypes";

const API_BASE = import.meta.env.VITE_API_BASE;

export const authService = {
  login: async (
    username: string,
    password: string
  ): Promise<ApiResponse<{ token: string }>> => {
    const res = await fetch(`${API_BASE}auth/login`, {
      method: "POST", 
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
      credentials: "include",
    });

    const data = (await res.json()) as ApiResponse<{ token: string }>;
    if (!data.success) throw new Error(data.message || "Login failed");
    return data;
  },

  signup: async (payload: {
    name: string;
    email: string;
    password: string;
    // country?: string;
  }): Promise<ApiResponse<{ token: string }>> => {
    const res = await fetch(`${API_BASE}auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = (await res.json()) as ApiResponse<{ token: string }>;
    if (!data.success) throw new Error(data.message || "Signup failed");
    return data;
  },

  forgotPassword: async (
    email: string
  ): Promise<ApiResponse<{ success: boolean }>> => {
    const res = await fetch(`${API_BASE}auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = (await res.json()) as ApiResponse<{ success: boolean }>;
    if (!data.success) throw new Error(data.message || "Request failed");
    return data;
  },

  resetPassword: async (
    token: string,
    newPassword: string
  ): Promise<ApiResponse<{ success: boolean }>> => {
    const res = await fetch(`${API_BASE}auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, newPassword }),
    });

    const data = (await res.json()) as ApiResponse<{ success: boolean }>;
    if (!data.success) throw new Error(data.message || "Reset failed");
    return data;
  },

  logout: async (): Promise<ApiResponse<{ success: boolean }>> => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    const username = user ? JSON.parse(user).username : null;

    const res = await fetch(`${API_BASE}auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ username }),
    });

    const data = (await res.json()) as ApiResponse<{ success: boolean }>;
    if (!data.success) throw new Error(data.message || "Logout failed");
    return data;
  },
};
