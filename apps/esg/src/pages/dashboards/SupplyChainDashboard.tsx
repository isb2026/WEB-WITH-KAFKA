import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend, ScatterChart, Scatter } from 'recharts';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import BusinessIcon from '@mui/icons-material/Business';
import AssessmentIcon from '@mui/icons-material/Assessment';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';

// Mock data for supply chain ESG metrics
const supplierPerformanceData = [
  { month: 'Jan', avgESGScore: 72, complianceRate: 85, riskScore: 28, sustainabilityScore: 68 },
  { month: 'Feb', avgESGScore: 74, complianceRate: 87, riskScore: 26, sustainabilityScore: 70 },
  { month: 'Mar', avgESGScore: 76, complianceRate: 89, riskScore: 24, sustainabilityScore: 72 },
  { month: 'Apr', avgESGScore: 78, complianceRate: 91, riskScore: 22, sustainabilityScore: 74 },
  { month: 'May', avgESGScore: 80, complianceRate: 93, riskScore: 20, sustainabilityScore: 76 },
  { month: 'Jun', avgESGScore: 82, complianceRate: 95, riskScore: 18, sustainabilityScore: 78 },
  { month: 'Jul', avgESGScore: 84, complianceRate: 96, riskScore: 16, sustainabilityScore: 80 },
  { month: 'Aug', avgESGScore: 86, complianceRate: 97, riskScore: 14, sustainabilityScore: 82 },
  { month: 'Sep', avgESGScore: 88, complianceRate: 98, riskScore: 12, sustainabilityScore: 84 },
  { month: 'Oct', avgESGScore: 90, complianceRate: 99, riskScore: 10, sustainabilityScore: 86 },
  { month: 'Nov', avgESGScore: 92, complianceRate: 99, riskScore: 8, sustainabilityScore: 88 },
  { month: 'Dec', avgESGScore: 94, complianceRate: 99, riskScore: 6, sustainabilityScore: 90 }
];

const supplierCategoriesData = [
  { category: 'Raw Materials', totalSuppliers: 45, compliant: 42, nonCompliant: 3, avgScore: 88 },
  { category: 'Manufacturing', totalSuppliers: 32, compliant: 30, nonCompliant: 2, avgScore: 85 },
  { category: 'Logistics', totalSuppliers: 28, compliant: 26, nonCompliant: 2, avgScore: 82 },
  { category: 'Packaging', totalSuppliers: 18, compliant: 17, nonCompliant: 1, avgScore: 90 },
  { category: 'Services', totalSuppliers: 25, compliant: 24, nonCompliant: 1, avgScore: 87 },
  { category: 'Technology', totalSuppliers: 15, compliant: 14, nonCompliant: 1, avgScore: 92 }
];

const supplierRiskData = [
  { supplier: 'Supplier A', esgScore: 95, riskLevel: 'Low', spend: 500000, location: 'USA' },
  { supplier: 'Supplier B', esgScore: 78, riskLevel: 'Medium', spend: 750000, location: 'Germany' },
  { supplier: 'Supplier C', esgScore: 65, riskLevel: 'High', spend: 300000, location: 'China' },
  { supplier: 'Supplier D', esgScore: 88, riskLevel: 'Low', spend: 450000, location: 'Canada' },
  { supplier: 'Supplier E', esgScore: 72, riskLevel: 'Medium', spend: 600000, location: 'Japan' },
  { supplier: 'Supplier F', esgScore: 82, riskLevel: 'Low', spend: 350000, location: 'UK' },
  { supplier: 'Supplier G', esgScore: 58, riskLevel: 'High', spend: 200000, location: 'India' },
  { supplier: 'Supplier H', esgScore: 91, riskLevel: 'Low', spend: 400000, location: 'Australia' }
];

