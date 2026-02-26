using System.IO.Compression;
using System.Security.Cryptography;

namespace VitaNote.Infrastructure.Storage;

public class LocalFileStorageService : IFileStorageService
{
    private readonly StorageSettings _settings;

    public LocalFileStorageService(StorageSettings settings)
    {
        _settings = settings;
    }
    
    public async Task<string> SaveFileAsync(string filePath, string category, CancellationToken cancellationToken = default)
    {
        var fileName = Path.GetFileName(filePath);
        var relativePath = Path.Join(category, DateTime.UtcNow.ToString("yyyy/MM/dd"), fileName);
        var fullPath = Path.Combine(_settings.BasePath, relativePath);

        // 确保目录存在
        Directory.CreateDirectory(Path.GetDirectoryName(fullPath)!);

        File.Copy(filePath, fullPath, true);

        return fullPath.Replace(_settings.BasePath + Path.DirectorySeparatorChar, "");
    }
    
    public async Task<bool> DeleteFileAsync(string filePath, CancellationToken cancellationToken = default)
    {
        var fullPath = Path.Combine(_settings.BasePath, filePath);
        
        if (File.Exists(fullPath))
        {
            File.Delete(fullPath);
            return true;
        }
        
        return false;
    }
    
    public async Task<byte[]> GetFileAsync(string filePath, CancellationToken cancellationToken = default)
    {
        var fullPath = Path.Combine(_settings.BasePath, filePath);
        
        if (File.Exists(fullPath))
        {
            return await File.ReadAllBytesAsync(fullPath, cancellationToken);
        }
        
        return Array.Empty<byte>();
    }
    
    public string GetFileUrl(string filePath)
    {
        return Path.Combine(_settings.PublicUrl, filePath).Replace("\\", "/");
    }
    
    public async Task<string> SaveBase64ImageAsync(string base64Image, string category, CancellationToken cancellationToken = default)
    {
        // 移除data:image/jpeg;base64,前缀
        if (base64Image.StartsWith("data:image"))
        {
            base64Image = base64Image.Split(',')[1];
        }
        
        var bytes = Convert.FromBase64String(base64Image);
        var fileName = GenerateFileName("image.jpg");
        var relativePath = Path.Join(category, DateTime.UtcNow.ToString("yyyy/MM/dd"), fileName);
        var fullPath = Path.Combine(_settings.BasePath, relativePath);
        
        Directory.CreateDirectory(Path.GetDirectoryName(fullPath)!);
        
        await File.WriteAllBytesAsync(fullPath, bytes, cancellationToken);
        
        return fullPath.Replace(_settings.BasePath + Path.DirectorySeparatorChar, "");
    }
    
    private string GenerateFileName(string originalFileName)
    {
        var extension = Path.GetExtension(originalFileName);
        var fileName = Path.GetFileNameWithoutExtension(originalFileName);
        
        // 生成唯一文件名
        var uniqueName = $"{fileName}_{Guid.NewGuid():N}{extension}";
        
        // 限制文件名长度
        if (uniqueName.Length > 255)
        {
            uniqueName = $"{Guid.NewGuid():N}{extension}";
        }
        
        return uniqueName;
    }
}

public class StorageSettings
{
    public required string BasePath { get; set; } = "uploads";
    public required string PublicUrl { get; set; } = "/uploads";
}
