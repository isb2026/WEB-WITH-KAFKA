import React from 'react';
import LineChartDemo from './demo/LineChartDemo';
import { PreviewCodeTabs } from '../components/PreviewCodeTabs';
import {
	RadixButton,
	DropdownMenuRoot,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTriggerIcon,
} from '@repo/radix-ui/components';

const codeString = `import React from 'react';
import { EchartComponent } from '@repo/echart/components';

const lineChartOptions = {
  title: {
    text: '연간 매출 대비 매입 현황',
    left: 'center',
    top: 20,
    textStyle: {
      fontSize: 18,
      fontWeight: 'bold',
    },
  },
  tooltip: {
    trigger: 'axis',
  },
  legend: {
    data: ['항목 1', '항목 2', '항목 3'],
    right: 40,
    top: 40,
    icon: 'circle',
  },
  grid: {
    left: 60,
    right: 40,
    top: 80,
    bottom: 40,
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: ['2019', '2020', '2021', '2022', '2023', '2024'],
    axisLabel: {
      fontSize: 13,
    },
  },
  yAxis: {
    type: 'value',
    name: '매입/매출량',
    nameLocation: 'middle',
    nameGap: 40,
    
    max: 100,
    axisLabel: {
      fontSize: 13,
    },
  },
  series: [
    {
      name: '항목 1',
      type: 'line',
      smooth: true,
      data: [45, 48, 50, 60, 55, 62],
      symbol: 'none',
      lineStyle: { width: 3, color: '#7c3aed' },
      areaStyle: {
        color: 'rgba(124, 58, 237, 0.08)',
      },
    },
    {
      name: '항목 2',
      type: 'line',
      smooth: true,
      data: [30, 32, 35, 38, 36, 40],
      symbol: 'none',
      lineStyle: { width: 3, color: '#3b82f6' },
      areaStyle: {
        color: 'rgba(59, 130, 246, 0.08)',
      },
    },
    {
      name: '항목 3',
      type: 'line',
      smooth: true,
      data: [15, 18, 20, 22, 21, 24],
      symbol: 'none',
      lineStyle: { width: 3, color: '#ec4899' },
      areaStyle: {
        color: 'rgba(236, 72, 153, 0.08)',
      },
    },
  ],
};

export default function LineChartDemo() {
  return (
    <div style={{ width: '100%', height: 400 }}>
      <EchartComponent options={lineChartOptions} />
    </div>
  );
}
`;

// Filter Bar Component
const FilterBar = () => (
	<div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
		<div className="flex items-center justify-between gap-4">
			{/* Left side - Filters */}
			<div className="flex items-center gap-3">
				{/* Year Dropdown */}
				<DropdownMenuRoot>
					<DropdownMenuTrigger asChild>
						<RadixButton className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
							<span>2024</span>
							<DropdownMenuTriggerIcon
								size={14}
								color="#6b7280"
							/>
						</RadixButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent className="min-w-[120px] bg-white border border-gray-200 rounded-md shadow-lg p-1">
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

				{/* Category Dropdown */}
				<DropdownMenuRoot>
					<DropdownMenuTrigger asChild>
						<RadixButton className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
							<span>전체</span>
							<DropdownMenuTriggerIcon
								size={14}
								color="#6b7280"
							/>
						</RadixButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent className="min-w-[120px] bg-white border border-gray-200 rounded-md shadow-lg p-1">
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

				{/* Search Input */}
				<div className="relative">
					<input
						type="text"
						placeholder="검색..."
						className="pl-8 pr-3 py-2 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
						style={{ width: '200px' }}
					/>
					<svg
						className="absolute left-2.5 top-2.5 w-4 h-4 text-gray-400"
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
				</div>
			</div>

			{/* Right side - Action buttons */}
			<div className="flex items-center gap-2">
				{/* Print Button */}
				<RadixButton className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
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
					<span>인쇄</span>
				</RadixButton>

				{/* Settings Button */}
				<RadixButton className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
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
					<span>설정</span>
				</RadixButton>
			</div>
		</div>
	</div>
);

export default function LineChartDemoWithCodePage() {
	return (
		<div className="max-w-[1600px] mx-auto my-8">
			<PreviewCodeTabs
				preview={<LineChartDemo />}
				code={
					<pre className="bg-gray-200 p-4 text-sm rounded overflow-x-auto whitespace-pre-wrap">
						{codeString}
					</pre>
				}
			/>
		</div>
	);
}
