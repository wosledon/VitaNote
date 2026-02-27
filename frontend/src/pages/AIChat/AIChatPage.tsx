import { Box, Typography, TextField, Button } from '@mui/material';
import { useState } from 'react';
import { chatApi } from '../../api';

export function AIChatPage() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{role: string, content: string}[]>([
    { role: 'assistant', content: '你好！我是你的AI健康助手。我可以帮助你管理糖尿病、饮食、血糖等健康问题。' }
  ]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInput('');

    try {
      const response = await chatApi.sendMessage(userMessage);
      if (response.success && response.data) {
        setMessages(prev => [...prev, { role: 'assistant', content: response.data }]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: '抱歉，我遇到了一些问题。请稍后再试。' }]);
    }
  };

  return (
    <Box sx={{ p: 3, height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        AI 健康助手
      </Typography>
      
      <Box sx={{ flex: 1, overflow: 'auto', mb: 2, p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
        {messages.map((msg, idx) => (
          <Box 
            key={idx} 
            sx={{ 
              mb: 2, 
              p: 2, 
              borderRadius: 2,
              maxWidth: '80%',
              alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
              bgcolor: msg.role === 'user' ? 'primary.main' : 'background.paper',
            }}
          >
            <Typography variant="body1" color={msg.role === 'user' ? 'white' : 'text.primary'}>
              {msg.content}
            </Typography>
          </Box>
        ))}
      </Box>

      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          size="small"
          variant="outlined"
          placeholder="输入消息..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        />
        <Button variant="contained" onClick={handleSend}>
          发送
        </Button>
      </Box>
    </Box>
  );
}
