import React from 'react';
import { RealTimeData } from './RealTimeData';
import { WasteManagementDashboard } from '../WasteManagementDashboard';

export const MeterDefaultDashboard = () => {
	return (
		<div>
			<RealTimeData />
			<WasteManagementDashboard />
		</div>
	);
};