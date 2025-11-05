import { useState, useMemo, useRef, useEffect } from 'react';
import { EchartComponent } from '@repo/echart/components';
import type { EChartsOption } from 'echarts';
import { RadixButton } from '@repo/radix-ui/components';

export default function BarChartDemoPage() {
	const [series, setSeries] = useState<Record<string, boolean>>({
		'카테고리 1': true,
		'카테고리 2': true,
		'카테고리 3': true,
	});
	const [showTooltip, setShowTooltip] = useState(true);
	const [showValueLabels, setShowValueLabels] = useState(false);
	const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);
	const settingsDropdownRef = useRef<HTMLDivElement>(null);
	const chartRef = useRef<{
		getImage: (opts: any) => string | undefined;
	} | null>(null);

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

	const handlePrintChartImage = () => {
		const imgData = chartRef.current?.getImage({
			type: 'png',
			pixelRatio: 2,
		});
		if (!imgData) return;
		const printWindow = window.open('', '_blank');
		if (printWindow) {
			printWindow.document.write(`
        <html>
          <head><title>Print Bar Chart</title></head>
          <body style="margin:0;padding:0;display:flex;align-items:center;justify-content:center;height:100vh;">
            <img src="${imgData}" style="max-width:100%;max-height:100%;" />
            <script>window.onload = function() { setTimeout(function() { window.print(); }, 300); }<\/script>
          </body>
        </html>
      `);
			printWindow.document.close();
		}
	};

	const barChartOptions = useMemo((): EChartsOption => {
		const allSeries = [
			{
				name: '카테고리 1',
				type: 'bar' as const,
				data: [120, 132, 101, 134, 90, 230],
				itemStyle: { color: '#7c3aed' },
				label: showValueLabels
					? {
							show: true,
							position: 'top' as const,
							fontSize: 12,
							color: '#7c3aed',
						}
					: { show: false },
				barWidth: 32,
			},
			{
				name: '카테고리 2',
				type: 'bar' as const,
				data: [220, 182, 191, 234, 290, 330],
				itemStyle: { color: '#3b82f6' },
				label: showValueLabels
					? {
							show: true,
							position: 'top' as const,
							fontSize: 12,
							color: '#3b82f6',
						}
					: { show: false },
				barWidth: 32,
			},
			{
				name: '카테고리 3',
				type: 'bar' as const,
				data: [150, 232, 201, 154, 190, 330],
				itemStyle: { color: '#ec4899' },
				label: showValueLabels
					? {
							show: true,
							position: 'top' as const,
							fontSize: 12,
							color: '#ec4899',
						}
					: { show: false },
				barWidth: 32,
			},
		];
		const filteredSeries = allSeries.filter((s) => series[s.name]);
		return {
			title: {
				text: '연간 카테고리별 매출 현황',
				left: 'center',
				top: 20,
				textStyle: { fontSize: 18, fontWeight: 'bold' },
			},
			tooltip: {
				trigger: 'axis',
				show: showTooltip,
				axisPointer: { type: 'shadow' },
			},
			legend: {
				data: filteredSeries.map((s) => s.name),
				right: 40,
				top: 40,
				icon: 'rect',
			},
			grid: {
				left: 60,
				right: 40,
				top: 80,
				bottom: 40,
			},
			xAxis: {
				type: 'category',
				data: ['2019', '2020', '2021', '2022', '2023', '2024'],
				axisLabel: { fontSize: 13 },
			},
			yAxis: {
				type: 'value',
				name: '매출액',
				nameLocation: 'middle',
				nameGap: 40,

				max: 400,
				axisLabel: { fontSize: 13 },
			},
			series: filteredSeries,
			animationDuration: 800,
			animationEasing: 'cubicOut',
		};
	}, [series, showTooltip, showValueLabels]);

	return (
		<div className="relative bg-white border border-gray-200 rounded-2xl shadow p-6 max-w-[1600px] mx-auto my-8">
			<div className="flex items-center gap-2 absolute top-6 right-6 z-10">
				{/* Print Button - Single button like LineChartDemo */}
				<RadixButton
					onClick={handlePrintChartImage}
					className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
					<span>출력</span>
				</RadixButton>

				{/* Settings Button - Custom dropdown like LineChartDemo */}
				<div className="relative" ref={settingsDropdownRef}>
					<RadixButton
						className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
						onClick={() => {
							setShowSettingsDropdown(!showSettingsDropdown);
						}}
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
					</RadixButton>

					{showSettingsDropdown && (
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
							<div className="flex items-center gap-2 px-2 py-2 text-sm hover:bg-gray-100 rounded cursor-pointer">
								<input
									type="checkbox"
									checked={showValueLabels}
									onChange={handleValueLabelsToggle}
									className="accent-violet-500"
								/>
								<span>값 라벨 표시</span>
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Chart Area */}
			<div style={{ width: '100%', height: 400 }}>
				<EchartComponent ref={chartRef} options={barChartOptions} />
			</div>
		</div>
	);
}
