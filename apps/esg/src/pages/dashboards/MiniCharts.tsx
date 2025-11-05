import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import CO2Icon from '@mui/icons-material/Co2';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import BoltIcon from '@mui/icons-material/Bolt';
import DeleteIcon from '@mui/icons-material/Delete';

// Mock data for mini charts
const carbonData = [
  { month: 'Jan', value: 120 },
  { month: 'Feb', value: 115 },
  { month: 'Mar', value: 110 },
  { month: 'Apr', value: 105 },
  { month: 'May', value: 100 },
  { month: 'Jun', value: 95 },
  { month: 'Jul', value: 90 },
  { month: 'Aug', value: 85 },
  { month: 'Sep', value: 80 },
  { month: 'Oct', value: 75 },
  { month: 'Nov', value: 70 },
  { month: 'Dec', value: 65 }
];

const energyData = [
  { month: 'Jan', value: 850 },
  { month: 'Feb', value: 820 },
  { month: 'Mar', value: 800 },
  { month: 'Apr', value: 780 },
  { month: 'May', value: 760 },
  { month: 'Jun', value: 740 },
  { month: 'Jul', value: 720 },
  { month: 'Aug', value: 700 },
  { month: 'Sep', value: 680 },
  { month: 'Oct', value: 660 },
  { month: 'Nov', value: 640 },
  { month: 'Dec', value: 620 }
];

const waterData = [
  { month: 'Jan', value: 320 },
  { month: 'Feb', value: 310 },
  { month: 'Mar', value: 305 },
  { month: 'Apr', value: 295 },
  { month: 'May', value: 290 },
  { month: 'Jun', value: 285 },
  { month: 'Jul', value: 280 },
  { month: 'Aug', value: 275 },
  { month: 'Sep', value: 270 },
  { month: 'Oct', value: 265 },
  { month: 'Nov', value: 260 },
  { month: 'Dec', value: 255 }
];

const wasteData = [
  { month: 'Jan', value: 45 },
  { month: 'Feb', value: 42 },
  { month: 'Mar', value: 40 },
  { month: 'Apr', value: 38 },
  { month: 'May', value: 35 },
  { month: 'Jun', value: 33 },
  { month: 'Jul', value: 30 },
  { month: 'Aug', value: 28 },
  { month: 'Sep', value: 25 },
  { month: 'Oct', value: 23 },
  { month: 'Nov', value: 20 },
  { month: 'Dec', value: 18 }
];

// Enhanced KPI data with chart data
export const enhancedKpiData = {
  carbonEmissions: {
    title: 'Carbon Emissions',
    value: '75',
    unit: 'tons CO2e',
    change: -15.3,
    icon: CO2Icon,
    color: '#2196f3',
    chartData: carbonData,
    chartType: 'line' as const
  },
  energyUsage: {
    title: 'Energy Usage',
    value: '680',
    unit: 'MWh',
    change: -8.5,
    icon: BoltIcon,
    color: '#ff9800',
    chartData: energyData,
    chartType: 'area' as const
  },
  waterConsumption: {
    title: 'Water Usage',
    value: '270',
    unit: 'kL',
    change: -5.2,
    icon: WaterDropIcon,
    color: '#00bcd4',
    chartData: waterData,
    chartType: 'bar' as const
  },
  wasteManagement: {
    title: 'Waste Generated',
    value: '25',
    unit: 'tons',
    change: -12.4,
    icon: DeleteIcon,
    color: '#4caf50',
    chartData: wasteData,
    chartType: 'line' as const
  }
};

interface MiniChartProps {
  data: any[];
  type: 'line' | 'area' | 'bar';
  color: string;
  height?: number;
}

const MiniChart: React.FC<MiniChartProps> = ({ data, type, color, height = 60 }) => {
  const renderChart = () => {
    switch (type) {
      case 'line':
        return (
          <LineChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <Line
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 3, fill: color }}
            />
            <XAxis dataKey="month" hide />
            <YAxis hide />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '12px'
              }}
              formatter={(value: any) => [value, '']}
              labelFormatter={() => ''}
            />
          </LineChart>
        );
      case 'area':
        return (
          <AreaChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <Area
              type="monotone"
              dataKey="value"
              stroke={color}
              fill={color}
              fillOpacity={0.3}
              strokeWidth={2}
            />
            <XAxis dataKey="month" hide />
            <YAxis hide />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '12px'
              }}
              formatter={(value: any) => [value, '']}
              labelFormatter={() => ''}
            />
          </AreaChart>
        );
      case 'bar':
        return (
          <BarChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <Bar dataKey="value" fill={color} radius={[2, 2, 0, 0]} />
            <XAxis dataKey="month" hide />
            <YAxis hide />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '12px'
              }}
              formatter={(value: any) => [value, '']}
              labelFormatter={() => ''}
            />
          </BarChart>
        );
      default:
        return (
          <LineChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <Line
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 3, fill: color }}
            />
            <XAxis dataKey="month" hide />
            <YAxis hide />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '12px'
              }}
              formatter={(value: any) => [value, '']}
              labelFormatter={() => ''}
            />
          </LineChart>
        );
    }
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      {renderChart()}
    </ResponsiveContainer>
  );
};

interface EnhancedKPICardProps {
  title: string;
  value: string;
  unit: string;
  change: number;
  icon: React.ElementType;
  color: string;
  chartData: any[];
  chartType: 'line' | 'area' | 'bar';
}

const EnhancedKPICard: React.FC<EnhancedKPICardProps> = ({
  title,
  value,
  unit,
  change,
  icon: Icon,
  color,
  chartData,
  chartType
}) => {
  const isPositive = change > 0;
  
  return (
    <Paper 
      elevation={2} 
      sx={{ 
        p: 3,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Typography variant="h6" color="textSecondary">
          {title}
        </Typography>
        <Icon sx={{ color: color, fontSize: 24 }} />
      </Box>
      
      <Typography variant="h4" component="div" sx={{ mb: 1, fontWeight: 'bold' }}>
        {value}
        <Typography component="span" variant="body1" sx={{ ml: 1 }}>
          {unit}
        </Typography>
      </Typography>
      
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        {isPositive ? (
          <TrendingUpIcon sx={{ color: 'error.main', mr: 1 }} />
        ) : (
          <TrendingDownIcon sx={{ color: 'success.main', mr: 1 }} />
        )}
        <Typography
          variant="body2"
          color={isPositive ? 'error.main' : 'success.main'}
          sx={{ fontWeight: 'medium' }}
        >
          {Math.abs(change)}% from last month
        </Typography>
      </Box>
      
      <Box sx={{ flex: 1, minHeight: 60 }}>
        <MiniChart
          data={chartData}
          type={chartType}
          color={color}
          height={60}
        />
      </Box>
    </Paper>
  );
};

export const MiniCharts: React.FC = () => {
  return (
    <Box
      sx={{
        display: 'grid',
        gap: 3,
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(4, 1fr)'
        }
      }}
    >
      {Object.entries(enhancedKpiData).map(([key, data]) => (
        <Box key={key}>
          <EnhancedKPICard {...data} />
        </Box>
      ))}
    </Box>
  );
};

export default MiniCharts; 