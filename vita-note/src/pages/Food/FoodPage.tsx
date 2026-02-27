import { useState, useEffect } from 'react';
import { Box, Typography, Button, Card, CardContent, TextField, FormControl, InputLabel, Select, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Alert, Grid, Fab } from '@mui/material';
import { FoodEntryRepository } from '../../services/repositories';
import { useAuthStore } from '../../store/authStore';
import { Layout } from '../../components/Layout';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

interface FoodEntry {
  id: string;
  userId: string;
  createdAt: string;
  mealType: number;
  mealTime: string;
  foodName: string;
  quantity: number;
  calories: number;
  carbohydrates: number;
  protein: number;
  fat: number;
  notes?: string;
}

const mealTypeLabels: Record<number, string> = {
  0: '早餐',
  1: '午餐',
  2: '晚餐',
  3: '加餐'
};

export function FoodPage() {
  const { user } = useAuthStore();
  const [entries, setEntries] = useState<FoodEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    mealType: 0 as any,
    mealTime: new Date().toISOString().slice(0, 16),
    foodName: '',
    quantity: 100,
    calories: 0,
    carbohydrates: 0,
    protein: 0,
    fat: 0,
    notes: ''
  });

  useEffect(() => {
    if (user?.id) {
      fetchEntries();
    }
  }, [user]);

  const fetchEntries = async () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const result = await FoodEntryRepository.getEntries(user!.id, today, tomorrow);
      setEntries(result.items);
      setLoading(false);
    } catch (err: any) {
      setErrorMsg('加载失败');
      setLoading(false);
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setFormData({
      mealType: 0,
      mealTime: new Date().toISOString().slice(0, 16),
      foodName: '',
      quantity: 100,
      calories: 0,
      carbohydrates: 0,
      protein: 0,
      fat: 0,
      notes: ''
    });
  };

  const handleChange = (e: any) => {
    const name = e.target.name;
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'mealType' ? Number(value) : name === 'quantity' || name === 'calories' || name === 'carbohydrates' || name === 'protein' || name === 'fat' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await FoodEntryRepository.create({
        userId: user!.id,
        mealType: formData.mealType,
        mealTime: formData.mealTime,
        foodName: formData.foodName,
        quantity: formData.quantity,
        calories: formData.calories,
        carbohydrates: formData.carbohydrates,
        protein: formData.protein,
        fat: formData.fat,
        notes: formData.notes
      });
      await fetchEntries();
      handleClose();
    } catch (err: any) {
      setErrorMsg('添加失败');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await FoodEntryRepository.delete(id);
      await fetchEntries();
    } catch (err: any) {
      setErrorMsg('删除失败');
    }
  };

  const formatTime = (time: string) => {
    return new Date(time).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Layout title="饮食记录">
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
          今日饮食
        </Typography>
        <Typography variant="body2" color="text.secondary">
          记录您今天的每一餐
        </Typography>
      </Box>

      {errorMsg && <Alert severity="error" sx={{ mb: 2 }}>{errorMsg}</Alert>}

      {loading ? (
        <Typography align="center">加载中...</Typography>
      ) : entries.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="body1" color="text.secondary" mb={2}>
            今天还没有记录
          </Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpen}>
            添加第一餐
          </Button>
        </Box>
      ) : (
        <Grid container spacing={2}>
          {Object.entries(mealTypeLabels).map(([type, label]) => {
            const mealEntries = entries.filter(e => e.mealType === Number(type));
            if (mealEntries.length === 0) return null;
            return (
              <Grid item xs={12} key={type}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1, color: 'primary.main' }}>
                  {label}
                </Typography>
                {mealEntries.map((entry) => (
                  <Card key={entry.id} sx={{ mb: 1 }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {entry.foodName}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {formatTime(entry.createdAt)} | {entry.quantity}g
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1, fontSize: '0.75rem', mt: 0.5, flexWrap: 'wrap' }}>
                            <span>⚡ {entry.calories}kcal</span>
                            <span>碳水：{entry.carbohydrates}g</span>
                            <span>蛋白质：{entry.protein}g</span>
                            <span>脂肪：{entry.fat}g</span>
                          </Box>
                        </Box>
                        <IconButton size="small" color="error" onClick={() => handleDelete(entry.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Grid>
            );
          })}
        </Grid>
      )}

      <Fab
        color="primary"
        onClick={handleOpen}
        sx={{ position: 'fixed', bottom: 80, right: 16 }}
      >
        <AddIcon />
      </Fab>

      {/* 添加饮食对话框 */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <form onSubmit={handleSubmit}>
          <DialogTitle>添加饮食记录</DialogTitle>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>餐次</InputLabel>
                  <Select
                    name="mealType"
                    value={formData.mealType}
                    label="餐次"
                    onChange={handleChange}
                  >
                    {Object.entries(mealTypeLabels).map(([key, label]) => (
                      <MenuItem key={key} value={key}>{label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  type="datetime-local"
                  name="mealTime"
                  label="用餐时间"
                  value={formData.mealTime}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  name="foodName"
                  label="食物名称"
                  value={formData.foodName}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  required
                  type="number"
                  name="quantity"
                  label="份量 (g)"
                  value={formData.quantity}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  required
                  type="number"
                  name="calories"
                  label="热量 (kcal)"
                  value={formData.calories}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  type="number"
                  name="carbohydrates"
                  label="碳水 (g)"
                  value={formData.carbohydrates}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  type="number"
                  name="protein"
                  label="蛋白质 (g)"
                  value={formData.protein}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  type="number"
                  name="fat"
                  label="脂肪 (g)"
                  value={formData.fat}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="notes"
                  label="备注"
                  value={formData.notes}
                  onChange={handleChange}
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
