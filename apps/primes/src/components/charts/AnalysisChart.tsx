import { useState, useMemo, useEffect, useRef } from 'react';
import { EchartComponent } from '@repo/echart/components';
import {
	RadixButton,
	DropdownMenuRoot,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
} from '@repo/radix-ui/components';
import { FinancialSummaryTable } from './FinancialSummaryTable';

// Types for the component
export type DomainType =
	| 'sales'
	| 'production'
	| 'mold'
	| 'equipment'
	| 'measurement'
	| 'purchase'
	| 'incoming';
export type ChartType = 'line' | 'bar' | 'pie' | 'table';
export type DataType =
	| 'orders'
	| 'delivery'
	| 'maintenance'
	| 'calibration'
	| 'efficiency'
	| 'quality'
	| 'analysis';
export type TimeRange = 'yearly' | 'monthly' | 'weekly' | 'daily';

export interface AnalysisChartProps {
	domain: DomainType;
	chartType: ChartType;
	dataType: DataType;
	timeRange?: TimeRange;
	autoFetchData?: boolean;
	exportEnabled?: boolean;
	interactiveControls?: boolean;
	customTitle?: string;
	customData?: { labels: string[]; series: any[] };
}

// Mobile detection hook
const useIsMobile = () => {
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const checkIsMobile = () => {
			setIsMobile(window.innerWidth < 768);
		};

		checkIsMobile();
		window.addEventListener('resize', checkIsMobile);
		return () => window.removeEventListener('resize', checkIsMobile);
	}, []);

	return isMobile;
};

// Mock API function - replace with real API calls
const fetchChartData = async (
	domain: DomainType,
	dataType: DataType,
	timeRange: TimeRange
) => {
	// Simulate API call
	return new Promise((resolve) => {
		setTimeout(() => {
			const mockData = generateMockData(domain, dataType, timeRange);
			resolve(mockData);
		}, 500);
	});
};

