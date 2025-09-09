import { lazy } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import MasterLayout from "../layout/MasterLayout";
import { ProtectedRoute } from "./ProtectedRoute";
import { PublicRoute } from "./PublicRoute";
import { Loadable } from "./Loadable";

import ForgotPassword from "@/pages/auth/ForgotPassword";
import QualificationsDashboard from "@/pages/qualifications";
import QuestionOptionsPage from "../pages/qualifications/QuestionOptionsModal";
import ListView from '@/pages/qualifications/ListView';
import CreateEditView from '@/pages/qualifications/CreateEditView';
import EditView from '@/pages/qualifications/EditView';
import AddQuestionView from '@/pages/qualifications/AddQuestionView';
import UpdateQuestionView from '@/pages/qualifications/UpdateQuestionView';
import DemoPriorityMappingView from '@/pages/qualifications/DemoPriorityMappingView';
import QualificationsMappingView from '@/pages/qualifications/QualificationsMappingView';
import QuestionMappingView from '@/pages/qualifications/QuestionMappingView';
import AddOptionView from '@/pages/qualifications/AddOptionView';
import UpdateOptionView from '@/pages/qualifications/UpdateOptionView';

const Login = Loadable(lazy(() => import("../pages/auth/Login")));
const Signup = Loadable(lazy(() => import("../pages/auth/Signup")));
const ResetPassword = Loadable(lazy(() => import("../pages/auth/ResetPassword")));
const NotFound = Loadable(lazy(() => import("../pages/NotFound")));

// Dashboard children
// const ListView = Loadable(lazy(() => import("../pages/qualifications/ListView")));
// const CreateEditView = Loadable(lazy(() => import("../pages/qualifications/CreateEditView")));
// const EditView = Loadable(lazy(() => import("../pages/qualifications/EditView")));
// const AddQuestionView = Loadable(lazy(() => import("../pages/qualifications/AddQuestionView")));
// const UpdateQuestionView = Loadable(lazy(() => import("../pages/qualifications/UpdateQuestionView")));
// const DemoPriorityMappingView = Loadable(lazy(() => import("../pages/qualifications/DemoPriorityMappingView")));
// const QualificationsMappingView = Loadable(lazy(() => import("../pages/qualifications/QualificationsMappingView")));
// const QuestionMappingView = Loadable(lazy(() => import("../pages/qualifications/QuestionMappingView")));
// const AddOptionView = Loadable(lazy(() => import("../pages/qualifications/AddOptionView")));
// const UpdateOptionView = Loadable(lazy(() => import("../pages/qualifications/UpdateOptionView")));
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

      // Protected routes
      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <QualificationsDashboard />
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <Navigate to="list" replace /> }, // fallback
          { path: "list", element: <ListView /> },// ye wala list view ka route hai
          { path: "create", element: <CreateEditView /> },// ye wala create view ka route hai
          { path: "edit", element: <EditView /> },// ye wala EditView ka route hai
          { path: "add-question", element: <AddQuestionView /> },
          { path: "update-question", element: <UpdateQuestionView /> },
          { path: "demo-mapping", element: <DemoPriorityMappingView /> },// ye wala DemoPriorityMappingView ka route hai
          { path: "qualifications-mapping", element: <QualificationsMappingView /> },// ye wala QualificationsMappingView ka route hai
          { path: "question-mapping", element: <QuestionMappingView /> },// ye wala QuestionMappingView ka route hai
          { path: "add-option", element: <AddOptionView /> },
          { path: "update-option", element: <UpdateOptionView /> },
          { path: "question-options", element: <QuestionOptionsPage /> },// ye wala QuestionOptionsPage ka route hai
        ],
      },
    ],
  },
  { path: "*", element: <NotFound /> },
]);

export default router;
