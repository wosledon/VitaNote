# VitaNote - 项目构建说明

## 项目结构

```
VitaNote/
├── DESIGN.md                    # 需求设计文档
├── ARCHITECTURE.md              # 系统架构设计
├── QWEN.md                      # 项目上下文说明
├── BUILD.md                     # 本文件 - 构建说明
├── database-migrations.sql      # 数据库迁移脚本
├── VitaNote.slnx               # Visual Studio solution
│
├── frontend/                   # Web 前端 (React + Vite)
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── src/
│
├── src/
│   ├── VitaNote.Shared/        # 共享库 (C# models, DTOs, enums)
│   └── VitaNote.WebApi/        # Web API (.NET 10)
│       ├── Controllers/        # API 控制器
│       ├── Services/           # 业务服务
│       ├── Data/               # 数据库上下文
│       └── DTOs/               # 数据传输对象
│
├── vita-note/                  # 移动端 (Tauri + React)
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── src/
│
└── tests/                      # 测试代码
```

## 构建步骤

### 1. 环境准备

#### 必需工具
- **.NET 10 SDK**: https://dotnet.microsoft.com/download
- **Node.js**: v18+ (https://nodejs.org/)
- **Rust**: (用于 Tauri) https://rustup.rs/
- **PostgreSQL**: (可选，用于生产环境) https://www.postgresql.org/download/

#### 可选工具
- **SQLite CLI**: 用于数据库检查
- **Visual Studio 2022**: (推荐) 带有 ASP.NET 和 Web 开发工作负载

### 2. 后端 API 构建 (.NET 10)

```bash
cd src/VitaNote.WebApi

# 还原依赖
dotnet restore

# 构建项目
dotnet build

# 运行开发服务器
dotnet run

# 运行 MVC 迁移
dotnet ef database update

# API 文档 (OpenAPI)
# 访问: http://localhost:5001/swagger
```

**API 端口**: 默认 `http://localhost:5000` (或配置的端口)

**数据库配置**:
- 开发/默认: SQLite (`data/vitanote.db`)
- 生产: PostgreSQL (修改 `appsettings.json`)

```json
// appsettings.json
{
  "Database": {
    "Type": "SQLite"  // 或 "PostgreSQL"
  },
  "ConnectionStrings": {
    "SQLite": "Data Source=data/vitanote.db",
    "PostgreSQL": "Host=localhost;Port=5432;Database=vitanote;Username=postgres;Password=your_password;"
  }
}
```

### 3. Web 前端构建

```bash
cd frontend

# 安装依赖
npm install

# 开发模式
npm run dev

# 生产构建
npm run build

# 预览构建
npm run preview
```

**开发端口**: `http://localhost:5173`

### 4. 移动端构建 (Tauri)

```bash
cd vita-note

# 安装依赖
npm install

# 开发模式 (Tauri 将启动一个本地服务器)
npm run dev

# 生产构建
npm run taur build

# Windows 构建
npm run taur build --target x86_64-pc-windows-msvc

# macOS 构建
npm run taur build --target aarch64-apple-darwin

# Linux 构建
npm run taur build --target x86_64-unknown-linux-gnu
```

**构建输出**: `src-tauri/target/release/`

## 运行项目

### 开发模式

**1. 启动后端 API** (终端 1):
```bash
cd src/VitaNote.WebApi
dotnet run
```

**2. 启动 Web 前端** (终端 2):
```bash
cd frontend
npm run dev
```

**3. 启动移动端** (终端 3):
```bash
cd vita-note
npm run dev
```

### 生产部署

#### 单体部署 (推荐)

```bash
# 1. 构建前端
cd frontend
npm run build

# 2. 构建后端
cd src/VitaNote.WebApi
dotnet publish -c Release -o ./publish

# 3. 配置数据库 (PostgreSQL)
# - 创建数据库
# - 运行迁移
# - 配置连接字符串

# 4. 配置 Nginx (Windows/Linux)
# - 静态文件指向 dist/
# - 反向代理到后端 API

# 5. 运行后端服务
dotnet VitaNote.WebApi.dll
```

## 数据库配置

### SQLite (开发/离线)

```json
{
  "ConnectionStrings": {
    "SQLite": "Data Source=data/vitanote.db;Pooling=True;Max Pool Size=100;Journal Mode=WAL;"
  },
  "Database": {
    "Type": "SQLite"
  }
}
```

### PostgreSQL (生产/多设备)

```json
{
  "ConnectionStrings": {
    "PostgreSQL": "Host=localhost;Port=5432;Database=vitanote;Username=postgres;Password=your_password;"
  },
  "Database": {
    "Type": "PostgreSQL"
  }
}
```

## AI 服务配置

```json
{
  "AI": {
    "Provider": "OpenAI",
    "ApiKey": "your-api-key-here",
    "Endpoint": "https://api.openai.com/v1/chat/completions",
    "Model": "gpt-4o-mini"
  }
}
```

支持的 AI 提供商:
- **OpenAI**: `https://api.openai.com/v1/chat/completions`
- **Anthropic**: `https://api.anthropic.com/v1/messages`
- **通义千问**: `https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation`

## 常见问题

### 1. 后端编译警告

```
NU1701: 包与项目目标框架不完全兼容 (BCrypt.Net 0.1.0)
```
这是已知警告，BCrypt.Net 是 .NET Framework 版本，但在 .NET 10 中仍然可用。

### 2. 前端无法连接后端

确保 `frontend/vite.config.ts` 中的代理配置正确：
```typescript
server: {
  proxy: {
    "/api": {
      target: "http://localhost:5000",
      changeOrigin: true,
    },
  },
}
```

### 3. Tauri 构建失败

确保已安装 Rust 工具链：
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

### 4. 数据库连接问题

- SQLite: 确保 `data/` 目录存在且有写入权限
- PostgreSQL: 确保服务运行且连接字符串正确

## API 文档

开发模式下访问:
- **OpenAPI**: `http://localhost:5000/swagger`
- **Scalar (如果启用)**: `http://localhost:5000/scalar`

## 测试

```bash
# 后端单元测试
cd tests
dotnet test

# 前端测试
cd frontend
npm test

# E2E 测试
cd vita-note
npm run taur test
```

## 下一步

1. **配置数据库**: 运行 `dotnet ef database update`
2. **配置 AI API Key**: 在 `appsettings.json` 中设置 OpenAI/Anthropic API Key
3. **运行迁移**: `cd src/VitaNote.WebApi && dotnet ef database update`
4. **启动开发服务器**: 按照上述步骤运行后端和前端

## 许可证

MIT
