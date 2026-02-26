import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { healthRecordService } from '../api/services'
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Skeleton,
  Alert,
  Chip,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import RestaurantIcon from '@mui/icons-material/Restaurant'
import CameraAltIcon from '@mui/icons-material/CameraAlt'
import SmartToyIcon from '@mui/icons-material/SmartToy'
import AssessmentIcon from '@mui/icons-material/Assessment'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat'
import ScaleIcon from '@mui/icons-material/Scale'
import BloodtypeIcon from '@mui/icons-material/Bloodtype'
import FavoriteIcon from '@mui/icons-material/Favorite'

interface DashboardStats {
  weightCount: number
  glucoseCount: number
  bpCount: number
  latestWeight: number | null
  weightTrend: 'up' | 'down' | 'stable' | null
  bmi: number | null
}

const StatCard = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon,
  color,
  trend,
  loading 
}: { 
  title: string
  value: string | number
  subtitle?: string
  icon: any
  color: 'primary' | 'success' | 'error' | 'warning'
  trend?: 'up' | 'down' | 'stable' | null
  loading?: boolean
}) => {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up': return <TrendingUpIcon sx={{ fontSize: 16 }} />
      case 'down': return <TrendingDownIcon sx={{ fontSize: 16 }} />
      default: return <TrendingFlatIcon sx={{ fontSize: 16 }} />
    }
  }
  
  const getTrendColor = () => {
    switch (trend) {
      case 'up': return 'error'
      case 'down': return 'success'
      default: return 'default'
    }
  }

  const colorMap = {
    primary: { bg: '#E8F5E9', icon: '#2E7D32', main: '#006C4C' },
    success: { bg: '#E3F2FD', icon: '#1565C0', main: '#0061A4' },
    error: { bg: '#FFEBEE', icon: '#C62828', main: '#B3261E' },
    warning: { bg: '#FFF3E0', icon: '#EF6C00', main: '#F57C00' },
  }

  const colors = colorMap[color]

  return (
    <Card sx={{ height: '100%', '&:hover': { boxShadow: 4 } }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary', fontWeight: 500 }}>
              {title}
            </Typography>
            {loading ? (
              <Skeleton variant="text" width={80} height={48} />
            ) : (
              <Typography variant="h3" sx={{ fontWeight: 700, color: colors.main, mb: 0.5 }}>
                {value}
              </Typography>
            )}
            {loading ? (
              <Skeleton variant="text" width={120} />
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                {trend && (
                  <Chip
                    icon={getTrendIcon()}
                    label={trend === 'up' ? '上升' : trend === 'down' ? '下降' : '持平'}
                    size="small"
                    color={getTrendColor() as any}
                    sx={{ height: 24, fontWeight: 500 }}
                  />
                )}
                {subtitle && (
                  <Typography variant="body2" color="text.secondary">
                    {subtitle}
                  </Typography>
                )}
              </Box>
            )}
          </Box>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: 3,
              bgcolor: colors.bg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: colors.icon,
              ml: 2,
            }}
          >
            <Icon sx={{ fontSize: 28 }} />
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}

const QuickActionButton = ({ 
  icon: Icon, 
  label, 
  color,
  onClick 
}: { 
  icon: any
  label: string
  color: string
  onClick: () => void
}) => {
  const colorMap: any = {
    primary: { bg: '#E8F5E9', hover: '#C8E6C9', icon: '#2E7D32' },
    blue: { bg: '#E3F2FD', hover: '#BBDEFB', icon: '#1565C0' },
    orange: { bg: '#FFF3E0', hover: '#FFE0B2', icon: '#EF6C00' },
    purple: { bg: '#F3E5F5', hover: '#E1BEE7', icon: '#7B1FA2' },
    teal: { bg: '#E0F2F1', hover: '#B2DFDB', icon: '#00796B' },
  }

  const colors = colorMap[color] || colorMap.primary

  return (
    <Card
      onClick={onClick}
      sx={{
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        },
      }}
    >
      <CardContent sx={{ p: 3, textAlign: 'center' }}>
        <Box
          sx={{
            width: 72,
            height: 72,
            borderRadius: 4,
            bgcolor: colors.bg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: colors.icon,
            mx: 'auto',
            mb: 2,
            transition: 'all 0.3s',
            '&:hover': {
              bgcolor: colors.hover,
              transform: 'scale(1.05)',
            },
          }}
        >
          <Icon sx={{ fontSize: 36 }} />
        </Box>
        <Typography variant="body1" sx={{ fontWeight: 600, color: 'text.primary' }}>
          {label}
        </Typography>
      </CardContent>
    </Card>
  )
}

