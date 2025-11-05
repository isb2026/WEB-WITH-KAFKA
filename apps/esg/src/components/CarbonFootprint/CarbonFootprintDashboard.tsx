import React, { useState } from 'react';
import { Box, Typography, Grid } from '@mui/material';
import { CarbonFootprintCard } from './CarbonFootprintCard';
import { EmissionsSourceBreakdown } from './EmissionsSourceBreakdown';
import { HistoricalComparison } from './HistoricalComparison';
import { CarbonIntensityMetrics } from './CarbonIntensityMetrics';
import { CarbonOffsetTracking } from './CarbonOffsetTracking';
import { CarbonAlerts } from './CarbonAlerts';
import FactoryIcon from '@mui/icons-material/Factory';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import HomeIcon from '@mui/icons-material/Home';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import ForestIcon from '@mui/icons-material/Forest';
import SolarPowerIcon from '@mui/icons-material/SolarPower';
import WaterIcon from '@mui/icons-material/Water';
import NatureIcon from '@mui/icons-material/Nature';

// Mock data for the dashboard
const mockEmissionsSources = [
  {
    name: 'Manufacturing',
    value: 45,
    percentage: 45,
    color: '#0088FE',
    icon: <FactoryIcon />
  },
  {
    name: 'Transportation',
    value: 25,
    percentage: 25,
    color: '#00C49F',
    icon: <DirectionsCarIcon />
  },
  {
    name: 'Buildings',
    value: 15,
    percentage: 15,
    color: '#FFBB28',
    icon: <HomeIcon />
  },
  {
    name: 'Logistics',
    value: 10,
    percentage: 10,
    color: '#FF8042',
    icon: <LocalShippingIcon />
  },
  {
    name: 'Energy',
    value: 5,
    percentage: 5,
    color: '#8884D8',
    icon: <ElectricBoltIcon />
  }
];

const mockHistoricalData = [
  { date: 'Jan', emissions: 120, target: 100, scope1: 60, scope2: 40, scope3: 20 },
  { date: 'Feb', emissions: 115, target: 100, scope1: 58, scope2: 38, scope3: 19 },
  { date: 'Mar', emissions: 110, target: 100, scope1: 55, scope2: 35, scope3: 20 },
  { date: 'Apr', emissions: 105, target: 100, scope1: 52, scope2: 33, scope3: 20 },
  { date: 'May', emissions: 100, target: 100, scope1: 50, scope2: 30, scope3: 20 },
  { date: 'Jun', emissions: 95, target: 100, scope1: 48, scope2: 28, scope3: 19 },
  { date: 'Jul', emissions: 90, target: 100, scope1: 45, scope2: 25, scope3: 20 },
  { date: 'Aug', emissions: 85, target: 100, scope1: 42, scope2: 23, scope3: 20 },
  { date: 'Sep', emissions: 80, target: 100, scope1: 40, scope2: 20, scope3: 20 },
  { date: 'Oct', emissions: 75, target: 100, scope1: 38, scope2: 18, scope3: 19 },
  { date: 'Nov', emissions: 70, target: 100, scope1: 35, scope2: 15, scope3: 20 },
  { date: 'Dec', emissions: 65, target: 100, scope1: 32, scope2: 13, scope3: 20 }
];

const mockOffsetProjects = [
  {
    id: '1',
    name: 'Amazon Reforestation',
    type: 'reforestation' as const,
    location: 'Brazil',
    credits: 1500,
    totalCredits: 2000,
    status: 'active' as const,
    startDate: '2023-01-01',
    endDate: '2025-12-31',
    icon: <ForestIcon />,
    color: '#4caf50'
  },
  {
    id: '2',
    name: 'Solar Farm Project',
    type: 'renewable-energy' as const,
    location: 'India',
    credits: 800,
    totalCredits: 1200,
    status: 'active' as const,
    startDate: '2023-03-01',
    endDate: '2024-12-31',
    icon: <SolarPowerIcon />,
    color: '#ff9800'
  },
  {
    id: '3',
    name: 'Ocean Cleanup Initiative',
    type: 'ocean-conservation' as const,
    location: 'Pacific Ocean',
    credits: 600,
    totalCredits: 1000,
    status: 'pending' as const,
    startDate: '2023-06-01',
    endDate: '2025-06-30',
    icon: <WaterIcon />,
    color: '#2196f3'
  },
  {
    id: '4',
    name: 'Landfill Gas Capture',
    type: 'methane-capture' as const,
    location: 'USA',
    credits: 1200,
    totalCredits: 1500,
    status: 'completed' as const,
    startDate: '2022-01-01',
    endDate: '2023-12-31',
    icon: <NatureIcon />,
    color: '#9c27b0'
  }
];

