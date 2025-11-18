import { useState, useEffect } from "react";
import {
  getAllWorks,
  createWork,
  updateWork,
  deleteWork,
} from "../../services/workService";

const WorkManager = () => {
  const [works, setWorks] = useState([]);
  const [showWorkModal, setShowWorkModal] = useState(false);
  const [workForm, setWorkForm] = useState({
    id: null,
    position: "",
    descriptionWork: "",
    maxAccepted: "",
    maxReceiver: "",
    salary: "",
  });

  const loadWorks = async () => {
    try {
      const data = await getAllWorks();
      setWorks(data);
    } catch (e) {
      alert("Lỗi tải công việc: " + e);
    }
  };

  useEffect(() => {
    loadWorks();
  }, []);

  const handleWorkSubmit = async (e) => {
    e.preventDefault();
    try {
      // Chuyển "" sang số 0 để gửi backend
      const payload = {
        ...workForm,
        maxAccepted: workForm.maxAccepted === "" ? 0 : Number(workForm.maxAccepted),
        maxReceiver: workForm.maxReceiver === "" ? 0 : Number(workForm.maxReceiver),
        salary: workForm.salary === "" ? 0 : Number(workForm.salary),
        companyId: workForm.companyId || 1, // thêm companyId, mặc định 1 nếu chưa chọn
      };
  
      let res;
      if (workForm.id) {
        res = await updateWork(workForm.id, payload);
        setWorks(works.map((w) => (w.id === res.id ? res : w)));
      } else {
        res = await createWork(payload);
        setWorks([...works, res]);
      }
      setShowWorkModal(false);
    } catch (err) {
      console.error(err);
      alert("Lỗi lưu công việc: " + err.message);
    }
  };
  

  const handleWorkEdit = (w) => {
    setWorkForm({
      id: w.id,
      position: w.position || "",
      descriptionWork: w.descriptionWork || "",
      maxAccepted: w.maxAccepted ?? "",
      maxReceiver: w.maxReceiver ?? "",
      salary: w.salary ?? "",
    });
    setShowWorkModal(true);
  };

  const handleWorkDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa công việc này?")) return;
    try {
      await deleteWork(id);
      setWorks(works.filter((w) => w.id !== id));
    } catch (e) {
      alert("Xóa thất bại: " + e);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-4xl font-extrabold mb-6 text-gray-800">Quản lý Công việc</h1>

      <button
        className="mb-6 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-2 rounded-lg shadow-md transition"
        onClick={() =>
          setWorkForm({ id: null, position: "", descriptionWork: "", maxAccepted: "", maxReceiver: "", salary: "" }) ||
          setShowWorkModal(true)
        }
      >
        Tạo công việc mới
      </button>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow-lg overflow-hidden">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-6 py-3 text-gray-700 font-medium uppercase tracking-wider">Vị trí</th>
              <th className="text-left px-6 py-3 text-gray-700 font-medium uppercase tracking-wider">Số người nhận</th>
              <th className="text-left px-6 py-3 text-gray-700 font-medium uppercase tracking-wider">Số người nhận CV</th>
              <th className="text-left px-6 py-3 text-gray-700 font-medium uppercase tracking-wider">Lương</th>
              <th className="text-center px-6 py-3 text-gray-700 font-medium uppercase tracking-wider">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {works.map((w) => (
              <tr key={w.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 whitespace-nowrap text-gray-800 font-medium">{w.position || "-"}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-600">{w.maxAccepted ?? "-"}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-600">{w.maxReceiver ?? "-"}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-600">{w.salary ?? "-"}</td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="inline-flex gap-2">
                    <button
                      className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-1 rounded-lg shadow-md transition duration-200"
                      onClick={() => handleWorkEdit(w)}
                    >
                      Sửa
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-lg shadow-md transition duration-200"
                      onClick={() => handleWorkDelete(w.id)}
                    >
                      Xóa
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {works.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-400">
                  Chưa có công việc nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>


      {showWorkModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">{workForm.id ? "Cập nhật công việc" : "Tạo công việc mới"}</h2>
            <form className="flex flex-col gap-4" onSubmit={handleWorkSubmit}>
              <input
                type="text"
                placeholder="Vị trí"
                className="border p-3 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
                required
                value={workForm.position}
                onChange={(e) => setWorkForm({ ...workForm, position: e.target.value })}
              />
              <textarea
                placeholder="Mô tả"
                className="border p-3 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
                value={workForm.descriptionWork}
                onChange={(e) => setWorkForm({ ...workForm, descriptionWork: e.target.value })}
              />
              <div className="grid grid-cols-3 gap-4">
                <input
                  type="number"
                  placeholder="Số người nhận"
                  className="border p-3 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  value={workForm.maxAccepted}
                  onChange={(e) => setWorkForm({ ...workForm, maxAccepted: e.target.value })}
                />
                <input
                  type="number"
                  placeholder="Số người nhận CV"
                  className="border p-3 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  value={workForm.maxReceiver}
                  onChange={(e) => setWorkForm({ ...workForm, maxReceiver: e.target.value })}
                />
                <input
                  type="number"
                  placeholder="Lương"
                  className="border p-3 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  value={workForm.salary}
                  onChange={(e) => setWorkForm({ ...workForm, salary: e.target.value })}
                />
              </div>
              <div className="flex gap-4 mt-4">
                <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">
                  Xác nhận
                </button>
                <button
                  type="button"
                  className="flex-1 bg-gray-400 text-white py-2 rounded-md hover:bg-gray-500 transition"
                  onClick={() => setShowWorkModal(false)}
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkManager;
