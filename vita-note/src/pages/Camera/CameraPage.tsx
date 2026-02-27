import { useState } from 'react';
import { Box, Typography, Button, Paper, Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../../components/Layout';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import ImageIcon from '@mui/icons-material/Image';
import FlashOnIcon from '@mui/icons-material/FlashOn';

export function CameraPage() {
  const navigate = useNavigate();
  const [image, setImage] = useState<string | null>(null);

  const handleTakePhoto = async () => {
    alert('拍照功能需要调用设备摄像头，将在后续版本实现');
  };

  const handleSelectImage = async () => {
    alert('选择图片功能将在后续版本实现');
  };

  return (
    <Layout title="拍照识别">
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 200px)',
        p: 3,
      }}>
        <Paper 
          sx={{ 
            p: 4, 
            textAlign: 'center', 
            maxWidth: 400,
            width: '100%',
            borderRadius: 3,
            background: image ? 'transparent' : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            color: image ? 'inherit' : 'white',
          }}
        >
          {!image ? (
            <>
              <Avatar sx={{ 
                width: 80, 
                height: 80, 
                mx: 'auto', 
                mb: 2,
                bgcolor: 'rgba(255,255,255,0.2)',
                color: 'white',
              }}>
                <CameraAltIcon sx={{ fontSize: 40 }} />
              </Avatar>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                拍照识别食物
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9, mb: 3 }}>
                拍摄食物照片，AI 将自动识别并计算热量和营养成分
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                <Button 
                  variant="contained" 
                  size="large"
                  startIcon={<CameraAltIcon />}
                  onClick={handleTakePhoto}
                  sx={{ 
                    bgcolor: 'white', 
                    color: '#6366f1',
                    fontWeight: 700,
                    px: 3,
                  }}
                >
                  拍照
                </Button>
                <Button 
                  variant="outlined" 
                  size="large"
                  startIcon={<ImageIcon />}
                  onClick={handleSelectImage}
                  sx={{ 
                    borderColor: 'white', 
                    color: 'white',
                    fontWeight: 700,
                    px: 3,
                    '&:hover': {
                      borderColor: 'white',
                      bgcolor: 'rgba(255,255,255,0.1)',
                    },
                  }}
                >
                  相册
                </Button>
              </Box>
            </>
          ) : (
            <>
              <Box sx={{ 
                width: '100%', 
                height: 250, 
                bgcolor: '#e2e8f0', 
                borderRadius: 2, 
                mb: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <ImageIcon sx={{ fontSize: 60, color: '#94a3b8' }} />
              </Box>
              <Typography variant="body2" sx={{ mb: 2 }}>
                图片预览区域
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                <Button 
                  variant="contained" 
                  size="large"
                  onClick={() => setImage(null)}
                  sx={{ fontWeight: 700 }}
                >
                  重拍
                </Button>
                <Button 
                  variant="contained" 
                  size="large"
                  color="secondary"
                  startIcon={<FlashOnIcon />}
                  onClick={() => navigate('/foods')}
                  sx={{ fontWeight: 700 }}
                >
                  识别
                </Button>
              </Box>
            </>
          )}
        </Paper>

        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            支持识别常见食物，自动计算
          </Typography>
          <Typography variant="body2" color="text.secondary">
            热量、碳水化合物、蛋白质、脂肪
          </Typography>
        </Box>
      </Box>
    </Layout>
  );
}
