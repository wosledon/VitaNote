# VitaNote - 中文文档

## 项目简介

VitaNote 是一个智能健康管理应用，帮助用户记录和追踪体重、血糖、血压等健康数据，并通过 AI 提供个性化的健康建议。

## 功能特点

### 健康数据记录
- 📊 **体重记录** - 跟踪体重变化
- 🩸 **血糖记录** - 记录血糖水平
- 💓 **血压记录** - 监测血压和心率
- 🍽️ **食物记录** - 追踪饮食摄入

### 拍照识别
- 📷 **相机集成** - 直接拍照录入健康数据
- 🔍 **OCR 识别** - 自动识别设备数值
- 🍱 **食物识别** - 识别食物并获取营养信息

### AI 健康助手
- 💬 **自然语言对话** - 随时提问健康问题
- 📊 **数据分析** - 基于历史数据的个性化建议
- 🔔 **智能提醒** - 饮食和运动建议

## 快速开始

### 环境准备

- .NET 10 SDK
- Node.js 20+
- Rust (移动端)
- PostgreSQL (可选，用于生产环境)

### 开发环境

#### 后端服务

```bash
cd backend/src
dotnet restore
dotnet run --project VitaNote.WebApi/VitaNote.WebApi.csproj
```

API 运行在 http://localhost:5000

#### 前端应用

```bash
cd frontend
npm install
npm run dev
```

前端运行在 http://localhost:3000

#### 移动端

```bash
cd mobile
npm install
npx tauri dev
```

### 生产部署

#### Docker

```bash
# 构建并启动所有服务
docker-compose up -d

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f
```

## API 文档

启动后端服务后，访问：

- **Swagger UI**: http://localhost:5000/swagger
- **OpenAPI**: http://localhost:5000/swagger/v1/swagger.json

## 配置说明

### 后端配置

```json
{
  "Database": {
    "Type": "Sqlite",
    "Sqlite": {
      "ConnectionString": "Data Source=vitanote.db"
    }
  },
  "Jwt": {
    "SecretKey": "your-secret-key-at-least-32-chars",
    "Issuer": "VitaNote",
    "Audience": "VitaNoteClient"
  },
  "Ollama": {
    "Endpoint": "http://localhost:11434",
    "Model": "gpt-4o"
  }
}
```

### LLM 服务

VitaNote 使用 LLM 进行 OCR 和健康助手功能。

#### 方案 1: 使用本地 Ollama

```bash
# 安装 Ollama
curl -fsSL https://ollama.com/install.sh | sh

# 拉取 GPT-4o 模型（或其他兼容模型）
ollama pull gpt-4o
```

#### 方案 2: 使用 OpenAI API

修改配置文件中的 Ollama 配置为 OpenAI API 端点。

## 项目结构

```
VitaNote/
├── backend/          # .NET 10 WebAPI (DDD)
├── frontend/         # React + Vite
├── mobile/          # Tauri 2.0
└── docs/            # 文档
```

## 开发指南

### 代码规范

- 后端：遵循 C# 代码规范
- 前端：TypeScript，使用 ESLint + Prettier
- 移动端：Rust，遵循 Rust 社区规范

### 添加新功能

1. 修改领域模型 (Domain)
2. 添加应用服务 (Application)
3. 实现数据持久化 (Infrastructure)
4. 添加 API 控制器 (WebApi)
5. 更新前端组件

## 故障排除

### 常见问题

1. **数据库连接失败**
   - 确保数据库服务运行
   - 检查连接字符串配置
   - 运行迁移命令

2. **LLM 服务不可用**
   - 确保 Ollama 服务运行
   - 检查模型是否已下载
   - 验证 API 密钥

### 调试

#### 后端

```bash
dotnet watch --project VitaNote.WebApi/VitaNote.WebApi.csproj
```

#### 前端

```bash
npm run dev -- --debug
```

## 社区与支持

- GitHub Issues: 报告 bug 或请求新功能
- Discord: 社区讨论
- Email: support@vitanote.com

## 贡献

欢迎贡献代码！请阅读 `CONTRIBUTING.md` 了解详细指南。

## 许可证

本项目采用 MIT 许可证。详情请参阅 `LICENSE` 文件。
