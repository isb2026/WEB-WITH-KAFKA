// 분석 페이지 템플릿을 생성하는 함수
export const AnalysisPageGenerater = (
	pageKey,
	domain,
	dataType,
	chartType = 'line',
	timeRange = 'weekly',
	chartTitle = '',
	additionalProps = {}
) => {
	const title = chartTitle || `${pageKey} 분석`;
	const propsString = Object.entries(additionalProps)
		.map(([key, value]) => `${key}={${value}}`)
		.join('\n\t\t\t\t\t');

	return `import { PageTemplate } from '@primes/templates';
import { AnalysisChart } from '@primes/components/charts';

export const ${pageKey} = () => {
	return (
		<PageTemplate>
			<AnalysisChart
				domain="${domain}"
				chartType="${chartType}"
				dataType="${dataType}"
				timeRange="${timeRange}"
				customTitle="${title}"
				autoFetchData={true}
				exportEnabled={true}
				interactiveControls={true}${propsString ? '\n\t\t\t\t\t' + propsString : ''}
			/>
		</PageTemplate>
	);
};

export default ${pageKey};
`;
}; 