import React from 'react';
import BarChartDemo from './BarChartDemo';
import { PreviewCodeTabs } from '../../components/PreviewCodeTabs';

const codeString = `import React from 'react';
import { EchartComponent } from '@repo/echart/components';

const barChartOptions = {
  title: {
    text: '연간 카테고리별 매출 현황',
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
    data: ['카테고리 1', '카테고리 2', '카테고리 3'],
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
    axisLabel: {
      fontSize: 13,
    },
  },
  yAxis: {
    type: 'value',
    name: '매출액',
    nameLocation: 'middle',
    nameGap: 40,
    
    max: 400,
    axisLabel: {
      fontSize: 13,
    },
  },
  series: [
    {
      name: '카테고리 1',
      type: 'bar',
      data: [120, 132, 101, 134, 90, 230],
      itemStyle: { color: '#7c3aed' },
      barWidth: 32,
    },
    {
      name: '카테고리 2',
      type: 'bar',
      data: [220, 182, 191, 234, 290, 330],
      itemStyle: { color: '#3b82f6' },
      barWidth: 32,
    },
    {
      name: '카테고리 3',
      type: 'bar',
      data: [150, 232, 201, 154, 190, 330],
      itemStyle: { color: '#ec4899' },
      barWidth: 32,
    },
  ],
};

export default function BarChartDemo() {
  return (
    <div style={{ width: '100%', height: 400 }}>
      <EchartComponent options={barChartOptions} />
    </div>
  );
}
`;

export default function BarChartDemoWithCodePage() {
	return (
		<div className="max-w-[1600px] mx-auto my-8">
			<PreviewCodeTabs
				preview={<BarChartDemo />}
				code={
					<pre className="bg-gray-200 p-4 text-sm rounded overflow-x-auto whitespace-pre-wrap">
						{codeString}
					</pre>
				}
			/>
		</div>
	);
}
