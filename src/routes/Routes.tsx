// src/routes/Routes.tsx
import { createBrowserRouter } from "react-router-dom";
import MasterLayout from "../layout/MasterLayout";
import { ProtectedRoute } from "./ProtectedRoute";
import { PublicRoute } from "./PublicRoute";
import NotFound from "@/pages/NotFound";

// Public auth pages
import Login from "@/pages/auth/Login";
import Signup from "@/pages/auth/Signup";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import ResetPassword from "@/pages/auth/ResetPassword";

// Protected qualification pages
import AddOptionView from "@/pages/qualifications/AddOptionView";
import UpdateOptionView from "@/pages/qualifications/UpdateOptionView";
import ListView from "@/pages/qualifications/ListView";
import CreateEditView from "@/pages/qualifications/CreateEditView";
import EditView from "@/pages/qualifications/EditView";
import AddQuestionView from "@/pages/qualifications/AddQuestionView";
import UpdateQuestionView from "@/pages/qualifications/UpdateQuestionView";
import QualificationsMappingView from "@/pages/qualifications/QualificationsMappingView";
import QuestionMappingView from "@/pages/qualifications/QuestionMappingView";
import { DemoPriorityMappingViewMock } from "@/pages/qualifications/DemoPriorityMappingView";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MasterLayout />,
    children: [
      // ✅ Public routes
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

      // ✅ Protected qualification routes
      {
        path: "list",
        element: (
          <ProtectedRoute>
            <ListView />
          </ProtectedRoute>
        ),
      },
      {
        path: "create",
        element: (
          <ProtectedRoute>
            <CreateEditView />
          </ProtectedRoute>
        ),
      },
      {
        path: "edit/:id",
        element: (
          <ProtectedRoute>
            <EditView />
          </ProtectedRoute>
        ),
      },
      {
        path: "add-question",
        element: (
          <ProtectedRoute>
            <AddQuestionView />
          </ProtectedRoute>
        ),
      },
      {
        path: "update-question/:id",
        element: (
          <ProtectedRoute>
            <UpdateQuestionView />
          </ProtectedRoute>
        ),
      },
      {
        path: "add-option",
        element: (
          <ProtectedRoute>
            <AddOptionView />
          </ProtectedRoute>
        ),
      },
      {
        path: "update-option/:id",
        element: (
          <ProtectedRoute>
            <UpdateOptionView />
          </ProtectedRoute>
        ),
      },
      {
        path: "mapping",
        element: (
          <ProtectedRoute>
            <QualificationsMappingView />
          </ProtectedRoute>
        ),
      },
      {
        path: "demo-mapping",
        element: (
          <ProtectedRoute>
            <DemoPriorityMappingViewMock />
          </ProtectedRoute>
        ),
      },
      {
        path: "question-mapping",
        element: (
          <ProtectedRoute>
            <QuestionMappingView />
          </ProtectedRoute>
        ),
      },

      // Fallback route
      { path: "*", element: <NotFound /> },
    ],
  },
]);

export default router;
