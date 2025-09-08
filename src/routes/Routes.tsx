// src/routes/Routes.tsx
import { lazy } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import MasterLayout from "../layout/MasterLayout";
import { ProtectedRoute } from "./ProtectedRoute";
import { PublicRoute } from "./PublicRoute";
import { Loadable } from "./Loadable";

import ForgotPassword from "@/pages/auth/ForgotPassword";
import QualificationsDashboard from "@/pages/qualifications";
import QuestionOptionsPage from "@/pages/qualifications/QuestionOptionsModal";
import { QuestionMappingView } from "@/pages/qualifications/QuestionMappingView";

const Login = Loadable(lazy(() => import("../pages/auth/Login")));
const Signup = Loadable(lazy(() => import("../pages/auth/Signup")));
const ResetPassword = Loadable(lazy(() => import("../pages/auth/ResetPassword")));
const NotFound = Loadable(lazy(() => import("../pages/NotFound")));

const router = createBrowserRouter([
  {
    path: "/",
    element: <MasterLayout />,
    children: [
      {
        index: true,
        element: (
          <PublicRoute>
            <Login />
          </PublicRoute>
        ),
      },
      {
        path: "login",
        element: (
          <PublicRoute>
            <Login />
          </PublicRoute>
        ),
      },
      {
        path: "signup",
        element: (
          <PublicRoute>
            <Signup />
          </PublicRoute>
        ),
      },
      {
        path: "forgot-password",
        element: (
          <PublicRoute>
            <ForgotPassword />
          </PublicRoute>
        ),
      },
      {
        path: "reset-password",
        element: (
          <PublicRoute>
            <ResetPassword />
          </PublicRoute>
        ),
      },

      // ✅ Protected routes
      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <QualificationsDashboard />
          </ProtectedRoute>
        ),
      },
       {
        path: "dashboard/question/options",
        element: (
          <ProtectedRoute>
            <QuestionOptionsPage />
          </ProtectedRoute>
        ),
      },
        {
        path: "/dashboard/question-mapping",
        element: (
          <ProtectedRoute>
            <QuestionMappingView />
          </ProtectedRoute>
        ),
      },
    ],
  },
  { path: "*", element: <NotFound /> },
]);

export default router;
