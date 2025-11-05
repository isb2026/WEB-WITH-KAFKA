import React from 'react';
import PageTemplate from '@primes/templates/PageTemplate';
import { EchartComponent } from '@repo/echart/components';

const QualityPrecisionInspectionAnalysisPage: React.FC = () => {
	const scatterOptions = {
		tooltip: { trigger: 'item' as const },
		xAxis: { name: 'Cp' },
		yAxis: { name: 'Cpk' },
		series: [
			{
				symbolSize: 10,
				data: [
					[1.2, 1.1],
					[1.4, 1.3],
					[0.9, 0.8],
					[1.6, 1.4],
					[1.1, 1.0],
				],
				type: 'scatter',
				itemStyle: { color: '#10B981' },
			},
		],
	};

	const boxplotOptions = {
		tooltip: { trigger: 'item' as const },
		xAxis: {
			type: 'category' as const,
			data: ['직경', '원주도', '평면도'],
		},
		yAxis: { type: 'value' as const },
		series: [
			{
				name: '측정 분포',
				type: 'bar',
				data: [0.04, 0.02, 0.01],
				itemStyle: { color: '#F59E0B' },
			},
		],
	};

	return (
		<PageTemplate>
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<div className="bg-white rounded-lg shadow p-6">
					<h3 className="text-base font-semibold mb-4">
						Cp/Cpk 산포도
					</h3>
					<EchartComponent options={scatterOptions} height="360px" />
				</div>
				<div className="bg-white rounded-lg shadow p-6">
					<h3 className="text-base font-semibold mb-4">
						특성별 분포(요약)
					</h3>
					<EchartComponent options={boxplotOptions} height="360px" />
				</div>
			</div>
		</PageTemplate>
	);
};

export default QualityPrecisionInspectionAnalysisPage;
