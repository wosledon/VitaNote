namespace VitaNote.Application.Ocr.DTOs;

public class OcrRequest
{
    public required string Base64Image { get; set; } // Base64编码的图片
    public OcrType Type { get; set; } // OCR类型：Food/Health/General
    public string? Language { get; set; } // 语言：zh/en
}

public enum OcrType
{
    Food = 1, // 食物识别
    Health = 2, // 健康数据识别
    General = 3 // 通用识别
}
