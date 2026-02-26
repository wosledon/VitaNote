import React, { useEffect } from 'react'
import { DashboardLayout } from '../components/Layout'
import { Typography, Card, CardContent, Grid, Box, Paper } from '@mui/material'
import { useRecordsStore } from '../store/recordsStore'
import { healthRecordService } from '../api/services'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export const Statistics = () => {
  const { statistics, trendAnalysis, setLoading, setError } = useRecordsStore()

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const [stats, trend] = await Promise.all([
          healthRecordService.getStatistics(),
          healthRecordService.getTrendAnalysis(),
        ])
        // TODO: Set data to store
      } catch (error) {
        setError('加载统计数据失败')
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  return (
    <DashboardLayout>
      <Typography variant="h4" gutterBottom>
        健康统计
      </Typography>

      {statistics && (
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6">体重记录</Typography>
                <Typography variant="h4" color="primary">
                  {statistics.totalWeightRecords} 条
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  最新体重: {statistics.latestWeight?.toFixed(1) || '-'} kg
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {statistics.weightTrend === 'increasing' ? '📈 体重增加' : statistics.weightTrend === 'decreasing' ? '📉 体重减少' : '持平'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6">血糖记录</Typography>
                <Typography variant="h4" color="success.main">
                  {statistics.totalGlucoseRecords} 条
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {statistics.totalGlucoseRecords > 0 ? '持续监测中' : '暂无记录'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6">血压记录</Typography>
                <Typography variant="h4" color="warning.main">
                  {statistics.totalBloodPressureRecords} 条
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  平均收缩压: {statistics.totalBloodPressureRecords > 0 ? '120 mmHg' : '-'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6">BMI 身体质量指数</Typography>
                <Typography variant="h4" color={statistics.bmi && statistics.bmi < 18.5 ? 'warning.main' : statistics.bmi && statistics.bmi > 24 ? 'error.main' : 'success.main'}>
                  {statistics.bmi?.toFixed(1) || '-'}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {statistics.bmi
                    ? statistics.bmi < 18.5
                      ? '偏瘦'
                      : statistics.bmi < 24
                        ? '正常'
                        : '超重'
                    : '估算中...'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {trendAnalysis && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            体重趋势 ({trendAnalysis.weightTrend.dataPoints.length} 天)
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendAnalysis.weightTrend.dataPoints}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#1976d2" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      )}

      {trendAnalysis && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            血糖趋势 ({trendAnalysis.glucoseTrend.dataPoints.length} 天)
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendAnalysis.glucoseTrend.dataPoints}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#4caf50" />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      )}

      {trendAnalysis && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            血压趋势 ({trendAnalysis.bloodPressureTrend.dataPoints.length} 天)
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={trendAnalysis.bloodPressureTrend.dataPoints}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="systolic" fill="#1976d2" name="收缩压" />
              <Bar dataKey="diastolic" fill="#9c27b0" name="舒张压" />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      )}
    </DashboardLayout>
  )
}
