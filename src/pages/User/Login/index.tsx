import { ApiTwoTone, LockOutlined, UserOutlined } from '@ant-design/icons';
import { LoginForm, ProFormText } from '@ant-design/pro-components';
import { history, request, useModel } from '@umijs/max';
import { message, Tabs } from 'antd';
import React, { useState } from 'react';
import styles from './index.less';

// Cookie 工具函数
const cookieUtils = {
  set: (name: string, value: string, days: number = 7) => {
    const expires = new Date(
      Date.now() + days * 24 * 60 * 60 * 1000,
    ).toUTCString();
    document.cookie = `${name}=${value};expires=${expires};path=/`;
  },
  get: (name: string): string | null => {
    const match = document.cookie.match(
      new RegExp('(^| )' + name + '=([^;]+)'),
    );
    return match ? decodeURIComponent(match[2]) : null;
  },
  remove: (name: string) => {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
  },
};

// 管理员登录接口
interface AdminLoginResponse {
  success: boolean;
  data?: {
    token: string;
    user: {
      id: string;
      username: string;
      role: string;
      avatar?: string;
    };
  };
  message?: string;
}

const Login: React.FC = () => {
  const [type, setType] = useState<string>('account');
  const { setInitialState } = useModel('@@initialState');

  const handleSubmit = async (values: Record<string, any>) => {
    const { username, password } = values;

    try {
      // 发送登录请求 (假设你在 app.ts 配置了 baseURL: '/api')
      const response = await request<AdminLoginResponse>('/auth/admin/login', {
        method: 'POST',
        data: { username, password },
      });

      if (response.success && response.data) {
        message.success('登录成功！欢迎进入智慧水务管理系统');

        // 👇 改进 1：将 Token 存储到本地 (结合你在 app.ts 中的请求拦截器使用)
        localStorage.setItem('token', response.data.token);

        // 👇 改进 2：更新 Umi Max 的全局状态，让 Layout 和权限插件生效
        await setInitialState((s) => ({
          ...s,
          currentUser: response.data!.user,
        }));

        setTimeout(() => {
          history.replace('/dashboard');
        }, 100);
      } else {
        message.error(response.message || '登录失败，请检查用户名和密码');
      }
    } catch (error: any) {
      console.error('登录错误:', error);
      message.error(error.message || '登录失败，请检查网络或联系管理员');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.loginBox}>
          <LoginForm
            logo={
              <ApiTwoTone twoToneColor="#1677ff" style={{ fontSize: '48px' }} />
            }
            title="智慧水务管理后台"
            subTitle="竞赛展示版：多端同步的数字化供水管理平台"
            initialValues={{ autoLogin: true }}
            onFinish={handleSubmit}
            submitter={{ searchConfig: { submitText: '安全登录' } }}
          >
            <Tabs activeKey={type} onChange={setType} centered>
              <Tabs.TabPane key="account" tab={'管理员登录'} />
            </Tabs>

            {type === 'account' && (
              <>
                <ProFormText
                  name="username"
                  fieldProps={{ size: 'large', prefix: <UserOutlined /> }}
                  placeholder={'请输入管理员账号'}
                  rules={[{ required: true, message: '请输入账号!' }]}
                />
                <ProFormText.Password
                  name="password"
                  fieldProps={{ size: 'large', prefix: <LockOutlined /> }}
                  placeholder={'请输入密码'}
                  rules={[{ required: true, message: '请输入密码!' }]}
                />
              </>
            )}
            <div
              style={{
                marginBottom: 24,
                color: '#1677ff',
                textAlign: 'right',
                fontSize: '14px',
              }}
            >
              <span style={{ cursor: 'pointer' }}>联系系统管理员获取权限</span>
            </div>
          </LoginForm>
        </div>
      </div>

      <div className={styles.footer}>
        <p>© 2026 智慧水务管理系统 - 数据驱动城市未来</p>
        <p style={{ fontSize: '12px', opacity: 0.8 }}>
          数据源：微信小程序已连接
        </p>
      </div>
    </div>
  );
};

export default Login;