// Generate mock data based on domain and type
const generateMockData = (
	domain: DomainType,
	dataType: DataType,
	timeRange: TimeRange
) => {
	// Dynamic year generation based on current year
	const currentYear = new Date().getFullYear();
	const startYear = currentYear - 6; // Show 7 years including current year
	const years = [];
	for (let year = startYear; year <= currentYear; year++) {
		years.push(year.toString());
	}

	// Dynamic month generation for current year
	const currentMonth = new Date().getMonth();
	const months = [];
	for (let i = 0; i < 12; i++) {
		const monthIndex = (currentMonth - 11 + i + 12) % 12; // Show last 12 months
		const monthNames = [
			'1월',
			'2월',
			'3월',
			'4월',
			'5월',
			'6월',
			'7월',
			'8월',
			'9월',
			'10월',
			'11월',
			'12월',
		];
		months.push(monthNames[monthIndex]);
	}

	// Dynamic week generation
	const weeks = [];
	for (let i = 1; i <= 8; i++) {
		// Show 8 weeks (1주 to 8주)
		weeks.push(`${i}주`);
	}

	// Dynamic day generation for current week
	const currentDay = new Date().getDay();
	const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
	const days = [];
	for (let i = 0; i < 7; i++) {
		const dayIndex = (currentDay - 6 + i + 7) % 7; // Show last 7 days
		days.push(dayNames[dayIndex]);
	}

	const timeLabels = {
		yearly: years,
		monthly: months,
		weekly: weeks,
		daily: days,
	};

	// Generate dynamic data based on the number of time periods
	const generateSeriesData = (baseValues: number[], timeLength: number) => {
		const data = [];
		for (let i = 0; i < timeLength; i++) {
			const baseValue = baseValues[i % baseValues.length];
			const variation = Math.random() * 0.4 - 0.2; // ±20% variation
			data.push(Math.round(baseValue * (1 + variation)));
		}
		return data;
	};

	const seriesConfigs = {
		sales: {
			orders: [
				{
					name: '신규 주문',
					data: generateSeriesData(
						[45, 52, 38, 67, 41, 73, 29, 58, 82, 35, 69, 47],
						timeLabels[timeRange].length
					),
					color: '#6A53B1',
				},
				{
					name: '재주문',
					data: generateSeriesData(
						[30, 28, 42, 25, 38, 31, 45, 22, 35, 48, 27, 39],
						timeLabels[timeRange].length
					),
					color: '#0086C9',
				},
				{
					name: '취소 주문',
					data: generateSeriesData(
						[15, 8, 22, 12, 19, 6, 28, 14, 11, 25, 9, 17],
						timeLabels[timeRange].length
					),
					color: '#DD2590',
				},
			],
			delivery: [
				{
					name: '정시 납품',
					data: generateSeriesData(
						[80, 92, 75, 88, 95, 82, 78, 89, 91, 76, 85, 93],
						timeLabels[timeRange].length
					),
					color: '#6A53B1',
				},
				{
					name: '지연 납품',
					data: generateSeriesData(
						[15, 6, 20, 10, 3, 15, 18, 8, 6, 21, 12, 5],
						timeLabels[timeRange].length
					),
					color: '#0086C9',
				},
				{
					name: '납품 실패',
					data: generateSeriesData(
						[5, 2, 5, 2, 2, 3, 4, 3, 3, 3, 3, 2],
						timeLabels[timeRange].length
					),
					color: '#DD2590',
				},
			],
		},
		production: {
			efficiency: [
				{
					name: '설비 A',
					data: generateSeriesData(
						[85, 91, 78, 89, 94, 82, 87, 93, 88, 79, 86, 92],
						timeLabels[timeRange].length
					),
					color: '#6A53B1',
				},
				{
					name: '설비 B',
					data: generateSeriesData(
						[78, 85, 72, 83, 89, 76, 81, 87, 84, 75, 80, 88],
						timeLabels[timeRange].length
					),
					color: '#0086C9',
				},
				{
					name: '설비 C',
					data: generateSeriesData(
						[72, 79, 68, 77, 83, 71, 76, 82, 79, 70, 75, 84],
						timeLabels[timeRange].length
					),
					color: '#DD2590',
				},
			],
			quality: [
				{
					name: '양품률',
					data: generateSeriesData(
						[95, 97, 92, 96, 98, 94, 95, 97, 96, 93, 95, 98],
						timeLabels[timeRange].length
					),
					color: '#6A53B1',
				},
				{
					name: '불량률',
					data: generateSeriesData(
						[3, 1, 6, 2, 1, 4, 3, 2, 2, 5, 3, 1],
						timeLabels[timeRange].length
					),
					color: '#0086C9',
				},
				{
					name: '재작업률',
					data: generateSeriesData(
						[2, 2, 2, 2, 1, 2, 2, 1, 2, 2, 2, 1],
						timeLabels[timeRange].length
					),
					color: '#DD2590',
				},
			],
		},
		equipment: {
			maintenance: [
				{
					name: '예방 정비',
					data: generateSeriesData(
						[12, 18, 8, 15, 22, 10, 14, 20, 16, 9, 13, 19],
						timeLabels[timeRange].length
					),
					color: '#6A53B1',
				},
				{
					name: '비계획 정비',
					data: generateSeriesData(
						[8, 3, 12, 6, 2, 9, 7, 4, 5, 11, 8, 3],
						timeLabels[timeRange].length
					),
					color: '#0086C9',
				},
				{
					name: '개선 작업',
					data: generateSeriesData(
						[5, 8, 3, 7, 10, 4, 6, 9, 7, 3, 5, 8],
						timeLabels[timeRange].length
					),
					color: '#DD2590',
				},
			],
			efficiency: [
				{
					name: 'OEE',
					data: generateSeriesData(
						[75, 82, 68, 79, 87, 72, 76, 84, 80, 70, 75, 86],
						timeLabels[timeRange].length
					),
					color: '#6A53B1',
				},
				{
					name: '가동률',
					data: generateSeriesData(
						[85, 92, 78, 88, 95, 82, 86, 93, 89, 80, 85, 94],
						timeLabels[timeRange].length
					),
					color: '#0086C9',
				},
				{
					name: '성능률',
					data: generateSeriesData(
						[88, 94, 82, 90, 96, 85, 88, 93, 91, 83, 87, 95],
						timeLabels[timeRange].length
					),
					color: '#DD2590',
				},
			],
		},
		mold: {
			calibration: [
				{
					name: '온도 정확도',
					data: generateSeriesData(
						[98, 99, 97, 98, 99, 98, 99, 99, 98, 97, 98, 99],
						timeLabels[timeRange].length
					),
					color: '#6A53B1',
				},
				{
					name: '압력 정확도',
					data: generateSeriesData(
						[96, 98, 95, 97, 99, 96, 98, 99, 97, 95, 97, 98],
						timeLabels[timeRange].length
					),
					color: '#0086C9',
				},
				{
					name: '속도 정확도',
					data: generateSeriesData(
						[94, 97, 93, 96, 98, 95, 97, 98, 96, 94, 96, 97],
						timeLabels[timeRange].length
					),
					color: '#DD2590',
				},
			],
			quality: [
				{
					name: '치수 정확도',
					data: generateSeriesData(
						[
							99.2, 99.5, 98.8, 99.3, 99.6, 99.1, 99.4, 99.7,
							99.3, 98.9, 99.2, 99.5,
						],
						timeLabels[timeRange].length
					),
					color: '#6A53B1',
				},
				{
					name: '표면 품질',
					data: generateSeriesData(
						[
							98.5, 99.1, 97.9, 98.8, 99.3, 98.2, 98.7, 99.2,
							98.9, 97.8, 98.5, 99.1,
						],
						timeLabels[timeRange].length
					),
					color: '#0086C9',
				},
			],
		},
		measurement: {
			calibration: [
				{
					name: '측정 정확도',
					data: generateSeriesData(
						[
							99.8, 99.9, 99.6, 99.8, 99.9, 99.7, 99.8, 99.9,
							99.8, 99.6, 99.7, 99.9,
						],
						timeLabels[timeRange].length
					),
					color: '#6A53B1',
				},
				{
					name: '재현성',
					data: generateSeriesData(
						[
							99.5, 99.8, 99.3, 99.6, 99.9, 99.4, 99.5, 99.8,
							99.6, 99.2, 99.4, 99.7,
						],
						timeLabels[timeRange].length
					),
					color: '#0086C9',
				},
			],
		},
		purchase: {
			orders: [
				{
					name: '원자재 주문',
					data: generateSeriesData(
						[
							120, 155, 98, 142, 178, 115, 138, 165, 152, 105,
							128, 172,
						],
						timeLabels[timeRange].length
					),
					color: '#6A53B1',
				},
				{
					name: '부품 주문',
					data: generateSeriesData(
						[80, 102, 65, 88, 115, 72, 85, 98, 92, 68, 82, 108],
						timeLabels[timeRange].length
					),
					color: '#0086C9',
				},
				{
					name: '소모품 주문',
					data: generateSeriesData(
						[45, 58, 32, 52, 68, 38, 48, 62, 55, 35, 45, 65],
						timeLabels[timeRange].length
					),
					color: '#DD2590',
				},
			],
			delivery: [
				{
					name: '정시 입고',
					data: generateSeriesData(
						[85, 94, 76, 88, 96, 82, 86, 92, 89, 78, 84, 95],
						timeLabels[timeRange].length
					),
					color: '#6A53B1',
				},
				{
					name: '지연 입고',
					data: generateSeriesData(
						[12, 4, 18, 9, 2, 15, 11, 6, 8, 19, 13, 3],
						timeLabels[timeRange].length
					),
					color: '#0086C9',
				},
				{
					name: '품질 불량',
					data: generateSeriesData(
						[3, 2, 5, 3, 2, 3, 3, 2, 3, 3, 3, 2],
						timeLabels[timeRange].length
					),
					color: '#DD2590',
				},
			],
		},
		incoming: {
			analysis: [
				{
					name: '입고량',
					data: generateSeriesData(
						[
							450, 580, 380, 520, 680, 420, 480, 620, 550, 390,
							460, 650,
						],
						timeLabels[timeRange].length
					),
					color: '#6A53B1',
				},
				{
					name: '검수 완료',
					data: generateSeriesData(
						[
							430, 565, 365, 505, 665, 405, 465, 605, 535, 375,
							445, 635,
						],
						timeLabels[timeRange].length
					),
					color: '#0086C9',
				},
				{
					name: '불량 발견',
					data: generateSeriesData(
						[20, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15],
						timeLabels[timeRange].length
					),
					color: '#DD2590',
				},
			],
		},
	};

	return {
		labels: timeLabels[timeRange],
		series:
			(seriesConfigs[domain] as any)?.[dataType] ||
			seriesConfigs.sales.orders,
	};
};

