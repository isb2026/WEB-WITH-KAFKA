import React from 'react';
import { Box, Paper, Typography, Chip, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

interface HistoricalData {
  date: string;
  emissions: number;
  target: number;
  scope1: number;
  scope2: number;
  scope3: number;
}

interface HistoricalComparisonProps {
  data: HistoricalData[];
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  onPeriodChange: (period: 'daily' | 'weekly' | 'monthly' | 'yearly') => void;
  totalReduction: string;
  reductionPercentage: number;
  comparisonPeriod: string;
}

export const HistoricalComparison: React.FC<HistoricalComparisonProps> = ({
  data,
  period,
  onPeriodChange,
  totalReduction,
  reductionPercentage,
  comparisonPeriod
}) => {
  const isPositive = reductionPercentage > 0;

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
              {entry.name}: {entry.value} CO2e
            </Typography>
          ))}
        </Box>
      );
    }
    return null;
  };

  return (
    <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h6" color="textSecondary" sx={{ mb: 1 }}>
            Historical Comparison
          </Typography>
          <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', color: '#2e7d32' }}>
            {totalReduction}
            <Typography component="span" variant="h6" sx={{ ml: 1, fontWeight: 'normal', color: 'textSecondary' }}>
              CO2e Reduced
            </Typography>
          </Typography>
        </Box>
        <CalendarTodayIcon sx={{ color: '#4caf50', fontSize: 32 }} />
      </Box>

      {/* Reduction Summary */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {isPositive ? (
            <TrendingDownIcon sx={{ color: 'success.main', mr: 1 }} />
          ) : (
            <TrendingUpIcon sx={{ color: 'error.main', mr: 1 }} />
          )}
          <Typography
            variant="body1"
            color={isPositive ? 'success.main' : 'error.main'}
            sx={{ fontWeight: 'medium' }}
          >
            {Math.abs(reductionPercentage)}% {isPositive ? 'reduction' : 'increase'} vs {comparisonPeriod}
          </Typography>
        </Box>
        <Chip 
          label={isPositive ? 'On Track' : 'Exceeding'} 
          size="small" 
          color={isPositive ? 'success' : 'error'}
          variant="outlined"
        />
      </Box>

      {/* Period Selector */}
      <Box sx={{ mb: 3 }}>
        <FormControl fullWidth size="small">
          <InputLabel>Time Period</InputLabel>
          <Select
            value={period}
            label="Time Period"
            onChange={(e) => onPeriodChange(e.target.value as 'daily' | 'weekly' | 'monthly' | 'yearly')}
          >
            <MenuItem value="daily">Daily</MenuItem>
            <MenuItem value="weekly">Weekly</MenuItem>
            <MenuItem value="monthly">Monthly</MenuItem>
            <MenuItem value="yearly">Yearly</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Chart */}
      <Box sx={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="date" 
              stroke="#666" 
              fontSize={12}
              tick={{ fontSize: 11 }}
            />
            <YAxis 
              stroke="#666" 
              fontSize={12}
              tick={{ fontSize: 11 }}
              label={{ value: 'CO2e (tons)', angle: -90, position: 'insideLeft', fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Area
              type="monotone"
              dataKey="target"
              stackId="1"
              stroke="#e0e0e0"
              fill="#e0e0e0"
              fillOpacity={0.3}
              name="Target"
              strokeDasharray="5 5"
            />
            <Area
              type="monotone"
              dataKey="emissions"
              stackId="2"
              stroke="#4caf50"
              fill="#4caf50"
              fillOpacity={0.6}
              name="Actual Emissions"
            />
          </AreaChart>
        </ResponsiveContainer>
      </Box>

      {/* Scope Breakdown */}
      <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 2 }}>
          Emissions by Scope
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: {
              xs: 'repeat(3, 1fr)',
              sm: 'repeat(3, 1fr)'
            }
          }}
        >
          <Box sx={{ textAlign: 'center', p: 1, borderRadius: 1, backgroundColor: '#e3f2fd' }}>
            <Typography variant="caption" color="textSecondary" sx={{ display: 'block' }}>
              Scope 1
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
              {data[data.length - 1]?.scope1 || 0} CO2e
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center', p: 1, borderRadius: 1, backgroundColor: '#e8f5e8' }}>
            <Typography variant="caption" color="textSecondary" sx={{ display: 'block' }}>
              Scope 2
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#2e7d32' }}>
              {data[data.length - 1]?.scope2 || 0} CO2e
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center', p: 1, borderRadius: 1, backgroundColor: '#fff3e0' }}>
            <Typography variant="caption" color="textSecondary" sx={{ display: 'block' }}>
              Scope 3
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#f57c00' }}>
              {data[data.length - 1]?.scope3 || 0} CO2e
            </Typography>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
}; 