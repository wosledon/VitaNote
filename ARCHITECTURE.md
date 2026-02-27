# VitaNote 系统架构设计文档

## 1. 系统架构概览

### 1.1 总体架构

```
┌─────────────────────────────────────────────────────────────────────┐
│                          用户端层                                    │
├─────────────────────┬───────────────────────────────────────────────┤
│   Frontend (Web)    │          Vita-Note (Mobile/CTI)             │
│   • React + Vite    │   • React + Tauri (Windows/macOS/Linux)      │
│   • Material Design │   • SQLite/PostgreSQL (本地直连)             │
│   • API 客户端        │   • 无本地 AI 模型                          │
└──────────┬──────────┴──────────────────────┬──────────────────────┘
           │                                 │
           ▼                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         服务端层 (API Gateway)                       │
│                    VitaNote.WebApi (.NET 10)                        │
├─────────────────────────────────────────────────────────────────────┤
│  • RESTful API / OpenAPI                                            │
│  • 数据验证与业务逻辑                                               │
│  • 认证与授权                                                       │
│  • 可选：后台调用第三方 AI API (如 OpenAI/Anthropic)                 │
└─────────────────────────────────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         数据存储层                                   │
├─────────────────────┬───────────────────────────────────────────────┤
│   SQLite (本地)      │          PostgreSQL (远程/生产环境)          │
│   • 开发/离线模式     │   • 生产环境/多设备同步                      │
│   • 单文件数据库      │   • 支持高并发、数据备份                      │
└─────────────────────┴───────────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    第三方 AI 服务 (云端 API)                         │
├─────────────────────────────────────────────────────────────────────┤
│  • OpenAI GPT-4 / GPT-3.5                                          │
│  • Anthropic Claude                                                  │
│  • 国内大模型 (通义千问、文心一言等)                                 │
│  • 仅用于 AI 聊天和智能分析                                         │
└─────────────────────────────────────────────────────────────────────┘
```

**核心架构原则**:
- **移动端直连数据库**: 移动端可直连 SQLite 或 PostgreSQL
  - SQLite: 本地/离线存储 (默认，单设备使用)
  - PostgreSQL: 远程/同步存储 (多设备同步)
- **Web 前端通过 API**: Web 端必须通过后端 API 访问数据
- **AI 使用第三方服务**: 不本地部署模型，使用云服务 API
- **单体部署**: 所有服务部署在同一服务器，无微服务架构

---

### 1.2 部署架构

**单体部署模式** - 所有服务运行在同一服务器或设备上：

```
┌─────────────────────────────────────────────────────────────────────┐
│                         单体服务器/设备                              │
├─────────────────────────────────────────────────────────────────────┤
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐   │
│  │  Web 应用         │  │  Mobile 应用       │  │  后端 API 服务    │   │
│  │  (Frontend)      │  │  (Vita-Note)       │  │  (VitaNote.WebApi)│   │
│  │  • Nginx 静态服务│  │  • Tauri 容器       │  │  • Kestrel       │   │
│  │  • 静态文件托管    │  │  • SQLite 文件      │  │  • PostgreSQL   │   │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘   │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                      PostgreSQL Database                      │    │
│  │                   (或 SQLite 文件)                             │    │
│  └─────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
                          │
                          ▼
                  ┌─────────────────┐
                  │  第三方 AI API  │
                  │  (云端服务)      │
                  └─────────────────┘
```

---

## 2. 前端架构设计

### 2.1 Web 前端 (Frontend)

**技术栈**:
- **框架**: React 19 + TypeScript
- **构建工具**: Vite
- **UI 库**: Material Design (Material-UI 或 Ant Design)
- **状态管理**: React Context / Zustand (轻量级)
- **路由**: React Router v6
- **HTTP 客户端**: Axios / fetch API
- **图表库**: Chart.js / Recharts

**项目结构**:
```
frontend/
├── public/                    # 静态资源
├── src/
│   ├── assets/               # 图片、字体等
│   ├── components/           # 通用组件
│   │   ├── layout/          # 布局组件 (AppLayout, Sidebar, Nav)
│   │   ├── cards/           # 圆角卡片组件
│   │   ├── forms/           # 表单组件
│   │   └── charts/          # 图表组件 (折线图、柱状图、饼图)
│   ├── pages/                # 页面组件
│   │   ├── Dashboard/       # 仪表盘
│   │   ├── Food/            # 饮食管理
│   │   │   ├── FoodList.tsx
│   │   │   ├── FoodForm.tsx
│   │   │   └── FoodSearch.tsx
│   │   ├── BloodGlucose/    # 血糖管理
│   │   ├── Medication/      # 用药管理
│   │   ├── AIChat/          # AI 聊天
│   │   └── Settings/        # 设置
│   ├── services/            # API 服务
│   │   ├── apiClient.ts     # Axios 实例配置 ( baseURL, 拦截器)
│   │   ├── foodService.ts
│   │   ├── glucoseService.ts
│   │   ├── medicationService.ts
│   │   └── chatService.ts   # AI 聊天服务 (调用后端 API)
│   ├── hooks/               # 自定义 Hook
│   ├── utils/               # 工具函数
│   │   ├── dateUtils.ts
│   │   ├── formatUtils.ts
│   │   └── validation.ts
│   ├── theme/               # Material Design 主题
│   │   ├── createTheme.ts
│   │   └── palette.ts
│   ├── App.tsx
│   └── main.tsx
├── vite.config.ts
├── tsconfig.json
└── package.json
```

**设计规范**:
- **圆角卡片**: 所有内容区域使用 12-16px 圆角 (border-radius: 12px)
- **阴影**: 淡雅阴影 (box-shadow: 0 2px 8px rgba(0,0,0,0.1))
- **配色**: Material Design 主色 + 安全色系（绿色 #4CAF50 用于健康指标，红色 #F44336 用于异常值）
- **响应式**: 支持桌面端窗口大小 (1920px, 1440px, 1280px)
- **交互反馈**: 按钮点击反馈、加载状态、成功/失败提示

