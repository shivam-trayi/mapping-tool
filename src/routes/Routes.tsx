// src/routes/Routes.tsx
import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import MasterLayout from "../layout/MasterLayout";
import { ProtectedRoute } from "./ProtectedRoute";
import { PublicRoute } from "./PublicRoute";
import { Loadable } from "./Loadable";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import QualificationsDashboard from "@/pages/qualifications";
import AddOptionView from "@/pages/qualifications/AddOptionView";
import UpdateOptionView from "@/pages/qualifications/UpdateOptionView";

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
        path: "/login", 
        element: (
          <PublicRoute>
            <Login />
          </PublicRoute>
        ) 
      },
      { 
        path: "/signup", 
        element: (
          <PublicRoute>
            <Signup />
          </PublicRoute>
        ) 
      },
      { 
        path: "/forgot-password", 
        element: (
          <PublicRoute>
            <ForgotPassword />
          </PublicRoute>
        ) 
      },
      { 
        path: "/reset-password", 
        element: (
          <PublicRoute>
            <ResetPassword />
          </PublicRoute>
        ) 
      },
      { 
        path: "/dashboard", 
        element: (
          <ProtectedRoute>
            <QualificationsDashboard />
          </ProtectedRoute>
        ) 
      },
      { 
        path: "/add-qualification-query", 
        element: (
          <ProtectedRoute>
            <AddOptionView />
          </ProtectedRoute>
        ) 
      },
      { 
        path: "/update-qualification-query/:id", 
        element: (
          <ProtectedRoute>
            <UpdateOptionView />
          </ProtectedRoute>
        ) 
      },
      
    ],
  },
  { path: "*", element: <NotFound /> },
]);

export default router;
