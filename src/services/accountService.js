import api from "./api";

export const getAllUsers = async () => {
  const res = await api.get("/admin"); 
  return res.data;
};

export const getUser = async (id) => {
  const res = await api.get(`/admin/${id}`); 
  return res.data;
};

export const createUser = async (data) => {
  const res = await api.post("/admin/create-account", data); 
  return res.data;
};

export const updateUser = async (id, data) => {
  const res = await api.put(`/admin/update/${id}`, data); 
  return res.data;
};

export const lockUser = async (id) => {
  const res = await api.put(`/admin/lock/${id}`); 
  return res.data;
};

export const unlockUser = async (id) => {
  const res = await api.put(`/admin/unlock/${id}`);
  return res.data;
};

export const deleteUser = async (id) => {
  await api.delete(`/admin/${id}`); 
};

export const searchUsers = async (keyword) => {
  const res = await api.get(`/admin/search?keyword=${encodeURIComponent(keyword)}`);
  return res.data;
};
