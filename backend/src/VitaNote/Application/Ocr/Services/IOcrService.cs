using VitaNote.Application.Ocr.DTOs;

namespace VitaNote.Application.Ocr.Services;

public interface IOcrService
{
    Task<OcrResponse> ExtractTextAsync(OcrRequest request, CancellationToken cancellationToken = default);
    Task<string> DetectFoodAsync(string base64Image, CancellationToken cancellationToken = default);
    Task<string> DetectHealthDataAsync(string base64Image, CancellationToken cancellationToken = default);
}
