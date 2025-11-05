import React from 'react';
import { Box, Paper, Typography, Alert } from '@mui/material';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend, AreaChart, Area } from 'recharts';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import DataUsageIcon from '@mui/icons-material/DataUsage';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import VerifiedIcon from '@mui/icons-material/Verified';
import AssessmentIcon from '@mui/icons-material/Assessment';
import TimelineIcon from '@mui/icons-material/Timeline';
import SecurityIcon from '@mui/icons-material/Security';

// Mock data for data quality metrics
const dataQualityTrendsData = [
  { month: 'Jan', overallQuality: 78, completeness: 82, accuracy: 85, reliability: 80 },
  { month: 'Feb', overallQuality: 81, completeness: 85, accuracy: 87, reliability: 83 },
  { month: 'Mar', overallQuality: 84, completeness: 88, accuracy: 89, reliability: 86 },
  { month: 'Apr', overallQuality: 86, completeness: 90, accuracy: 91, reliability: 88 },
  { month: 'May', overallQuality: 88, completeness: 92, accuracy: 93, reliability: 90 },
  { month: 'Jun', overallQuality: 90, completeness: 94, accuracy: 94, reliability: 92 },
  { month: 'Jul', overallQuality: 91, completeness: 95, accuracy: 95, reliability: 93 },
  { month: 'Aug', overallQuality: 92, completeness: 96, accuracy: 96, reliability: 94 },
  { month: 'Sep', overallQuality: 93, completeness: 97, accuracy: 97, reliability: 95 },
  { month: 'Oct', overallQuality: 94, completeness: 98, accuracy: 98, reliability: 96 },
  { month: 'Nov', overallQuality: 95, completeness: 99, accuracy: 99, reliability: 97 },
  { month: 'Dec', overallQuality: 96, completeness: 99, accuracy: 99, reliability: 98 }
];

const dataCompletenessData = [
  { category: 'Environmental', totalMetrics: 45, complete: 42, partial: 2, missing: 1, percentage: 93 },
  { category: 'Social', totalMetrics: 38, complete: 36, partial: 1, missing: 1, percentage: 95 },
  { category: 'Governance', totalMetrics: 32, complete: 31, partial: 1, missing: 0, percentage: 97 },
  { category: 'Financial ESG', totalMetrics: 28, complete: 26, partial: 2, missing: 0, percentage: 93 },
  { category: 'Supply Chain', totalMetrics: 35, complete: 32, partial: 2, missing: 1, percentage: 91 },
  { category: 'Stakeholder', totalMetrics: 22, complete: 21, partial: 1, missing: 0, percentage: 95 }
];

const validationResultsData = [
  { month: 'Jan', passed: 1250, failed: 45, pending: 12, successRate: 96.5 },
  { month: 'Feb', passed: 1280, failed: 38, pending: 8, successRate: 97.1 },
  { month: 'Mar', passed: 1310, failed: 32, pending: 6, successRate: 97.6 },
  { month: 'Apr', passed: 1340, failed: 28, pending: 5, successRate: 98.0 },
  { month: 'May', passed: 1370, failed: 25, pending: 4, successRate: 98.2 },
  { month: 'Jun', passed: 1400, failed: 22, pending: 3, successRate: 98.5 },
  { month: 'Jul', passed: 1430, failed: 20, pending: 2, successRate: 98.6 },
  { month: 'Aug', passed: 1460, failed: 18, pending: 2, successRate: 98.8 },
  { month: 'Sep', passed: 1490, failed: 16, pending: 1, successRate: 98.9 },
  { month: 'Oct', passed: 1520, failed: 15, pending: 1, successRate: 99.0 },
  { month: 'Nov', passed: 1550, failed: 14, pending: 1, successRate: 99.1 },
  { month: 'Dec', passed: 1580, failed: 12, pending: 1, successRate: 99.2 }
];

const complianceStatusData = [
  { framework: 'GRI Standards', compliance: 96, lastAudit: '2024-01-15', nextAudit: '2024-07-15', status: 'Compliant' },
  { framework: 'SASB Standards', compliance: 94, lastAudit: '2024-02-01', nextAudit: '2024-08-01', status: 'Compliant' },
  { framework: 'TCFD Framework', compliance: 92, lastAudit: '2024-01-30', nextAudit: '2024-07-30', status: 'Compliant' },
  { framework: 'CDP Reporting', compliance: 98, lastAudit: '2024-03-01', nextAudit: '2024-09-01', status: 'Compliant' },
  { framework: 'ISO 14001', compliance: 95, lastAudit: '2024-02-15', nextAudit: '2024-08-15', status: 'Compliant' },
  { framework: 'Local Regulations', compliance: 99, lastAudit: '2024-01-01', nextAudit: '2024-07-01', status: 'Compliant' }
];

const errorAnalysisData = [
  { category: 'Data Format', count: 8, severity: 'Low', resolutionTime: 2.5 },
  { category: 'Missing Values', count: 12, severity: 'Medium', resolutionTime: 4.2 },
  { category: 'Outlier Detection', count: 5, severity: 'Low', resolutionTime: 1.8 },
  { category: 'Validation Rules', count: 3, severity: 'High', resolutionTime: 8.5 },
  { category: 'Source Integration', count: 7, severity: 'Medium', resolutionTime: 6.1 },
  { category: 'Data Consistency', count: 4, severity: 'Medium', resolutionTime: 5.3 }
];

