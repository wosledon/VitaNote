import React, { useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Grid,
  Box,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Fab,
  useMediaQuery,
  useTheme,
  InputAdornment,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import CloseIcon from '@mui/icons-material/Close'
import RestaurantIcon from '@mui/icons-material/Restaurant'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import { foodRecordService } from '../api/services'
import type { FoodRecordRequest, FoodRecordResponse, FoodStatisticsResponse } from '../types/api'
import dayjs from 'dayjs'

const mealTypes = [
  { value: 'breakfast', label: '早餐', color: 'warning' as const },
  { value: 'lunch', label: '午餐', color: 'success' as const },
  { value: 'dinner', label: '晚餐', color: 'primary' as const },
  { value: 'snack', label: '加餐', color: 'default' as const },
]

const StatCard = ({ title, value, unit, color }: { title: string; value: string | number; unit: string; color: string }) => {
  const colorMap: any = {
    primary: { bg: '#E8F5E9', text: '#006C4C' },
    success: { bg: '#E3F2FD', text: '#0061A4' },
    warning: { bg: '#FFF3E0', text: '#F57C00' },
    error: { bg: '#FFEBEE', text: '#B3261E' },
  }
  const colors = colorMap[color] || colorMap.primary

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1, fontWeight: 500 }}>
          {title}
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 700, color: colors.text, my: 0.5 }}>
          {value}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {unit}
        </Typography>
      </CardContent>
    </Card>
  )
}

