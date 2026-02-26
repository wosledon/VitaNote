import React, { useState } from 'react'
import { DashboardLayout } from '../components/Layout'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, Typography, Grid, Box, Button, TextField, MenuItem, IconButton } from '@mui/material'
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material'
import { useRecordsStore } from '../store/recordsStore'
import { foodRecordService } from '../api/services'
import type { FoodRecordRequest } from '../types/api'

export const FoodRecords = () => {
  const navigate = useNavigate()
  const { foodRecords, addFoodRecord, setLoading, setError } = useRecordsStore()
  const [showAddForm, setShowAddForm] = useState(false)

  const [newRecord, setNewRecord] = useState<FoodRecordRequest>({
    foodName: '',
    calories: 0,
    protein: 0,
    carbohydrates: 0,
    fat: 0,
    eatenAt: new Date().toISOString(),
    mealType: 'Breakfast',
    comment: '',
  })

  const handleAddRecord = async () => {
    try {
      setLoading(true)
      const response = await foodRecordService.addFoodRecord(newRecord)
      addFoodRecord({ ...newRecord, id: response.data, createdAt: new Date().toISOString() })
      setShowAddForm(false)
      setNewRecord({
        foodName: '',
        calories: 0,
        protein: 0,
        carbohydrates: 0,
        fat: 0,
        eatenAt: new Date().toISOString(),
        mealType: 'Breakfast',
        comment: '',
      })
    } catch (error) {
      setError('添加食物记录失败')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteRecord = async (id: string) => {
    try {
      setLoading(true)
      await foodRecordService.deleteFoodRecord(id)
      // TODO: Remove from store
    } catch (error) {
      setError('删除食物记录失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <Typography variant="h4" gutterBottom>
        饮食记录
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setShowAddForm(!showAddForm)}
        >
          添加食物记录
        </Button>
      </Box>

      {showAddForm && (
        <Card sx={{ mb: 3, p: 2 }}>
          <Typography variant="h6" gutterBottom>新增食物记录</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="食物名称"
                value={newRecord.foodName}
                onChange={(e) => setNewRecord({ ...newRecord, foodName: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                fullWidth
                label="热量 (kcal)"
                type="number"
                value={newRecord.calories}
                onChange={(e) => setNewRecord({ ...newRecord, calories: Number(e.target.value) })}
                required
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                fullWidth
                label="蛋白质 (g)"
                type="number"
                value={newRecord.protein}
                onChange={(e) => setNewRecord({ ...newRecord, protein: Number(e.target.value) })}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                fullWidth
                label="碳水 (g)"
                type="number"
                value={newRecord.carbohydrates}
                onChange={(e) => setNewRecord({ ...newRecord, carbohydrates: Number(e.target.value) })}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                fullWidth
                label="脂肪 (g)"
                type="number"
                value={newRecord.fat}
                onChange={(e) => setNewRecord({ ...newRecord, fat: Number(e.target.value) })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                select
                label="餐次"
                value={newRecord.mealType}
                onChange={(e) => setNewRecord({ ...newRecord, mealType: e.target.value })}
              >
                <MenuItem value="Breakfast">早餐</MenuItem>
                <MenuItem value="Lunch">午餐</MenuItem>
                <MenuItem value="Dinner">晚餐</MenuItem>
                <MenuItem value="Snack">加餐</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="备注"
                multiline
                rows={2}
                value={newRecord.comment}
                onChange={(e) => setNewRecord({ ...newRecord, comment: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" color="primary" onClick={handleAddRecord}>
                保存记录
              </Button>
              <Button variant="outlined" sx={{ ml: 2 }} onClick={() => setShowAddForm(false)}>
                取消
              </Button>
            </Grid>
          </Grid>
        </Card>
      )}

      <Grid container spacing={3}>
        {foodRecords.length === 0 ? (
          <Grid item xs={12}>
            <Card sx={{ textAlign: 'center', p: 4 }}>
              <Typography variant="body1" color="textSecondary">
                暂无饮食记录
              </Typography>
              <Button variant="contained" sx={{ mt: 2 }} onClick={() => setShowAddForm(true)}>
                添加第一条记录
              </Button>
            </Card>
          </Grid>
        ) : (
          foodRecords.map((record) => (
            <Grid item xs={12} sm={6} md={4} key={record.id}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6">{record.foodName}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {record.mealType} | {record.eatenAt.substring(0, 16)}
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 1 }}>
                    🔥 {record.calories} kcal
                  </Typography>
                  <Typography variant="body2">
                    💪 {record.protein}g 蛋白质 | 🍚 {record.carbohydrates}g 碳水 | 🧈 {record.fat}g 脂肪
                  </Typography>
                  {record.comment && (
                    <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                      📝 {record.comment}
                    </Typography>
                  )}
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDeleteRecord(record.id)}
                    sx={{ mt: 1 }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </DashboardLayout>
  )
}
