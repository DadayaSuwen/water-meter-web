import { ApiTwoTone, LockOutlined, UserOutlined } from '@ant-design/icons';
import { LoginForm, ProFormText } from '@ant-design/pro-components';
import { history, useModel } from '@umijs/max';
import { message, Tabs } from 'antd';
import React, { useState } from 'react';
import styles from './index.less'; // 完美保留您的样式文件

const Login: React.FC = () => {
  const [type, setType] = useState<string>('account');
  const { initialState, setInitialState } = useModel('@@initialState');

  // 👇 核心：替换掉原来的真实 API 请求，改为纯前端的强拦截逻辑
  const handleSubmit = async (values: Record<string, any>) => {
    const { username, password } = values;

    // 强制校验：必须且只能是 admin / admin
    if (username === 'admin' && password === 'admin') {
      message.success('登录成功！欢迎进入智慧水务管理系统');

      // 1. 在浏览器本地种下模拟 Token，配合 app.tsx 的路由守卫
      localStorage.setItem('water_mock_token', 'true');

      // 2. 注入全局用户状态，解锁系统菜单
      await setInitialState({
        ...initialState,
        currentUser: {
          id: 'admin_001',
          username: '超级管理员 (admin)',
          role: 'ADMIN',
          avatar:
            'https://gw.alipayobjects.com/zos/antfincdn/XAoskVMBfL/BiazfanxmamNRoxxVxka.png',
        },
      });

      // 3. 登录成功后强制跳转到数据大盘
      history.replace('/dashboard');
    } else {
      // 失败提示
      message.error('认证失败：账号或密码错误！(唯一测试账号为 admin)');
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
                  placeholder={'请输入管理员账号 (admin)'}
                  rules={[{ required: true, message: '请输入账号!' }]}
                />
                <ProFormText.Password
                  name="password"
                  fieldProps={{ size: 'large', prefix: <LockOutlined /> }}
                  placeholder={'请输入密码 (admin)'}
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
