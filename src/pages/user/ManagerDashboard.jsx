import { useState, useEffect } from "react";
import WorkManager from "../work/WorkManager";
import CompanyManager from "../company/CompanyManager";

export default function ManagerDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("company"); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
      } catch (err) {
        setError("Lỗi khi tải dữ liệu");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500 text-lg">Đang tải...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );

  return (
    <div className="flex flex-col h-screen">
      {/* Header / Tabs */}
      <header className="bg-white shadow p-4 flex items-center justify-center">
        <button
          className={`px-6 py-2 font-semibold rounded-t-lg ${
            activeTab === "company" ? "bg-purple-600 text-white" : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setActiveTab("company")}
        >
          🏢 Công ty
        </button>
        <button
          className={`px-6 py-2 font-semibold rounded-t-lg ml-2 ${
            activeTab === "work" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setActiveTab("work")}
        >
          💼 Công việc
        </button>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-auto bg-gray-100 p-6">
        {activeTab === "company" && (
          <section className="bg-white shadow rounded-lg p-4">
            <h2 className="text-2xl font-bold mb-4 text-purple-600">🏢 Quản lý Công ty</h2>
            <CompanyManager />
          </section>
        )}
        {activeTab === "work" && (
          <section className="bg-white shadow rounded-lg p-4">
            <h2 className="text-2xl font-bold mb-4 text-blue-600">💼 Quản lý Công việc</h2>
            <WorkManager />
          </section>
        )}
      </main>
    </div>
  );
}
