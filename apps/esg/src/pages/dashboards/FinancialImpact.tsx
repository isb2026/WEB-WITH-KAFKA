import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import SavingsIcon from '@mui/icons-material/Savings';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import Co2Icon from '@mui/icons-material/Co2';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';

// Mock data for financial impact metrics
const costSavingsData = [
  { month: 'Jan', energySavings: 45000, wasteReduction: 12000, waterSavings: 8000, totalSavings: 65000 },
  { month: 'Feb', energySavings: 48000, wasteReduction: 12500, waterSavings: 8200, totalSavings: 68700 },
  { month: 'Mar', energySavings: 52000, wasteReduction: 13000, waterSavings: 8500, totalSavings: 73500 },
  { month: 'Apr', energySavings: 55000, wasteReduction: 13500, waterSavings: 8800, totalSavings: 77300 },
  { month: 'May', energySavings: 58000, wasteReduction: 14000, waterSavings: 9100, totalSavings: 81100 },
  { month: 'Jun', energySavings: 62000, wasteReduction: 14500, waterSavings: 9400, totalSavings: 85900 },
  { month: 'Jul', energySavings: 65000, wasteReduction: 15000, waterSavings: 9700, totalSavings: 89700 },
  { month: 'Aug', energySavings: 68000, wasteReduction: 15500, waterSavings: 10000, totalSavings: 93500 },
  { month: 'Sep', energySavings: 72000, wasteReduction: 16000, waterSavings: 10300, totalSavings: 98300 },
  { month: 'Oct', energySavings: 75000, wasteReduction: 16500, waterSavings: 10600, totalSavings: 102100 },
  { month: 'Nov', energySavings: 78000, wasteReduction: 17000, waterSavings: 10900, totalSavings: 105900 },
  { month: 'Dec', energySavings: 82000, wasteReduction: 17500, waterSavings: 11200, totalSavings: 110700 }
];

const esgInvestmentData = [
  { year: '2020', investment: 500000, returns: 520000, roi: 4.0 },
  { year: '2021', investment: 750000, returns: 810000, roi: 8.0 },
  { year: '2022', investment: 1000000, returns: 1150000, roi: 15.0 },
  { year: '2023', investment: 1250000, returns: 1500000, roi: 20.0 },
  { year: '2024', investment: 1500000, returns: 1875000, roi: 25.0 }
];

const carbonPricingData = [
  { month: 'Jan', carbonCost: 15000, carbonCredits: 8000, netImpact: -7000 },
  { month: 'Feb', carbonCost: 14500, carbonCredits: 8500, netImpact: -6000 },
  { month: 'Mar', carbonCost: 14000, carbonCredits: 9000, netImpact: -5000 },
  { month: 'Apr', carbonCost: 13500, carbonCredits: 9500, netImpact: -4000 },
  { month: 'May', carbonCost: 13000, carbonCredits: 10000, netImpact: -3000 },
  { month: 'Jun', carbonCost: 12500, carbonCredits: 10500, netImpact: -2000 },
  { month: 'Jul', carbonCost: 12000, carbonCredits: 11000, netImpact: -1000 },
  { month: 'Aug', carbonCost: 11500, carbonCredits: 11500, netImpact: 0 },
  { month: 'Sep', carbonCost: 11000, carbonCredits: 12000, netImpact: 1000 },
  { month: 'Oct', carbonCost: 10500, carbonCredits: 12500, netImpact: 2000 },
  { month: 'Nov', carbonCost: 10000, carbonCredits: 13000, netImpact: 3000 },
  { month: 'Dec', carbonCost: 9500, carbonCredits: 13500, netImpact: 4000 }
];

const greenFinancingData = [
  { category: 'Green Bonds', amount: 5000000, interestRate: 2.5, savings: 125000 },
  { category: 'Sustainability Loans', amount: 3000000, interestRate: 3.0, savings: 90000 },
  { category: 'ESG Investment Funds', amount: 2000000, interestRate: 4.5, savings: 90000 },
  { category: 'Carbon Credits', amount: 1000000, interestRate: 0.0, savings: 50000 },
  { category: 'Renewable Energy Tax Credits', amount: 800000, interestRate: 0.0, savings: 80000 }
];

