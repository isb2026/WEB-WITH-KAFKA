import { EChartsOption } from '@repo/echart/components';

export const createEquipmentEfficiencyOption = (
	efficiency: number,
	centerX: string = '50%'
): EChartsOption => {
	return {
		tooltip: {
			trigger: 'item',
			formatter: '{b}: {c}%',
			backgroundColor: 'rgba(255, 255, 255, 0.95)',
			borderColor: '#ccc',
			borderWidth: 1,
			padding: 8,
			textStyle: {
				color: '#333',
				fontSize: 12,
			},
		},
		legend: {
			show: false,
		},
		series: [
			{
				name: '설비 종합효율',
				type: 'pie',
				radius: ['60%', '80%'],
				center: [centerX, '50%'],
				avoidLabelOverlap: false,
				label: {
					show: false,
				},
				labelLine: {
					show: false,
				},
				data: [
					{
						value: efficiency,
						name: '설비 종합효율',
						itemStyle: { color: '#6A53B1' },
					},
					{
						value: 100 - efficiency,
						name: 'Remaining',
						itemStyle: { color: '#E5E7EB' },
					},
				],
			},
		],
	};
};

export const createEquipmentLineChartOption = (
	data: number[]
): EChartsOption => {
	return {
		tooltip: {
			trigger: 'axis',
			formatter: function (params: any) {
				let result = params[0].axisValue + '<br/>';
				params.forEach((param: any) => {
					result +=
						param.marker +
						param.seriesName +
						': ' +
						param.value +
						'<br/>';
				});
				return result;
			},
			backgroundColor: 'rgba(255, 255, 255, 0.95)',
			borderColor: '#ccc',
			borderWidth: 1,
			padding: 8,
			textStyle: {
				color: '#333',
				fontSize: 12,
			},
		},
		grid: {
			left: '3%',
			right: '4%',
			bottom: '3%',
			containLabel: true,
		},
		xAxis: {
			type: 'category',
			boundaryGap: false,
			data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
			axisLine: {
				lineStyle: {
					color: '#E5E7EB',
				},
			},
			axisLabel: {
				color: '#6B7280',
				fontSize: 10,
			},
		},
		yAxis: {
			type: 'value',
			axisLine: {
				show: false,
			},
			axisTick: {
				show: false,
			},
			axisLabel: {
				color: '#6B7280',
				fontSize: 10,
			},
			splitLine: {
				lineStyle: {
					color: '#F3F4F6',
				},
			},
		},
		series: [
			{
				data: data,
				type: 'line',
				smooth: true,
				lineStyle: {
					color: '#8B5CF6',
					width: 3,
				},
				areaStyle: {
					color: {
						type: 'linear',
						x: 0,
						y: 0,
						x2: 0,
						y2: 1,
						colorStops: [
							{ offset: 0, color: 'rgba(139, 92, 246, 0.3)' },
							{ offset: 1, color: 'rgba(139, 92, 246, 0.05)' },
						],
					},
				},
				symbol: 'circle',
				symbolSize: 6,
				itemStyle: {
					color: '#8B5CF6',
				},
			},
		],
	};
};

export const createEquipmentProgressBarOption = (
	progress: number
): EChartsOption => {
	return {
		tooltip: {
			trigger: 'item',
			formatter: '진행률: {c}%',
			backgroundColor: 'rgba(255, 255, 255, 0.95)',
			borderColor: '#ccc',
			borderWidth: 1,
			padding: 8,
			textStyle: {
				color: '#333',
				fontSize: 12,
			},
		},
		grid: {
			left: '0%',
			right: '0%',
			top: '0%',
			bottom: '0%',
			containLabel: false,
		},
		xAxis: {
			type: 'value',

			max: 100,
			show: false,
		},
		yAxis: {
			type: 'category',
			data: [''],
			show: false,
		},
		series: [
			{
				name: 'Progress',
				type: 'bar',
				stack: 'total',
				data: [progress],
				barWidth: '100%',
				itemStyle: {
					color: '#6A53B1',
					borderRadius: [0, 0, 0, 0],
				},
			},
			{
				name: 'Remaining',
				type: 'bar',
				stack: 'total',
				data: [100 - progress],
				barWidth: '100%',
				itemStyle: {
					color: '#E5E7EB',
					borderRadius: [0, 4, 4, 0],
				},
			},
		],
	};
};

export const createEquipmentPieChartOption = (
	classification: Array<{ name: string; value: number }>
): EChartsOption => {
	return {
		tooltip: {
			trigger: 'item',
			formatter: '{a} <br/>{b}: {c}건 ({d}%)',
			backgroundColor: 'rgba(255, 255, 255, 0.95)',
			borderColor: '#ccc',
			borderWidth: 1,
			padding: 8,
			textStyle: {
				color: '#333',
				fontSize: 12,
			},
		},
		legend: {
			show: false,
		},
		series: [
			{
				name: '설비 분류',
				type: 'pie',
				radius: ['50%', '85%'],
				center: ['50%', '50%'],
				avoidLabelOverlap: false,
				label: {
					show: false,
				},
				labelLine: {
					show: false,
				},
				data: classification.map((item, index) => ({
					value: item.value,
					name: item.name,
					itemStyle: {
						color: [
							'#60A5FA',
							'#A78BFA',
							'#F472B6',
							'#34D399',
							'#FB923C',
							'#6366F1',
						][index],
					},
				})),
				emphasis: {
					itemStyle: {
						shadowBlur: 10,
						shadowOffsetX: 0,
						shadowColor: 'rgba(0, 0, 0, 0.5)',
					},
				},
			},
		],
	};
};
