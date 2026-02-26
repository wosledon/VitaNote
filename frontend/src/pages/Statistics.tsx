import React, { useEffect, useState } from 'react'
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Skeleton,
  Alert,
  Chip,
  Button,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material'
import RefreshIcon from '@mui/icons-material/Refresh'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import ShowChartIcon from '@mui/icons-material/ShowChart'
import BarChartIcon from '@mui/icons-material/BarChart'
import PieChartIcon from '@mui/icons-material/PieChart'
import { healthRecordService } from '../api/services'
import type { HealthStatisticsResponse, TrendAnalysisResponse } from '../types/api'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
  ComposedChart,
  ReferenceLine,
} from 'recharts'

const COLORS = ['#006C4C', '#0061A4', '#F57C00', '#B3261E', '#7B1FA2', '#0288D1']

const StatCard = ({ title, value, subtitle, trend, color, icon: Icon }: any) => {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up': return <TrendingUpIcon sx={{ fontSize: 18 }} />
      case 'down': return <TrendingDownIcon sx={{ fontSize: 18 }} />
      default: return <TrendingFlatIcon sx={{ fontSize: 18 }} />
    }
  }

  const colorMap: any = {
    primary: { bg: '#E8F5E9', main: '#006C4C', icon: '#2E7D32' },
    blue: { bg: '#E3F2FD', main: '#0061A4', icon: '#1565C0' },
    orange: { bg: '#FFF3E0', main: '#F57C00', icon: '#EF6C00' },
    red: { bg: '#FFEBEE', main: '#B3261E', icon: '#C62828' },
  }

  const colors = colorMap[color] || colorMap.primary

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 3,
              bgcolor: colors.bg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: colors.icon,
              mr: 2,
            }}
          >
            <Icon sx={{ fontSize: 24 }} />
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
              {title}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, color: colors.main }}>
              {value}
            </Typography>
          </Box>
        </Box>
        {subtitle && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {trend && (
              <Chip
                icon={getTrendIcon()}
                label={trend === 'up' ? '上升' : trend === 'down' ? '下降' : '持平'}
                size="small"
                color={trend === 'up' ? 'error' : trend === 'down' ? 'success' : 'default'}
                sx={{ height: 24 }}
              />
            )}
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  )
}

// 模拟数据生成器
const generateMockData = (days: number) => {
  const data = []
  const today = new Date()
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    data.push({
      date: date.toISOString().split('T')[0],
      weight: 70 + Math.random() * 2 - 1,
      glucose: 5.5 + Math.random() * 2 - 1,
      systolic: 120 + Math.random() * 20 - 10,
      diastolic: 80 + Math.random() * 10 - 5,
      heartRate: 70 + Math.random() * 10 - 5,
      calories: 1800 + Math.random() * 400 - 200,
    })
  }
  return data
}

const mealData = [
  { name: '早餐', value: 30, calories: 450 },
  { name: '午餐', value: 40, calories: 750 },
  { name: '晚餐', value: 25, calories: 550 },
  { name: '加餐', value: 5, calories: 150 },
]

const healthScoreData = [
  { name: '体重', score: 85, fullMark: 100 },
  { name: '血糖', score: 78, fullMark: 100 },
  { name: '血压', score: 82, fullMark: 100 },
  { name: '饮食', score: 75, fullMark: 100 },
  { name: '运动', score: 60, fullMark: 100 },
]

