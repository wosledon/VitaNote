# VitaNote - AI-Powered Health Management System

## Project Overview

VitaNote is a comprehensive health management system designed specifically for chronic disease patients, particularly糖尿病 patients. The system integrates mobile photography, AI-powered smart recognition, data tracking, and personalized health management to help users achieve comprehensive health monitoring and management.

### Core Features

- 📸 **AI Camera Recognition**: Automatic food calorie estimation and nutritional component recognition via photo
- 🩺 **Data Reading**: Extract numerical values from medical devices (glucometer, blood pressure monitor) and reports
- 🍽️ **Diet Management**: Comprehensive diet tracking and analysis
- 🩸 **Glucose Management**: Professional glucose tracking and analysis tools
- 💊 **Medication Management**: Medication tracking and reminders
- 🤖 **AI Health Assistant**: Chatbot providing personalized health recommendations

### Technology Stack

| Component | Technology |
|-----------|-----------|
| **Mobile App** | React 19 + TypeScript + Tauri 2 (Windows/macOS/Linux) |
| **Web Frontend** | React 19 + TypeScript + Vite |
| **Backend** | .NET 10 ASP.NET Core Web API |
| **Database** | SQLite/PostgreSQL (mobile direct connect), SQLite/PostgreSQL (backend) |
| **AI Services** | Third-party APIs (OpenAI, Anthropic, domestic LLMs) |
| **UI Design** | Material Design with rounded card style |

### Architecture

```
User Layer
├── Frontend (Web)         → API Gateway → Data Layer
│   • React + Vite         • REST API    • SQLite/PostgreSQL
│   • Material Design                             • AI API (Cloud)
└── Vita-Note (Mobile)     → SQLite/PG (Direct)  • AI API (Cloud)
```

**Key Principles:**
- **Mobile direct database connect**: Mobile app can connect to SQLite or PostgreSQL directly
  - SQLite for local/offline mode
  - PostgreSQL for remote/synced mode
- **Web frontend via API**: Must pass through backend API for data access
- **Third-party AI services**: No local AI model deployment, uses cloud APIs
- **Single deployment**: All services deployed on same server, no microservices

## Project Structure

```
VitaNote/
├── DESIGN.md                    # Requirements design document
├── ARCHITECTURE.md              # System architecture design
├── QWEN.md                      # This file
├── VitaNote.slnx               # Visual Studio solution
│
├── frontend/                   # Web frontend (React + Vite)
│   └── src/                    # Frontend source code
│
├── src/
│   ├── VitaNote.Shared/        # Shared library (models, DTOs, enums)
│   │   └── *.cs               # C# shared classes
│   │
│   └── VitaNote.WebApi/        # Web API server (.NET 10)
│       ├── Controllers/        # API controllers
│       ├── Services/           # Business services
│       ├── Data/               # Database context and repositories
│       ├── DTOs/               # Data Transfer Objects
│       ├── Program.cs          # API entry point
│       └── appsettings.json    # Configuration
│
├── vita-note/                  # Mobile app (Tauri + React)
│   ├── src/                    # Mobile source code
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/         # DB: SQLite/PG direct access
│   │   │   ├── db/           # Database abstraction layer
│   │   │   │   ├── sqlite/   # SQLite implementation
│   │   │   │   └── postgres/ # PostgreSQL implementation
│   │   │   └── ai/           # Third-party AI services
│   │   └── utils/            # Camera, image processing
│   ├── src-tauri/            # Tauri configuration
│   │   ├── Cargo.toml
│   │   └── tauri.conf.json
│   ├── vite.config.ts
│   └── package.json
│
└── tests/                      # Test files (to be implemented)
```

## Building and Running

### Prerequisites

- **Node.js**: v18+ (for React/Vite/Tauri)
- **.NET 10 SDK**: For backend API
- **Rust**: For Tauri native bindings
- **SQLite CLI**: (optional) For database inspection
- **PostgreSQL CLI**: (optional) For database inspection

### Development Setup

#### 1. Backend API (.NET 10)

