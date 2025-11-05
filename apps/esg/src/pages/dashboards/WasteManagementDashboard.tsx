import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, Alert, Chip, IconButton, LinearProgress } from '@mui/material';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend, AreaChart, Area, PieChart, Pie, Cell, ComposedChart } from 'recharts';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import ParkIcon from '@mui/icons-material/Park';

// Mock waste management data
const generateWasteData = () => {
  const now = new Date();
  const data = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      totalWaste: Math.random() * 20 + 80,
      recycled: Math.random() * 15 + 45,
      composted: Math.random() * 8 + 20,
      landfilled: Math.random() * 10 + 15,
      incinerated: Math.random() * 5 + 8,
      timestamp: date.getTime()
    });
  }
  return data;
};

// Mock waste composition data
const wasteCompositionData = [
  { category: 'Paper & Cardboard', percentage: 35, color: '#8bc34a', target: 40 },
  { category: 'Plastics', percentage: 25, color: '#2196f3', target: 30 },
  { category: 'Food Waste', percentage: 20, color: '#ff9800', target: 15 },
  { category: 'Metals', percentage: 10, color: '#9e9e9e', target: 12 },
  { category: 'Glass', percentage: 8, color: '#4caf50', target: 10 },
  { category: 'Other', percentage: 2, color: '#f44336', target: 3 }
];

// Mock recycling performance data
const recyclingPerformanceData = [
  { month: 'Jan', paper: 85, plastics: 72, metals: 88, glass: 90, overall: 84 },
  { month: 'Feb', paper: 87, plastics: 75, metals: 90, glass: 92, overall: 86 },
  { month: 'Mar', paper: 89, plastics: 78, metals: 92, glass: 94, overall: 88 },
  { month: 'Apr', paper: 91, plastics: 80, metals: 94, glass: 95, overall: 90 },
  { month: 'May', paper: 93, plastics: 82, metals: 95, glass: 96, overall: 91 },
  { month: 'Jun', paper: 94, plastics: 84, metals: 96, glass: 97, overall: 93 },
  { month: 'Jul', paper: 95, plastics: 86, metals: 97, glass: 98, overall: 94 },
  { month: 'Aug', paper: 96, plastics: 88, metals: 98, glass: 98, overall: 95 },
  { month: 'Sep', paper: 97, plastics: 90, metals: 98, glass: 99, overall: 96 },
  { month: 'Oct', paper: 98, plastics: 92, metals: 99, glass: 99, overall: 97 },
  { month: 'Nov', paper: 98, plastics: 93, metals: 99, glass: 99, overall: 97 },
  { month: 'Dec', paper: 99, plastics: 94, metals: 99, glass: 99, overall: 98 }
];

// Mock waste-to-energy data
const wasteToEnergyData = [
  { month: 'Jan', energyGenerated: 45, wasteProcessed: 120, efficiency: 85 },
  { month: 'Feb', energyGenerated: 48, wasteProcessed: 125, efficiency: 87 },
  { month: 'Mar', energyGenerated: 52, wasteProcessed: 130, efficiency: 89 },
  { month: 'Apr', energyGenerated: 55, wasteProcessed: 135, efficiency: 91 },
  { month: 'May', energyGenerated: 58, wasteProcessed: 140, efficiency: 92 },
  { month: 'Jun', energyGenerated: 61, wasteProcessed: 145, efficiency: 93 },
  { month: 'Jul', energyGenerated: 64, wasteProcessed: 150, efficiency: 94 },
  { month: 'Aug', energyGenerated: 67, wasteProcessed: 155, efficiency: 95 },
  { month: 'Sep', energyGenerated: 70, wasteProcessed: 160, efficiency: 96 },
  { month: 'Oct', energyGenerated: 73, wasteProcessed: 165, efficiency: 97 },
  { month: 'Nov', energyGenerated: 76, wasteProcessed: 170, efficiency: 98 },
  { month: 'Dec', energyGenerated: 79, wasteProcessed: 175, efficiency: 99 }
];

