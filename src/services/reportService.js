import api from "./api";

// Gửi report
export const reportUser = async (reporterUsername, data) => {
  const res = await api.post("/reports", data, {
    headers: { "X-Username": reporterUsername }
  });
  return res.data;
};

// Lấy report chưa giải quyết
export const getUnresolvedReports = async () => {
  const res = await api.get("/reports/unresolved");
  return res.data;
};
