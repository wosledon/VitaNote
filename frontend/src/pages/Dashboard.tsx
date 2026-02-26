import React, { useEffect } from 'react'
import { DashboardLayout } from '../components/Layout'
import { useAuthStore } from '../store/authStore'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, Typography, Grid, Paper, Box } from '@mui/material'
import { useRecordsStore } from '../store/recordsStore'

export const Dashboard = () => {
  const { user } = useAuthStore()
  const { weightRecords, glucoseRecords, bloodPressureRecords } = useRecordsStore()
  const navigate = useNavigate()
  
  useEffect(() => {
    // TODO: Load initial data
  }, [])
  
  return (
    <DashboardLayout>
      <Typography variant="h4" gutterBottom>
        欢迎来到 VitaNote
      </Typography>
      <Typography variant="body1" color="textSecondary" gutterBottom>
        {user?.userName}，开始记录您的健康数据吧！
      </Typography>
      
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">体重记录</Typography>
              <Typography variant="body2" color="textSecondary">
                {weightRecords.length} 条记录
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">血糖记录</Typography>
              <Typography variant="body2" color="textSecondary">
                {glucoseRecords.length} 条记录
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">血压记录</Typography>
              <Typography variant="body2" color="textSecondary">
                {bloodPressureRecords.length} 条记录
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6">快速操作</Typography>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={6} sm={3}>
            <Card onClick={() => navigate('/records')} sx={{ cursor: 'pointer', textAlign: 'center', p: 2 }}>
              <CardContent>
                <Typography variant="h5">➕</Typography>
                <Typography variant="body2">添加记录</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card sx={{ cursor: 'pointer', textAlign: 'center', p: 2 }}>
              <CardContent>
                <Typography variant="h5">📷</Typography>
                <Typography variant="body2">拍照识别</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card onClick={() => navigate('/llm')} sx={{ cursor: 'pointer', textAlign: 'center', p: 2 }}>
              <CardContent>
                <Typography variant="h5">🤖</Typography>
                <Typography variant="body2">AI助手</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card sx={{ cursor: 'pointer', textAlign: 'center', p: 2 }}>
              <CardContent>
                <Typography variant="h5">📊</Typography>
                <Typography variant="body2">数据分析</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </DashboardLayout>
  )
}
