using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VitaNote.Application.Ocr.DTOs;
using VitaNote.Application.Ocr.Services;

namespace VitaNote.WebApi.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class OcrController : ControllerBase
{
    private readonly IOcrService _ocrService;
    private readonly IFileStorageService _fileStorageService;
    
    public OcrController(IOcrService ocrService, IFileStorageService fileStorageService)
    {
        _ocrService = ocrService;
        _fileStorageService = fileStorageService;
    }
    
    [HttpPost("extract-text")]
    public async Task<ActionResult<OcrResponse>> ExtractText([FromBody] OcrRequest request)
    {
        var response = await _ocrService.ExtractTextAsync(request);
        return Ok(response);
    }
    
    [HttpPost("detect-food")]
    public async Task<ActionResult<OcrResponse>> DetectFood([FromBody] string base64Image)
    {
        var response = await _ocrService.DetectFoodAsync(base64Image);
        return Ok(new OcrResponse { Text = response });
    }
    
    [HttpPost("detect-health-data")]
    public async Task<ActionResult<OcrResponse>> DetectHealthData([FromBody] string base64Image)
    {
        var response = await _ocrService.DetectHealthDataAsync(base64Image);
        return Ok(new OcrResponse { Text = response });
    }
    
    [HttpPost("upload-image")]
    public async Task<ActionResult<string>> UploadImage(IFormFile file)
    {
        var userId = GetUserId();
        var category = $"users/{userId}/images";
        var filePath = await _fileStorageService.SaveFileAsync(file, category);
        return Ok(filePath);
    }
    
    private Guid GetUserId()
    {
        var userIdClaim = User.FindFirst("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier")?.Value;
        return Guid.Parse(userIdClaim!);
    }
}