```bash
cd src/VitaNote.WebApi

# Restore dependencies
dotnet restore

# Run migrations (if using EF Core)
dotnet ef database update

# Run the API server
dotnet run
```

The API will be available at `https://localhost:5001` (or configured port).

API documentation (Scalar) available at `/scalar` endpoint in development.

#### 2. Web Frontend

```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

Vite dev server runs on `http://localhost:5173` by default.

#### 3. Mobile App (Tauri)

```bash
cd vita-note

# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for production
npm run taur build

# Database selection:
# - SQLite mode: Local/offline storage (default for mobile)
# - PostgreSQL mode: Remote/synced storage (for multi-device sync)
# Configure via app settings or build environment variables
```

### Project Status

**Current State:**
- ✅ Project structure established
- ✅ Design and architecture documents complete
- ⚠️ Backend: Empty project template (needs implementation)
- ⚠️ Web Frontend: Empty directory (needs implementation)
- ⚠️ Mobile App: Basic Tauri template (needs implementation)
- ⚠️ Tests: Empty directory (to be implemented)

## Development Conventions

### Code Style

**C# Backend (.NET 10):**
- Follow Microsoft C# Coding Conventions
- Use PascalCase for public members
- Use async/await for all I/O operations
- Use EF Core for database operations
- Implement FluentValidation for DTO validation
- Use Serilog for logging
- JWT authentication with 24-hour token expiration

**React Frontend:**
- Functional components with TypeScript
- props and state typed strictly
- Use React Context for state management (lightweight)
- Material Design components with rounded corners (12-16px)
- CSS modules or styled-components for component styling

**Tauri Rust Plugins:**
- Follow Tauri plugin conventions
- Use typed commands for IPC
- Handle errors gracefully with proper error codes

### API Design Rules

- **RESTful endpoints**: Use standard HTTP methods (GET, POST, PUT, DELETE)
- **OpenAPI 3.0**: Document all endpoints
- **Uniform response format**:
  ```json
  {
    "success": true,
    "data": { ... },
    "message": "",
    "timestamp": "2026-02-27T10:30:00Z"
  }
  ```
- **Error handling**:
  ```json
  {
    "success": false,
    "error": {
      "code": "VALIDATION_ERROR",
      "message": "Validation failed",
      "details": [...]
    }
  }
  ```

### Database Conventions

**Mobile App**:
- **SQLite**: Local/offline storage (default for single-device use)
  - Use `Pooling=True;Max Pool Size=100;Journal Mode=WAL;`
  - File location: App data directory
- **PostgreSQL**: Remote/synced storage (for multi-device sync)
  - Host: Configure via app settings
  - Connection pooling enabled
  - SSL/TLS encryption recommended

**Backend API**:
- **SQLite**: Development and local testing
- **PostgreSQL**: Production and multi-device sync
- **EF Core**: Code-first migrations
- **Encryption**: SQLCipher for sensitive data (optional)

### AI Integration

- **Chat AI**: OpenAI GPT-4o-mini, Anthropic Claude, or domestic LLMs
- **Image Recognition**: OCR APIs for medical device reading (future)
- **No local models**: All AI calls go to third-party cloud services
- **API Key management**: Store in environment variables or configuration

### UI/UX Design

