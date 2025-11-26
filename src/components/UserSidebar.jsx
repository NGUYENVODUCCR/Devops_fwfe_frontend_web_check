import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

export default function UserSidebar() {
  const { darkMode } = useContext(ThemeContext);
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

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
        {/* Link mặc định */}
        <NavLink to="/react/dashboard" className={linkClass}>
          🏠 Trang chủ
        </NavLink>

        {/* Link cho user đã đăng nhập */}
        {token && (
          <>
          {/* Link báo cáo: chỉ hiển thị với Manager/Admin */}
            {(role === "ROLE_MANAGER" || role === "ROLE_ADMIN") && (
              <NavLink to="/react/work" className={linkClass}>
              💼 Công việc
            </NavLink>
            )}         
            <NavLink to="/react/chat" className={linkClass}>
              💬 Tin nhắn
            </NavLink>
            <NavLink to="/react/company-list" className={linkClass}>
              🗂️ Danh sách công ty
            </NavLink>
            <NavLink to="/react/profile" className={linkClass}>
              👤 Tài khoản
            </NavLink>
            <NavLink to="/react/settings" className={linkClass}>
              ⚙️ Cài đặt
            </NavLink>
          </>
        )}
      </nav>
    </aside>
  );
}
