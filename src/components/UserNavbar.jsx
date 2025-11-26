import { useNavigate } from "react-router-dom";

export default function UserNavbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const handleLogin = () => navigate("/react/login");
  const handleRegister = () => navigate("/react/register");

  return (
    <header className="bg-green-500 shadow flex justify-between items-center px-6 py-3">
      <h1 className="text-xl font-bold text-white">🧪 Trang chủ</h1>
      {!token && (
        <div className="flex gap-3">
          <button
            onClick={handleLogin}
            className="bg-white text-green-500 px-3 py-1 rounded hover:bg-gray-100"
          >
            Đăng nhập
          </button>
          <button
            onClick={handleRegister}
            className="bg-white text-green-500 px-3 py-1 rounded hover:bg-gray-100"
          >
            Đăng ký
          </button>
        </div>
      )}
    </header>
  );
}
