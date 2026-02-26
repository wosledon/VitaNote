using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.EntityFrameworkCore;
using VitaNote.WebApi.Extensions;
using VitaNote.Infrastructure.Persistence;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// Add Swagger (暂时禁用，等待 Swashbuckle 更新支持 .NET 10)
// builder.Services.AddSwaggerGen();

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("DefaultPolicy", policyBuilder =>
    {
        policyBuilder
            .WithOrigins("http://localhost:3000", "http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

// Add application services
builder.Services.AddApplicationServices();

// Add infrastructure
builder.Services.AddInfrastructure(builder.Configuration);

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    // Swagger 暂时禁用
    // app.UseSwagger();
    // app.UseSwaggerUI(c =>
    // {
    //     c.SwaggerEndpoint("/swagger/v1/swagger.json", "VitaNote API V1");
    //     c.RoutePrefix = "swagger";
    // });
}

app.UseCustomCors();

app.UseCustomExceptionMiddleware();

app.UseRouting();

app.UseAuthorization();

app.MapControllers();

// Apply migrations and seed default user on startup (development only)
if (app.Environment.IsDevelopment())
{
    using (var scope = app.Services.CreateScope())
    {
        var context = scope.ServiceProvider.GetRequiredService<VitaNoteDbContext>();
        context.Database.Migrate();
        
        // 初始化默认账号
        SeedDefaultUser(context);
    }
}

app.Run();

// 初始化默认账号
static void SeedDefaultUser(VitaNoteDbContext context)
{
    // 检查是否已存在默认账号
    var defaultUser = context.Users.FirstOrDefault(u => u.UserName == "admin");
    if (defaultUser == null)
    {
        // 创建默认账号
        var user = new VitaNote.Domain.Models.User
        {
            Id = Guid.NewGuid(),
            UserName = "admin",
            Email = "admin@vitanote.com",
            NormalizedUserName = "ADMIN",
            NormalizedEmail = "ADMIN@VITANOTE.COM",
            PhoneNumber = null,
            PhoneNumberConfirmed = false,
            LockoutEnabled = true,
            TwoFactorEnabled = false,
            SecurityStamp = Guid.NewGuid().ToString(),
            ConcurrencyStamp = Guid.NewGuid().ToString(),
            AccessFailedCount = 0,
            LockoutEnd = null,
            // 密码: admin123
            PasswordHash = HashPassword("admin123"),
            CreatedAt = DateTime.UtcNow
        };
        
        context.Users.Add(user);
        context.SaveChanges();
        
        Console.WriteLine("========================================");
        Console.WriteLine("    默认账号已创建");
        Console.WriteLine("========================================");
        Console.WriteLine("用户名: admin");
        Console.WriteLine("密码: admin123");
        Console.WriteLine("========================================");
    }
}

// 密码哈希方法（与 AuthService 保持一致）
static string HashPassword(string password)
{
    var bytes = System.Text.Encoding.UTF8.GetBytes(password);
    var hash = System.Security.Cryptography.SHA256.HashData(bytes);
    return Convert.ToBase64String(hash);
}
