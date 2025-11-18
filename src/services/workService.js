import axios from "axios";

// Lấy token từ localStorage (hoặc bạn lưu token ở đâu)
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username"); // lưu username khi login
  const role = localStorage.getItem("role"); // lưu role khi login

  if (!token || !username || !role) {
    throw new Error("Chưa có token hoặc thông tin user");
  }

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    "X-Username": username,
    "X-Role": role,
  };
};

const API_BASE_URL = "https://fwfe.duckdns.org/api";
const BASE_URL = `${API_BASE_URL}/works-posted`;

export const getAllWorks = async () => {
  const headers = getAuthHeaders();
  const res = await axios.get(BASE_URL, { headers });
  return res.data;
};

export const createWork = async (data) => {
  const headers = getAuthHeaders();
  const res = await axios.post(BASE_URL, data, { headers });
  return res.data;
};

export const updateWork = async (id, data) => {
  const headers = getAuthHeaders();
  const res = await axios.put(`${BASE_URL}/${id}`, data, { headers });
  return res.data;
};

export const deleteWork = async (id) => {
  const headers = getAuthHeaders();
  await axios.delete(`${BASE_URL}/${id}`, { headers });
};