// Generate title based on domain and data type
const generateTitle = (
	domain: DomainType,
	dataType: DataType,
	timeRange: TimeRange
) => {
	const domainNames = {
		sales: '영업',
		production: '생산',
		mold: '금형',
		equipment: '설비',
		measurement: '측정',
		purchase: '구매',
		incoming: '입고',
	};

	const dataTypeNames = {
		orders: '주문',
		delivery: '납품',
		maintenance: '정비',
		calibration: '교정',
		efficiency: '효율',
		quality: '품질',
		analysis: '분석',
	};

	const timeRangeNames = {
		yearly: '연간',
		monthly: '월간',
		weekly: '주간',
		daily: '일간',
	};

	return `${domainNames[domain]} ${dataTypeNames[dataType]} ${timeRangeNames[timeRange]} 현황`;
};

export default function AnalysisChart({
	domain,
	chartType,
	dataType,
	timeRange = 'yearly',
	autoFetchData = true,
	exportEnabled = true,
	interactiveControls = true,
	customTitle,
	customData,
}: AnalysisChartProps) {
	const [data, setData] = useState<any>(null);
	const [series, setSeries] = useState<Record<string, boolean>>({});
	const [showTooltip, setShowTooltip] = useState(true);
	const [showValueLabels, setShowValueLabels] = useState(false);
	const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);
	const [loading, setLoading] = useState(false);
	const settingsDropdownRef = useRef<HTMLDivElement>(null);
	const chartRef = useRef<{
		getImage: (opts: any) => string | undefined;
	} | null>(null);
	const isMobile = useIsMobile();

	// Fetch data on component mount or when params change
	useEffect(() => {
		if (autoFetchData && !customData) {
			setLoading(true);
			fetchChartData(domain, dataType, timeRange)
				.then((result: any) => {
					setData(result);
					// Initialize series visibility
					const initialSeries: Record<string, boolean> = {};
					result.series.forEach((s: any) => {
						initialSeries[s.name] = true;
					});
					setSeries(initialSeries);
				})
				.finally(() => setLoading(false));
		} else if (customData) {
			setData(customData);
			const initialSeries: Record<string, boolean> = {};
			customData.series?.forEach((s: any) => {
				initialSeries[s.name] = true;
			});
			setSeries(initialSeries);
		}
	}, [domain, dataType, timeRange, autoFetchData, customData]);

	// Handle clicking outside to close dropdown
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				settingsDropdownRef.current &&
				!settingsDropdownRef.current.contains(event.target as Node)
			) {
				setShowSettingsDropdown(false);
			}
		}

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	const handleSeriesToggle = (name: string) => {
		setSeries((prev) => ({ ...prev, [name]: !prev[name] }));
	};

	const handleTooltipToggle = () => {
		setShowTooltip((v) => !v);
	};

	const handleValueLabelsToggle = () => {
		setShowValueLabels((v) => !v);
	};

	// Print chart as image
	const handlePrintChartImage = () => {
		if (chartRef.current) {
			const dataURL = chartRef.current.getImage({
				type: 'png',
				pixelRatio: 2,
			});
			if (dataURL) {
				const link = document.createElement('a');
				link.download = `${domain}-${dataType}-chart.png`;
				link.href = dataURL;
				link.click();
			}
		}
	};

	// Generate chart options based on chart type
	const chartOptions = useMemo((): any => {
		if (!data) return {};

		const filteredSeries = data.series.filter((s: any) => series[s.name]);

		// Base configuration
		const baseConfig = {
			tooltip: {
				trigger: 'axis',
				show: showTooltip,
			},
			legend: {
				data: filteredSeries.map((s: any) => s.name),
				right: isMobile ? 10 : -1,
				top: isMobile ? 10 : -5,
				icon: 'circle',
				itemWidth: isMobile ? 8 : 6,
				itemHeight: isMobile ? 10 : 8,
				textStyle: {
					color: '#333',
					fontSize: isMobile ? 12 : 14,
				},
				selectedMode: true,
				selector: false,
			},
			grid: {
				left: isMobile ? 40 : 60,
				right: isMobile ? 20 : 40,
				top: isMobile ? 60 : 50,
				bottom: isMobile ? 40 : 60,
			},
			xAxis: {
				type: 'category',
				name: '영도',
				nameLocation: 'middle',
				nameGap: isMobile ? 30 : 40,
				nameTextStyle: {
					fontSize: isMobile ? 12 : 14,
					fontWeight: 'normal',
					color: '#333',
				},
				data: data.labels,
				axisLabel: {
					fontSize: isMobile ? 11 : 13,
				},
			},
			yAxis: {
				type: 'value',
				name: '매입률',
				nameLocation: 'middle',
				nameGap: isMobile ? 30 : 40,
				nameTextStyle: {
					fontSize: isMobile ? 12 : 14,
					fontWeight: 'normal',
					color: '#333',
				},
				axisLabel: {
					fontSize: isMobile ? 11 : 13,
				},
			},
		};

		// Chart type specific configurations
		if (chartType === 'line') {
			return {
				...baseConfig,
				xAxis: {
					...baseConfig.xAxis,
					boundaryGap: false,
				},
				color: ['#6A53B1', '#0086C9', '#DD2590'],
				series: filteredSeries.map((s: any) => ({
					name: s.name,
					type: 'line',
					smooth: true,
					data: s.data,
					symbol: showValueLabels ? 'circle' : 'none',
					symbolSize: showValueLabels ? (isMobile ? 4 : 6) : 0,
					lineStyle: { width: isMobile ? 2 : 3, color: s.color },
					areaStyle: {
						color: `${s.color}20`,
					},
					label: showValueLabels
						? {
								show: true,
								position: 'top',
								fontSize: isMobile ? 10 : 12,
								color: s.color,
							}
						: {
								show: false,
							},
				})),
			};
		} else if (chartType === 'bar') {
			return {
				...baseConfig,
				series: filteredSeries.map((s: any) => ({
					name: s.name,
					type: 'bar',
					data: s.data,
					itemStyle: { color: s.color },
					label: showValueLabels
						? {
								show: true,
								position: 'top',
								fontSize: isMobile ? 10 : 12,
							}
						: {
								show: false,
							},
				})),
			};
		} else if (chartType === 'pie') {
			// For pie charts, use the first series data
			const pieData = filteredSeries.map((s: any, index: number) => ({
				name: s.name,
				value: s.data.reduce(
					(sum: number, val: number) => sum + val,
					0
				),
				itemStyle: { color: s.color },
			}));

			return {
				tooltip: {
					trigger: 'item',
					show: showTooltip,
				},
				legend: {
					orient: isMobile ? 'horizontal' : 'vertical',
					left: isMobile ? 'center' : 'left',
					top: isMobile ? 'bottom' : 'middle',
					data: pieData.map((d: any) => d.name),
				},
				series: [
					{
						type: 'pie',
						radius: isMobile ? '40%' : '50%',
						data: pieData,
						emphasis: {
							itemStyle: {
								shadowBlur: 10,
								shadowOffsetX: 0,
								shadowColor: 'rgba(0, 0, 0, 0.5)',
							},
						},
						label: showValueLabels
							? {
									show: true,
									formatter: '{b}: {c} ({d}%)',
								}
							: {
									show: false,
								},
					},
				],
			};
		} else if (chartType === 'table') {
			// For table charts, we'll render the FinancialSummaryTable component
			return null; // We'll handle table rendering separately
		}

		return baseConfig;
	}, [
		data,
		series,
		showTooltip,
		showValueLabels,
		chartType,
		domain,
		dataType,
		timeRange,
		customTitle,
		isMobile,
	]);

	if (loading) {
		return (
			<div
				className={`${isMobile ? 'px-4' : 'max-w-[1600px]'} mx-auto my-8 space-y-6 h-full`}
			>
				<div className="relative bg-white border border-gray-200 rounded-2xl p-6">
					<div
						className="flex justify-center items-center"
						style={{ height: isMobile ? 200 : 300 }}
					>
						<div className="text-center">
							<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
							<p className="text-gray-600 text-sm">
								차트 데이터를 불러오는 중...
							</p>
						</div>
					</div>
				</div>
			</div>
		);
	}

	if (!data) {
		return (
			<div
				className={`${isMobile ? 'px-4' : 'max-w-[1600px]'} mx-auto my-8 space-y-6 h-full`}
			>
				<div className="relative bg-white border border-gray-200 rounded-2xl p-6">
					<div
						className="flex justify-center items-center"
						style={{ height: isMobile ? 200 : 300 }}
					>
						<div className="text-center">
							<div className="text-gray-500 mb-2">📊</div>
							<p className="text-gray-600 text-sm">
								데이터가 없습니다
							</p>
						</div>
					</div>
				</div>
			</div>
		);
	}

	// Mobile version
	if (isMobile) {
		return (
			<div className="px-4 mx-auto my-4 space-y-4">
				{/* Chart Card */}
				<div className="relative bg-white border border-gray-200 rounded-xl p-4">
					{/* Header with simplified controls */}
					<div className="flex flex-col gap-3 mb-4">
						<h2 className="text-base font-bold text-gray-900">
							{customTitle ||
								generateTitle(domain, dataType, timeRange)}
						</h2>
						{interactiveControls && (
							<div className="flex flex-wrap gap-2">
								{/* 기간 설정 Dropdown */}
								<DropdownMenuRoot>
									<DropdownMenuTrigger asChild>
										<RadixButton className="flex items-center gap-1 px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white hover:bg-gray-50">
											<span className="text-xs">
												기간 설정
											</span>
											<svg
												className="w-3 h-3 text-gray-500"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M19 9l-7 7-7-7"
												/>
											</svg>
										</RadixButton>
									</DropdownMenuTrigger>
									<DropdownMenuContent className="min-w-[100px] bg-white border border-gray-200 rounded-md shadow-lg p-1 z-50">
										<DropdownMenuItem className="px-2 py-1 text-xs hover:bg-gray-100 rounded cursor-pointer">
											전체
										</DropdownMenuItem>
										<DropdownMenuItem className="px-2 py-1 text-xs hover:bg-gray-100 rounded cursor-pointer">
											2024
										</DropdownMenuItem>
										<DropdownMenuItem className="px-2 py-1 text-xs hover:bg-gray-100 rounded cursor-pointer">
											2023
										</DropdownMenuItem>
										<DropdownMenuItem className="px-2 py-1 text-xs hover:bg-gray-100 rounded cursor-pointer">
											2022
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenuRoot>

								{/* 항목 선택 Dropdown */}
								<DropdownMenuRoot>
									<DropdownMenuTrigger asChild>
										<RadixButton className="flex items-center gap-1 px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white hover:bg-gray-50">
											<span className="text-xs">
												항목 선택
											</span>
											<svg
												className="w-3 h-3 text-gray-500"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M19 9l-7 7-7-7"
												/>
											</svg>
										</RadixButton>
									</DropdownMenuTrigger>
									<DropdownMenuContent className="min-w-[100px] bg-white border border-gray-200 rounded-md shadow-lg p-1 z-50">
										<DropdownMenuItem className="px-2 py-1 text-xs hover:bg-gray-100 rounded cursor-pointer">
											전체
										</DropdownMenuItem>
										<DropdownMenuItem className="px-2 py-1 text-xs hover:bg-gray-100 rounded cursor-pointer">
											항목 1
										</DropdownMenuItem>
										<DropdownMenuItem className="px-2 py-1 text-xs hover:bg-gray-100 rounded cursor-pointer">
											항목 2
										</DropdownMenuItem>
										<DropdownMenuItem className="px-2 py-1 text-xs hover:bg-gray-100 rounded cursor-pointer">
											항목 3
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenuRoot>

								{/* 검색 Button */}
								<RadixButton className="flex gap-1 px-3 py-2 rounded-lg text-sm items-center border bg-Colors-Brand-700 text-white">
									<svg
										className="w-4 h-4 text-white"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
										/>
									</svg>
									검색
								</RadixButton>

								{/* Print Button */}
								{exportEnabled && (
									<RadixButton
										onClick={handlePrintChartImage}
										className="flex items-center gap-1 px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white hover:bg-gray-50"
									>
										<svg
											className="w-4 h-4 text-gray-600"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
											/>
										</svg>
										출력
									</RadixButton>
								)}

								{/* Settings Button */}
								<RadixButton
									onClick={() =>
										setShowSettingsDropdown(
											!showSettingsDropdown
										)
									}
									className="flex items-center gap-1 px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white hover:bg-gray-50"
								>
									<svg
										className="w-4 h-4 text-gray-600"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
										/>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
										/>
									</svg>
									설정
								</RadixButton>
							</div>
						)}
					</div>

					{/* Chart Section */}
					{chartType !== 'table' && (
						<div style={{ width: '100%', height: 250 }}>
							<EchartComponent
								ref={chartRef}
								options={chartOptions}
								styles={{ width: '100%', height: '250px' }}
							/>
						</div>
					)}
				</div>

				{/* Table Card - Mobile version */}
				{data && (
					<div className="relative bg-white border border-gray-200 rounded-xl p-4">
						<FinancialSummaryTable
							customData={data}
							timeRange={timeRange}
						/>
					</div>
				)}
			</div>
		);
	}

	// Desktop version
	return (
		<div className="max-w-[1600px] mx-auto my-8 space-y-6 h-full">
			{/* Chart Card */}
			<div className="relative bg-white border border-gray-200 rounded-2xl p-6">
				{/* Header with controls */}
				<div className="flex justify-between items-center mb-4">
					<h2 className="text-lg font-bold text-gray-900">
						{customTitle ||
							generateTitle(domain, dataType, timeRange)}
					</h2>
					<div className="flex items-center gap-2 relative">
						{/* 기간 설정 Dropdown */}
						<DropdownMenuRoot>
							<DropdownMenuTrigger asChild>
								<RadixButton className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 font-normal">
									<span
										style={{
											display: 'inline',
											color: '#111827',
										}}
									>
										기간 설정
									</span>
									<svg
										className="w-4 h-4 text-gray-500"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M19 9l-7 7-7-7"
										/>
									</svg>
								</RadixButton>
							</DropdownMenuTrigger>
							<DropdownMenuContent className="min-w-[120px] bg-white border border-gray-200 rounded-md shadow-lg p-1 z-50">
								<DropdownMenuItem className="px-3 py-2 text-sm hover:bg-gray-100 rounded cursor-pointer">
									전체
								</DropdownMenuItem>
								<DropdownMenuItem className="px-3 py-2 text-sm hover:bg-gray-100 rounded cursor-pointer">
									2024
								</DropdownMenuItem>
								<DropdownMenuItem className="px-3 py-2 text-sm hover:bg-gray-100 rounded cursor-pointer">
									2023
								</DropdownMenuItem>
								<DropdownMenuItem className="px-3 py-2 text-sm hover:bg-gray-100 rounded cursor-pointer">
									2022
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenuRoot>

						{/* 항목 선택 Dropdown */}
						<DropdownMenuRoot>
							<DropdownMenuTrigger asChild>
								<RadixButton className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 font-normal">
									<span
										style={{
											display: 'inline',
											color: '#111827',
										}}
									>
										항목 선택
									</span>
									<svg
										className="w-4 h-4 text-gray-500"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M19 9l-7 7-7-7"
										/>
									</svg>
								</RadixButton>
							</DropdownMenuTrigger>
							<DropdownMenuContent className="min-w-[120px] bg-white border border-gray-200 rounded-md shadow-lg p-1 z-50">
								<DropdownMenuItem className="px-3 py-2 text-sm hover:bg-gray-100 rounded cursor-pointer">
									전체
								</DropdownMenuItem>
								<DropdownMenuItem className="px-3 py-2 text-sm hover:bg-gray-100 rounded cursor-pointer">
									항목 1
								</DropdownMenuItem>
								<DropdownMenuItem className="px-3 py-2 text-sm hover:bg-gray-100 rounded cursor-pointer">
									항목 2
								</DropdownMenuItem>
								<DropdownMenuItem className="px-3 py-2 text-sm hover:bg-gray-100 rounded cursor-pointer">
									항목 3
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenuRoot>

						{/* 검색(F3) Button - Primary */}
						<RadixButton className="flex gap-1 px-2.5 py-1.5 rounded-lg text-sm items-center border bg-Colors-Brand-700 text-white">
							<svg
								className="w-4 h-4 text-white"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
								/>
							</svg>
							검색(F3)
						</RadixButton>

						{/* Print Button */}
						{exportEnabled && (
							<RadixButton
								onClick={handlePrintChartImage}
								className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 font-normal"
							>
								<svg
									className="w-4 h-4 text-gray-600"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
									/>
								</svg>
								<span
									style={{
										display: 'inline',
										color: '#111827',
									}}
								>
									출력
								</span>
							</RadixButton>
						)}

						{/* Settings Button */}
						{interactiveControls && (
							<RadixButton
								onClick={() =>
									setShowSettingsDropdown(
										!showSettingsDropdown
									)
								}
								className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 font-normal"
							>
								<svg
									className="w-4 h-4 text-gray-600"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
									/>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
									/>
								</svg>
								<span
									style={{
										display: 'inline',
										color: '#111827',
									}}
								>
									설정
								</span>
							</RadixButton>
						)}

						{showSettingsDropdown && interactiveControls && (
							<div
								className="absolute right-0 top-full mt-1 min-w-[220px] bg-white border border-gray-200 rounded-md shadow-lg p-2 z-[9999]"
								ref={settingsDropdownRef}
							>
								{/* Data Series Toggle */}
								<div className="px-2 py-1 text-xs text-gray-500 font-semibold">
									데이터 시리즈 표시
								</div>
								{Object.keys(series).map((name) => (
									<div
										key={name}
										className="flex items-center gap-2 px-2 py-2 text-sm hover:bg-gray-100 rounded cursor-pointer"
									>
										<input
											type="checkbox"
											checked={series[name]}
											onChange={() =>
												handleSeriesToggle(name)
											}
											className="accent-violet-500"
										/>
										<span>{name}</span>
									</div>
								))}
								<div className="my-2 border-t border-gray-200" />
								{/* Tooltip/Label Options */}
								<div className="px-2 py-1 text-xs text-gray-500 font-semibold">
									옵션
								</div>
								<div className="flex items-center gap-2 px-2 py-2 text-sm hover:bg-gray-100 rounded cursor-pointer">
									<input
										type="checkbox"
										checked={showTooltip}
										onChange={handleTooltipToggle}
										className="accent-violet-500"
									/>
									<span>툴팁 표시</span>
								</div>
								{chartType !== 'pie' && (
									<div className="flex items-center gap-2 px-2 py-2 text-sm hover:bg-gray-100 rounded cursor-pointer">
										<input
											type="checkbox"
											checked={showValueLabels}
											onChange={handleValueLabelsToggle}
											className="accent-violet-500"
										/>
										<span>값 라벨 표시</span>
									</div>
								)}
							</div>
						)}
					</div>
				</div>
				{/* Chart Section */}
				{chartType !== 'table' && (
					<div style={{ width: '100%', height: 300 }}>
						<EchartComponent
							ref={chartRef}
							options={chartOptions}
							styles={{ width: '100%', height: '320px' }}
						/>
					</div>
				)}
			</div>

			{/* Table Card - Separate card below chart */}
			{data && (
				<div className="relative bg-white border border-gray-200 rounded-2xl p-6">
					<FinancialSummaryTable
						customData={data}
						timeRange={timeRange}
					/>
				</div>
			)}
		</div>
	);
}
