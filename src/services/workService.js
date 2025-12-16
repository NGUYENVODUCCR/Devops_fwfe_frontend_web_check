  import api from "./api";

  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  const buildHeaders = (extraHeaders = {}) => {
    const headers = {};
    if (token) headers.Authorization = `Bearer ${token}`;
    if (role) headers["X-Role"] = role;
    return { ...headers, ...extraHeaders };
  };

  export const getAllWorks = async () => {
    try {
      const res = await api.get("/works-posted", { headers: buildHeaders() });
      return res.data.map((e) => ({
        id: e.id,
        position: e.position,
        descriptionWork: e.descriptionWork,
        salary: e.salary,
        companyId: e.companyId,
        company: e.companyName,
        createdByUsername: e.createdByUsername,
      }));
    } catch (err) {
      console.error("Lỗi khi load tất cả công việc:", err);
      if (err.response?.status === 403) return [];
      throw err;
    }
  };

  export const getWork = async (id) => {
    try {
      const res = await api.get(`/works-posted/${id}`, { headers: buildHeaders() });
      const e = res.data;
      return {
        id: e.id,
        position: e.position,
        descriptionWork: e.descriptionWork,
        salary: e.salary,
        companyId: e.companyId,
        company: e.companyName,
        createdByUsername: e.createdByUsername,
      };
    } catch (err) {
      console.error(`Lỗi khi load chi tiết công việc id=${id}:`, err);
      if (err.response?.status === 403) return null;
      throw err;
    }
  };

  export const createWork = async (data) => {
    try {
      return await api.post("/works-posted", data, {
        headers: buildHeaders({ "X-Username": username }),
      });
    } catch (err) {
      console.error("Lỗi khi tạo công việc:", err);
      throw err;
    }
  };

  export const updateWork = async (id, data) => {
    try {
      return await api.put(`/works-posted/${id}`, data, {
        headers: buildHeaders({ "X-Username": username }),
      });
    } catch (err) {
      console.error(`Lỗi khi cập nhật công việc id=${id}:`, err);
      throw err;
    }
  };

  export const deleteWork = async (id) => {
    try {
      await api.delete(`/works-posted/${id}`, { headers: buildHeaders({ "X-Username": username }) });
    } catch (err) {
      console.error(`Lỗi khi xóa công việc id=${id}:`, err);
      throw err;
    }
  };

  export const searchWorks = async (keyword) => {
    try {
      const res = await api.get(`/works-posted/search?keyword=${encodeURIComponent(keyword)}`, {
        headers: buildHeaders(),
      });
      return res.data.map((e) => ({
        id: e.id,
        position: e.position,
        descriptionWork: e.descriptionWork,
        salary: e.salary,
        companyId: e.companyId,
        company: e.companyName,
        createdByUsername: e.createdByUsername,
      }));
    } catch (err) {
      console.error("Lỗi khi tìm kiếm công việc:", err);
      if (err.response?.status === 403) return [];
      throw err;
    }
  };
