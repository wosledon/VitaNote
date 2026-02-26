@echo off
chcp 65001 > nul
echo ========================================
echo     VitaNote - 一键启动脚本
echo ========================================
echo.

echo [1/4] 正在检查环境...
dotnet --version > nul 2>&1
if errorlevel 1 (
    echo [错误] 未找到 .NET SDK，请安装 .NET 10.0 SDK
    pause
    exit /b 1
)
echo [√] .NET SDK 已安装

npm --version > nul 2>&1
if errorlevel 1 (
    echo [错误] 未找到 npm，请安装 Node.js
    pause
    exit /b 1
)
echo [√] npm 已安装

echo.
echo [2/4] 正在安装依赖...
echo.
call npm install
if errorlevel 1 (
    echo [警告] 根依赖安装失败，继续...
)

cd frontend
call npm install
if errorlevel 1 (
    echo [警告] 前端依赖安装失败，但继续尝试启动...
)
cd ..

echo.
echo [3/4] 检查后端配置...
if not exist "backend\src\VitaNote\WebApi\appsettings.Development.json" (
    echo [警告] 未找到后端配置文件，尝试创建...
    echo 首次运行需要配置文件，请参阅 START.md 文档
)
echo [√] 配置检查完成

echo.
echo [4/4] 启动服务...
echo.
echo ========================================
echo     服务启动中...
echo ========================================
echo.
echo [前端]   http://localhost:5173
echo [后端]   http://localhost:5000
echo [Swagger] http://localhost:5000/swagger
echo.
echo 注意: 
echo - 前端和后端会在不同的窗口中运行
echo - 窗口关闭即停止服务
echo - 按 Ctrl+C 可以停止服务
echo.

:: 启动后端
echo [后端] 启动中...
start "VitaNote Backend" cmd /k "cd /d %~dp0backend\src\VitaNote\WebApi && dotnet run --urls 'http://localhost:5000' --verbose"

:: 等待后端启动
echo 等待后端启动...
ping -n 8 127.0.0.1 > nul

:: 启动前端
echo [前端] 启动中...
start "VitaNote Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo ========================================
echo     服务已启动！
echo ========================================
echo.
echo 前端地址: http://localhost:5173
echo 后端地址: http://localhost:5000
echo Swagger:  http://localhost:5000/swagger
echo.
echo 详细启动说明请查看: START.md
echo.
pause
