import React, { useState, useEffect } from 'react';
import { useTranslation } from '@repo/i18n';
import PageTemplate from '@primes/templates/PageTemplate';
import {
	Calendar,
	ChevronLeft,
	ChevronRight,
	Plus,
	Clock,
	CheckCircle,
	AlertCircle,
	XCircle,
	Filter,
} from 'lucide-react';
import {
	RadixSelect,
	RadixSelectGroup,
	RadixSelectItem,
	RadixButton,
} from '@repo/radix-ui/components';

// 달력 이벤트 타입
interface CalendarEvent {
	id: number;
	date: string;
	equipmentCode: string;
	equipment: string;
	inspectionType: string;
	inspector: string;
	status: 'planned' | 'in-progress' | 'completed' | 'overdue';
	priority: 'high' | 'medium' | 'low';
	estimatedHours: number;
}

// 월 정보 타입
interface MonthInfo {
	year: number;
	month: number;
	days: number;
	firstDayOfWeek: number; // 0: 일요일, 1: 월요일, ...
}

const QualityPeriodicInspectionCalendarPage: React.FC = () => {
	const { t } = useTranslation('common');

	// 현재 날짜 상태
	const [currentDate, setCurrentDate] = useState(new Date());
	const [selectedDepartment, setSelectedDepartment] = useState('all');
	const [selectedStatus, setSelectedStatus] = useState('all');

	// 샘플 이벤트 데이터
	const [events] = useState<CalendarEvent[]>([
		{
			id: 1,
			date: '2024-01-15',
			equipmentCode: 'INJ-001',
			equipment: '사출성형기 #001',
			inspectionType: '월간정기검사',
			inspector: '김정비',
			status: 'completed',
			priority: 'high',
			estimatedHours: 4,
		},
		{
			id: 2,
			date: '2024-01-18',
			equipmentCode: 'MCH-005',
			equipment: '공작기계 #005',
			inspectionType: '월간정기검사',
			inspector: '최정밀',
			status: 'overdue',
			priority: 'high',
			estimatedHours: 5,
		},
		{
			id: 3,
			date: '2024-01-20',
			equipmentCode: 'CNV-A01',
			equipment: '컨베이어 라인 A',
			inspectionType: '분기정기검사',
			inspector: '이점검',
			status: 'in-progress',
			priority: 'medium',
			estimatedHours: 6,
		},
		{
			id: 4,
			date: '2024-01-25',
			equipmentCode: 'PRS-003',
			equipment: '프레스 #003',
			inspectionType: '월간정기검사',
			inspector: '박안전',
			status: 'planned',
			priority: 'high',
			estimatedHours: 3,
		},
		{
			id: 5,
			date: '2024-01-28',
			equipmentCode: 'WLD-002',
			equipment: '용접로봇 #002',
			inspectionType: '월간정기검사',
			inspector: '정용접',
			status: 'planned',
			priority: 'medium',
			estimatedHours: 4,
		},
		{
			id: 6,
			date: '2024-01-30',
			equipmentCode: 'CNC-004',
			equipment: 'CNC 가공기 #004',
			inspectionType: '분기정기검사',
			inspector: '김가공',
			status: 'planned',
			priority: 'low',
			estimatedHours: 5,
		},
	]);

	// 월 정보 계산
	const getMonthInfo = (date: Date): MonthInfo => {
		const year = date.getFullYear();
		const month = date.getMonth();
		const firstDay = new Date(year, month, 1);
		const lastDay = new Date(year, month + 1, 0);

		return {
			year,
			month,
			days: lastDay.getDate(),
			firstDayOfWeek: firstDay.getDay(),
		};
	};

	const monthInfo = getMonthInfo(currentDate);

	// 해당 날짜의 이벤트 가져오기
	const getEventsForDate = (day: number): CalendarEvent[] => {
		const dateStr = `${monthInfo.year}-${String(monthInfo.month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
		return events.filter((event) => event.date === dateStr);
	};

	// 필터링된 이벤트
	const getFilteredEvents = (dayEvents: CalendarEvent[]): CalendarEvent[] => {
		let filtered = dayEvents;

		if (selectedStatus !== 'all') {
			filtered = filtered.filter(
				(event) => event.status === selectedStatus
			);
		}

		// 부서 필터 (샘플에서는 생략)

		return filtered;
	};

	// 달력 날짜 배열 생성
	const generateCalendarDays = () => {
		const days = [];

		// 이전 달의 날짜들 (빈 공간 채우기)
		for (let i = 0; i < monthInfo.firstDayOfWeek; i++) {
			const prevMonthDate = new Date(
				monthInfo.year,
				monthInfo.month,
				-monthInfo.firstDayOfWeek + i + 1
			);
			days.push({
				day: prevMonthDate.getDate(),
				isCurrentMonth: false,
				date: prevMonthDate,
			});
		}

		// 현재 달의 날짜들
		for (let day = 1; day <= monthInfo.days; day++) {
			days.push({
				day,
				isCurrentMonth: true,
				date: new Date(monthInfo.year, monthInfo.month, day),
			});
		}

		// 다음 달의 날짜들 (6주 완성을 위해)
		const remainingCells = 42 - days.length; // 6주 * 7일 = 42칸
		for (let day = 1; day <= remainingCells; day++) {
			const nextMonthDate = new Date(
				monthInfo.year,
				monthInfo.month + 1,
				day
			);
			days.push({
				day: nextMonthDate.getDate(),
				isCurrentMonth: false,
				date: nextMonthDate,
			});
		}

		return days;
	};

	const calendarDays = generateCalendarDays();

	// 상태별 색상 설정
	const getStatusColor = (status: string) => {
		switch (status) {
			case 'completed':
				return 'bg-green-100 text-green-800 border-green-200';
			case 'in-progress':
				return 'bg-blue-100 text-blue-800 border-blue-200';
			case 'planned':
				return 'bg-gray-100 text-gray-800 border-gray-200';
			case 'overdue':
				return 'bg-red-100 text-red-800 border-red-200';
			default:
				return 'bg-gray-100 text-gray-800 border-gray-200';
		}
	};

	// 상태별 아이콘
	const getStatusIcon = (status: string) => {
		switch (status) {
			case 'completed':
				return <CheckCircle size={12} />;
			case 'in-progress':
				return <Clock size={12} />;
			case 'planned':
				return <Calendar size={12} />;
			case 'overdue':
				return <AlertCircle size={12} />;
			default:
				return <Clock size={12} />;
		}
	};

	// 우선순위별 색상
	const getPriorityColor = (priority: string) => {
		switch (priority) {
			case 'high':
				return 'border-l-red-500';
			case 'medium':
				return 'border-l-yellow-500';
			case 'low':
				return 'border-l-green-500';
			default:
				return 'border-l-gray-500';
		}
	};

	// 이벤트 핸들러
	const handlePrevMonth = () => {
		setCurrentDate(new Date(monthInfo.year, monthInfo.month - 1, 1));
	};

	const handleNextMonth = () => {
		setCurrentDate(new Date(monthInfo.year, monthInfo.month + 1, 1));
	};

	const handleToday = () => {
		setCurrentDate(new Date());
	};

	const handleEventClick = (event: CalendarEvent) => {
		console.log('Event clicked:', event);
		// 이벤트 상세 모달 또는 편집 화면 표시
	};

	const handleAddInspection = (date: Date) => {
		console.log('Add inspection for date:', date);
		// 새 검사 추가 모달 표시
	};

	// 월별 통계
	const getMonthlyStats = () => {
		const monthEvents = events.filter((event) => {
			const eventDate = new Date(event.date);
			return (
				eventDate.getFullYear() === monthInfo.year &&
				eventDate.getMonth() === monthInfo.month
			);
		});

		return {
			total: monthEvents.length,
			completed: monthEvents.filter((e) => e.status === 'completed')
				.length,
			inProgress: monthEvents.filter((e) => e.status === 'in-progress')
				.length,
			planned: monthEvents.filter((e) => e.status === 'planned').length,
			overdue: monthEvents.filter((e) => e.status === 'overdue').length,
		};
	};

	const stats = getMonthlyStats();

	return (
		<PageTemplate>
			{/* 상단 제어 영역 */}
			<div className="bg-white rounded-lg border p-4 mb-6">
				<div className="flex flex-wrap items-center justify-between gap-4">
					{/* 달력 네비게이션 */}
					<div className="flex items-center gap-4">
						<div className="flex items-center gap-2">
							<RadixButton
								onClick={handlePrevMonth}
								variant="outline"
								size="sm"
								className="p-2"
							>
								<ChevronLeft size={16} />
							</RadixButton>

							<div className="text-lg font-semibold text-gray-900 min-w-[150px] text-center">
								{monthInfo.year}년 {monthInfo.month + 1}월
							</div>

							<RadixButton
								onClick={handleNextMonth}
								variant="outline"
								size="sm"
								className="p-2"
							>
								<ChevronRight size={16} />
							</RadixButton>
						</div>

						<RadixButton
							onClick={handleToday}
							variant="outline"
							size="sm"
						>
							오늘
						</RadixButton>
					</div>

					{/* 필터 영역 */}
					<div className="flex items-center gap-4">
						<div className="flex items-center gap-2">
							<Filter size={16} className="text-gray-500" />
							<span className="text-sm font-medium">상태:</span>
							<div className="min-w-[100px]">
								<RadixSelect
									value={selectedStatus}
									onValueChange={setSelectedStatus}
								>
									<RadixSelectGroup>
										<RadixSelectItem value="all">
											전체
										</RadixSelectItem>
										<RadixSelectItem value="planned">
											계획됨
										</RadixSelectItem>
										<RadixSelectItem value="in-progress">
											진행중
										</RadixSelectItem>
										<RadixSelectItem value="completed">
											완료
										</RadixSelectItem>
										<RadixSelectItem value="overdue">
											지연
										</RadixSelectItem>
									</RadixSelectGroup>
								</RadixSelect>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* 월별 통계 */}
			<div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
				<div className="bg-white rounded-lg border p-4">
					<div className="text-sm text-gray-600">총 검사</div>
					<div className="text-2xl font-bold text-gray-900">
						{stats.total}
					</div>
				</div>
				<div className="bg-white rounded-lg border p-4">
					<div className="text-sm text-gray-600">완료</div>
					<div className="text-2xl font-bold text-green-600">
						{stats.completed}
					</div>
				</div>
				<div className="bg-white rounded-lg border p-4">
					<div className="text-sm text-gray-600">진행중</div>
					<div className="text-2xl font-bold text-blue-600">
						{stats.inProgress}
					</div>
				</div>
				<div className="bg-white rounded-lg border p-4">
					<div className="text-sm text-gray-600">계획됨</div>
					<div className="text-2xl font-bold text-gray-600">
						{stats.planned}
					</div>
				</div>
				<div className="bg-white rounded-lg border p-4">
					<div className="text-sm text-gray-600">지연</div>
					<div className="text-2xl font-bold text-red-600">
						{stats.overdue}
					</div>
				</div>
			</div>

			{/* 범례 */}
			<div className="bg-white rounded-lg border p-4 mb-6">
				<h3 className="text-sm font-medium text-gray-900 mb-3">범례</h3>
				<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
					<div className="flex items-center gap-2">
						<div className="w-4 h-4 bg-green-100 border border-green-200 rounded"></div>
						<span className="text-sm text-gray-600">완료</span>
					</div>
					<div className="flex items-center gap-2">
						<div className="w-4 h-4 bg-blue-100 border border-blue-200 rounded"></div>
						<span className="text-sm text-gray-600">진행중</span>
					</div>
					<div className="flex items-center gap-2">
						<div className="w-4 h-4 bg-gray-100 border border-gray-200 rounded"></div>
						<span className="text-sm text-gray-600">계획됨</span>
					</div>
					<div className="flex items-center gap-2">
						<div className="w-4 h-4 bg-red-100 border border-red-200 rounded"></div>
						<span className="text-sm text-gray-600">지연</span>
					</div>
				</div>
				<div className="mt-3 pt-3 border-t">
					<div className="text-xs text-gray-500">
						우선순위:{' '}
						<span className="border-l-2 border-red-500 pl-1">
							높음
						</span>{' '}
						|
						<span className="border-l-2 border-yellow-500 pl-1 ml-2">
							보통
						</span>{' '}
						|
						<span className="border-l-2 border-green-500 pl-1 ml-2">
							낮음
						</span>
					</div>
				</div>
			</div>

			{/* 달력 */}
			<div className="bg-white rounded-lg border shadow">
				{/* 달력 헤더 */}
				<div className="border-b p-4">
					<div className="grid grid-cols-7 gap-2">
						{['일', '월', '화', '수', '목', '금', '토'].map(
							(day, index) => (
								<div
									key={day}
									className={`text-center text-sm font-medium py-2 ${
										index === 0
											? 'text-red-600'
											: index === 6
												? 'text-blue-600'
												: 'text-gray-700'
									}`}
								>
									{day}
								</div>
							)
						)}
					</div>
				</div>

				{/* 달력 본문 */}
				<div className="p-4">
					<div className="grid grid-cols-7 gap-2">
						{calendarDays.map((dayInfo, index) => {
							const dayEvents = dayInfo.isCurrentMonth
								? getFilteredEvents(
										getEventsForDate(dayInfo.day)
									)
								: [];
							const isToday =
								dayInfo.isCurrentMonth &&
								dayInfo.date.toDateString() ===
									new Date().toDateString();

							return (
								<div
									key={index}
									className={`min-h-[120px] border rounded-lg p-2 ${
										dayInfo.isCurrentMonth
											? 'bg-white'
											: 'bg-gray-50'
									} ${isToday ? 'ring-2 ring-blue-500' : ''}`}
								>
									{/* 날짜 */}
									<div
										className={`text-sm font-medium mb-2 ${
											!dayInfo.isCurrentMonth
												? 'text-gray-400'
												: isToday
													? 'text-blue-600'
													: 'text-gray-700'
										}`}
									>
										{dayInfo.day}
									</div>

									{/* 이벤트들 */}
									<div className="space-y-1">
										{dayEvents.slice(0, 3).map((event) => (
											<div
												key={event.id}
												onClick={() =>
													handleEventClick(event)
												}
												className={`
													text-xs p-1 rounded border-l-2 cursor-pointer
													hover:shadow-sm transition-shadow
													${getStatusColor(event.status)}
													${getPriorityColor(event.priority)}
												`}
											>
												<div className="flex items-center gap-1">
													{getStatusIcon(
														event.status
													)}
													<span className="font-medium truncate">
														{event.equipmentCode}
													</span>
												</div>
												<div className="truncate text-xs opacity-75">
													{event.inspector}
												</div>
											</div>
										))}

										{/* 더 많은 이벤트가 있는 경우 */}
										{dayEvents.length > 3 && (
											<div className="text-xs text-gray-500 text-center">
												+{dayEvents.length - 3}개 더
											</div>
										)}

										{/* 빈 날짜에 추가 버튼 */}
										{dayInfo.isCurrentMonth &&
											dayEvents.length === 0 && (
												<button
													onClick={() =>
														handleAddInspection(
															dayInfo.date
														)
													}
													className="w-full text-xs text-gray-400 hover:text-gray-600 
													border border-dashed border-gray-300 rounded p-1 
													hover:border-gray-400 transition-colors"
												>
													<Plus
														size={12}
														className="mx-auto"
													/>
												</button>
											)}
									</div>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		</PageTemplate>
	);
};

export default QualityPeriodicInspectionCalendarPage;
