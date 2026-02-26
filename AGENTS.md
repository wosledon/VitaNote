# VitaNote - AI Coding Agent Guide

## Project Overview

VitaNote (智能健康管理应用) is a full-stack intelligent health management application supporting Web, mobile, and desktop platforms. The application allows users to track health data (weight, blood glucose, blood pressure), perform OCR text recognition via LLM, and interact with an AI health assistant.

**Primary Language**: Chinese (中文) - All documentation, comments, and UI text are in Chinese.

## Technology Stack

### Backend
- **.NET 10** - ASP.NET Core WebAPI
- **Entity Framework Core 10** - ORM and database access
- **SQLite** (Development) / **PostgreSQL** (Production)
- **JWT** - Authentication and authorization
- **Swagger/OpenAPI** - API documentation
- **Docker** - Containerization

### Frontend
- **React 18** + **TypeScript 5.3**
- **Vite 5** - Build tool and dev server
- **Material UI (MUI) 5** - Component library
- **Zustand** - State management
- **Axios** - HTTP client
- **React Router 6** - Routing
- **React Hook Form** - Form handling
- **TanStack Query** - Server state management

### Mobile/Desktop
- **Tauri 2.0** - Cross-platform framework (Rust + Web frontend)
- **Rust** - Native backend for Tauri
- **TypeScript/React** - Frontend for mobile app

## Project Structure

```
VitaNote/
├── backend/              # .NET 10 WebAPI (DDD Architecture)
│   ├── src/VitaNote/
│   │   ├── Domain/           # Core entities, value objects, repositories
│   │   ├── Application/      # Services, DTOs, business logic
│   │   ├── Infrastructure/   # DbContext, repositories, external services
│   │   └── WebApi/           # Controllers, middleware, configuration
│   └── Dockerfile
├── frontend/             # React + Vite + TypeScript
│   ├── src/
│   │   ├── api/              # API client (Axios) and services
│   │   ├── components/       # Reusable React components
│   │   ├── pages/            # Page components
│   │   ├── store/            # Zustand state management
│   │   └── types/            # TypeScript type definitions
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
├── mobile/               # Tauri 2.0 (Rust + React)
│   ├── src-tauri/
│   │   ├── src/
│   │   │   ├── commands/     # Tauri native commands
│   │   │   ├── lib.rs
│   │   │   └── main.rs
│   │   └── Cargo.toml
│   ├── tauri.conf.json
│   └── package.json
└── docs/                 # Documentation
```

## Architecture

### Backend - Domain-Driven Design (DDD)

The backend follows a strict layered architecture:

1. **Domain Layer** (`Domain/`)
   - Entities: `User`, `HealthRecord`, `FoodRecord`, `Profile`
   - Value Objects: `WeightRecordValue`, `GlucoseRecordValue`, `BloodPressureRecordValue`
   - Repository Interfaces: `IUserRepository`, `IHealthRecordRepository`, etc.

2. **Application Layer** (`Application/`)
   - Services: `AuthService`, `HealthRecordService`, `OcrService`, `LlmService`
   - DTOs: Request/Response objects
   - Service interfaces

3. **Infrastructure Layer** (`Infrastructure/`)
   - `VitaNoteDbContext` - EF Core database context
   - Repository implementations
   - `LocalFileStorageService` - File storage

4. **Web API Layer** (`WebApi/`)
   - Controllers: `AuthController`, `HealthRecordsController`, `OcrController`, `LlmController`
   - Middleware: `ExceptionMiddleware`
   - Extensions: Dependency injection configuration

### Frontend State Management

Uses **Zustand** with persistence:
- `authStore.ts` - Authentication state (token, user, login/logout)
- `recordsStore.ts` - Health records state
- `llmStore.ts` - LLM chat state

### Database Schema

- **Users** - User accounts with password hash
- **HealthRecords** - Weight, glucose, blood pressure records (JSON data field)
- **FoodRecords** - Food consumption with nutrition info
- **Profiles** - User profile information

## Build and Run Commands

### Prerequisites
- .NET 10.0 SDK
- Node.js 18+ (with npm)
- Rust (for Tauri mobile development)

### Quick Start (One-Click)

**Windows:**
```bash
start-all.bat
```

**Linux/Mac:**
```bash
chmod +x start-all.sh
./start-all.sh
```

### Manual Start

**Backend:**
```bash
cd backend/src/VitaNote/WebApi
dotnet run --urls "http://localhost:5000"
```
- API: http://localhost:5000
- Swagger: http://localhost:5000/swagger

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```
- URL: http://localhost:5173

**Mobile (Tauri):**
```bash
cd mobile
npm install
npx tauri dev
```

### Build Commands

**Frontend Build:**
```bash
cd frontend
npm run build        # Production build
npm run preview      # Preview production build
```

**Backend Build:**
```bash
cd backend/src/VitaNote/WebApi
dotnet publish -c Release
```

**OpenAPI Type Generation:**
```bash
cd frontend
npm run openapi      # Generates src/api/generated.ts from running backend
```

### Docker Deployment

```bash
docker-compose up -d
```

Services:
- API: http://localhost:5000
- Frontend: http://localhost:3000
- PostgreSQL: localhost:5432
- Ollama (LLM): localhost:11434

## Configuration

### Backend Configuration

Create `backend/src/VitaNote/WebApi/appsettings.Development.json`:

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*",
  "Database": {
    "Type": "Sqlite"
  },
  "ConnectionStrings": {
    "Sqlite": "Data Source=vitanote.db",
    "PostgreSQL": "Host=localhost;Port=5432;Database=vitanote;Username=postgres;Password=postgres"
  },
  "Jwt": {
    "SecretKey": "YourSuperSecretKeyThatShouldBeAtLeast32CharactersLong!",
    "Issuer": "VitaNote",
    "Audience": "VitaNoteClient",
    "ExpirationHours": 24
  },
  "Ollama": {
    "Endpoint": "http://localhost:11434",
    "Model": "gpt-4o"
  },
  "Storage": {
    "BasePath": "uploads",
    "PublicUrl": "/uploads"
  }
}
```

