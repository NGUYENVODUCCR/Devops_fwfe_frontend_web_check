import { useEffect, useState } from "react";
import {
  getAllCompanies,
  createCompany,
  updateCompany,
  deleteCompany,
  searchCompanies,
  getCompany,
} from "../../services/companyService";

const CompanyManager = () => {
  const [companies, setCompanies] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [formId, setFormId] = useState(null);
  const [formName, setFormName] = useState("");
  const [formType, setFormType] = useState("");
  const [formAddress, setFormAddress] = useState("");
  const [formDescription, setFormDescription] = useState("");

  const [detailCompany, setDetailCompany] = useState(null);

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const data = await getAllCompanies();
      setCompanies(data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleSearch = async () => {
    if (!search.trim()) return fetchCompanies();

    setLoading(true);
    try {
      const data = await searchCompanies(search);
      setCompanies(data);
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormId(null);
    setFormName("");
    setFormType("");
    setFormAddress("");
    setFormDescription("");
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      name: formName,
      type: formType,
      address: formAddress,
      descriptionCompany: formDescription,
    };

    try {
      if (formId) {
        await updateCompany(formId, payload);
      } else {
        await createCompany(payload);
      }
      await fetchCompanies();
      resetForm();
    } catch (err) {
      console.error("Submit error:", err);
      alert("Lỗi khi gửi dữ liệu!");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (company) => {
    setFormId(company.id);
    setFormName(company.name || "");
    setFormType(company.type || "");
    setFormAddress(company.address || "");
    setFormDescription(company.descriptionCompany || "");
    setShowForm(true);

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa công ty này?")) return;

    try {
      await deleteCompany(id);
      await fetchCompanies();
    } catch (err) {
      console.error("Delete error:", err);
      alert("Xóa thất bại!");
    }
  };

  const handleViewDetail = async (id) => {
    try {
      const data = await getCompany(id);
      setDetailCompany(data);
    } catch (err) {
      console.error("Detail error:", err);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Quản lý công ty</h1>

      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="mb-6 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-lg shadow"
        >
          ➕ Tạo công ty mới
        </button>
      )}

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 mb-8"
        >
          <h2 className="text-2xl font-semibold mb-5 text-gray-800">
            {formId ? "Chỉnh sửa công ty" : "Tạo công ty mới"}
          </h2>

          {/* 3 ô nằm cùng hàng — giống Flutter */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="font-medium mb-1">Tên công ty</label>
              <input
                className="border p-3 rounded-lg shadow-sm w-full"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                required
                placeholder="Nhập tên công ty..."
              />
            </div>

            <div>
              <label className="font-medium mb-1">Loại hình</label>
              <input
                className="border p-3 rounded-lg shadow-sm w-full"
                value={formType}
                onChange={(e) => setFormType(e.target.value)}
                required
                placeholder="Công nghệ, thương mại..."
              />
            </div>

            <div>
              <label className="font-medium mb-1">Địa chỉ</label>
              <input
                className="border p-3 rounded-lg shadow-sm w-full"
                value={formAddress}
                onChange={(e) => setFormAddress(e.target.value)}
                required
                placeholder="Nhập địa chỉ..."
              />
            </div>
          </div>

          <div className="flex flex-col mt-5">
            <label className="font-medium mb-1">Mô tả</label>
            <textarea
              className="border p-3 rounded-lg shadow-sm w-full min-h-[90px]"
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              placeholder="Mô tả về công ty..."
            />
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg shadow w-full"
            >
              {formId ? "Cập nhật" : "Tạo mới"}
            </button>

            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-500 hover:bg-gray-600 text-white px-5 py-3 rounded-lg shadow w-full"
            >
              Hủy
            </button>
          </div>
        </form>
      )}

      {/* SEARCH */}
      <div className="flex gap-3 mb-4">
        <input
          type="text"
          className="border p-3 rounded-lg flex-1"
          placeholder="Tìm kiếm công ty..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          Tìm
        </button>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto bg-white shadow rounded">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left">Tên</th>
              <th className="px-6 py-3 text-left">Loại hình</th>
              <th className="px-6 py-3 text-left">Địa chỉ</th>
              <th className="px-6 py-3 text-center">Hành động</th>
            </tr>
          </thead>

          <tbody>
            {companies.map((c) => (
              <tr key={c.id} className="border-t">
                <td className="px-6 py-3">{c.name}</td>
                <td className="px-6 py-3">{c.type}</td>
                <td className="px-6 py-3">{c.address}</td>

                <td className="px-6 py-3 text-center flex gap-2 justify-center">
                  <button
                    onClick={() => handleViewDetail(c.id)}
                    className="bg-blue-500 text-white px-3 py-1 rounded-md"
                  >
                    Xem
                  </button>
                  <button
                    onClick={() => handleEdit(c)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded-md"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded-md"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}

            {companies.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center p-4 text-gray-500">
                  Không có dữ liệu
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* DETAIL MODAL */}
      {detailCompany && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
            <h2 className="text-2xl font-bold mb-4">{detailCompany.name}</h2>
            <p><strong>Loại hình:</strong> {detailCompany.type}</p>
            <p><strong>Địa chỉ:</strong> {detailCompany.address}</p>
            <p><strong>Mô tả:</strong> {detailCompany.descriptionCompany}</p>

            <button
              onClick={() => setDetailCompany(null)}
              className="absolute top-2 right-2 px-3 py-1 bg-gray-300 rounded"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyManager;
