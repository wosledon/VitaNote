import React from 'react'
import { DashboardLayout } from '../components/Layout'
import {
  Card,
  CardContent,
  Typography,
  Switch,
  FormControlLabel,
  Box,
} from '@mui/material'

export const Settings = () => {
  const [notifications, setNotifications] = React.useState(true)
  const [darkMode, setDarkMode] = React.useState(false)
  const [autoSync, setAutoSync] = React.useState(true)
  
  return (
    <DashboardLayout>
      <Typography variant="h4" gutterBottom>
        设置
      </Typography>
      
      <Box sx={{ mt: 3 }}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              通知
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={notifications}
                  onChange={(e) => setNotifications(e.target.checked)}
                />
              }
              label="启用通知"
            />
          </CardContent>
        </Card>
        
        <Card sx={{ mt: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              主题
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={darkMode}
                  onChange={(e) => setDarkMode(e.target.checked)}
                />
              }
              label="深色模式"
            />
          </CardContent>
        </Card>
        
        <Card sx={{ mt: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              同步设置
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={autoSync}
                  onChange={(e) => setAutoSync(e.target.checked)}
                />
              }
              label="自动同步到云端"
            />
          </CardContent>
        </Card>
        
        <Card sx={{ mt: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              数据管理
            </Typography>
            <Typography variant="body2" color="textSecondary">
              账户创建时间: 2024年1月1日
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </DashboardLayout>
  )
}
