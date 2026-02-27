import { useState, useEffect } from 'react';
import { Box, Typography, Button, Card, CardContent, TextField, FormControl, InputLabel, Select, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Alert, Grid, Fab } from '@mui/material';
import { BloodGlucoseRepository } from '../../services/repositories';
import { useAuthStore } from '../../store/authStore';
import { Layout } from '../../components/Layout';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

interface GlucoseEntry {
  id: string;
  userId: string;
  createdAt: string;
  value: number;
  measurementTime: number;
  measurementTimeExact?: string;
  notes?: string;
}

const timeLabels: Record<number, string> = {
  0: '空腹',
  1: '餐前',
  2: '餐后 1h',
  3: '餐后 2h',
  4: '睡前',
  5: '夜间',
  6: '随机'
};

export function GlucosePage() {
  const { user } = useAuthStore();
  const [entries, setEntries] = useState<GlucoseEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    value: '',
    measurementTime: 0 as any,
    measurementTimeExact: new Date().toISOString().slice(0, 16),
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

      const result = await BloodGlucoseRepository.getEntries(user!.id, today, tomorrow);
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
      value: '',
      measurementTime: 0,
      measurementTimeExact: new Date().toISOString().slice(0, 16),
      notes: ''
    });
  };

  const handleChange = (e: any) => {
    const name = e.target.name;
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'measurementTime' || name === 'value' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await BloodGlucoseRepository.create({
        userId: user!.id,
        value: Number(formData.value),
        measurementTime: formData.measurementTime,
        measurementTimeExact: formData.measurementTimeExact,
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
      await BloodGlucoseRepository.delete(id);
      await fetchEntries();
    } catch (err: any) {
      setErrorMsg('删除失败');
    }
  };

  const getGlucoseStatus = (value: number) => {
    if (value < 3.9) return { text: '偏低', color: 'warning' as const };
    if (value > 10) return { text: '偏高', color: 'error' as const };
    return { text: '正常', color: 'success' as const };
  };

  return (
    <Layout title="血糖监测">
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
          今日血糖
        </Typography>
        <Typography variant="body2" color="text.secondary">
          记录您的血糖数据
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
            添加记录
          </Button>
        </Box>
      ) : (
        <Grid container spacing={2}>
          {entries.map((entry) => {
            const status = getGlucoseStatus(entry.value);
            return (
              <Grid item xs={12} sm={6} md={4} key={entry.id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Typography variant="h4" color={status.color === 'error' ? 'error.main' : status.color === 'warning' ? 'warning.main' : 'success.main'} sx={{ fontWeight: 'bold' }}>
                            {entry.value}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            mmol/L
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {timeLabels[entry.measurementTime]}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(entry.createdAt).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                        </Typography>
                        {entry.notes && (
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                            {entry.notes}
                          </Typography>
                        )}
                      </Box>
                      <IconButton size="small" color="error" onClick={() => handleDelete(entry.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
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

      {/* 添加血糖记录对话框 */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <form onSubmit={handleSubmit}>
          <DialogTitle>添加血糖记录</DialogTitle>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  type="number"
                  name="value"
                  label="血糖值 (mmol/L)"
                  value={formData.value}
                  onChange={handleChange}
                  inputProps={{ step: '0.1' }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>测量时间</InputLabel>
                  <Select
                    name="measurementTime"
                    value={formData.measurementTime}
                    label="测量时间"
                    onChange={handleChange}
                  >
                    {Object.entries(timeLabels).map(([key, label]) => (
                      <MenuItem key={key} value={key}>{label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="datetime-local"
                  name="measurementTimeExact"
                  label="具体时间"
                  value={formData.measurementTimeExact}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
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
