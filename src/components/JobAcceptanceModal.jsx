import React, { useState } from "react";
import { updateAcceptanceStatus, reportUser } from "../services/workAcceptanceService.js";

export default function JobAcceptanceModal({ job, onClose, reloadJobs }) {
  const username = localStorage.getItem("username");
  const accountId = Number(localStorage.getItem("accountId"));
  const role = localStorage.getItem("role"); 
  const [loadingStatusId, setLoadingStatusId] = useState(null);
  const [loadingReportId, setLoadingReportId] = useState(null);

  const handleStatusChange = async (acceptance, newStatus) => {
    if (acceptance.accountId !== accountId)
      return alert("Chỉ bạn mới có thể chỉnh trạng thái của công việc này!");

    setLoadingStatusId(acceptance.id);
    try {
      const success = await updateAcceptanceStatus(job.id, acceptance.id, newStatus);
      if (success) {
        alert("Cập nhật trạng thái thành công");
        reloadJobs();
      }
    } catch (err) {
      alert("Cập nhật thất bại: " + err.message);
    } finally {
      setLoadingStatusId(null);
    }
  };

  const handleReport = async (reportedAccountId) => {
    const reason = prompt("Nhập lý do báo cáo:");
    if (!reason) return;

    setLoadingReportId(reportedAccountId);
    try {
      const success = await reportUser(reportedAccountId, reason);
      alert(success ? "Báo cáo thành công" : "Báo cáo thất bại");
      reloadJobs();
    } catch (err) {
      alert("Báo cáo thất bại: " + err.message);
    } finally {
      setLoadingReportId(null);
    }
  };

  const statusStyles = {
    PENDING: "bg-yellow-100 text-yellow-800",
    COMPLETED: "bg-green-100 text-green-800",
    CANCELLED: "bg-red-100 text-red-800",
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-11/12 md:w-2/3 lg:w-1/2 shadow-lg relative max-h-[90vh] overflow-y-auto">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 font-bold text-xl"
          onClick={onClose}
        >
          ×
        </button>

        <h2 className="text-2xl font-bold text-indigo-600 mb-2">{job.position}</h2>
        <p className="text-gray-600 mb-1"><strong>Công ty:</strong> {job.company}</p>
        <p className="text-gray-600 mb-1"><strong>Lương:</strong> {job.salary} VNĐ</p>
        <p className="text-gray-600 mb-2"><strong>Mô tả:</strong> {job.descriptionWork}</p>

        <h3 className="font-semibold mt-4 mb-2">Người nhận việc:</h3>
        <ul className="space-y-2">
          {job.acceptances?.map((a) => (
            <li
              key={a.id}
              className="flex items-center justify-between bg-gray-100 rounded p-2 gap-2"
            >
              <span className="flex-1">{a.accountUsername}</span>

              {/* Trạng thái cố định width + màu nền */}
              <span
                className={`w-28 text-center font-semibold rounded py-1 ${statusStyles[a.status] || ""}`}
              >
                {a.status}
              </span>

              <div className="flex items-center gap-2">
                {/* Chỉ user đã nhận công việc mới chỉnh trạng thái */}
                {a.accountId === accountId && (
                  <select
                    className="border rounded px-2 py-1"
                    value={a.status}
                    onChange={(e) => handleStatusChange(a, e.target.value)}
                    disabled={loadingStatusId === a.id}
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="COMPLETED">COMPLETED</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                )}

                {/* Báo cáo: Ẩn nếu ROLE_USER */}
                {role !== "ROLE_USER" && (
                  <button
                    className={`px-2 py-1 rounded text-white ${
                      loadingReportId === a.accountId
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-red-500 hover:bg-red-600"
                    }`}
                    onClick={() => handleReport(a.accountId)}
                    disabled={loadingReportId === a.accountId}
                  >
                    {loadingReportId === a.accountId ? "Đang báo cáo..." : "Báo cáo"}
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
