# API Service
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY ["backend/src/VitaNote.sln", "./"]
COPY ["backend/src/VitaNote/Application/VitaNote.Application.csproj", "VitaNote/Application/"]
COPY ["backend/src/VitaNote/Domain/VitaNote.Domain.csproj", "VitaNote/Domain/"]
COPY ["backend/src/VitaNote/Infrastructure/VitaNote.Infrastructure.csproj", "VitaNote/Infrastructure/"]
COPY ["backend/src/VitaNote/WebApi/VitaNote.WebApi.csproj", "VitaNote/WebApi/"]

RUN dotnet restore "VitaNote.sln"

COPY ["backend/src/", "VitaNote/"]

RUN dotnet publish "VitaNote/WebApi/VitaNote.WebApi.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .

ENTRYPOINT ["dotnet", "VitaNote.WebApi.dll"]
