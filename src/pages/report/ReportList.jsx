import { useEffect, useState } from "react";
import { getUnresolvedReports } from "../../services/reportService";
import { lockUser, unlockUser } from "../../services/accountService";

const ReportList = () => {
  const [reports, setReports] = useState([]);
  const [message, setMessage] = useState(""); 
  const [searchUser, setSearchUser] = useState("");

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await getUnresolvedReports();
        setReports(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchReports();
  }, []);

  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hour = String(date.getHours()).padStart(2, "0");
    const minute = String(date.getMinutes()).padStart(2, "0");
    return `${day}/${month}/${year} ${hour}:${minute}`;
  }

  const filteredReports = reports.filter(
    (r) =>
      (r.reportedUsername?.toLowerCase() || "").includes(searchUser.toLowerCase()) ||
      (r.reporterUsername?.toLowerCase() || "").includes(searchUser.toLowerCase())
  );

  const handleLockUser = async (userId, isLocked) => {
    try {
      if (isLocked) {
        await unlockUser(userId);
        setMessage(`Mở khóa tài khoản thành công`);
      } else {
        await lockUser(userId);
        setMessage(`Khóa tài khoản thành công`);
      }

      const data = await getUnresolvedReports();
      setReports(data);

      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Lỗi lock/unlock:", err);
      setMessage("Lỗi khóa/mở khóa tài khoản");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Danh sách báo cáo</h1>

      <input
        type="text"
        placeholder="Lọc theo username..."
        className="border p-2 mb-4 w-full"
        value={searchUser}
        onChange={(e) => setSearchUser(e.target.value)}
      />

      {message && (
        <div className="mb-4 p-2 bg-blue-100 text-blue-800 rounded">{message}</div>
      )}

      {filteredReports.length === 0 && <p>Không có báo cáo nào</p>}

      <ul>
        {filteredReports.map((r) => (
          <li
            key={r.id}
            className="border p-2 mb-2 flex justify-between items-center"
          >
            <div>
              <p><strong>Người báo cáo:</strong> {r.reporterUsername}</p>
              <p><strong>Nhân sự bị báo cáo:</strong> {r.reportedUsername}</p>
              <p><strong>Lý do:</strong> {r.reason}</p>
              <p><strong>Thời gian:</strong> {formatDate(r.reportedAt)}</p>
            </div>
            <button
              onClick={() => handleLockUser(r.reportedId, r.reportedLocked)}
              style={{
                backgroundColor: r.reportedLocked ? "green" : "red",
                color: "white",
                padding: "6px 12px",
                border: "none",
                cursor: "pointer",
                borderRadius: "4px",
              }}
            >
              {r.reportedLocked ? "Mở khóa" : "Khóa"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReportList;
