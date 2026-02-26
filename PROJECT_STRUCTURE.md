# VitaNote - Project Structure

## Overview

VitaNote is a full-stack health management application with the following components:

```
VitaNote/
├── backend/          # .NET 10 WebAPI (DDD Architecture)
│   ├── src/
│   │   └── VitaNote/
│   │       ├── Application/   # Business logic & services
│   │       ├── Domain/        # Core models & entities
│   │       ├── Infrastructure/# Data persistence & external services
│   │       └── WebApi/        # API controllers & startup
│   ├── Dockerfile
│   └── swagger.json
├── frontend/         # React + Vite + TypeScript
│   ├── src/
│   │   ├── api/        # API client & services
│   │   ├── components/ # Reusable React components
│   │   ├── pages/      # Page components
│   │   └── store/      # Zustand state management
│   └── vite.config.ts
├── mobile/          # Tauri 2.0 (Rust + React Native)
│   └── src-tauri/
│       ├── src/
│       │   ├── commands/ # Tauri commands for native features
│       │   └── main.rs   # Application entry point
│       └── tauri.conf.json
└── docs/            # Project documentation
```

## Backend Structure

### Domain Layer

**Entities:**
- User - User account with authentication
- HealthRecord - Weight, glucose, and blood pressure records
- FoodRecord - Food consumption records
- Profile - User personal information

**Value Objects:**
- WeightRecordValue
- GlucoseRecordValue
- BloodPressureRecordValue
- FoodRecordValue

**Repositories:**
- IUserRepository
- IHealthRecordRepository
- IFoodRecordRepository
- IProfileRepository

### Application Layer

**Services:**
- AuthService - Authentication and authorization
- HealthRecordService - CRUD operations for health records
- OcrService - OCR processing via LLM
- LlmService - AI health assistant

### Infrastructure Layer

**Database:**
- VitaNoteDbContext - Entity Framework Core context
- Snapshot configuration for SQLite and PostgreSQL

**Repositories:**
- UserRepository
- HealthRecordRepository
- FoodRecordRepository
- ProfileRepository

**External Services:**
- OllamaOcrService - LLM-based OCR service
- LocalFileStorageService - File storage service

### Web API Layer

**Controllers:**
- AuthController - Authentication endpoints
- HealthRecordsController - Health record management
- OcrController - OCR processing endpoints
- LlmController - AI assistant endpoints

## Frontend Structure

### State Management (Zustand)

- authStore - Authentication state
- recordsStore - Health records state
- llmStore - LLM chat state

### API Client

- client.ts - Axios instance with interceptors
- services.ts - Service layer for API calls
- generated.ts - OpenAPI types (auto-generated)

### Components

- Layout - Main navigation and layout
- Reusable UI components

### Pages

- Dashboard - Main home page
- Records - Health record management
- Llm - AI health assistant chat
- Login/Register - Authentication pages

## Mobile Structure

### Commands

- camera.ts - Camera capture and image processing
- clipboard.ts - Clipboard operations
- filesystem.ts - File system operations
- storage.ts - Storage management
- llm.ts - LLM service
- auth.ts - Authentication
- health_records.ts - Health record management

## Database Schema

### Tables

1. Users - User accounts
2. HealthRecords - Weight, glucose, blood pressure records
3. FoodRecords - Food consumption records
4. Profiles - User profiles

## API Endpoints

### Authentication
- POST /auth/register
- POST /auth/login
- POST /auth/logout

### Health Records
- GET /health-records/{type}
- POST /health-records/{type}

### OCR
- POST /ocr/extract-text
- POST /ocr/detect-food
- POST /ocr/detect-health-data

### LLM
- POST /llm/chat
- POST /llm/advice

## Development Setup

### Backend

```bash
cd backend/src
dotnet restore
dotnet run --project VitaNote.WebApi/VitaNote.WebApi.csproj
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Mobile

```bash
cd mobile
npm install
npx tauri dev
```

## Docker Deployment

```bash
docker-compose up -d
```
