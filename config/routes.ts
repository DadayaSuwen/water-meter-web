export default [
  {
    path: '/user',
    layout: false,
    routes: [{ name: '登录', path: '/user/login', component: './User/Login' }],
  },
  {
    path: '/dashboard',
    name: '数据概览',
    icon: 'DashboardOutlined',
    component: './Dashboard',
  },
  {
    path: '/meter',
    name: '水表管理',
    icon: 'ClusterOutlined',
    routes: [
      { path: '/meter/list', name: '所有水表', component: './Meter/List' }, // 对应 API 2.5
      {
        path: '/meter/binding',
        name: '绑定审核',
        component: './Meter/Binding',
      }, // 对应 API 2.4, 2.9
    ],
  },
  {
    path: '/repair',
    name: '报修处理',
    icon: 'ToolOutlined',
    routes: [
      { path: '/repair/tickets', name: '工单列表', component: './Repair/List' }, // 对应 API 3.3
      { path: '/repair/stats', name: '报修统计', component: './Repair/Stats' }, // 对应 API 3.6
    ],
  },
  {
    path: '/usage',
    name: '用水统计',
    icon: 'BarChartOutlined',
    component: './Usage', // 对应 API 4.2
  },
  { path: '/', redirect: '/dashboard' },
  { path: '*', layout: false, component: './404' },
];
