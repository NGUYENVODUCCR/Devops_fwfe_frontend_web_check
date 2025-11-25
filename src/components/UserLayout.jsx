import { Routes, Route, useNavigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

import UserSidebar from "./UserSidebar";
import UserNavbar from "./UserNavbar";

import UserDashboard from "../pages/user/UserDashboard";
import Profile from "../pages/account/Profile";
import SearchAccount from "../pages/account/SearchAccount";
import WorkManager from "../pages/work/WorkManager";
import ChatPage from "../pages/chat/ChatPage";
import CompanyManager from "../pages/company/CompanyManager";
import ReportList from "../pages/report/ReportList";
import ReportForm from "../pages/report/ReportForm";
import ManagerDashboard from "../pages/user/ManagerDashboard";
import SettingsPage from "../pages/admin/SettingsPage";

export default function UserLayout() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const { darkMode } = useContext(ThemeContext);

  const handleManagerClick = () => navigate("/manager/interface");
  const handleAdminClick = () => navigate("/admin/dashboard");

  return (
    <div
      className={`flex h-screen transition-colors ${
        darkMode ? "bg-gray-900" : "bg-gray-100"
      }`}
    >
      <UserSidebar />
      <div className="flex-1 flex flex-col">
        <UserNavbar />
        <main className="flex-1 p-6 overflow-auto transition-colors">
          <Routes>
            <Route path="dashboard" element={<UserDashboard />} />
            <Route path="profile" element={<Profile />} />
            <Route path="search-account" element={<SearchAccount />} />
            <Route path="work/*" element={<WorkManager />} />
            <Route path="chat/*" element={<ChatPage />} />
            <Route path="company/*" element={<CompanyManager />} />
            <Route path="report" element={<ReportList />} />
            <Route path="report/new" element={<ReportForm />} />
            <Route path="manager/interface/*" element={<ManagerDashboard />} />
            <Route path="settings" element={<SettingsPage />} />
          </Routes>

          {(role === "ROLE_MANAGER" || role === "ROLE_ADMIN") && (
            <button
              onClick={handleManagerClick}
              className="fixed bottom-6 right-6 w-16 h-16 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center text-xl font-bold transition z-50"
            >
              WW
            </button>
          )}

          {role === "ROLE_ADMIN" && (
            <button
              onClick={handleAdminClick}
              className="fixed bottom-24 right-6 w-16 h-16 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg flex items-center justify-center text-xl font-bold transition z-50"
            >
              AD
            </button>
          )}
        </main>
      </div>
    </div>
  );
}
