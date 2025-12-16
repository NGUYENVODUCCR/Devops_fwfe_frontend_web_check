import { useState } from "react";
import { createUser } from "../../services/accountService";

const AdminCreateAccount = () => {
  const [form, setForm] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    company: {
      name: "",
      descriptionCompany: "",
      type: "",
      address: "",
      isPublic: true,
    },
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [createdUser, setCreatedUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");
    setCreatedUser(null);

    if (form.password !== form.confirmPassword) {
      setErrorMessage("Mật khẩu xác nhận không khớp");
      return;
    }

    if (!form.role) {
      setErrorMessage("Vui lòng chọn vai trò!");
      return;
    }

    setLoading(true);

    try {
      let payload = {
        username: form.username,
        name: form.name,
        email: form.email,
        password: form.password,
        confirmPassword: form.confirmPassword,
        role: form.role,
      };

      if (form.role === "ROLE_MANAGER") {
        payload.company = form.company;
      }

      const res = await createUser(payload);

      setSuccessMessage("Tạo tài khoản thành công!");
      setCreatedUser({
        username: form.username,
        email: form.email,
        role: form.role,
      });

      setForm({
        username: "",
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "",
        company: {
          name: "",
          descriptionCompany: "",
          type: "",
          address: "",
          isPublic: true,
        },
      });
    } catch (err) {
      console.error(err);
      const msg = err.response?.data;
      if (typeof msg === "object") {
        setErrorMessage(Object.values(msg).join(", "));
      } else {
        setErrorMessage(msg || "Có lỗi xảy ra. Vui lòng thử lại!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 py-12 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-3xl p-8 max-w-lg w-full space-y-6 animate-fadeIn"
      >
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">
          Tạo tài khoản mới
        </h1>

        {/* Error message */}
        {errorMessage && (
          <div className="bg-red-100 text-red-700 p-3 rounded text-center">
            {errorMessage}
          </div>
        )}

        {/* Success message */}
        {successMessage && (
          <div className="bg-green-100 text-green-700 p-3 rounded text-center">
            {successMessage}
          </div>
        )}

        {/* Username, Name, Email */}
        {["username", "name", "email"].map((field) => (
          <div key={field} className="flex flex-col space-y-1">
            <label className="font-medium text-gray-700">
              {field === "username" ? "Username" : field === "name" ? "Họ tên" : "Email"}
            </label>
            <input
              type={field === "email" ? "email" : "text"}
              placeholder={`Nhập ${field}`}
              value={form[field]}
              onChange={(e) => setForm({ ...form, [field]: e.target.value })}
              className="border p-3 rounded-xl focus:ring-2 focus:ring-blue-400 transition"
              required
            />
          </div>
        ))}

        {/* Password */}
        <div className="flex flex-col space-y-1 relative">
          <label className="font-medium text-gray-700">Mật khẩu</label>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Nhập mật khẩu"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="border p-3 rounded-xl focus:ring-2 focus:ring-blue-400 transition pr-10"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-9 text-gray-500"
          >
            {showPassword ? "Ẩn" : "Hiện"}
          </button>
        </div>

        {/* Confirm Password */}
        <div className="flex flex-col space-y-1 relative">
          <label className="font-medium text-gray-700">Xác nhận mật khẩu</label>
          <input
            type={showConfirm ? "text" : "password"}
            placeholder="Nhập lại mật khẩu"
            value={form.confirmPassword}
            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
            className="border p-3 rounded-xl focus:ring-2 focus:ring-blue-400 transition pr-10"
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-3 top-9 text-gray-500"
          >
            {showConfirm ? "Ẩn" : "Hiện"}
          </button>
          {form.confirmPassword && form.confirmPassword !== form.password && (
            <span className="text-red-500 text-sm">Mật khẩu xác nhận không khớp</span>
          )}
        </div>

        {/* Role */}
        <div className="flex flex-col space-y-1">
          <label className="font-medium text-gray-700">Vai trò</label>
          <select
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            className="border p-3 rounded-xl focus:ring-2 focus:ring-blue-400 transition"
            required
          >
            <option value="">Chọn vai trò</option>
            <option value="ROLE_USER">Người dùng</option>
            <option value="ROLE_MANAGER">Nhà tuyển dụng</option>
            <option value="ROLE_ADMIN">Admin</option>
          </select>
        </div>

        {/* Company info if Manager */}
        {form.role === "ROLE_MANAGER" && (
          <div className="border p-4 rounded-xl bg-gray-50 space-y-3">
            <h2 className="font-semibold text-gray-700">Thông tin công ty</h2>
            {[
              { label: "Tên công ty", key: "name" },
              { label: "Mô tả công ty", key: "descriptionCompany" },
              { label: "Loại hình kinh doanh", key: "type" },
              { label: "Địa chỉ", key: "address" },
            ].map((item) => (
              <div key={item.key} className="flex flex-col space-y-1">
                <label className="font-medium text-gray-600">{item.label}</label>
                <input
                  type="text"
                  value={form.company[item.key]}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      company: { ...form.company, [item.key]: e.target.value },
                    })
                  }
                  className="border p-3 rounded-xl focus:ring-2 focus:ring-blue-400 transition"
                  required
                />
              </div>
            ))}
            <div className="flex items-center space-x-2 mt-2">
              <input
                type="checkbox"
                checked={form.company.isPublic}
                onChange={(e) =>
                  setForm({
                    ...form,
                    company: { ...form.company, isPublic: e.target.checked },
                  })
                }
              />
              <span>Công ty công khai</span>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl font-semibold transition disabled:opacity-50"
        >
          {loading ? "Đang tạo..." : "Tạo tài khoản"}
        </button>
      </form>

      {/* Hiển thị thông tin tài khoản vừa tạo */}
      {createdUser && (
        <div className="mt-6 p-6 max-w-lg w-full bg-green-50 border border-green-200 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold text-green-800 mb-2">Tài khoản vừa tạo</h2>
          <p>
            <strong>Username:</strong> {createdUser.username}
          </p>
          <p>
            <strong>Email:</strong> {createdUser.email}
          </p>
          <p>
            <strong>Vai trò:</strong> {createdUser.role}
          </p>
        </div>
      )}
    </div>
  );
};

export default AdminCreateAccount;
