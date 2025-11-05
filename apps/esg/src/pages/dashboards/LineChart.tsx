import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Paper, Typography, Box } from '@mui/material';

// Mock data for ESG metrics over time
const mockData = [
  { 
    month: 'Jan', 
    carbonEmissions: 120, 
    energyConsumption: 850, 
    waterUsage: 320,
    wasteGenerated: 45
  },
  { 
    month: 'Feb', 
    carbonEmissions: 115, 
    energyConsumption: 820, 
    waterUsage: 310,
    wasteGenerated: 42
  },
  { 
    month: 'Mar', 
    carbonEmissions: 110, 
    energyConsumption: 800, 
    waterUsage: 305,
    wasteGenerated: 40
  },
  { 
    month: 'Apr', 
    carbonEmissions: 105, 
    energyConsumption: 780, 
    waterUsage: 295,
    wasteGenerated: 38
  },
  { 
    month: 'May', 
    carbonEmissions: 100, 
    energyConsumption: 760, 
    waterUsage: 290,
    wasteGenerated: 35
  },
  { 
    month: 'Jun', 
    carbonEmissions: 95, 
    energyConsumption: 740, 
    waterUsage: 285,
    wasteGenerated: 33
  },
  { 
    month: 'Jul', 
    carbonEmissions: 90, 
    energyConsumption: 720, 
    waterUsage: 280,
    wasteGenerated: 30
  },
  { 
    month: 'Aug', 
    carbonEmissions: 85, 
    energyConsumption: 700, 
    waterUsage: 275,
    wasteGenerated: 28
  },
  { 
    month: 'Sep', 
    carbonEmissions: 80, 
    energyConsumption: 680, 
    waterUsage: 270,
    wasteGenerated: 25
  },
  { 
    month: 'Oct', 
    carbonEmissions: 75, 
    energyConsumption: 660, 
    waterUsage: 265,
    wasteGenerated: 23
  },
  { 
    month: 'Nov', 
    carbonEmissions: 70, 
    energyConsumption: 640, 
    waterUsage: 260,
    wasteGenerated: 20
  },
  { 
    month: 'Dec', 
    carbonEmissions: 65, 
    energyConsumption: 620, 
    waterUsage: 255,
    wasteGenerated: 18
  }
];

interface LineChartProps {
  title?: string;
  data?: any[];
  height?: number;
  showGrid?: boolean;
  showLegend?: boolean;
  showTooltip?: boolean;
  colors?: string[];
  dataKeys?: string[];
  dataLabels?: string[];
}

export const ESGLineChart: React.FC<LineChartProps> = ({
  title = "ESG Metrics Trend",
  data = mockData,
  height = 400,
  showGrid = true,
  showLegend = true,
  showTooltip = true,
  colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300'],
  dataKeys = ['carbonEmissions', 'energyConsumption', 'waterUsage', 'wasteGenerated'],
  dataLabels = ['Carbon Emissions', 'Energy Consumption', 'Water Usage', 'Waste Generated']
}) => {
  return (
    <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" gutterBottom sx={{ mb: 2, fontWeight: 600 }}>
        {title}
      </Typography>
      
      <Box sx={{ width: '100%', height: height }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />}
            
            <XAxis 
              dataKey="month" 
              stroke="#666"
              fontSize={12}
            />
            
            <YAxis 
              stroke="#666"
              fontSize={12}
            />
            
            {showTooltip && (
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #ccc',
                  borderRadius: '4px'
                }}
              />
            )}
            
            {showLegend && (
              <Legend 
                verticalAlign="top" 
                height={36}
                wrapperStyle={{ paddingBottom: '10px' }}
              />
            )}
            
            {dataKeys.map((key, index) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={colors[index % colors.length]}
                strokeWidth={2}
                dot={{ fill: colors[index % colors.length], strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: colors[index % colors.length], strokeWidth: 2 }}
                name={dataLabels[index] || key}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

// Export default for easier imports
export default ESGLineChart;