// Mock zero waste initiatives
const zeroWasteInitiatives = [
  { initiative: 'Single-Use Plastic Elimination', progress: 85, target: 100, timeline: '2024', status: 'On Track' },
  { initiative: 'Food Waste Reduction', progress: 78, target: 90, timeline: '2024', status: 'On Track' },
  { initiative: 'Paperless Office', progress: 92, target: 95, timeline: '2024', status: 'On Track' },
  { initiative: 'Composting Program', progress: 65, target: 80, timeline: '2025', status: 'At Risk' },
  { initiative: 'Circular Supply Chain', progress: 45, target: 70, timeline: '2025', status: 'Behind Schedule' }
];

// Mock alerts data
const wasteAlerts = [
  { id: 1, type: 'warning', message: 'Plastic recycling rate below target (84% vs 90%)', time: '2 hours ago', severity: 'medium' },
  { id: 2, type: 'success', message: 'Paper recycling target exceeded (99% vs 95%)', time: '4 hours ago', severity: 'low' },
  { id: 3, type: 'error', message: 'Food waste increased 15% this week', time: '6 hours ago', severity: 'high' },
  { id: 4, type: 'info', message: 'New composting facility operational', time: '1 day ago', severity: 'low' }
];

// Mock waste metrics
const wasteMetrics = {
  totalWaste: {
    title: 'Total Waste Generated',
    value: '2,847',
    unit: 'tons',
    change: -8.5,
    icon: DeleteIcon,
    color: '#f44336',
    status: 'Improving'
  },
  recyclingRate: {
    title: 'Recycling Rate',
    value: '78.5',
    unit: '%',
    change: 2.3,
    icon: AutorenewIcon,
    color: '#4caf50',
    status: 'Excellent'
  },
  diversionRate: {
    title: 'Waste Diversion',
    value: '85.2',
    unit: '%',
    change: 1.8,
    icon: ParkIcon,
    color: '#2196f3',
    status: 'Good'
  },
  energyRecovery: {
    title: 'Energy Recovery',
    value: '79',
    unit: 'MWh',
    change: 12.5,
    icon: LocalShippingIcon,
    color: '#ff9800',
    status: 'Exceeding'
  }
};

interface WasteMetricCardProps {
  title: string;
  value: string;
  unit: string;
  change: number;
  icon: React.ElementType;
  color: string;
  status: string;
}

const WasteMetricCard: React.FC<WasteMetricCardProps> = ({
  title,
  value,
  unit,
  change,
  icon: Icon,
  color,
  status
}) => {
  const isPositive = change > 0;
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Excellent':
      case 'Exceeding':
      case 'Improving':
        return '#4caf50';
      case 'Good':
      case 'On Track':
        return '#2196f3';
      case 'At Risk':
      case 'Warning':
        return '#ff9800';
      case 'Behind Schedule':
      case 'Critical':
        return '#f44336';
      default:
        return '#666';
    }
  };
  
  return (
    <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Box>
          <Typography variant="h6" color="textSecondary" sx={{ mb: 1 }}>
            {title}
          </Typography>
        </Box>
        <Icon sx={{ color: color, fontSize: 32 }} />
      </Box>
      
      <Typography variant="h3" component="div" sx={{ mb: 1, fontWeight: 'bold' }}>
        {value}
        <Typography component="span" variant="h6" sx={{ ml: 1, fontWeight: 'normal' }}>
          {unit}
        </Typography>
      </Typography>
      
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 'auto' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {isPositive ? (
            <TrendingUpIcon sx={{ color: 'success.main', mr: 1 }} />
          ) : (
            <TrendingDownIcon sx={{ color: 'error.main', mr: 1 }} />
          )}
          <Typography
            variant="body2"
            color={isPositive ? 'success.main' : 'error.main'}
            sx={{ fontWeight: 'medium' }}
          >
            {Math.abs(change)}% from last month
          </Typography>
        </Box>
        <Chip 
          label={status} 
          size="small" 
          sx={{ 
            backgroundColor: getStatusColor(status), 
            color: 'white',
            fontWeight: 'bold'
          }} 
        />
      </Box>
    </Paper>
  );
};

