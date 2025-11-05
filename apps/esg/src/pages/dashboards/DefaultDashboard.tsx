import React from 'react';
import { ChartCardComponent, ChartCardProps } from '@repo/falcon-ui/components';
import { useAppContext } from '@falcon/providers';
import { Row, Col } from 'react-bootstrap';
import { Box, Container, Typography, Divider } from '@mui/material';
import ESGLineChart from './LineChart';
import MiniCharts from './MiniCharts';
import GovernanceMetrics from './GovernanceMetrics';
import SocialMetrics from './SocialMetrics';
import FinancialImpact from './FinancialImpact';
import SupplyChainDashboard from './SupplyChainDashboard';
import CompanyDataQualityDashboard from './CompanyDataQualityDashboard';
import { ExecutiveSummaryDashboard } from './ExecutiveSummaryDashboard';

export const DefaultDashboard = () => {
	const { getThemeColor } = useAppContext();
	const chartOptions: ChartCardProps['chartOptions'] = {
		tooltip: {
			trigger: 'axis',
			padding: [7, 10],
			formatter: '{b0} : {c0}',
			transitionDuration: 0,
			backgroundColor: getThemeColor('gray-100'),
			borderColor: getThemeColor('gray-300'),
			textStyle: { color: getThemeColor('gray-1100') },
			borderWidth: 1,
		},
		xAxis: {
			type: 'category',
			data: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
			boundaryGap: false,
			axisLine: { show: false },
			axisLabel: { show: false },
			axisTick: { show: false },
			axisPointer: { type: 'none' },
		},
		yAxis: {
			type: 'value',
			splitLine: { show: false },
			axisLine: { show: false },
			axisLabel: { show: false },
			axisTick: { show: false },
			axisPointer: { type: 'none' },
		},
		series: [
			{
				type: 'bar',
				showBackground: true,
				backgroundStyle: {
					borderRadius: 10,
				},
				barWidth: '5px',
				itemStyle: {
					borderRadius: 10,
					color: getThemeColor('primary'),
				},
				data: [6000, 9000, 8500, 4000, 4500, 6500, 7000],
				z: 10,
			},
		],
		grid: { right: 5, left: 10, top: 0, bottom: 0 },
	};

	return (
		<div className="flex flex-col gap-4">
			<h1 className="text-2xl font-bold">ESG Performance Dashboard</h1>
			<p className="text-gray-600">
				Track and analyze your organization's environmental, social, and governance metrics
			</p>
			
			<Container maxWidth="xl" sx={{ py: 2 }}>
				{/* Executive Summary Dashboard Section */}
				<Box sx={{ mb: 6 }}>
					<ExecutiveSummaryDashboard />
				</Box>

				<Divider sx={{ my: 4 }} />

				{/* Environmental Metrics Section */}
				<Box sx={{ mb: 6 }}>
					<Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
						Environmental Performance
					</Typography>
					<MiniCharts />
				</Box>

				<Divider sx={{ my: 4 }} />

				{/* Social Performance Section */}
				<Box sx={{ mb: 6 }}>
					<SocialMetrics />
				</Box>

				<Divider sx={{ my: 4 }} />

				{/* Governance Metrics Section */}
				<Box sx={{ mb: 6 }}>
					<GovernanceMetrics />
				</Box>

				<Divider sx={{ my: 4 }} />

				{/* Financial Impact Section */}
				<Box sx={{ mb: 6 }}>
					<FinancialImpact />
				</Box>

				<Divider sx={{ my: 4 }} />

				{/* Supply Chain ESG Section */}
				<Box sx={{ mb: 6 }}>
					<SupplyChainDashboard />
				</Box>

				<Divider sx={{ my: 4 }} />

				{/* Data Quality Dashboard Section */}
				<Box sx={{ mb: 6 }}>
					<CompanyDataQualityDashboard />
				</Box>

				<Divider sx={{ my: 4 }} />

				{/* Detailed Charts Section */}
				<Box>
					<Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
						Detailed Analytics
					</Typography>
					<Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
						<Box sx={{ flex: 1 }}>
							<Row className="g-2 mb-3" style={{ width: '70%' }}>
								<Col md={12}>
									<ChartCardComponent
										title="Resource Usage Trend"
										valueTxt="47% reduction"
										chartOptions={chartOptions}
										badge={{
											bg: 'success',
											pill: true,
											badgeTxt: '+3.6%',
										}}
									/>
								</Col>
							</Row>
						</Box>

						<Box sx={{ flex: 1 }}>
							<Typography variant="h6" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
								ESG Metrics Overview
							</Typography>
							<ESGLineChart />
						</Box>
					</Box>
				</Box>
			</Container>
		</div>
	);
};

export default DefaultDashboard;
