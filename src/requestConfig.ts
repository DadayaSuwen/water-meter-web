import { history, RequestConfig } from '@umijs/max';
import { message } from 'antd';

export const requestConfig: RequestConfig = {
  // 对应 API 文档中的基础信息
  baseURL: 'http://1.14.162.29:7001/api',
  timeout: 10000,

  // 请求拦截器：自动附加 Token
  requestInterceptors: [
    (config: any) => {
      const token = localStorage.getItem('token');
      if (token && config.headers) {
        config.headers['Authorization'] = `Bearer ${token}`; // 符合认证说明 7.2
      }
      return config;
    },
  ],

  // 响应拦截器：统一处理成功与错误格式
  responseInterceptors: [
    (response: any) => {
      const { data } = response;

      // 检查通用响应格式
      if (data && data.success === false) {
        message.error(data.message || '请求失败');

        // 处理认证错误 (HTTP 401 逻辑)
        if (response.status === 401) {
          history.push('/user/login');
        }
        return Promise.reject(new Error(data.message));
      }
      return response;
    },
  ],
};
