using Microsoft.EntityFrameworkCore;
using VitaNote.Domain.Models;

namespace VitaNote.Infrastructure.Persistence;

public class VitaNoteDbContext : DbContext
{
    private readonly Guid _currentUserId;
    
    public VitaNoteDbContext(DbContextOptions options, ICurrentUserService currentUserService)
        : base(options)
    {
        _currentUserId = currentUserService.UserId;
    }
    
    public DbSet<User> Users { get; set; } = default!;
    public DbSet<HealthRecord> HealthRecords { get; set; } = default!;
    public DbSet<FoodRecord> FoodRecords { get; set; } = default!;
    public DbSet<Profile> Profiles { get; set; } = default!;
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        ConfigureUser(modelBuilder);
        ConfigureHealthRecord(modelBuilder);
        ConfigureFoodRecord(modelBuilder);
        ConfigureProfile(modelBuilder);
    }
    
    private void ConfigureUser(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>(entity =>
        {
            entity.ToTable("Users");
            
            entity.Property(u => u.Id)
                .ValueGeneratedOnAdd();
            
            entity.Property(u => u.UserName)
                .IsRequired()
                .HasMaxLength(50);
            
            entity.Property(u => u.Email)
                .IsRequired()
                .HasMaxLength(100);
            
            entity.HasIndex(u => u.NormalizedUserName)
                .IsUnique();
            
            entity.HasIndex(u => u.NormalizedEmail)
                .IsUnique();
            
            entity.Property(u => u.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP");
            
            entity.HasMany(u => u.HealthRecords)
                .WithOne(h => h.User!)
                .HasForeignKey(h => h.UserId);
            
            entity.HasMany(u => u.FoodRecords)
                .WithOne(f => f.User!)
                .HasForeignKey(f => f.UserId);
            
            entity.HasMany(u => u.Profiles)
                .WithOne(p => p.User!)
                .HasForeignKey(p => p.UserId);
        });
    }
    
    private void ConfigureHealthRecord(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<HealthRecord>(entity =>
        {
            entity.ToTable("HealthRecords");
            
            entity.Property(r => r.Id)
                .ValueGeneratedOnAdd();
            
            entity.Property(r => r.UserId)
                .IsRequired();
            
            entity.Property(r => r.RecordType)
                .IsRequired();
            
            entity.Property(r => r.Data)
                .IsRequired();
            
            entity.Property(r => r.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP");
            
            entity.HasIndex(r => r.UserId);
            entity.HasIndex(r => r.RecordType);
            entity.HasIndex(r => r.CreatedAt);
        });
    }
    
    private void ConfigureFoodRecord(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<FoodRecord>(entity =>
        {
            entity.ToTable("FoodRecords");
            
            entity.Property(r => r.Id)
                .ValueGeneratedOnAdd();
            
            entity.Property(r => r.UserId)
                .IsRequired();
            
            entity.Property(r => r.FoodName)
                .IsRequired()
                .HasMaxLength(200);
            
            entity.Property(r => r.MealType)
                .HasMaxLength(50);
            
            entity.Property(r => r.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP");
            
            entity.HasIndex(r => r.UserId);
            entity.HasIndex(r => r.EatenAt);
        });
    }
    
    private void ConfigureProfile(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Profile>(entity =>
        {
            entity.ToTable("Profiles");
            
            entity.Property(p => p.Id)
                .ValueGeneratedOnAdd();
            
            entity.Property(p => p.UserId)
                .IsRequired();
            
            entity.Property(p => p.Gender)
                .HasMaxLength(10);
            
            entity.Property(p => p.ActivityLevel)
                .HasMaxLength(50);
            
            entity.Property(p => p.Goals)
                .HasMaxLength(500);
            
            entity.HasIndex(p => p.UserId)
                .IsUnique();
        });
    }
    
    public override int SaveChanges()
    {
        UpdateTimestamps();
        return base.SaveChanges();
    }
    
    public override int SaveChanges(bool acceptAllChangesOnSuccess)
    {
        UpdateTimestamps();
        return base.SaveChanges(acceptAllChangesOnSuccess);
    }
    
    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        UpdateTimestamps();
        return base.SaveChangesAsync(cancellationToken);
    }
    
    public override Task<int> SaveChangesAsync(bool acceptAllChangesOnSuccess, CancellationToken cancellationToken = default)
    {
        UpdateTimestamps();
        return base.SaveChangesAsync(acceptAllChangesOnSuccess, cancellationToken);
    }
    
    private void UpdateTimestamps()
    {
        var entities = ChangeTracker.Entries<BaseModel>()
            .Where(e => e.State == EntityState.Added || e.State == EntityState.Modified);
        
        foreach (var entity in entities)
        {
            if (entity.State == EntityState.Added)
            {
                entity.Entity.CreatedAt = DateTime.UtcNow;
                entity.Entity.CreatedBy = _currentUserId.ToString();
            }
            
            entity.Entity.UpdatedAt = DateTime.UtcNow;
            entity.Entity.UpdatedBy = _currentUserId.ToString();
        }
    }
}

public interface ICurrentUserService
{
    Guid UserId { get; }
}

public class CurrentUserService : ICurrentUserService
{
    public Guid UserId { get; set; }
}
