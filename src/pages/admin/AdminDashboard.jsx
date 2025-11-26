import { useEffect, useState } from "react";
import {
  getAllUsers,
  deleteUser,
  lockUser,
  unlockUser,
  updateUser,
} from "../../services/accountService";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [nameInput, setNameInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  const fetchUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(
        data.map((u) => ({
          ...u,
          locked: u.locked ?? u.isLocked ?? false,
        }))
      );
    } catch (err) {
      console.error("Lỗi lấy danh sách:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa người dùng này?")) {
      try {
        await deleteUser(id);
        fetchUsers();
      } catch (err) {
        console.error("Xóa thất bại:", err);
      }
    }
  };

  const handleLockUnlock = async (user) => {
    try {
      if (user.locked) await unlockUser(user.id);
      else await lockUser(user.id);
      fetchUsers();
    } catch (err) {
      console.error("Lỗi:", err);
    }
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setNameInput(user.name);
    setEmailInput(user.email);
  };

  const saveEdit = async () => {
    try {
      await updateUser(editingUser.id, { name: nameInput, email: emailInput });
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      console.error("Lưu lỗi:", err);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      (u.name.toLowerCase().includes(search.toLowerCase()) ||
       u.email.toLowerCase().includes(search.toLowerCase())) &&
      (roleFilter === "" || u.role === roleFilter)
  );
  

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý người dùng</h1>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Tìm kiếm theo tên hoặc email..."
          className="w-full p-3 border rounded-lg shadow-sm focus:ring focus:ring-blue-300"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="p-3 border rounded-lg shadow-sm focus:ring focus:ring-blue-300"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="">Tất cả vai trò</option>
          <option value="ROLE_ADMIN">Admin</option>
          <option value="ROLE_USER">User</option>
          <option value="ROLE_MANAGER">Manager</option>
        </select>
      </div>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 text-gray-700 uppercase text-sm">
            <tr>
              <th className="px-4 py-3">Tên</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Trạng thái</th>
              <th className="px-4 py-3 w-48">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers
              .map((u, idx) => (
                <tr
                  key={u.id}
                  className={`border-t ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                >
                  <td className="px-4 py-3">{u.name}</td>
                  <td className="px-4 py-3">{u.email}</td>
                  <td className="px-4 py-3">{u.role}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded text-sm ${u.locked
                          ? "bg-red-200 text-red-600"
                          : "bg-green-200 text-green-600"
                        }`}
                    >
                      {u.locked ? "Đã khóa" : "Hoạt động"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col items-center justify-center gap-2">

                      <button
                        onClick={() => openEditModal(u)}
                        className="w-24 px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition"
                      >
                        Sửa
                      </button>

                      <button
                        onClick={() => handleLockUnlock(u)}
                        className={`w-24 px-3 py-1 rounded-lg text-white transition ${u.locked
                            ? "bg-green-500 hover:bg-green-600"
                            : "bg-yellow-500 hover:bg-yellow-600"
                          }`}
                      >
                        {u.locked ? "Mở khóa" : "Khóa"}
                      </button>

                      <button
                        onClick={() => handleDelete(u.id)}
                        className="w-24 px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
                      >
                        Xóa
                      </button>

                    </div>
                  </td>

                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-xl shadow-xl w-96 animate-fadeIn">
            <h2 className="text-xl font-bold mb-4 text-center">
              Chỉnh sửa người dùng
            </h2>

            <input
              type="text"
              className="w-full border p-3 rounded-lg mb-3"
              placeholder="Tên"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
            />

            <input
              type="email"
              className="w-full border p-3 rounded-lg mb-4"
              placeholder="Email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setEditingUser(null)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-100"
              >
                Hủy
              </button>
              <button
                onClick={saveEdit}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow transition"
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
