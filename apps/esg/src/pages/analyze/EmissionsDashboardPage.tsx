import React, { useState, useEffect } from 'react';
import {
	Box,
	Typography,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	IconButton,
	ToggleButton,
	ToggleButtonGroup,
} from '@mui/material';
import {
	SplitPanelComponent,
	StyledContainer,
} from '@repo/moornmo-ui/components';
import { GroupTreeNavigation } from '@esg/components/treeNavigation/GroupTreeNavigation';
import { ViewModule, ViewList } from '@mui/icons-material';
import {
	LineChart,
	Line,
	BarChart,
	Bar,
	XAxis,
	YAxis,
	ResponsiveContainer,
	Tooltip,
	Legend,
	PieChart,
	Pie,
	Cell,
	ComposedChart,
} from 'recharts';
import { useActionButtons } from '@moornmo/hooks';
import { formatWithUnit, esgConverters } from '@repo/utils';

// 목업 데이터
const mockEmissionsData = {
	monthly: {
		'1': '4.5',
		'2': '3.0',
		'3': '3.3',
		'4': '3.1',
		'5': '4.2',
		'6': '3.8',
		'7': '4.0',
		'8': '3.9',
		'9': '3.7',
		'10': '4.1',
		'11': '3.6',
		'12': '3.4',
	},
	scope: {
		'1': {
			rate: 50.0,
			emission_sources: [
				{
					name: '휘발유',
					rate: 40.0,
					quantity: 26.5,
					unit: 'tco2eq',
				},
				{
					name: '경유',
					rate: 50.0,
					quantity: 26.5,
					unit: 'tco2eq',
				},
				{
					name: 'LPG',
					rate: 10.0,
					quantity: 26.5,
					unit: 'tco2eq',
				},
			],
		},
		'2': {
			rate: 30.0,
			emission_sources: [
				{
					name: '전기',
					rate: 80.0,
					quantity: 26.5,
					unit: 'tco2eq',
				},
				{
					name: '스팀',
					rate: 20.0,
					quantity: 26.5,
					unit: 'tco2eq',
				},
			],
		},
		'3': {
			rate: 20.0,
			emission_sources: [
				{
					name: '휘발유',
					rate: 0.407,
					quantity: 26.5,
					unit: 'tco2eq',
				},
				{
					name: '경유',
					rate: 0.407,
					quantity: 26.5,
					unit: 'tco2eq',
				},
				{
					name: 'LPG',
					rate: 0.407,
					quantity: 26.5,
					unit: 'tco2eq',
				},
			],
		},
	},
};

export const EmissionsDashboardPage: React.FC = () => {
	const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
	const { setCreate, setEdit, setDelete } = useActionButtons();

	const handleGroupSelect = (selectedId: string) => {
		setSelectedGroupId(selectedId);
		console.log('Selected Group/Company ID:', selectedId);
	};
	useEffect(() => {
		setCreate(false);
		setEdit(false);
		setDelete(false);
	}, []);

	return (
		<Box
			sx={{
				minHeight: '100vh',
				display: 'flex',
				flexDirection: 'column',
				bgcolor: '#f5f5f5',
			}}
		>
			{/* 메인 컨텐츠 영역 */}
			<Box sx={{ flex: 1, overflow: 'hidden' }}>
				<SplitPanelComponent
					direction="horizontal"
					sizes={[18, 82]}
					minSize={220}
				>
					{/* 좌측: 그룹 트리 네비게이션 */}
					<StyledContainer>
						<Paper
							elevation={0}
							sx={{
								height: '100%',
								width: '100%',
								overflow: 'hidden',
								padding: '1.5rem',
								bgcolor: 'white',
								border: '1px solid #e0e0e0',
								borderRadius: 2,
								boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
							}}
						>
							{/* <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                                그룹/사업장 선택
                            </Typography> */}
							<GroupTreeNavigation
								onSelected={handleGroupSelect}
								allowTypes={['GROUP', 'COMPANY', 'WORKPLACE']}
								allowSelectedType={[
									'GROUP',
									'COMPANY',
									'WORKPLACE',
								]}
							/>
						</Paper>
					</StyledContainer>

					{/* 우측: 대시보드 영역 */}
					<StyledContainer>
						<Box
							sx={{
								height: '100%',
								width: '100%',
								overflow: 'auto',
								p: 2,
								bgcolor: '#fafafa',
							}}
						>
							{selectedGroupId ? (
								<EmissionsDashboardContent
									selectedId={selectedGroupId}
								/>
							) : (
								<Box
									sx={{
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										height: '100%',
										flexDirection: 'column',
									}}
								>
									<Typography
										variant="h6"
										color="textSecondary"
										sx={{ mb: 2 }}
									>
										분석할 그룹 또는 사업장을 선택해주세요
									</Typography>
									<Typography
										variant="body2"
										color="textSecondary"
									>
										좌측 트리에서 그룹, 사업자 또는 사업장을
										클릭하면 해당 배출량 분석 데이터를
										확인할 수 있습니다.
									</Typography>
								</Box>
							)}
						</Box>
					</StyledContainer>
				</SplitPanelComponent>
			</Box>
		</Box>
	);
};

