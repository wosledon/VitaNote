# VitaNote - 智能健康管理应用

## 功能特性

- ✅ 健康数据记录（体重、血糖、血压）
- ✅ 拍照识别（OCR via LLM）
- ✅ AI健康助手（自然语言对话）
- ✅ 会员系统（JWT认证）
- ✅ 数据同步（本地+云端）

## 快速启动

### 后端服务

```bash
cd backend/src
dotnet restore
dotnet run --project VitaNote.WebApi/VitaNote.WebApi.csproj
```

### 前端应用

```bash
cd frontend
npm install
npm run dev
```

### 移动端

```bash
cd mobile
npm install
npx tauri dev
```

## API文档

访问 http://localhost:5000/swagger 查看API文档

## Docker部署

```bash
docker-compose up -d
```

## 贡献指南

1. Fork 本仓库
2. 创建特性分支
3. 提交更改
4. 发起Pull Request

## 许可证

MIT License

## 联系方式

- Email: support@vitanote.com
- Website: https://vitanote.com