### Frontend Configuration

Environment variables in `frontend/.env`:
```
VITE_API_BASE_URL=http://localhost:5000
```

Or use `frontend/.env.json` for JSON configuration.

## Code Style Guidelines

### C# / .NET

- Use **file-scoped namespaces** (no braces)
- Enable **nullable reference types** (`<Nullable>enable</Nullable>`)
- Use **implicit usings** (`<ImplicitUsings>enable</ImplicitUsings>`)
- Follow standard C# naming conventions:
  - PascalCase for classes, methods, properties
  - camelCase for local variables and parameters
  - _camelCase for private fields (if used)
- Use `record` for DTOs when appropriate
- Use `async/await` for asynchronous operations

### TypeScript / React

- Use **strict TypeScript** configuration
- Use functional components with hooks
- Use path alias `@/` for imports from `src/`
- Naming conventions:
  - PascalCase for components, interfaces, types
  - camelCase for functions, variables
  - UPPER_SNAKE_CASE for constants
- Use Zustand for state management
- Use Material UI components and theming

### Rust (Tauri)

- Follow standard Rust naming conventions
- Use `serde` for serialization
- Handle errors with `thiserror` or `anyhow`

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - Logout
- `POST /api/auth/refresh-token` - Refresh JWT token

### Health Records
- `GET /api/health-records/{type}` - Get records by type (weight/glucose/blood-pressure)
- `POST /api/health-records/{type}` - Create new record
- `GET /api/health-records/statistics` - Get statistics

### OCR
- `POST /api/ocr/extract-text` - Extract text from image
- `POST /api/ocr/detect-food` - Detect food from image
- `POST /api/ocr/detect-health-data` - Detect health device readings

### LLM
- `POST /api/llm/chat` - AI health assistant chat
- `POST /api/llm/advice` - Get health advice

## Testing Strategy

Currently, the project does not have automated tests implemented. The recommended approach would be:

### Backend Testing
- **Unit Tests**: xUnit for service layer testing
- **Integration Tests**: TestHost for API endpoint testing
- **Test Location**: Create `backend/tests/` directory

### Frontend Testing
- **Unit Tests**: Vitest for component and utility testing
- **E2E Tests**: Playwright for end-to-end testing

## Security Considerations

1. **JWT Authentication**
   - Short expiration time (24 hours default)
   - Refresh token mechanism implemented
   - Secure secret key required (min 32 characters)

2. **Password Security**
   - BCrypt hashing for passwords
   - Identity framework integration

3. **CORS**
   - Configured for specific origins: `http://localhost:3000`, `http://localhost:5173`

4. **File Uploads**
   - Validate file types and sizes
   - Store outside web root when possible

5. **Database**
   - EF Core prevents SQL injection
   - Use parameterized queries for raw SQL

## Common Development Tasks

### Adding a New API Endpoint

1. Define DTOs in `Application/{Feature}/DTOs/`
2. Add service interface and implementation in `Application/{Feature}/Services/`
3. Create controller in `WebApi/Controllers/`
4. Register service in `WebApi/Extensions/ServiceCollectionExtensions.cs`
5. Run backend and generate TypeScript types: `npm run openapi`

### Adding a New Frontend Page

1. Create page component in `frontend/src/pages/`
2. Add route in `App.tsx`
3. Add navigation link in `Layout.tsx` if needed
4. Create store if new state management needed

### Database Migrations

```bash
cd backend/src/VitaNote/WebApi
dotnet ef migrations add MigrationName --project ../Infrastructure
dotnet ef database update
```

## Troubleshooting

### Backend Issues
- **Port 5000 in use**: Change port in `dotnet run --urls "http://localhost:5001"`
- **Missing config**: Create `appsettings.Development.json`
- **Database locked**: Delete `vitanote.db` and restart

### Frontend Issues
- **Port 5173 in use**: Vite will automatically find next available port
- **API connection failed**: Check `VITE_API_BASE_URL` and ensure backend is running
- **Type errors**: Run `npm run openapi` to regenerate API types

### Mobile Issues
- **Tauri not found**: Install Tauri CLI: `npm install -g @tauri-apps/cli`
- **Rust compilation errors**: Ensure Rust toolchain is up to date: `rustup update`

## External Dependencies

- **Ollama** - Local LLM server for OCR and chat (optional, can use other LLM providers)
  - Install: https://ollama.com
  - Default endpoint: http://localhost:11434

## License

MIT License - See LICENSE file for details.

---

**Note**: This project uses Chinese as the primary language for documentation, comments, and UI. When adding new features or documentation, maintain consistency with the existing Chinese language approach.
