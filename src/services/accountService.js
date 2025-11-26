import api from "./api";

// Lấy tất cả người dùng (UserList.jsx / AdminDashboard)
export const getAllUsers = async () => {
  const res = await api.get("/admin"); // backend: GET /api/admin
  return res.data;
};

// Lấy thông tin một người dùng (Profile.jsx)
export const getUser = async (id) => {
  const res = await api.get(`/admin/${id}`); // backend: GET /api/admin/{id}
  return res.data;
};

// Tạo người dùng mới (CreateUserForm.jsx)
export const createUser = async (data) => {
  const res = await api.post("/admin/create-account", data); // backend: POST /api/admin/create-account
  return res.data;
};

// Cập nhật người dùng (EditUserForm.jsx)
export const updateUser = async (id, data) => {
  const res = await api.put(`/admin/update/${id}`, data); // backend: PUT /api/admin/update/{id}
  return res.data;
};

// Khóa người dùng (AdminDashboard.jsx)
export const lockUser = async (id) => {
  const res = await api.put(`/admin/lock/${id}`); // backend: PUT /api/admin/lock/{id}
  return res.data;
};

// Mở khóa người dùng (AdminDashboard.jsx)
export const unlockUser = async (id) => {
  const res = await api.put(`/admin/unlock/${id}`); // backend: PUT /api/admin/unlock/{id}
  return res.data;
};

// Xóa người dùng (AdminDashboard.jsx)
export const deleteUser = async (id) => {
  await api.delete(`/admin/${id}`); // backend: DELETE /api/admin/{id}
};

// Tìm kiếm người dùng (nếu muốn, backend chưa có, có thể tạo thêm)
export const searchUsers = async (keyword) => {
  const res = await api.get(`/admin/search?keyword=${encodeURIComponent(keyword)}`); // cần backend hỗ trợ
  return res.data;
};
