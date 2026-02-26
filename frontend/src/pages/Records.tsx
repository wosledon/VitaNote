import React, { useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  Typography,
  Tabs,
  Tab,
  Button,
  TextField,
  Grid,
  Box,
  Alert,
  Snackbar,
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
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import CloseIcon from '@mui/icons-material/Close'
import ScaleIcon from '@mui/icons-material/Scale'
import BloodtypeIcon from '@mui/icons-material/Bloodtype'
import FavoriteIcon from '@mui/icons-material/Favorite'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import FilterListIcon from '@mui/icons-material/FilterList'
import { healthRecordService } from '../api/services'
import type {
  WeightRecordRequest,
  GlucoseRecordRequest,
  BloodPressureRecordRequest,
  WeightRecordResponse,
  GlucoseRecordResponse,
  BloodPressureRecordResponse,
} from '../types/api'
import dayjs from 'dayjs'

enum TabValue {
  Weight = 0,
  Glucose = 1,
  BloodPressure = 2,
}

const TIME_RANGES = [
  { value: '7', label: '最近7天' },
  { value: '30', label: '最近30天' },
  { value: '90', label: '最近90天' },
  { value: 'custom', label: '自定义' },
]

export const Records = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [tabValue, setTabValue] = useState<TabValue>(TabValue.Weight)
  const [openDialog, setOpenDialog] = useState(false)
  const [loading, setLoading] = useState(false)
  const [dataLoading, setDataLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  
  // 时间筛选
  const [timeRange, setTimeRange] = useState('30')
  const [startDate, setStartDate] = useState(dayjs().subtract(30, 'day').format('YYYY-MM-DD'))
  const [endDate, setEndDate] = useState(dayjs().format('YYYY-MM-DD'))
  const [showFilters, setShowFilters] = useState(false)
  
  // 记录数据
  const [weightRecords, setWeightRecords] = useState<WeightRecordResponse[]>([])
  const [glucoseRecords, setGlucoseRecords] = useState<GlucoseRecordResponse[]>([])
  const [bpRecords, setBpRecords] = useState<BloodPressureRecordResponse[]>([])
  
  // 表单状态
  const [formData, setFormData] = useState({
    weight: '',
    glucoseLevel: '',
    glucoseType: '1',
    systolic: '',
    diastolic: '',
    heartRate: '',
    comment: '',
  })
  
  useEffect(() => {
    loadRecords()
  }, [tabValue, startDate, endDate])
  
  // 当时间范围改变时更新日期
  useEffect(() => {
    if (timeRange !== 'custom') {
      const days = parseInt(timeRange)
      setStartDate(dayjs().subtract(days, 'day').format('YYYY-MM-DD'))
      setEndDate(dayjs().format('YYYY-MM-DD'))
    }
  }, [timeRange])
  
  const loadRecords = async () => {
    setDataLoading(true)
    try {
      const start = new Date(startDate)
      const end = new Date(endDate)
      end.setHours(23, 59, 59, 999) // 设置到当天结束
      
      if (tabValue === TabValue.Weight) {
        const res = await healthRecordService.getWeightRecords(start, end)
        setWeightRecords(res.data)
      } else if (tabValue === TabValue.Glucose) {
        const res = await healthRecordService.getGlucoseRecords(start, end)
        setGlucoseRecords(res.data)
      } else {
        const res = await healthRecordService.getBloodPressureRecords(start, end)
        setBpRecords(res.data)
      }
    } catch (err: any) {
      console.error('加载记录失败:', err)
      setError('加载记录失败')
    } finally {
      setDataLoading(false)
    }
  }
  
  const handleTabChange = (_: React.ChangeEvent<{}>, newValue: TabValue) => {
    setTabValue(newValue)
    setError(null)
  }
  
  const handleSubmit = async () => {
    setLoading(true)
    setError(null)
    
    try {
      if (tabValue === TabValue.Weight) {
        const request: WeightRecordRequest = {
          weight: parseFloat(formData.weight),
          comment: formData.comment || undefined,
        }
        await healthRecordService.addWeightRecord(request)
        setSuccess('体重记录添加成功')
      } else if (tabValue === TabValue.Glucose) {
        const request: GlucoseRecordRequest = {
          glucoseLevel: parseFloat(formData.glucoseLevel),
          type: parseInt(formData.glucoseType),
          comment: formData.comment || undefined,
        }
        await healthRecordService.addGlucoseRecord(request)
        setSuccess('血糖记录添加成功')
      } else {
        const request: BloodPressureRecordRequest = {
          systolic: parseInt(formData.systolic),
          diastolic: parseInt(formData.diastolic),
          heartRate: parseInt(formData.heartRate),
          comment: formData.comment || undefined,
        }
        await healthRecordService.addBloodPressureRecord(request)
        setSuccess('血压记录添加成功')
      }
      
      setOpenDialog(false)
      resetForm()
      loadRecords()
    } catch (err: any) {
      console.error('添加记录失败:', err)
      setError(err.response?.data?.message || '添加记录失败')
    } finally {
      setLoading(false)
    }
  }
  
  const resetForm = () => {
    setFormData({
      weight: '',
      glucoseLevel: '',
      glucoseType: '1',
      systolic: '',
      diastolic: '',
      heartRate: '',
      comment: '',
    })
  }
  
  const getTabLabel = () => {
    switch (tabValue) {
      case TabValue.Weight: return '体重'
      case TabValue.Glucose: return '血糖'
      case TabValue.BloodPressure: return '血压'
    }
  }
  
  const getGlucoseTypeText = (type: number) => {
    switch (type) {
      case 1: return { label: '空腹', color: 'primary' as const }
      case 2: return { label: '餐后', color: 'success' as const }
      default: return { label: '随机', color: 'default' as const }
    }
  }
  
  const isFormValid = () => {
    switch (tabValue) {
      case TabValue.Weight: return !!formData.weight
      case TabValue.Glucose: return !!formData.glucoseLevel
      case TabValue.BloodPressure: return !!formData.systolic && !!formData.diastolic && !!formData.heartRate
    }
  }
  
  const getRecords = () => {
    switch (tabValue) {
      case TabValue.Weight: return weightRecords
      case TabValue.Glucose: return glucoseRecords
      case TabValue.BloodPressure: return bpRecords
    }
  }
  
  return (
    <Box>
      {/* 标题栏 */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          健康记录
        </Typography>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      
      {/* 标签页 */}
      <Card sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant={isMobile ? 'fullWidth' : 'standard'}
          sx={{ px: 2, pt: 1 }}
        >
          <Tab icon={<ScaleIcon />} label="体重" iconPosition="start" />
          <Tab icon={<BloodtypeIcon />} label="血糖" iconPosition="start" />
          <Tab icon={<FavoriteIcon />} label="血压" iconPosition="start" />
        </Tabs>
      </Card>
      
      {/* 时间筛选 */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', mb: showFilters ? 2 : 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#006C4C' }}>
              <CalendarTodayIcon />
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                时间范围
              </Typography>
            </Box>
            
            <ToggleButtonGroup
              value={timeRange}
              exclusive
              onChange={(_, value) => value && setTimeRange(value)}
              size="small"
            >
              {TIME_RANGES.map(range => (
                <ToggleButton key={range.value} value={range.value}>
                  {range.label}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
            
            <Button
              variant={showFilters ? "contained" : "outlined"}
              size="small"
              startIcon={<FilterListIcon />}
              onClick={() => setShowFilters(!showFilters)}
            >
              筛选
            </Button>
          </Box>
          
          {showFilters && timeRange === 'custom' && (
            <Box sx={{ display: 'flex', gap: 2, mt: 2, flexWrap: 'wrap' }}>
              <TextField
                type="date"
                label="开始日期"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                size="small"
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                type="date"
                label="结束日期"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                size="small"
                InputLabelProps={{ shrink: true }}
              />
            </Box>
          )}
        </CardContent>
      </Card>
      
      {/* 记录列表 */}
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#F5F5F5' }}>
                <TableCell sx={{ fontWeight: 600 }}>记录时间</TableCell>
                {tabValue === TabValue.Weight && (
                  <>
                    <TableCell sx={{ fontWeight: 600 }}>体重 (kg)</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>备注</TableCell>
                  </>
                )}
                {tabValue === TabValue.Glucose && (
                  <>
                    <TableCell sx={{ fontWeight: 600 }}>血糖 (mmol/L)</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>类型</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>备注</TableCell>
                  </>
                )}
                {tabValue === TabValue.BloodPressure && (
                  <>
                    <TableCell sx={{ fontWeight: 600 }}>收缩压/舒张压</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>心率</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>备注</TableCell>
                  </>
                )}
                <TableCell align="right" sx={{ fontWeight: 600 }}>操作</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dataLoading ? (
                <TableRow>
                  <TableCell colSpan={5}>
                    <Box sx={{ py: 4, textAlign: 'center' }}>
                      <Typography color="text.secondary">加载中...</Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                <>
                  {tabValue === TabValue.Weight && weightRecords.map((record) => (
                    <TableRow key={record.id} hover>
                      <TableCell>{dayjs(record.recordedAt).format('YYYY-MM-DD HH:mm')}</TableCell>
                      <TableCell>
                        <Typography variant="body1" sx={{ fontWeight: 600, color: '#006C4C' }}>
                          {record.weight.toFixed(1)}
                        </Typography>
                      </TableCell>
                      <TableCell>{record.comment || '-'}</TableCell>
                      <TableCell align="right">
                        <IconButton size="small" color="error">
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                  
                  {tabValue === TabValue.Glucose && glucoseRecords.map((record) => {
                    const typeInfo = getGlucoseTypeText(record.type)
                    return (
                      <TableRow key={record.id} hover>
                        <TableCell>{dayjs(record.recordedAt).format('YYYY-MM-DD HH:mm')}</TableCell>
                        <TableCell>
                          <Typography variant="body1" sx={{ fontWeight: 600, color: '#0061A4' }}>
                            {record.glucoseLevel.toFixed(1)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip label={typeInfo.label} color={typeInfo.color} size="small" />
                        </TableCell>
                        <TableCell>{record.comment || '-'}</TableCell>
                        <TableCell align="right">
                          <IconButton size="small" color="error">
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                  
                  {tabValue === TabValue.BloodPressure && bpRecords.map((record) => (
                    <TableRow key={record.id} hover>
                      <TableCell>{dayjs(record.recordedAt).format('YYYY-MM-DD HH:mm')}</TableCell>
                      <TableCell>
                        <Typography variant="body1" sx={{ fontWeight: 600, color: '#B3261E' }}>
                          {record.systolic}/{record.diastolic}
                        </Typography>
                      </TableCell>
                      <TableCell>{record.heartRate} 次/分</TableCell>
                      <TableCell>{record.comment || '-'}</TableCell>
                      <TableCell align="right">
                        <IconButton size="small" color="error">
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                  
                  {getRecords().length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        <Box sx={{ py: 6 }}>
                          {tabValue === TabValue.Weight && <ScaleIcon sx={{ fontSize: 48, color: '#9E9E9E', mb: 2 }} />}
                          {tabValue === TabValue.Glucose && <BloodtypeIcon sx={{ fontSize: 48, color: '#9E9E9E', mb: 2 }} />}
                          {tabValue === TabValue.BloodPressure && <FavoriteIcon sx={{ fontSize: 48, color: '#9E9E9E', mb: 2 }} />}
                          <Typography color="text.secondary" gutterBottom>
                            暂无{getTabLabel()}记录
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
                  )}
                </>
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
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {tabValue === TabValue.Weight && <ScaleIcon color="primary" />}
              {tabValue === TabValue.Glucose && <BloodtypeIcon color="primary" />}
              {tabValue === TabValue.BloodPressure && <FavoriteIcon color="primary" />}
              添加{getTabLabel()}记录
            </Box>
            <IconButton onClick={() => setOpenDialog(false)} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            {tabValue === TabValue.Weight && (
              <Grid item xs={12}>
                <TextField
                  label="体重"
                  type="number"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  fullWidth
                  required
                  InputProps={{ endAdornment: <InputAdornment position="end">kg</InputAdornment> }}
                />
              </Grid>
            )}
            
            {tabValue === TabValue.Glucose && (
              <>
                <Grid item xs={12} sm={7}>
                  <TextField
                    label="血糖值"
                    type="number"
                    value={formData.glucoseLevel}
                    onChange={(e) => setFormData({ ...formData, glucoseLevel: e.target.value })}
                    fullWidth
                    required
                    InputProps={{ endAdornment: <InputAdornment position="end">mmol/L</InputAdornment> }}
                  />
                </Grid>
                <Grid item xs={12} sm={5}>
                  <TextField
                    select
                    label="测量类型"
                    value={formData.glucoseType}
                    onChange={(e) => setFormData({ ...formData, glucoseType: e.target.value })}
                    fullWidth
                    SelectProps={{ native: true }}
                  >
                    <option value="1">空腹</option>
                    <option value="2">餐后</option>
                    <option value="3">随机</option>
                  </TextField>
                </Grid>
              </>
            )}
            
            {tabValue === TabValue.BloodPressure && (
              <>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="收缩压"
                    type="number"
                    value={formData.systolic}
                    onChange={(e) => setFormData({ ...formData, systolic: e.target.value })}
                    fullWidth
                    required
                    InputProps={{ endAdornment: <InputAdornment position="end">mmHg</InputAdornment> }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="舒张压"
                    type="number"
                    value={formData.diastolic}
                    onChange={(e) => setFormData({ ...formData, diastolic: e.target.value })}
                    fullWidth
                    required
                    InputProps={{ endAdornment: <InputAdornment position="end">mmHg</InputAdornment> }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="心率"
                    type="number"
                    value={formData.heartRate}
                    onChange={(e) => setFormData({ ...formData, heartRate: e.target.value })}
                    fullWidth
                    required
                    InputProps={{ endAdornment: <InputAdornment position="end">次/分</InputAdornment> }}
                  />
                </Grid>
              </>
            )}
            
            <Grid item xs={12}>
              <TextField
                label="备注（可选）"
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
          <Button variant="contained" onClick={handleSubmit} disabled={loading || !isFormValid()}>
            {loading ? '保存中...' : '保存记录'}
          </Button>
        </DialogActions>
      </Dialog>
      
      <Snackbar
        open={!!success}
        autoHideDuration={3000}
        onClose={() => setSuccess(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setSuccess(null)} sx={{ borderRadius: 3 }}>
          {success}
        </Alert>
      </Snackbar>
    </Box>
  )
}
