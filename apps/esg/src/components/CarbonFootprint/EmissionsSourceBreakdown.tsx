import React from 'react';
import { Box, Paper, Typography, Chip } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import FactoryIcon from '@mui/icons-material/Factory';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import HomeIcon from '@mui/icons-material/Home';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';

interface EmissionsSource {
  name: string;
  value: number;
  percentage: number;
  color: string;
  icon: React.ReactNode;
}

interface EmissionsSourceBreakdownProps {
  sources: EmissionsSource[];
  totalEmissions: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export const EmissionsSourceBreakdown: React.FC<EmissionsSourceBreakdownProps> = ({
  sources,
  totalEmissions
}) => {
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
            {payload[0].value} CO2e ({payload[0].payload.percentage}%)
          </Typography>
        </Box>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }: any) => (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center', mt: 2 }}>
      {payload?.map((entry: any, index: number) => (
        <Chip
          key={`legend-${index}`}
          label={`${entry.value} (${sources[index]?.percentage}%)`}
          size="small"
          sx={{
            backgroundColor: entry.color,
            color: 'white',
            fontWeight: 'bold',
            '&:hover': {
              opacity: 0.8
            }
          }}
        />
      ))}
    </Box>
  );

  return (
    <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" color="textSecondary" sx={{ mb: 2 }}>
        Emissions by Source
      </Typography>
      
      <Typography variant="h4" component="div" sx={{ mb: 3, fontWeight: 'bold', color: '#2e7d32' }}>
        {totalEmissions}
        <Typography component="span" variant="h6" sx={{ ml: 1, fontWeight: 'normal', color: 'textSecondary' }}>
          CO2e Total
        </Typography>
      </Typography>

      <Box sx={{ height: 300, mb: 2 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={sources}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {sources.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
          </PieChart>
        </ResponsiveContainer>
      </Box>

      {/* Source Details */}
      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: {
            xs: 'repeat(2, 1fr)',
            sm: 'repeat(3, 1fr)'
          }
        }}
      >
        {sources.map((source, index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              alignItems: 'center',
              p: 1,
              borderRadius: 1,
              backgroundColor: `${source.color}15`,
              border: `1px solid ${source.color}30`
            }}
          >
            <Box sx={{ color: source.color, mr: 1 }}>
              {source.icon}
            </Box>
            <Box>
              <Typography variant="caption" sx={{ fontWeight: 'bold', display: 'block' }}>
                {source.name}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                {source.value} CO2e
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Paper>
  );
};                                               