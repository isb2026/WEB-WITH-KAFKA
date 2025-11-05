import React from 'react';
import { Box, Paper, Typography, Chip, Button, Avatar, LinearProgress } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import NatureIcon from '@mui/icons-material/Nature';
import ForestIcon from '@mui/icons-material/Forest';
import SolarPowerIcon from '@mui/icons-material/SolarPower';
import WaterIcon from '@mui/icons-material/Water';
import AddIcon from '@mui/icons-material/Add';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

interface OffsetProject {
  id: string;
  name: string;
  type: 'reforestation' | 'renewable-energy' | 'ocean-conservation' | 'methane-capture';
  location: string;
  credits: number;
  totalCredits: number;
  status: 'active' | 'completed' | 'pending';
  startDate: string;
  endDate: string;
  icon: React.ReactNode;
  color: string;
}

interface CarbonOffsetTrackingProps {
  totalOffsetCredits: string;
  totalEmissions: string;
  netEmissions: string;
  offsetPercentage: number;
  projects: OffsetProject[];
  availableCredits: number;
  pendingCredits: number;
  retiredCredits: number;
}

export const CarbonOffsetTracking: React.FC<CarbonOffsetTrackingProps> = ({
  totalOffsetCredits,
  totalEmissions,
  netEmissions,
  offsetPercentage,
  projects,
  availableCredits,
  pendingCredits,
  retiredCredits
}) => {
  const offsetData = [
    { name: 'Available', value: availableCredits, color: '#4caf50' },
    { name: 'Pending', value: pendingCredits, color: '#ff9800' },
    { name: 'Retired', value: retiredCredits, color: '#2196f3' }
  ];

  const projectTypeData = projects.reduce((acc, project) => {
    const existing = acc.find(item => item.name === project.type);
    if (existing) {
      existing.value += project.credits;
    } else {
      acc.push({ name: project.type, value: project.credits, color: project.color });
    }
    return acc;
  }, [] as { name: string; value: number; color: string }[]);

  const CustomTooltip = ({ active, payload }: any) => {
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
          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
            {payload[0].name}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {payload[0].value} credits
          </Typography>
        </Box>
      );
    }
    return null;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return '#4caf50';
      case 'completed':
        return '#2196f3';
      case 'pending':
        return '#ff9800';
      default:
        return '#666';
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case 'active':
        return '#e8f5e8';
      case 'completed':
        return '#e3f2fd';
      case 'pending':
        return '#fff3e0';
      default:
        return '#f5f5f5';
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h6" color="textSecondary" sx={{ mb: 1 }}>
            Carbon Offset Tracking
          </Typography>
          <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', color: '#2e7d32' }}>
            {totalOffsetCredits}
            <Typography component="span" variant="h6" sx={{ ml: 1, fontWeight: 'normal', color: 'textSecondary' }}>
              CO2e Offset
            </Typography>
          </Typography>
        </Box>
        <NatureIcon sx={{ color: '#4caf50', fontSize: 32 }} />
      </Box>

      {/* Offset Summary */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Typography variant="body2" color="textSecondary">
            Total Emissions
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            {totalEmissions} CO2e
          </Typography>
        </Box>
        <Box>
          <Typography variant="body2" color="textSecondary">
            Net Emissions
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#2e7d32' }}>
            {netEmissions} CO2e
          </Typography>
        </Box>
        <Box>
          <Typography variant="body2" color="textSecondary">
            Offset Rate
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#4caf50' }}>
            {offsetPercentage}%
          </Typography>
        </Box>
      </Box>

      {/* Credits Distribution */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 2 }}>
          Credits Distribution
        </Typography>
        <Box sx={{ height: 200 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={offsetData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={60}
                fill="#8884d8"
                dataKey="value"
              >
                {offsetData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Box>
      </Box>

      {/* Project Types */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 2 }}>
          Offset Projects by Type
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gap: 1,
            gridTemplateColumns: {
              xs: 'repeat(2, 1fr)',
              sm: 'repeat(4, 1fr)'
            }
          }}
        >
          {projectTypeData.map((type, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                alignItems: 'center',
                p: 1,
                borderRadius: 1,
                backgroundColor: `${type.color}15`,
                border: `1px solid ${type.color}30`
              }}
            >
              <Box sx={{ color: type.color, mr: 1 }}>
                {type.name === 'reforestation' && <ForestIcon />}
                {type.name === 'renewable-energy' && <SolarPowerIcon />}
                {type.name === 'ocean-conservation' && <WaterIcon />}
                {type.name === 'methane-capture' && <NatureIcon />}
              </Box>
              <Box>
                <Typography variant="caption" sx={{ fontWeight: 'bold', display: 'block', textTransform: 'capitalize' }}>
                  {type.name.replace('-', ' ')}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {type.value} credits
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Active Projects */}
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="subtitle2" color="textSecondary">
            Active Projects
          </Typography>
          <Button
            startIcon={<AddIcon />}
            size="small"
            variant="outlined"
            color="primary"
          >
            Add Project
          </Button>
        </Box>
        
        <Box sx={{ maxHeight: 200, overflowY: 'auto' }}>
          {projects.slice(0, 3).map((project) => (
            <Box
              key={project.id}
              sx={{
                display: 'flex',
                alignItems: 'center',
                p: 2,
                mb: 1,
                borderRadius: 1,
                backgroundColor: '#f8f9fa',
                border: '1px solid #e9ecef'
              }}
            >
              <Avatar sx={{ bgcolor: project.color, mr: 2, width: 32, height: 32 }}>
                {project.icon}
              </Avatar>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  {project.name}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {project.location} • {project.credits}/{project.totalCredits} credits
                </Typography>
                <Box sx={{ mt: 1 }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={(project.credits / project.totalCredits) * 100}
                    sx={{ height: 4, borderRadius: 2 }}
                  />
                </Box>
              </Box>
              <Chip 
                label={project.status} 
                size="small" 
                sx={{ 
                  backgroundColor: getStatusBgColor(project.status),
                  color: getStatusColor(project.status),
                  fontWeight: 'bold',
                  border: `1px solid ${getStatusColor(project.status)}`
                }} 
              />
            </Box>
          ))}
        </Box>
      </Box>
    </Paper>
  );
}; 