const WasteTrendChart: React.FC = () => {
  const [wasteData, setWasteData] = useState(generateWasteData());

  useEffect(() => {
    const interval = setInterval(() => {
      setWasteData(generateWasteData());
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Waste Generation Trends (Last 30 Days)
        </Typography>
        <IconButton size="small">
          <RefreshIcon />
        </IconButton>
      </Box>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={wasteData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <XAxis dataKey="date" stroke="#666" fontSize={12} />
          <YAxis stroke="#666" fontSize={12} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#fff', 
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          />
          <Legend />
          <Area
            type="monotone"
            dataKey="recycled"
            stackId="1"
            stroke="#4caf50"
            fill="#4caf50"
            fillOpacity={0.8}
            name="Recycled"
          />
          <Area
            type="monotone"
            dataKey="composted"
            stackId="1"
            stroke="#8bc34a"
            fill="#8bc34a"
            fillOpacity={0.8}
            name="Composted"
          />
          <Area
            type="monotone"
            dataKey="landfilled"
            stackId="1"
            stroke="#ff9800"
            fill="#ff9800"
            fillOpacity={0.8}
            name="Landfilled"
          />
          <Area
            type="monotone"
            dataKey="incinerated"
            stackId="1"
            stroke="#f44336"
            fill="#f44336"
            fillOpacity={0.8}
            name="Incinerated"
          />
        </AreaChart>
      </ResponsiveContainer>
    </Paper>
  );
};

const WasteCompositionChart: React.FC = () => {
  return (
    <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
        Waste Composition & Targets
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart data={wasteCompositionData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <XAxis dataKey="category" stroke="#666" fontSize={12} />
          <YAxis stroke="#666" fontSize={12} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#fff', 
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          />
          <Legend />
          <Bar dataKey="percentage" fill="#8884d8" name="Current %" radius={[2, 2, 0, 0]} />
          <Line type="monotone" dataKey="target" stroke="#ff7300" strokeWidth={3} name="Target %" />
        </ComposedChart>
      </ResponsiveContainer>
    </Paper>
  );
};

const RecyclingPerformanceChart: React.FC = () => {
  return (
    <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
        Recycling Performance by Material
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={recyclingPerformanceData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <XAxis dataKey="month" stroke="#666" fontSize={12} />
          <YAxis stroke="#666" fontSize={12} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#fff', 
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="paper"
            stroke="#8bc34a"
            strokeWidth={3}
            name="Paper"
            dot={{ fill: '#8bc34a', strokeWidth: 2, r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="plastics"
            stroke="#2196f3"
            strokeWidth={3}
            name="Plastics"
            dot={{ fill: '#2196f3', strokeWidth: 2, r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="metals"
            stroke="#9e9e9e"
            strokeWidth={3}
            name="Metals"
            dot={{ fill: '#9e9e9e', strokeWidth: 2, r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="glass"
            stroke="#4caf50"
            strokeWidth={3}
            name="Glass"
            dot={{ fill: '#4caf50', strokeWidth: 2, r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="overall"
            stroke="#ff9800"
            strokeWidth={4}
            name="Overall"
            dot={{ fill: '#ff9800', strokeWidth: 2, r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Paper>
  );
};

const WasteToEnergyChart: React.FC = () => {
  return (
    <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
        Waste-to-Energy Conversion
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart data={wasteToEnergyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <XAxis dataKey="month" stroke="#666" fontSize={12} />
          <YAxis yAxisId="left" stroke="#666" fontSize={12} />
          <YAxis yAxisId="right" orientation="right" stroke="#666" fontSize={12} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#fff', 
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          />
          <Legend />
          <Bar yAxisId="left" dataKey="wasteProcessed" fill="#ff9800" name="Waste Processed (tons)" radius={[2, 2, 0, 0]} />
          <Line yAxisId="right" type="monotone" dataKey="energyGenerated" stroke="#4caf50" strokeWidth={3} name="Energy Generated (MWh)" />
          <Line yAxisId="right" type="monotone" dataKey="efficiency" stroke="#2196f3" strokeWidth={3} name="Efficiency (%)" />
        </ComposedChart>
      </ResponsiveContainer>
    </Paper>
  );
};

const ZeroWasteInitiativesPanel: React.FC = () => {
  return (
    <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
        Zero Waste Initiatives Progress
      </Typography>
      <Box>
        {zeroWasteInitiatives.map((initiative, index) => (
          <Box key={index} sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                {initiative.initiative}
              </Typography>
              <Chip 
                label={initiative.status} 
                size="small" 
                color={
                  initiative.status === 'On Track' ? 'success' :
                  initiative.status === 'At Risk' ? 'warning' : 'error'
                }
              />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <LinearProgress 
                variant="determinate" 
                value={initiative.progress} 
                sx={{ 
                  flexGrow: 1, 
                  mr: 2,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: '#e0e0e0',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 4,
                    backgroundColor: 
                      initiative.status === 'On Track' ? '#4caf50' :
                      initiative.status === 'At Risk' ? '#ff9800' : '#f44336'
                  }
                }} 
              />
              <Typography variant="body2" color="textSecondary">
                {initiative.progress}%
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="caption" color="textSecondary">
                Target: {initiative.target}% | Timeline: {initiative.timeline}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

const WasteAlertsPanel: React.FC = () => {
  const [alerts, setAlerts] = useState(wasteAlerts);

  const handleDismissAlert = (id: number) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <WarningIcon sx={{ color: '#ff9800' }} />;
      case 'error':
        return <WarningIcon sx={{ color: '#f44336' }} />;
      case 'success':
        return <CheckCircleIcon sx={{ color: '#4caf50' }} />;
      default:
        return <VisibilityIcon sx={{ color: '#2196f3' }} />;
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
        Waste Management Alerts
      </Typography>
      <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
        {alerts.map((alert) => (
          <Alert
            key={alert.id}
            severity={alert.type as any}
            icon={getAlertIcon(alert.type)}
            sx={{ mb: 2 }}
            action={
              <IconButton
                aria-label="dismiss"
                color="inherit"
                size="small"
                onClick={() => handleDismissAlert(alert.id)}
              >
                <DeleteIcon fontSize="inherit" />
              </IconButton>
            }
          >
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                {alert.message}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                {alert.time}
              </Typography>
            </Box>
          </Alert>
        ))}
      </Box>
    </Paper>
  );
};

export const WasteManagementDashboard: React.FC = () => {
  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 2, fontWeight: 700 }}>
        Waste Management Dashboard
      </Typography>
      <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
        Comprehensive waste tracking, recycling performance, and zero waste initiatives monitoring
      </Typography>

      {/* Critical Alerts */}
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>Waste Summary:</strong> Overall recycling rate at 78.5% with 85.2% waste diversion. 
          Zero waste initiatives progressing well with 3 out of 5 on track.
        </Typography>
      </Alert>

      {/* Waste Metrics Cards */}
      <Box sx={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: 3, 
        mb: 4 
      }}>
        {Object.entries(wasteMetrics).map(([key, data]) => (
          <Box key={key} sx={{ 
            flex: '1 1 250px',
            minWidth: '250px'
          }}>
            <WasteMetricCard {...data} />
          </Box>
        ))}
      </Box>

      {/* Charts Grid */}
      <Box sx={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: 3, 
        mb: 4 
      }}>
        <Box sx={{ 
          flex: '1 1 600px',
          minWidth: '300px'
        }}>
          <WasteTrendChart />
        </Box>
        <Box sx={{ 
          flex: '1 1 300px',
          minWidth: '300px'
        }}>
          <WasteCompositionChart />
        </Box>
        <Box sx={{ 
          flex: '1 1 600px',
          minWidth: '300px'
        }}>
          <RecyclingPerformanceChart />
        </Box>
        <Box sx={{ 
          flex: '1 1 300px',
          minWidth: '300px'
        }}>
          <WasteToEnergyChart />
        </Box>
        <Box sx={{ 
          flex: '1 1 400px',
          minWidth: '300px'
        }}>
          <ZeroWasteInitiativesPanel />
        </Box>
        <Box sx={{ 
          flex: '1 1 400px',
          minWidth: '300px'
        }}>
          <WasteAlertsPanel />
        </Box>
      </Box>
    </Box>
  );
};

export default WasteManagementDashboard; 