const mockAlerts = [
  {
    id: '1',
    type: 'warning' as const,
    title: 'High Emissions Alert',
    message: 'Manufacturing facility emissions exceeded daily target by 15%',
    timestamp: '2 hours ago',
    severity: 'medium' as const,
    source: 'Factory A',
    resolved: false,
    emissionsThreshold: 50,
    currentEmissions: 57.5
  },
  {
    id: '2',
    type: 'error' as const,
    title: 'Critical Emissions Spike',
    message: 'Transportation emissions increased by 25% compared to yesterday',
    timestamp: '1 hour ago',
    severity: 'high' as const,
    source: 'Logistics',
    resolved: false,
    emissionsThreshold: 30,
    currentEmissions: 37.5
  },
  {
    id: '3',
    type: 'info' as const,
    title: 'Offset Project Update',
    message: 'Solar farm project reached 75% completion milestone',
    timestamp: '30 minutes ago',
    severity: 'low' as const,
    source: 'Offset Tracking',
    resolved: true,
    emissionsThreshold: 0,
    currentEmissions: 0
  }
];

const mockAlertTrends = [
  { time: '00:00', alerts: 2, resolved: 1 },
  { time: '04:00', alerts: 1, resolved: 0 },
  { time: '08:00', alerts: 3, resolved: 2 },
  { time: '12:00', alerts: 5, resolved: 3 },
  { time: '16:00', alerts: 4, resolved: 4 },
  { time: '20:00', alerts: 2, resolved: 1 },
  { time: '24:00', alerts: 1, resolved: 0 }
];

export const CarbonFootprintDashboard: React.FC = () => {
  const [historicalPeriod, setHistoricalPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly');

  const handleResolveAlert = (alertId: string) => {
    console.log('Resolving alert:', alertId);
    // In a real app, this would update the alert status
  };

  const handleDismissAlert = (alertId: string) => {
    console.log('Dismissing alert:', alertId);
    // In a real app, this would dismiss the alert
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 600, color: '#2e7d32' }}>
        🌱 Carbon Footprint Dashboard
      </Typography>
      
      {/* Main Metrics Row */}
      <Box
        sx={{
          display: 'grid',
          gap: 3,
          gridTemplateColumns: {
            xs: '1fr',
            lg: 'repeat(2, 1fr)'
          },
          mb: 4
        }}
      >
        <CarbonFootprintCard
          currentEmissions="65.2"
          dailyTarget="100"
          monthlyTotal="1,956"
          yearToDate="23,472"
          trend="-12.5%"
          status="On Track"
          progress={65}
        />
        <EmissionsSourceBreakdown
          sources={mockEmissionsSources}
          totalEmissions="100.0"
        />
      </Box>

      {/* Historical Comparison and Intensity Metrics */}
      <Box
        sx={{
          display: 'grid',
          gap: 3,
          gridTemplateColumns: {
            xs: '1fr',
            lg: 'repeat(2, 1fr)'
          },
          mb: 4
        }}
      >
        <HistoricalComparison
          data={mockHistoricalData}
          period={historicalPeriod}
          onPeriodChange={setHistoricalPeriod}
          totalReduction="35.0"
          reductionPercentage={12.5}
          comparisonPeriod="last month"
        />
        <CarbonIntensityMetrics
          revenueIntensity={{
            name: 'Revenue',
            current: 0.85,
            target: 1.0,
            previous: 0.95,
            unit: 'CO2e/$M',
            trend: -10.5
          }}
          productionIntensity={{
            name: 'Production',
            current: 2.1,
            target: 2.5,
            previous: 2.3,
            unit: 'CO2e/unit',
            trend: -8.7
          }}
          employeeIntensity={{
            name: 'Employee',
            current: 4.2,
            target: 5.0,
            previous: 4.5,
            unit: 'CO2e/employee',
            trend: -6.7
          }}
          energyIntensity={{
            name: 'Energy',
            current: 0.65,
            target: 0.8,
            previous: 0.72,
            unit: 'CO2e/kWh',
            trend: -9.7
          }}
          industryAverage={1.2}
          industryBenchmark={0.9}
        />
      </Box>

      {/* Offset Tracking and Alerts */}
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
        <CarbonOffsetTracking
          totalOffsetCredits="4,100"
          totalEmissions="23,472"
          netEmissions="19,372"
          offsetPercentage={17.5}
          projects={mockOffsetProjects}
          availableCredits={1200}
          pendingCredits={800}
          retiredCredits={2100}
        />
        <CarbonAlerts
          alerts={mockAlerts}
          alertTrends={mockAlertTrends}
          totalAlerts={12}
          activeAlerts={2}
          resolvedAlerts={10}
          criticalAlerts={1}
          onResolveAlert={handleResolveAlert}
          onDismissAlert={handleDismissAlert}
        />
      </Box>
    </Box>
  );
}; 