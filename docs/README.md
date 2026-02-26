# VitaNote

A smart health management application built with modern technologies.

## Features

- Health data tracking (weight, glucose, blood pressure)
- Photo OCR recognition via LLM
- AI health assistant with chat
- JWT authentication
- Cross-platform (Web + Mobile)

## Tech Stack

- **Backend**: .NET 10 + EF Core + SQLite/PostgreSQL
- **Frontend**: React + Vite + TypeScript + Material UI
- **Mobile**: Tauri 2.0 + Rust
- **LLM**: GPT-4o / Ollama

## Quick Start

```bash
# Backend
cd backend/src
dotnet run

# Frontend
cd frontend
npm install && npm run dev

# Mobile
cd mobile
npm install && npx tauri dev
```

## API Docs

Visit http://localhost:5000/swagger

## License

MIT
