import { useState, useEffect, useRef } from 'react';
import { Box, Typography, TextField, Paper, Avatar, IconButton } from '@mui/material';
import { ChatMessageRepository } from '../../services/repositories';
import { useAuthStore } from '../../store/authStore';
import { Layout } from '../../components/Layout';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import MedicationIcon from '@mui/icons-material/Medication';
import { keyframes } from '@mui/system';

const messageSlideIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const bounce = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
`;

const quickQuestions = [
  { icon: RestaurantIcon, text: '糖尿病饮食建议', color: '#10b981' },
  { icon: WaterDropIcon, text: '血糖控制目标', color: '#6366f1' },
  { icon: FitnessCenterIcon, text: '适合的运动', color: '#f59e0b' },
  { icon: MedicationIcon, text: '用药注意事项', color: '#ef4444' },
];

export function AIChatPage() {
  const { user } = useAuthStore();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user?.id) {
      loadChatHistory();
    }
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const loadChatHistory = async () => {
    try {
      const history = await ChatMessageRepository.getHistory(user!.id, 50);
      if (history.length > 0) {
        setMessages(history.map(msg => ({
          role: msg.role as 'user' | 'assistant',
          content: msg.content
        })));
        setHasStarted(true);
      }
    } catch (err) {
      console.error('加载历史记录失败', err);
    }
  };

  const handleSend = async (text?: string) => {
    const message = text || input.trim();
    if (!message) return;

    if (!text) setInput('');
    setMessages(prev => [...prev, { role: 'user', content: message }]);
    setIsTyping(true);
    setHasStarted(true);

    try {
      if (user?.id) {
        await ChatMessageRepository.create('user', message, user.id);
      }

      const aiResponse = generateAIResponse(message);
      
      if (user?.id) {
        await ChatMessageRepository.create('assistant', aiResponse, user.id);
      }
      
      setTimeout(() => {
        setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
        setIsTyping(false);
      }, 500 + Math.random() * 300);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: '抱歉，我遇到了一些问题。请稍后再试。' }]);
      setIsTyping(false);
    }
  };

  const generateAIResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('饮食') || lowerMessage.includes('吃') || lowerMessage.includes('食物')) {
      return `🍽️ **糖尿病饮食建议**

✅ 推荐多吃：
• 全谷物：燕麦、糙米、荞麦
• 蔬菜：绿叶菜、西兰花、黄瓜
• 优质蛋白：鱼、鸡胸肉、豆腐
• 健康脂肪：坚果、橄榄油

❌ 尽量少吃：
• 精制碳水：白米饭、白面包、糖果
• 含糖饮料：果汁、碳酸饮料
• 油炸食品、加工肉类

💡 进餐顺序：先吃蔬菜 → 再吃蛋白质 → 最后吃主食

需要了解更多具体食物吗？`;
    }
    if (lowerMessage.includes('血糖') || lowerMessage.includes('控制目标') || lowerMessage.includes('mmol')) {
      return `📊 **血糖控制目标**

一般成人糖尿病患者：
• 空腹血糖：4.4 - 7.0 mmol/L
• 餐后 2 小时：< 10.0 mmol/L
• 糖化血红蛋白：< 7%

⚠️ 老年患者或高风险人群目标可适当放宽

💡 监测建议：
• 每周测 2-3 次空腹和餐后血糖
• 记录血糖变化趋势
• 定期复查糖化血红蛋白（每 3 个月）

您最近的血糖情况如何？`;
    }
    if (lowerMessage.includes('运动') || lowerMessage.includes('锻炼')) {
      return `🏃 **适合糖尿病患者的运动**

💪 推荐运动：
• 快走：每天 30 分钟，最简单有效
• 游泳：对关节友好，全身运动
• 骑车：中等强度，适合大多数人
• 太极拳：改善平衡，缓解压力

⏰ 运动时间：
• 餐后 1 小时开始运动
• 每次 30-60 分钟
• 每周至少 150 分钟中等强度运动

