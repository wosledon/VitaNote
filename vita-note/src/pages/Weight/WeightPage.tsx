import { useState, useEffect } from 'react';
import { Box, Typography, Button, Card, CardContent, TextField, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Alert, Grid, Fab, Paper, Avatar, LinearProgress } from '@mui/material';
import { useAuthStore } from '../../store/authStore';
import { Layout } from '../../components/Layout';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import RemoveIcon from '@mui/icons-material/Remove';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface WeightEntry {
  date: string;
  weight: number;
  note?: string;
}

export function WeightPage() {
  const { user, setUser } = useAuthStore();
  const [entries, setEntries] = useState<WeightEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [targetWeight, setTargetWeight] = useState(user?.targetWeight?.toString() || '');

  const [formData, setFormData] = useState({
    weight: '',
    date: new Date().toISOString().slice(0, 10),
    note: ''
  });

  useEffect(() => {
    if (user?.id) {
      loadEntries();
    }
  }, [user]);

  const loadEntries = () => {
    try {
      const saved = localStorage.getItem(`weight_${user?.id}`);
      if (saved) {
        setEntries(JSON.parse(saved));
      }
      setLoading(false);
    } catch (err) {
      setErrorMsg('加载失败');
      setLoading(false);
    }
  };

  const saveEntries = (newEntries: WeightEntry[]) => {
    localStorage.setItem(`weight_${user?.id}`, JSON.stringify(newEntries));
    setEntries(newEntries);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setFormData({
      weight: '',
      date: new Date().toISOString().slice(0, 10),
      note: ''
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.weight || !user) {
      setErrorMsg('请填写完整信息');
      return;
    }

    try {
      const newEntry: WeightEntry = {
        date: formData.date,
        weight: parseFloat(formData.weight),
        note: formData.note
      };

      const newEntries = [...entries, newEntry].sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      
      saveEntries(newEntries);
      handleClose();
    } catch (err: any) {
      setErrorMsg('添加失败');
    }
  };

  const handleDelete = (index: number) => {
    const newEntries = entries.filter((_, i) => i !== index);
    saveEntries(newEntries);
  };

  const handleSaveTarget = () => {
    if (targetWeight && user) {
      const updatedUser = { ...user, targetWeight: parseFloat(targetWeight) };
      setUser(updatedUser);
    }
  };

  const getWeightChange = () => {
    if (entries.length < 2) return null;
    const sorted = [...entries].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    const change = sorted[sorted.length - 1].weight - sorted[0].weight;
    return change;
  };

  const getBMI = (weight: number) => {
    if (!user?.height) return null;
    const heightM = user.height / 100;
    return (weight / (heightM * heightM)).toFixed(1);
  };

  const getTrend = () => {
    const change = getWeightChange();
    if (change === null) return { text: '无数据', color: 'default' as const, icon: <RemoveIcon /> };
    if (change < -0.5) return { text: '下降', color: 'success' as const, icon: <TrendingDownIcon /> };
    if (change > 0.5) return { text: '上升', color: 'error' as const, icon: <TrendingUpIcon /> };
    return { text: '稳定', color: 'default' as const, icon: <RemoveIcon /> };
  };

  const getChartData = () => {
    const sorted = [...entries].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    ).slice(-7);
    
    return sorted.map(entry => ({
      date: new Date(entry.date).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }),
      weight: entry.weight
    }));
  };

  const latestWeight = entries.length > 0 ? entries[0].weight : null;
  const latestBMI = latestWeight ? getBMI(latestWeight) : null;
  const trend = getTrend();
  const chartData = getChartData();

  return (
    <Layout title="体重管理">
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}>
          体重记录
        </Typography>
        <Typography variant="body2" color="text.secondary">
          记录您的体重变化，追踪健康进度
        </Typography>
      </Box>

      {/* 概览卡片 */}
      <Grid container spacing={1.5} sx={{ mb: 2 }}>
        <Grid item xs={6} sm={3}>
          <Card sx={{ borderRadius: 2 }}>
            <CardContent sx={{ p: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                <Avatar sx={{ bgcolor: '#6366f115', color: '#6366f1', width: 28, height: 28, mr: 0.5 }}>
                  <FitnessCenterIcon sx={{ fontSize: 16 }} />
                </Avatar>
                <Typography variant="caption" color="text.secondary">当前</Typography>
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#6366f1' }}>
                {latestWeight?.toFixed(1) || '-'}
              </Typography>
              <Typography variant="caption" color="text.secondary">kg</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={6} sm={3}>
          <Card sx={{ borderRadius: 2 }}>
            <CardContent sx={{ p: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                <Avatar sx={{ bgcolor: '#f59e0b15', color: '#f59e0b', width: 28, height: 28, mr: 0.5 }}>
                  <FitnessCenterIcon sx={{ fontSize: 16 }} />
                </Avatar>
                <Typography variant="caption" color="text.secondary">目标</Typography>
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#f59e0b' }}>
                {user?.targetWeight?.toFixed(1) || '-'}
              </Typography>
              <Typography variant="caption" color="text.secondary">kg</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={6} sm={3}>
          <Card sx={{ borderRadius: 2, height: '100%' }}>
            <CardContent sx={{ p: 1.5, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                <Avatar sx={{ bgcolor: '#10b98115', color: '#10b981', width: 28, height: 28, mr: 0.5 }}>
                  <TrendingUpIcon sx={{ fontSize: 16 }} />
                </Avatar>
                <Typography variant="caption" color="text.secondary">BMI</Typography>
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#10b981' }}>
                {latestBMI || '-'}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ visibility: 'hidden' }}>kg</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={6} sm={3}>
          <Card sx={{ borderRadius: 2, height: '100%' }}>
            <CardContent sx={{ p: 1.5, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                <Avatar sx={{ bgcolor: trend.color === 'success' ? '#10b98115' : trend.color === 'error' ? '#ef444415' : '#64748b15', color: trend.color === 'success' ? '#10b981' : trend.color === 'error' ? '#ef4444' : '#64748b', width: 28, height: 28, mr: 0.5 }}>
                  {trend.icon}
                </Avatar>
                <Typography variant="caption" color="text.secondary">趋势</Typography>
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: trend.color === 'success' ? '#10b981' : trend.color === 'error' ? '#ef4444' : '#64748b' }}>
                {trend.text}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ visibility: 'hidden' }}>kg</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* 目标体重设置 */}
      <Card sx={{ borderRadius: 2, mb: 2 }}>
        <CardContent sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{ 
                width: 32, 
                height: 32, 
                borderRadius: '50%', 
                bgcolor: '#f59e0b',
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}>
                <FitnessCenterIcon sx={{ fontSize: 16, color: 'white' }} />
              </Box>
              <Box>
                <Typography variant="subtitle1" fontWeight={600} sx={{ lineHeight: 1.2 }}>
                  目标体重
                </Typography>
                {user?.targetWeight && (
                  <Typography variant="caption" color="text.secondary">
                    已设定 {user.targetWeight.toFixed(1)} kg
                  </Typography>
                )}
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <TextField
                size="small"
                type="number"
                value={targetWeight}
                onChange={(e) => setTargetWeight(e.target.value)}
                placeholder="目标"
                sx={{ 
                  width: 80,
                  '& .MuiInputBase-root': {
                    borderRadius: 1.5,
                    height: 32
                  }
                }}
                inputProps={{ step: '0.1' }}
              />
              <Button 
                variant="contained" 
                onClick={handleSaveTarget} 
                size="small"
                sx={{ 
                  borderRadius: 1.5,
                  height: 32,
                  px: 1.5,
                  minWidth: 0,
                  boxShadow: 'none',
                  bgcolor: '#f59e0b',
                  '&:hover': { bgcolor: '#d97706', boxShadow: 'none' }
                }}
              >
                保存
              </Button>
            </Box>
          </Box>
          
          {user?.targetWeight && latestWeight && (
            <Box sx={{ px: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  减重进度
                </Typography>
                <Typography variant="caption" fontWeight={600} color="#f59e0b">
                  {Math.abs(latestWeight - user.targetWeight).toFixed(1)} kg 剩余
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={Math.min(100, Math.max(0, (1 - Math.abs(latestWeight - user.targetWeight) / Math.max(latestWeight, user.targetWeight)) * 100))}
                sx={{ 
                  height: 6, 
                  borderRadius: 3,
                  bgcolor: '#e5e7eb',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 3,
                    bgcolor: '#f59e0b'
                  }
                }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.75 }}>
                <Typography variant="caption" color="text.secondary">
                  当前 {latestWeight.toFixed(1)} kg
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  目标 {user.targetWeight.toFixed(1)} kg
                </Typography>
              </Box>
            </Box>
          )}
          
          {!user?.targetWeight && (
            <Box sx={{ textAlign: 'center', py: 1 }}>
              <Typography variant="body2" color="text.secondary">
                设置目标体重，追踪您的健康进度
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* 图表 */}
      <Card sx={{ borderRadius: 2, mb: 2 }}>
        <CardContent sx={{ p: 2 }}>
          <Typography variant="subtitle1" fontWeight={700} mb={1.5}>
            体重趋势（近 7 次）
          </Typography>
          <Box sx={{ height: 200 }}>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} domain={['dataMin - 1', 'dataMax + 1']} />
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: 8, 
                      border: 'none',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    }}
                  />
                  <Area type="monotone" dataKey="weight" stroke="#6366f1" strokeWidth={2} fill="url(#weightGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <Typography variant="body2" color="text.secondary">暂无数据</Typography>
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>

      {errorMsg && <Alert severity="error" sx={{ mb: 2 }}>{errorMsg}</Alert>}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
        <Typography variant="subtitle1" fontWeight={700}>
          历史记录
        </Typography>
        <Typography variant="caption" color="text.secondary">
          共 {entries.length} 条记录
        </Typography>
      </Box>

      {loading ? (
        <Typography align="center" py={4}>加载中...</Typography>
      ) : entries.length === 0 ? (
        <Paper sx={{ textAlign: 'center', py: 6, borderRadius: 2 }}>
          <FitnessCenterIcon sx={{ fontSize: 48, color: 'text.secondary', opacity: 0.3, mb: 1 }} />
          <Typography variant="body1" color="text.secondary" mb={1}>
            还没有体重记录
          </Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpen}>
            添加第一条记录
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={1.5} sx={{ mb: 4 }}>
          {entries.map((entry, index) => (
            <Grid item xs={6} key={index}>
              <Card>
                <CardContent sx={{ p: 1.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 800, color: '#6366f1', mb: 0.5 }}>
                        {entry.weight.toFixed(1)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        kg
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                        {new Date(entry.date).toLocaleDateString('zh-CN')}
                      </Typography>
                      {entry.note && (
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                          {entry.note}
                        </Typography>
                      )}
                    </Box>
                    <IconButton size="small" color="error" onClick={() => handleDelete(index)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Fab
        color="primary"
        onClick={handleOpen}
        sx={{ position: 'fixed', bottom: { xs: 100, md: 24 }, right: 16 }}
      >
        <AddIcon />
      </Fab>

      {/* 添加体重记录对话框 */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <form onSubmit={handleSubmit}>
          <DialogTitle>添加体重记录</DialogTitle>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  type="number"
                  name="weight"
                  label="体重 (kg)"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  inputProps={{ step: '0.1' }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  type="date"
                  name="date"
                  label="日期"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="note"
                  label="备注"
                  value={formData.note}
                  onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  multiline
                  rows={2}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>取消</Button>
            <Button type="submit" variant="contained">添加</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Layout>
  );
}
