import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, Alert, Chip, IconButton } from '@mui/material';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import DeleteIcon from '@mui/icons-material/Delete';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RefreshIcon from '@mui/icons-material/Refresh';

// Mock real-time meter data
const generateRealTimeData = () => {
  const now = new Date();
  const data = [];
  for (let i = 23; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000);
    data.push({
      time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      electricity: Math.random() * 50 + 100,
      water: Math.random() * 20 + 30,
      gas: Math.random() * 15 + 25,
      waste: Math.random() * 5 + 10,
      timestamp: time.getTime()
    });
  }
  return data;
};

// Mock historical comparison data
const historicalData = [
  { hour: '00:00', today: 125, yesterday: 118, lastWeek: 122 },
  { hour: '02:00', today: 98, yesterday: 105, lastWeek: 108 },
  { hour: '04:00', today: 85, yesterday: 92, lastWeek: 89 },
  { hour: '06:00', today: 145, yesterday: 138, lastWeek: 142 },
  { hour: '08:00', today: 210, yesterday: 205, lastWeek: 208 },
  { hour: '10:00', today: 195, yesterday: 188, lastWeek: 192 },
  { hour: '12:00', today: 180, yesterday: 175, lastWeek: 178 },
  { hour: '14:00', today: 220, yesterday: 215, lastWeek: 218 },
  { hour: '16:00', today: 235, yesterday: 228, lastWeek: 232 },
  { hour: '18:00', today: 200, yesterday: 195, lastWeek: 198 },
  { hour: '20:00', today: 165, yesterday: 158, lastWeek: 162 },
  { hour: '22:00', today: 135, yesterday: 128, lastWeek: 132 }
];

// Mock energy source breakdown
const energySourceData = [
  { name: 'Solar', value: 45, color: '#ff9800' },
  { name: 'Wind', value: 30, color: '#2196f3' },
  { name: 'Grid', value: 20, color: '#f44336' },
  { name: 'Battery', value: 5, color: '#4caf50' }
];

// Mock alerts data
const alertsData = [
  { id: 1, type: 'warning', message: 'Peak electricity usage detected at 14:30', time: '2 min ago', severity: 'medium' },
  { id: 2, type: 'error', message: 'Water consumption 25% above normal', time: '5 min ago', severity: 'high' },
  { id: 3, type: 'info', message: 'Solar generation at 85% capacity', time: '8 min ago', severity: 'low' },
  { id: 4, type: 'success', message: 'Energy efficiency target met', time: '15 min ago', severity: 'low' }
];

// Mock peak usage data
const peakUsageData = [
  { meter: 'Electricity', current: 235, peak: 280, time: '14:30', status: 'Near Peak' },
  { meter: 'Water', current: 45, peak: 52, time: '09:15', status: 'Normal' },
  { meter: 'Gas', current: 38, peak: 45, time: '12:45', status: 'Normal' },
  { meter: 'Waste', current: 12, peak: 15, time: '16:20', status: 'Normal' }
];

interface MeterCardProps {
  title: string;
  value: string;
  unit: string;
  change: number;
  icon: React.ElementType;
  color: string;
  status: string;
}