⚠️ 注意事项：
• 运动前后测血糖
• 随身携带糖果防低血糖
• 穿舒适的运动鞋

您平时喜欢什么运动？`;
    }
    if (lowerMessage.includes('药') || lowerMessage.includes('胰岛素') || lowerMessage.includes('用药')) {
      return `💊 **用药注意事项**

📌 重要原则：
1. 严格遵医嘱，不自行调整剂量
2. 按时服药，不漏服
3. 了解药物作用和副作用
4. 定期复查肝肾功能

⏰ 常见服药时间：
• 二甲双胍：餐中或餐后服用
• 阿卡波糖：餐前即刻嚼服
• 胰岛素：按医嘱时间注射

💉 胰岛素保存：
• 未开封：冷藏 2-8℃
• 已开封：室温保存 28 天
• 避免冷冻和阳光直射

您目前在使用什么药物？`;
    }
    if (lowerMessage.includes('低血糖')) {
      return `🚨 **低血糖处理（15-15 原则）**

⚠️ 症状：心慌、手抖、出汗、饥饿感、头晕

🍬 急救步骤：
1. 立即吃 15g 快速升糖食物
   - 葡萄糖片 3-4 片
   - 含糖饮料 150ml
   - 白糖 1 汤匙
2. 15 分钟后复测血糖
3. 如仍低于 3.9，重复上述步骤

📞 出现意识模糊立即拨打 120！

💡 预防：运动前、饮酒时、用药后要注意监测血糖。`;
    }
    
    return `🤖 感谢您的咨询！

作为您的 AI 健康助手，我可以帮助您：

• 解答糖尿病相关问题
• 提供个性化饮食建议
• 制定适合的运动方案
• 提醒用药注意事项
• 解释血糖监测结果

