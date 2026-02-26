using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using VitaNote.Application.Auth.Services;
using VitaNote.Infrastructure.Persistence;
using VitaNote.Application.HealthRecords.Services;
using VitaNote.Domain.Repositories;
using VitaNote.Infrastructure.Storage;

namespace VitaNote.WebApi.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        // Add auth services
        services.AddScoped<IAuthService, AuthService>();

        // Add health record services
        services.AddScoped<VitaNote.Application.HealthRecords.Services.IHealthRecordService, VitaNote.Application.HealthRecords.Services.HealthRecordService>();
        services.AddScoped<VitaNote.Application.HealthRecords.Services.IFoodRecordService, VitaNote.Application.HealthRecords.Services.FoodRecordService>();

        return services;
    }

    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        // Add DbContext
        services.AddDbContext<VitaNoteDbContext>(options =>
        {
            var connectionString = configuration.GetConnectionString("DefaultConnection") 
                ?? "Data Source=vitanote.db";
            options.UseSqlite(connectionString);
        });

        // Add repositories
        services.AddScoped<VitaNote.Domain.Repositories.IUserRepository, VitaNote.Infrastructure.Repositories.UserRepository>();
        services.AddScoped<VitaNote.Domain.Repositories.IHealthRecordRepository, VitaNote.Infrastructure.Repositories.HealthRecordRepository>();
        services.AddScoped<VitaNote.Domain.Repositories.IProfileRepository, VitaNote.Infrastructure.Repositories.ProfileRepository>();
        services.AddScoped<VitaNote.Domain.Repositories.IFoodRecordRepository, VitaNote.Infrastructure.Repositories.FoodRecordRepository>();

        // Add file storage
        services.Configure<VitaNote.Infrastructure.Storage.StorageSettings>(configuration.GetSection("Storage"));
        services.AddScoped<VitaNote.Infrastructure.Storage.IFileStorageService, VitaNote.Infrastructure.Storage.LocalFileStorageService>();

        // Add current user service
        services.AddScoped<ICurrentUserService, CurrentUserService>();

        return services;
    }
}
