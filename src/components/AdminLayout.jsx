import { Outlet, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

import AdminSidebar from "./AdminSidebar";
import Navbar from "./Navbar";

export default function AdminLayout() {
  const { darkMode } = useContext(ThemeContext);
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const handleUserClick = () => navigate("/react/");
  const handleManagerClick = () => navigate("/react/manager/interface");

  return (
    <div
      className={`flex h-screen transition-colors ${
        darkMode ? "bg-gray-900" : "bg-gray-100"
      }`}
    >
      {/* Sidebar Admin */}
      <AdminSidebar />

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <Navbar />

        {/* Content render từ route */}
        <main className="flex-1 p-6 overflow-auto transition-colors">
          <Outlet />

          {/* QUICK NAV BUTTONS */}
          {(role === "ROLE_MANAGER" || role === "ROLE_ADMIN") && (
            <button
              onClick={handleManagerClick}
              className="fixed bottom-6 right-6 w-16 h-16 bg-blue-600 hover:bg-blue-700 
              text-white rounded-full shadow-lg flex items-center justify-center 
              text-xl font-bold transition z-50"
            >
              WW
            </button>
          )}

          {role === "ROLE_USER" && (
            <button
              onClick={handleUserClick}
              className="fixed bottom-24 right-6 w-16 h-16 bg-green-600 hover:bg-green-700 
              text-white rounded-full shadow-lg flex items-center justify-center 
              text-xl font-bold transition z-50"
            >
              User
            </button>
          )}
        </main>
      </div>
    </div>
  );
}