### 2.2 移动端 (Vita-Note)

**技术栈**:
- **框架**: React 19 + TypeScript
- **打包**: Tauri 2 (Windows/macOS/Linux 原生应用)
- **UI**: 自定义 Material Design 组件 (移动端优化)
- **数据库**: SQLite/PostgreSQL 直连 (支持切换)
- **摄像头**: Tauri 摄像头插件 (tauri-plugin-opener)

**项目结构**:
```
vita-note/
├── src/
│   ├── assets/
│   ├── components/          # 与 frontend 共享组件 (通过 npm link 或共用库)
│   ├── pages/               # 移动端专用页面
│   ├── services/
│   │   ├── db/              # 数据库访问层 (支持 SQLite/PostgreSQL)
│   │   │   ├── index.ts     # 数据库工厂/配置管理
│   │   │   ├── sqlite/      # SQLite 实现
│   │   │   │   ├── Database.ts
│   │   │   │   └── queries.ts
│   │   │   └── postgres/    # PostgreSQL 实现
│   │   │       ├── Database.ts
│   │   │       └── queries.ts
│   │   ├── ai/              # AI 服务 (调用第三方 API)
│   │   │   ├── chat.ts      # AI 聊天 (调用 OpenAI/Anthropic API)
│   │   │   └── models/      # 请求/响应模型
│   │   ├── camera.ts        # 摄像头捕获 (拍照、相册)
│   │   └── imageProcessor.ts # 图像预处理 (压缩、编码)
│   ├── hooks/
│   └── utils/
├── src-tauri/              # Tauri 配置
│   ├── Cargo.toml
│   ├── tauri.conf.json
│   └── src/
│       ├── main.rs
│       └── plugins/
│           ├── camera.rs    # 摄像头插件
│           └── image.rs     # 图像处理插件
├── index.html
├── vite.config.ts
└── package.json
```

**移动端特性**:
- **直连数据库**: 移动端可直连 SQLite 或 PostgreSQL
  - SQLite: 本地文件 `data/vitanote.db` (默认，单设备使用)
  - PostgreSQL: 远程服务器 (多设备同步，需配置)
- **第三方 AI**: AI 聊天直接调用第三方 API (OpenAI/Anthropic等)
- **摄像头集成**: 使用 Tauri 插件调用设备摄像头拍照
- **通知系统**: 系统通知（用药提醒、血糖提醒）
- **文件系统**: 使用 Tauri 文件 API 访问本地文件
- **数据库切换**: 支持运行时或启动时切换数据库类型

**移动端数据库访问示例** (factory pattern):
```typescript
// vita-note/src/services/db/index.ts
export interface IDatabase {
  connect(): Promise<void>;
  query<T>(sql: string, params?: any[]): Promise<T[]>;
  execute(sql: string, params?: any[]): Promise<void>;
  close(): Promise<void>;
}

// vita-note/src/services/db/DatabaseFactory.ts
import { SQLiteDatabase } from './sqlite/Database';
import { PostgresDatabase } from './postgres/Database';
import { DatabaseConfig } from './config';

export class DatabaseFactory {
  static createDatabase(config: DatabaseConfig): IDatabase {
    if (config.type === 'postgres') {
      return new PostgresDatabase(config.postgres!);
    }
    return new SQLiteDatabase(config.sqlite!.path);
  }
}
```

**移动端数据库访问示例**:
```typescript
// vita-note/src/services/db/sqlite/Database.ts
import sqlite3 from 'sqlite3';
import path from 'path';

export class SQLiteDatabase {
  private dbPath: string;
  private db: sqlite3.Database | null = null;

  constructor(dbPath?: string) {
    // 直接访问本地 SQLite 文件
    this.dbPath = dbPath || path.join(process.env.APP_DATA || '.', 'data', 'vitanote.db');
  }

  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(this.dbPath, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  async query<T>(sql: string, params: any[] = []): Promise<T[]> {
    return new Promise((resolve, reject) => {
      this.db!.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows as T[]);
      });
    });
  }

  async execute(sql: string, params: any[] = []): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db!.run(sql, params, function(err) {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  async close(): Promise<void> {
    return new Promise((resolve) => {
      this.db?.close(() => {
        this.db = null;
        resolve();
      });
    });
  }
}
```

```typescript
// vita-note/src/services/db/postgres/Database.ts
import { Pool, QueryResult } from 'pg';

export class PostgresDatabase {
  private pool: Pool;

  constructor(config: { host: string; port: number; database: string; username: string; password: string }) {
    this.pool = new Pool({
      host: config.host,
      port: config.port,
      database: config.database,
      user: config.username,
      password: config.password,
      max: 10,
    });
  }

  async connect(): Promise<void> {
    // Pool connects automatically on first query
  }

  async query<T>(sql: string, params: any[] = []): Promise<T[]> {
    const result: QueryResult = await this.pool.query(sql, params);
    return result.rows as T[];
  }

  async execute(sql: string, params: any[] = []): Promise<void> {
    await this.pool.query(sql, params);
  }

  async close(): Promise<void> {
    await this.pool.end();
  }
}
```

---

## 3. 后端架构设计

### 3.1 技术栈

- **语言**: C# 12
- **框架**: .NET 10 ASP.NET Core
- **ORM**: Entity Framework Core 8
- **API**: RESTful + OpenAPI 3.0 + Scalar
- **DI**: 内置依赖注入
- **验证**: FluentValidation
- **日志**: Serilog
- **身份认证**: JWT Bearer Token

### 3.2 项目结构

