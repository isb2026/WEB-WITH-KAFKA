import React from 'react';
import { GanttChart } from '@repo/gantt-charts';

const ApsScheduleListPage: React.FC = () => {
	return (
		<div className="overflow-x-auto">
			<GanttChart locale="kor" className="w-full" headerOffset={300} />
		</div>
	);
};

export default ApsScheduleListPage;
