// @repo/echart/EchartComponent.tsx
import React, {
	useState,
	useEffect,
	FC,
	forwardRef,
	useRef,
	useImperativeHandle,
} from 'react';
import EChartsReact from 'echarts-for-react';
import * as echarts from 'echarts/core';
import { EChartsOption } from 'echarts';
import { BarChart, LineChart, PieChart } from 'echarts/charts';
import {
	TitleComponent,
	TooltipComponent,
	GridComponent,
	LegendComponent,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

// 모듈 등록
echarts.use([
	BarChart,
	LineChart,
	PieChart,
	TitleComponent,
	TooltipComponent,
	GridComponent,
	LegendComponent,
	CanvasRenderer,
]);

export interface EchartComponentProps {
	options: any; // EChartsOption 타입을 완화하여 any로 변경
	styles?: React.CSSProperties;
	height?: string; // height 속성 추가
}

export const EchartComponent = forwardRef(
	(props: EchartComponentProps, ref) => {
		const chartRef = useRef<any>(null);
		useImperativeHandle(ref, () => ({
			getImage: (opts?: { type?: 'png' | 'svg'; pixelRatio?: number }) =>
				chartRef.current?.getEchartsInstance().getDataURL(opts),
		}));
		return (
			<div
				style={{
					position: 'relative',
					zIndex: 5,
					height: props.height,
				}}
			>
				<EChartsReact
					ref={chartRef}
					echarts={echarts}
					option={props.options}
					style={{
						width: '100%',
						height: props.height || '100%',
						...props.styles,
					}}
				/>
			</div>
		);
	}
);
