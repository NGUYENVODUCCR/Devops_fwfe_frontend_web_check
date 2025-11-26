import { Outlet, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

import UserSidebar from "./UserSidebar";
import UserNavbar from "./UserNavbar";

export default function UserLayout() {
  const { darkMode } = useContext(ThemeContext);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // Chuyển hướng Manager/Admin
  const handleManagerClick = () => navigate("/react/manager/interface");
  // Chuyển hướng Admin
  const handleAdminClick = () => navigate("/react/admin/dashboard");

  return (
    <div
      className={`flex h-screen transition-colors ${
        darkMode ? "bg-gray-900" : "bg-gray-100"
      }`}
    >
      {/* Sidebar */}
      <UserSidebar />

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <UserNavbar />

        {/* Main area where child routes render */}
        <main className="flex-1 p-6 overflow-auto transition-colors">
          <Outlet />

          {/* Nút WW: Manager/Admin */}
          {token && (role === "ROLE_MANAGER" || role === "ROLE_ADMIN") && (
            <button
              onClick={handleManagerClick}
              className="fixed bottom-6 right-6 w-16 h-16 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center text-xl font-bold transition z-50"
            >
              WW
            </button>
          )}

          {/* Nút AD: Chỉ Admin */}
          {token && role === "ROLE_ADMIN" && (
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
