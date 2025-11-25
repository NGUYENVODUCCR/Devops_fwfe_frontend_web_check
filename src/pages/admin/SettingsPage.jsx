import React, { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";

export default function SettingsPage() {
  const { darkMode, setDarkMode } = useContext(ThemeContext);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen flex justify-center items-center p-6 bg-gray-100 dark:bg-gray-900 transition-all">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-800 shadow-2xl rounded-3xl p-10 border border-gray-200 dark:border-gray-700 transition-all">

        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
          ⚙️ Trung Tâm Cài Đặt
        </h1>

        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
            Giao diện
          </h2>

          <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-100 dark:bg-gray-700 transition-all">
            <div>
              <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
                Chế độ Sáng / Tối
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Chuyển đổi giao diện của toàn hệ thống.
              </p>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={darkMode}
                onChange={() => setDarkMode(!darkMode)}
              />
              <div className="w-16 h-8 bg-gray-300 peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full 
                              peer dark:bg-gray-600 peer-checked:bg-blue-600 transition-all"></div>
              <div className="absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md transition-all 
                              peer-checked:translate-x-8"></div>
            </label>
          </div>
        </div>

        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
            Tùy chọn ứng dụng
          </h2>

          <div className="space-y-4">
            <button
              className="w-full py-4 px-5 text-left bg-gradient-to-r from-purple-500 to-blue-500 
              text-white font-semibold rounded-xl hover:opacity-90 transition"
              onClick={() => alert("Ngôn ngữ ứng dụng")}
            >
              🌐 Ngôn ngữ ứng dụng
            </button>

            <button
              className="w-full py-4 px-5 text-left bg-gradient-to-r from-pink-500 to-rose-500 
              text-white font-semibold rounded-xl hover:opacity-90 transition"
              onClick={() => alert("Lịch sử ứng tuyển")}
            >
              📄 Lịch sử ứng tuyển
            </button>
          </div>
        </div>

        <button
          className="w-full py-4 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl 
          shadow-lg transition text-lg"
          onClick={handleLogout}
        >
          🚪 Đăng xuất
        </button>
      </div>
    </div>
  );
}
