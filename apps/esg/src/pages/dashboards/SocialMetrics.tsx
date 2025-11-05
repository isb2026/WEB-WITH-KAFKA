import React from 'react';
import { Box, Paper, Typography, Grid } from '@mui/material';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import PeopleIcon from '@mui/icons-material/People';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';

// Mock data for social metrics
const employeeSatisfactionData = [
  { month: 'Jan', satisfaction: 78, retention: 92, engagement: 75 },
  { month: 'Feb', satisfaction: 80, retention: 93, engagement: 77 },
  { month: 'Mar', satisfaction: 82, retention: 94, engagement: 79 },
  { month: 'Apr', satisfaction: 84, retention: 95, engagement: 81 },
  { month: 'May', satisfaction: 86, retention: 96, engagement: 83 },
  { month: 'Jun', satisfaction: 88, retention: 97, engagement: 85 },
  { month: 'Jul', satisfaction: 89, retention: 97, engagement: 86 },
  { month: 'Aug', satisfaction: 90, retention: 98, engagement: 87 },
  { month: 'Sep', satisfaction: 91, retention: 98, engagement: 88 },
  { month: 'Oct', satisfaction: 92, retention: 99, engagement: 89 },
  { month: 'Nov', satisfaction: 93, retention: 99, engagement: 90 },
  { month: 'Dec', satisfaction: 94, retention: 99, engagement: 91 }
];

const diversityData = [
  { category: 'Gender Diversity', male: 52, female: 48, other: 0 },
  { category: 'Age Groups', under30: 25, age30to50: 55, over50: 20 },
  { category: 'Ethnicity', asian: 15, black: 12, hispanic: 18, white: 45, other: 10 },
  { category: 'Leadership', male: 45, female: 55, other: 0 }
];

const communityEngagementData = [
  { month: 'Jan', volunteerHours: 120, donations: 15000, partnerships: 3 },
  { month: 'Feb', volunteerHours: 135, donations: 16500, partnerships: 4 },
  { month: 'Mar', volunteerHours: 150, donations: 18000, partnerships: 5 },
  { month: 'Apr', volunteerHours: 165, donations: 19500, partnerships: 6 },
  { month: 'May', volunteerHours: 180, donations: 21000, partnerships: 7 },
  { month: 'Jun', volunteerHours: 195, donations: 22500, partnerships: 8 },
  { month: 'Jul', volunteerHours: 210, donations: 24000, partnerships: 9 },
  { month: 'Aug', volunteerHours: 225, donations: 25500, partnerships: 10 },
  { month: 'Sep', volunteerHours: 240, donations: 27000, partnerships: 11 },
  { month: 'Oct', volunteerHours: 255, donations: 28500, partnerships: 12 },
  { month: 'Nov', volunteerHours: 270, donations: 30000, partnerships: 13 },
  { month: 'Dec', volunteerHours: 285, donations: 31500, partnerships: 14 }
];

const healthSafetyData = [
  { month: 'Jan', incidents: 8, nearMisses: 15, trainingHours: 240 },
  { month: 'Feb', incidents: 7, nearMisses: 14, trainingHours: 245 },
  { month: 'Mar', incidents: 6, nearMisses: 13, trainingHours: 250 },
  { month: 'Apr', incidents: 5, nearMisses: 12, trainingHours: 255 },
  { month: 'May', incidents: 4, nearMisses: 11, trainingHours: 260 },
  { month: 'Jun', incidents: 3, nearMisses: 10, trainingHours: 265 },
  { month: 'Jul', incidents: 3, nearMisses: 9, trainingHours: 270 },
  { month: 'Aug', incidents: 2, nearMisses: 8, trainingHours: 275 },
  { month: 'Sep', incidents: 2, nearMisses: 7, trainingHours: 280 },
  { month: 'Oct', incidents: 1, nearMisses: 6, trainingHours: 285 },
  { month: 'Nov', incidents: 1, nearMisses: 5, trainingHours: 290 },
  { month: 'Dec', incidents: 1, nearMisses: 4, trainingHours: 295 }
];

const trainingData = [
  { category: 'Leadership Development', completed: 85, inProgress: 10, notStarted: 5 },
  { category: 'Technical Skills', completed: 92, inProgress: 6, notStarted: 2 },
  { category: 'Diversity Training', completed: 95, inProgress: 4, notStarted: 1 },
  { category: 'Safety Training', completed: 98, inProgress: 2, notStarted: 0 },
  { category: 'ESG Awareness', completed: 88, inProgress: 8, notStarted: 4 }
];

