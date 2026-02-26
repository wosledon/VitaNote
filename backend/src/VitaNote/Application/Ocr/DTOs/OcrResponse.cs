namespace VitaNote.Application.Ocr.DTOs;

public class OcrResponse
{
    public bool Success { get; set; } // 识别是否成功
    public string Text { get; set; } = string.Empty; // 识别的文本
    public List<Entity> Entities { get; set; } = new(); // 提取的实体
    public string? Message { get; set; } // 错误消息或提示
    public decimal? Value { get; set; } // 识别的数值
    public string? Unit { get; set; } // 单位
}

public class Entity
{
    public string Type { get; set; } = string.Empty;
    public string Value { get; set; } = string.Empty;
    public double Confidence { get; set; }
}