export const Statistics = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [timeRange, setTimeRange] = useState('30')
  const [statistics, setStatistics] = useState<HealthStatisticsResponse | null>(null)
  const [trendData, setTrendData] = useState<any[]>([])
  
  useEffect(() => {
    loadData()
  }, [timeRange])
  
  const loadData = async () => {
    setLoading(true)
    setError(null)
    try {
      const statsRes = await healthRecordService.getStatistics()
      setStatistics(statsRes.data)
      
      // 使用模拟数据展示图表
      const days = parseInt(timeRange)
      setTrendData(generateMockData(days))
    } catch (err: any) {
      console.error('加载统计数据失败:', err)
      setError('加载统计数据失败')
      // 使用模拟数据
      setTrendData(generateMockData(30))
    } finally {
      setLoading(false)
    }
  }
  
  const getBmiStatus = (bmi: number | undefined) => {
    if (!bmi) return { label: '未知', color: 'default' }
    if (bmi < 18.5) return { label: '偏瘦', color: 'warning' }
    if (bmi < 24) return { label: '正常', color: 'success' }
    if (bmi < 28) return { label: '超重', color: 'warning' }
    return { label: '肥胖', color: 'error' }
  }
  
  return (
    <Box>
      {/* 标题栏 */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          健康统计
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <ToggleButtonGroup
            value={timeRange}
            exclusive
            onChange={(_, value) => value && setTimeRange(value)}
            size="small"
          >
            <ToggleButton value="7">7天</ToggleButton>
            <ToggleButton value="30">30天</ToggleButton>
            <ToggleButton value="90">90天</ToggleButton>
          </ToggleButtonGroup>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={loadData}
            disabled={loading}
          >
            刷新
          </Button>
        </Box>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      
      {/* 统计卡片 */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} lg={3}>
          {loading ? (
            <Skeleton variant="rectangular" height={140} sx={{ borderRadius: 4 }} />
          ) : (
            <StatCard
              title="体重记录"
              value={statistics?.totalWeightRecords || 0}
              subtitle={statistics?.latestWeight ? `最新 ${statistics.latestWeight.toFixed(1)} kg` : '暂无记录'}
              trend={statistics?.weightTrend === 'increasing' ? 'up' : statistics?.weightTrend === 'decreasing' ? 'down' : 'stable'}
              color="primary"
              icon={ShowChartIcon}
            />
          )}
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          {loading ? (
            <Skeleton variant="rectangular" height={140} sx={{ borderRadius: 4 }} />
          ) : (
            <StatCard
              title="血糖记录"
              value={statistics?.totalGlucoseRecords || 0}
              subtitle="平均 5.8 mmol/L"
              color="blue"
              icon={ShowChartIcon}
            />
          )}
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          {loading ? (
            <Skeleton variant="rectangular" height={140} sx={{ borderRadius: 4 }} />
          ) : (
            <StatCard
              title="血压记录"
              value={statistics?.totalBloodPressureRecords || 0}
              subtitle="平均 120/80 mmHg"
              color="red"
              icon={ShowChartIcon}
            />
          )}
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          {loading ? (
            <Skeleton variant="rectangular" height={140} sx={{ borderRadius: 4 }} />
          ) : (
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 3,
                      bgcolor: '#FFF3E0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#EF6C00',
                      mr: 2,
                    }}
                  >
                    <CalendarTodayIcon />
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                      BMI 指数
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#F57C00' }}>
                      {statistics?.bmi?.toFixed(1) || '-'}
                    </Typography>
                  </Box>
                </Box>
                {statistics?.bmi && (
                  <Chip
                    label={getBmiStatus(statistics.bmi).label}
                    size="small"
                    color={getBmiStatus(statistics.bmi).color as any}
                    sx={{ height: 24 }}
                  />
                )}
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
      
      {/* 图表区域 */}
      <Grid container spacing={3}>
        {/* 体重趋势图 */}
        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                体重变化趋势
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData}>
                    <defs>
                      <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#006C4C" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#006C4C" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(date) => new Date(date).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}
                      stroke="#9E9E9E"
                    />
                    <YAxis domain={['dataMin - 1', 'dataMax + 1']} stroke="#9E9E9E" />
                    <Tooltip 
                      contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="weight"
                      stroke="#006C4C"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#weightGradient)"
                    />
                    <ReferenceLine y={70} stroke="#F57C00" strokeDasharray="3 3" label="目标" />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* 血糖趋势图 */}
        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                血糖变化趋势
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(date) => new Date(date).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}
                      stroke="#9E9E9E"
                    />
                    <YAxis stroke="#9E9E9E" />
                    <Tooltip 
                      contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="glucose"
                      stroke="#0061A4"
                      strokeWidth={3}
                      dot={{ fill: '#0061A4', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                    <ReferenceLine y={6.1} stroke="#F57C00" strokeDasharray="3 3" label="正常上限" />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* 血压趋势图 */}
        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                血压变化趋势
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(date) => new Date(date).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}
                      stroke="#9E9E9E"
                    />
                    <YAxis stroke="#9E9E9E" />
                    <Tooltip 
                      contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
                    />
                    <Legend />
                    <Bar dataKey="systolic" name="收缩压" fill="#B3261E" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="diastolic" name="舒张压" fill="#0061A4" radius={[4, 4, 0, 0]} />
                    <Line type="monotone" dataKey="heartRate" name="心率" stroke="#F57C00" strokeWidth={2} />
                  </ComposedChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* 热量摄入分布 */}
        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                每日热量摄入
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={trendData.slice(-7)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(date) => new Date(date).toLocaleDateString('zh-CN', { weekday: 'short' })}
                      stroke="#9E9E9E"
                    />
                    <YAxis stroke="#9E9E9E" />
                    <Tooltip 
                      contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
                      formatter={(value: number) => [`${value.toFixed(0)} kcal`, '热量']}
                    />
                    <Bar dataKey="calories" fill="#F57C00" radius={[4, 4, 0, 0]} />
                    <ReferenceLine y={2000} stroke="#006C4C" strokeDasharray="3 3" label="建议摄入" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* 餐次分布饼图 */}
        <Grid item xs={12} md={6} lg={4}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                餐次热量分布
              </Typography>
              <Box sx={{ height: 280 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={mealData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {mealData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
                      formatter={(value: number, name: string, props: any) => [`${props.payload.calories} kcal`, name]}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* 健康评分雷达图 */}
        <Grid item xs={12} md={6} lg={4}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                健康指标评分
              </Typography>
              <Box sx={{ height: 280 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={healthScoreData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" horizontal={false} />
                    <XAxis type="number" domain={[0, 100]} stroke="#9E9E9E" />
                    <YAxis dataKey="name" type="category" width={60} stroke="#9E9E9E" />
                    <Tooltip 
                      contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
                      formatter={(value: number) => [`${value} 分`, '评分']}
                    />
                    <Bar dataKey="score" fill="#006C4C" radius={[0, 4, 4, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* 健康建议卡片 */}
        <Grid item xs={12} md={12} lg={4}>
          <Card sx={{ height: '100%', bgcolor: '#E8F5E9' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: '#1B5E20' }}>
                📊 数据分析建议
              </Typography>
              <Box component="ul" sx={{ m: 0, pl: 2, color: '#2E7D32' }}>
                <Typography component="li" variant="body2" sx={{ mb: 1.5 }}>
                  您的体重趋势平稳，继续保持！
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 1.5 }}>
                  血糖控制良好，注意餐后监测
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 1.5 }}>
                  血压在正常范围内
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 1.5 }}>
                  建议增加运动量，提高代谢
                </Typography>
                <Typography component="li" variant="body2">
                  每日热量摄入适中，营养均衡
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}
