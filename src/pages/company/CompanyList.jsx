import { useEffect, useState } from "react";
import { getAllCompanies, getCompany } from "../../services/companyService";

export default function CompanyList() {
  const [allCompanies, setAllCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCompany, setSelectedCompany] = useState(null);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const data = await getAllCompanies();
      console.log("DATA BACKEND:", data);
      
      const companies = Array.isArray(data) ? data : data.data || [];
      setAllCompanies(companies);
      setFilteredCompanies(companies);
    } catch (err) {
      console.error("Lỗi fetch công ty:", err);
      alert("Không thể tải danh sách công ty. Kiểm tra console.");
    } finally {
      setLoading(false);
    }
  };

  // Filter search
  const filterSearch = (value) => {
    setSearch(value);
    const lowerValue = value.toLowerCase();
    const result = allCompanies.filter((c) => {
      const name = c.name || c.companyName || "";
      const type = c.type || c.companyType || "";
      return name.toLowerCase().includes(lowerValue) || type.toLowerCase().includes(lowerValue);
    });
    setFilteredCompanies(result);
  };

  const openDetail = async (id) => {
    try {
      const detail = await getCompany(id);
      setSelectedCompany(detail);
    } catch (err) {
      console.error("Lỗi tải chi tiết công ty:", err);
      alert("Không thể tải chi tiết công ty");
    }
  };

  const closeModal = () => setSelectedCompany(null);

  return (
    <div className="p-6">
      {/* AppBar */}
      <div
        className="p-4 rounded-lg mb-4 text-white font-semibold text-lg"
        style={{ background: "linear-gradient(45deg, #B84DF1, #4ED0EB)" }}
      >
        Danh sách công ty
      </div>

      {/* Search bar */}
      <input
        value={search}
        onChange={(e) => filterSearch(e.target.value)}
        placeholder="Tìm công ty..."
        className="w-full p-3 rounded-lg border mb-4 shadow-sm"
      />

      {/* Body */}
      {loading ? (
        <p className="text-center">Đang tải...</p>
      ) : filteredCompanies.length === 0 ? (
        <p className="text-center text-gray-500">Không có công ty nào phù hợp</p>
      ) : (
        <div className="space-y-3">
          {filteredCompanies.map((c) => {
            const displayName = c.name || c.companyName || "";
            const displayType = c.type || c.companyType || "";
            return (
              <div
                key={c.id}
                className="p-4 rounded-lg border shadow-sm bg-white cursor-pointer hover:bg-gray-50 flex justify-between items-center"
                onClick={() => openDetail(c.id)}
              >
                <div>
                  <div className="text-lg font-semibold">{displayName}</div>
                  <div className="text-gray-500">{displayType}</div>
                </div>
                <span className="text-gray-400 text-xl">›</span>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal hiển thị chi tiết công ty */}
      {selectedCompany && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-full">
            <h2 className="text-xl font-bold mb-4">{selectedCompany.name || selectedCompany.companyName}</h2>
            <p><strong>Loại hình:</strong> {selectedCompany.type || selectedCompany.companyType}</p>
            <p><strong>Người tạo:</strong> {selectedCompany.createdByUsername || "-"}</p>
            <p><strong>Địa chỉ:</strong> {selectedCompany.address || "-"}</p>
            <p><strong>Mô tả:</strong> {selectedCompany.descriptionCompany || selectedCompany.description || "-"}</p>
            <button
              onClick={closeModal}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
