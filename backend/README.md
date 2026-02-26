# VitaNote Backend

## Build & Run

```bash
cd src
dotnet restore
dotnet run --project VitaNote.WebApi/VitaNote.WebApi.csproj
```

## Database Migrations

```bash
# Create migration
dotnet ef migrations add InitialCreate

# Update database
dotnet ef database update
```

## Docker

```bash
# Build
docker build -t vitanote-api .

# Run
docker run -p 5000:80 vitanote-api
```

## Configuration

Copy `Appsettings.Development.json` to `appsettings.json` and adjust settings.

## Testing

```bash
dotnet test
```
