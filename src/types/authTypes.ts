import React from "react";

export interface Testimonial {
  id: string;
  name: string;
  company: string;
  avatarUrl: string;
  quote: string;
  rating?: number;
}

export interface Logo {
  id: string;
  name: string;
  src: string;
  href?: string;
}

export interface Slide {
  id: string;
  type: 'logo' | 'screenshot';
  src: string;
  alt: string;
}

export type Theme = 'light' | 'dark' | 'system';

// ------------------ Forms ------------------
export interface LoginForm {
  email: string;
  password: string;
  remember: boolean;
}

export interface SignupForm {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

export interface ResetPasswordForm {
  email: string;
}

export interface ForgotPasswordForm {
  email: string;
}


export interface FormErrors {
  [key: string]: string;
}

// ------------------ Auth / User ------------------
export interface User {
  id: number;             // consistent: number for backend
  username: string;
  roleId: number;
}

export interface SignupData {
  name: string;
  email: string;
  password?: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// ------------------ API ------------------
export interface ApiResponse<T = unknown> {  // ✅ replace `any` with `unknown` to satisfy eslint
  status: number;          // e.g., 200
  data: T;                 // payload (object, array, etc.)
  message: string;         // message from API
  errors: boolean;         // true/false
  success: boolean;        // true/false
  timestamp: string;       // ISO string
}

// JWT payload structure
export interface JwtPayload {
  id: number;
  username: string;
  roleId: number;
  iat: number;   // issued at
  exp: number;   // expiry timestamp
}

// src/types/index.ts
export interface User {
  id: number;
  username: string;
  roleId: number;
}

export interface JwtPayload {
  id: number;
  username: string;
  roleId: number;
  iat: number;
  exp: number;
}
