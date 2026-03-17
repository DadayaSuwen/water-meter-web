// config/config.ts
import { defineConfig } from '@umijs/max';
import routes from './routes';

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: {
    title: '智慧水务管理后台',
    // 👇 必须在这里关闭国际化，否则中文菜单会被隐藏
    locale: false,
  },
  // 确保这里引入了路由表
  routes: routes,
  npmClient: 'pnpm',

  // API 代理配置
  proxy: {
    '/api': {
      target: 'http://localhost:7001',
      changeOrigin: true,
    },
  },
});
