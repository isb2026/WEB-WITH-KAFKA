import React from 'react';
import {
	Box,
	Paper,
	Typography,
	Chip,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	Button,
	Badge,
} from '@mui/material';
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	Area,
	AreaChart,
} from 'recharts';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import NotificationsIcon from '@mui/icons-material/Notifications';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface CarbonAlert {
	id: string;
	type: 'warning' | 'error' | 'info' | 'success';
	title: string;
	message: string;
	timestamp: string;
	severity: 'low' | 'medium' | 'high' | 'critical';
	source: string;
	resolved: boolean;
	emissionsThreshold: number;
	currentEmissions: number;
}

interface CarbonAlertsProps {
	alerts: CarbonAlert[];
	alertTrends: Array<{ time: string; alerts: number; resolved: number }>;
	totalAlerts: number;
	activeAlerts: number;
	resolvedAlerts: number;
	criticalAlerts: number;
	onResolveAlert: (alertId: string) => void;
	onDismissAlert: (alertId: string) => void;
}

export const CarbonAlerts: React.FC<CarbonAlertsProps> = ({
	alerts,
	alertTrends,
	totalAlerts,
	activeAlerts,
	resolvedAlerts,
	criticalAlerts,
	onResolveAlert,
	onDismissAlert,
}) => {
	const getAlertIcon = (type: string) => {
		switch (type) {
			case 'warning':
				return <WarningIcon sx={{ color: '#ff9800' }} />;
			case 'error':
				return <ErrorIcon sx={{ color: '#f44336' }} />;
			case 'info':
				return <InfoIcon sx={{ color: '#2196f3' }} />;
			case 'success':
				return <CheckCircleIcon sx={{ color: '#4caf50' }} />;
			default:
				return <InfoIcon sx={{ color: '#666' }} />;
		}
	};

	const getSeverityColor = (severity: string) => {
		switch (severity) {
			case 'low':
				return '#4caf50';
			case 'medium':
				return '#ff9800';
			case 'high':
				return '#f44336';
			case 'critical':
				return '#d32f2f';
			default:
				return '#666';
		}
	};

	const getSeverityBgColor = (severity: string) => {
		switch (severity) {
			case 'low':
				return '#e8f5e8';
			case 'medium':
				return '#fff3e0';
			case 'high':
				return '#ffebee';
			case 'critical':
				return '#ffcdd2';
			default:
				return '#f5f5f5';
		}
	};

	const CustomTooltip = ({ active, payload, label }: any) => {
		if (active && payload && payload.length) {
			return (
				<Box
					sx={{
						backgroundColor: 'white',
						border: '1px solid #ccc',
						borderRadius: 2,
						p: 2,
						boxShadow: 2,
					}}
				>
					<Typography
						variant="body2"
						sx={{ fontWeight: 'bold', mb: 1 }}
					>
						{label}
					</Typography>
					{payload.map((entry: any, index: number) => (
						<Typography
							key={index}
							variant="body2"
							color="textSecondary"
						>
							{entry.name}: {entry.value}
						</Typography>
					))}
				</Box>
			);
		}
		return null;
	};

	return (
		<Paper elevation={3} sx={{ p: 3, height: '100%' }}>
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					mb: 3,
				}}
			>
				<Box>
					<Typography
						variant="h6"
						color="textSecondary"
						sx={{ mb: 1 }}
					>
						Carbon Alerts & Monitoring
					</Typography>
					<Typography
						variant="h4"
						component="div"
						sx={{ fontWeight: 'bold', color: '#2e7d32' }}
					>
						{activeAlerts}
						<Typography
							component="span"
							variant="h6"
							sx={{
								ml: 1,
								fontWeight: 'normal',
								color: 'textSecondary',
							}}
						>
							Active Alerts
						</Typography>
					</Typography>
				</Box>
				<Badge badgeContent={criticalAlerts} color="error">
					<NotificationsIcon
						sx={{ color: '#f44336', fontSize: 32 }}
					/>
				</Badge>
			</Box>

			{/* Alert Summary */}
			<Box
				sx={{
					display: 'grid',
					gap: 2,
					gridTemplateColumns: {
						xs: 'repeat(2, 1fr)',
						sm: 'repeat(4, 1fr)',
					},
					mb: 3,
				}}
			>
				<Box
					sx={{
						textAlign: 'center',
						p: 2,
						borderRadius: 2,
						backgroundColor: '#e3f2fd',
					}}
				>
					<Typography
						variant="h5"
						sx={{ fontWeight: 'bold', color: '#1976d2' }}
					>
						{totalAlerts}
					</Typography>
					<Typography variant="caption" color="textSecondary">
						Total Alerts
					</Typography>
				</Box>
				<Box
					sx={{
						textAlign: 'center',
						p: 2,
						borderRadius: 2,
						backgroundColor: '#fff3e0',
					}}
				>
					<Typography
						variant="h5"
						sx={{ fontWeight: 'bold', color: '#f57c00' }}
					>
						{activeAlerts}
					</Typography>
					<Typography variant="caption" color="textSecondary">
						Active
					</Typography>
				</Box>
				<Box
					sx={{
						textAlign: 'center',
						p: 2,
						borderRadius: 2,
						backgroundColor: '#e8f5e8',
					}}
				>
					<Typography
						variant="h5"
						sx={{ fontWeight: 'bold', color: '#2e7d32' }}
					>
						{resolvedAlerts}
					</Typography>
					<Typography variant="caption" color="textSecondary">
						Resolved
					</Typography>
				</Box>
				<Box
					sx={{
						textAlign: 'center',
						p: 2,
						borderRadius: 2,
						backgroundColor: '#ffebee',
					}}
				>
					<Typography
						variant="h5"
						sx={{ fontWeight: 'bold', color: '#d32f2f' }}
					>
						{criticalAlerts}
					</Typography>
					<Typography variant="caption" color="textSecondary">
						Critical
					</Typography>
				</Box>
			</Box>

			{/* Alert Trends Chart */}
			<Box sx={{ mb: 3 }}>
				<Typography
					variant="subtitle2"
					color="textSecondary"
					sx={{ mb: 2 }}
				>
					Alert Trends (Last 24 Hours)
				</Typography>
				<Box sx={{ height: 200 }}>
					<ResponsiveContainer width="100%" height="100%">
						<AreaChart
							data={alertTrends}
							margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
						>
							<CartesianGrid
								strokeDasharray="3 3"
								stroke="#f0f0f0"
							/>
							<XAxis dataKey="time" stroke="#666" fontSize={12} />
							<YAxis stroke="#666" fontSize={12} />
							<Tooltip content={<CustomTooltip />} />
							<Area
								type="monotone"
								dataKey="alerts"
								stackId="1"
								stroke="#f44336"
								fill="#f44336"
								fillOpacity={0.6}
								name="New Alerts"
							/>
							<Area
								type="monotone"
								dataKey="resolved"
								stackId="2"
								stroke="#4caf50"
								fill="#4caf50"
								fillOpacity={0.6}
								name="Resolved"
							/>
						</AreaChart>
					</ResponsiveContainer>
				</Box>
			</Box>

			{/* Recent Alerts */}
			<Box>
				<Typography
					variant="subtitle2"
					color="textSecondary"
					sx={{ mb: 2 }}
				>
					Recent Alerts
				</Typography>
				<List sx={{ maxHeight: 300, overflowY: 'auto' }}>
					{alerts.slice(0, 5).map((alert) => (
						<ListItem
							key={alert.id}
							sx={{
								mb: 1,
								borderRadius: 1,
								backgroundColor: alert.resolved
									? '#f8f9fa'
									: getSeverityBgColor(alert.severity),
								border: `1px solid ${getSeverityColor(alert.severity)}30`,
								opacity: alert.resolved ? 0.7 : 1,
							}}
						>
							<ListItemIcon>
								{getAlertIcon(alert.type)}
							</ListItemIcon>
							<ListItemText
								primary={
									<Box
										sx={{
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'space-between',
										}}
									>
										<Typography
											variant="body2"
											sx={{ fontWeight: 'bold' }}
										>
											{alert.title}
										</Typography>
										<Chip
											label={alert.severity}
											size="small"
											sx={{
												backgroundColor:
													getSeverityColor(
														alert.severity
													),
												color: 'white',
												fontWeight: 'bold',
												fontSize: '0.7rem',
											}}
										/>
									</Box>
								}
								secondary={
									<Box component="div">
										<Typography
											variant="caption"
											color="textSecondary"
											sx={{ display: 'block' }}
										>
											{alert.message}
										</Typography>
										<Typography
											variant="caption"
											color="textSecondary"
										>
											{alert.source} • {alert.timestamp}
										</Typography>
										{!alert.resolved && (
											<Box component="div" sx={{ mt: 1 }}>
												<Typography
													variant="caption"
													color="textSecondary"
												>
													Current:{' '}
													{alert.currentEmissions}{' '}
													CO2e | Threshold:{' '}
													{alert.emissionsThreshold}{' '}
													CO2e
												</Typography>
											</Box>
										)}
									</Box>
								}
							/>
							{!alert.resolved && (
								<Box sx={{ display: 'flex', gap: 1 }}>
									<Button
										size="small"
										variant="outlined"
										color="success"
										onClick={() => onResolveAlert(alert.id)}
									>
										Resolve
									</Button>
									<Button
										size="small"
										variant="outlined"
										onClick={() => onDismissAlert(alert.id)}
									>
										Dismiss
									</Button>
								</Box>
							)}
						</ListItem>
					))}
				</List>
			</Box>
		</Paper>
	);
};