```
src/
├── VitaNote.Shared/               # 共享库
│   ├── Models/                   # 数据模型（DTO、Entity）
│   │   ├── FoodModels.cs
│   │   ├── GlucoseModels.cs
│   │   ├── MedicationModels.cs
│   │   ├── UserModels.cs
│   │   └── ChatModels.cs
│   ├── Enums/                    # 枚举定义
│   │   ├── MealType.cs
│   │   ├── DiabetesType.cs
│   │   └── MeasurementTimeType.cs
│   └── Validators/               # 验证规则
│
└── VitaNote.WebApi/              # Web API 项目
    ├── Controllers/             # API 控制器
    │   ├── ApiControllerBase.cs
    │   ├── AuthController.cs          # 认证相关
    │   ├── FoodController.cs          # 饮食管理
    │   ├── GlucoseController.cs       # 血糖管理
    │   ├── MedicationController.cs    # 用药管理
    │   ├── SettingsController.cs      # 设置相关
    │   ├── ChatController.cs          # AI 聊天 (可选)
    │   └── ExportController.cs        # 数据导出
    ├── Services/                # 业务服务
    │   ├── IFoodService.cs
    │   ├── IGlucoseService.cs
    │   ├── IAuthService.cs
    │   ├── IChatService.cs           # AI 聊天服务
    │   └── impl/
    ├── Data/                    # 数据访问层
    │   ├── ApplicationDbContext.cs
    │   ├── Migrations/               # EF Core 迁移文件
    │   └── seed/                     # 初始数据种子
    ├── DTOs/                    # 数据传输对象
    ├── Middleware/              # 中间件
    │   ├── ExceptionHandlerMiddleware.cs
    │   └── LoggingMiddleware.cs
    ├── Configuration/           # 配置类
    │   ├── DatabaseOptions.cs
    │   └── AIOptions.cs
    ├── Program.cs
    ├── appsettings.json
    ├── appsettings.Development.json
    └── VitaNote.WebApi.csproj
```

### 3.3 数据访问层设计

**数据库抽象层** (支持 SQLite 和 PostgreSQL 切换):
```csharp
// VitaNote.WebApi/Configuration/DatabaseOptions.cs
public class DatabaseOptions
{
    public string Type { get; set; } = "SQLite"; // SQLite 或 PostgreSQL
    public string ConnectionString { get; set; } = string.Empty;
}

// VitaNote.WebApi/Data/DatabaseFactory.cs
public interface IDbConnectionFactory
{
    IDbConnection CreateConnection();
}

public class SQLiteConnectionFactory : IDbConnectionFactory
{
    private readonly string _connectionString;
    
    public SQLiteConnectionFactory(string connectionString)
    {
        _connectionString = connectionString;
    }
    
    public IDbConnection CreateConnection() => 
        new SQLiteConnection(_connectionString);
}

public class PostgreSQLConnectionFactory : IDbConnectionFactory
{
    private readonly string _connectionString;
    
    public PostgreSQLConnectionFactory(string connectionString)
    {
        _connectionString = connectionString;
    }
    
    public IDbConnection CreateConnection() => 
        new NpgsqlConnection(_connectionString);
}
```

**DbContext**:
```csharp
// VitaNote.WebApi/Data/ApplicationDbContext.cs
public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions options) : base(options) { }
    
    // DbSet 定义
    public DbSet<User> Users { get; set; }
    public DbSet<FoodEntry> FoodEntries { get; set; }
    public DbSet<BloodGlucose> BloodGlucoseEntries { get; set; }
    public DbSet<Medication> Medications { get; set; }
    public DbSet<FoodDatabase> FoodDatabase { get; set; }
    public DbSet<AIChatHistory> ChatHistory { get; set; }
    public DbSet<UserProfile> UserProfiles { get; set; }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // 配置实体关系
        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();
            
        modelBuilder.Entity<FoodEntry>()
            .HasIndex(f => new { f.UserId, f.MealTime });
            
        modelBuilder.Entity<BloodGlucose>()
            .HasIndex(g => new { g.UserId, g.CreatedAt });
    }
}
```

**后端启动配置**:
```csharp
// VitaNote.WebApi/Program.cs
var builder = WebApplication.CreateBuilder(args);

// 读取配置
var dbType = builder.Configuration["Database:Type"];
var connectionString = builder.Configuration.GetConnectionString(dbType);

// 注册数据库连接
if (dbType == "PostgreSQL")
{
    builder.Services.AddScoped<IDbConnectionFactory, PostgreSQLConnectionFactory>();
    builder.Services.AddDbContext<ApplicationDbContext>(options =>
        options.UseNpgsql(connectionString));
}
else
{
    builder.Services.AddScoped<IDbConnectionFactory, SQLiteConnectionFactory>();
    builder.Services.AddDbContext<ApplicationDbContext>(options =>
        options.UseSqlite(connectionString));
}

// 注册其他服务
builder.Services.AddScoped<IFoodService, FoodService>();
builder.Services.AddScoped<IGlucoseService, GlucoseService>();
builder.Services.AddScoped<IChatService, ChatService>();
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options => { /* JWT 配置 */ });

var app = builder.Build();

// 中间件管道
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
```

**appsettings.json**:
```json
{
  "ConnectionStrings": {
    "SQLite": "Data Source=data/vitanote.db;Pooling=True;Max Pool Size=100;",
    "PostgreSQL": "Host=localhost;Port=5432;Database=vitanote;Username=postgres;Password=your_password;"
  },
  "Database": {
    "Type": "SQLite"
  },
  "AI": {
    "Provider": "OpenAI", // OpenAI 或 Anthropic 或 国内大模型
    "ApiKey": "",
    "Endpoint": "",
    "Model": "gpt-4o-mini"
  }
}
```

### 3.4 API 设计规范

**通用响应格式**:
```json
{
  "success": true,
  "data": { ... },
  "message": "",
  "timestamp": "2026-02-27T10:30:00Z"
}
```

**错误处理**:
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "输入数据验证失败",
    "details": [
      { "field": "glucoseValue", "message": "血糖值必须在 1-30 之间" }
    ]
  }
}
```

**RESTful API 路由**:
```
POST   /api/auth/login              # 登录
POST   /api/auth/register           # 注册
GET    /api/auth/profile            # 获取用户资料 (需要认证)

