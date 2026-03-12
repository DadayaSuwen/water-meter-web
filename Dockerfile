# ================= 阶段 1: 编译构建 =================
FROM node:18-alpine AS builder

# 安装 pnpm
RUN npm install -g pnpm

# 设置工作目录
WORKDIR /app

# 利用 Docker 缓存机制加速依赖安装
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install

# 拷贝源文件并执行 UmiJS 构建
COPY . .
RUN pnpm run build

# ================= 阶段 2: 轻量级静态服务 (不使用 Nginx) =================
FROM node:18-alpine

WORKDIR /app

# 安装官方轻量级静态服务器 serve
RUN npm install -g serve

# 仅从 builder 阶段拷贝打包后的 dist 文件夹
COPY --from=builder /app/dist ./dist

# 暴露容器内部端口
EXPOSE 80

# 启动静态服务 
# -s 参数极其关键：它会自动将所有 404 路由回退给 index.html，完美支持 UmiJS 路由，无需任何 Nginx 配置！
# -l 80 指定在容器的 80 端口运行
CMD ["serve", "-s", "dist", "-l", "80"]