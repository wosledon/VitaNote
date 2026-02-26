# VitaNote - 一键启动脚本

## 快速开始

### Windows
双击运行 `start-all.bat` 即可启动前后端服务。

### Linux/Mac
```bash
chmod +x start-all.sh
./start-all.sh
```

## 启动的服务
- **前端**: http://localhost:5173
- **后端**: http://localhost:5000
- **Swagger**: http://localhost:5000/swagger

## 其他命令
- `stop-all.bat` (Windows) - 停止所有正在运行的服务
- `Ctrl+C` (Linux/Mac) - 停止所有服务

## 注意事项

1. **首次运行**会自动安装依赖，可能需要一些时间

2. 确保已安装以下环境:
   - .NET 10.0 SDK - https://dotnet.microsoft.com/download
   - Node.js 18+ (带 npm) - https://nodejs.org/

3. 前端和后端会在独立的窗口中运行，保持窗口打开以服务正常运行

4. 窗口关闭或使用 `stop-all.bat`/`Ctrl+C` 即停止服务

## 故障排查

### 后端无法启动
- 确保已创建配置文件 `backend/src/VitaNote/WebApi/appsettings.Development.json`
- 检查 5000 端口是否被占用: `netstat -ano | findstr :5000`

### 前端无法启动
- 检查 5173 端口是否被占用: `netstat -ano | findstr :5173`
- 尝试清除 npm 缓存: `npm cache clean --force`

### 数据库相关
- 首次运行会自动创建 SQLite 数据库 `vitanote.db`
- 如需重置数据库，删除 `vitanote.db` 文件并重启后端

## 手动启动（如需）

### 后端
```bash
cd backend/src/VitaNote/WebApi
dotnet run --urls "http://localhost:5000"
```

### 前端
```bash
cd frontend
npm run dev
```
