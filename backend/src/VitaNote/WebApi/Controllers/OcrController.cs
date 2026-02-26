using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;

namespace VitaNote.WebApi.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class OcrController : ControllerBase
{
    public OcrController()
    {
    }
    
    [HttpPost("extract-text")]
    public async Task<ActionResult<string>> ExtractText([FromBody] ExtractTextRequest request)
    {
        // TODO: 实现 OCR 文本提取
        await Task.Delay(100);
        return Ok("识别到的文本内容");
    }
    
    [HttpPost("detect-food")]
    public async Task<ActionResult<string>> DetectFood([FromBody] DetectRequest request)
    {
        // TODO: 实现食物识别
        await Task.Delay(100);
        return Ok("检测到：米饭、青菜、鸡肉\n估算热量：650 kcal");
    }
    
    [HttpPost("detect-health-data")]
    public async Task<ActionResult<string>> DetectHealthData([FromBody] DetectRequest request)
    {
        // TODO: 实现健康数据识别
        await Task.Delay(100);
        return Ok("收缩压：120 mmHg\n舒张压：80 mmHg\n心率：72 次/分");
    }
    
    [HttpPost("upload-image")]
    public async Task<ActionResult<string>> UploadImage(IFormFile file)
    {
        // TODO: 实现图片上传
        await Task.Delay(100);
        return Ok($"/uploads/{file.FileName}");
    }
}

public class ExtractTextRequest
{
    public string Base64Image { get; set; } = string.Empty;
}

public class DetectRequest
{
    public string ImageUrl { get; set; } = string.Empty;
}