const revenueStreamsData = [
  { month: 'Jan', sustainableProducts: 120000, esgConsulting: 45000, carbonTrading: 15000, total: 180000 },
  { month: 'Feb', sustainableProducts: 125000, esgConsulting: 48000, carbonTrading: 16000, total: 189000 },
  { month: 'Mar', sustainableProducts: 130000, esgConsulting: 52000, carbonTrading: 17000, total: 199000 },
  { month: 'Apr', sustainableProducts: 135000, esgConsulting: 55000, carbonTrading: 18000, total: 208000 },
  { month: 'May', sustainableProducts: 140000, esgConsulting: 58000, carbonTrading: 19000, total: 217000 },
  { month: 'Jun', sustainableProducts: 145000, esgConsulting: 62000, carbonTrading: 20000, total: 227000 },
  { month: 'Jul', sustainableProducts: 150000, esgConsulting: 65000, carbonTrading: 21000, total: 236000 },
  { month: 'Aug', sustainableProducts: 155000, esgConsulting: 68000, carbonTrading: 22000, total: 245000 },
  { month: 'Sep', sustainableProducts: 160000, esgConsulting: 72000, carbonTrading: 23000, total: 255000 },
  { month: 'Oct', sustainableProducts: 165000, esgConsulting: 75000, carbonTrading: 24000, total: 264000 },
  { month: 'Nov', sustainableProducts: 170000, esgConsulting: 78000, carbonTrading: 25000, total: 273000 },
  { month: 'Dec', sustainableProducts: 175000, esgConsulting: 82000, carbonTrading: 26000, total: 283000 }
];

// Financial KPI data
export const financialKpiData = {
  totalCostSavings: {
    title: 'Total Cost Savings',
    value: '$1.1M',
    unit: 'annual',
    change: 15.3,
    icon: SavingsIcon,
    color: '#4caf50',
    description: 'Annual savings from ESG initiatives'
  },
  esgRoi: {
    title: 'ESG Investment ROI',
    value: '25.0',
    unit: '%',
    change: 5.0,
    icon: ShowChartIcon,
    color: '#2196f3',
    description: 'Return on ESG investments'
  },
  carbonCredits: {
    title: 'Carbon Credit Revenue',
    value: '$135K',
    unit: 'annual',
    change: 12.5,
    icon: Co2Icon,
    color: '#ff9800',
    description: 'Revenue from carbon credit sales'
  },
  greenFinancing: {
    title: 'Green Financing Savings',
    value: '$435K',
    unit: 'annual',
    change: 8.2,
    icon: AccountBalanceIcon,
    color: '#9c27b0',
    description: 'Interest savings from green financing'
  },
  esgRevenue: {
    title: 'ESG Revenue Streams',
    value: '$2.8M',
    unit: 'annual',
    change: 18.7,
    icon: MonetizationOnIcon,
    color: '#00bcd4',
    description: 'Revenue from ESG-related products/services'
  },
  netFinancialImpact: {
    title: 'Net Financial Impact',
    value: '$4.2M',
    unit: 'annual',
    change: 22.1,
    icon: AttachMoneyIcon,
    color: '#f44336',
    description: 'Total net financial impact of ESG initiatives'
  }
};

interface FinancialKPICardProps {
  title: string;
  value: string;
  unit: string;
  change: number;
  icon: React.ElementType;
  color: string;
  description: string;
}

const FinancialKPICard: React.FC<FinancialKPICardProps> = ({
  title,
  value,
  unit,
  change,
  icon: Icon,
  color,
  description
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
        <Box>
          <Typography variant="h6" color="textSecondary" sx={{ mb: 1 }}>
            {title}
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ fontSize: '0.875rem' }}>
            {description}
          </Typography>
        </Box>
        <Icon sx={{ color: color, fontSize: 28 }} />
      </Box>
      
      <Typography variant="h3" component="div" sx={{ mb: 1, fontWeight: 'bold' }}>
        {value}
        <Typography component="span" variant="h6" sx={{ ml: 1, fontWeight: 'normal' }}>
          {unit}
        </Typography>
      </Typography>
      
      <Box sx={{ display: 'flex', alignItems: 'center', mt: 'auto' }}>
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
          {Math.abs(change)}% from last year
        </Typography>
      </Box>
    </Paper>
  );
};

