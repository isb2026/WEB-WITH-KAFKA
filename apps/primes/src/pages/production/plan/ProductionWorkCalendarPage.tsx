import React, { useState } from 'react';
import { useTranslation } from '@repo/i18n';
import { PageTemplate } from '@primes/templates';
import {
	Calendar,
	Clock,
	Users,
	Package,
	ChevronLeft,
	ChevronRight,
} from 'lucide-react';
import { RadixButton } from '@repo/radix-ui/components';

// 임시 데이터 타입
interface WorkSchedule {
	id: number;
	date: string;
	time: string;
	title: string;
	description: string;
	type: 'production' | 'maintenance' | 'meeting' | 'other';
	workers: string[];
	status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
	duration: number; // 시간 단위
}

interface CalendarDay {
	date: Date;
	isCurrentMonth: boolean;
	isToday: boolean;
	schedules: WorkSchedule[];
}

export const ProductionWorkCalendarPage: React.FC = () => {
	const { t } = useTranslation('common');
	const [currentDate, setCurrentDate] = useState(new Date());
	const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');

	// 임시 스케줄 데이터
	const [schedules] = useState<WorkSchedule[]>([
		{
			id: 1,
			date: '2024-01-15',
			time: '09:00',
			title: '스마트폰 케이스 생산',
			description: '1차 라인에서 1000개 생산 예정',
			type: 'production',
			workers: ['김철수', '이영희'],
			status: 'scheduled',
			duration: 8,
		},
		{
			id: 2,
			date: '2024-01-15',
			time: '14:00',
			title: '설비 점검',
			description: '사출기 A-01 정기 점검',
			type: 'maintenance',
			workers: ['박기사'],
			status: 'scheduled',
			duration: 2,
		},
		{
			id: 3,
			date: '2024-01-16',
			time: '08:00',
			title: '태블릿 스탠드 생산',
			description: '2차 라인에서 800개 생산 예정',
			type: 'production',
			workers: ['최민수', '장혜진'],
			status: 'in-progress',
			duration: 6,
		},
		{
			id: 4,
			date: '2024-01-17',
			time: '10:00',
			title: '생산팀 회의',
			description: '주간 생산 계획 검토',
			type: 'meeting',
			workers: ['팀장', '생산팀'],
			status: 'scheduled',
			duration: 1,
		},
	]);

	// 캘린더 생성 함수
	const generateCalendar = (date: Date): CalendarDay[] => {
		const year = date.getFullYear();
		const month = date.getMonth();
		const firstDay = new Date(year, month, 1);
		const lastDay = new Date(year, month + 1, 0);
		const startDate = new Date(firstDay);
		const endDate = new Date(lastDay);

		// 주의 시작을 월요일로 설정
		startDate.setDate(startDate.getDate() - ((startDate.getDay() + 6) % 7));
		endDate.setDate(endDate.getDate() + (6 - ((endDate.getDay() + 6) % 7)));

		const days: CalendarDay[] = [];
		const current = new Date(startDate);

		while (current <= endDate) {
			const daySchedules = schedules.filter(
				(schedule) =>
					schedule.date === current.toISOString().split('T')[0]
			);

			days.push({
				date: new Date(current),
				isCurrentMonth: current.getMonth() === month,
				isToday: current.toDateString() === new Date().toDateString(),
				schedules: daySchedules,
			});

			current.setDate(current.getDate() + 1);
		}

		return days;
	};

	const calendarDays = generateCalendar(currentDate);

	// 스케줄 타입별 색상
	const getTypeColor = (type: string) => {
		const colors = {
			production: 'bg-blue-100 text-blue-800 border-blue-200',
			maintenance: 'bg-orange-100 text-orange-800 border-orange-200',
			meeting: 'bg-purple-100 text-purple-800 border-purple-200',
			other: 'bg-gray-100 text-gray-800 border-gray-200',
		};
		return colors[type as keyof typeof colors] || colors.other;
	};

	// 상태별 색상
	const getStatusColor = (status: string) => {
		const colors = {
			scheduled: 'bg-yellow-100 text-yellow-800',
			'in-progress': 'bg-green-100 text-green-800',
			completed: 'bg-blue-100 text-blue-800',
			cancelled: 'bg-red-100 text-red-800',
		};
		return colors[status as keyof typeof colors] || colors.scheduled;
	};

	// 월 변경
	const changeMonth = (direction: 'prev' | 'next') => {
		const newDate = new Date(currentDate);
		newDate.setMonth(
			currentDate.getMonth() + (direction === 'next' ? 1 : -1)
		);
		setCurrentDate(newDate);
	};

	return (
		<PageTemplate>
			<div className="space-y-6 h-full">
				{/* 헤더 */}
				<div className="flex items-center justify-between bg-white rounded-lg border p-4 shadow-sm">
					<div className="flex items-center gap-4">
						<div className="flex items-center gap-2">
							<RadixButton
								variant="outline"
								size="sm"
								onClick={() => changeMonth('prev')}
							>
								<ChevronLeft className="w-4 h-4" />
							</RadixButton>
							<h2 className="text-xl font-semibold">
								{currentDate.getFullYear()}년{' '}
								{currentDate.getMonth() + 1}월
							</h2>
							<RadixButton
								variant="outline"
								size="sm"
								onClick={() => changeMonth('next')}
							>
								<ChevronRight className="w-4 h-4" />
							</RadixButton>
						</div>
					</div>

					<div className="flex items-center gap-2">
						{(['month', 'week', 'day'] as const).map((mode) => (
							<RadixButton
								key={mode}
								variant={
									viewMode === mode ? 'default' : 'outline'
								}
								size="sm"
								onClick={() => setViewMode(mode)}
							>
								{mode === 'month'
									? t(
											'production.plan.calendar.viewMode.month'
										)
									: mode === 'week'
										? t(
												'production.plan.calendar.viewMode.week'
											)
										: t(
												'production.plan.calendar.viewMode.day'
											)}
							</RadixButton>
						))}
					</div>
				</div>

				{/* 월별 캘린더 뷰 */}
				{viewMode === 'month' && (
					<div className="bg-white rounded-lg border shadow-sm overflow-hidden">
						{/* 요일 헤더 */}
						<div className="grid grid-cols-7 border-b">
							{['월', '화', '수', '목', '금', '토', '일'].map(
								(day) => (
									<div
										key={day}
										className="p-3 text-center font-semibold text-gray-700 bg-gray-50"
									>
										{day}
									</div>
								)
							)}
						</div>

						{/* 캘린더 그리드 */}
						<div className="grid grid-cols-7">
							{calendarDays.map((day, index) => (
								<div
									key={index}
									className={`min-h-32 p-2 border-r border-b ${
										day.isCurrentMonth
											? 'bg-white'
											: 'bg-gray-50'
									} ${day.isToday ? 'bg-blue-50' : ''}`}
								>
									<div
										className={`text-sm font-medium mb-2 ${
											day.isCurrentMonth
												? 'text-gray-900'
												: 'text-gray-400'
										} ${day.isToday ? 'text-blue-600' : ''}`}
									>
										{day.date.getDate()}
									</div>

									<div className="space-y-1">
										{day.schedules
											.slice(0, 3)
											.map((schedule) => (
												<div
													key={schedule.id}
													className={`text-xs p-1 rounded border ${getTypeColor(schedule.type)}`}
													title={`${schedule.time} - ${schedule.title}`}
												>
													<div className="font-medium truncate">
														{schedule.title}
													</div>
													<div className="flex items-center gap-1">
														<Clock className="w-3 h-3" />
														<span>
															{schedule.time}
														</span>
													</div>
												</div>
											))}
										{day.schedules.length > 3 && (
											<div className="text-xs text-gray-500 text-center">
												+{day.schedules.length - 3}{' '}
												{t(
													'production.plan.calendar.moreSchedules'
												)}
											</div>
										)}
									</div>
								</div>
							))}
						</div>
					</div>
				)}

				{/* 타임라인 뷰 (주/일 모드에서 사용) */}
				{(viewMode === 'week' || viewMode === 'day') && (
					<div className="bg-white rounded-lg border shadow-sm p-6">
						<h3 className="text-lg font-semibold mb-4">
							{t('production.plan.calendar.timelineView')}
						</h3>
						<div className="h-96 flex items-center justify-center bg-gray-50 rounded-lg">
							<div className="text-center">
								<Calendar className="w-16 h-16 text-gray-400 mx-auto mb-2" />
								<p className="text-gray-500">
									{t(
										'production.plan.calendar.timelineViewPlaceholder'
									)}
								</p>
								<p className="text-sm text-gray-400">
									{t(
										'production.plan.calendar.dragDropPlaceholder'
									)}
								</p>
							</div>
						</div>
					</div>
				)}

				{/* 오늘의 스케줄 요약 */}
				<div className="bg-white rounded-lg border shadow-sm p-6">
					<h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
						<Calendar className="w-5 h-5" />
						{t('production.plan.calendar.todaySchedule')}
					</h3>

					<div className="space-y-3">
						{schedules
							.filter(
								(schedule) =>
									schedule.date ===
									new Date().toISOString().split('T')[0]
							)
							.map((schedule) => (
								<div
									key={schedule.id}
									className="flex items-center gap-3 p-3 border rounded-lg"
								>
									<div className="text-sm font-medium text-gray-600">
										{schedule.time}
									</div>
									<div className="flex-1">
										<div className="font-medium">
											{schedule.title}
										</div>
										<div className="text-sm text-gray-600">
											{schedule.description}
										</div>
									</div>
									<div className="flex items-center gap-2">
										<span
											className={`px-2 py-1 rounded-full text-xs ${getStatusColor(schedule.status)}`}
										>
											{schedule.status}
										</span>
										<div className="flex items-center gap-1 text-sm text-gray-500">
											<Users className="w-4 h-4" />
											<span>
												{schedule.workers.length}
											</span>
										</div>
									</div>
								</div>
							))}

						{schedules.filter(
							(schedule) =>
								schedule.date ===
								new Date().toISOString().split('T')[0]
						).length === 0 && (
							<div className="text-center py-8 text-gray-500">
								{t('production.plan.calendar.noScheduleToday')}
							</div>
						)}
					</div>
				</div>
			</div>
		</PageTemplate>
	);
};
