namespace VitaNote.Infrastructure.Storage;

public interface IFileStorageService
{
    Task<string> SaveFileAsync(string filePath, string category, CancellationToken cancellationToken = default);
    Task<bool> DeleteFileAsync(string filePath, CancellationToken cancellationToken = default);
    Task<byte[]> GetFileAsync(string filePath, CancellationToken cancellationToken = default);
    string GetFileUrl(string filePath);
    Task<string> SaveBase64ImageAsync(string base64Image, string category, CancellationToken cancellationToken = default);
}
