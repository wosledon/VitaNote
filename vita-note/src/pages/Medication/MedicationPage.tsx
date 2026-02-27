import { useState, useEffect } from 'react';
import { Box, Typography, Button, Card, CardContent, TextField, FormControl, InputLabel, Select, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Alert, Grid, Fab, Chip } from '@mui/material';
import { MedicationRepository } from '../../services/repositories';
import { useAuthStore } from '../../store/authStore';
import { Layout } from '../../components/Layout';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface MedicationEntry {
  id: string;
  userId: string;
  createdAt: string;
  drugName: string;
  type: number;
  dose: number;
  unit: string;
  timing: number;
  scheduledTime: string;
  isTaken: boolean;
  notes?: string;
}

const typeLabels: Record<number, string> = {
  0: '口服药',
  1: '胰岛素',
  2: '其他'
};

const timingLabels: Record<number, string> = {
  0: '晨起',
  1: '早餐前',
  2: '早餐后',
  3: '午餐前',
  4: '午餐后',
  5: '晚餐前',
  6: '晚餐后',
  7: '睡前'
};

export function MedicationPage() {
  const { user } = useAuthStore();
  const [entries, setEntries] = useState<MedicationEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    drugName: '',
    type: 0 as any,
    dose: '',
    unit: 'IU',
    timing: 1 as any,
    scheduledTime: new Date().toISOString().slice(0, 16),
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

      const result = await MedicationRepository.getEntries(user!.id, today, tomorrow);
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
      drugName: '',
      type: 0,
      dose: '',
      unit: 'IU',
      timing: 1,
      scheduledTime: new Date().toISOString().slice(0, 16),
      notes: ''
    });
  };

  const handleChange = (e: any) => {
    const name = e.target.name;
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'type' || name === 'timing' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await MedicationRepository.create({
        userId: user!.id,
        drugName: formData.drugName,
        type: formData.type,
        dose: Number(formData.dose) || 0,
        unit: formData.unit,
        timing: formData.timing,
        scheduledTime: formData.scheduledTime,
        isTaken: false,
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
      await MedicationRepository.delete(id);
      await fetchEntries();
    } catch (err: any) {
      setErrorMsg('删除失败');
    }
  };

  const handleMarkTaken = async (id: string) => {
    try {
      await MedicationRepository.markTaken(id, new Date());
      await fetchEntries();
    } catch (err: any) {
      setErrorMsg('操作失败');
    }
  };

  return (
    <Layout title="用药管理">
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
          今日用药
        </Typography>
        <Typography variant="body2" color="text.secondary">
          按时用药，保持健康
        </Typography>
      </Box>

      {errorMsg && <Alert severity="error" sx={{ mb: 2 }}>{errorMsg}</Alert>}

      {loading ? (
        <Typography align="center">加载中...</Typography>
      ) : entries.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="body1" color="text.secondary" mb={2}>
            今天还没有用药记录
          </Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpen}>
            添加用药
          </Button>
        </Box>
      ) : (
        <Grid container spacing={2}>
          {entries.map((entry) => (
            <Grid item xs={12} sm={6} md={4} key={entry.id}>
              <Card sx={{ bgcolor: entry.isTaken ? 'success.light' : 'background.paper' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                        {entry.drugName}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 0.5, mb: 1, flexWrap: 'wrap' }}>
                        <Chip label={typeLabels[entry.type]} size="small" />
                        <Chip label={timingLabels[entry.timing]} size="small" />
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        剂量：{entry.dose} {entry.unit}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        计划：{new Date(entry.scheduledTime).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                      </Typography>
                      {entry.isTaken && (
                        <Typography variant="caption" color="success.dark" sx={{ display: 'block', mt: 0.5 }}>
                          ✓ 已服用
                        </Typography>
                      )}
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      {!entry.isTaken && (
                        <IconButton size="small" color="success" onClick={() => handleMarkTaken(entry.id)}>
                          <CheckCircleIcon />
                        </IconButton>
                      )}
                      <IconButton size="small" color="error" onClick={() => handleDelete(entry.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Fab
        color="primary"
        onClick={handleOpen}
        sx={{ position: 'fixed', bottom: 80, right: 16 }}
      >
        <AddIcon />
      </Fab>

      {/* 添加用药对话框 */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <form onSubmit={handleSubmit}>
          <DialogTitle>添加用药记录</DialogTitle>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  name="drugName"
                  label="药品名称"
                  value={formData.drugName}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>类型</InputLabel>
                  <Select
                    name="type"
                    value={formData.type}
                    label="类型"
                    onChange={handleChange}
                  >
                    {Object.entries(typeLabels).map(([key, label]) => (
                      <MenuItem key={key} value={key}>{label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>用药时间</InputLabel>
                  <Select
                    name="timing"
                    value={formData.timing}
                    label="用药时间"
                    onChange={handleChange}
                  >
                    {Object.entries(timingLabels).map(([key, label]) => (
                      <MenuItem key={key} value={key}>{label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  required
                  type="number"
                  name="dose"
                  label="剂量"
                  value={formData.dose}
                  onChange={handleChange}
                  inputProps={{ step: '0.1' }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  name="unit"
                  label="单位"
                  value={formData.unit}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="datetime-local"
                  name="scheduledTime"
                  label="计划时间"
                  value={formData.scheduledTime}
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
