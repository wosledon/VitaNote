import React, { useState } from 'react'
import { DashboardLayout } from '../components/Layout'
import {
  Card,
  CardContent,
  Typography,
  Tab,
  Tabs,
  Button,
  TextField,
  MenuItem,
  Grid,
  Box,
} from '@mui/material'
import { useRecordsStore } from '../store/recordsStore'
import { useAuthStore } from '../store/authStore'
import apiClient from '../api/client'
import type {
  WeightRecordRequest,
  GlucoseRecordRequest,
  BloodPressureRecordRequest,
} from '../types/api'
import dayjs from 'dayjs'

enum TabValue {
  Weight = 0,
  Glucose = 1,
  BloodPressure = 2,
}

export const Records = () => {
  const { user } = useAuthStore()
  const { weightRecords, glucoseRecords, bloodPressureRecords, setLoading } = useRecordsStore()
  const [tabValue, setTabValue] = useState<TabValue>(TabValue.Weight)
  const [showForm, setShowForm] = useState(false)
  
  // Form states
  const [weight, setWeight] = useState('')
  const [glucoseLevel, setGlucoseLevel] = useState('')
  const [systolic, setSystolic] = useState('')
  const [diastolic, setDiastolic] = useState('')
  const [heartRate, setHeartRate] = useState('')
  
  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: TabValue) => {
    setTabValue(newValue)
  }
  
  const handleAddRecord = async () => {
    setLoading(true)
    try {
      const userId = user?.id || ''
      
      if (tabValue === TabValue.Weight) {
        const request: WeightRecordRequest = {
          weight: parseFloat(weight),
        }
        await apiClient.post('/health-records/weight', request)
      } else if (tabValue === TabValue.Glucose) {
        const request: GlucoseRecordRequest = {
          glucoseLevel: parseFloat(glucoseLevel),
          type: 1, // Fasting
        }
        await apiClient.post('/health-records/glucose', request)
      } else if (tabValue === TabValue.BloodPressure) {
        const request: BloodPressureRecordRequest = {
          systolic: parseInt(systolic),
          diastolic: parseInt(diastolic),
          heartRate: parseInt(heartRate),
        }
        await apiClient.post('/health-records/blood-pressure', request)
      }
      
      setShowForm(false)
      // Reset form
      setWeight('')
      setGlucoseLevel('')
      setSystolic('')
      setDiastolic('')
      setHeartRate('')
    } catch (error) {
      console.error('Failed to add record', error)
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <DashboardLayout>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">健康记录</Typography>
        <Button variant="contained" onClick={() => setShowForm(true)}>
          {showForm ? '取消' : '添加记录'}
        </Button>
      </Box>
      
      <Tabs value={tabValue} onChange={handleTabChange} sx={{ mt: 2 }}>
        <Tab label="体重" value={TabValue.Weight} />
        <Tab label="血糖" value={TabValue.Glucose} />
        <Tab label="血压" value={TabValue.BloodPressure} />
      </Tabs>
      
      {showForm && (
        <Card sx={{ mt: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              添加{tabValue === TabValue.Weight ? '体重' : tabValue === TabValue.Glucose ? '血糖' : '血压'}记录
            </Typography>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              {tabValue === TabValue.Weight && (
                <Grid item xs={12}>
                  <TextField
                    label="体重 (kg)"
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    fullWidth
                  />
                </Grid>
              )}
              
              {tabValue === TabValue.Glucose && (
                <Grid item xs={12}>
                  <TextField
                    label="血糖 (mmol/L)"
                    type="number"
                    value={glucoseLevel}
                    onChange={(e) => setGlucoseLevel(e.target.value)}
                    fullWidth
                  />
                </Grid>
              )}
              
              {tabValue === TabValue.BloodPressure && (
                <>
                  <Grid item xs={4}>
                    <TextField
                      label="收缩压"
                      type="number"
                      value={systolic}
                      onChange={(e) => setSystolic(e.target.value)}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      label="舒张压"
                      type="number"
                      value={diastolic}
                      onChange={(e) => setDiastolic(e.target.value)}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      label="心率"
                      type="number"
                      value={heartRate}
                      onChange={(e) => setHeartRate(e.target.value)}
                      fullWidth
                    />
                  </Grid>
                </>
              )}
            </Grid>
            
            <Button variant="contained" onClick={handleAddRecord} sx={{ mt: 2 }}>
              保存记录
            </Button>
          </CardContent>
        </Card>
      )}
      
      <Box sx={{ mt: 3 }}>
        <Typography variant="h6">最近记录</Typography>
        {tabValue === TabValue.Weight && weightRecords.length === 0 && (
          <Typography variant="body2" color="textSecondary">
            暂无体重记录
          </Typography>
        )}
        {tabValue === TabValue.Glucose && glucoseRecords.length === 0 && (
          <Typography variant="body2" color="textSecondary">
            暂无血糖记录
          </Typography>
        )}
        {tabValue === TabValue.BloodPressure && bloodPressureRecords.length === 0 && (
          <Typography variant="body2" color="textSecondary">
            暂无血压记录
          </Typography>
        )}
      </Box>
    </DashboardLayout>
  )
}
