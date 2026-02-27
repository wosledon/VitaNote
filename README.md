# VitaNote - 智能健康管理平台

[![.NET 10](https://img.shields.io/badge/.NET-10-green.svg)](https://dotnet.microsoft.com/)
[![React 19](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

VitaNote 是一个专为糖尿病患者设计的智能健康管理平台，整合了移动摄影、AI 智能识别、数据追踪和个性化健康管理等功能。

## 🎯 功能特色

### 📸 AI 拍照识物
- 自动识别食物种类和分量
- 估算热量、碳水、蛋白质、脂肪
- 升糖指数 (GI) 和升糖负荷 (GL) 估算

### 🩺 数据读取
- 拍照自动读取血糖仪数值
- 血压计、体重秤数据识别
- 支持中文医疗报告识别

### 🍽️ 饮食管理
- 全面的饮食记录和分析
- 食物数据库搜索
- 每日营养统计

### 🩸 血糖管理
- 血糖记录和趋势分析
- 餐前/餐后血糖对比
- 平均血糖 (eAG) 和血糖目标范围内时间 (TIR)

### 💊 用药管理
- 药物和胰岛素记录
- 用药提醒
- 胰岛素剂量计算

### 🤖 AI 健康助手
- 24/7 在线健康咨询
- 个性化饮食/运动建议
- 血糖管理技巧

## 🏗️ 技术架构

### 前端
- **Web**: React 19 + TypeScript + Vite
- **Mobile**: React 19 + TypeScript + Tauri (Windows/macOS/Linux)
- **UI**: Material Design + 圆角卡片风格

### 后端
- **框架**: .NET 10 ASP.NET Core
- **数据库**: SQLite/PostgreSQL (支持切换)
- **ORM**: Entity Framework Core 8
- **认证**: JWT Bearer Token

### AI 集成
- **聊天**: OpenAI GPT / Anthropic Claude / 国内大模型
- **图像识别**: 第三方 OCR API
- **数据分析**: 统计分析和趋势预测

## 📚 文档

- **[DESIGN.md](./DESIGN.md)** - 完整需求设计文档
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - 系统架构设计
- **[QWEN.md](./QWEN.md)** - 项目上下文说明
- **[BUILD.md](./BUILD.md)** - 构建和运行指南
- **[DATABASE.md](./DATABASE.md)** - 数据库配置指南

## 🚀 快速开始

### 环境准备

- **.NET 10 SDK**: https://dotnet.microsoft.com/download
- **Node.js**: v18+
- **Rust**: https://rustup.rs/ (用于 Tauri)

### 后端 API

```bash
cd src/VitaNote.WebApi
dotnet restore
dotnet run
```

API 运行在: `http://localhost:5000`

### Web 前端

```bash
cd frontend
npm install
npm run dev
```

前端运行在: `http://localhost:5173`

### 移动端

```bash
cd vita-note
npm install
npm run dev
```

## 📖 使用说明

### 1. 初始设置

1. **注册账号**: 访问 `/register`
2. **填写资料**: 输入基本健康信息
3. **配置目标**: 设置血糖、体重、热量目标

### 2. 日常使用

**记录饮食**:
- 手动输入食物
- 拍照识别食物
- 扫描食品条形码

**记录血糖**:
- 手动输入血糖值
- 拍照血糖仪读数
- 添加相关事件（餐次、运动）

**AI 聊天**:
- 访问 `/chat` 页面
- 输入问题（如"今天饮食建议"）
- 获取个性化回答

## 🔧 进阶配置

### 数据库切换

```json
// appsettings.json
{
  "Database": {
    "Type": "SQLite" // 或 "PostgreSQL"
  }
}
```

### AI 服务配置

```json
{
  "AI": {
    "Provider": "OpenAI",
    "ApiKey": "your-api-key",
    "Model": "gpt-4o-mini"
  }
}
```

## 📦 项目结构

```
VitaNote/
├── frontend/          # Web 前端
├── src/               # 后端代码
│   ├── VitaNote.Shared/    # 共享库
│   └── VitaNote.WebApi/    # Web API
├── vita-note/         # 移动端应用
└── tests/             # 测试代码
```

## 🤝 贡献

欢迎贡献！请遵循以下步骤：

1. Fork 本仓库
2. 创建分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送分支 (`git push origin feature/amazing-feature`)
5. 提交 Pull Request

## 📄 许可证

MIT License - 详情见 [LICENSE](./LICENSE)

## 👨‍💻 作者

- VitaNote Team

## 🙏 致谢

- 使用的开源库
- 糖尿病管理社区

## 📞 支持

如有问题或建议，请提交 Issue。

---

**VitaNote** - 您的智能健康管理助手 🩺✨
