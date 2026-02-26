using Microsoft.AspNetCore.Mvc;
using VitaNote.Application.Ocr.DTOs;

namespace VitaNote.WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UploadController : ControllerBase
{
    private readonly IFileStorageService _fileStorageService;
    
    public UploadController(IFileStorageService fileStorageService)
    {
        _fileStorageService = fileStorageService;
    }
    
    [HttpPost("image")]
    public async Task<ActionResult<string>> UploadImage(IFormFile file)
    {
        var category = "images";
        var filePath = await _fileStorageService.SaveFileAsync(file, category);
        var url = _fileStorageService.GetFileUrl(filePath);
        return Ok(new { url });
    }
    
    [HttpPost("base64-image")]
    public async Task<ActionResult<string>> UploadBase64Image([FromBody] Base64ImageRequest request)
    {
        var category = "images";
        var filePath = await _fileStorageService.SaveBase64ImageAsync(request.Base64Image, category);
        var url = _fileStorageService.GetFileUrl(filePath);
        return Ok(new { url });
    }
}

public class Base64ImageRequest
{
    public required string Base64Image { get; set; }
    public string? Category { get; set; }
}
