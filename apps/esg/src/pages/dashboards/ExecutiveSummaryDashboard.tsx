import React from 'react';
import { Box, Paper, Typography, Alert, Chip } from '@mui/material';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend, AreaChart, Area } from 'recharts';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import BusinessIcon from '@mui/icons-material/Business';
import AssessmentIcon from '@mui/icons-material/Assessment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import SecurityIcon from '@mui/icons-material/Security';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import Co2Icon from '@mui/icons-material/Co2';

// Mock data for executive summary metrics
const overallESGScoreData = [
  { month: 'Jan', overallScore: 72, environmental: 68, social: 75, governance: 73 },
  { month: 'Feb', overallScore: 74, environmental: 70, social: 77, governance: 75 },
  { month: 'Mar', overallScore: 76, environmental: 72, social: 79, governance: 77 },
  { month: 'Apr', overallScore: 78, environmental: 74, social: 81, governance: 79 },
  { month: 'May', overallScore: 80, environmental: 76, social: 83, governance: 81 },
  { month: 'Jun', overallScore: 82, environmental: 78, social: 85, governance: 83 },
  { month: 'Jul', overallScore: 84, environmental: 80, social: 87, governance: 85 },
  { month: 'Aug', overallScore: 86, environmental: 82, social: 89, governance: 87 },
  { month: 'Sep', overallScore: 88, environmental: 84, social: 91, governance: 89 },
  { month: 'Oct', overallScore: 90, environmental: 86, social: 93, governance: 91 },
  { month: 'Nov', overallScore: 92, environmental: 88, social: 95, governance: 93 },
  { month: 'Dec', overallScore: 94, environmental: 90, social: 97, governance: 95 }
];

const keyMetricsData = [
  { metric: 'Carbon Emissions', current: 75, target: 65, unit: 'tons CO2e', status: 'On Track' },
  { metric: 'Energy Efficiency', current: 92, target: 95, unit: '%', status: 'On Track' },
  { metric: 'Employee Satisfaction', current: 94, target: 90, unit: '%', status: 'Exceeding' },
  { metric: 'Supplier Compliance', current: 99, target: 98, unit: '%', status: 'Exceeding' },
  { metric: 'Board Diversity', current: 45, target: 50, unit: '%', status: 'At Risk' },
  { metric: 'ESG Investment ROI', current: 25, target: 20, unit: '%', status: 'Exceeding' }
];

const riskAssessmentData = [
  { category: 'Environmental Risk', score: 15, level: 'Low', trend: 'Improving' },
  { category: 'Social Risk', score: 22, level: 'Low', trend: 'Stable' },
  { category: 'Governance Risk', score: 18, level: 'Low', trend: 'Improving' },
  { category: 'Regulatory Risk', score: 28, level: 'Medium', trend: 'Stable' },
  { category: 'Reputation Risk', score: 12, level: 'Low', trend: 'Improving' },
  { category: 'Financial Risk', score: 25, level: 'Low', trend: 'Stable' }
];

const stakeholderSentimentData = [
  { month: 'Jan', investors: 78, customers: 82, employees: 85, regulators: 88 },
  { month: 'Feb', investors: 80, customers: 84, employees: 87, regulators: 90 },
  { month: 'Mar', investors: 82, customers: 86, employees: 89, regulators: 92 },
  { month: 'Apr', investors: 84, customers: 88, employees: 91, regulators: 94 },
  { month: 'May', investors: 86, customers: 90, employees: 93, regulators: 96 },
  { month: 'Jun', investors: 88, customers: 92, employees: 95, regulators: 98 },
  { month: 'Jul', investors: 90, customers: 94, employees: 97, regulators: 99 },
  { month: 'Aug', investors: 92, customers: 96, employees: 98, regulators: 99 },
  { month: 'Sep', investors: 94, customers: 97, employees: 99, regulators: 99 },
  { month: 'Oct', investors: 95, customers: 98, employees: 99, regulators: 99 },
  { month: 'Nov', investors: 96, customers: 99, employees: 99, regulators: 99 },
  { month: 'Dec', investors: 97, customers: 99, employees: 99, regulators: 99 }
];

