import { PageTemplate } from '@primes/templates';
import { AnalysisChart } from '@primes/components/charts';

export const SalesOrderAnalisisPage = () => {
	return (
		<PageTemplate>
			<AnalysisChart
				domain="sales"
				chartType="line"
				dataType="orders"
				timeRange="weekly"
				autoFetchData={true}
				exportEnabled={true}
				interactiveControls={true}
			/>
		</PageTemplate>
	);
};
