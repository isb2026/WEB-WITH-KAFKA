import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import CO2Icon from '@mui/icons-material/Co2';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import BoltIcon from '@mui/icons-material/Bolt';
import DeleteIcon from '@mui/icons-material/Delete';

// Mock data for KPI metrics
export const kpiData = {
  carbonEmissions: {
    title: 'Carbon Emissions',
    value: '75',
    unit: 'tons CO2e',
    change: -15.3,
    icon: CO2Icon,
    color: '#2196f3'
  },
  energyUsage: {
    title: 'Energy Usage',
    value: '680',
    unit: 'MWh',
    change: -8.5,
    icon: BoltIcon,
    color: '#ff9800'
  },
  waterConsumption: {
    title: 'Water Usage',
    value: '270',
    unit: 'kL',
    change: -5.2,
    icon: WaterDropIcon,
    color: '#00bcd4'
  },
  wasteManagement: {
    title: 'Waste Generated',
    value: '25',
    unit: 'tons',
    change: -12.4,
    icon: DeleteIcon,
    color: '#4caf50'
  }
};

interface KPICardProps {
  title: string;
  value: string;
  unit: string;
  change: number;
  icon: React.ElementType;
  color: string;
}

const KPICard: React.FC<KPICardProps> = ({ title, value, unit, change, icon: Icon, color }) => {
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
      
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
    </Paper>
  );
};

export const KPICards: React.FC = () => {
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
      {Object.entries(kpiData).map(([key, data]) => (
        <Box key={key}>
          <KPICard {...data} />
        </Box>
      ))}
    </Box>
  );
};

export default KPICards; 