// 대시보드 컨텐츠 컴포넌트
const EmissionsDashboardContent: React.FC<{ selectedId: string }> = ({
	selectedId,
}) => {
	// 뷰 모드 상태 (카드형식 vs 그리드형식)
	const [emissionsViewMode, setEmissionsViewMode] = useState<'card' | 'grid'>(
		'card'
	);
	const [energyViewMode, setEnergyViewMode] = useState<'card' | 'grid'>(
		'card'
	);
	// 차트 타입 상태 (스택형 vs 그룹형)
	const [emissionsChartType, setEmissionsChartType] = useState<
		'stacked' | 'grouped'
	>('stacked');
	const [energyChartType, setEnergyChartType] = useState<
		'stacked' | 'grouped'
	>('stacked');

	// 월별 데이터 변환 - 항목별 구분 (단위 변환 적용)
	const monthlyChartData = Object.entries(mockEmissionsData.monthly).map(
		([month, value]) => {
			const baseValue = parseFloat(value);

			// 배출량 데이터 (tCO2eq 단위로 표준화)
			const scope1Emissions = baseValue * 0.5;
			const scope2Emissions = baseValue * 0.3;
			const scope3Emissions = baseValue * 0.2;

			// 에너지 데이터 (MWh 단위로 표준화)
			const totalEnergy = baseValue * 1.2 + Math.random() * 0.5;

			return {
				month: `${month}월`,
				// 배출량 항목별 분류 (tCO2eq)
				scope1: scope1Emissions,
				scope2: scope2Emissions,
				scope3: scope3Emissions,
				// 에너지 항목별 분류 (MWh)
				electricity: totalEnergy * 0.7,
				gas: totalEnergy * 0.2,
				fuel: totalEnergy * 0.1,
			};
		}
	);

	// Scope별 파이 차트 데이터
	const scopePieData = Object.entries(mockEmissionsData.scope).map(
		([scopeNum, data]) => ({
			name: `Scope ${scopeNum}`,
			value: data.rate,
			color:
				scopeNum === '1'
					? '#FF6B35'
					: scopeNum === '2'
						? '#004E89'
						: '#1A936F',
		})
	);

	// 색상 배열 - 더 세련된 색상
	const COLORS = ['#FF6B35', '#004E89', '#1A936F'];

	// 총 배출량 계산 (단위 표준화)
	const totalEmissions = Object.values(mockEmissionsData.scope).reduce(
		(total, scope) => {
			return (
				total +
				scope.emission_sources.reduce(
					(scopeTotal, source) => scopeTotal + source.quantity,
					0
				)
			);
		},
		0
	);

	return (
		<Box sx={{ height: '100%', bgcolor: '#fafafa' }}>
			{/* 헤더 영역 - 더 깔끔하게 */}
			<Box
				sx={{
					mb: 2,
					p: 3,
					bgcolor: 'white',
					borderRadius: 2,
					boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
					border: '1px solid #e0e0e0',
				}}
			>
				<Typography
					variant="h5"
					sx={{
						fontWeight: 700,
						color: '#1a1a1a',
						mb: 0.5,
					}}
				>
					온실가스 배출량 분석 대시보드
				</Typography>
				<Typography
					variant="body2"
					sx={{
						color: '#666',
						fontSize: '0.9rem',
					}}
				>
					선택된 그룹/사업장: <strong>ID {selectedId}</strong> |
					2019년 기준 배출량 데이터
				</Typography>
			</Box>

			{/* 대시보드 영역 - 스크롤 가능한 레이아웃 */}
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					gap: 2,
					overflowY: 'auto',
					overflowX: 'hidden',
					pb: 2,
					pr: 1,
					'&::-webkit-scrollbar': {
						width: '6px',
					},
					'&::-webkit-scrollbar-track': {
						background: '#f1f1f1',
						borderRadius: '3px',
					},
					'&::-webkit-scrollbar-thumb': {
						background: '#c1c1c1',
						borderRadius: '3px',
					},
					'&::-webkit-scrollbar-thumb:hover': {
						background: '#a8a8a8',
					},
				}}
			>
				{/* 상단: 주요 차트 2개 */}
				<Box
					sx={{
						display: 'grid',
						gridTemplateColumns: 'repeat(2, 1fr)',
						gap: 2,
						minHeight: '380px',
					}}
				>
					{/* 월별 온실가스 배출량 - 항목별 스택 차트 (확대) */}
					<Paper
						elevation={0}
						sx={{
							p: 3,
							bgcolor: 'white',
							border: '1px solid #e0e0e0',
							borderRadius: 2,
							boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
						}}
					>
						<Typography
							variant="h6"
							sx={{
								mb: 3,
								fontWeight: 600,
								color: '#1a1a1a',
								fontSize: '1.1rem',
								borderBottom: '2px solid #f0f0f0',
								pb: 1,
							}}
						>
							📊 월별 온실가스 배출량 (항목별)
						</Typography>
						<ResponsiveContainer width="100%" height={300}>
							<BarChart
								data={monthlyChartData}
								margin={{
									top: 10,
									right: 20,
									left: 20,
									bottom: 10,
								}}
							>
								<XAxis dataKey="month" fontSize={12} />
								<YAxis fontSize={12} />
								<Tooltip
									formatter={(value, name) => [
										formatWithUnit(
											Number(value),
											'tCO2eq',
											2
										),
										name,
									]}
									labelFormatter={(label) =>
										`${label} 배출량`
									}
								/>
								<Legend />
								{/* 스택 막대 차트 - 각 Scope별로 색상 구분 */}
								<Bar
									dataKey="scope1"
									stackId="emissions"
									fill="#FF6B35"
									name="Scope 1 (직접배출)"
									radius={[0, 0, 0, 0]}
								/>
								<Bar
									dataKey="scope2"
									stackId="emissions"
									fill="#004E89"
									name="Scope 2 (전력)"
									radius={[0, 0, 0, 0]}
								/>
								<Bar
									dataKey="scope3"
									stackId="emissions"
									fill="#1A936F"
									name="Scope 3 (기타간접)"
									radius={[4, 4, 0, 0]}
								/>
							</BarChart>
						</ResponsiveContainer>
					</Paper>

					{/* 월별 에너지 사용량 - 항목별 스택 차트 (확대) */}
					<Paper
						elevation={0}
						sx={{
							p: 3,
							bgcolor: 'white',
							border: '1px solid #e0e0e0',
							borderRadius: 2,
							boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
						}}
					>
						<Typography
							variant="h6"
							sx={{
								mb: 3,
								fontWeight: 600,
								color: '#1a1a1a',
								fontSize: '1.1rem',
								borderBottom: '2px solid #f0f0f0',
								pb: 1,
							}}
						>
							⚡ 월별 에너지 사용량 (항목별)
						</Typography>
						<ResponsiveContainer width="100%" height={300}>
							<BarChart
								data={monthlyChartData}
								margin={{
									top: 10,
									right: 20,
									left: 20,
									bottom: 10,
								}}
							>
								<XAxis dataKey="month" fontSize={12} />
								<YAxis fontSize={12} />
								<Tooltip
									formatter={(value, name) => [
										formatWithUnit(Number(value), 'MWh', 2),
										name,
									]}
									labelFormatter={(label) =>
										`${label} 에너지 사용량`
									}
								/>
								<Legend />
								{/* 스택 막대 차트 - 각 에너지원별로 색상 구분 */}
								<Bar
									dataKey="electricity"
									stackId="energy"
									fill="#0077BE"
									name="전력"
									radius={[0, 0, 0, 0]}
								/>
								<Bar
									dataKey="gas"
									stackId="energy"
									fill="#E63946"
									name="가스"
									radius={[0, 0, 0, 0]}
								/>
								<Bar
									dataKey="fuel"
									stackId="energy"
									fill="#6F4E37"
									name="연료"
									radius={[4, 4, 0, 0]}
								/>
							</BarChart>
						</ResponsiveContainer>
					</Paper>
				</Box>

				{/* 중간: 요약 차트 2개 */}
				<Box
					sx={{
						display: 'grid',
						gridTemplateColumns: 'repeat(2, 1fr)',
						gap: 2,
						minHeight: '330px',
					}}
				>
					{/* Scope별 파이 차트 */}
					<Paper
						elevation={0}
						sx={{
							p: 3,
							bgcolor: 'white',
							border: '1px solid #e0e0e0',
							borderRadius: 2,
							boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
						}}
					>
						<Typography
							variant="h6"
							sx={{
								mb: 3,
								fontWeight: 600,
								color: '#1a1a1a',
								fontSize: '1.1rem',
								textAlign: 'center',
								borderBottom: '2px solid #f0f0f0',
								pb: 1,
							}}
						>
							🎯 배출량 구성비
						</Typography>
						<ResponsiveContainer width="100%" height={250}>
							<PieChart>
								<Pie
									data={scopePieData}
									cx="50%"
									cy="45%"
									outerRadius={90}
									fill="#8884d8"
									dataKey="value"
									label={({ name, value }) =>
										`${name}\n${value}%`
									}
									labelLine={false}
								>
									{scopePieData.map((entry, index) => (
										<Cell
											key={`cell-${index}`}
											fill={COLORS[index % COLORS.length]}
										/>
									))}
								</Pie>
								<Tooltip />
							</PieChart>
						</ResponsiveContainer>
						<Box sx={{ mt: 2, textAlign: 'center' }}>
							<Box
								sx={{
									display: 'flex',
									flexDirection: 'column',
									gap: 1,
								}}
							>
								<Box
									sx={{
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										gap: 1,
									}}
								>
									<Box
										sx={{
											width: 12,
											height: 12,
											bgcolor: '#FF6B35',
											borderRadius: '50%',
										}}
									></Box>
									<Typography
										variant="caption"
										sx={{ fontWeight: 500, color: '#666' }}
									>
										Scope 1: 50%
									</Typography>
								</Box>
								<Box
									sx={{
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										gap: 1,
									}}
								>
									<Box
										sx={{
											width: 12,
											height: 12,
											bgcolor: '#004E89',
											borderRadius: '50%',
										}}
									></Box>
									<Typography
										variant="caption"
										sx={{ fontWeight: 500, color: '#666' }}
									>
										Scope 2: 30%
									</Typography>
								</Box>
								<Box
									sx={{
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										gap: 1,
									}}
								>
									<Box
										sx={{
											width: 12,
											height: 12,
											bgcolor: '#1A936F',
											borderRadius: '50%',
										}}
									></Box>
									<Typography
										variant="caption"
										sx={{ fontWeight: 500, color: '#666' }}
									>
										Scope 3: 20%
									</Typography>
								</Box>
							</Box>
						</Box>
					</Paper>

					{/* 네 번째 차트: 연도별 배출량 추이 */}
					<Paper
						elevation={0}
						sx={{
							p: 3,
							bgcolor: 'white',
							border: '1px solid #e0e0e0',
							borderRadius: 2,
							boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
						}}
					>
						<Typography
							variant="h6"
							sx={{
								mb: 3,
								fontWeight: 600,
								color: '#1a1a1a',
								fontSize: '1.1rem',
								borderBottom: '2px solid #f0f0f0',
								pb: 1,
							}}
						>
							📈 연도별 배출량 추이
						</Typography>
						<ResponsiveContainer width="100%" height={250}>
							<LineChart
								data={[
									{
										year: '2017',
										emissions: 3.2,
										target: 3.5,
									},
									{
										year: '2018',
										emissions: 3.8,
										target: 3.3,
									},
									{
										year: '2019',
										emissions: 4.1,
										target: 3.1,
									},
									{
										year: '2020',
										emissions: 3.5,
										target: 2.9,
									},
									{
										year: '2021',
										emissions: 3.9,
										target: 2.7,
									},
								]}
								margin={{
									top: 10,
									right: 30,
									left: 30,
									bottom: 10,
								}}
							>
								<XAxis dataKey="year" fontSize={12} />
								<YAxis fontSize={12} />
								<Tooltip
									formatter={(value, name) => [
										formatWithUnit(
											Number(value),
											'tCO2eq',
											1
										),
										name === 'emissions'
											? '실제 배출량'
											: '목표 배출량',
									]}
								/>
								<Legend />
								<Line
									type="monotone"
									dataKey="emissions"
									stroke="#FF6B35"
									strokeWidth={3}
									name="실제 배출량"
									dot={{
										fill: '#FF6B35',
										strokeWidth: 2,
										r: 5,
									}}
								/>
								<Line
									type="monotone"
									dataKey="target"
									stroke="#004E89"
									strokeWidth={2}
									strokeDasharray="5 5"
									name="목표 배출량"
									dot={{
										fill: '#004E89',
										strokeWidth: 2,
										r: 4,
									}}
								/>
							</LineChart>
						</ResponsiveContainer>
					</Paper>
				</Box>

				{/* 하단: 상세 데이터 테이블 2개 */}
				<Box
					sx={{
						display: 'grid',
						gridTemplateColumns: 'repeat(2, 1fr)',
						gap: 2,
						minHeight: '350px',
					}}
				>
					{/* 연간 온실가스 배출량 총량 */}
					<Paper
						elevation={0}
						sx={{
							p: 3,
							overflow: 'auto',
							bgcolor: 'white',
							border: '1px solid #e0e0e0',
							borderRadius: 2,
							boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
						}}
					>
						<Box
							sx={{
								display: 'flex',
								justifyContent: 'space-between',
								alignItems: 'center',
								mb: 3,
							}}
						>
							<Typography
								variant="h6"
								sx={{
									fontWeight: 600,
									color: '#1a1a1a',
									fontSize: '1.1rem',
								}}
							>
								🏭 연간 온실가스 배출량 총량
							</Typography>
							<ToggleButtonGroup
								value={emissionsViewMode}
								exclusive
								onChange={(_, newMode) =>
									newMode && setEmissionsViewMode(newMode)
								}
								size="small"
							>
								<ToggleButton
									value="card"
									aria-label="카드 보기"
								>
									<ViewModule fontSize="small" />
								</ToggleButton>
								<ToggleButton
									value="grid"
									aria-label="그리드 보기"
								>
									<ViewList fontSize="small" />
								</ToggleButton>
							</ToggleButtonGroup>
						</Box>

						{emissionsViewMode === 'card' ? (
							<Box
								sx={{
									display: 'flex',
									flexDirection: 'column',
									gap: 2,
								}}
							>
								{Object.entries(mockEmissionsData.scope).map(
									([scopeNum, data]) => (
										<Box
											key={scopeNum}
											sx={{
												border: '1px solid #e0e0e0',
												borderRadius: 1,
												p: 2,
											}}
										>
											<Typography
												variant="subtitle2"
												sx={{
													fontWeight: 600,
													mb: 1,
													color: '#1976d2',
												}}
											>
												Scope {scopeNum} ({data.rate}%)
											</Typography>
											{data.emission_sources.map(
												(source, index) => (
													<Box
														key={index}
														sx={{
															display: 'flex',
															justifyContent:
																'space-between',
															alignItems:
																'center',
															py: 0.5,
														}}
													>
														<Typography
															variant="body2"
															sx={{
																fontWeight: 500,
															}}
														>
															{source.name}
														</Typography>
														<Box
															sx={{
																textAlign:
																	'right',
															}}
														>
															<Typography
																variant="body2"
																sx={{
																	fontWeight: 600,
																}}
															>
																{source.rate}%
															</Typography>
															<Typography
																variant="caption"
																color="textSecondary"
															>
																{
																	source.quantity
																}{' '}
																{source.unit}
															</Typography>
														</Box>
													</Box>
												)
											)}
										</Box>
									)
								)}
								{/* 총계 카드 */}
								<Box
									sx={{
										border: '2px solid #e91e63',
										borderRadius: 1,
										p: 2,
										bgcolor: '#fce4ec',
									}}
								>
									<Typography
										variant="subtitle2"
										sx={{
											fontWeight: 600,
											mb: 1,
											color: '#e91e63',
										}}
									>
										총계
									</Typography>
									<Box
										sx={{
											display: 'flex',
											justifyContent: 'space-between',
											alignItems: 'center',
											py: 0.5,
										}}
									>
										<Typography
											variant="body2"
											sx={{ fontWeight: 600 }}
										>
											전체 온실가스 배출량
										</Typography>
										<Box sx={{ textAlign: 'right' }}>
											<Typography
												variant="body2"
												sx={{
													fontWeight: 700,
													color: '#e91e63',
												}}
											>
												100.00%
											</Typography>
											<Typography
												variant="body2"
												sx={{
													fontWeight: 600,
													color: '#e91e63',
												}}
											>
												{formatWithUnit(
													totalEmissions,
													'tCO2eq',
													1
												)}
											</Typography>
										</Box>
									</Box>
								</Box>
							</Box>
						) : (
							<TableContainer>
								<Table size="small">
									<TableHead>
										<TableRow>
											<TableCell sx={{ fontWeight: 600 }}>
												구분
											</TableCell>
											<TableCell sx={{ fontWeight: 600 }}>
												배출원
											</TableCell>
											<TableCell
												align="right"
												sx={{ fontWeight: 600 }}
											>
												비율
											</TableCell>
											<TableCell
												align="right"
												sx={{ fontWeight: 600 }}
											>
												배출량
											</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{Object.entries(
											mockEmissionsData.scope
										).map(([scopeNum, data]) =>
											data.emission_sources.map(
												(source, index) => (
													<TableRow
														key={`${scopeNum}-${index}`}
													>
														{index === 0 && (
															<TableCell
																rowSpan={
																	data
																		.emission_sources
																		.length
																}
																sx={{
																	fontWeight: 600,
																}}
															>
																Scope {scopeNum}
															</TableCell>
														)}
														<TableCell>
															{source.name}
														</TableCell>
														<TableCell align="right">
															{source.rate}%
														</TableCell>
														<TableCell align="right">
															{source.quantity}{' '}
															{source.unit}
														</TableCell>
													</TableRow>
												)
											)
										)}
										<TableRow sx={{ bgcolor: '#fce4ec' }}>
											<TableCell
												sx={{
													fontWeight: 700,
													color: '#e91e63',
												}}
											>
												총계
											</TableCell>
											<TableCell sx={{ fontWeight: 600 }}>
												전체 배출량
											</TableCell>
											<TableCell
												align="right"
												sx={{
													fontWeight: 700,
													color: '#e91e63',
												}}
											>
												100.00%
											</TableCell>
											<TableCell
												align="right"
												sx={{
													fontWeight: 700,
													color: '#e91e63',
												}}
											>
												{formatWithUnit(
													totalEmissions,
													'tCO2eq',
													1
												)}
											</TableCell>
										</TableRow>
									</TableBody>
								</Table>
							</TableContainer>
						)}
					</Paper>

					{/* 연간 에너지 사용량 총량 */}
					<Paper
						elevation={0}
						sx={{
							p: 3,
							overflow: 'auto',
							bgcolor: 'white',
							border: '1px solid #e0e0e0',
							borderRadius: 2,
							boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
						}}
					>
						<Box
							sx={{
								display: 'flex',
								justifyContent: 'space-between',
								alignItems: 'center',
								mb: 3,
							}}
						>
							<Typography
								variant="h6"
								sx={{
									fontWeight: 600,
									color: '#1a1a1a',
									fontSize: '1.1rem',
								}}
							>
								⚡ 연간 에너지 사용량 총량
							</Typography>
							<ToggleButtonGroup
								value={energyViewMode}
								exclusive
								onChange={(_, newMode) =>
									newMode && setEnergyViewMode(newMode)
								}
								size="small"
							>
								<ToggleButton
									value="card"
									aria-label="카드 보기"
								>
									<ViewModule fontSize="small" />
								</ToggleButton>
								<ToggleButton
									value="grid"
									aria-label="그리드 보기"
								>
									<ViewList fontSize="small" />
								</ToggleButton>
							</ToggleButtonGroup>
						</Box>

						{energyViewMode === 'card' ? (
							<Box
								sx={{
									display: 'flex',
									flexDirection: 'column',
									gap: 2,
								}}
							>
								{/* Scope 1 (연료) */}
								<Box
									sx={{
										border: '1px solid #e0e0e0',
										borderRadius: 1,
										p: 2,
									}}
								>
									<Typography
										variant="subtitle2"
										sx={{
											fontWeight: 600,
											mb: 1,
											color: '#ff9800',
										}}
									>
										Scope 1 (연료)
									</Typography>
									<Box
										sx={{
											display: 'flex',
											justifyContent: 'space-between',
											alignItems: 'center',
											py: 0.5,
										}}
									>
										<Typography
											variant="body2"
											sx={{ fontWeight: 500 }}
										>
											전기
										</Typography>
										<Box sx={{ textAlign: 'right' }}>
											<Typography
												variant="body2"
												sx={{ fontWeight: 600 }}
											>
												0.22%
											</Typography>
											<Typography
												variant="caption"
												color="textSecondary"
											>
												114,559.9 MJ
											</Typography>
										</Box>
									</Box>
									<Box
										sx={{
											display: 'flex',
											justifyContent: 'space-between',
											alignItems: 'center',
											py: 0.5,
										}}
									>
										<Typography
											variant="body2"
											sx={{ fontWeight: 500 }}
										>
											가스
										</Typography>
										<Box sx={{ textAlign: 'right' }}>
											<Typography
												variant="body2"
												sx={{ fontWeight: 600 }}
											>
												0.71%
											</Typography>
											<Typography
												variant="caption"
												color="textSecondary"
											>
												357,179.4 MJ
											</Typography>
										</Box>
									</Box>
								</Box>

								{/* Scope 2 (전력) */}
								<Box
									sx={{
										border: '1px solid #e0e0e0',
										borderRadius: 1,
										p: 2,
									}}
								>
									<Typography
										variant="subtitle2"
										sx={{
											fontWeight: 600,
											mb: 1,
											color: '#2196f3',
										}}
									>
										Scope 2 (전력)
									</Typography>
									<Box
										sx={{
											display: 'flex',
											justifyContent: 'space-between',
											alignItems: 'center',
											py: 0.5,
										}}
									>
										<Typography
											variant="body2"
											sx={{ fontWeight: 500 }}
										>
											전력 1 공급
										</Typography>
										<Box sx={{ textAlign: 'right' }}>
											<Typography
												variant="body2"
												sx={{ fontWeight: 600 }}
											>
												99.45%
											</Typography>
											<Typography
												variant="caption"
												color="textSecondary"
											>
												50,963,860.8 MJ
											</Typography>
										</Box>
									</Box>
								</Box>

								{/* 총계 */}
								<Box
									sx={{
										border: '2px solid #4caf50',
										borderRadius: 1,
										p: 2,
										bgcolor: '#f1f8e9',
									}}
								>
									<Typography
										variant="subtitle2"
										sx={{
											fontWeight: 600,
											mb: 1,
											color: '#4caf50',
										}}
									>
										총계
									</Typography>
									<Box
										sx={{
											display: 'flex',
											justifyContent: 'space-between',
											alignItems: 'center',
											py: 0.5,
										}}
									>
										<Typography
											variant="body2"
											sx={{ fontWeight: 600 }}
										>
											전체 에너지 사용량
										</Typography>
										<Box sx={{ textAlign: 'right' }}>
											<Typography
												variant="body2"
												sx={{
													fontWeight: 700,
													color: '#4caf50',
												}}
											>
												100.00%
											</Typography>
											<Typography
												variant="body2"
												sx={{
													fontWeight: 600,
													color: '#4caf50',
												}}
											>
												51,766,933.5 MJ
											</Typography>
										</Box>
									</Box>
								</Box>
							</Box>
						) : (
							<TableContainer>
								<Table size="small">
									<TableHead>
										<TableRow>
											<TableCell sx={{ fontWeight: 600 }}>
												구분
											</TableCell>
											<TableCell sx={{ fontWeight: 600 }}>
												에너지원
											</TableCell>
											<TableCell
												align="right"
												sx={{ fontWeight: 600 }}
											>
												비율
											</TableCell>
											<TableCell
												align="right"
												sx={{ fontWeight: 600 }}
											>
												사용량
											</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										<TableRow>
											<TableCell
												rowSpan={2}
												sx={{ fontWeight: 600 }}
											>
												Scope 1 (연료)
											</TableCell>
											<TableCell>전기</TableCell>
											<TableCell align="right">
												0.22%
											</TableCell>
											<TableCell align="right">
												114,559.9 MJ
											</TableCell>
										</TableRow>
										<TableRow>
											<TableCell>가스</TableCell>
											<TableCell align="right">
												0.71%
											</TableCell>
											<TableCell align="right">
												357,179.4 MJ
											</TableCell>
										</TableRow>
										<TableRow>
											<TableCell sx={{ fontWeight: 600 }}>
												Scope 2 (전력)
											</TableCell>
											<TableCell>전력 1 공급</TableCell>
											<TableCell align="right">
												99.45%
											</TableCell>
											<TableCell align="right">
												50,963,860.8 MJ
											</TableCell>
										</TableRow>
										<TableRow sx={{ bgcolor: '#f1f8e9' }}>
											<TableCell
												sx={{
													fontWeight: 700,
													color: '#4caf50',
												}}
											>
												총계
											</TableCell>
											<TableCell sx={{ fontWeight: 600 }}>
												전체 에너지 사용량
											</TableCell>
											<TableCell
												align="right"
												sx={{
													fontWeight: 700,
													color: '#4caf50',
												}}
											>
												100.00%
											</TableCell>
											<TableCell
												align="right"
												sx={{
													fontWeight: 700,
													color: '#4caf50',
												}}
											>
												51,766,933.5 MJ
											</TableCell>
										</TableRow>
									</TableBody>
								</Table>
							</TableContainer>
						)}
					</Paper>
				</Box>
			</Box>
		</Box>
	);
};