// Data Quality KPI data
export const dataQualityKpiData = {
  overallQualityScore: {
    title: 'Overall Data Quality Score',
    value: '96',
    unit: '/100',
    change: 1.2,
    icon: DataUsageIcon,
    color: '#4caf50',
    description: 'Comprehensive data quality assessment'
  },
  dataCompleteness: {
    title: 'Data Completeness Rate',
    value: '99',
    unit: '%',
    change: 0.5,
    icon: CheckCircleIcon,
    color: '#2196f3',
    description: 'Percentage of required data collected'
  },
  validationSuccess: {
    title: 'Validation Success Rate',
    value: '99.2',
    unit: '%',
    change: 0.3,
    icon: VerifiedIcon,
    color: '#ff9800',
    description: 'Automated validation pass rate'
  },
  sourceReliability: {
    title: 'Source Reliability Score',
    value: '94',
    unit: '/100',
    change: 1.8,
    icon: SecurityIcon,
    color: '#9c27b0',
    description: 'Average reliability of data sources'
  },
  complianceRate: {
    title: 'Compliance Rate',
    value: '96',
    unit: '%',
    change: 2.1,
    icon: AssessmentIcon,
    color: '#00bcd4',
    description: 'Regulatory compliance status'
  },
  errorResolution: {
    title: 'Error Resolution Time',
    value: '4.2',
    unit: 'days',
    change: -15.3,
    icon: TimelineIcon,
    color: '#f44336',
    description: 'Average time to resolve data issues'
  }
};

interface DataQualityKPICardProps {
  title: string;
  value: string;
  unit: string;
  change: number;
  icon: React.ElementType;
  color: string;
  description: string;
}

const DataQualityKPICard: React.FC<DataQualityKPICardProps> = ({
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
          {Math.abs(change)}% from last month
        </Typography>
      </Box>
    </Paper>
  );
};

const DataQualityTrendsChart: React.FC = () => {
  return (
    <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
        Data Quality Trends
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={dataQualityTrendsData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
            dataKey="overallQuality"
            stroke="#4caf50"
            strokeWidth={3}
            name="Overall Quality"
            dot={{ fill: '#4caf50', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#4caf50', strokeWidth: 2 }}
          />
          <Line
            type="monotone"
            dataKey="completeness"
            stroke="#2196f3"
            strokeWidth={3}
            name="Completeness"
            dot={{ fill: '#2196f3', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#2196f3', strokeWidth: 2 }}
          />
          <Line
            type="monotone"
            dataKey="accuracy"
            stroke="#ff9800"
            strokeWidth={3}
            name="Accuracy"
            dot={{ fill: '#ff9800', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#ff9800', strokeWidth: 2 }}
          />
          <Line
            type="monotone"
            dataKey="reliability"
            stroke="#9c27b0"
            strokeWidth={3}
            name="Reliability"
            dot={{ fill: '#9c27b0', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#9c27b0', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Paper>
  );
};

const DataCompletenessChart: React.FC = () => {
  return (
    <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
        Data Completeness by Category
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={dataCompletenessData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <XAxis dataKey="category" stroke="#666" fontSize={12} />
          <YAxis stroke="#666" fontSize={12} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#fff', 
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
            formatter={(value: any) => [`${value}%`, 'Completeness']}
          />
          <Legend />
          <Bar dataKey="percentage" fill="#4caf50" name="Completeness %" radius={[2, 2, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
};

const ValidationResultsChart: React.FC = () => {
  return (
    <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
        Data Validation Results
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={validationResultsData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
            dataKey="passed"
            stackId="1"
            stroke="#4caf50"
            fill="#4caf50"
            fillOpacity={0.8}
            name="Passed Validations"
          />
          <Area
            type="monotone"
            dataKey="failed"
            stackId="1"
            stroke="#f44336"
            fill="#f44336"
            fillOpacity={0.8}
            name="Failed Validations"
          />
          <Area
            type="monotone"
            dataKey="pending"
            stackId="1"
            stroke="#ff9800"
            fill="#ff9800"
            fillOpacity={0.8}
            name="Pending Validations"
          />
        </AreaChart>
      </ResponsiveContainer>
    </Paper>
  );
};

const ComplianceStatusChart: React.FC = () => {
  return (
    <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
        Compliance Status by Framework
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={complianceStatusData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <XAxis dataKey="framework" stroke="#666" fontSize={12} />
          <YAxis stroke="#666" fontSize={12} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#fff', 
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
            formatter={(value: any) => [`${value}%`, 'Compliance']}
          />
          <Legend />
          <Bar dataKey="compliance" fill="#00bcd4" name="Compliance %" radius={[2, 2, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
};

const ErrorAnalysisChart: React.FC = () => {
  return (
    <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
        Data Error Analysis
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={errorAnalysisData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
          <Bar dataKey="count" fill="#f44336" name="Error Count" radius={[2, 2, 0, 0]} />
          <Bar dataKey="resolutionTime" fill="#ff9800" name="Resolution Time (days)" radius={[2, 2, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export const CompanyDataQualityDashboard: React.FC = () => {
  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 4, fontWeight: 600 }}>
        Company Data Quality Dashboard
      </Typography>
      
      {/* Alert for Critical Issues */}
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>Data Quality Status:</strong> All systems operational. 2 minor validation warnings detected.
        </Typography>
      </Alert>
      
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
        {Object.entries(dataQualityKpiData).map(([key, data]) => (
          <Box key={key}>
            <DataQualityKPICard {...data} />
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
          <DataQualityTrendsChart />
        </Box>
        <Box>
          <DataCompletenessChart />
        </Box>
        <Box>
          <ValidationResultsChart />
        </Box>
        <Box>
          <ComplianceStatusChart />
        </Box>
        <Box sx={{ gridColumn: { xs: '1', lg: '1 / 3' } }}>
          <ErrorAnalysisChart />
        </Box>
      </Box>
    </Box>
  );
};

export default CompanyDataQualityDashboard; 