**Material Design with Rounded Cards:**
- Border radius: 12-16px for all cards
- Shadow: `box-shadow: 0 2px 8px rgba(0,0,0,0.1)`
- Primary color: Material Design primary palette
- Health indicators: Green (#4CAF50) for normal, Red (#F44336) for abnormal
- All content areas use rounded card style

**Mobile-First Considerations:**
- Touch-friendly UI (minimum 44px touch targets)
- Dark mode support (optional)
- Offline-first data access
- Direct database access (SQLite/PostgreSQL) for performance
- Database type selection: SQLite (local), PostgreSQL (synced)

## Key APIs to Implement

### Backend Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/login` | User login | ❌ |
| POST | `/api/auth/register` | User registration | ❌ |
| GET | `/api/auth/profile` | Get user profile | ✅ |
| GET | `/api/foods` | Get food entries | ✅ |
| POST | `/api/foods` | Create food entry | ✅ |
| GET | `/api/glucose` | Get glucose entries | ✅ |
| POST | `/api/glucose` | Create glucose entry | ✅ |
| GET | `/api/medications` | Get medication records | ✅ |
| POST | `/api/medications` | Create medication record | ✅ |
| POST | `/api/chat` | Send chat message (AI) | ✅ |
| GET | `/api/chat/history` | Get chat history | ✅ |
| GET | `/api/export/data` | Export user data (CSV/JSON) | ✅ |

### Mobile Direct Database Access

The mobile app can connect directly to either SQLite or PostgreSQL:

```typescript
// VitaNote mobile app - Database abstraction
import { SQLiteDatabase } from './db/sqlite';
import { PostgresDatabase } from './db/postgres';

// Configuration from app settings
const dbConfig = {
  type: 'sqlite', // or 'postgres'
  path: 'data/vitanote.db',
  host: 'localhost',
  port: 5432,
  database: 'vitanote',
  username: 'postgres',
  password: 'your_password'
};

// Create database instance
let db: SQLiteDatabase | PostgresDatabase;
if (dbConfig.type === 'postgres') {
  db = new PostgresDatabase(dbConfig);
} else {
  db = new SQLiteDatabase(dbConfig.path);
}

// Direct query (same interface for both)
const foods = await db.query<FoodEntry>('SELECT * FROM FoodEntries WHERE UserId = ?', [userId]);
```

### AI Service Integration (Third-Party)

```typescript
// OpenAI API call
const response = await fetch('https://api.openai.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: 'You are a diabetes health assistant...' },
      { role: 'user', content: userQuestion }
    ]
  })
});
```

## Configuration

### Backend Settings

```json
// src/VitaNote.WebApi/appsettings.json
{
  "ConnectionStrings": {
    "SQLite": "Data Source=data/vitanote.db;Pooling=True;Max Pool Size=100;",
    "PostgreSQL": "Host=localhost;Port=5432;Database=vitanote;Username=postgres;Password=your_password;"
  },
  "Database": {
    "Type": "SQLite"  // Switch between SQLite/PostgreSQL
  },
  "AI": {
    "Provider": "OpenAI",
    "ApiKey": "",
    "Endpoint": "https://api.openai.com/v1/chat/completions",
    "Model": "gpt-4o-mini"
  }
}
```

## Testing

**To be implemented:**

```bash
# Backend tests
cd src/VitaNote.WebApi
dotnet test

# Frontend tests
cd frontend
npm test

# Mobile tests
cd vita-note
npm run taur test
```

## Known Issues

- Empty project structure (needs implementation)
- No database schema yet
- No API endpoints implemented
- No AI integration configured
- No test coverage

## Next Steps

1. **Backend Development**
   - Implement entity models (User, FoodEntry, BloodGlucose, Medication)
   - Set up EF Core database context
   - Create database migrations
   - Implement API controllers and services
   - Configure authentication and authorization

2. **Web Frontend Development**
   - Set up React + Vite project structure
   - Implement Material Design theme
   - Create pages (Dashboard, Food, Glucose, Medication, AI Chat)
   - Integrate API client
   - Add charts and visualizations

3. **Mobile App Development**
   - Configure Tauri plugins (camera, opener)
   - Implement SQLite database access layer
   - Create AI service integration (third-party API)
   - Build UI with Material Design
   - Add photography and image processing features

4. **Testing**
   - Write backend unit tests
   - Write frontend component tests
   - Write mobile app integration tests

## References

- [DESIGN.md](./DESIGN.md) - Complete requirements and feature specifications
- [ARCHITECTURE.md](./ARCHITECTURE.md) - System architecture and technical details
- [Tauri Documentation](https://tauri.app)
- [React Documentation](https://react.dev)
- [.NET 10 Documentation](https://docs.microsoft.com/dotnet/net5-migration)