const MeterCard: React.FC<MeterCardProps> = ({
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
      case 'Normal':
        return '#4caf50';
      case 'Warning':
        return '#ff9800';
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
            {Math.abs(change)}% from last hour
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

const RealTimeChart: React.FC = () => {
  const [realTimeData, setRealTimeData] = useState(generateRealTimeData());

  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeData(generateRealTimeData());
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Real-Time Consumption (Last 24 Hours)
        </Typography>
        <IconButton size="small">
          <RefreshIcon />
        </IconButton>
      </Box>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={realTimeData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <XAxis dataKey="time" stroke="#666" fontSize={12} />
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
            dataKey="electricity"
            stroke="#ff9800"
            strokeWidth={3}
            name="Electricity (kWh)"
            dot={{ fill: '#ff9800', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#ff9800', strokeWidth: 2 }}
          />
          <Line
            type="monotone"
            dataKey="water"
            stroke="#2196f3"
            strokeWidth={3}
            name="Water (m³)"
            dot={{ fill: '#2196f3', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#2196f3', strokeWidth: 2 }}
          />
          <Line
            type="monotone"
            dataKey="gas"
            stroke="#f44336"
            strokeWidth={3}
            name="Gas (m³)"
            dot={{ fill: '#f44336', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#f44336', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Paper>
  );
};

const HistoricalComparisonChart: React.FC = () => {
  return (
    <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
        Historical Comparison (Electricity)
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={historicalData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <XAxis dataKey="hour" stroke="#666" fontSize={12} />
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
            dataKey="today"
            stackId="1"
            stroke="#4caf50"
            fill="#4caf50"
            fillOpacity={0.8}
            name="Today"
          />
          <Area
            type="monotone"
            dataKey="yesterday"
            stackId="1"
            stroke="#2196f3"
            fill="#2196f3"
            fillOpacity={0.6}
            name="Yesterday"
          />
          <Area
            type="monotone"
            dataKey="lastWeek"
            stackId="1"
            stroke="#ff9800"
            fill="#ff9800"
            fillOpacity={0.4}
            name="Last Week"
          />
        </AreaChart>
      </ResponsiveContainer>
    </Paper>
  );
};

const EnergySourceChart: React.FC = () => {
  return (
    <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
        Energy Source Breakdown
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={energySourceData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {energySourceData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </Paper>
  );
};

const AlertsPanel: React.FC = () => {
  const [alerts, setAlerts] = useState(alertsData);

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
        return <WarningIcon sx={{ color: '#2196f3' }} />;
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
        Real-Time Alerts
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

const PeakUsagePanel: React.FC = () => {
  return (
    <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
        Peak Usage Monitoring
      </Typography>
      <Box>
        {peakUsageData.map((item, index) => (
          <Box key={index} sx={{ mb: 3, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                {item.meter}
              </Typography>
              <Chip 
                label={item.status} 
                size="small" 
                color={item.status === 'Near Peak' ? 'warning' : 'success'}
              />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" color="textSecondary">
                Current: {item.current} | Peak: {item.peak}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                {item.time}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

export const RealTimeData: React.FC = () => {
  // Mock current meter readings
  const currentReadings = {
    electricity: {
      title: 'Electricity',
      value: '235.4',
      unit: 'kWh',
      change: 2.3,
      icon: ElectricBoltIcon,
      color: '#ff9800',
      status: 'Normal'
    },
    water: {
      title: 'Water',
      value: '45.2',
      unit: 'm³',
      change: -1.8,
      icon: WaterDropIcon,
      color: '#2196f3',
      status: 'Normal'
    },
    gas: {
      title: 'Gas',
      value: '38.7',
      unit: 'm³',
      change: 0.5,
      icon: LocalGasStationIcon,
      color: '#f44336',
      status: 'Normal'
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 2, fontWeight: 700 }}>
        Real-Time Meter Data Analysis
      </Typography>
      <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
        Live monitoring of energy, water, gas, and waste consumption with real-time analytics
      </Typography>

      {/* Current Readings Cards */}
      <Box sx={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: 3, 
        mb: 4 
      }}>
        {Object.entries(currentReadings).map(([key, data]) => (
          <Box key={key} sx={{ 
            flex: '1 1 300px',
            minWidth: '280px',
            maxWidth: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(33.333% - 16px)' }
          }}>
            <MeterCard {...data} />
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
          <RealTimeChart />
        </Box>
        <Box sx={{ 
          flex: '1 1 300px',
          minWidth: '300px'
        }}>
          <EnergySourceChart />
        </Box>
        <Box sx={{ 
          flex: '1 1 600px',
          minWidth: '300px'
        }}>
          <HistoricalComparisonChart />
        </Box>
        <Box sx={{ 
          flex: '1 1 300px',
          minWidth: '300px'
        }}>
          <AlertsPanel />
        </Box>
        <Box sx={{ 
          flex: '1 1 100%',
          minWidth: '100%'
        }}>
          <PeakUsagePanel />
        </Box>
      </Box>
    </Box>
  );
};

export default RealTimeData; 