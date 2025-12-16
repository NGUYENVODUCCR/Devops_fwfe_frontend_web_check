import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../../services/authService";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Validate frontend
  const validateForm = () => {
    if (!form.username || !form.name || !form.email || !form.password || !form.confirmPassword) {
      setErrorMessage("Vui lòng điền đầy đủ tất cả các trường!");
      return false;
    }

    if (form.password !== form.confirmPassword) {
      setErrorMessage("Mật khẩu xác nhận không khớp!");
      return false;
    }

    // Password regex: ít nhất 8 ký tự, chữ hoa, chữ thường, số, ký tự đặc biệt
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    if (!passwordRegex.test(form.password)) {
      setErrorMessage(
        "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt!"
      );
      return false;
    }

    // Email phải @gmail.com
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!emailRegex.test(form.email)) {
      setErrorMessage("Vui lòng sử dụng email @gmail.com");
      return false;
    }

    setErrorMessage("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      await register({
        username: form.username,
        name: form.name,
        email: form.email,
        password: form.password,
        confirmPassword: form.confirmPassword, 
      });

      alert("Đăng ký thành công!");
      navigate("/login");
    } catch (err) {
      console.error(err);
      const msg =
        err.response?.data?.message ||
        err.response?.data ||
        "Có lỗi xảy ra. Vui lòng thử lại!";
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-10 rounded-3xl shadow-lg w-full max-w-md space-y-6 animate-fadeIn"
      >
        <h1 className="text-3xl font-bold text-center text-gray-800">Tạo tài khoản</h1>

        {errorMessage && (
          <div className="bg-red-100 text-red-700 p-2 rounded text-center">{errorMessage}</div>
        )}

        <input
          type="text"
          placeholder="Username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-300 transition"
          required
        />

        <input
          type="text"
          placeholder="Họ tên"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-300 transition"
          required
        />

        <input
          type="email"
          placeholder="Email (@gmail.com)"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-300 transition"
          required
        />

        <input
          type="password"
          placeholder="Mật khẩu"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-300 transition"
          required
        />

        <input
          type="password"
          placeholder="Xác nhận mật khẩu"
          value={form.confirmPassword}
          onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
          className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-300 transition"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition disabled:opacity-50"
        >
          {loading ? "Đang đăng ký..." : "Đăng ký"}
        </button>

        <p className="text-center text-sm text-gray-500">
          Đã có tài khoản?{" "}
          <span
            className="text-blue-600 cursor-pointer hover:underline"
            onClick={() => navigate("/login")}
          >
            Đăng nhập
          </span>
        </p>
      </form>
    </div>
  );
};

export default Register;
