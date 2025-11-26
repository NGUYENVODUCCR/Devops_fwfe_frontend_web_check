import api from "./api";

// Login
export const login = async (username, password) => {
  const res = await api.post("/auth/login", { username, password });
  localStorage.setItem("token", res.data.token);
  localStorage.setItem("username", res.data.username);
  localStorage.setItem("role", res.data.role);
  localStorage.setItem("accountId", res.data.id);
  return res.data;
};

// Logout
export const logout = async () => {
  await api.post("/auth/logout");
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  localStorage.removeItem("role");
};

// Register
export const register = async (data) => {
  const res = await api.post("/auth/user/register", data);
  return res.data;
};

// Validate token
export const validateToken = async () => {
  const res = await api.get("/auth/validate");
  return res.data;
};

// Forgot password
export const forgotPassword = async (email) => {
  const res = await api.post("/auth/forgot-password", { email });
  return res.data;
};

// Reset password
export const resetPassword = async (token, newPassword) => {
  const res = await api.post("/auth/reset-password", { token, password: newPassword });
  return res.data;
};
