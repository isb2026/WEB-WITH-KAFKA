import React, { useState } from 'react';
import {
	Box,
	Card,
	CardContent,
	Typography,
	Chip,
	Paper,
	Alert,
	Button,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
} from '@mui/material';
import {
	TrendingUp,
	TrendingDown,
	BarChart3,
	Calendar,
	Building2,
	Target,
	Users,
} from 'lucide-react';
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	BarChart,
	Bar,
} from 'recharts';

// 목업 데이터
const mockGroups = [
	{ id: '1', name: '무른모 본사', type: 'COMPANY' },
	{ id: '2', name: '무른모 송도', type: 'COMPANY' },
	{ id: '3', name: '무른모 서울지사', type: 'COMPANY' },
	{ id: '4', name: '제조부문', type: 'DIVISION' },
	{ id: '5', name: '영업부문', type: 'DIVISION' },
];

const mockYearlyData = [
	{
		year: '2020',
		group1: { total: 1200, scope1: 480, scope2: 360, scope3: 360 },
		group2: { total: 950, scope1: 380, scope2: 285, scope3: 285 },
	},
	{
		year: '2021',
		group1: { total: 1150, scope1: 460, scope2: 345, scope3: 345 },
		group2: { total: 920, scope1: 368, scope2: 276, scope3: 276 },
	},
	{
		year: '2022',
		group1: { total: 1100, scope1: 440, scope2: 330, scope3: 330 },
		group2: { total: 880, scope1: 352, scope2: 264, scope3: 264 },
	},
	{
		year: '2023',
		group1: { total: 1050, scope1: 420, scope2: 315, scope3: 315 },
		group2: { total: 850, scope1: 340, scope2: 255, scope3: 255 },
	},
	{
		year: '2024',
		group1: { total: 1000, scope1: 400, scope2: 300, scope3: 300 },
		group2: { total: 800, scope1: 320, scope2: 240, scope3: 240 },
	},
];

const mockMonthlyData = [
	{ month: '1월', group1: 85, group2: 68 },
	{ month: '2월', group1: 82, group2: 65 },
	{ month: '3월', group1: 88, group2: 70 },
	{ month: '4월', group1: 90, group2: 72 },
	{ month: '5월', group1: 95, group2: 76 },
	{ month: '6월', group1: 92, group2: 74 },
	{ month: '7월', group1: 98, group2: 78 },
	{ month: '8월', group1: 96, group2: 77 },
	{ month: '9월', group1: 89, group2: 71 },
	{ month: '10월', group1: 87, group2: 69 },
	{ month: '11월', group1: 84, group2: 67 },
	{ month: '12월', group1: 86, group2: 68 },
];

