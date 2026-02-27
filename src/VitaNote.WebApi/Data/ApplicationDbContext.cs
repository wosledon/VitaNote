using Microsoft.EntityFrameworkCore;
using VitaNote.Shared.Models;

namespace VitaNote.WebApi.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }
    
    public DbSet<User> Users => Set<User>();
    public DbSet<FoodEntry> FoodEntries => Set<FoodEntry>();
    public DbSet<BloodGlucose> BloodGlucoseEntries => Set<BloodGlucose>();
    public DbSet<Medication> Medications => Set<Medication>();
    public DbSet<AIChatHistory> ChatHistory => Set<AIChatHistory>();
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // 用户表配置
        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();
            
        // 饮食记录表配置
        modelBuilder.Entity<FoodEntry>()
            .HasIndex(f => new { f.UserId, f.MealTime });
            
        // 血糖记录表配置
        modelBuilder.Entity<BloodGlucose>()
            .HasIndex(g => new { g.UserId, g.CreatedAt });
            
        // 用药记录表配置
        modelBuilder.Entity<Medication>()
            .HasIndex(m => m.UserId);
            
        // 聊天历史表配置
        modelBuilder.Entity<AIChatHistory>()
            .HasIndex(c => new { c.UserId, c.CreatedAt });
    }
}
