# VitaNote - 智能健康管理应用

[![.NET](https://img.shields.io/badge/.NET-10.0-blue.svg)](https://dotnet.microsoft.com/)
[![React](https://img.shields.io/badge/React-18.2-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![Tauri](https://img.shields.io/badge/Tauri-2.0-blue.svg)](https://tauri.app/)

VitaNote 是一个完整的智能健康管理应用，支持 Web、移动和桌面平台。

## 🚀 功能特性

- 📊 **健康数据记录** - 体重、血糖、血压记录
- 📷 **拍照识别** - OCR 文本识别（LLM 驱动）
- 🤖 **AI 健康助手** - 自然语言对话和健康建议
- 🔐 **安全认证** - JWT 认证
- 📱 **跨平台** - Web + Tauri 桌面/移动应用

## 🛠️ 技术栈

### 后端
- .NET 10 + ASP.NET Core WebAPI
- Entity Framework Core 10
- SQLite (开发) / PostgreSQL (生产)
- Swagger/OpenAPI
- Docker

### 前端
- React 18 + TypeScript
- Vite 5
- Material UI
- Zustand 状态管理
- Axios API 客户端

### 移动端
- Tauri 2.0 + Rust
- React Native (兼容)
- 相机集成
- OCR 处理

## 📂 项目结构

```
VitaNote/
├── backend/          # .NET 10 WebAPI (DDD)
├── frontend/         # React + Vite
├── mobile/          # Tauri 2.0
└── docs/            # 文档
```

## 🚀 快速开始

### 后端服务

```bash
cd backend/src
dotnet restore
dotnet run --project VitaNote.WebApi/VitaNote.WebApi.csproj
```

访问: http://localhost:5000

### 前端应用

```bash
cd frontend
npm install
npm run dev
```

访问: http://localhost:3000

### 移动端

```bash
cd mobile
npm install
npx tauri dev
```

### Docker 部署

```bash
docker-compose up -d
```

## 📖 文档

- [README](docs/README.md) - English document
- [中文文档](docs/README_ZH.md) - Chinese document
- [架构设计](ARCHITECTURE.md)
- [设计规范](DESIGN.md)
- [项目结构](PROJECT_STRUCTURE.md)

## 📊 API 文档

启动后端服务后，访问:

- Swagger UI: http://localhost:5000/swagger
- OpenAPI JSON: http://localhost:5000/swagger/v1/swagger.json

## 🔌 核心 API

| 端点 | 方法 | 描述 |
|------|------|------|
| `/api/auth/login` | POST | 登录 |
| `/api/auth/register` | POST | 注册 |
| `/api/health-records/weight` | GET/POST | 体重记录 |
| `/api/health-records/glucose` | GET/POST | 血糖记录 |
| `/api/health-records/blood-pressure` | GET/POST | 血压记录 |
| `/api/ocr/extract-text` | POST | 文本识别 |
| `/api/llm/chat` | POST | AI 聊天 |

## 📦 项目文件

- [README.md](README.md) - 项目说明
- [ARCHITECTURE.md](ARCHITECTURE.md) - 架构设计
- [DESIGN.md](DESIGN.md) - UI/UX 设计
- [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) - 项目结构
- [CONTRIBUTING.md](CONTRIBUTING.md) - 贡献指南
- [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) - 项目总结

## 🔧 配置

### .env.example

```bash
VITE_API_BASE_URL=http://localhost:5000
```

### 后端配置

```json
{
  "Database": {
    "Type": "Sqlite"
  },
  "Jwt": {
    "SecretKey": "your-secret-key"
  },
  "Ollama": {
    "Endpoint": "http://localhost:11434"
  }
}
```

## 🤝 贡献

欢迎贡献代码！请阅读 [CONTRIBUTING.md](CONTRIBUTING.md)。

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件。

## 📞 联系

- Email: support@vitanote.com
- GitHub: https://github.com/your-username/vita-note

## ⭐ Star 级别

[![Star](https://img.shields.io/github/stars/your-username/vita-note?style=social)](https://github.com/your-username/vita-note)

---

**![](https://img.shields.io/badge/Status-Production-green.svg)** 生产级代码

**![](https://img.shields.io/badge/License-MIT-blue.svg)** MIT License

**![](https://img.shields.io/badge/Build-Passing-brightgreen.svg)** 完整项目实现
