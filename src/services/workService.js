  import api from "./api";

  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  // Helper build headers an toàn
  const buildHeaders = (extraHeaders = {}) => {
    const headers = {};
    if (token) headers.Authorization = `Bearer ${token}`;
    if (role) headers["X-Role"] = role;
    return { ...headers, ...extraHeaders };
  };

  /**
   * Lấy tất cả công việc (guest hoặc login)
   */
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
      // Guest hoặc backend trả 403 → trả mảng rỗng
      if (err.response?.status === 403) return [];
      throw err;
    }
  };

  /**
   * Lấy chi tiết 1 công việc theo id
   */
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

  /**
   * Tạo công việc mới
   */
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

  /**
   * Cập nhật công việc
   */
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

  /**
   * Xóa công việc
   */
  export const deleteWork = async (id) => {
    try {
      await api.delete(`/works-posted/${id}`, { headers: buildHeaders({ "X-Username": username }) });
    } catch (err) {
      console.error(`Lỗi khi xóa công việc id=${id}:`, err);
      throw err;
    }
  };

  /**
   * Tìm kiếm công việc theo từ khóa
   */
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
