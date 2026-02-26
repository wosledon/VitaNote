using Microsoft.Extensions.DependencyInjection;

namespace VitaNote.WebApi.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        // Add health record services
        services.AddScoped<VitaNote.Application.HealthRecords.Services.IHealthRecordService, VitaNote.Application.HealthRecords.Services.HealthRecordService>();
        services.AddScoped<VitaNote.Application.HealthRecords.Services.IFoodRecordService, VitaNote.Application.HealthRecords.Services.FoodRecordService>();

        // Add OCR services
        services.AddScoped<VitaNote.Application.Ocr.Services.IOcrService, VitaNote.Application.Ocr.Services.LlmOcrService>();

        // Add LLM services
        services.AddScoped<VitaNote.Application.Llm.Services.ILlmService, VitaNote.Application.Llm.Services.LlmService>();

        // Add auth services
        services.AddScoped<VitaNote.Application.Auth.Services.IAuthService, VitaNote.Application.Auth.Services.AuthService>();

        return services;
    }

    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        // Add repositories
        services.AddScoped<VitaNote.Domain.Repositories.IUserRepository, VitaNote.Infrastructure.Repositories.UserRepository>();
        services.AddScoped<VitaNote.Domain.Repositories.IHealthRecordRepository, VitaNote.Infrastructure.Repositories.HealthRecordRepository>();
        services.AddScoped<VitaNote.Domain.Repositories.IProfileRepository, VitaNote.Infrastructure.Repositories.ProfileRepository>();
        services.AddScoped<VitaNote.Domain.Repositories.IFoodRecordRepository, VitaNote.Infrastructure.Repositories.FoodRecordRepository>();

        // Add file storage
        services.Configure<VitaNote.Infrastructure.Storage.StorageSettings>(configuration.GetSection("Storage"));
        services.AddScoped<VitaNote.Infrastructure.Storage.IFileStorageService, VitaNote.Infrastructure.Storage.LocalFileStorageService>();

        // Add LLM/AI client configuration
        services.Configure<VitaNote.Application.Ocr.Services.OllamaSettings>(configuration.GetSection("Ollama"));

        return services;
    }
}
