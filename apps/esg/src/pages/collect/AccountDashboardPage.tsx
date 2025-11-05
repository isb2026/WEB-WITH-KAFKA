import React, { useState, useEffect } from 'react';
import {
	Box,
	Card,
	CardContent,
	Typography,
	Chip,
	Divider,
	Paper,
	LinearProgress,
	Alert,
	IconButton,
} from '@mui/material';
import {
	TrendingUp,
	TrendingDown,
	Activity,
	Calendar,
	User,
	Building2,
	ArrowLeft,
	BarChart3,
	Target,
	Zap,
} from 'lucide-react';
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from 'recharts';
import { useActionButtons } from '@moornmo/hooks';

interface AccountDashboardPageProps {
	accountData: any;
	onBack: () => void;
}

// 목업 데이터
const mockMonthlyUsage = [
	{ month: '1월', usage: 120, target: 100, cost: 1200000 },
	{ month: '2월', usage: 95, target: 100, cost: 950000 },
	{ month: '3월', usage: 110, target: 100, cost: 1100000 },
	{ month: '4월', usage: 85, target: 100, cost: 850000 },
	{ month: '5월', usage: 130, target: 100, cost: 1300000 },
	{ month: '6월', usage: 115, target: 100, cost: 1150000 },
	{ month: '7월', usage: 140, target: 100, cost: 1400000 },
	{ month: '8월', usage: 125, target: 100, cost: 1250000 },
	{ month: '9월', usage: 105, target: 100, cost: 1050000 },
	{ month: '10월', usage: 90, target: 100, cost: 900000 },
	{ month: '11월', usage: 100, target: 100, cost: 1000000 },
	{ month: '12월', usage: 110, target: 100, cost: 1100000 },
];

const mockRecentRecords = [
	{
		date: '2024-12-15',
		usage: 125,
		cost: 1250000,
		status: 'completed',
		note: '정상 입력',
	},
	{
		date: '2024-11-15',
		usage: 100,
		cost: 1000000,
		status: 'completed',
		note: '정상 입력',
	},
	{
		date: '2024-10-15',
		usage: 90,
		cost: 900000,
		status: 'pending',
		note: '검토 중',
	},
	{
		date: '2024-09-15',
		usage: 105,
		cost: 1050000,
		status: 'completed',
		note: '정상 입력',
	},
];

