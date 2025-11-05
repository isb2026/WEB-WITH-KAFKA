import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import SecurityIcon from '@mui/icons-material/Security';
import AssessmentIcon from '@mui/icons-material/Assessment';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// Mock data for governance metrics
const complianceTrendData = [
  { month: 'Jan', complianceRate: 85, riskScore: 65, auditFindings: 12 },
  { month: 'Feb', complianceRate: 87, riskScore: 62, auditFindings: 10 },
  { month: 'Mar', complianceRate: 89, riskScore: 58, auditFindings: 8 },
  { month: 'Apr', complianceRate: 91, riskScore: 55, auditFindings: 7 },
  { month: 'May', complianceRate: 93, riskScore: 52, auditFindings: 6 },
  { month: 'Jun', complianceRate: 94, riskScore: 48, auditFindings: 5 },
  { month: 'Jul', complianceRate: 95, riskScore: 45, auditFindings: 4 },
  { month: 'Aug', complianceRate: 96, riskScore: 42, auditFindings: 3 },
  { month: 'Sep', complianceRate: 97, riskScore: 40, auditFindings: 2 },
  { month: 'Oct', complianceRate: 98, riskScore: 38, auditFindings: 2 },
  { month: 'Nov', complianceRate: 98, riskScore: 35, auditFindings: 1 },
  { month: 'Dec', complianceRate: 99, riskScore: 32, auditFindings: 1 }
];

const riskDistributionData = [
  { name: 'Low Risk', value: 45, color: '#4caf50' },
  { name: 'Medium Risk', value: 35, color: '#ff9800' },
  { name: 'High Risk', value: 15, color: '#f44336' },
  { name: 'Critical Risk', value: 5, color: '#9c27b0' }
];

const auditResolutionData = [
  { month: 'Jan', resolved: 8, pending: 4 },
  { month: 'Feb', resolved: 7, pending: 3 },
  { month: 'Mar', resolved: 6, pending: 2 },
  { month: 'Apr', resolved: 5, pending: 2 },
  { month: 'May', resolved: 4, pending: 2 },
  { month: 'Jun', resolved: 3, pending: 2 },
  { month: 'Jul', resolved: 3, pending: 1 },
  { month: 'Aug', resolved: 2, pending: 1 },
  { month: 'Sep', resolved: 2, pending: 0 },
  { month: 'Oct', resolved: 1, pending: 1 },
  { month: 'Nov', resolved: 1, pending: 0 },
  { month: 'Dec', resolved: 1, pending: 0 }
];

// Governance KPI data
export const governanceKpiData = {
  complianceRate: {
    title: 'Overall Compliance Rate',
    value: '99',
    unit: '%',
    change: 1.2,
    icon: CheckCircleIcon,
    color: '#4caf50',
    description: 'Regulatory compliance across all departments'
  },
  auditFindings: {
    title: 'Open Audit Findings',
    value: '1',
    unit: 'findings',
    change: -50.0,
    icon: AssessmentIcon,
    color: '#2196f3',
    description: 'Remaining audit findings to be resolved'
  },
  riskScore: {
    title: 'Risk Assessment Score',
    value: '32',
    unit: 'points',
    change: -8.6,
    icon: SecurityIcon,
    color: '#ff9800',
    description: 'Overall organizational risk level (0-100)'
  },
  policyViolations: {
    title: 'Policy Violations',
    value: '2',
    unit: 'incidents',
    change: -33.3,
    icon: WarningIcon,
    color: '#f44336',
    description: 'Policy violation incidents this quarter'
  }
};

interface GovernanceKPICardProps {
  title: string;
  value: string;
  unit: string;
  change: number;
  icon: React.ElementType;
  color: string;
  description: string;
}

const GovernanceKPICard: React.FC<GovernanceKPICardProps> = ({
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
          {Math.abs(change)}% from last quarter
        </Typography>
      </Box>
    </Paper>
  );
};

const ComplianceTrendChart: React.FC = () => {
  return (
    <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
        Compliance & Risk Trends
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={complianceTrendData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
            dataKey="complianceRate"
            stroke="#4caf50"
            strokeWidth={3}
            name="Compliance Rate (%)"
            dot={{ fill: '#4caf50', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#4caf50', strokeWidth: 2 }}
          />
          <Line
            type="monotone"
            dataKey="riskScore"
            stroke="#ff9800"
            strokeWidth={3}
            name="Risk Score"
            dot={{ fill: '#ff9800', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#ff9800', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Paper>
  );
};

const RiskDistributionChart: React.FC = () => {
  return (
    <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
        Risk Distribution
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={riskDistributionData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {riskDistributionData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#fff', 
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </Paper>
  );
};

const AuditResolutionChart: React.FC = () => {
  return (
    <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
        Audit Resolution Progress
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={auditResolutionData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
          <Bar dataKey="resolved" fill="#4caf50" name="Resolved" radius={[2, 2, 0, 0]} />
          <Bar dataKey="pending" fill="#ff9800" name="Pending" radius={[2, 2, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export const GovernanceMetrics: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {/* KPI Cards Section */}
      <Box>
        <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
          Governance & Compliance Overview
        </Typography>
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
          {Object.entries(governanceKpiData).map(([key, data]) => (
            <Box key={key}>
              <GovernanceKPICard {...data} />
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
            md: 'repeat(2, 1fr)',
            lg: 'repeat(3, 1fr)'
          }
        }}
      >
        <Box sx={{ gridColumn: { xs: '1', md: '1 / 3' } }}>
          <ComplianceTrendChart />
        </Box>
        <Box>
          <RiskDistributionChart />
        </Box>
        <Box>
          <AuditResolutionChart />
        </Box>
      </Box>
    </Box>
  );
};

export default GovernanceMetrics; 