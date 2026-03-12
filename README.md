# 💧 智慧水务管理后台 (Smart Water Management System)

![React](https://img.shields.io/badge/React-18.x-blue?logo=react)
![UmiJS](https://img.shields.io/badge/UmiJS-Max_4.x-brightgreen?logo=umi)
![Ant Design Pro](https://img.shields.io/badge/Ant_Design_Pro-2.x-1890ff?logo=antdesign)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker)

> 本项目为 **智慧水务物联网系统** 的 Web 端管理后台（竞赛展示版）。基于最新的微前端/中后台架构，实现了从硬件数据采集、设备档案追踪到工单智能调度的全业务闭环体验。

## ✨ 核心特性

- 📊 **全局数据指挥舱**：采用高级渐变面积图、水波球 (Liquid Chart) 及微型趋势图，实时洞察全辖区水压、产销差与漏损预警。
- 📇 **智能硬件全生命周期**：支持 NB-IoT/LoRa 水表档案管理，内置动态设备运行与通讯日志时间轴 (Timeline)，支持远程开/关阀等模拟下发指令。
- 🛠️ **闭环式工单调度引擎**：报修工单列表支持状态枚举流转、动态交互渲染（派单/结单），配合侧边抽屉 (Drawer) 实现沉浸式处理进度追踪。
- 📈 **全维数据透视 BI**：提供带有时间滑块 (Slider) 的多维柱状图与横向排行条形图，轻松锁定“用水大户”与异常消耗节点。
- 🔒 **高安全性路由鉴权**：实现企业级登录态拦截，支持从编译时到运行时的物理级路由守卫，杜绝越权访问。
- 🐳 **云原生交付**：内置基于 Nginx 的 Docker 多阶段构建 (Multi-stage Build) 配置，支持一键容器化部署。

## 💻 技术栈

- **前端框架**：[UmiJS Max (v4)](https://umijs.org/)
- **UI 组件库**：[Ant Design v5](https://ant.design/) & [Ant Design Pro Components](https://procomponents.ant.design/)
- **数据可视化**：[@ant-design/plots (G2底层)](https://charts.ant.design/)
- **开发语言**：TypeScript 
- **包管理器**：pnpm
- **部署环境**：Docker + Nginx

## 🚀 本地开发向导

**1. 克隆代码与安装依赖**
本项目推荐使用 `pnpm` 进行依赖管理：
```bash
# 安装依赖
pnpm install