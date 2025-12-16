import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/authService";

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await login(username, password);
      console.log("Đăng nhập thành công:", data);

      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.id);
      localStorage.setItem("username", data.username);
      localStorage.setItem("role", data.role);

      if (data.role === "ROLE_ADMIN") {
        navigate("/admin/dashboard"); 
      } else if (data.role === "ROLE_USER" || data.role === "ROLE_MANAGER") {
        navigate("/dashboard"); 
      } else {
        navigate("/login");
      }
    } catch (err) {
      console.error("Lỗi đăng nhập:", err);
      alert("Sai tài khoản hoặc mật khẩu!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md space-y-6 animate-fadeIn"
      >
        <h2 className="text-2xl font-bold text-center text-blue-600">
          Đăng nhập
        </h2>

        <input
          type="text"
          placeholder="Tên đăng nhập"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-300 transition"
          required
        />

        <input
          type="password"
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-300 transition"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition disabled:opacity-50"
        >
          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>

        <p className="text-center text-sm text-gray-500">
          Chưa có tài khoản?{" "}
          <span
            className="text-blue-600 cursor-pointer hover:underline"
            onClick={() => navigate("/register")}
          >
            Đăng ký
          </span>
        </p>
      </form>
    </div>
  );
}