const sustainableSourcingData = [
  { month: 'Jan', sustainableSpend: 65, totalSpend: 100, percentage: 65 },
  { month: 'Feb', sustainableSpend: 68, totalSpend: 100, percentage: 68 },
  { month: 'Mar', sustainableSpend: 72, totalSpend: 100, percentage: 72 },
  { month: 'Apr', sustainableSpend: 75, totalSpend: 100, percentage: 75 },
  { month: 'May', sustainableSpend: 78, totalSpend: 100, percentage: 78 },
  { month: 'Jun', sustainableSpend: 82, totalSpend: 100, percentage: 82 },
  { month: 'Jul', sustainableSpend: 85, totalSpend: 100, percentage: 85 },
  { month: 'Aug', sustainableSpend: 88, totalSpend: 100, percentage: 88 },
  { month: 'Sep', sustainableSpend: 90, totalSpend: 100, percentage: 90 },
  { month: 'Oct', sustainableSpend: 92, totalSpend: 100, percentage: 92 },
  { month: 'Nov', sustainableSpend: 94, totalSpend: 100, percentage: 94 },
  { month: 'Dec', sustainableSpend: 96, totalSpend: 100, percentage: 96 }
];

const supplierDiversityData = [
  { category: 'Women-Owned', count: 25, percentage: 18, target: 20 },
  { category: 'Minority-Owned', count: 32, percentage: 23, target: 25 },
  { category: 'Veteran-Owned', count: 15, percentage: 11, target: 10 },
  { category: 'LGBTQ+-Owned', count: 8, percentage: 6, target: 5 },
  { category: 'Disability-Owned', count: 12, percentage: 9, target: 8 },
  { category: 'Small Business', count: 45, percentage: 33, target: 30 }
];

const complianceIssuesData = [
  { month: 'Jan', environmental: 8, social: 5, governance: 3, total: 16 },
  { month: 'Feb', environmental: 7, social: 4, governance: 2, total: 13 },
  { month: 'Mar', environmental: 6, social: 3, governance: 2, total: 11 },
  { month: 'Apr', environmental: 5, social: 3, governance: 1, total: 9 },
  { month: 'May', environmental: 4, social: 2, governance: 1, total: 7 },
  { month: 'Jun', environmental: 3, social: 2, governance: 1, total: 6 },
  { month: 'Jul', environmental: 3, social: 1, governance: 1, total: 5 },
  { month: 'Aug', environmental: 2, social: 1, governance: 0, total: 3 },
  { month: 'Sep', environmental: 2, social: 1, governance: 0, total: 3 },
  { month: 'Oct', environmental: 1, social: 1, governance: 0, total: 2 },
  { month: 'Nov', environmental: 1, social: 0, governance: 0, total: 1 },
  { month: 'Dec', environmental: 1, social: 0, governance: 0, total: 1 }
];

// Supply Chain KPI data
export const supplyChainKpiData = {
  avgSupplierESGScore: {
    title: 'Average Supplier ESG Score',
    value: '94',
    unit: 'points',
    change: 2.1,
    icon: AssessmentIcon,
    color: '#4caf50',
    description: 'Average ESG score across all suppliers'
  },
  complianceRate: {
    title: 'Supplier Compliance Rate',
    value: '99',
    unit: '%',
    change: 1.0,
    icon: CheckCircleIcon,
    color: '#2196f3',
    description: 'Percentage of suppliers meeting ESG standards'
  },
  sustainableSourcing: {
    title: 'Sustainable Sourcing',
    value: '96',
    unit: '%',
    change: 2.1,
    icon: BusinessIcon,
    color: '#ff9800',
    description: 'Percentage of spend on sustainable suppliers'
  },
  highRiskSuppliers: {
    title: 'High-Risk Suppliers',
    value: '2',
    unit: 'suppliers',
    change: -50.0,
    icon: WarningIcon,
    color: '#f44336',
    description: 'Number of suppliers requiring immediate attention'
  },
  supplierDiversity: {
    title: 'Supplier Diversity',
    value: '33',
    unit: '%',
    change: 3.0,
    icon: Diversity3Icon,
    color: '#9c27b0',
    description: 'Percentage of diverse-owned suppliers'
  },
  totalSuppliers: {
    title: 'Total Active Suppliers',
    value: '138',
    unit: 'suppliers',
    change: 5.3,
    icon: LocalShippingIcon,
    color: '#00bcd4',
    description: 'Total number of active supplier relationships'
  }
};

interface SupplyChainKPICardProps {
  title: string;
  value: string;
  unit: string;
  change: number;
  icon: React.ElementType;
  color: string;
  description: string;
}