export const GroupEmissionsComparisonPage: React.FC = () => {
	const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
	const [selectedYear, setSelectedYear] = useState('2024');
	const [comparisonType, setComparisonType] = useState<
		'yearly' | 'monthly' | 'scope'
	>('yearly');

	const handleGroupSelection = (groupId: string) => {
		if (selectedGroups.includes(groupId)) {
			setSelectedGroups(selectedGroups.filter((id) => id !== groupId));
		} else if (selectedGroups.length < 2) {
			setSelectedGroups([...selectedGroups, groupId]);
		}
	};

	const getSelectedGroupNames = () => {
		return selectedGroups.map((id) => {
			const group = mockGroups.find((g) => g.id === id);
			return group ? group.name : '';
		});
	};

	const getScopeComparisonData = () => {
		if (selectedGroups.length !== 2) return [];

		const yearData = mockYearlyData.find((d) => d.year === selectedYear);
		if (!yearData) return [];

		return [
			{
				scope: 'Scope 1',
				group1: yearData.group1.scope1,
				group2: yearData.group2.scope1,
			},
			{
				scope: 'Scope 2',
				group1: yearData.group1.scope2,
				group2: yearData.group2.scope2,
			},
			{
				scope: 'Scope 3',
				group1: yearData.group1.scope3,
				group2: yearData.group2.scope3,
			},
		];
	};

	const getComparisonStats = () => {
		if (selectedGroups.length !== 2) return null;

		const currentYear = mockYearlyData.find((d) => d.year === selectedYear);
		const previousYear = mockYearlyData.find(
			(d) => d.year === (parseInt(selectedYear) - 1).toString()
		);

		if (!currentYear || !previousYear) return null;

		const group1Change =
			((currentYear.group1.total - previousYear.group1.total) /
				previousYear.group1.total) *
			100;
		const group2Change =
			((currentYear.group2.total - previousYear.group2.total) /
				previousYear.group2.total) *
			100;
		const difference = currentYear.group1.total - currentYear.group2.total;
		const differencePercent = (difference / currentYear.group2.total) * 100;

		return {
			group1Total: currentYear.group1.total,
			group2Total: currentYear.group2.total,
			group1Change,
			group2Change,
			difference,
			differencePercent,
		};
	};

	const stats = getComparisonStats();
	const groupNames = getSelectedGroupNames();

	return (
		<Box sx={{ p: 3, minHeight: '100vh' }}>
			{/* 헤더 */}
			{/* <Card sx={{ mb: 3, p: 2 }}>
				<Typography
					variant="h6"
					sx={{ fontWeight: 'bold', mb: 1, color: '#333' }}
				>
					그룹별 배출량 비교분석
				</Typography>
				<Typography variant="body2" color="textSecondary">
					두 개의 그룹을 선택하여 배출량을 비교분석합니다.
				</Typography>
			</Card> */}

			{/* 그룹 선택 */}
			<Card sx={{ mb: 3, p: 3 }}>
				<Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
					비교할 그룹 선택 (최대 2개)
				</Typography>
				<Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
					{mockGroups.map((group) => (
						<Chip
							key={group.id}
							label={group.name}
							icon={
								group.type === 'COMPANY' ? (
									<Building2 size={16} />
								) : (
									<Users size={16} />
								)
							}
							onClick={() => handleGroupSelection(group.id)}
							color={
								selectedGroups.includes(group.id)
									? 'primary'
									: 'default'
							}
							variant={
								selectedGroups.includes(group.id)
									? 'filled'
									: 'outlined'
							}
							sx={{
								cursor: 'pointer',
								'&:hover': {
									backgroundColor: selectedGroups.includes(
										group.id
									)
										? 'primary.dark'
										: 'action.hover',
								},
							}}
						/>
					))}
				</Box>

				{selectedGroups.length === 2 && (
					<Alert severity="success" sx={{ mt: 2 }}>
						<strong>{groupNames[0]}</strong>과(와){' '}
						<strong>{groupNames[1]}</strong>이(가) 선택되었습니다.
					</Alert>
				)}

				{selectedGroups.length === 0 && (
					<Alert severity="info" sx={{ mt: 2 }}>
						비교할 그룹 2개를 선택해주세요.
					</Alert>
				)}
			</Card>

			{selectedGroups.length === 2 && (
				<>
					{/* 컨트롤 패널 */}
					<Card sx={{ mb: 3, p: 3 }}>
						<Box
							sx={{
								display: 'flex',
								gap: 3,
								flexWrap: 'wrap',
								alignItems: 'center',
							}}
						>
							<FormControl size="small" sx={{ minWidth: 120 }}>
								<InputLabel>연도</InputLabel>
								<Select
									value={selectedYear}
									label="연도"
									onChange={(e) =>
										setSelectedYear(e.target.value)
									}
								>
									{mockYearlyData.map((data) => (
										<MenuItem
											key={data.year}
											value={data.year}
										>
											{data.year}년
										</MenuItem>
									))}
								</Select>
							</FormControl>

							<Box sx={{ display: 'flex', gap: 1 }}>
								<Button
									variant={
										comparisonType === 'yearly'
											? 'contained'
											: 'outlined'
									}
									size="small"
									onClick={() => setComparisonType('yearly')}
									startIcon={<Calendar size={16} />}
								>
									연도별
								</Button>
								<Button
									variant={
										comparisonType === 'monthly'
											? 'contained'
											: 'outlined'
									}
									size="small"
									onClick={() => setComparisonType('monthly')}
									startIcon={<BarChart3 size={16} />}
								>
									월별
								</Button>
								<Button
									variant={
										comparisonType === 'scope'
											? 'contained'
											: 'outlined'
									}
									size="small"
									onClick={() => setComparisonType('scope')}
									startIcon={<Target size={16} />}
								>
									Scope별
								</Button>
							</Box>
						</Box>
					</Card>

					{/* 주요 지표 */}
					{stats && (
						<Box
							sx={{
								display: 'flex',
								gap: 3,
								flexWrap: 'wrap',
								mb: 3,
							}}
						>
							<Card sx={{ flex: '1 1 250px', minWidth: 250 }}>
								<CardContent>
									<Typography
										variant="h6"
										color="textSecondary"
										sx={{ mb: 1 }}
									>
										{groupNames[0]} 총 배출량
									</Typography>
									<Typography
										variant="h4"
										sx={{ fontWeight: 'bold', mb: 1 }}
									>
										{stats.group1Total.toLocaleString()}{' '}
										tCO₂eq
									</Typography>
									<Box
										sx={{
											display: 'flex',
											alignItems: 'center',
											gap: 1,
										}}
									>
										{stats.group1Change > 0 ? (
											<TrendingUp
												size={16}
												color="#FF6B6B"
											/>
										) : (
											<TrendingDown
												size={16}
												color="#4ECDC4"
											/>
										)}
										<Typography
											variant="body2"
											color={
												stats.group1Change > 0
													? 'error'
													: 'success'
											}
										>
											{Math.abs(
												stats.group1Change
											).toFixed(1)}
											% 전년 대비
										</Typography>
									</Box>
								</CardContent>
							</Card>

							<Card sx={{ flex: '1 1 250px', minWidth: 250 }}>
								<CardContent>
									<Typography
										variant="h6"
										color="textSecondary"
										sx={{ mb: 1 }}
									>
										{groupNames[1]} 총 배출량
									</Typography>
									<Typography
										variant="h4"
										sx={{ fontWeight: 'bold', mb: 1 }}
									>
										{stats.group2Total.toLocaleString()}{' '}
										tCO₂eq
									</Typography>
									<Box
										sx={{
											display: 'flex',
											alignItems: 'center',
											gap: 1,
										}}
									>
										{stats.group2Change > 0 ? (
											<TrendingUp
												size={16}
												color="#FF6B6B"
											/>
										) : (
											<TrendingDown
												size={16}
												color="#4ECDC4"
											/>
										)}
										<Typography
											variant="body2"
											color={
												stats.group2Change > 0
													? 'error'
													: 'success'
											}
										>
											{Math.abs(
												stats.group2Change
											).toFixed(1)}
											% 전년 대비
										</Typography>
									</Box>
								</CardContent>
							</Card>

							<Card sx={{ flex: '1 1 250px', minWidth: 250 }}>
								<CardContent>
									<Typography
										variant="h6"
										color="textSecondary"
										sx={{ mb: 1 }}
									>
										배출량 차이
									</Typography>
									<Typography
										variant="h4"
										sx={{ fontWeight: 'bold', mb: 1 }}
									>
										{Math.abs(
											stats.difference
										).toLocaleString()}{' '}
										tCO₂eq
									</Typography>
									<Typography
										variant="body2"
										color="textSecondary"
									>
										{stats.difference > 0
											? `${groupNames[0]}이(가) ${Math.abs(stats.differencePercent).toFixed(1)}% 더 많음`
											: `${groupNames[1]}이(가) ${Math.abs(stats.differencePercent).toFixed(1)}% 더 많음`}
									</Typography>
								</CardContent>
							</Card>
						</Box>
					)}

					{/* 차트 섹션 */}
					<Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
						{comparisonType === 'yearly' && (
							<Card
								sx={{
									flex: '1 1 600px',
									minWidth: 600,
									height: 400,
								}}
							>
								<CardContent>
									<Typography
										variant="h6"
										sx={{ mb: 2, fontWeight: 'bold' }}
									>
										연도별 배출량 추이 비교
									</Typography>
									<ResponsiveContainer
										width="100%"
										height={320}
									>
										<LineChart data={mockYearlyData}>
											<CartesianGrid strokeDasharray="3 3" />
											<XAxis dataKey="year" />
											<YAxis />
											<Tooltip
												formatter={(value, name) => [
													`${value} tCO₂eq`,
													name === 'group1.total'
														? groupNames[0]
														: groupNames[1],
												]}
											/>
											<Line
												type="monotone"
												dataKey="group1.total"
												stroke="#4ECDC4"
												strokeWidth={3}
												dot={{
													fill: '#4ECDC4',
													strokeWidth: 2,
													r: 4,
												}}
											/>
											<Line
												type="monotone"
												dataKey="group2.total"
												stroke="#FF6B6B"
												strokeWidth={3}
												dot={{
													fill: '#FF6B6B',
													strokeWidth: 2,
													r: 4,
												}}
											/>
										</LineChart>
									</ResponsiveContainer>
								</CardContent>
							</Card>
						)}

						{comparisonType === 'monthly' && (
							<Card
								sx={{
									flex: '1 1 600px',
									minWidth: 600,
									height: 400,
								}}
							>
								<CardContent>
									<Typography
										variant="h6"
										sx={{ mb: 2, fontWeight: 'bold' }}
									>
										{selectedYear}년 월별 배출량 비교
									</Typography>
									<ResponsiveContainer
										width="100%"
										height={320}
									>
										<BarChart data={mockMonthlyData}>
											<CartesianGrid strokeDasharray="3 3" />
											<XAxis dataKey="month" />
											<YAxis />
											<Tooltip
												formatter={(value, name) => [
													`${value} tCO₂eq`,
													name === 'group1'
														? groupNames[0]
														: groupNames[1],
												]}
											/>
											<Bar
												dataKey="group1"
												fill="#4ECDC4"
											/>
											<Bar
												dataKey="group2"
												fill="#FF6B6B"
											/>
										</BarChart>
									</ResponsiveContainer>
								</CardContent>
							</Card>
						)}

						{comparisonType === 'scope' && (
							<Card
								sx={{
									flex: '1 1 600px',
									minWidth: 600,
									height: 400,
								}}
							>
								<CardContent>
									<Typography
										variant="h6"
										sx={{ mb: 2, fontWeight: 'bold' }}
									>
										{selectedYear}년 Scope별 배출량 비교
									</Typography>
									<ResponsiveContainer
										width="100%"
										height={320}
									>
										<BarChart
											data={getScopeComparisonData()}
										>
											<CartesianGrid strokeDasharray="3 3" />
											<XAxis dataKey="scope" />
											<YAxis />
											<Tooltip
												formatter={(value, name) => [
													`${value} tCO₂eq`,
													name === 'group1'
														? groupNames[0]
														: groupNames[1],
												]}
											/>
											<Bar
												dataKey="group1"
												fill="#4ECDC4"
											/>
											<Bar
												dataKey="group2"
												fill="#FF6B6B"
											/>
										</BarChart>
									</ResponsiveContainer>
								</CardContent>
							</Card>
						)}

						{/* 추가 분석 카드 */}
						<Card
							sx={{
								flex: '1 1 400px',
								minWidth: 400,
								height: 400,
							}}
						>
							<CardContent>
								<Typography
									variant="h6"
									sx={{ mb: 2, fontWeight: 'bold' }}
								>
									비교 분석 요약
								</Typography>
								<Box sx={{ maxHeight: 320, overflow: 'auto' }}>
									{stats && (
										<>
											<Paper
												sx={{
													p: 2,
													mb: 2,
													backgroundColor: '#f8f9fa',
												}}
											>
												<Typography
													variant="body2"
													sx={{
														fontWeight: 'bold',
														mb: 1,
													}}
												>
													📊 총 배출량 비교 (
													{selectedYear}년)
												</Typography>
												<Typography
													variant="body2"
													color="textSecondary"
												>
													• {groupNames[0]}:{' '}
													{stats.group1Total.toLocaleString()}{' '}
													tCO₂eq
													<br />• {
														groupNames[1]
													}:{' '}
													{stats.group2Total.toLocaleString()}{' '}
													tCO₂eq
													<br />• 차이:{' '}
													{Math.abs(
														stats.difference
													).toLocaleString()}{' '}
													tCO₂eq
												</Typography>
											</Paper>

											<Paper
												sx={{
													p: 2,
													mb: 2,
													backgroundColor: '#f8f9fa',
												}}
											>
												<Typography
													variant="body2"
													sx={{
														fontWeight: 'bold',
														mb: 1,
													}}
												>
													📈 전년 대비 변화율
												</Typography>
												<Typography
													variant="body2"
													color="textSecondary"
												>
													• {groupNames[0]}:{' '}
													{stats.group1Change > 0
														? '+'
														: ''}
													{stats.group1Change.toFixed(
														1
													)}
													%
													<br />• {
														groupNames[1]
													}:{' '}
													{stats.group2Change > 0
														? '+'
														: ''}
													{stats.group2Change.toFixed(
														1
													)}
													%
												</Typography>
											</Paper>

											<Paper
												sx={{
													p: 2,
													backgroundColor: '#f8f9fa',
												}}
											>
												<Typography
													variant="body2"
													sx={{
														fontWeight: 'bold',
														mb: 1,
													}}
												>
													💡 개선 권장사항
												</Typography>
												<Typography
													variant="body2"
													color="textSecondary"
												>
													• 배출량이 높은 그룹의
													에너지 효율성 개선 필요
													<br />
													• Scope별 세부 분석을 통한
													감축 전략 수립
													<br />• 우수 그룹의 베스트
													프랙티스 벤치마킹
												</Typography>
											</Paper>
										</>
									)}
								</Box>
							</CardContent>
						</Card>
					</Box>
				</>
			)}
		</Box>
	);
};
