import api from "./api";

/**
 * Lấy accountId và username từ localStorage
 * @returns {object} { accountId: number, username: string } hoặc null nếu không hợp lệ
 */
const getAccountInfo = () => {
  const accountId = Number(localStorage.getItem("accountId"));
  const username = localStorage.getItem("username");

  if (!accountId || !username) {
    console.error("❌ getAccountInfo: accountId hoặc username không hợp lệ!");
    return null;
  }

  return { accountId, username };
};

/**
 * 1. User nhận việc
 * @param {number} workId - ID công việc
 * @returns {object|null} dữ liệu backend trả về hoặc null nếu lỗi
 */
export const acceptWork = async (workId) => {
  const accountInfo = getAccountInfo();
  if (!accountInfo) return null;

  const { accountId, username } = accountInfo;

  try {
    const data = { workPostedId: workId, accountId };

    const res = await api.post(`/works/${workId}/acceptances`, data, {
      headers: { "X-Username": username },
    });

    console.log("✅ Nhận việc thành công:", res.data);
    return res.data;

  } catch (err) {
    console.error("❌ Lỗi nhận việc:", err.response || err);
    return null;
  }
};

/**
 * 2. Lấy tất cả người đã nhận việc của một job
 * @param {number} workId
 * @returns {Array}
 */
export const getAllAcceptances = async (workId) => {
  try {
    const res = await api.get(`/works/${workId}/acceptances`);
    return res.data;
  } catch (err) {
    console.error("❌ Lỗi lấy danh sách nhận việc:", err.response || err);
    return [];
  }
};

/**
 * 3. Lấy các job đã nhận theo user & status
 * @param {number} workId
 * @param {string} status - PENDING / COMPLETED / CANCELLED
 * @returns {Array} danh sách job
 */
export const getAcceptedJobsByStatus = async (workId, status) => {
  const accountInfo = getAccountInfo();
  if (!accountInfo) return [];

  const { accountId } = accountInfo;

  try {
    const res = await api.get(`/works/${workId}/acceptances/account/${accountId}/status/${status}`);
    return res.data;
  } catch (err) {
    console.error("❌ Lỗi lấy công việc đã nhận theo status:", err.response || err);
    return [];
  }
};

/**
 * 4. Cập nhật trạng thái công việc đã nhận
 * @param {number} workId
 * @param {number} acceptanceId
 * @param {string} status - PENDING / COMPLETED / CANCELLED
 * @returns {boolean} true nếu thành công
 */
export const updateAcceptanceStatus = async (workId, acceptanceId, status) => {
  const accountInfo = getAccountInfo();
  if (!accountInfo) return false;

  const { username } = accountInfo;

  try {
    const res = await api.put(
      `/works/${workId}/acceptances/${acceptanceId}/status`,
      { status },
      { headers: { "X-Username": username } }
    );

    console.log(`✅ Cập nhật trạng thái acceptance ${acceptanceId} → ${status}`, res.data);
    return true;
  } catch (err) {
    console.error("❌ Lỗi cập nhật trạng thái:", err.response || err);
    return false;
  }
};

/**
 * 5. Báo cáo người dùng
 * @param {number} reportedAccountId
 * @param {string} reason
 * @returns {boolean} true nếu báo cáo thành công
 */
export const reportUser = async (reportedAccountId, reason) => {
  const accountInfo = getAccountInfo();
  if (!accountInfo) return false;

  const { username } = accountInfo;

  try {
    const res = await api.post(
      `/reports`,
      { reportedAccountId, reason },
      { headers: { "X-Username": username } }
    );
    console.log("✅ Báo cáo người dùng thành công:", res.data);
    return true;
  } catch (err) {
    console.error("❌ Lỗi báo cáo người dùng:", err.response || err);
    return false;
  }
};
