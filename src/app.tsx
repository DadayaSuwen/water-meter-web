// src/app.tsx
import { LogoutOutlined } from '@ant-design/icons';
import type { RequestConfig, RunTimeLayoutConfig } from '@umijs/max';
import { history, request as umiRequest } from '@umijs/max';
import { Dropdown } from 'antd';

// 请确保这个路径与你实际的登录页路由完全一致！
// 如果你的路由表里写的是 '/login'，请把这里改成 '/login'
const LOGIN_PATH = '/user/login';

// ================== 请求配置 ==================
export const request: RequestConfig = {
  baseURL: '/api',
  timeout: 10000,
  requestInterceptors: [
    (config: any) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
  ],
};

// ================== 强化的获取用户信息方法 ==================
const fetchUserInfo = async () => {
  const token = localStorage.getItem('token');

  // 1. 如果本地根本没有 token，直接判定未登录，不用发请求了
  if (!token) {
    console.warn('[权限校验] 本地无 Token，跳过请求');
    return undefined;
  }

  try {
    console.log('[权限校验] 正在携带 Token 请求用户信息...');
    // 因为在应用刚刷新时，Umi 的全局 request 配置可能还没初始化完毕！
    const response = await umiRequest('/auth/admin/profile', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.success && response.data) {
      console.log('[权限校验] 成功获取到用户信息:', response.data);
      return response.data;
    }

    console.warn('[权限校验] 后端返回失败:', response);
    return undefined;
  } catch (error) {
    console.error('[权限校验] 请求用户信息报错 (Token可能已失效):', error);
    localStorage.removeItem('token');
    return undefined;
  }
};

/**
 * 1. 全局初始化数据
 */
export async function getInitialState(): Promise<{
  currentUser?: any;
  fetchUserInfo?: () => Promise<any>;
}> {
  const { location } = history;

  // 如果当前不在登录页，执行状态恢复
  if (location.pathname !== LOGIN_PATH) {
    const currentUser = await fetchUserInfo();
    return {
      fetchUserInfo,
      currentUser,
    };
  }

  return {
    fetchUserInfo,
  };
}

/**
 * 2. 布局配置 (Layout)
 */
export const layout: RunTimeLayoutConfig = ({
  initialState,
  setInitialState,
}) => {
  const isLoginPage = window.location.pathname === LOGIN_PATH;

  return {
    title: '智慧水务指挥后台',
    logo: 'https://img.alicdn.com/tfs/TB1YHEpwUT1gK0jSZFhXXaAtVXa-28-27.svg',
    layout: 'mix',
    navTheme: 'light',

    onPageChange: () => {
      const { location } = history;
      // 如果没有用户信息，且当前不在登录页，则踢回登录页
      if (!initialState?.currentUser && location.pathname !== LOGIN_PATH) {
        console.warn(
          `[路由守卫] 未获取到 currentUser，强制重定向至 ${LOGIN_PATH}`,
        );
        history.replace(LOGIN_PATH);
      }
    },

    pure: isLoginPage,
    menuRender: isLoginPage ? false : undefined,
    headerRender: isLoginPage ? false : undefined,

    avatarProps: {
      src: initialState?.currentUser?.avatar || undefined,
      title: initialState?.currentUser?.username || '未登录',
      render: (_, dom) => {
        return (
          <Dropdown
            menu={{
              items: [
                {
                  key: 'logout',
                  icon: <LogoutOutlined />,
                  label: '退出安全系统',
                  onClick: () => {
                    localStorage.removeItem('token');
                    setInitialState((s) => ({ ...s, currentUser: undefined }));
                    history.replace(LOGIN_PATH);
                  },
                },
              ],
            }}
          >
            {dom}
          </Dropdown>
        );
      },
    },

    footerRender: () => (
      <div
        style={{
          textAlign: 'center',
          padding: '20px 0',
          color: 'rgba(0,0,0,0.45)',
        }}
      >
        © 2026 智慧水务管理系统 · 竞赛专属版本
      </div>
    ),
  };
};
