// src/services/companyService.js
import api from "./api";

/**
 * Lấy tất cả công ty
 */
export const getAllCompanies = async () => {
  const res = await api.get("/companies");
  return res.data;
};

/**
 * Lấy công ty theo id
 */
export const getCompany = async (id) => {
  const res = await api.get(`/companies/${id}`);
  return res.data;
};

/**
 * Tạo công ty mới
 */
export const createCompany = async (data) => {
  const res = await api.post("/companies", data);
  return res.data;
};

/**
 * Cập nhật công ty theo id
 */
export const updateCompany = async (id, data) => {
  const res = await api.put(`/companies/${id}`, data);
  return res.data;
};

/**
 * Xóa công ty theo id
 */
export const deleteCompany = async (id) => {
  await api.delete(`/companies/${id}`);
};

/**
 * Tìm kiếm công ty theo từ khóa
 */
export const searchCompanies = async (keyword) => {
  const res = await api.get(`/companies/search?keyword=${encodeURIComponent(keyword)}`);
  return res.data;
};

/**
 * Lấy các công ty của user hiện tại
 * 🔥 Hàm dùng cho dropdown tạo công việc
 */
export const getMyCompanies = async () => {
  const res = await api.get("/companies/my"); // endpoint bạn backend cần hỗ trợ
  return res.data;
};