export const FoodRecords = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [records, setRecords] = useState<FoodRecordResponse[]>([])
  const [statistics, setStatistics] = useState<FoodStatisticsResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedDate, setSelectedDate] = useState(dayjs().format('YYYY-MM-DD'))
  
  const [formData, setFormData] = useState<FoodRecordRequest>({
    foodName: '',
    calories: 0,
    protein: 0,
    carbohydrates: 0,
    fat: 0,
    eatenAt: dayjs().format('YYYY-MM-DDTHH:mm'),
    mealType: 'lunch',
    comment: '',
  })
  
  useEffect(() => {
    loadData()
  }, [selectedDate])
  
  const loadData = async () => {
    setLoading(true)
    try {
      const date = new Date(selectedDate)
      const [recordsRes, statsRes] = await Promise.all([
        foodRecordService.getFoodRecordsByDate(date),
        foodRecordService.getFoodStatistics(date),
      ])
      setRecords(recordsRes.data)
      setStatistics(statsRes.data)
    } catch (err: any) {
      console.error('加载饮食记录失败:', err)
      setError('加载数据失败，请检查网络连接')
    } finally {
      setLoading(false)
    }
  }
  
  const handleAddRecord = async () => {
    try {
      await foodRecordService.addFoodRecord(formData)
      setOpenDialog(false)
      resetForm()
      loadData()
    } catch (err: any) {
      console.error('添加饮食记录失败:', err)
      setError(err.response?.data?.message || '添加失败')
    }
  }
  
  const resetForm = () => {
    setFormData({
      foodName: '',
      calories: 0,
      protein: 0,
      carbohydrates: 0,
      fat: 0,
      eatenAt: dayjs().format('YYYY-MM-DDTHH:mm'),
      mealType: 'lunch',
      comment: '',
    })
  }
  
  const getMealTypeInfo = (type: string) => {
    return mealTypes.find(m => m.value === type) || { label: type, color: 'default' as const }
  }
  
  return (
    <Box>
      {/* 标题栏 */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          饮食记录
        </Typography>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      
      {/* 日期选择卡片 */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#006C4C' }}>
              <CalendarTodayIcon />
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                选择日期
              </Typography>
            </Box>
            <TextField
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  bgcolor: '#F5F5F5',
                },
              }}
            />
            <Button 
              variant="outlined" 
              size="small"
              onClick={() => setSelectedDate(dayjs().format('YYYY-MM-DD'))}
            >
              今天
            </Button>
            <Button 
              variant="outlined" 
              size="small"
              onClick={() => setSelectedDate(dayjs().subtract(1, 'day').format('YYYY-MM-DD'))}
            >
              昨天
            </Button>
          </Box>
        </CardContent>
      </Card>
      
      {/* 统计卡片 */}
      {statistics && (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={6} sm={3}>
            <StatCard title="总热量" value={statistics.totalCalories.toFixed(0)} unit="kcal" color="primary" />
          </Grid>
          <Grid item xs={6} sm={3}>
            <StatCard title="蛋白质" value={statistics.totalProtein.toFixed(1)} unit="g" color="success" />
          </Grid>
          <Grid item xs={6} sm={3}>
            <StatCard title="碳水化合物" value={statistics.totalCarbohydrates.toFixed(1)} unit="g" color="warning" />
          </Grid>
          <Grid item xs={6} sm={3}>
            <StatCard title="脂肪" value={statistics.totalFat.toFixed(1)} unit="g" color="error" />
          </Grid>
        </Grid>
      )}
      
      {/* 记录列表 */}
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#F5F5F5' }}>
                <TableCell sx={{ fontWeight: 600 }}>时间</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>餐次</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>食物</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>热量</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>蛋白质</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>碳水</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>脂肪</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>操作</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {records.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <Box sx={{ py: 6 }}>
                      <RestaurantIcon sx={{ fontSize: 48, color: '#9E9E9E', mb: 2 }} />
                      <Typography color="text.secondary" gutterBottom>
                        暂无饮食记录
                      </Typography>
                      <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => setOpenDialog(true)}
                      >
                        添加第一条记录
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                records.map((record) => {
                  const mealInfo = getMealTypeInfo(record.mealType || '')
                  return (
                    <TableRow key={record.id} hover>
                      <TableCell>{dayjs(record.eatenAt).format('HH:mm')}</TableCell>
                      <TableCell>
                        <Chip label={mealInfo.label} color={mealInfo.color} size="small" />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {record.foodName}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">{record.calories}</TableCell>
                      <TableCell align="right">{record.protein.toFixed(1)}g</TableCell>
                      <TableCell align="right">{record.carbohydrates.toFixed(1)}g</TableCell>
                      <TableCell align="right">{record.fat.toFixed(1)}g</TableCell>
                      <TableCell align="right">
                        <IconButton size="small" color="error">
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
      
      {/* 添加按钮 */}
      <Fab color="primary" sx={{ position: 'fixed', bottom: 24, right: 24 }} onClick={() => setOpenDialog(true)}>
        <AddIcon />
      </Fab>
      
      {/* 添加记录对话框 */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <RestaurantIcon color="primary" />
              添加饮食记录
            </Box>
            <IconButton onClick={() => setOpenDialog(false)} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12}>
              <TextField
                label="食物名称"
                value={formData.foodName}
                onChange={(e) => setFormData({ ...formData, foodName: e.target.value })}
                fullWidth
                required
                placeholder="例如：米饭、鸡胸肉、西兰花"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="餐次"
                value={formData.mealType}
                onChange={(e) => setFormData({ ...formData, mealType: e.target.value })}
                fullWidth
                SelectProps={{ native: true }}
              >
                {mealTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                type="datetime-local"
                label="时间"
                value={formData.eatenAt}
                onChange={(e) => setFormData({ ...formData, eatenAt: e.target.value })}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField
                label="热量"
                type="number"
                value={formData.calories || ''}
                onChange={(e) => setFormData({ ...formData, calories: parseFloat(e.target.value) || 0 })}
                fullWidth
                InputProps={{ endAdornment: <InputAdornment position="end">kcal</InputAdornment> }}
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField
                label="蛋白质"
                type="number"
                value={formData.protein || ''}
                onChange={(e) => setFormData({ ...formData, protein: parseFloat(e.target.value) || 0 })}
                fullWidth
                InputProps={{ endAdornment: <InputAdornment position="end">g</InputAdornment> }}
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField
                label="碳水"
                type="number"
                value={formData.carbohydrates || ''}
                onChange={(e) => setFormData({ ...formData, carbohydrates: parseFloat(e.target.value) || 0 })}
                fullWidth
                InputProps={{ endAdornment: <InputAdornment position="end">g</InputAdornment> }}
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField
                label="脂肪"
                type="number"
                value={formData.fat || ''}
                onChange={(e) => setFormData({ ...formData, fat: parseFloat(e.target.value) || 0 })}
                fullWidth
                InputProps={{ endAdornment: <InputAdornment position="end">g</InputAdornment> }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="备注"
                value={formData.comment}
                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                fullWidth
                multiline
                rows={2}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setOpenDialog(false)} variant="outlined">取消</Button>
          <Button variant="contained" onClick={handleAddRecord} disabled={!formData.foodName}>
            保存
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