GET    /api/foods                   # 获取饮食记录 (分页、筛选)
POST   /api/foods                   # 新增饮食记录
PUT    /api/foods/{id}              # 更新饮食记录
DELETE /api/foods/{id}              # 删除饮食记录
GET    /api/foods/statistics/today  # 今日饮食统计

GET    /api/glucose                 # 获取血糖记录
POST   /api/glucose                 # 新增血糖记录
GET    /api/glucose/statistics/today # 今日血糖统计

GET    /api/medications             # 获取用药记录
POST   /api/medications             # 新增用药记录
POST   /api/medications/{id}/take   # 标记已服药

GET    /api/food-database           # 获取食物数据库
GET    /api/food-database/search    # 搜索食物

POST   /api/chat                    # 发送聊天消息 (可选：调用第三方 AI)
GET    /api/chat/history            # 获取聊天历史

GET    /api/export/data             # 导出个人数据 (CSV/JSON)
```

### 3.5 业务服务示例

**饮食服务**:
```csharp
// VitaNote.WebApi/Services/IFoodService.cs
public interface IFoodService
{
    Task<PagedResult<FoodEntryDto>> GetEntriesAsync(
        Guid userId, 
        DateTime startDate, 
        DateTime endDate, 
        int page = 1, 
        int pageSize = 20);
    
    Task<FoodEntryDto> AddEntryAsync(Guid userId, CreateFoodEntryDto dto);
    Task<FoodEntryDto> UpdateEntryAsync(Guid entryId, UpdateFoodEntryDto dto);
    Task DeleteEntryAsync(Guid entryId);
    Task<FoodStatisticsDto> GetTodayStatisticsAsync(Guid userId);
}

// VitaNote.WebApi/Services/FoodService.cs
public class FoodService : IFoodService
{
    private readonly ApplicationDbContext _db;
    
    public FoodService(ApplicationDbContext db)
    {
        _db = db;
    }
    
    public async Task<PagedResult<FoodEntryDto>> GetEntriesAsync(...)
    {
        var query = _db.FoodEntries
            .Where(f => f.UserId == userId && f.MealTime >= startDate && f.MealTime <= endDate)
            .OrderByDescending(f => f.MealTime);
            
        var total = await query.CountAsync();
        var items = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(f => new FoodEntryDto { ... })
            .ToListAsync();
            
        return new PagedResult<FoodEntryDto> { Items = items, Total = total, Page = page, PageSize = pageSize };
    }
}
```

---

## 4. AI 模块架构设计

### 4.1 架构选择

**移动端 AI 调用** (直连第三方 API):
```
┌─────────────────────┐
│   移动端应用         │
├─────────────────────┤
│  1. AI 聊天         │
│     └─> 调用 OpenAI/Anthropic API
│  2. 图像识别 (可选) │
│     └─> 调用第三方 OCR API
│
└─────────────────────┘
```

**后端 AI 服务** (可选，用于 Web 端或后台处理):
```
┌─────────────────────┐
│   Web 前端 或       │
│   移动端 (备用)     │
├─────────────────────┤
│  API /api/chat      │
│     └─> 后端服务    │
│     └─> 调用第三方 AI │
└─────────────────────┘
```

### 4.2 第三方 AI 集成

**OpenAI 集成示例**:
```csharp
// VitaNote.WebApi/Services/ChatService.cs
public interface IChatService
{
    Task<string> SendMessageAsync(Guid userId, string message, List<ChatMessage> history);
}

public class ChatService : IChatService
{
    private readonly HttpClient _httpClient;
    private readonly AIOptions _aiOptions;
    
    public ChatService(HttpClient httpClient, IConfiguration config)
    {
        _httpClient = httpClient;
        _aiOptions = config.GetSection("AI").Get<AIOptions>();
    }
    
    public async Task<string> SendMessageAsync(Guid userId, string message, List<ChatMessage> history)
    {
        var requestBody = new
        {
            model = _aiOptions.Model,
            messages = new[]
            {
                new { role = "system", content = "你是一个专业的健康管理助手..." },
                new { role = "user", content = message }
            }.ToList()
        };
        
        _httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {_aiOptions.ApiKey}");
        
        var response = await _httpClient.PostAsJsonAsync(_aiOptions.Endpoint, requestBody);
        response.EnsureSuccessStatusCode();
        
        var result = await response.Content.ReadFromJsonAsync<OpenAIResponse>();
        return result.Choices[0].Message.Content;
    }
}
```

**国内大模型集成** (通义千问示例):
```csharp
// 支持 HTTPS 请求，API Key 在 Header 中
// Endpoint: https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation
```

### 4.3 AI 提示词工程

**健康助手提示词**:
```
你是一个专业的糖尿病健康管理助手。请根据以下用户数据提供个性化建议：

## 用户信息
- 糖尿病类型: {DiabetesType}
- 性别: {Gender}, 年龄: {Age}
- 当前目标: {TargetHbA1c}, {TargetWeight}

## 今日数据
- 空腹血糖: {FastingGlucose} mmol/L
- 餐后血糖: {PostprandialGlucose} mmol/L
- 今日总碳水: {TotalCarbs} 克
- 今日总热量: {TotalCalories} kcal

## 用户问题
{UserQuestion}

请基于 diabetes 管理指南提供专业建议，注意：
1. 血糖控制目标
2. 饮食建议（碳水控制）
3. 运动建议
4. 用药提醒（如适用）
```

**图像识别提示词** (食物识别):
```
请分析这张食物照片，提供以下信息：
1. 食物种类 (中餐/西餐/快餐)
2. 分量估算 (克数，基于常见餐具参考)
3. 热量估算 (kcal)
4. 营养成分 (碳水、蛋白质、脂肪，单位：克)
5. GI 值估算 (低/中/高)
6. 置信度

