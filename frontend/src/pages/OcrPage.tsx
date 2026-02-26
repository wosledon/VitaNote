import React, { useState, useRef } from 'react'
import { DashboardLayout } from '../components/Layout'
import { Typography, Button, Card, CardContent, Grid, Box, TextField, MenuItem } from '@mui/material'
import { CameraAlt as CameraIcon, Photo as PhotoIcon, Upload as UploadIcon } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useRecordsStore } from '../store/recordsStore'
import { ocrService } from '../api/services'
import type { OCRRequest, OCRResponse } from '../types/api'

export const OcrPage = () => {
  const navigate = useNavigate()
  const { setLoading, setError } = useRecordsStore()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [ocrType, setOcrType] = useState('weight') // weight, food, glucose, blood-pressure
  const [ocrResult, setOcrResult] = useState<OCRResponse | null>(null)
  const [manualValue, setManualValue] = useState('')
  const [manualUnit, setManualUnit] = useState('kg')

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      processFile(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file) {
      processFile(file)
    }
  }

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('请选择图片文件')
      return
    }

    setSelectedImage(file)
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleUseCamera = async () => {
    try {
      // 检测是否支持摄像头
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      // TODO: 实现相机捕获
      // For now, redirect to mobile app
      navigate('/records')
    } catch (error) {
      setError('无法访问摄像头')
    }
  }

  const handleOCR = async () => {
    if (!selectedImage) {
      setError('请先选择图片')
      return
    }

    try {
      setLoading(true)
      const base64Image = await convertFileToBase64(selectedImage)
      const request: OCRRequest = {
        base64Image,
        type: ocrType === 'weight' ? 2 : ocrType === 'food' ? 1 : 3, // Get correct enum value
      }
      const response = await ocrService.extractText(request)
      setOcrResult(response.data)
    } catch (error) {
      setError('OCR识别失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  const handleSaveManualValue = () => {
    // TODO: Save the manually entered value
    alert(`保存识别结果: ${manualValue} ${manualUnit}`)
    resetForm()
  }

  const resetForm = () => {
    setSelectedImage(null)
    setPreviewUrl(null)
    setOcrResult(null)
    setManualValue('')
  }

  return (
    <DashboardLayout>
      <Typography variant="h4" gutterBottom>
        拍照识别
      </Typography>

      <Grid container spacing={3}>
        {/* Left side - Image upload */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                上传图片
              </Typography>

              {/* Camera button */}
              <Button
                variant="outlined"
                startIcon={<CameraIcon />}
                onClick={handleUseCamera}
                sx={{ mb: 2 }}
                fullWidth
              >
                使用相机拍照
              </Button>

              {/* Upload area */}
              <Box
                sx={{
                 mt: 2,
                  border: '2px dashed #ccc',
                  borderRadius: 2,
                  p: 4,
                  textAlign: 'center',
                  backgroundColor: previewUrl ? '#f5f5f5' : 'transparent',
                  cursor: 'pointer',
                }}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept="image/*"
                  style={{ display: 'none' }}
                />
                {previewUrl ? (
                  <img src={previewUrl} alt="Preview" style={{ maxWidth: '100%', maxHeight: 300, borderRadius: 8 }} />
                ) : (
                  <>
                    <PhotoIcon fontSize="large" color="action" />
                    <Typography variant="body2" color="textSecondary">
                      点击或拖拽图片到此处
                    </Typography>
                  </>
                )}
              </Box>

              {/* OCR type selector */}
              <TextField
                select
                label="识别类型"
                value={ocrType}
                onChange={(e) => setOcrType(e.target.value)}
                fullWidth
                sx={{ mt: 2 }}
              >
                <MenuItem value="weight">体重秤识别 (kg)</MenuItem>
                <MenuItem value="food">食物识别 (卡路里)</MenuItem>
                <MenuItem value="glucose">血糖仪识别 (mmol/L)</MenuItem>
                <MenuItem value="blood-pressure">血压计识别 (mmHg)</MenuItem>
              </TextField>

              {/* OCR button */}
              <Button
                variant="contained"
                color="primary"
                startIcon={<UploadIcon />}
                onClick={handleOCR}
                disabled={!previewUrl}
                fullWidth
                sx={{ mt: 2 }}
              >
                开始识别
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Right side - OCR Result */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                识别结果
              </Typography>

              {ocrResult ? (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2">
                    <strong>识别文本:</strong> {ocrResult.text}
                  </Typography>
                  {ocrResult.entities && ocrResult.entities.length > 0 && (
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="body2" color="textSecondary">
                        识别实体:
                      </Typography>
                      {ocrResult.entities.map((entity, index) => (
                        <Typography key={index} variant="body2">
                          • {entity.type}: {entity.value} (置信度: {entity.confidence * 100}%)
                        </Typography>
                      ))}
                    </Box>
                  )}
                </Box>
              ) : (
                <Typography variant="body2" color="textSecondary">
                  识别结果将显示在这里
                </Typography>
              )}

              {ocrResult && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="body2" gutterBottom>
                    请确认识别结果：
                  </Typography>
                  <TextField
                    label="手动输入值"
                    value={manualValue}
                    onChange={(e) => setManualValue(e.target.value)}
                    fullWidth
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    select
                    label="单位"
                    value={manualUnit}
                    onChange={(e) => setManualUnit(e.target.value)}
                    fullWidth
                  >
                    <MenuItem value="kg">kg (体重)</MenuItem>
                    <MenuItem value="mmol/L">mmol/L (血糖)</MenuItem>
                    <MenuItem value="mmHg">mmHg (血压)</MenuItem>
                    <MenuItem value="kcal">kcal (卡路里)</MenuItem>
                  </TextField>
                  <Button
                    variant="contained"
                    color="success"
                    sx={{ mt: 2, width: '100%' }}
                    onClick={handleSaveManualValue}
                  >
                    保存记录
                  </Button>
                  <Button
                    variant="outlined"
                    sx={{ mt: 1, width: '100%' }}
                    onClick={resetForm}
                  >
                    重新识别
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </DashboardLayout>
  )
}