const strategicInitiativesData = [
  { initiative: 'Carbon Neutrality', progress: 75, target: 100, timeline: '2025', status: 'On Track' },
  { initiative: '100% Renewable Energy', progress: 60, target: 100, timeline: '2026', status: 'On Track' },
  { initiative: 'Zero Waste Operations', progress: 85, target: 100, timeline: '2024', status: 'On Track' },
  { initiative: 'Diverse Leadership', progress: 45, target: 50, timeline: '2025', status: 'At Risk' },
  { initiative: 'ESG Software Platform', progress: 90, target: 100, timeline: '2024', status: 'On Track' }
];

// Executive KPI data
export const executiveKpiData = {
  overallESGScore: {
    title: 'Overall ESG Score',
    value: '94',
    unit: '/100',
    change: 2.1,
    icon: AssessmentIcon,
    color: '#4caf50',
    description: 'Comprehensive ESG performance rating',
    status: 'Excellent'
  },
  environmentalScore: {
    title: 'Environmental Score',
    value: '90',
    unit: '/100',
    change: 2.2,
    icon: Co2Icon,
    color: '#2196f3',
    description: 'Environmental performance rating',
    status: 'Excellent'
  },
  socialScore: {
    title: 'Social Score',
    value: '97',
    unit: '/100',
    change: 2.0,
    icon: BusinessIcon,
    color: '#ff9800',
    description: 'Social responsibility rating',
    status: 'Outstanding'
  },
  governanceScore: {
    title: 'Governance Score',
    value: '95',
    unit: '/100',
    change: 2.3,
    icon: SecurityIcon,
    color: '#9c27b0',
    description: 'Governance and compliance rating',
    status: 'Excellent'
  },
  financialImpact: {
    title: 'Financial Impact',
    value: '$6.9M',
    unit: 'annual',
    change: 18.2,
    icon: AttachMoneyIcon,
    color: '#00bcd4',
    description: 'Total ESG financial value',
    status: 'Exceeding'
  },
  riskLevel: {
    title: 'Overall Risk Level',
    value: 'Low',
    unit: '',
    change: -15.0,
    icon: ShowChartIcon,
    color: '#f44336',
    description: 'Current ESG risk assessment',
    status: 'Favorable'
  }
};

interface ExecutiveKPICardProps {
  title: string;
  value: string;
  unit: string;
  change: number;
  icon: React.ElementType;
  color: string;
  description: string;
  status: string;
}

const ExecutiveKPICard: React.FC<ExecutiveKPICardProps> = ({
  title,
  value,
  unit,
  change,
  icon: Icon,
  color,
  description,
  status
}) => {
  const isPositive = change > 0;
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Excellent':
      case 'Outstanding':
      case 'Exceeding':
      case 'Favorable':
        return '#4caf50';
      case 'Good':
      case 'On Track':
        return '#2196f3';
      case 'At Risk':
      case 'Warning':
        return '#ff9800';
      case 'Critical':
      case 'Poor':
        return '#f44336';
      default:
        return '#666';
    }
  };
  
  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 3,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        border: `2px solid ${getStatusColor(status)}`,
        borderOpacity: 0.3
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
        <Icon sx={{ color: color, fontSize: 32 }} />
      </Box>
      
      <Typography variant="h2" component="div" sx={{ mb: 1, fontWeight: 'bold' }}>
        {value}
        <Typography component="span" variant="h5" sx={{ ml: 1, fontWeight: 'normal' }}>
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
            {Math.abs(change)}% from last quarter
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

