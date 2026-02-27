# VitaNote - AI Coding Agent Guide

## Project Overview

VitaNote (维塔笔记) is an intelligent health management platform designed for diabetes patients. It integrates mobile photography, AI recognition, data tracking, and personalized health management features.

**Key Features:**
- AI-powered food recognition (calorie, nutrition estimation)
- Blood glucose tracking and analysis
- Medication management with insulin dose calculation
- AI health assistant chat (24/7 consultation)
- Diet management with food database

**Target Users:** Diabetes patients (Type 1 & Type 2), people controlling diet/weight, health-conscious individuals.

---

## Technology Stack

### Backend (Web API)
- **Framework**: .NET 10 ASP.NET Core
- **Language**: C# 12
- **ORM**: Entity Framework Core 10
- **Database**: SQLite (development/offline) / PostgreSQL (production)
- **Authentication**: JWT Bearer Token + BCrypt password hashing
- **API Documentation**: OpenAPI 3.0 + Scalar

### Web Frontend
- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite 7
- **UI Library**: Material-UI (MUI) v6
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Routing**: React Router v7

### Mobile/Desktop App
- **Framework**: React 19 + TypeScript + Tauri 2
- **Target Platforms**: Windows, macOS, Linux
- **Database**: Direct SQLite/PostgreSQL connection (factory pattern)
- **AI Integration**: Direct third-party API calls (OpenAI/Anthropic)

### AI Services
- **Providers**: OpenAI GPT, Anthropic Claude, Chinese LLMs (通义千问)
- **Integration**: Mobile calls APIs directly; Backend provides optional proxy

---

## Project Structure

```
VitaNote/
├── VitaNote.slnx                 # Visual Studio solution file
├── README.md                     # Project overview (Chinese)
├── DESIGN.md                     # Requirements design document
├── ARCHITECTURE.md               # System architecture design
├── BUILD.md                      # Build and run instructions
├── DATABASE.md                   # Database configuration guide
├── IMPLEMENTATION.md             # Implementation status summary
├── QWEN.md                       # Project context for Qwen
├── database-migrations.sql       # Database migration scripts
│
├── src/                          # Backend source code
│   ├── VitaNote.Shared/          # Shared library (models, enums)
│   │   ├── Models/               # Entity models (User, FoodEntry, etc.)
│   │   └── Enums.cs              # Enumeration definitions
│   └── VitaNote.WebApi/          # Web API project
│       ├── Controllers/          # API controllers
│       ├── Services/             # Business services
│       ├── Data/                 # DbContext and migrations
│       ├── DTOs/                 # Data transfer objects
│       ├── Program.cs            # Application entry point
│       └── appsettings.json      # Configuration file
│
├── frontend/                     # Web frontend (React + Vite)
│   ├── src/
│   │   ├── api/                  # API client (Axios)
│   │   ├── components/           # Reusable components
│   │   ├── pages/                # Page components
│   │   ├── store/                # Zustand stores
│   │   └── theme/                # Material Design theme
│   ├── package.json
│   └── vite.config.ts
│
├── vita-note/                    # Mobile/Desktop app (Tauri)
│   ├── src/
│   │   ├── api/                  # API client
│   │   ├── pages/                # Page components
│   │   ├── services/             # Database & AI services
│   │   │   ├── db/               # SQLite/PostgreSQL implementations
│   │   │   └── ai/               # AI chat service
│   │   └── store/                # Auth store
│   ├── src-tauri/                # Tauri Rust code
│   │   ├── Cargo.toml
│   │   └── tauri.conf.json
│   └── package.json
│
└── tests/                        # Test projects (empty currently)
```

---

## Build and Run Commands

### Prerequisites
- **.NET 10 SDK**: https://dotnet.microsoft.com/download
- **Node.js**: v18+ 
- **Rust**: https://rustup.rs/ (for Tauri mobile app)
- **PostgreSQL**: (optional, for production database)

### Backend API

```bash
cd src/VitaNote.WebApi

# Restore dependencies
dotnet restore

# Build project
dotnet build

# Run development server (default: http://localhost:5000)
dotnet run

# Database migrations
dotnet ef database update
```

### Web Frontend

```bash
cd frontend

# Install dependencies
npm install

# Development mode (http://localhost:5173)
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

### Mobile/Desktop App

```bash
cd vita-note

# Install dependencies
npm install

# Development mode (Tauri launches native window)
npm run dev

# Build for production
npm run tauri build

