import api from "./api";

export const getAllCompanies = async () => {
  const res = await api.get("/companies");
  return res.data;
};

export const getCompany = async (id) => {
  const res = await api.get(`/companies/${id}`);
  return res.data;
};

export const createCompany = async (data) => {
  const res = await api.post("/companies", data);
  return res.data;
};

export const updateCompany = async (id, data) => {
  const res = await api.put(`/companies/${id}`, data);
  return res.data;
};

export const deleteCompany = async (id) => {
  await api.delete(`/companies/${id}`);
};

export const searchCompanies = async (keyword) => {
  const res = await api.get(`/companies/search?keyword=${encodeURIComponent(keyword)}`);
  return res.data;
};

export const getMyCompanies = async () => {
  const res = await api.get("/companies/my"); 
  return res.data;
};