const SupplyChainKPICard: React.FC<SupplyChainKPICardProps> = ({
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

const SupplierPerformanceChart: React.FC = () => {
  return (
    <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
        Supplier Performance Trends
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={supplierPerformanceData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
            dataKey="avgESGScore"
            stroke="#4caf50"
            strokeWidth={3}
            name="ESG Score"
            dot={{ fill: '#4caf50', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#4caf50', strokeWidth: 2 }}
          />
          <Line
            type="monotone"
            dataKey="complianceRate"
            stroke="#2196f3"
            strokeWidth={3}
            name="Compliance Rate (%)"
            dot={{ fill: '#2196f3', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#2196f3', strokeWidth: 2 }}
          />
          <Line
            type="monotone"
            dataKey="sustainabilityScore"
            stroke="#ff9800"
            strokeWidth={3}
            name="Sustainability Score"
            dot={{ fill: '#ff9800', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#ff9800', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Paper>
  );
};

const SupplierRiskChart: React.FC = () => {
  return (
    <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
        Supplier Risk Assessment
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <ScatterChart data={supplierRiskData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <XAxis dataKey="esgScore" stroke="#666" fontSize={12} name="ESG Score" />
          <YAxis stroke="#666" fontSize={12} name="Spend ($K)" />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#fff', 
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
            formatter={(value: any, name: any, props: any) => [
              `$${(value/1000).toFixed(0)}K`, 
              'Spend'
            ]}
          />
          <Legend />
          <Scatter 
            dataKey="spend" 
            fill="#4caf50" 
            name="Low Risk"
            data={supplierRiskData.filter(d => d.riskLevel === 'Low')}
          />
          <Scatter 
            dataKey="spend" 
            fill="#ff9800" 
            name="Medium Risk"
            data={supplierRiskData.filter(d => d.riskLevel === 'Medium')}
          />
          <Scatter 
            dataKey="spend" 
            fill="#f44336" 
            name="High Risk"
            data={supplierRiskData.filter(d => d.riskLevel === 'High')}
          />
        </ScatterChart>
      </ResponsiveContainer>
    </Paper>
  );
};

const SustainableSourcingChart: React.FC = () => {
  return (
    <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
        Sustainable Sourcing Progress
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={sustainableSourcingData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <XAxis dataKey="month" stroke="#666" fontSize={12} />
          <YAxis stroke="#666" fontSize={12} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#fff', 
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
            formatter={(value: any) => [`${value}%`, 'Sustainable Spend']}
          />
          <Legend />
          <Bar dataKey="percentage" fill="#4caf50" name="Sustainable Sourcing %" radius={[2, 2, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
};

const SupplierDiversityChart: React.FC = () => {
  return (
    <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
        Supplier Diversity Breakdown
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={supplierDiversityData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
          <Bar dataKey="percentage" fill="#9c27b0" name="Current %" radius={[2, 2, 0, 0]} />
          <Bar dataKey="target" fill="#ff9800" name="Target %" radius={[2, 2, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
};

const ComplianceIssuesChart: React.FC = () => {
  return (
    <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
        Compliance Issues by Category
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={complianceIssuesData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
            dataKey="environmental"
            stroke="#4caf50"
            strokeWidth={3}
            name="Environmental Issues"
            dot={{ fill: '#4caf50', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#4caf50', strokeWidth: 2 }}
          />
          <Line
            type="monotone"
            dataKey="social"
            stroke="#2196f3"
            strokeWidth={3}
            name="Social Issues"
            dot={{ fill: '#2196f3', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#2196f3', strokeWidth: 2 }}
          />
          <Line
            type="monotone"
            dataKey="governance"
            stroke="#ff9800"
            strokeWidth={3}
            name="Governance Issues"
            dot={{ fill: '#ff9800', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#ff9800', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export const SupplyChainDashboard: React.FC = () => {
  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 4, fontWeight: 600 }}>
        Supply Chain ESG Performance
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
        {Object.entries(supplyChainKpiData).map(([key, data]) => (
          <Box key={key}>
            <SupplyChainKPICard {...data} />
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
          <SupplierPerformanceChart />
        </Box>
        <Box>
          <SupplierRiskChart />
        </Box>
        <Box>
          <SustainableSourcingChart />
        </Box>
        <Box>
          <SupplierDiversityChart />
        </Box>
        <Box sx={{ gridColumn: { xs: '1', lg: '1 / 3' } }}>
          <ComplianceIssuesChart />
        </Box>
      </Box>
    </Box>
  );
};

export default SupplyChainDashboard; 