// Social KPI data
export const socialKpiData = {
  employeeSatisfaction: {
    title: 'ç',
    value: '94',
    unit: '%',
    change: 2.1,
    icon: PeopleIcon,
    color: '#4caf50',
    description: 'Overall employee satisfaction score'
  },
  diversityScore: {
    title: 'Diversity Score',
    value: '78',
    unit: 'points',
    change: 3.5,
    icon: Diversity3Icon,
    color: '#2196f3',
    description: 'Workplace diversity and inclusion rating'
  },
  communityImpact: {
    title: 'Community Impact',
    value: '285',
    unit: 'hours',
    change: 5.3,
    icon: VolunteerActivismIcon,
    color: '#ff9800',
    description: 'Monthly volunteer hours contributed'
  },
  safetyIncidents: {
    title: 'Safety Incidents',
    value: '1',
    unit: 'incident',
    change: -50.0,
    icon: HealthAndSafetyIcon,
    color: '#f44336',
    description: 'Workplace safety incidents this month'
  },
  trainingCompletion: {
    title: 'Training Completion',
    value: '92',
    unit: '%',
    change: 4.2,
    icon: SchoolIcon,
    color: '#9c27b0',
    description: 'Employee training program completion rate'
  },
  retentionRate: {
    title: 'Employee Retention',
    value: '99',
    unit: '%',
    change: 1.1,
    icon: WorkIcon,
    color: '#00bcd4',
    description: 'Annual employee retention rate'
  }
};

interface SocialKPICardProps {
  title: string;
  value: string;
  unit: string;
  change: number;
  icon: React.ElementType;
  color: string;
  description: string;
}

const SocialKPICard: React.FC<SocialKPICardProps> = ({
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

const EmployeeSatisfactionChart: React.FC = () => {
  return (
    <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
        Employee Satisfaction Trends
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={employeeSatisfactionData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
            dataKey="satisfaction"
            stroke="#4caf50"
            strokeWidth={3}
            name="Satisfaction (%)"
            dot={{ fill: '#4caf50', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#4caf50', strokeWidth: 2 }}
          />
          <Line
            type="monotone"
            dataKey="retention"
            stroke="#2196f3"
            strokeWidth={3}
            name="Retention (%)"
            dot={{ fill: '#2196f3', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#2196f3', strokeWidth: 2 }}
          />
          <Line
            type="monotone"
            dataKey="engagement"
            stroke="#ff9800"
            strokeWidth={3}
            name="Engagement (%)"
            dot={{ fill: '#ff9800', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#ff9800', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Paper>
  );
};

const DiversityChart: React.FC = () => {
  return (
    <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
        Workplace Diversity Overview
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={diversityData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
          <Bar dataKey="male" fill="#2196f3" name="Male" />
          <Bar dataKey="female" fill="#e91e63" name="Female" />
          <Bar dataKey="other" fill="#9c27b0" name="Other" />
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
};

const CommunityEngagementChart: React.FC = () => {
  return (
    <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
        Community Engagement Progress
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={communityEngagementData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
            dataKey="volunteerHours"
            stroke="#ff9800"
            strokeWidth={3}
            name="Volunteer Hours"
            dot={{ fill: '#ff9800', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#ff9800', strokeWidth: 2 }}
          />
          <Line
            type="monotone"
            dataKey="partnerships"
            stroke="#4caf50"
            strokeWidth={3}
            name="Community Partnerships"
            dot={{ fill: '#4caf50', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#4caf50', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Paper>
  );
};

const TrainingCompletionChart: React.FC = () => {
  return (
    <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
        Training Program Completion
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={trainingData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
          <Bar dataKey="completed" fill="#4caf50" name="Completed" />
          <Bar dataKey="inProgress" fill="#ff9800" name="In Progress" />
          <Bar dataKey="notStarted" fill="#f44336" name="Not Started" />
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export const SocialMetrics: React.FC = () => {
  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 4, fontWeight: 600 }}>
        Social Performance Metrics
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
        {Object.entries(socialKpiData).map(([key, data]) => (
          <Box key={key}>
            <SocialKPICard {...data} />
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
          <EmployeeSatisfactionChart />
        </Box>
        <Box>
          <DiversityChart />
        </Box>
        <Box>
          <CommunityEngagementChart />
        </Box>
        <Box>
          <TrainingCompletionChart />
        </Box>
      </Box>
    </Box>
  );
};

export default SocialMetrics; 