import { request } from '@umijs/max';

/** 管理员登录接口 - 对应后端 POST /api/auth/admin/login */
export async function adminLogin(body: { username: string; password: string }) {
  return request<{
    success: boolean;
    data: { token: string; user: API.CurrentUser };
    message?: string;
  }>('/auth/admin/login', {
    method: 'POST',
    data: body,
  });
}

/** 获取当前用户信息 - 对应后端 GET /api/auth/profile */
export async function getProfile() {
  return request<{ success: boolean; data: API.CurrentUser }>(
    '/auth/admin/profile',
    {
      method: 'GET',
    },
  );
}

/** 验证Token - 对应后端 GET /api/auth/verify */
export async function verifyToken() {
  return request<{ success: boolean; data: { userId: string; role: string } }>(
    '/auth/verify',
    {
      method: 'GET',
    },
  );
}
