# VitaNote - 智能健康管理应用

VitaNote 是一个面向慢性病患者（特别是糖尿病患者）的智能健康管理应用。

## 功能特色

- 📸 **AI 拍照识物**: 拍照自动识别食物热量和营养成分
- 🩺 **数据读取**: 拍照自动读取血糖仪、血压计等设备数值
- 🍽️ **饮食管理**: 全面记录和分析饮食情况
- 🩸 **血糖管理**: 专业的血糖追踪和分析工具
- 💊 **用药管理**: 用药记录和提醒
- 🤖 **AI 健康助手**: 聊天机器人提供个性化健康建议

## 技术栈

- **前端**: React 19 + TypeScript + Vite + Tauri
- **后端**: .NET 10 Web API
- **AI**: 计算机视觉 + NLP

## 开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建应用
npm run build

# Tauri 打包
npm run taur
```

## 项目结构

```
VitaNote/
├── frontend/          # 前端代码
├── src/               # 后端代码
│   ├── VitaNote.Shared/     # 共享代码
│   └── VitaNote.WebApi/     # Web API 服务
├── tests/             # 测试代码
└── vita-note/         # 主应用（前端）
```

## 设计文档

详见 [DESIGN.md](../DESIGN.md) 了解完整的设计需求。

## 许可证

MIT
