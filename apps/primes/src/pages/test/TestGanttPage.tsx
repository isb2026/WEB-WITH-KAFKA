import React from 'react';
import { GanttChart } from '@repo/gantt-charts';

const TestGanttPage: React.FC = () => {
	return (
		<div className="p-4">
			<div className="overflow-x-auto">
				<GanttChart
					locale="kor"
					className="w-full"
					headerOffset={220}
				/>
			</div>
		</div>
	);
};

export default TestGanttPage;
