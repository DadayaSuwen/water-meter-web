import { LogoutOutlined } from '@ant-design/icons';
import type { RunTimeLayoutConfig } from '@umijs/max';
import { history } from '@umijs/max';
import { Dropdown } from 'antd';

/**
 * 1. 全局初始化数据 (真实鉴权模拟)
 */
export async function getInitialState(): Promise<{
  currentUser?: any;
}> {
  // 核心：系统加载时，去检查刚才在 Login 种下的 token
  const isLogin = localStorage.getItem('water_mock_token') === 'true';

  if (isLogin) {
    return {
      currentUser: {
        id: 'admin_001',
        username: '超级管理员 (admin)',
        role: 'ADMIN',
        avatar:
          'https://gw.alipayobjects.com/zos/antfincdn/XAoskVMBfL/BiazfanxmamNRoxxVxka.png',
      },
    };
  }

  // 如果没有 token，直接返回空，后续会被路由守卫拦截
  return {};
}

/**
 * 2. 布局配置 (Layout)
 */
export const layout: RunTimeLayoutConfig = ({
  initialState,
  setInitialState,
}) => {
  const isLoginPage = window.location.pathname === '/user/login';

  return {
    title: '智慧水务指挥后台',
    logo: 'https://img.alicdn.com/tfs/TB1YHEpwUT1gK0jSZFhXXaAtVXa-28-27.svg',
    layout: 'mix',
    navTheme: 'light',

    // 👇 核心：路由守卫。如果当前没用户数据且不在登录页，一律踢回登录页！
    onPageChange: () => {
      const { location } = history;
      if (!initialState?.currentUser && location.pathname !== '/user/login') {
        history.replace('/user/login');
      }
    },

    pure: isLoginPage,
    menuRender: isLoginPage ? false : undefined,
    headerRender: isLoginPage ? false : undefined,

    // 👇 核心：右上角头像与退出登录交互
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
                    // 1. 物理销毁本地 Token
                    localStorage.removeItem('water_mock_token');
                    // 2. 清空 Umi 内存状态
                    setInitialState({ currentUser: undefined });
                    // 3. 强行推回登录页
                    history.replace('/user/login');
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
