import axios from "axios";

const api = axios.create({
  baseURL: "https://fwfe.duckdns.org/api",
  withCredentials: true, 
  headers: {
    "Content-Type": "application/json", 
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;

  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");

  if (username) config.headers["X-Username"] = username;
  if (role) config.headers["X-Role"] = role;

  return config;
});

export default api;