请以 JSON 格式返回：
{
  "foodName": "...",
  "quantity": 0,
  "calories": 0,
  "carbohydrates": 0,
  "protein": 0,
  "fat": 0,
  "gi": "low" | "medium" | "high",
  "confidence": 0.0
}
```

---

## 5. 数据模型设计

### 5.1 核心实体 (EF Core)

```csharp
// VitaNote.Shared/Models/UserModels.cs
public class User
{
    public Guid Id { get; set; }
    public required string Username { get; set; }
    public required string Email { get; set; }
    public string? Phone { get; set; }
    public DateTime CreatedAt { get; set; }
    
    // 密码哈希 (不直接存储明文)
    public required string PasswordHash { get; set; }
    
    // 个人资料
    public DateOnly? Birthday { get; set; }
    public Gender Gender { get; set; }
    public float Height { get; set; } // cm
    
    // 糖尿病信息
    public DiabetesType DiabetesType { get; set; }
    public DateTime? DiagnosisDate { get; set; }
    public TreatmentPlan TreatmentPlan { get; set; }
    
    // 目标
    public float? TargetWeight { get; set; }
    public float? TargetHbA1c { get; set; }
    public float? TargetCalories { get; set; }
    public float? TargetCarbohydrates { get; set; }
}

public enum Gender
{
    Unknown = 0,
    Male = 1,
    Female = 2
}

public enum DiabetesType
{
    Unknown = 0,
    Type1 = 1,
    Type2 = 2,
    Gestational = 3
}

public enum TreatmentPlan
{
    DietOnly = 0,
    OralMedication = 1,
    Insulin = 2,
    Combined = 3
}
```

```csharp
// VitaNote.Shared/Models/FoodModels.cs
public class FoodEntry
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public DateTime CreatedAt { get; set; }
    
    // 记录信息
    public MealType MealType { get; set; }
    public DateTime MealTime { get; set; }
    
    // 食物信息
    public string FoodName { get; set; } = string.Empty;
    public float Quantity { get; set; } // 克数
    public float Calories { get; set; }
    public float Carbohydrates { get; set; }
    public float Protein { get; set; }
    public float Fat { get; set; }
    public float? GI { get; set; }
    public float? GL { get; set; }
    
    // 来源
    public EntrySource Source { get; set; }
    public string? ImagePath { get; set; }
    public string? Notes { get; set; }
}

public enum MealType
{
    Breakfast = 0,
    Lunch = 1,
    Dinner = 2,
    Snack = 3
}

public enum EntrySource
{
    Manual = 0,
    FoodDatabase = 1,
    AIRecognition = 2,
    BarcodeScan = 3
}
```

```csharp
// VitaNote.Shared/Models/GlucoseModels.cs
public class BloodGlucose
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public DateTime CreatedAt { get; set; }
    
    // 血糖值
    public float Value { get; set; } // mmol/L
    public MeasurementTimeType MeasurementTime { get; set; }
    public DateTime? MeasurementTimeExact { get; set; }
    
    // 相关信息
    public float? BeforeMealGlucose { get; set; }
    public float? AfterMealGlucose { get; set; }
    public MealType? RelatedMeal { get; set; }
    public string? Notes { get; set; }
    
    // 设备信息
    public string? DeviceName { get; set; }
    public string? DeviceSerial { get; set; }
}

public enum MeasurementTimeType
{
    Fasting = 0,          // 空腹
    BeforeMeal = 1,       // 餐前
    AfterMeal1h = 2,      // 餐后1小时
    AfterMeal2h = 3,      // 餐后2小时
    BeforeBed = 4,        // 睡前
    Night = 5,            // 凌晨
    Random = 6            // 随机
}
```

```csharp
// VitaNote.Shared/Models/MedicationModels.cs
public class Medication
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public DateTime CreatedAt { get; set; }
    
    // 药物信息
    public string DrugName { get; set; } = string.Empty;
    public MedicationType Type { get; set; }
    public float Dose { get; set; }
    public string Unit { get; set; } = string.Empty;
    public MedicationTiming Timing { get; set; }
    
    // 胰岛素特有
    public InsulinType? InsulinType { get; set; }
    public float? InsulinDuration { get; set; } // 小时
    
    // 用药时间
    public DateTime ScheduledTime { get; set; }
    public DateTime? ActualTime { get; set; }
    public bool IsTaken { get; set; }
    
    public string? Notes { get; set; }
}

public enum MedicationType
{
    Oral = 0,
    Injection = 1,
    InsulinPump = 2
}

public enum MedicationTiming
{
    BeforeBreakfast = 0,
    BeforeLunch = 1,
    BeforeDinner = 2,
    AfterBreakfast = 3,
    AfterLunch = 4,
    AfterDinner = 5,
    BeforeBed = 6,
    AsNeeded = 7
}

public enum InsulinType
{
    Rapidacting = 0,  // 门冬、赖脯
    Shortacting = 1,  // 常规
    Intermediate = 2, // NPH
    Longacting = 3,   // 甘精、德谷
    Premixed = 4      // 预混
}
```

```csharp
// VitaNote.Shared/Models/ChatModels.cs
public class AIChatHistory
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public DateTime CreatedAt { get; set; }
    
    public string Role { get; set; } = string.Empty; // user / assistant
    public string Content { get; set; } = string.Empty;
    public string? Model { get; set; }
    public string? Context { get; set; } // 上下文数据 (JSON)
    public string? Prompt { get; set; }  // 提示词 (可选)
}
```

---

## 6. 数据库设计

### 6.1 SQLite 与 PostgreSQL 兼容

**表结构** (EF Core 迁移生成):

```sql
-- 用户表
CREATE TABLE IF NOT EXISTS Users (
    Id TEXT PRIMARY KEY,
    Username TEXT UNIQUE NOT NULL,
    Email TEXT UNIQUE,
    Phone TEXT,
    CreatedAt TEXT NOT NULL,
    PasswordHash TEXT NOT NULL,
    Birthday TEXT,
    Gender INTEGER NOT NULL,
    Height REAL NOT NULL,
    DiabetesType INTEGER NOT NULL,
    DiagnosisDate TEXT,
    TreatmentPlan INTEGER NOT NULL,
    TargetWeight REAL,
    TargetHbA1c REAL,
    TargetCalories REAL,
    TargetCarbohydrates REAL
);