请问您今天想了解哪方面的健康知识？`;
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const WelcomeScreen = () => (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center',
      justifyContent: 'center',
      py: 3,
      px: 2,
    }}>
      <Box sx={{
        width: 64,
        height: 64,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        mb: 2,
        boxShadow: '0 8px 32px rgba(99, 102, 241, 0.3)',
      }}>
        <SmartToyIcon sx={{ fontSize: 32, color: 'white' }} />
      </Box>
      
      <Typography variant="h6" fontWeight={700} sx={{ mb: 0.5, textAlign: 'center' }}>
        AI 健康助手
      </Typography>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3, textAlign: 'center', maxWidth: 280 }}>
        我是您的专属健康顾问，可以为您解答糖尿病管理、饮食运动等问题
      </Typography>

      <Box sx={{ width: '100%', maxWidth: 360 }}>
        <Typography variant="caption" color="text.secondary" sx={{ mb: 1.5, display: 'block', textAlign: 'center' }}>
          快速提问
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {quickQuestions.map((item, idx) => (
            <Paper
              key={idx}
              onClick={() => handleSend(item.text)}
              sx={{
                p: 1.5,
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                cursor: 'pointer',
                borderRadius: 1.5,
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: 'grey.50',
                  transform: 'translateX(4px)',
                },
              }}
            >
              <Box sx={{
                width: 36,
                height: 36,
                borderRadius: 1.5,
                bgcolor: `${item.color}15`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <item.icon sx={{ fontSize: 20, color: item.color }} />
              </Box>
              <Typography variant="body2" fontWeight={500}>
                {item.text}
              </Typography>
            </Paper>
          ))}
        </Box>
      </Box>

      {!user && (
        <Typography variant="caption" color="text.secondary" sx={{ mt: 3, textAlign: 'center' }}>
          登录后可保存聊天记录，获得更个性化的建议
        </Typography>
      )}
    </Box>
  );

  return (
    <Layout title="AI 健康助手">
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        height: '100%',
        maxWidth: '800px',
        mx: 'auto',
        width: '100%',
        position: 'relative',
      }}>
        {/* 消息区域 */}
        <Box sx={{ 
          flex: 1, 
          overflow: 'auto',
          px: 2,
          pt: 2,
          pb: { xs: '140px', md: '64px' },
        }}>
          {!hasStarted ? (
            <WelcomeScreen />
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {messages.map((msg, idx) => (
                <Box
                  key={idx}
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-end',
                    gap: 1,
                    flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                    animation: `${messageSlideIn} 0.3s ease`,
                  }}
                >
                  <Avatar 
                    sx={{ 
                      width: 32, 
                      height: 32, 
                      bgcolor: msg.role === 'user' ? '#6366f1' : '#8b5cf6',
                      fontSize: 14,
                    }}
                  >
                    {msg.role === 'user' ? <PersonIcon sx={{ fontSize: 18 }} /> : <SmartToyIcon sx={{ fontSize: 18 }} />}
                  </Avatar>
                  <Paper
                    sx={{
                      p: 1.5,
                      borderRadius: 1.5,
                      maxWidth: '75%',
                      bgcolor: msg.role === 'user' ? '#6366f1' : 'white',
                      color: msg.role === 'user' ? 'white' : 'text.primary',
                      boxShadow: msg.role === 'user' 
                        ? '0 2px 8px rgba(99, 102, 241, 0.25)' 
                        : '0 2px 8px rgba(0,0,0,0.06)',
                      border: msg.role === 'user' ? 'none' : '1px solid rgba(0,0,0,0.06)',
                    }}
                  >
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.6, fontSize: '14px' }}>
                      {msg.content}
                    </Typography>
                  </Paper>
                </Box>
              ))}
              
              {isTyping && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, animation: `${messageSlideIn} 0.3s ease` }}>
                  <Avatar sx={{ width: 32, height: 32, bgcolor: '#8b5cf6' }}>
                    <SmartToyIcon sx={{ fontSize: 18 }} />
                  </Avatar>
                  <Paper sx={{ 
                    p: 1.5, 
                    borderRadius: 1.5, 
                    bgcolor: 'white',
                    border: '1px solid rgba(0,0,0,0.06)',
                  }}>
                    <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center', height: 20 }}>
                      <Box sx={{ width: 6, height: 6, bgcolor: '#8b5cf6', borderRadius: '50%', animation: `${bounce} 1s infinite` }} />
                      <Box sx={{ width: 6, height: 6, bgcolor: '#8b5cf6', borderRadius: '50%', animation: `${bounce} 1s infinite 0.15s` }} />
                      <Box sx={{ width: 6, height: 6, bgcolor: '#8b5cf6', borderRadius: '50%', animation: `${bounce} 1s infinite 0.3s` }} />
                    </Box>
                  </Paper>
                </Box>
              )}
              <div ref={messagesEndRef} />
            </Box>
          )}
        </Box>

        {/* 底部输入框 */}
        <Box sx={{
          position: 'fixed',
          bottom: { xs: 70, md: 0 },
          left: 0,
          right: 0,
          bgcolor: 'background.paper',
          borderTop: '1px solid rgba(0,0,0,0.06)',
          px: 2,
          py: 1,
          zIndex: 100,
        }}>
          <Box sx={{
            maxWidth: '800px',
            mx: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder={user ? "输入您的问题..." : "请先登录后使用"}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={!user || isTyping}
              size="small"
              inputRef={inputRef}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  bgcolor: 'grey.50',
                  '& fieldset': {
                    borderColor: 'transparent',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(99, 102, 241, 0.3)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#6366f1',
                  },
                },
              }}
            />
            <IconButton
              onClick={() => handleSend()}
              disabled={!input.trim() || !user || isTyping}
              sx={{
                width: 40,
                height: 40,
                borderRadius: 1.5,
                bgcolor: '#6366f1',
                color: 'white',
                '&:hover': {
                  bgcolor: '#4f46e5',
                },
                '&:disabled': {
                  bgcolor: 'grey.300',
                  color: 'grey.500',
                },
                transition: 'all 0.2s ease',
              }}
            >
              <SendIcon sx={{ fontSize: 20 }} />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </Layout>
  );
}
