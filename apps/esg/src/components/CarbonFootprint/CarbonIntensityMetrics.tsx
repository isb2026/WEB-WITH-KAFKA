import React from 'react';
import { Box, Paper, Typography, Chip, LinearProgress } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import SpeedIcon from '@mui/icons-material/Speed';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import InventoryIcon from '@mui/icons-material/Inventory';

interface IntensityMetric {
  name: string;
  current: number;
  target: number;
  previous: number;
  unit: string;
  trend: number; // percentage change
}

interface CarbonIntensityMetricsProps {
  revenueIntensity: IntensityMetric;
  productionIntensity: IntensityMetric;
  employeeIntensity: IntensityMetric;
  energyIntensity: IntensityMetric;
  industryAverage: number;
  industryBenchmark: number;
}

export const CarbonIntensityMetrics: React.FC<CarbonIntensityMetricsProps> = ({
  revenueIntensity,
  productionIntensity,
  employeeIntensity,
  energyIntensity,
  industryAverage,
  industryBenchmark
}) => {
  const intensityData = [
    {
      name: 'Revenue',
      current: revenueIntensity.current,
      target: revenueIntensity.target,
      industry: industryAverage,
      unit: revenueIntensity.unit
    },
    {
      name: 'Production',
      current: productionIntensity.current,
      target: productionIntensity.target,
      industry: industryAverage,
      unit: productionIntensity.unit
    },
    {
      name: 'Employee',
      current: employeeIntensity.current,
      target: employeeIntensity.target,
      industry: industryAverage,
      unit: employeeIntensity.unit
    },
    {
      name: 'Energy',
      current: energyIntensity.current,
      target: energyIntensity.target,
      industry: industryAverage,
      unit: energyIntensity.unit
    }
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            backgroundColor: 'white',
            border: '1px solid #ccc',
            borderRadius: 2,
            p: 2,
            boxShadow: 2
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
            {label}
          </Typography>
          {payload.map((entry: any, index: number) => (
            <Typography key={index} variant="body2" color="textSecondary">
              {entry.name}: {entry.value} {entry.payload.unit}
            </Typography>
          ))}
        </Box>
      );
    }
    return null;
  };

  const IntensityCard = ({ metric, icon: Icon }: { metric: IntensityMetric; icon: React.ElementType }) => {
    const isPositive = metric.trend < 0; // Negative trend is good for emissions
    const progress = (metric.current / metric.target) * 100;
    const isOnTrack = progress <= 100;

    return (
      <Box
        sx={{
          p: 2,
          borderRadius: 2,
          backgroundColor: isOnTrack ? '#e8f5e8' : '#ffebee',
          border: `1px solid ${isOnTrack ? '#4caf50' : '#f44336'}`,
          height: '100%'
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Icon sx={{ color: isOnTrack ? '#4caf50' : '#f44336', mr: 1 }} />
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
              {metric.name}
            </Typography>
          </Box>
          <Chip 
            label={isOnTrack ? 'On Track' : 'Exceeding'} 
            size="small" 
            color={isOnTrack ? 'success' : 'error'}
            variant="outlined"
          />
        </Box>

        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
          {metric.current}
          <Typography component="span" variant="body2" sx={{ ml: 0.5 }}>
            {metric.unit}
          </Typography>
        </Typography>

        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
          Target: {metric.target} {metric.unit}
        </Typography>

        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="caption" color="textSecondary">
              Progress
            </Typography>
            <Typography variant="caption" color="textSecondary">
              {Math.round(progress)}%
            </Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={Math.min(progress, 100)} 
            sx={{ 
              height: 6, 
              borderRadius: 3,
              backgroundColor: '#e0e0e0',
              '& .MuiLinearProgress-bar': {
                backgroundColor: isOnTrack ? '#4caf50' : '#f44336',
                borderRadius: 3
              }
            }} 
          />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {isPositive ? (
            <TrendingDownIcon sx={{ color: 'success.main', mr: 1, fontSize: 16 }} />
          ) : (
            <TrendingUpIcon sx={{ color: 'error.main', mr: 1, fontSize: 16 }} />
          )}
          <Typography
            variant="caption"
            color={isPositive ? 'success.main' : 'error.main'}
            sx={{ fontWeight: 'medium' }}
          >
            {Math.abs(metric.trend)}% vs previous period
          </Typography>
        </Box>
      </Box>
    );
  };

  return (
    <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h6" color="textSecondary" sx={{ mb: 1 }}>
            Carbon Intensity Metrics
          </Typography>
          <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', color: '#2e7d32' }}>
            {industryBenchmark}
            <Typography component="span" variant="h6" sx={{ ml: 1, fontWeight: 'normal', color: 'textSecondary' }}>
              Industry Benchmark
            </Typography>
          </Typography>
        </Box>
        <SpeedIcon sx={{ color: '#4caf50', fontSize: 32 }} />
      </Box>

      {/* Intensity Cards */}
      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: {
            xs: 'repeat(2, 1fr)',
            lg: 'repeat(4, 1fr)'
          },
          mb: 3
        }}
      >
        <IntensityCard metric={revenueIntensity} icon={AttachMoneyIcon} />
        <IntensityCard metric={productionIntensity} icon={InventoryIcon} />
        <IntensityCard metric={employeeIntensity} icon={SpeedIcon} />
        <IntensityCard metric={energyIntensity} icon={SpeedIcon} />
      </Box>

      {/* Comparison Chart */}
      <Box sx={{ height: 300 }}>
        <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 2 }}>
          Intensity Comparison vs Industry Average
        </Typography>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={intensityData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" stroke="#666" fontSize={12} />
            <YAxis stroke="#666" fontSize={12} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="current" fill="#4caf50" name="Current" />
            <Bar dataKey="target" fill="#2196f3" name="Target" />
            <Bar dataKey="industry" fill="#ff9800" name="Industry Avg" />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
}; 