using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VitaNote.WebApi.Services;
using VitaNote.WebApi.DTOs;
using VitaNote.Shared.Models;

namespace VitaNote.WebApi.Controllers;

[ApiController]
[Route("api/chat")]
public class ChatController : ApiControllerBase
{
    private readonly IChatService _chatService;

    public ChatController(IChatService chatService)
    {
        _chatService = chatService;
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> SendMessage([FromBody] ChatRequest request)
    {
        var userId = request.UserId;
        if (userId == Guid.Empty)
        {
            userId = new Guid(User.FindFirst("UserId")!.Value);
        }

        // 保存用户消息
        await _chatService.SaveMessageAsync(userId, "user", request.Message);

        // 这里应该调用第三方 AI API
        // TODO: 实现 AI 调用逻辑
        var aiResponse = "这是一个示例回复，AI 服务需要进一步配置。";

        // 保存 AI 回复
        await _chatService.SaveMessageAsync(userId, "assistant", aiResponse, model: "example");

        return Ok(new ApiResponse<string>
        {
            Success = true,
            Data = aiResponse
        });
    }

    [HttpGet("history")]
    [Authorize]
    public async Task<IActionResult> GetHistory([FromQuery] int take = 50)
    {
        var userId = new Guid(User.FindFirst("UserId")!.Value);
        var history = await _chatService.GetHistoryAsync(userId, take);

        var dtos = history.Select(h => new ChatMessageDto
        {
            Id = h.Id,
            UserId = h.UserId,
            CreatedAt = h.CreatedAt,
            Role = h.Role,
            Content = h.Content,
            Model = h.Model
        }).ToList();

        return Ok(new ApiResponse<ChatHistoryDto>
        {
            Success = true,
            Data = new ChatHistoryDto
            {
                UserId = userId,
                Messages = dtos
            }
        });
    }
}