-- 饮食记录表
CREATE TABLE IF NOT EXISTS FoodEntries (
    Id TEXT PRIMARY KEY,
    UserId TEXT NOT NULL,
    CreatedAt TEXT NOT NULL,
    MealType INTEGER NOT NULL,
    MealTime TEXT NOT NULL,
    FoodName TEXT NOT NULL,
    Quantity REAL NOT NULL,
    Calories REAL NOT NULL,
    Carbohydrates REAL NOT NULL,
    Protein REAL NOT NULL,
    Fat REAL NOT NULL,
    GI REAL,
    GL REAL,
    Source INTEGER NOT NULL,
    ImagePath TEXT,
    Notes TEXT,
    FOREIGN KEY (UserId) REFERENCES Users(Id)
);
CREATE INDEX IF NOT EXISTS idx_food_user_date ON FoodEntries(UserId, MealTime);

-- 血糖记录表
CREATE TABLE IF NOT EXISTS BloodGlucoseEntries (
    Id TEXT PRIMARY KEY,
    UserId TEXT NOT NULL,
    CreatedAt TEXT NOT NULL,
    Value REAL NOT NULL,
    MeasurementTime INTEGER NOT NULL,
    MeasurementTimeExact TEXT,
    BeforeMealGlucose REAL,
    AfterMealGlucose REAL,
    RelatedMeal INTEGER,
    Notes TEXT,
    DeviceName TEXT,
    DeviceSerial TEXT,
    FOREIGN KEY (UserId) REFERENCES Users(Id)
);
CREATE INDEX IF NOT EXISTS idx_glucose_user_date ON BloodGlucoseEntries(UserId, CreatedAt);

-- 用药记录表
CREATE TABLE IF NOT EXISTS Medications (
    Id TEXT PRIMARY KEY,
    UserId TEXT NOT NULL,
    CreatedAt TEXT NOT NULL,
    DrugName TEXT NOT NULL,
    Type INTEGER NOT NULL,
    Dose REAL NOT NULL,
    Unit TEXT NOT NULL,
    Timing INTEGER NOT NULL,
    InsulinType INTEGER,
    InsulinDuration REAL,
    ScheduledTime TEXT NOT NULL,
    ActualTime TEXT,
    IsTaken INTEGER NOT NULL,
    Notes TEXT,
    FOREIGN KEY (UserId) REFERENCES Users(Id)
);

-- AI 聊天历史表
CREATE TABLE IF NOT EXISTS AIChatHistory (
    Id TEXT PRIMARY KEY,
    UserId TEXT NOT NULL,
    CreatedAt TEXT NOT NULL,
    Role TEXT NOT NULL,
    Content TEXT NOT NULL,
    Model TEXT,
    Context TEXT,
    Prompt TEXT,
    FOREIGN KEY (UserId) REFERENCES Users(Id)
);
```

### 6.2 连接字符串配置

```json
// appsettings.json
{
  "ConnectionStrings": {
    "SQLite": "Data Source=data/vitanote.db;Pooling=True;Max Pool Size=100;Journal Mode=WAL;",
    "PostgreSQL": "Host=localhost;Port=5432;Database=vitanote;Username=postgres;Password=your_password;Timeout=30;Command Timeout=60;"
  },
  "Database": {
    "Type": "SQLite"
  },
  "Serilog": {
    "WriteTo": [
      { "Name": "Console" },
      {
        "Name": "File",
        "Args": {
          "path": "logs/vitanote-.txt",
          "rollingInterval": "Day"
        }
      }
    ]
  }
}
```

---

## 7. 安全与隐私设计

### 7.1 数据加密

**密码加密**:
```csharp
// 使用 BCrypt 加密密码
public string HashPassword(string password)
{
    return BCrypt.Net.BCrypt.HashPassword(password);
}

public bool VerifyPassword(string password, string hash)
{
    return BCrypt.Net.BCrypt.Verify(password, hash);
}
```

**数据库加密** (SQLite):
- 使用 SQLCipher 加密数据库
- Tauri 移动端使用 encrypted-sqlite3

**传输加密**:
- HTTPS 强制启用
- API Key 不明文传输
- JWT Token 过期时间 24 小时

### 7.2 认证授权

**JWT Token 配置**:
```csharp
// Program.cs
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = "VitaNote",
        ValidAudience = "VitaNote",
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"])),
        ClockSkew = TimeSpan.Zero
    };
    
    options.Events = new JwtBearerEvents
    {
        OnChallenge = context =>
        {
            context.Response.StatusCode = StatusCodes.Status401Unauthorized;
            return Task.CompletedTask;
        }
    };
});
```

**权限控制**:
- 用户只能访问自己的数据 (通过 UserId 过滤)
- 管理员权限 (未来扩展)
- 敏感操作需要二次验证 (如删除关键数据)

---

## 8. 开发与部署

### 8.1 开发环境

**工具**:
- **IDE**: Visual Studio 2022 / VS Code
- **数据库**: SQLite (开发), PostgreSQL (生产)
- **AI 服务**: 第三方 API (OpenAI/Anthropic)

**开发启动**:
```bash
# 1. 配置数据库 (SQLite)
cd src/VitaNote.WebApi
dotnet ef database update

# 2. 启动后端 API
dotnet run --project VitaNote.WebApi

# 3. 启动前端 Web
cd frontend
npm install
npm run dev

