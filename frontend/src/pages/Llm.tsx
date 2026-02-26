import React, { useState, useEffect } from 'react'
import { DashboardLayout } from '../components/Layout'
import {
  Card,
  CardContent,
  Typography,
  Box,
  TextField,
  Button,
  Paper,
  Avatar,
  Divider,
} from '@mui/material'
import { useLlmStore } from '../store/llmStore'
import { useAuthStore } from '../store/authStore'
import type { ChatRequest } from '../types/api'
import apiClient from '../api/client'
import PersonIcon from '@mui/icons-material/Person'
import SmartToyIcon from '@mui/icons-material/SmartToy'

export const LlmPage = () => {
  const { user } = useAuthStore()
  const { messages, currentSuggestion, setLoading, addMessage } = useLlmStore()
  const [inputText, setInputText] = useState('')
  const [isSending, setIsSending] = useState(false)
  
  useEffect(() => {
    // Load suggestions if available
    if (currentSuggestion) {
      setTimeout(() => {
        addMessage('assistant', currentSuggestion.description)
      }, 500)
    }
  }, [currentSuggestion])
  
  const handleSendMessage = async () => {
    if (!inputText.trim()) return
    
    const userMessage = inputText
    addMessage('user', userMessage)
    setInputText('')
    setIsSending(true)
    setLoading(true)
    
    try {
      const request: ChatRequest = {
        message: userMessage,
        includeHistory: true,
      }
      
      const response = await apiClient.post('/llm/chat', request)
      
      addMessage('assistant', response.data.response)
      
      if (response.data.suggestions && response.data.suggestions.length > 0) {
        // Handle suggestions logic
      }
    } catch (error) {
      console.error('Failed to send message', error)
      addMessage('assistant', '抱歉，我在处理您的请求时遇到了问题。请稍后再试。')
    } finally {
      setIsSending(false)
      setLoading(false)
    }
  }
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }
  
  return (
    <DashboardLayout>
      <Typography variant="h4" gutterBottom>
        AI健康助手
      </Typography>
      <Typography variant="body1" color="textSecondary" gutterBottom>
        你的私人健康顾问，随时为您提供专业建议
      </Typography>
      
      <Card sx={{ mt: 2, height: '60vh', display: 'flex', flexDirection: 'column' }}>
        <CardContent sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
          {messages.length === 0 && (
            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <Avatar sx={{ mx: 'auto', mb: 2, bgcolor: 'primary.main' }}>
                <SmartToyIcon />
              </Avatar>
              <Typography variant="h6">你好，有什么健康问题我可以帮助你吗？</Typography>
              <Typography variant="body2" color="textSecondary">
                我可以根据你的健康数据提供个性化的建议
              </Typography>
            </Box>
          )}
          
          {messages.map((msg) => (
            <Box
              key={msg.id}
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                mb: 2,
                flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
              }}
            >
              <Avatar
                sx={{
                  mx: 1,
                  bgcolor: msg.role === 'user' ? 'secondary.main' : 'primary.main',
                }}
              >
                {msg.role === 'user' ? <PersonIcon /> : <SmartToyIcon />}
              </Avatar>
              <Paper
                sx={{
                  px: 2,
                  py: 1,
                  bgcolor: msg.role === 'user' ? 'secondary.light' : 'background.default',
                  maxWidth: '70%',
                }}
              >
                <Typography variant="body1">{msg.content}</Typography>
              </Paper>
            </Box>
          ))}
          
          {isSending && (
            <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 1 }}>
              <Typography variant="body2" color="textSecondary">
                正在思考...
              </Typography>
            </Box>
          )}
        </CardContent>
        
        <Divider />
        
        <Box sx={{ p: 2, display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="输入你的健康问题..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isSending}
            size="small"
          />
          <Button
            variant="contained"
            onClick={handleSendMessage}
            disabled={isSending || !inputText.trim()}
          >
            发送
          </Button>
        </Box>
      </Card>
      
      {currentSuggestion && (
        <Card sx={{ mt: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              建议
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {currentSuggestion.title}
            </Typography>
            <Typography variant="body1">{currentSuggestion.description}</Typography>
          </CardContent>
        </Card>
      )}
    </DashboardLayout>
  )
}