export const AccountDashboardPage: React.FC<AccountDashboardPageProps> = ({
	accountData,
	onBack,
}) => {
	const { setCreate, setEdit, setDelete } = useActionButtons();
	// Refs
	const [selectedPeriod, setSelectedPeriod] = useState('2024');

	// 계산된 값들
	const currentMonthUsage = mockMonthlyUsage[mockMonthlyUsage.length - 1];
	const previousMonthUsage = mockMonthlyUsage[mockMonthlyUsage.length - 2];
	const usageChange =
		((currentMonthUsage.usage - previousMonthUsage.usage) /
			previousMonthUsage.usage) *
		100;

	const yearlyTotal = mockMonthlyUsage.reduce(
		(sum, month) => sum + month.usage,
		0
	);
	const yearlyTargetTotal = mockMonthlyUsage.reduce(
		(sum, month) => sum + month.target,
		0
	);
	const achievementRate = (yearlyTotal / yearlyTargetTotal) * 100;

	const totalCost = mockMonthlyUsage.reduce(
		(sum, month) => sum + month.cost,
		0
	);

	useEffect(() => {
		setCreate(false);
		setEdit(false);
		setDelete(false);
	}, []);
	return (
		<Box sx={{ p: 3, minHeight: '100vh' }}>
			{/* 헤더 */}
			<Box sx={{ mb: 3 }}>
				{/* 뒤로가기 버튼 */}
				<Box sx={{ mb: 2 }}>
					<IconButton
						onClick={onBack}
						sx={{
							backgroundColor: '#f8f9fa',
							border: '1px solid #e9ecef',
							borderRadius: 2,
							px: 2,
							py: 1,
							boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
							'&:hover': {
								backgroundColor: '#e9ecef',
								borderColor: '#dee2e6',
								boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)',
							},
						}}
					>
						<ArrowLeft size={18} />
						<Typography
							sx={{
								ml: 1,
								fontWeight: 'bold',
								color: '#333',
								fontSize: 14,
							}}
						>
							뒤로가기
						</Typography>
					</IconButton>
				</Box>

				{/* 타이틀과 뱃지 카드 */}
				<Card
					sx={{
						p: 3,
						boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
						borderRadius: 3,
						border: '1px solid #f0f0f0',
					}}
				>
					<Box
						sx={{
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
							flexWrap: 'wrap',
							gap: 2,
						}}
					>
						{/* 타이틀 */}
						<Typography
							variant="h5"
							sx={{
								fontWeight: 'bold',
								color: '#333',
								fontSize: 20,
							}}
						>
							{accountData?.name || '관리항목'}
						</Typography>

						{/* 뱃지들 */}
						<Box
							sx={{
								display: 'flex',
								alignItems: 'center',
								gap: 2,
								flexWrap: 'wrap',
							}}
						>
							<Chip
								icon={<Building2 size={14} />}
								label={accountData?.company?.name || '무른모'}
								variant="outlined"
								size="small"
								sx={{
									px: 1,
									py: 0.5,
									height: 'auto',
									'& .MuiChip-label': {
										px: 0.5,
										py: 0.25,
										fontSize: '0.75rem',
										fontWeight: 500,
									},
									'& .MuiChip-icon': {
										ml: 0.5,
										mr: -0.25,
									},
								}}
							/>
							<Chip
								icon={<Target size={14} />}
								label={accountData?.scope || 'Scope 1'}
								color="primary"
								size="small"
								sx={{
									px: 1,
									py: 0.5,
									height: 'auto',
									'& .MuiChip-label': {
										px: 0.5,
										py: 0.25,
										fontSize: '0.75rem',
										fontWeight: 500,
									},
									'& .MuiChip-icon': {
										ml: 0.5,
										mr: -0.25,
									},
								}}
							/>
							<Chip
								icon={<User size={14} />}
								label={
									accountData?.chargerName
										? `${accountData.chargerName}(${accountData.chargerDepartment})`
										: '담당자 미지정'
								}
								variant="outlined"
								size="small"
								sx={{
									px: 1,
									py: 0.5,
									height: 'auto',
									'& .MuiChip-label': {
										px: 0.5,
										py: 0.25,
										fontSize: '0.75rem',
										fontWeight: 500,
									},
									'& .MuiChip-icon': {
										ml: 0.5,
										mr: -0.25,
									},
								}}
							/>
						</Box>
					</Box>
				</Card>
			</Box>

			<Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', mb: 3 }}>
				<Card sx={{ flex: '1 1 300px', minWidth: 250 }}>
					<CardContent>
						<Box
							sx={{
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'space-between',
								mb: 2,
							}}
						>
							<Typography variant="h6" color="textSecondary">
								이번 달 사용량
							</Typography>
							<Activity size={24} color="#4ECDC4" />
						</Box>
						<Typography
							variant="h4"
							sx={{ fontWeight: 'bold', mb: 1 }}
						>
							{currentMonthUsage.usage.toLocaleString()}{' '}
							{accountData?.unit || 'kWh'}
						</Typography>
						<Box
							sx={{
								display: 'flex',
								alignItems: 'center',
								gap: 1,
							}}
						>
							{usageChange > 0 ? (
								<TrendingUp size={16} color="#FF6B6B" />
							) : (
								<TrendingDown size={16} color="#4ECDC4" />
							)}
							<Typography
								variant="body2"
								color={usageChange > 0 ? 'error' : 'success'}
							>
								{Math.abs(usageChange).toFixed(1)}% 전월 대비
							</Typography>
						</Box>
					</CardContent>
				</Card>

				<Card sx={{ flex: '1 1 300px', minWidth: 250 }}>
					<CardContent>
						<Box
							sx={{
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'space-between',
								mb: 2,
							}}
						>
							<Typography variant="h6" color="textSecondary">
								연간 총 사용량
							</Typography>
							<BarChart3 size={24} color="#45B7D1" />
						</Box>
						<Typography
							variant="h4"
							sx={{ fontWeight: 'bold', mb: 1 }}
						>
							{yearlyTotal.toLocaleString()}{' '}
							{accountData?.unit || 'kWh'}
						</Typography>
						<LinearProgress
							variant="determinate"
							value={Math.min(achievementRate, 100)}
							sx={{ mb: 1 }}
							color={achievementRate > 100 ? 'error' : 'primary'}
						/>
						<Typography variant="body2" color="textSecondary">
							목표 대비 {achievementRate.toFixed(1)}%
						</Typography>
					</CardContent>
				</Card>

				<Card sx={{ flex: '1 1 300px', minWidth: 250 }}>
					<CardContent>
						<Box
							sx={{
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'space-between',
								mb: 2,
							}}
						>
							<Typography variant="h6" color="textSecondary">
								연간 총 비용
							</Typography>
							<Zap size={24} color="#FFA726" />
						</Box>
						<Typography
							variant="h4"
							sx={{ fontWeight: 'bold', mb: 1 }}
						>
							₩{(totalCost / 1000000).toFixed(1)}M
						</Typography>
						<Typography variant="body2" color="textSecondary">
							월 평균 ₩{(totalCost / 12 / 10000).toFixed(0)}만원
						</Typography>
					</CardContent>
				</Card>
			</Box>

			{/* 차트 섹션 */}
			<Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', mb: 3 }}>
				{/* 월별 사용량 추이 차트 */}
				<Card sx={{ flex: '2 1 600px', minWidth: 600, height: 400 }}>
					<CardContent>
						<Typography
							variant="h6"
							sx={{ mb: 2, fontWeight: 'bold' }}
						>
							월별 사용량 추이
						</Typography>
						<ResponsiveContainer width="100%" height={320}>
							<LineChart data={mockMonthlyUsage}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="month" />
								<YAxis />
								<Tooltip
									formatter={(value, name) => [
										`${value} ${accountData?.unit || 'kWh'}`,
										name === 'usage'
											? '실제 사용량'
											: '목표 사용량',
									]}
								/>
								<Line
									type="monotone"
									dataKey="usage"
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
									dataKey="target"
									stroke="#FF6B6B"
									strokeWidth={2}
									strokeDasharray="5 5"
									dot={{
										fill: '#FF6B6B',
										strokeWidth: 2,
										r: 3,
									}}
								/>
							</LineChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>
			</Box>

			{/* 하단 섹션 */}
			<Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
				{/* 최근 입력 기록 */}
				<Card sx={{ flex: '1 1 500px', minWidth: 500, height: 400 }}>
					<CardContent>
						<Typography
							variant="h6"
							sx={{ mb: 2, fontWeight: 'bold' }}
						>
							최근 입력 기록
						</Typography>
						<Box sx={{ maxHeight: 320, overflow: 'auto' }}>
							{mockRecentRecords.map((record, index) => (
								<Paper
									key={index}
									sx={{
										p: 2,
										mb: 2,
										border: '1px solid #e0e0e0',
										borderRadius: 2,
									}}
								>
									<Box
										sx={{
											display: 'flex',
											justifyContent: 'space-between',
											alignItems: 'center',
											mb: 1,
										}}
									>
										<Typography
											variant="body1"
											sx={{ fontWeight: 'bold' }}
										>
											{record.date}
										</Typography>
										<Chip
											label={
												record.status === 'completed'
													? '완료'
													: '검토 중'
											}
											color={
												record.status === 'completed'
													? 'success'
													: 'warning'
											}
											size="small"
											sx={{
												px: 0.75,
												py: 0.25,
												height: 'auto',
												'& .MuiChip-label': {
													px: 0.5,
													py: 0.125,
													fontSize: '0.6875rem',
													fontWeight: 600,
												},
											}}
										/>
									</Box>
									<Box
										sx={{
											display: 'flex',
											justifyContent: 'space-between',
											mb: 1,
										}}
									>
										<Typography
											variant="body2"
											color="textSecondary"
										>
											사용량:{' '}
											{record.usage.toLocaleString()}{' '}
											{accountData?.unit || 'kWh'}
										</Typography>
										<Typography
											variant="body2"
											color="textSecondary"
										>
											비용: ₩
											{(
												record.cost / 10000
											).toLocaleString()}
											만원
										</Typography>
									</Box>
									<Typography
										variant="body2"
										color="textSecondary"
									>
										{record.note}
									</Typography>
								</Paper>
							))}
						</Box>
					</CardContent>
				</Card>

				{/* 알림 및 권장사항 */}
				<Card sx={{ flex: '1 1 500px', minWidth: 500, height: 400 }}>
					<CardContent>
						<Typography
							variant="h6"
							sx={{ mb: 2, fontWeight: 'bold' }}
						>
							알림 및 권장사항
						</Typography>
						<Box sx={{ maxHeight: 320, overflow: 'auto' }}>
							<Alert severity="warning" sx={{ mb: 2 }}>
								<Typography variant="body2">
									<strong>목표 초과 알림</strong>
									<br />
									이번 달 사용량이 목표치를{' '}
									{Math.abs(usageChange).toFixed(1)}%
									초과했습니다.
								</Typography>
							</Alert>

							<Alert severity="info" sx={{ mb: 2 }}>
								<Typography variant="body2">
									<strong>데이터 입력 알림</strong>
									<br />
									10월 데이터가 아직 검토 중입니다. 확인 후
									승인해주세요.
								</Typography>
							</Alert>

							<Alert severity="success" sx={{ mb: 2 }}>
								<Typography variant="body2">
									<strong>효율성 개선</strong>
									<br />
									지난 3개월 대비 평균 사용량이 5%
									감소했습니다.
								</Typography>
							</Alert>

							<Paper
								sx={{
									p: 2,
									backgroundColor: '#f8f9fa',
									border: '1px solid #e9ecef',
								}}
							>
								<Typography
									variant="body2"
									sx={{ fontWeight: 'bold', mb: 1 }}
								>
									💡 에너지 절약 팁
								</Typography>
								<Typography
									variant="body2"
									color="textSecondary"
								>
									• 피크 시간대 사용량 조절로 비용 절감 가능
									<br />
									• 정기적인 설비 점검으로 효율성 향상
									<br />• 월별 목표 설정으로 체계적인 관리
								</Typography>
							</Paper>
						</Box>
					</CardContent>
				</Card>
			</Box>
		</Box>
	);
};