export const Dashboard = () => {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<DashboardStats>({
    weightCount: 0,
    glucoseCount: 0,
    bpCount: 0,
    latestWeight: null,
    weightTrend: null,
    bmi: null,
  })
  
  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const statsRes = await healthRecordService.getStatistics()
      const data = statsRes.data
      
      setStats({
        weightCount: data.totalWeightRecords || 0,
        glucoseCount: data.totalGlucoseRecords || 0,
        bpCount: data.totalBloodPressureRecords || 0,
        latestWeight: data.latestWeight || null,
        weightTrend: data.weightTrend === 'increasing' ? 'up' : 
                     data.weightTrend === 'decreasing' ? 'down' : 'stable',
        bmi: data.bmi || null,
      })
    } catch (err: any) {
      console.error('加载仪表盘数据失败:', err)
      setError('无法连接到服务器，请确保后端服务已启动')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <Box>
      {/* 欢迎区域 */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}>
          你好，{user?.userName} 👋
        </Typography>
        <Typography variant="body1" color="text.secondary">
          今天是记录健康的好日子，开始追踪您的健康数据吧！
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }}>
          {error}
        </Alert>
      )}
      
      {/* 统计卡片 */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="体重记录"
            value={stats.weightCount}
            subtitle={stats.latestWeight ? `最新 ${stats.latestWeight.toFixed(1)} kg` : '暂无记录'}
            icon={ScaleIcon}
            color="primary"
            trend={stats.weightTrend}
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="血糖记录"
            value={stats.glucoseCount}
            subtitle={stats.glucoseCount > 0 ? '持续监测中' : '暂无记录'}
            icon={BloodtypeIcon}
            color="success"
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="血压记录"
            value={stats.bpCount}
            subtitle={stats.bpCount > 0 ? '持续监测中' : '暂无记录'}
            icon={FavoriteIcon}
            color="error"
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="BMI 指数"
            value={stats.bmi?.toFixed(1) || '-'}
            subtitle={stats.bmi 
              ? stats.bmi < 18.5 ? '偏瘦' : stats.bmi < 24 ? '正常' : '超重'
              : '需要更多信息'
            }
            icon={AssessmentIcon}
            color="warning"
            loading={loading}
          />
        </Grid>
      </Grid>
      
      {/* 快速操作 */}
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}>
        快速操作
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={6} sm={4} md={2.4}>
          <QuickActionButton
            icon={AddIcon}
            label="添加记录"
            color="primary"
            onClick={() => navigate('/records')}
          />
        </Grid>
        <Grid item xs={6} sm={4} md={2.4}>
          <QuickActionButton
            icon={RestaurantIcon}
            label="记录饮食"
            color="orange"
            onClick={() => navigate('/food-records')}
          />
        </Grid>
        <Grid item xs={6} sm={4} md={2.4}>
          <QuickActionButton
            icon={CameraAltIcon}
            label="拍照识别"
            color="blue"
            onClick={() => navigate('/ocr')}
          />
        </Grid>
        <Grid item xs={6} sm={4} md={2.4}>
          <QuickActionButton
            icon={SmartToyIcon}
            label="AI助手"
            color="purple"
            onClick={() => navigate('/llm')}
          />
        </Grid>
        <Grid item xs={6} sm={4} md={2.4}>
          <QuickActionButton
            icon={AssessmentIcon}
            label="数据分析"
            color="teal"
            onClick={() => navigate('/statistics')}
          />
        </Grid>
      </Grid>
      
      {/* 提示卡片 */}
      <Card sx={{ bgcolor: '#E8F5E9', border: '1px solid #C8E6C9' }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#1B5E20' }}>
            💡 健康小贴士
          </Typography>
          <Box component="ul" sx={{ m: 0, pl: 2, color: '#2E7D32' }}>
            <Typography component="li" variant="body2" sx={{ mb: 1 }}>
              建议每天固定时间测量体重，早上空腹最佳
            </Typography>
            <Typography component="li" variant="body2" sx={{ mb: 1 }}>
              血糖监测建议餐前餐后都进行记录
            </Typography>
            <Typography component="li" variant="body2" sx={{ mb: 1 }}>
              血压测量前请静坐 5 分钟，保持心情平静
            </Typography>
            <Typography component="li" variant="body2">
              使用 AI 助手可以获取个性化的健康建议
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}
