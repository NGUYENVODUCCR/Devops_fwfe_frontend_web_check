import { NavLink, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

export default function AdminSidebar() {
  const { darkMode } = useContext(ThemeContext);
  const navigate = useNavigate();

  const linkClass = ({ isActive }) =>
    `block px-4 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${
      isActive
        ? "bg-gray-300 dark:bg-gray-600 font-semibold dark:text-white"
        : "text-gray-800 dark:text-gray-200"
    }`;

  return (
    <aside
      className={`w-60 h-screen p-4 border-r transition-colors ${
        darkMode ? "bg-gray-900 border-gray-700" : "bg-gray-50 border-gray-200"
      }`}
    >
      <nav className="space-y-2">
        {/* Nút trang chủ: trở về UserDashboard */}
        <button
          onClick={() => navigate("/react/dashboard")}
          className={linkClass({ isActive: false })}
        >
          🏠 Trang chủ
        </button>

        <NavLink to="/react/admin/dashboard" className={linkClass}>
          📊 Dashboard
        </NavLink>
        <NavLink to="/react/admin/users" className={linkClass}>
          👥 Quản lý người dùng
        </NavLink>
        <NavLink to="/react/admin/company" className={linkClass}>
          🏢 Công ty
        </NavLink>
        <NavLink to="/react/admin/work" className={linkClass}>
          💼 Công việc
        </NavLink>
        <NavLink to="/react/admin/chat" className={linkClass}>
          💬 Trò chuyện
        </NavLink>
        <NavLink to="/react/admin/report" className={linkClass}>
          📄 Báo cáo
        </NavLink>
        <NavLink to="/react/company-list" className={linkClass}>
          🗂️ Danh sách công ty
        </NavLink>
        <NavLink to="/react/admin/account/profile" className={linkClass}>
          👤 Tài khoản
        </NavLink>
        <NavLink to="/react/admin/settings" className={linkClass}>
          ⚙️ Cài đặt
        </NavLink>
      </nav>
    </aside>
  );
}
