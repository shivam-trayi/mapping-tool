import { lazy } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import MasterLayout from "../layout/MasterLayout";
import { ProtectedRoute } from "./ProtectedRoute";
import { PublicRoute } from "./PublicRoute";
import { Loadable } from "./Loadable";

import ForgotPassword from "@/pages/auth/ForgotPassword";
import QuestionOptionsPage from "../pages/qualifications/QuestionOptionsModal";

const Login = Loadable(lazy(() => import("../pages/auth/Login")));
const Signup = Loadable(lazy(() => import("../pages/auth/Signup")));
const ResetPassword = Loadable(lazy(() => import("../pages/auth/ResetPassword")));
const NotFound = Loadable(lazy(() => import("../pages/NotFound")));

// Dashboard pages
const ListView = Loadable(lazy(() => import("../pages/qualifications/ListView")));
const CreateEditView = Loadable(lazy(() => import("../pages/qualifications/CreateEditView")));
const EditView = Loadable(lazy(() => import("../pages/qualifications/EditView")));
const AddQuestionView = Loadable(lazy(() => import("../pages/qualifications/AddQuestionView")));
const UpdateQuestionView = Loadable(lazy(() => import("../pages/qualifications/UpdateQuestionView")));
const DemoPriorityMappingView = Loadable(lazy(() => import("../pages/qualifications/DemoPriorityMappingView")));
const QualificationsMappingView = Loadable(lazy(() => import("../pages/qualifications/QualificationsMappingView")));
const QuestionMappingView = Loadable(lazy(() => import("../pages/qualifications/QuestionMappingView")));
const AddOptionView = Loadable(lazy(() => import("../pages/qualifications/AddOptionView")));
const UpdateOptionView = Loadable(lazy(() => import("../pages/qualifications/UpdateOptionView")));
// const QuestionOptionsModal = Loadable(lazy(() => import("../pages/qualifications/QuestionOptionsModal")));

const router = createBrowserRouter([
  {
    path: "/",
    element: <MasterLayout />,
    children: [
      // Public routes
      {
        index: true,
        element: (
          <PublicRoute>
            <Login />
          </PublicRoute>
        ),
      },
      { path: "login", element: <PublicRoute><Login /></PublicRoute> },
      { path: "signup", element: <PublicRoute><Signup /></PublicRoute> },
      { path: "forgot-password", element: <PublicRoute><ForgotPassword /></PublicRoute> },
      { path: "reset-password", element: <PublicRoute><ResetPassword /></PublicRoute> },

      // Dashboard routes (no children, no ProtectedRoute wrapping MasterLayout)
      { path: "dashboard", element: <Navigate to="/dashboard/list" /> },
      { path: "dashboard/list", element: <ListView /> },
      { path: "dashboard/create", element: <CreateEditView /> },
      { path: "dashboard/edit", element: <EditView /> },
      { path: "dashboard/add-question", element: <AddQuestionView /> },
      { path: "dashboard/update-question", element: <UpdateQuestionView /> },
      { path: "dashboard/demo-mapping", element: <DemoPriorityMappingView /> },
      { path: "dashboard/qualifications-mapping", element: <QualificationsMappingView /> },
      { path: "dashboard/question-mapping", element: <QuestionMappingView /> },
      { path: "dashboard/add-option", element: <AddOptionView /> },
      { path: "dashboard/update-option", element: <UpdateOptionView /> },
      { path: "dashboard/question-options", element: <QuestionOptionsPage /> },
    ],
  },
  { path: "*", element: <NotFound /> },
]);

export default router;