# Platform-specific builds
npm run tauri build --target x86_64-pc-windows-msvc
npm run tauri build --target aarch64-apple-darwin
npm run tauri build --target x86_64-unknown-linux-gnu
```

---

## Configuration

### Backend Configuration (`src/VitaNote.WebApi/appsettings.json`)

```json
{
  "ConnectionStrings": {
    "SQLite": "Data Source=data/vitanote.db",
    "PostgreSQL": "Host=localhost;Port=5432;Database=vitanote;Username=postgres;Password=your_password;"
  },
  "Database": {
    "Type": "SQLite"
  },
  "Jwt": {
    "Issuer": "VitaNote",
    "Audience": "VitaNote",
    "Key": "vitanote-secret-key-2026-secure-jwt-key-12345"
  },
  "AI": {
    "Provider": "OpenAI",
    "ApiKey": "your-api-key-here",
    "Endpoint": "https://api.openai.com/v1/chat/completions",
    "Model": "gpt-4o-mini"
  }
}
```

### Database Switching

To switch between SQLite and PostgreSQL:
1. Update `Database:Type` in `appsettings.json` to `"SQLite"` or `"PostgreSQL"`
2. Ensure the corresponding connection string is correctly configured
3. Run `dotnet ef database update` to apply migrations

### AI Service Configuration

Supported AI providers:
- **OpenAI**: `https://api.openai.com/v1/chat/completions`
- **Anthropic**: `https://api.anthropic.com/v1/messages`
- **通义千问**: `https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation`

---

## Code Style Guidelines

### C# (Backend)
- Use **file-scoped namespaces** (C# 10+)
- Enable **nullable reference types** (`<Nullable>enable</Nullable>`)
- Use **implicit usings** (`<ImplicitUsings>enable</ImplicitUsings>`)
- Follow standard C# naming conventions:
  - PascalCase for classes, methods, properties
  - camelCase for local variables and parameters
  - _camelCase for private fields (if used)
- Use `required` keyword for mandatory properties in models
- Use `async/await` for asynchronous operations

### TypeScript/React (Frontend)
- Use **functional components** with hooks
- Use **TypeScript strict mode**
- Use **ES modules** (`"type": "module"`)
- Naming conventions:
  - PascalCase for components, interfaces, types
  - camelCase for functions, variables
  - UPPER_SNAKE_CASE for constants
- Use Material-UI components with `sx` prop for styling
- Use Zustand for state management

### Database
- Use **UUID** for primary keys (stored as TEXT in SQLite, UUID in PostgreSQL)
- Use **INTEGER** for enum values
- Use **TIMESTAMPTZ** (PostgreSQL) / **TEXT** (SQLite) for timestamps
- Create indexes for frequently queried columns (UserId, dates)

---

## Testing Instructions

### Backend Tests
```bash
cd tests
dotnet test
```

### Frontend Tests
```bash
cd frontend
npm test
```

### E2E Tests (Tauri)
```bash
cd vita-note
npm run tauri test
```

**Note:** The `tests/` directory is currently empty. Tests need to be added.

---

## Security Considerations

### Authentication
- JWT tokens expire after 24 hours
- Passwords are hashed using BCrypt
- All API endpoints (except auth) require valid JWT token

### Data Isolation
- Each user can only access their own data
- UserId is extracted from JWT claims and used to filter queries

### AI Service Security
- API keys are stored in `appsettings.json` (server-side only)
- Mobile app can configure its own AI API key for direct access
- Never commit API keys to version control

### Database Security
- SQLite: Ensure `data/` directory has proper file permissions
- PostgreSQL: Use strong passwords and restrict network access

---

## API Endpoints

### Authentication
```
POST   /api/auth/register           # Register new user
POST   /api/auth/login              # Login, returns JWT
GET    /api/auth/profile            # Get current user profile
```

### Food Management
```
GET    /api/foods                   # Get food entries (paginated)
POST   /api/foods                   # Create food entry
PUT    /api/foods/{id}              # Update food entry
DELETE /api/foods/{id}              # Delete food entry
GET    /api/foods/statistics/today  # Today's nutrition stats
```

### Blood Glucose
```
GET    /api/glucose                 # Get glucose records
POST   /api/glucose                 # Create glucose record
GET    /api/glucose/statistics/today # Today's glucose stats
```

### Medication
```
GET    /api/medications             # Get medication records
POST   /api/medications             # Create medication record
POST   /api/medications/{id}/take   # Mark as taken
```

### AI Chat
```
POST   /api/chat                    # Send message to AI
GET    /api/chat/history            # Get chat history
```

---

## Development Workflow

1. **Start Backend**: `cd src/VitaNote.WebApi && dotnet run`
2. **Start Web Frontend**: `cd frontend && npm run dev`
3. **Start Mobile App**: `cd vita-note && npm run dev`

The web frontend proxies API requests to `http://localhost:5000` via Vite dev server proxy configuration.

---

## Known Issues

1. **BCrypt.Net Warning**: NU1701 compatibility warning with .NET 10, but functionality works
2. **Scalar API Reference**: Currently commented out in Program.cs, can be enabled later
3. **Tests**: Test projects are not yet implemented
4. **Tauri Build**: Requires Rust toolchain to be installed

---

## Documentation References

- **DESIGN.md**: Complete requirements and feature specifications
- **ARCHITECTURE.md**: System architecture, data models, API design
- **BUILD.md**: Detailed build instructions and troubleshooting
- **DATABASE.md**: Database setup, migration, and configuration
- **IMPLEMENTATION.md**: Current implementation status and next steps
- **QWEN.md**: Project context summary for AI assistants

---

## License

MIT License
