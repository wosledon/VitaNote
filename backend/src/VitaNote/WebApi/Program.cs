using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;
using VitaNote.WebApi.Extensions;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// Add Swagger
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "VitaNote API",
        Version = "v1",
        Description = "VitaNote - Smart Health Management API",
        Contact = new OpenApiContact
        {
            Name = "VitaNote Team",
            Email = "support@vitanote.com"
        }
    });
    
    // Enable XML comments
    var xmlFile = $"{System.Reflection.Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    if (File.Exists(xmlPath))
    {
        c.IncludeXmlComments(xmlPath);
    }
    
    // Add JWT authentication to Swagger
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });
    
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

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

// Add database
builder.Services.AddDatabase(builder.Configuration);

// Add authentication
builder.Services.AddAuthenticationService(builder.Configuration);

// Add application services
builder.Services.AddApplicationServices();

// Add infrastructure
builder.Services.AddInfrastructure(builder.Configuration);

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "VitaNote API V1");
        c.RoutePrefix = "swagger";
        c.DisplayRequestDuration();
    });
}

app.UseCustomCors();

app.UseCustomExceptionMiddleware();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Apply migrations on startup (development only)
if (app.Environment.IsDevelopment())
{
    using (var scope = app.Services.CreateScope())
    {
        var context = scope.ServiceProvider.GetRequiredService<VitaNoteDbContext>();
        context.Database.Migrate();
    }
}

app.Run();

// Open API endpoint for mobile app
app.MapGet("/api/openapi.json", () =>
{
    return Results.Text(System.IO.File.ReadAllText(Path.Combine(AppContext.BaseDirectory, "swagger", "v1", "swagger.json")))
        .WithHeader("Content-Type", "application/json");
}).WithOpenApi();
