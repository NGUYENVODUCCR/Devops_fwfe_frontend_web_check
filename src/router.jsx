import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./components/AdminLayout";
import UserLayout from "./components/UserLayout";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import AdminDashboard from "./pages/admin/AdminDashboard";
import UserList from "./pages/admin/UserList";
import CreateUserForm from "./pages/admin/CreateUserForm";

import UserDashboard from "./pages/user/UserDashboard";
import UserNavbar from "./components/UserNavbar";
import ManagerDashboard from "./pages/user/ManagerDashboard";

import CompanyManager from "./pages/company/CompanyManager";

import WorkManager from "./pages/work/WorkManager";

import ChatPage from "./pages/chat/ChatPage";

import Profile from "./pages/account/Profile";
import SearchAccount from "./pages/account/SearchAccount";

import ReportList from "./pages/report/ReportList";
import ReportForm from "./pages/report/ReportForm";

import SettingsPage from "./pages/admin/SettingsPage";

export default function Router() {
  return (
    <Routes>
      {/* Auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Admin routes */}
      <Route
        path="/admin/*"
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
      </Route>

      {/* User/Manager routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute allowedRoles={["ROLE_USER", "ROLE_MANAGER", "ROLE_ADMIN"]}>
            <UserLayout />
          </ProtectedRoute>
        }
      >
        {/* Trang chủ mặc định */}
        <Route index element={<UserNavbar />} />
        <Route path="dashboard" element={<UserDashboard />} />
        <Route path="profile" element={<Profile />} />
        <Route path="search-account" element={<SearchAccount />} />
        <Route path="work/*" element={<WorkManager />} />
        <Route path="chat/*" element={<ChatPage />} />
        <Route path="company/*" element={<CompanyManager />} />
        <Route path="report" element={<ReportList />} />
        <Route path="report/new" element={<ReportForm />} />
        <Route path="settings" element={<SettingsPage />} />

        {/* ManagerDashboard (WW) */}
        <Route
          path="manager/interface/*"
          element={
            <ProtectedRoute allowedRoles={["ROLE_MANAGER", "ROLE_ADMIN"]}>
              <ManagerDashboard />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}
