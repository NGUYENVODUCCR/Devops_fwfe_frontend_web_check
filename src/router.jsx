import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./components/AdminLayout";
import UserLayout from "./components/UserLayout";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import AdminDashboard from "./pages/admin/AdminDashboard";
import UserList from "./pages/admin/UserList";
import CreateUserForm from "./pages/admin/CreateUserForm";
import SettingsPage from "./pages/admin/SettingsPage";

import UserDashboard from "./pages/user/UserDashboard";
import ManagerDashboard from "./pages/user/ManagerDashboard";

import CompanyManager from "./pages/company/CompanyManager";
import CompanyList from "./pages/company/CompanyList";

import WorkManager from "./pages/work/WorkManager";

import ChatPage from "./pages/chat/ChatPage";

import Profile from "./pages/account/Profile";
import SearchAccount from "./pages/account/SearchAccount";

import ReportList from "./pages/report/ReportList";
import ReportForm from "./pages/report/ReportForm";

export default function Router() {
  return (
    <Routes>
      {/* Auth */}
      <Route path="/react/login" element={<Login />} />
      <Route path="/react/register" element={<Register />} />

      {/* Admin routes */}
      <Route
        path="/react/admin/*"
        element={
          <ProtectedRoute allowedRoles={["ROLE_ADMIN"]}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<UserList />} />
        <Route path="create-user" element={<CreateUserForm />} />
        <Route path="company/*" element={<CompanyManager />} />
        <Route path="work/*" element={<WorkManager />} />
        <Route path="chat/*" element={<ChatPage />} />
        <Route path="account/profile" element={<Profile />} />
        <Route path="account/search" element={<SearchAccount />} />
        <Route path="report" element={<ReportList />} />
        <Route path="report/new" element={<ReportForm />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="company-list" element={<CompanyList />} />
      </Route>

      {/* User/Manager routes */}
      <Route path="/react/*" element={<UserLayout />}>
        {/* Dashboard */}
        <Route index element={<UserDashboard />} />
        <Route path="dashboard" element={<UserDashboard />} />

        {/* Protected tabs */}
        <Route
          path="profile"
          element={
            <ProtectedRoute allowedRoles={["ROLE_USER", "ROLE_MANAGER", "ROLE_ADMIN"]}>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="work/*"
          element={
            <ProtectedRoute allowedRoles={["ROLE_USER", "ROLE_MANAGER", "ROLE_ADMIN"]}>
              <WorkManager />
            </ProtectedRoute>
          }
        />
        <Route
          path="chat/*"
          element={
            <ProtectedRoute allowedRoles={["ROLE_USER", "ROLE_MANAGER", "ROLE_ADMIN"]}>
              <ChatPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="company/*"
          element={
            <ProtectedRoute allowedRoles={["ROLE_USER", "ROLE_MANAGER", "ROLE_ADMIN"]}>
              <CompanyManager />
            </ProtectedRoute>
          }
        />
        <Route path="company-list" element={<CompanyList />} />
        <Route
          path="report"
          element={
            <ProtectedRoute allowedRoles={["ROLE_USER", "ROLE_MANAGER", "ROLE_ADMIN"]}>
              <ReportList />
            </ProtectedRoute>
          }
        />
        <Route
          path="report/new"
          element={
            <ProtectedRoute allowedRoles={["ROLE_USER", "ROLE_MANAGER", "ROLE_ADMIN"]}>
              <ReportForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="settings"
          element={
            <ProtectedRoute allowedRoles={["ROLE_USER", "ROLE_MANAGER", "ROLE_ADMIN"]}>
              <SettingsPage />
            </ProtectedRoute>
          }
        />

        {/* Manager dashboard */}
        <Route
          path="manager/interface/*"
          element={
            <ProtectedRoute allowedRoles={["ROLE_MANAGER", "ROLE_ADMIN"]}>
              <ManagerDashboard />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Redirect mặc định */}
      <Route path="*" element={<Navigate to="/react/dashboard" replace />} />
    </Routes>
  );
}