# 4. 启动移动端 (Tauri)
cd vita-note
npm install
npm run taur dev
```

### 8.2 生产部署

**单体部署脚本**:
```bash
# 1. 构建前端
cd frontend
npm install
npm run build
# 生成 dist/ 目录

# 2. 配置后端
cd src/VitaNote.WebApi
dotnet publish -c Release -o ./publish

# 3. 配置数据库 (PostgreSQL)
# - 创建数据库
# - 运行迁移
# - 配置连接字符串

# 4. 配置 Nginx (Windows/Linux)
# - 静态文件指向 dist/
# - 反向代理到后端 API (localhost:5000)

# 5. 运行后端服务
# Windows: dotnet VitaNote.WebApi.dll
# Linux: systemd 服务

# 6. 启动 AI 服务调用
# - 配置 API Key (OpenAI/Anthropic)
# - 测试连接
```

**Docker 部署** (可选):
```yaml
# docker-compose.yml
version: '3.8'

services:
  vitanote-webapi:
    build:
      context: ./src/VitaNote.WebApi
      dockerfile: Dockerfile
    ports:
      - "5000:80"
    environment:
      - Database__Type=PostgreSQL
      - ConnectionStrings__PostgreSQL=${POSTGRES_CONNECTION_STRING}
    depends_on:
      - postgres
    restart: unless-stopped

  postgres:
    image: postgres:15
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_DB=vitanote
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
    volumes:
      - postgres-data:/var/lib/postgresql/data
    restart: unless-stopped

volumes:
  postgres-data:
```

---

## 9. 移动端 SQLite 直连数据库实现

### 9.1 Tauri 插件实现

**Windows/macOS/Linux 原生 SQLite 访问**:

```rust
// src-tauri/src/main.rs
#[tauri::command]
fn get_connection() -> Result<i64, String> {
    let conn = Connection::open("data/vitanote.db")
        .map_err(|e| e.to_string())?;
    Ok(conn.handle().as_ptr() as i64)
}

#[tauri::command]
fn query(sql: String, params: Vec<String>) -> Result<String, String> {
    let conn = Connection::open("data/vitanote.db")
        .map_err(|e| e.to_string())?;
    
    let mut stmt = conn.prepare(&sql)
        .map_err(|e| e.to_string())?;
    
    let rows = stmt.query_map(params, |row| {
        let value: String = row.get(0).unwrap_or_default();
        Ok(value)
    }).map_err(|e| e.to_string())?;
    
    let result: Vec<String> = rows.map(|r| r.unwrap_or_default()).collect();
    Ok(serde_json::to_string(&result).unwrap())
}

#[tauri::command]
fn execute(sql: String, params: Vec<String>) -> Result<i64, String> {
    let conn = Connection::open("data/vitanote.db")
        .map_err(|e| e.to_string())?;
    
    let count = conn.execute(&sql, params)
        .map_err(|e| e.to_string())?;
    
    Ok(count)
}
```

**前端调用**:
```typescript
// vita-note/src/services/db/api.ts
import { invoke } from '@tauri-apps/api/core';

