import React, { useState, useRef, useEffect } from 'react'
import {
  Card,
  CardContent,
  Typography,
  Box,
  TextField,
  Button,
  Paper,
  Avatar,
  Chip,
  Fade,
  Alert,
  IconButton,
} from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
import SmartToyIcon from '@mui/icons-material/SmartToy'
import PersonIcon from '@mui/icons-material/Person'
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety'
import CloseIcon from '@mui/icons-material/Close'
import { llmService } from '../api/services'
import type { ChatRequest } from '../types/api'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const SUGGESTIONS = [
  '我的血压正常吗？',
  '如何控制血糖？',
  '推荐一些健康食谱',
  '分析我的体重趋势',
  '每天应该摄入多少热量？',
]

export const LlmPage = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputText, setInputText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }
  
  useEffect(() => {
    scrollToBottom()
  }, [messages])
  
  const handleSendMessage = async () => {
    if (!inputText.trim()) return
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputText,
      timestamp: new Date(),
    }
    
    setMessages(prev => [...prev, userMessage])
    setInputText('')
    setLoading(true)
    setError(null)
    
    try {
      const request: ChatRequest = {
        message: userMessage.content,
        includeHistory: true,
      }
      
      const response = await llmService.chat(request)
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.data.response,
        timestamp: new Date(),
      }
      
      setMessages(prev => [...prev, assistantMessage])
    } catch (err: any) {
      console.error('发送消息失败:', err)
      setError('抱歉，服务暂时不可用，请稍后重试')
    } finally {
      setLoading(false)
    }
  }
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }
  
  const handleSuggestionClick = (suggestion: string) => {
    setInputText(suggestion)
    inputRef.current?.focus()
  }
  
  const clearChat = () => {
    setMessages([])
    setError(null)
  }
  
  return (
    <Box sx={{ height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column' }}>
      {/* 标题栏 */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            AI 健康助手
          </Typography>
          <Typography variant="body2" color="text.secondary">
            您的私人健康顾问，随时为您提供专业建议
          </Typography>
        </Box>
        {messages.length > 0 && (
          <Button variant="outlined" size="small" onClick={clearChat} startIcon={<CloseIcon />}>
            清空对话
          </Button>
        )}
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      
      {/* 聊天区域 */}
      <Card sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <CardContent sx={{ flex: 1, overflowY: 'auto', p: 3, display: 'flex', flexDirection: 'column' }}>
          {messages.length === 0 ? (
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  bgcolor: '#E8F5E9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 3,
                }}
              >
                <HealthAndSafetyIcon sx={{ fontSize: 40, color: '#006C4C' }} />
              </Box>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                你好！我是你的 AI 健康助手
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3, textAlign: 'center', maxWidth: 400 }}>
                我可以根据你的健康数据提供个性化的建议和分析
              </Typography>
              
              <Typography variant="body2" color="text.secondary" gutterBottom>
                试试问我：
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center', maxWidth: 500 }}>
                {SUGGESTIONS.map((suggestion) => (
                  <Chip
                    key={suggestion}
                    label={suggestion}
                    onClick={() => handleSuggestionClick(suggestion)}
                    sx={{
                      cursor: 'pointer',
                      bgcolor: '#F5F5F5',
                      '&:hover': { bgcolor: '#E8F5E9', color: '#006C4C' },
                    }}
                  />
                ))}
              </Box>
            </Box>
          ) : (
            <Box sx={{ flex: 1 }}>
              {messages.map((msg) => (
                <Fade key={msg.id} in>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      mb: 3,
                      flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                    }}
                  >
                    <Avatar
                      sx={{
                        mx: 1.5,
                        bgcolor: msg.role === 'user' ? '#006C4C' : '#0061A4',
                        width: 40,
                        height: 40,
                      }}
                    >
                      {msg.role === 'user' ? <PersonIcon /> : <SmartToyIcon />}
                    </Avatar>
                    <Paper
                      sx={{
                        px: 2.5,
                        py: 1.5,
                        maxWidth: '70%',
                        borderRadius: 3,
                        bgcolor: msg.role === 'user' ? '#006C4C' : '#F5F5F5',
                        color: msg.role === 'user' ? 'white' : '#1C1B1F',
                        boxShadow: 1,
                      }}
                    >
                      <Typography variant="body1" sx={{ lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                        {msg.content}
                      </Typography>
                    </Paper>
                  </Box>
                </Fade>
              ))}
              
              {loading && (
                <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 1 }}>
                  <Avatar sx={{ mr: 1.5, bgcolor: '#0061A4', width: 40, height: 40 }}>
                    <SmartToyIcon />
                  </Avatar>
                  <Paper sx={{ px: 2, py: 1, borderRadius: 3, bgcolor: '#F5F5F5' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                      {[0, 1, 2].map((i) => (
                        <Box
                          key={i}
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            bgcolor: '#9E9E9E',
                            animation: 'bounce 1.4s infinite ease-in-out both',
                            animationDelay: `${i * 0.16}s`,
                            '@keyframes bounce': {
                              '0%, 80%, 100%': { transform: 'scale(0.6)', opacity: 0.5 },
                              '40%': { transform: 'scale(1)', opacity: 1 },
                            },
                          }}
                        />
                      ))}
                    </Box>
                  </Paper>
                </Box>
              )}
              <div ref={messagesEndRef} />
            </Box>
          )}
        </CardContent>
        
        {/* 输入区域 */}
        <Box sx={{ p: 2, borderTop: 1, borderColor: '#E0E0E0', bgcolor: '#FFFFFF' }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="输入你的健康问题..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
              size="small"
              inputRef={inputRef}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  bgcolor: '#F5F5F5',
                },
              }}
            />
            <Button
              variant="contained"
              onClick={handleSendMessage}
              disabled={loading || !inputText.trim()}
              sx={{ borderRadius: 3, px: 3, minWidth: 100 }}
              endIcon={<SendIcon />}
            >
              发送
            </Button>
          </Box>
        </Box>
      </Card>
    </Box>
  )
}