const CostSavingsChart: React.FC = () => {
  return (
    <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
        Cost Savings Breakdown
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={costSavingsData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
          <Area
            type="monotone"
            dataKey="energySavings"
            stackId="1"
            stroke="#4caf50"
            fill="#4caf50"
            fillOpacity={0.8}
            name="Energy Savings"
          />
          <Area
            type="monotone"
            dataKey="wasteReduction"
            stackId="1"
            stroke="#ff9800"
            fill="#ff9800"
            fillOpacity={0.8}
            name="Waste Reduction"
          />
          <Area
            type="monotone"
            dataKey="waterSavings"
            stackId="1"
            stroke="#2196f3"
            fill="#2196f3"
            fillOpacity={0.8}
            name="Water Savings"
          />
        </AreaChart>
      </ResponsiveContainer>
    </Paper>
  );
};

const ESGInvestmentChart: React.FC = () => {
  return (
    <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
        ESG Investment Returns
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={esgInvestmentData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <XAxis dataKey="year" stroke="#666" fontSize={12} />
          <YAxis stroke="#666" fontSize={12} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#fff', 
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          />
          <Legend />
          <Bar dataKey="investment" fill="#2196f3" name="Investment" radius={[2, 2, 0, 0]} />
          <Bar dataKey="returns" fill="#4caf50" name="Returns" radius={[2, 2, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
};

const CarbonPricingChart: React.FC = () => {
  return (
    <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
        Carbon Pricing Impact
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={carbonPricingData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
            dataKey="carbonCost"
            stroke="#f44336"
            strokeWidth={3}
            name="Carbon Costs"
            dot={{ fill: '#f44336', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#f44336', strokeWidth: 2 }}
          />
          <Line
            type="monotone"
            dataKey="carbonCredits"
            stroke="#4caf50"
            strokeWidth={3}
            name="Carbon Credits"
            dot={{ fill: '#4caf50', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#4caf50', strokeWidth: 2 }}
          />
          <Line
            type="monotone"
            dataKey="netImpact"
            stroke="#2196f3"
            strokeWidth={3}
            name="Net Impact"
            dot={{ fill: '#2196f3', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#2196f3', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Paper>
  );
};

const GreenFinancingChart: React.FC = () => {
  return (
    <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
        Green Financing Portfolio
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={greenFinancingData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ category, amount }) => `${category}: $${(amount/1000000).toFixed(1)}M`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="amount"
          >
            {greenFinancingData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={['#4caf50', '#2196f3', '#ff9800', '#9c27b0', '#00bcd4'][index]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#fff', 
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
            formatter={(value: any) => [`$${(value/1000).toFixed(0)}K`, 'Amount']}
          />
        </PieChart>
      </ResponsiveContainer>
    </Paper>
  );
};

const RevenueStreamsChart: React.FC = () => {
  return (
    <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
        ESG Revenue Streams
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={revenueStreamsData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
            dataKey="sustainableProducts"
            stroke="#4caf50"
            strokeWidth={3}
            name="Sustainable Products"
            dot={{ fill: '#4caf50', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#4caf50', strokeWidth: 2 }}
          />
          <Line
            type="monotone"
            dataKey="esgConsulting"
            stroke="#2196f3"
            strokeWidth={3}
            name="ESG Consulting"
            dot={{ fill: '#2196f3', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#2196f3', strokeWidth: 2 }}
          />
          <Line
            type="monotone"
            dataKey="carbonTrading"
            stroke="#ff9800"
            strokeWidth={3}
            name="Carbon Trading"
            dot={{ fill: '#ff9800', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#ff9800', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export const FinancialImpact: React.FC = () => {
  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 4, fontWeight: 600 }}>
        Financial Impact of ESG Initiatives
      </Typography>
      
      {/* KPI Cards */}
      <Box
        sx={{
          display: 'grid',
          gap: 3,
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
            lg: 'repeat(6, 1fr)'
          },
          mb: 4
        }}
      >
        {Object.entries(financialKpiData).map(([key, data]) => (
          <Box key={key}>
            <FinancialKPICard {...data} />
          </Box>
        ))}
      </Box>

      {/* Charts Section */}
      <Box
        sx={{
          display: 'grid',
          gap: 3,
          gridTemplateColumns: {
            xs: '1fr',
            lg: 'repeat(2, 1fr)'
          }
        }}
      >
        <Box>
          <CostSavingsChart />
        </Box>
        <Box>
          <ESGInvestmentChart />
        </Box>
        <Box>
          <CarbonPricingChart />
        </Box>
        <Box>
          <GreenFinancingChart />
        </Box>
        <Box sx={{ gridColumn: { xs: '1', lg: '1 / 3' } }}>
          <RevenueStreamsChart />
        </Box>
      </Box>
    </Box>
  );
};

export default FinancialImpact;