import { useState, useEffect } from 'react';
import { Box, Typography, Grid, Button, Paper, Card, CardContent, Avatar, LinearProgress, Chip, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { FoodEntryRepository, BloodGlucoseRepository, MedicationRepository } from '../../services/repositories';
import { useAuthStore } from '../../store/authStore';
import { Layout } from '../../components/Layout';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import MedicationIcon from '@mui/icons-material/Medication';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import RemoveIcon from '@mui/icons-material/Remove';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

export function Dashboard() {
  const { user, setUser } = useAuthStore();
  const [foodStats, setFoodStats] = useState({
    totalEntries: 0,
    totalCalories: 0,
    totalCarbohydrates: 0,
    totalProtein: 0,
    totalFat: 0
  });
  const [glucoseStats, setGlucoseStats] = useState({
    totalEntries: 0,
    averageValue: 0,
    minValue: 0,
    maxValue: 0
  });
  const [todayMedications, setTodayMedications] = useState(0);
  const [takenMedications, setTakenMedications] = useState(0);
  const [loading, setLoading] = useState(true);
  const [weightDialogOpen, setWeightDialogOpen] = useState(false);
  const [weight, setWeight] = useState(user?.targetWeight?.toString() || '');
  const [glucoseData, setGlucoseData] = useState<any[]>([]);
  const [calorieData, setCalorieData] = useState<any[]>([]);

  useEffect(() => {
    if (user?.id) {
      fetchDashboardData();
      fetchWeeklyData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const foodStatsData = await FoodEntryRepository.getTodayStatistics(user!.id);
      setFoodStats(foodStatsData);

      const glucoseStatsData = await BloodGlucoseRepository.getTodayStatistics(user!.id);
      setGlucoseStats(glucoseStatsData);

      const medications = await MedicationRepository.getEntries(user!.id, today, tomorrow, 1, 100);
      setTodayMedications(medications.items.length);
      setTakenMedications(medications.items.filter(m => m.isTaken).length);

      setLoading(false);
    } catch (err: any) {
      console.error('Error fetching dashboard data:', err);
      setLoading(false);
    }
  };

  const fetchWeeklyData = async () => {
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 6);

      const glucoseResult = await BloodGlucoseRepository.getEntries(user!.id, startDate, endDate, 1, 100);
      const foodResult = await FoodEntryRepository.getEntries(user!.id, startDate, endDate, 1, 100);

      // 处理血糖数据
      const glucoseByDate: { [key: string]: number } = {};
      glucoseResult.items.forEach(item => {
        const date = new Date(item.createdAt).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
        if (!glucoseByDate[date]) glucoseByDate[date] = 0;
        glucoseByDate[date] += item.value;
      });

      const glucoseChartData = Object.entries(glucoseByDate).map(([date, value]) => ({
        date,
        value: Math.round((value as number) / Object.values(glucoseByDate).filter((v, i, arr) => arr.indexOf(v) === i).length * 10) / 10
      }));

      // 处理热量数据
      const calorieByDate: { [key: string]: number } = {};
      foodResult.items.forEach(item => {
        const date = new Date(item.createdAt).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
        if (!calorieByDate[date]) calorieByDate[date] = 0;
        calorieByDate[date] += item.calories;
      });

      const calorieChartData = Object.entries(calorieByDate).map(([date, value]) => ({
        date,
        calories: value as number
      }));

      setGlucoseData(glucoseChartData);
      setCalorieData(calorieChartData);
    } catch (err) {
      console.error('Error fetching weekly data:', err);
    }
  };

  const handleWeightSave = async () => {
    if (weight && user) {
      const updatedUser = { ...user, targetWeight: parseFloat(weight) };
      setUser(updatedUser);
      setWeightDialogOpen(false);
    }
  };

  const getGlucoseStatus = (avg: number) => {
    if (avg < 4.4) return { text: '偏低', color: 'warning' as const, icon: <TrendingDownIcon /> };
    if (avg > 7.0) return { text: '偏高', color: 'error' as const, icon: <TrendingUpIcon /> };
    return { text: '正常', color: 'success' as const, icon: <RemoveIcon /> };
  };

  const getBMI = () => {
    if (!user?.targetWeight || !user?.height) return '-';
    const heightM = user.height / 100;
    return (user.targetWeight / (heightM * heightM)).toFixed(1);
  };

  const getBMIStatus = (bmi: number) => {
    if (bmi < 18.5) return { text: '偏瘦', color: 'warning' as const };
    if (bmi < 24) return { text: '正常', color: 'success' as const };
    if (bmi < 28) return { text: '超重', color: 'warning' as const };
    return { text: '肥胖', color: 'error' as const };
  };

  if (loading) {
    return (
      <Layout title="首页">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <LinearProgress sx={{ width: '100%', maxWidth: 300, borderRadius: 2 }} />
        </Box>
      </Layout>
    );
  }

  const glucoseStatus = getGlucoseStatus(glucoseStats.averageValue);
  const bmi = parseFloat(getBMI() as string);
  const bmiStatus = isNaN(bmi) ? null : getBMIStatus(bmi);

  return (
    <Layout title="首页">
      {/* 欢迎卡片 */}
      <Paper sx={{ 
        p: { xs: 2, sm: 3 }, 
        mb: 3, 
        borderRadius: 2,
        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
            早上好，{user?.username || '用户'} 👋
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9, mb: 2 }}>
            {new Date().toLocaleDateString('zh-CN', { weekday: 'long', month: 'long', day: 'numeric' })}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Chip 
              icon={<WaterDropIcon />} 
              label={`${glucoseStats.averageValue.toFixed(1)} mmol/L`} 
              sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 600 }}
            />
            <Chip 
              icon={<FitnessCenterIcon />} 
              label={`${bmi} BMI`} 
              sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 600 }}
            />
          </Box>
        </Box>
        {/* 装饰圆形 */}
        <Box sx={{ 
          position: 'absolute', 
          right: -50, 
          top: -50, 
          width: 200, 
          height: 200, 
          borderRadius: '50%', 
          bgcolor: 'rgba(255,255,255,0.1)',
        }} />
        <Box sx={{ 
          position: 'absolute', 
          right: 50, 
          bottom: -80, 
          width: 150, 
          height: 150, 
          borderRadius: '50%', 
          bgcolor: 'rgba(255,255,255,0.08)',
        }} />
      </Paper>

      {/* 快速操作 */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: '饮食', icon: <RestaurantIcon />, path: '/foods', color: '#6366f1' },
          { label: '血糖', icon: <WaterDropIcon />, path: '/glucose', color: '#ef4444' },
          { label: '用药', icon: <MedicationIcon />, path: '/medications', color: '#10b981' },
          { label: '体重', icon: <FitnessCenterIcon />, onClick: () => setWeightDialogOpen(true), color: '#f59e0b' },
        ].map((item, index) => (
          <Grid item xs={6} sm={3} key={index}>
            <Card 
              sx={{ 
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 32px rgba(0,0,0,0.15)',
                },
              }}
              onClick={item.onClick ? () => item.onClick!() : undefined}
            >
              <CardContent sx={{ py: 2.5 }}>
                <Box sx={{ 
                  width: 48, 
                  height: 48, 
                  borderRadius: 12, 
                  bgcolor: `${item.color}15`,
                  color: item.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 1.5,
                }}>
                  {item.icon}
                </Box>
                <Typography variant="body2" fontWeight={600}>
                  {item.label}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* 数据统计 */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6}>
          <Card sx={{ height: '100%', borderRadius: 2 }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: '#6366f115', color: '#6366f1', mr: 1.5 }}>
                  <RestaurantIcon />
                </Avatar>
                <Typography variant="subtitle1" fontWeight={700}>今日饮食</Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 800, color: '#6366f1', mb: 1 }}>
                {foodStats.totalCalories}
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={2}>
                卡路里摄入
              </Typography>
              <Grid container spacing={1}>
                {[
                  { label: '碳水', value: foodStats.totalCarbohydrates, unit: 'g' },
                  { label: '蛋白质', value: foodStats.totalProtein, unit: 'g' },
                  { label: '脂肪', value: foodStats.totalFat, unit: 'g' },
                ].map((item, i) => (
                  <Grid item xs={4} key={i}>
                    <Box sx={{ textAlign: 'center', p: 1, bgcolor: '#f8fafc', borderRadius: 2 }}>
                      <Typography variant="caption" color="text.secondary">{item.label}</Typography>
                      <Typography variant="body2" fontWeight={700}>{item.value}{item.unit}</Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Card sx={{ height: '100%', borderRadius: 2 }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: '#ef444415', color: '#ef4444', mr: 1.5 }}>
                  <WaterDropIcon />
                </Avatar>
                <Typography variant="subtitle1" fontWeight={700}>血糖状态</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 1 }}>
                <Typography variant="h3" sx={{ fontWeight: 800, color: glucoseStatus.color === 'error' ? '#ef4444' : glucoseStatus.color === 'warning' ? '#f59e0b' : '#10b981' }}>
                  {glucoseStats.averageValue.toFixed(1)}
                </Typography>
                <Typography variant="body2" color="text.secondary" ml={0.5}>mmol/L</Typography>
              </Box>
              <Chip
                icon={glucoseStatus.icon}
                label={glucoseStatus.text}
                color={glucoseStatus.color}
                size="small"
                sx={{ mb: 2 }}
              />
              <Grid container spacing={1}>
                {[
                  { label: '最低', value: glucoseStats.minValue },
                  { label: '最高', value: glucoseStats.maxValue },
                  { label: '测量', value: glucoseStats.totalEntries, unit: '次' },
                ].map((item, i) => (
                  <Grid item xs={4} key={i}>
                    <Box sx={{ textAlign: 'center', p: 1, bgcolor: '#f8fafc', borderRadius: 2 }}>
                      <Typography variant="caption" color="text.secondary">{item.label}</Typography>
                      <Typography variant="body2" fontWeight={700}>{item.value}{item.unit || ''}</Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Card sx={{ height: '100%', borderRadius: 2 }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: '#10b98115', color: '#10b981', mr: 1.5 }}>
                  <MedicationIcon />
                </Avatar>
                <Typography variant="subtitle1" fontWeight={700}>用药进度</Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="h3" sx={{ fontWeight: 800, color: '#10b981' }}>
                    {takenMedications}/{todayMedications}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    已完成
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={todayMedications > 0 ? (takenMedications / todayMedications) * 100 : 0}
                  sx={{ height: 8, borderRadius: 4, bgcolor: '#e2e8f0' }}
                />
              </Box>
              <Typography variant="body2" color="text.secondary">
                {todayMedications - takenMedications} 次待服用
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Card sx={{ height: '100%', borderRadius: 2 }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: '#f59e0b15', color: '#f59e0b', mr: 1.5 }}>
                  <FitnessCenterIcon />
                </Avatar>
                <Typography variant="subtitle1" fontWeight={700}>身体指标</Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: '#f59e0b' }}>
                    {user?.targetWeight || '-'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">kg</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">目标体重</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">BMI</Typography>
                  <Typography variant="h5" fontWeight={700}>{isNaN(bmi) ? '-' : bmi}</Typography>
                </Box>
                {bmiStatus && (
                  <Chip label={bmiStatus.text} color={bmiStatus.color} size="small" />
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* 图表区域 */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ borderRadius: 2 }}>
            <CardContent sx={{ p: 2.5 }}>
              <Typography variant="h6" fontWeight={700} mb={2}>
                血糖趋势（近 7 天）
              </Typography>
              <Box sx={{ height: 250 }}>
                {glucoseData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={glucoseData}>
                      <defs>
                        <linearGradient id="glucoseGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
                      <YAxis stroke="#64748b" fontSize={12} domain={['dataMin - 1', 'dataMax + 1']} />
                      <Tooltip 
                        contentStyle={{ 
                          borderRadius: 12, 
                          border: 'none',
                          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                        }}
                      />
                      <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={3} fill="url(#glucoseGradient)" />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <Typography color="text.secondary">暂无数据</Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 2, height: '100%' }}>
            <CardContent sx={{ p: 2.5 }}>
              <Typography variant="h6" fontWeight={700} mb={2}>
                热量摄入（近 7 天）
              </Typography>
              <Box sx={{ height: 250 }}>
                {calorieData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={calorieData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
                      <YAxis stroke="#64748b" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          borderRadius: 12,
                          border: 'none',
                          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                        }}
                      />
                      <Bar dataKey="calories" fill="#10b981" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <Typography color="text.secondary">暂无数据</Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* 体重编辑对话框 */}
      <Dialog open={weightDialogOpen} onClose={() => setWeightDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>设置目标体重</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            type="number"
            label="体重 (kg)"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            sx={{ mt: 1 }}
            inputProps={{ step: '0.1' }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setWeightDialogOpen(false)}>取消</Button>
          <Button onClick={handleWeightSave} variant="contained">保存</Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
}
