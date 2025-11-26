import { useEffect, useState } from "react";
import { getAllWorks } from "../../services/workService.js";

export default function UserDashboard() {
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");
  const role = token ? localStorage.getItem("role") : null;

  useEffect(() => {
    const fetchWorks = async () => {
      try {
        const data = await getAllWorks();
        setWorks(data);
      } catch (err) {
        console.error("Lỗi load công việc:", err);
        setError("Không thể tải công việc."); // Hiển thị lỗi nếu có lỗi khác ngoài 403
      } finally {
        setLoading(false);
      }
    };
    fetchWorks();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">
        {token ? `Xin chào ${role}` : "Danh sách công việc"}
      </h2>

      {loading ? (
        <p>Đang tải công việc...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : works.length === 0 ? (
        <p>Không có công việc nào hiển thị.</p>
      ) : (
        <ul className="space-y-2">
          {works.map((work) => (
            <li key={work.id} className="p-4 border rounded shadow-sm">
              <h3 className="font-semibold">{work.position}</h3>
              <p>{work.descriptionWork}</p>
              <p className="text-gray-500">Công ty: {work.company}</p>
              <p className="text-gray-500">Mức lương: {work.salary}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
