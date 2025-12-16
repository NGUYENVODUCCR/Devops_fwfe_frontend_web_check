import { useState, useEffect } from "react";
import {
  getAllWorks,
  createWork,
  updateWork,
  deleteWork,
} from "../../services/workService";
import { getAllAcceptances } from "../../services/workAcceptanceService";
import { getMyCompanies } from "../../services/companyService";

const WorkManager = () => {
  const [works, setWorks] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState("");

  const [showWorkModal, setShowWorkModal] = useState(false);
  const [workForm, setWorkForm] = useState({
    id: null,
    position: "",
    descriptionWork: "",
    maxAccepted: "",
    maxReceiver: "",
    salary: "",
  });

  const loadCompanies = async () => {
    try {
      const data = await getMyCompanies();
      setCompanies(data);
    } catch (e) {
      alert("Lỗi tải danh sách công ty: " + e);
    }
  };

  const loadWorks = async () => {
    try {
      const data = await getAllWorks();

      const worksWithAccepted = await Promise.all(
        data.map(async (w) => {
          const acceptances = await getAllAcceptances(w.id);
          return {
            ...w,
            currentAccepted: acceptances.length, 
          };
        })
      );

      setWorks(worksWithAccepted);
    } catch (e) {
      alert("Lỗi tải công việc: " + e);
    }
  };

  useEffect(() => {
    loadCompanies();
    loadWorks();
  }, []);

  const handleWorkSubmit = async (e) => {
    e.preventDefault();

    if (!selectedCompanyId) {
      alert("Bạn phải chọn công ty!");
      return;
    }

    try {
      const payload = {
        ...workForm,
        maxAccepted: workForm.maxAccepted === "" ? 0 : Number(workForm.maxAccepted),
        maxReceiver: workForm.maxReceiver === "" ? 0 : Number(workForm.maxReceiver),
        salary: workForm.salary === "" ? 0 : Number(workForm.salary),
        companyId: Number(selectedCompanyId),
      };

      if (workForm.id) {
        const updated = await updateWork(workForm.id, payload);
        setWorks(works.map((w) => (w.id === updated.id ? updated : w)));
      } else {
        const created = await createWork(payload);
        setWorks([...works, created]);
      }

      setShowWorkModal(false);
    } catch (e) {
      alert("Lỗi lưu công việc: " + e);
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

    setSelectedCompanyId(w.companyId || "");
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
        onClick={() => {
          setWorkForm({
            id: null,
            position: "",
            descriptionWork: "",
            maxAccepted: "",
            maxReceiver: "",
            salary: "",
          });
          setSelectedCompanyId("");
          setShowWorkModal(true);
        }}
      >
        Tạo công việc mới
      </button>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow-lg overflow-hidden">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-6 py-3">Vị trí</th>
              <th className="text-left px-6 py-3">Mô tả</th>
              <th className="text-left px-6 py-3">Số người nhận</th>
              <th className="text-left px-6 py-3">Số CV tối đa</th>
              <th className="text-left px-6 py-3">Lương</th>
              <th className="text-left px-6 py-3">Công ty</th>
              <th className="text-center px-6 py-3">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {works.map((w) => (
              <tr key={w.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4">{w.position || "-"}</td>
                <td className="px-6 py-4">{w.descriptionWork || "-"}</td>
                <td className="px-6 py-4">{w.currentAccepted ?? 0}</td>
                <td className="px-6 py-4">{w.maxReceiver ?? 0}</td>
                <td className="px-6 py-4">{w.salary ?? 0}</td>
                <td className="px-6 py-4">{w.company || "-"}</td>
                <td className="px-6 py-4 text-center">
                  <div className="inline-flex gap-2">
                    <button
                      className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-1 rounded-lg"
                      onClick={() => handleWorkEdit(w)}
                    >
                      Sửa
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-lg"
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
                <td colSpan={7} className="px-6 py-4 text-center text-gray-400">
                  Chưa có công việc nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal tạo/sửa công việc */}
      {showWorkModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">
              {workForm.id ? "Cập nhật công việc" : "Tạo công việc mới"}
            </h2>

            <form className="flex flex-col gap-4" onSubmit={handleWorkSubmit}>
              <select
                className="border p-3 rounded-md"
                required
                value={selectedCompanyId}
                onChange={(e) => setSelectedCompanyId(e.target.value)}
              >
                <option value="">-- Chọn công ty --</option>
                {companies.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Vị trí"
                className="border p-3 rounded-md"
                required
                value={workForm.position}
                onChange={(e) =>
                  setWorkForm({ ...workForm, position: e.target.value })
                }
              />

              <textarea
                placeholder="Mô tả công việc"
                className="border p-3 rounded-md"
                value={workForm.descriptionWork}
                onChange={(e) =>
                  setWorkForm({ ...workForm, descriptionWork: e.target.value })
                }
              />

              <div className="grid grid-cols-3 gap-4">
                <input
                  type="number"
                  placeholder="Số người nhận"
                  className="border p-3 rounded-md"
                  value={workForm.maxAccepted}
                  onChange={(e) =>
                    setWorkForm({ ...workForm, maxAccepted: e.target.value })
                  }
                />

                <input
                  type="number"
                  placeholder="Số CV tối đa"
                  className="border p-3 rounded-md"
                  value={workForm.maxReceiver}
                  onChange={(e) =>
                    setWorkForm({ ...workForm, maxReceiver: e.target.value })
                  }
                />

                <input
                  type="number"
                  placeholder="Lương"
                  className="border p-3 rounded-md"
                  value={workForm.salary}
                  onChange={(e) =>
                    setWorkForm({ ...workForm, salary: e.target.value })
                  }
                />
              </div>

              <div className="flex gap-4 mt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-md"
                >
                  Xác nhận
                </button>

                <button
                  type="button"
                  className="flex-1 bg-gray-400 text-white py-2 rounded-md"
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