const OverallESGScoreChart: React.FC = () => {
  return (
    <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
        Overall ESG Performance Trend
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={overallESGScoreData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
            dataKey="overallScore"
            stroke="#4caf50"
            strokeWidth={4}
            name="Overall ESG Score"
            dot={{ fill: '#4caf50', strokeWidth: 2, r: 5 }}
            activeDot={{ r: 8, stroke: '#4caf50', strokeWidth: 2 }}
          />
          <Line
            type="monotone"
            dataKey="environmental"
            stroke="#2196f3"
            strokeWidth={3}
            name="Environmental"
            dot={{ fill: '#2196f3', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#2196f3', strokeWidth: 2 }}
          />
          <Line
            type="monotone"
            dataKey="social"
            stroke="#ff9800"
            strokeWidth={3}
            name="Social"
            dot={{ fill: '#ff9800', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#ff9800', strokeWidth: 2 }}
          />
          <Line
            type="monotone"
            dataKey="governance"
            stroke="#9c27b0"
            strokeWidth={3}
            name="Governance"
            dot={{ fill: '#9c27b0', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#9c27b0', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Paper>
  );
};

const KeyMetricsChart: React.FC = () => {
  return (
    <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
        Key Performance Metrics vs Targets
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={keyMetricsData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <XAxis dataKey="metric" stroke="#666" fontSize={12} />
          <YAxis stroke="#666" fontSize={12} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#fff', 
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          />
          <Legend />
          <Bar dataKey="current" fill="#4caf50" name="Current" radius={[2, 2, 0, 0]} />
          <Bar dataKey="target" fill="#2196f3" name="Target" radius={[2, 2, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
};

const RiskAssessmentChart: React.FC = () => {
  return (
    <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
        ESG Risk Assessment
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={riskAssessmentData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
          <Bar dataKey="score" fill="#ff9800" name="Risk Score" radius={[2, 2, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
};

const StakeholderSentimentChart: React.FC = () => {
  return (
    <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
        Stakeholder Sentiment Trends
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={stakeholderSentimentData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
            dataKey="investors"
            stackId="1"
            stroke="#4caf50"
            fill="#4caf50"
            fillOpacity={0.8}
            name="Investors"
          />
          <Area
            type="monotone"
            dataKey="customers"
            stackId="1"
            stroke="#2196f3"
            fill="#2196f3"
            fillOpacity={0.8}
            name="Customers"
          />
          <Area
            type="monotone"
            dataKey="employees"
            stackId="1"
            stroke="#ff9800"
            fill="#ff9800"
            fillOpacity={0.8}
            name="Employees"
          />
          <Area
            type="monotone"
            dataKey="regulators"
            stackId="1"
            stroke="#9c27b0"
            fill="#9c27b0"
            fillOpacity={0.8}
            name="Regulators"
          />
        </AreaChart>
      </ResponsiveContainer>
    </Paper>
  );
};

const StrategicInitiativesChart: React.FC = () => {
  return (
    <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
        Strategic Initiatives Progress
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={strategicInitiativesData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <XAxis dataKey="initiative" stroke="#666" fontSize={12} />
          <YAxis stroke="#666" fontSize={12} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#fff', 
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          />
          <Legend />
          <Bar dataKey="progress" fill="#4caf50" name="Progress %" radius={[2, 2, 0, 0]} />
          <Bar dataKey="target" fill="#2196f3" name="Target %" radius={[2, 2, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export const ExecutiveSummaryDashboard: React.FC = () => {
  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 2, fontWeight: 700 }}>
        Executive ESG Summary
      </Typography>
      <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
        High-level overview of ESG performance, risks, and strategic initiatives for executive decision-making
      </Typography>
      
      {/* Critical Alerts */}
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>Executive Summary:</strong> ESG performance is strong with 94/100 overall score. 
          All major initiatives are on track. Board diversity target needs attention.
        </Typography>
      </Alert>
      
      {/* Executive KPI Cards */}
      <Box
        sx={{
          width: '100%',
          overflowX: 'auto',
          overflowY: 'hidden',
          '&::-webkit-scrollbar': {
            height: 8,
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: '#f1f1f1',
            borderRadius: 4,
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#c1c1c1',
            borderRadius: 4,
            '&:hover': {
              backgroundColor: '#a8a8a8',
            },
          },
          mb: 4
        }}
      >
        <Box
          sx={{
            display: 'flex',
            gap: 3,
            minWidth: 'max-content',
            pb: 1,
            '& > *': {
              flexShrink: 0,
              width: {
                xs: '280px',
                sm: '300px',
                md: '320px'
              }
            }
          }}
        >
          {Object.entries(executiveKpiData).map(([key, data]) => (
            <Box key={key}>
              <ExecutiveKPICard {...data} />
            </Box>
          ))}
        </Box>
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
          <OverallESGScoreChart />
        </Box>
        <Box>
          <KeyMetricsChart />
        </Box>
        <Box>
          <RiskAssessmentChart />
        </Box>
        <Box>
          <StakeholderSentimentChart />
        </Box>
        <Box sx={{ gridColumn: { xs: '1', lg: '1 / 3' } }}>
          <StrategicInitiativesChart />
        </Box>
      </Box>
    </Box>
  );
};

export default ExecutiveSummaryDashboard; 