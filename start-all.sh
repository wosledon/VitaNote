#!/bin/bash

# VitaNote - 一键启动脚本 (Linux/Mac)

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "========================================"
echo "     VitaNote - 一键启动脚本"
echo "========================================"
echo ""

# 检查 .NET
echo -e "${YELLOW}[1/4] 正在检查环境...${NC}"
if ! command -v dotnet &> /dev/null; then
    echo -e "${RED}[错误] 未找到 .NET SDK，请安装 .NET 10.0 SDK${NC}"
    exit 1
fi
echo -e "${GREEN}[√] .NET SDK 已安装${NC}"

if ! command -v npm &> /dev/null; then
    echo -e "${RED}[错误] 未找到 npm，请安装 Node.js${NC}"
    exit 1
fi
echo -e "${GREEN}[√] npm 已安装${NC}"

# 安装依赖
echo ""
echo -e "${YELLOW}[2/4] 正在安装依赖...${NC}"
npm install || echo -e "${YELLOW}[警告] 根依赖安装失败${NC}"

cd frontend
npm install || echo -e "${YELLOW}[警告] 前端依赖安装失败${NC}"
cd ..

echo -e "${GREEN}[√] 依赖安装完成${NC}"

# 检查配置文件
echo ""
echo -e "${YELLOW}[3/4] 检查后端配置...${NC}"
if [ ! -f "backend/src/VitaNote/WebApi/appsettings.Development.json" ]; then
    echo -e "${YELLOW}[警告] 未找到后端配置文件 backend/src/VitaNote/WebApi/appsettings.Development.json${NC}"
    echo -e "${YELLOW}请先创建配置文件，参阅 START.md 文档${NC}"
fi
echo -e "${GREEN}[√] 配置检查完成${NC}"

# 启动服务
echo ""
echo -e "${YELLOW}[4/4] 启动服务...${NC}"
echo ""
echo "========================================"
echo "     服务启动中..."
echo "========================================"
echo ""
echo -e "${GREEN}[前端]   http://localhost:5173${NC}"
echo -e "${GREEN}[后端]   http://localhost:5000${NC}"
echo -e "${GREEN}[Swagger] http://localhost:5000/swagger${NC}"
echo ""
echo "按 Ctrl+C 停止所有服务"
echo ""

# 启动后端
echo -e "${YELLOW}[后端] 启动中...${NC}"
cd backend/src/VitaNote/WebApi || exit 1
dotnet run --urls "http://localhost:5000" &
BACKEND_PID=$!
cd ../../../../ || exit 1

# 等待后端启动
echo "等待后端启动..."
sleep 8

# 启动前端
echo -e "${YELLOW}[前端] 启动中...${NC}"
cd frontend || exit 1
npm run dev &
FRONTEND_PID=$!

# 等待用户中断
echo ""
echo "========================================"
echo "     服务已启动！"
echo "========================================"
echo ""
echo "前端地址: http://localhost:5173"
echo "后端地址: http://localhost:5000"
echo "Swagger:  http://localhost:5000/swagger"
echo ""
echo "详细启动说明请查看: START.md"
echo ""

# 捕获中断信号
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT

# 等待进程
wait
