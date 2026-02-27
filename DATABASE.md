# VitaNote - 数据库设置指南

## SQLite (推荐用于开发/离线)

SQLite 数据库会自动创建，无需手动配置。

### 配置

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

### 数据库位置

- **Windows**: `%APPDATA%\VitaNote\data\vitanote.db`
- **macOS**: `~/Library/Application Support/VitaNote/data/vitanote.db`
- **Linux**: `~/.local/share/VitaNote/data/vitanote.db`

## PostgreSQL (推荐用于生产/多设备)

### 1. 安装 PostgreSQL

```bash
# Windows (使用安装程序)
# https://www.postgresql.org/download/windows/

# macOS (使用 Homebrew)
brew install postgresql@15
brew services start postgresql@15

# Linux (Ubuntu/Debian)
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo service postgresql start
```

### 2. 创建数据库和用户

```sql
-- 使用 psql 或 pgAdmin 运行
CREATE DATABASE vitanote;
CREATE USER vitanote_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE vitanote TO vitanote_user;
GRANT ALL ON SCHEMA public TO vitanote_user;
```

### 3. 配置连接字符串

```json
{
  "ConnectionStrings": {
    "PostgreSQL": "Host=localhost;Port=5432;Database=vitanote;Username=vitanote_user;Password=your_secure_password;"
  },
  "Database": {
    "Type": "PostgreSQL"
  }
}
```

### 4. 运行数据库迁移

```bash
cd src/VitaNote.WebApi

# 迁移数据库
dotnet ef database update

# 或使用迁移文件
dotnet ef migrations add InitialCreate
dotnet ef database update
```

## 数据库迁移

### 创建新迁移

```bash
cd src/VitaNote.WebApi

# 创建新迁移
dotnet ef migrations add AddNewFeature

# 应用迁移
dotnet ef database update

# 删除最后迁移
dotnet ef migrations remove
```

### 生成迁移 SQL 脚本

```bash
# 生成升级脚本
dotnet ef migrations script

# 生成从某个迁移开始的脚本
dotnet ef migrations script InitialCreate

# 导出到文件
dotnet ef migrations script > migration.sql
```

## 手动数据库设置

### SQLite

 automatically created when you run the application for the first time.

### PostgreSQL

创建数据库:
```sql
CREATE DATABASE vitanote WITH OWNER = postgres ENCODING = 'UTF8';
\c vitanote
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres;
```

## 数据库验证

### SQLite

```bash
# 使用 SQLite CLI
sqlite3 data/vitanote.db ".tables"

# 查看表结构
sqlite3 data/vitanote.db "DESCRIBE Users;"
```

### PostgreSQL

```bash
# 使用 psql
psql -U postgres -d vitanote -c "\dt"

# 或
psql -U postgres -d vitanote -c "SELECT * FROM Users LIMIT 5;"
```

## 备份和恢复

### SQLite

```bash
# 备份
cp data/vitanote.db data/vitanote.db.backup

# 恢复
cp data/vitanote.db.backup data/vitanote.db
```

### PostgreSQL

```bash
# 备份
pg_dump -U postgres -d vitanote > backup.sql

# 恢复
psql -U postgres -d vitanote < backup.sql
```

## 性能优化

### SQLite

- 已启用 WAL 模式: `Journal Mode=WAL`
- 连接池: `Max Pool Size=100`

### PostgreSQL

添加索引 (如果缺失):
```sql
CREATE INDEX IF NOT EXISTS idx_foods_user_date ON "FoodEntries"("UserId", "MealTime");
CREATE INDEX IF NOT EXISTS idx_glucose_user_date ON "BloodGlucoseEntries"("UserId", "CreatedAt");
CREATE INDEX IF NOT EXISTS idx_medication_user ON "Medications"("UserId");
CREATE INDEX IF NOT EXISTS idx_chat_user_date ON "AIChatHistory"("UserId", "CreatedAt");
```

启用连接池 (推荐使用 PgBouncer):
```conf
# postgresql.conf
max_connections = 100
shared_buffers = 256MB
```

## troubleshooting

### SQLite

**问题**: "无法打开数据库文件"
- 解决方案: 确保 `data/` 目录存在，应用程序有写入权限

### PostgreSQL

**问题**: "Connection refused"
- 解决方案: 启动 PostgreSQL 服务: `sudo service postgresql start`

**问题**: "FATAL: password authentication failed"
- 解决方案: 确保连接字符串中的用户名和密码正确

**问题**: "FATAL: no pg_hba.conf entry"
- 解决方案: 编辑 `pg_hba.conf` 添加:
  ```
  host    all             all             0.0.0.0/0               md5
  ```
