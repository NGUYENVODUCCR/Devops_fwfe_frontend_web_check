import api from "./api";

export const reportUser = async (reporterUsername, data) => {
  const res = await api.post("/reports", data, {
    headers: { "X-Username": reporterUsername }
  });
  return res.data;
};

export const getUnresolvedReports = async () => {
  const res = await api.get("/reports/unresolved");
  return res.data;
};
