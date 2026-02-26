import React, { useState, useRef } from 'react'
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Alert,
  Tabs,
  Tab,
  Paper,
  CircularProgress,
  Chip,
  Fade,
} from '@mui/material'
import CameraAltIcon from '@mui/icons-material/CameraAlt'
import UploadIcon from '@mui/icons-material/Upload'
import RestaurantIcon from '@mui/icons-material/Restaurant'
import MedicalServicesIcon from '@mui/icons-material/MedicalServices'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { ocrService } from '../api/services'

enum OcrTab {
  Food = 0,
  Health = 1,
}

export const OcrPage = () => {
  const [tabValue, setTabValue] = useState<OcrTab>(OcrTab.Food)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const handleTabChange = (_: React.ChangeEvent<{}>, newValue: OcrTab) => {
    setTabValue(newValue)
    setResult(null)
    setPreviewUrl(null)
    setError(null)
  }
  
  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    
    const reader = new FileReader()
    reader.onload = (e) => setPreviewUrl(e.target?.result as string)
    reader.readAsDataURL(file)
    
    setLoading(true)
    setError(null)
    setResult(null)
    
    try {
      const uploadRes = await ocrService.uploadImage(file)
      const imageUrl = uploadRes.data
      
      if (tabValue === OcrTab.Food) {
        const detectRes = await ocrService.detectFood(imageUrl)
        setResult(detectRes.data)
      } else {
        const detectRes = await ocrService.detectHealthData(imageUrl)
        setResult(detectRes.data)
      }
    } catch (err: any) {
      console.error('OCR识别失败:', err)
      setError(err.response?.data?.message || '识别失败，请重试')
    } finally {
      setLoading(false)
    }
  }
  
  const handleCameraClick = () => {
    fileInputRef.current?.click()
  }
  
  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
        拍照识别
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        拍照或上传图片，AI 自动识别食物营养或健康数据
      </Typography>
      
      <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab icon={<RestaurantIcon />} label="食物识别" iconPosition="start" />
        <Tab icon={<MedicalServicesIcon />} label="健康数据识别" iconPosition="start" />
      </Tabs>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      
      {/* 上传区域 */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <input
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            ref={fileInputRef}
            onChange={handleFileSelect}
          />
          
          {previewUrl ? (
            <Fade in>
              <Box sx={{ textAlign: 'center' }}>
                <Box
                  component="img"
                  src={previewUrl}
                  alt="预览"
                  sx={{
                    maxWidth: '100%',
                    maxHeight: 400,
                    borderRadius: 3,
                    boxShadow: 2,
                  }}
                />
                {loading && (
                  <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <CircularProgress size={40} />
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      AI 正在分析图片...
                    </Typography>
                  </Box>
                )}
              </Box>
            </Fade>
          ) : (
            <Box
              onClick={handleCameraClick}
              sx={{
                border: '2px dashed',
                borderColor: 'primary.light',
                borderRadius: 4,
                p: 6,
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s',
                '&:hover': {
                  borderColor: 'primary.main',
                  bgcolor: 'primary.light',
                  opacity: 0.1,
                },
              }}
            >
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  bgcolor: 'primary.light',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 2,
                }}
              >
                <CameraAltIcon sx={{ fontSize: 40, color: 'primary.main' }} />
              </Box>
              <Typography variant="h6" gutterBottom>
                {tabValue === OcrTab.Food ? '拍照识别食物' : '拍照识别健康数据'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                点击上传图片或拖拽图片到此处
              </Typography>
              <Button variant="outlined" sx={{ mt: 2 }} startIcon={<UploadIcon />}>
                选择图片
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>
      
      {/* 识别结果 */}
      {result && (
        <Fade in>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <CheckCircleIcon color="success" />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  识别结果
                </Typography>
              </Box>
              
              <Paper variant="outlined" sx={{ p: 3, bgcolor: 'grey.50', borderRadius: 2 }}>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>
                  {result}
                </Typography>
              </Paper>
              
              <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                <Button variant="contained" startIcon={<CheckCircleIcon />}>
                  {tabValue === OcrTab.Food ? '添加到饮食记录' : '添加到健康记录'}
                </Button>
                <Button variant="outlined" onClick={() => { setPreviewUrl(null); setResult(null); }}>
                  重新识别
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Fade>
      )}
      
      {/* 使用说明 */}
      <Card sx={{ mt: 3, bgcolor: 'info.light' }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            💡 使用提示
          </Typography>
          {tabValue === OcrTab.Food ? (
            <Box component="ul" sx={{ pl: 2, m: 0 }}>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                拍摄食物照片，AI 会自动识别食物种类和估算营养成分
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                尽量拍摄清晰、光线充足的照片，包含完整的食物
              </Typography>
              <Typography component="li" variant="body2">
                支持识别中餐、西餐、零食、饮料等各类食物
              </Typography>
            </Box>
          ) : (
            <Box component="ul" sx={{ pl: 2, m: 0 }}>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                拍摄血压计、血糖仪等健康设备的屏幕
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                确保数字清晰可见，避免反光和模糊
              </Typography>
              <Typography component="li" variant="body2">
                支持识别大多数品牌的电子健康监测设备
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  )
}
