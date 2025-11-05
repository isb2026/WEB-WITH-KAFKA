import React from 'react';
import PageTemplate from '@primes/templates/PageTemplate';
import { EchartComponent } from '@repo/echart/components';

const QualityPrecisionInspectionReportPage: React.FC = () => {
	const trendOptions = {
		tooltip: { trigger: 'axis' as const },
		legend: { data: ['OK율', 'NG율'], top: '10%' },
		xAxis: {
			type: 'category' as const,
			data: ['01-12', '01-13', '01-14', '01-15', '01-16', '01-17'],
		},
		yAxis: {
			type: 'value' as const,
			min: 0,
			max: 100,
			axisLabel: { formatter: '{value}%' },
		},
		series: [
			{
				name: 'OK율',
				type: 'line',
				smooth: true,
				data: [92, 94, 90, 93, 95, 91],
				lineStyle: { width: 3, color: '#10B981' },
			},
			{
				name: 'NG율',
				type: 'line',
				smooth: true,
				data: [8, 6, 10, 7, 5, 9],
				lineStyle: { width: 3, color: '#EF4444' },
			},
		],
	};

	const histogramOptions = {
		tooltip: { trigger: 'axis' as const },
		xAxis: {
			type: 'category' as const,
			data: ['-3σ', '-2σ', '-1σ', 'μ', '+1σ', '+2σ', '+3σ'],
		},
		yAxis: { type: 'value' as const },
		series: [
			{
				type: 'bar',
				data: [1, 5, 15, 30, 15, 5, 1],
				itemStyle: { color: '#3B82F6' },
			},
		],
	};

	return (
		<PageTemplate>
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<div className="bg-white rounded-lg shadow p-6">
					<h3 className="text-base font-semibold mb-4">OK/NG 추이</h3>
					<EchartComponent options={trendOptions} height="360px" />
				</div>
				<div className="bg-white rounded-lg shadow p-6">
					<h3 className="text-base font-semibold mb-4">
						정밀도 분포(히스토그램)
					</h3>
					<EchartComponent
						options={histogramOptions}
						height="360px"
					/>
				</div>
			</div>
		</PageTemplate>
	);
};

export default QualityPrecisionInspectionReportPage;
