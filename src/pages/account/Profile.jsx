import { useEffect, useState } from "react";
import { getUser } from "../../services/accountService";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const id = localStorage.getItem("userId");
        if (!id) {
          console.error("Không tìm thấy userId trong localStorage!");
          return;
        }

        const data = await getUser(id);
        setUser(data);
      } catch (err) {
        console.error("Lỗi tải thông tin cá nhân:", err);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const InfoTile = ({ icon, label, value, color }) => (
    <div className="flex items-center p-4 border-b">
      <span className={`text-2xl mr-4 ${color || "text-purple-600"}`}>
        {icon}
      </span>
      <div>
        <p className="font-semibold">{label}</p>
        <p className="text-gray-700">{value}</p>
      </div>
    </div>
  );

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-400 border-t-transparent"></div>
      </div>
    );

  if (!user)
    return (
      <div className="text-center mt-10 text-red-500">
        Không tải được thông tin tài khoản.
      </div>
    );

  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
      <div className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-400 rounded-xl shadow mb-6 text-center">
        <h1 className="text-white text-xl font-bold">Thông tin cá nhân</h1>
      </div>

      <div className="bg-purple-500 rounded-full w-28 h-28 flex items-center justify-center shadow-lg">
        <span className="text-white text-5xl">👤</span>
      </div>

      <h2 className="mt-4 text-xl font-semibold">{user.name}</h2>
      <p className="text-gray-600">{user.username}</p>

      <div className="bg-white w-full max-w-xl mt-6 rounded-xl shadow-lg overflow-hidden">
        <InfoTile icon={"📛"} label="Họ tên" value={user.name} />
        <InfoTile icon={"📧"} label="Email" value={user.email} />
        <InfoTile icon={"👤"} label="Tên đăng nhập" value={user.username} />
        <InfoTile
          icon={user.locked ? "🔒" : "🔓"}
          label="Trạng thái"
          value={user.locked ? "Bị khóa" : "Hoạt động"}
          color={user.locked ? "text-red-500" : "text-green-600"}
        />
      </div>
    </div>
  );
}
