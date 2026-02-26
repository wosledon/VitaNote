# VitaNote - Backend Documentation

## Getting Started

```bash
cd src
dotnet restore
dotnet run
```

## Database Migrations

```bash
dotnet ef migrations add InitialCreate
dotnet ef database update
```

## Configuration

Edit `appsettings.Development.json` or `appsettings.Production.json`

## Docker

```bash
docker build -t vitanote-api .
docker run -p 5000:80 vitanote-api
```

## API Documentation

Visit http://localhost:5000/swagger

## Command Line

```bash
# Run application
dotnet run

# Run tests
dotnet test

# Publish release
dotnet publish -c Release
```
