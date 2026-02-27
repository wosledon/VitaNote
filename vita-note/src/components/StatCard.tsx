import { Box, Typography, Card, CardContent } from '@mui/material';
import theme from '../theme/ThemeWrapper';

interface CardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  color?: 'default' | 'primary' | 'secondary' | 'error' | 'warning' | 'success';
  icon?: React.ReactNode;
}

export function StatCard({ title, value, subtitle, color = 'default', icon }: CardProps) {
  const colorMap = {
    default: theme.palette.info.main,
    primary: theme.palette.primary.main,
    secondary: theme.palette.secondary.main,
    error: theme.palette.error.main,
    warning: theme.palette.warning.main,
    success: theme.palette.success.main,
  };

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          {icon && <Box sx={{ mr: 1, color: colorMap[color] }}>{icon}</Box>}
          <Typography variant="subtitle2" color="text.secondary">
            {title}
          </Typography>
        </Box>
        <Typography variant="h4" component="div" color={colorMap[color]}>
          {value}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