export const dbApi = {
  async query(sql: string, params: any[] = []): Promise<any[]> {
    const jsonParams = JSON.stringify(params);
    const result = await invoke<string>('query', { sql, params: jsonParams });
    return JSON.parse(result);
  },
  
  async execute(sql: string, params: any[] = []): Promise<number> {
    return await invoke<number>('execute', { sql, params: JSON.stringify(params) });
  }
};
```

### 9.2 数据库文件位置

**各平台路径**:
- **Windows**: `%APPDATA%/VitaNote/data/vitanote.db`
- **macOS**: `~/Library/Application Support/VitaNote/data/vitanote.db`
- **Linux**: `~/.local/share/VitaNote/data/vitanote.db`

**Tauri 配置**:
```json
// src-tauri/tauri.conf.json
{
  "bundle": {
    "windows": {
      "tauri": {
        "bundleExternalLibs": []
      }
    }
  },
  "security": {
    "csp": null
  }
}
```

---

## 10. API 路由规划

### 10.1 Web API 路由表

| 路由 | 方法 | 功能 | 认证 | 说明 |
|------|------|------|------|------|
| `/api/auth/login` | POST | 用户登录 | ❌ | 返回 JWT Token |
| `/api/auth/register` | POST | 用户注册 | ❌ | |
| `/api/auth/profile` | GET | 获取用户信息 | ✅ | |
| `/api/auth/profile` | PUT | 更新用户信息 | ✅ | |
| `/api/auth/change-password` | POST | 修改密码 | ✅ | 需要旧密码 |
| `/api/foods` | GET | 获取饮食记录列表 | ✅ | 分页、筛选 |
| `/api/foods` | POST | 新增饮食记录 | ✅ | |
| `/api/foods/{id}` | PUT | 更新饮食记录 | ✅ | |
| `/api/foods/{id}` | DELETE | 删除饮食记录 | ✅ | |
| `/api/foods/statistics/today` | GET | 今日饮食统计 | ✅ | |
| `/api/glucose` | GET | 获取血糖记录 | ✅ | |
| `/api/glucose` | POST | 新增血糖记录 | ✅ | |
| `/api/glucose/statistics/today` | GET | 今日血糖统计 | ✅ | |
| `/api/medications` | GET | 获取用药记录 | ✅ | |
| `/api/medications` | POST | 新增用药记录 | ✅ | |
| `/api/medications/{id}/take` | POST | 标记已服药 | ✅ | |
| `/api/food-database` | GET | 获取食物数据库 | ✅ | |
| `/api/food-database/search` | GET | 搜索食物 | ✅ | |
| `/api/chat` | POST | 发送聊天消息 | ✅ | 可选：调用第三方 AI |
| `/api/chat/history` | GET | 获取聊天历史 | ✅ | |
| `/api/export/data` | GET | 导出个人数据 | ✅ | CSV/JSON |
| `/api/ai/food-estimate` | POST | 拍照估算食物热量 | ✅ | 可选：上传图片到第三方 OCR API |
| `/api/ai/extract-values` | POST | 拍照提取数值 | ✅ | 可选 |
| `/api/ai/chat` | POST | 直连 AI 聊天 | ✅ | 可选：后端转发到第三方 API |

---

## 11. 性能优化

### 11.1 数据库优化

**索引**:
```sql
CREATE INDEX IF NOT EXISTS idx_foods_user ON FoodEntries(UserId);
CREATE INDEX IF NOT EXISTS idx_foods_date ON FoodEntries(MealTime);
CREATE INDEX IF NOT EXISTS idx_glucose_user ON BloodGlucoseEntries(UserId);
CREATE INDEX IF NOT EXISTS idx_glucose_date ON BloodGlucoseEntries(CreatedAt);
CREATE INDEX IF NOT EXISTS idx_medication_user ON Medications(UserId);
CREATE INDEX IF NOT EXISTS idx_chat_user ON AIChatHistory(UserId);
```

**查询优化**:
- 分页查询 (使用 OFFSET/LIMIT)
- 指标缓存 (每日统计结果缓存)
- 异步操作 (Task/async)

**连接池**:
- SQLite: Pooling=True, Max Pool Size=100
- PostgreSQL: Connection Timeout=30, Command Timeout=60

### 11.2 移动端性能

**图片压缩**:
- 拍照前压缩 (最大 1024px)
- Base64 编码前压缩 (质量 80%)

**本地缓存**:
- SQLite 缓存图像路径
- 内存缓存最近数据 (Redis 用于 Web 后端)

**WAL 模式** (SQLite):
- Journal Mode=WAL 提升并发性能

---

## 12. 监控与日志

### 12.1 日志记录

```csharp
// Program.cs
builder.Host.UseSerilog((context, services, configuration) =>
{
    configuration
        .ReadFrom.Configuration(context.Configuration)
        .Enrich.FromLogContext()
        .WriteTo.Console()
        .WriteTo.File(
            path: "logs/vitanote-.txt",
            rollingInterval: RollingInterval.Day,
            retainedFileCountLimit: 30,
            outputTemplate: "{Timestamp:yyyy-MM-dd HH:mm:ss.fff zzz} [{Level:u3}] {Message:lj}{NewLine}{Exception}")
        .WriteTo.Debug();
});
```

**日志级别**:
- **Debug**: 详细调试信息
- **Info**: 一般信息 (启动、关闭、API 调用)
- **Warn**: 警告 (参数验证失败、API 超时)
- **Error**: 错误 (异常、数据库连接失败)

### 12.2 性能监控

- 数据库查询时间 (> 100ms 记录警告)
- API 响应时间 (> 1s 记录警告)
- AI 服务调用耗时 (> 3s 记录警告)

---

## 13. 扩展性设计

### 13.1 设备集成 (未来)

**蓝牙模块** (Tauri 插件):
```csharp
// src-tauri/src/plugins/bluetooth.rs
#[tauri::command]
async fn connect_bluetooth_device(mac: String) -> Result<(), String> {
    // 连接蓝牙设备 (血糖仪、血压计)
    // ...
}

#[tauri::command]
async fn read_bluetooth_data(device_id: String) -> Result<String, String> {
    // 读取设备数据
    // ...
}
```

**智能设备支持**:
- 血糖仪 (蓝牙)
- 血压计 (蓝牙)
- 体脂秤 (蓝牙)
- CGM (连续血糖监测)

### 13.2 插件化架构 (未来)

**模块化设计**:
- 每个功能模块独立 DLL
- 动态加载插件
- 插件注册表

---

## 14. AI 模型迁移计划

### 14.1 当前方案 (阶段 1)

- **AI 聊天**: 第三方 API (OpenAI/Anthropic/国内大模型)
- **图像识别**: 可选使用第三方 OCR API
- **优点**: 无需部署、快速上线、更新维护简单

### 14.2 未来方案 (阶段 2)

- **本地 AI 模型**: 部署在服务器或设备端
- **优势**: 隐私保护、离线可用、成本控制

---

## 15. 总结

### 15.1 架构优势

1. **合规性**: 移动端直连 SQLite，避免 API 调用带来的数据合规风险
2. **AI 灵活**: 使用第三方 API，无需本地部署，快速迭代
3. **单体部署**: 所有服务一体化部署，降低运维复杂度
4. **数据库切换**: 支持 SQLite (开发/离线) 和 PostgreSQL (生产)
5. **跨平台**: Tauri 实现 Windows/macOS/Linux 原生应用

### 15.2 部署图

```
┌─────────────────────────────────────────────────────────────────────┐
│                         单体服务器/设备                              │
├─────────────────────────────────────────────────────────────────────┤
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐   │
│  │  Web 应用         │  │  Mobile 应用       │  │  后端 API 服务    │   │
│  │  (Frontend)      │  │  (Vita-Note)       │  │  (VitaNote.WebApi)│   │
│  │  • Nginx 静态服务│  │  • Tauri 容器       │  │  • Kestrel       │   │
│  │  • 静态文件托管    │  │  • SQLite 文件      │  │  • PostgreSQL   │   │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘   │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                      PostgreSQL Database                      │    │
│  │                   (或 SQLite 文件)                             │    │
│  └─────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
                          │
                          ▼
                  ┌─────────────────┐
                  │  第三方 AI API  │
                  │  (云端服务)      │
                  └─────────────────┘
```

### 15.3 关键决策

| 决策 | 说明 |
|------|------|
| 移动端直连 SQLite | 避免 API 调用带来的合规风险 |
| AI 使用第三方 API | 无需本地部署，快速上线 |
| 单体部署 | 降低运维复杂度 |
| 数据库切换支持 | 满足开发和生产不同需求 |
| Web 前端必须通过 API | 数据安全和权限控制 |
