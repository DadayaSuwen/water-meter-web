import { request } from '@umijs/max';

/** * 后端需新增的管理员登录接口
 * 逻辑：校验用户名密码，返回同 1.1 节定义的 data 结构
 */
export async function adminLogin(body: API.LoginParams) {
  return request<{
    success: boolean;
    data: { token: string; user: API.CurrentUser };
  }>('/auth/admin/login', {
    // 预设路径
    method: 'POST',
    data: body,
  });
}

/** 获取当前用户信息 - 对应 API 文档 1.2 */
export async function getProfile() {
  return request<{ success: boolean; data: API.CurrentUser }>('/auth/profile', {
    method: 'GET',
  });
}
