import { useState } from "react";
import { reportUser } from "../../services/reportService";

const ReportForm = () => {
  const role = localStorage.getItem("role");
  if (role === "ROLE_USER") return null; 

  const [form, setForm] = useState({ targetUsername: "", reason: "" });
  const [loading, setLoading] = useState(false);
  const reporterUsername = localStorage.getItem("username");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await reportUser(reporterUsername, form);
      alert("Báo cáo đã gửi!");
      setForm({ targetUsername: "", reason: "" });
    } catch (err) {
      console.error(err);
      alert("Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-md">
      <h1 className="text-xl font-bold mb-4">Báo cáo người dùng</h1>
      <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Tên người bị báo cáo"
          className="border p-2 rounded"
          value={form.targetUsername}
          onChange={(e) => setForm({ ...form, targetUsername: e.target.value })}
        />
        <textarea
          placeholder="Lý do"
          className="border p-2 rounded"
          value={form.reason}
          onChange={(e) => setForm({ ...form, reason: e.target.value })}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? "Đang gửi..." : "Gửi báo cáo"}
        </button>
      </form>
    </div>
  );
};

export default ReportForm;
