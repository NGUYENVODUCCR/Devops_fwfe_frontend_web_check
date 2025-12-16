import { useEffect, useState } from "react";
import { getAllWorks } from "../../services/workService.js";
import { acceptWork, getAllAcceptances } from "../../services/workAcceptanceService.js";
import { useNavigate } from "react-router-dom";
import JobAcceptanceModal from "../../components/JobAcceptanceModal.jsx";

export default function UserDashboard() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const username = localStorage.getItem("username");
  const accountId = Number(localStorage.getItem("accountId")) || null;

  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [loadingIndex, setLoadingIndex] = useState(null);

  const [selectedJobForModal, setSelectedJobForModal] = useState(null);
  const [selectedJobForDetail, setSelectedJobForDetail] = useState(null);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const data = await getAllWorks();

      const enriched = await Promise.all(
        data.map(async (job) => {
          let acceptedCount = 0;
          let acceptances = [];
          let hasAccepted = false;
          let myStatus = null;

          try {
            acceptances = await getAllAcceptances(job.id);
            acceptedCount = acceptances.length;

            if (accountId) {
              const myAcceptance = acceptances.find(a => a.accountId === accountId);
              hasAccepted = !!myAcceptance;
              myStatus = myAcceptance?.status || null;
            }
          } catch (err) {
            console.warn(`Không thể lấy nhận việc của job ${job.id}:`, err);
          }

          const posterUsername = job.createdByUsername?.trim() || "Người đăng ẩn danh";

          return {
            ...job,
            hasAccepted,
            myStatus,
            acceptedCount,
            acceptances,
            maxAssignees: job.maxReceiver || 2,
            descriptionWork: job.descriptionWork || "Không có mô tả",
            posterUsername,
          };
        })
      );

      setJobs(enriched);
      setFilteredJobs(enriched);
    } catch (err) {
      console.error("Lỗi tải công việc:", err);
      alert("Không thể tải danh sách công việc!");
    }
  };

  const filterJobs = (text) => {
    setSearch(text);
    const lower = text.toLowerCase();
    setFilteredJobs(
      jobs.filter(
        (job) =>
          job.position.toLowerCase().includes(lower) ||
          job.company.toLowerCase().includes(lower)
      )
    );
  };

  const handleAcceptWork = async (job, index = null) => {
    if (!accountId) return alert("Không xác định được tài khoản!");
    if (role !== "ROLE_USER") return alert("Chỉ dành cho User!");

    if (job.acceptedCount >= job.maxAssignees) {
      return alert("Công việc này đã đủ người nhận!");
    }

    if (index !== null) setLoadingIndex(index);

    try {
      const res = await acceptWork(job.id);
      if (!res || res.error) return alert(res.error || "Nhận việc thất bại!");

      const updated = jobs.map((j) =>
        j.id === job.id
          ? {
              ...j,
              hasAccepted: true,
              myStatus: "PENDING",
              acceptedCount: j.acceptedCount + 1,
              acceptances: [
                ...(j.acceptances || []),
                { accountId, accountUsername: username, status: "PENDING" }
              ]
            }
          : j
      );

      setJobs(updated);
      setFilteredJobs(updated);

      alert("Nhận việc thành công!");
    } catch (err) {
      console.error("Nhận việc lỗi:", err);
      alert("Không thể nhận việc.");
    } finally {
      if (index !== null) setLoadingIndex(null);
    }
  };

  const handleOpenModal = (job) => setSelectedJobForModal(job);
  const handleCloseModal = () => {
    setSelectedJobForModal(null);
    loadJobs();
  };

  const handleShowDetail = (job) => setSelectedJobForDetail(job);
  const handleCloseDetail = () => setSelectedJobForDetail(null);

  const getStatusDisplay = (status) => {
    switch (status) {
      case "PENDING":
        return { text: "Đang thực hiện", className: "text-green-600" };
      case "COMPLETED":
        return { text: "Đã hoàn thành", className: "text-yellow-600" };
      case "CANCELLED":
        return { text: "Đã hủy", className: "text-red-600" };
      default:
        return { text: "", className: "" };
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 p-6 shadow-md">
        <h1 className="text-2xl font-bold text-white">
          Xin chào, {username ?? "Guest"}
        </h1>

        <input
          type="text"
          value={search}
          onChange={(e) => filterJobs(e.target.value)}
          placeholder="Tìm kiếm công việc..."
          className="mt-4 w-full p-3 rounded-xl shadow focus:ring-2 focus:ring-indigo-400 text-gray-900"
        />
      </div>

      {/* Job list */}
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-700">Việc làm mới nhất</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job, index) => {
            const statusDisplay = getStatusDisplay(job.myStatus);
            const chatUsername = job.posterUsername;

            return (
              <div
                key={job.id}
                className="bg-white rounded-2xl shadow-lg p-5 border-l-4 border-indigo-500 hover:scale-[1.03] transition cursor-pointer"
                onClick={() => handleShowDetail(job)}
              >
                <h3 className="text-xl font-bold text-indigo-600">{job.position}</h3>
                <p className="text-gray-600 mt-1">Công ty: {job.company}</p>
                <p className="text-gray-600">Lương: {job.salary} VNĐ</p>

                {/* Trạng thái người dùng */}
                {role === "ROLE_USER" && (
                  <p className={`mt-1 font-semibold ${job.hasAccepted ? statusDisplay.className : "text-orange-500"}`}>
                    {job.hasAccepted ? statusDisplay.text : "Chưa nhận việc"}
                  </p>
                )}

                <div className="mt-4 flex gap-2">
                  {/* Nút Nhận việc */}
                  {role === "ROLE_USER" && !job.hasAccepted && (
                    <button
                      className={`px-4 py-2 rounded-lg text-white shadow ${loadingIndex === index ? "bg-gray-400" : "bg-green-500 hover:bg-green-600"}`}
                      disabled={loadingIndex === index}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAcceptWork(job, index);
                      }}
                    >
                      {loadingIndex === index ? "Đang xử lý..." : "Nhận việc"}
                    </button>
                  )}

                  {/* Nút Chat */}
                  {role === "ROLE_USER" && (
                    <button
                      className="px-4 py-2 rounded-lg text-white shadow bg-purple-500 hover:bg-purple-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate("/react/chat", { state: { receiverUsername: chatUsername } });
                      }}
                    >
                      Chat với {chatUsername}
                    </button>
                  )}

                  {/* Nút Check thông tin */}
                  {((role === "ROLE_USER" && job.hasAccepted) ||
                    role === "ROLE_ADMIN" ||
                    role === "ROLE_MANAGER") && (
                    <button
                      className="px-4 py-2 rounded-lg text-white shadow bg-blue-500 hover:bg-blue-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenModal(job);
                      }}
                    >
                      Check thông tin
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal */}
      {selectedJobForModal && (
        <JobAcceptanceModal
          job={selectedJobForModal}
          onClose={handleCloseModal}
          reloadJobs={loadJobs}
        />
      )}

      {/* Chi tiết công việc */}
      {selectedJobForDetail && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-11/12 md:w-2/3 lg:w-1/2 relative">
            <button
              className="absolute top-3 right-3 text-2xl font-bold text-gray-600"
              onClick={handleCloseDetail}
            >
              ×
            </button>

            <h2 className="text-2xl font-bold text-indigo-600">
              {selectedJobForDetail.position}
            </h2>
            <p className="text-gray-600 mt-2">
              <strong>Công ty:</strong> {selectedJobForDetail.company}
            </p>
            <p className="text-gray-600">
              <strong>Lương:</strong> {selectedJobForDetail.salary} VNĐ
            </p>
            <p className="text-gray-600 mt-1">
              <strong>Mô tả:</strong> {selectedJobForDetail.descriptionWork}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
