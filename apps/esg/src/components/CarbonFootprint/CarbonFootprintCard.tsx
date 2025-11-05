import React from 'react';
import { Box, Paper, Typography, Chip, LinearProgress } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import Co2Icon from '@mui/icons-material/Co2';

interface CarbonFootprintCardProps {
  currentEmissions: string;
  dailyTarget: string;
  monthlyTotal: string;
  yearToDate: string;
  trend: string;
  status: 'On Track' | 'Exceeding' | 'Below Target';
  progress: number; // percentage towards daily target
}

export const CarbonFootprintCard: React.FC<CarbonFootprintCardProps> = ({
  currentEmissions,
  dailyTarget,
  monthlyTotal,
  yearToDate,
  trend,
  status,
  progress
}) => {
  const isPositive = trend.includes('-');
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'On Track':
        return '#4caf50';
      case 'Below Target':
        return '#2196f3';
      case 'Exceeding':
        return '#f44336';
      default:
        return '#666';
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case 'On Track':
        return '#e8f5e8';
      case 'Below Target':
        return '#e3f2fd';
      case 'Exceeding':
        return '#ffebee';
      default:
        return '#f5f5f5';
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Box>
          <Typography variant="h6" color="textSecondary" sx={{ mb: 1 }}>
            Carbon Footprint
          </Typography>
        </Box>
        <Co2Icon sx={{ color: '#4caf50', fontSize: 32 }} />
      </Box>
      
      <Typography variant="h3" component="div" sx={{ mb: 1, fontWeight: 'bold', color: '#2e7d32' }}>
        {currentEmissions}
        <Typography component="span" variant="h6" sx={{ ml: 1, fontWeight: 'normal', color: 'textSecondary' }}>
          CO2e
        </Typography>
      </Typography>
      
      <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
        Daily Target: {dailyTarget} CO2e
      </Typography>

      {/* Progress Bar */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" color="textSecondary">
            Progress
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {progress}%
          </Typography>
        </Box>
        <LinearProgress 
          variant="determinate" 
          value={Math.min(progress, 100)} 
          sx={{ 
            height: 8, 
            borderRadius: 4,
            backgroundColor: '#e0e0e0',
            '& .MuiLinearProgress-bar': {
              backgroundColor: progress > 100 ? '#f44336' : '#4caf50',
              borderRadius: 4
            }
          }} 
        />
      </Box>

      {/* Trend and Status */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {isPositive ? (
            <TrendingDownIcon sx={{ color: 'success.main', mr: 1 }} />
          ) : (
            <TrendingUpIcon sx={{ color: 'error.main', mr: 1 }} />
          )}
          <Typography
            variant="body2"
            color={isPositive ? 'success.main' : 'error.main'}
            sx={{ fontWeight: 'medium' }}
          >
            {trend}
          </Typography>
        </Box>
        <Chip 
          label={status} 
          size="small" 
          sx={{ 
            backgroundColor: getStatusBgColor(status),
            color: getStatusColor(status),
            fontWeight: 'bold',
            border: `1px solid ${getStatusColor(status)}`
          }} 
        />
      </Box>

      {/* Additional Metrics */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 'auto' }}>
        <Box>
          <Typography variant="caption" color="textSecondary">
            Monthly Total
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
            {monthlyTotal} CO2e
          </Typography>
        </Box>
        <Box>
          <Typography variant="caption" color="textSecondary">
            Year to Date
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
            {yearToDate} CO2e
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
}; 