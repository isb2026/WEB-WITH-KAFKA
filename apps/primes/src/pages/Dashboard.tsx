import React, { useState, useEffect } from 'react';
// import { useIsMobile } from '../hooks/useIsMobile';
// import MobileDashboard from '../components/dashboard/MobileDashboard';
import DesktopDashboard from '../components/dashboard/DesktopDashboard';

const Dashboard: React.FC = () => {
	// Dashboard data structure - moved inside component for hot reload
	// Change this comment when you modify data to trigger hot reload
	const initialDashboardData = {
		sales: {
			deliveryRate: 80,
			deadlineRate: 70,
			kpis: {
				monthlyTarget: { value: 25.6, trend: 9.2 },
				yearlyTarget: { value: 600, trend: 9.2 },
				monthlyActual: { value: 27.8, trend: 5.2 },
				yearlyActual: { value: 420, trend: 9.2 },
			},
			lineChart: [150, 230, 224, 218, 135, 147, 260],
		},
		purchase: {
			deliveryRate: 70,
			deadlineRate: 70,
			kpis: {
				monthlyTarget: { value: 25.6, trend: 9.2 },
				yearlyTarget: { value: 600, trend: 9.2 },
				monthlyActual: { value: 27.8, trend: 5.2 },
				yearlyActual: { value: 420, trend: 9.2 },
			},
			lineChart: [150, 230, 224, 218, 135, 147, 260],
		},
		equipment: {
			efficiency1: 100,
			efficiency2: 60,
			efficiency3: 80,
			progress: 70,
			actualQuantity: 124461000,
			plannedQuantity: 150000000,
			classification: [
				{ name: '찍힘', value: 10 },
				{ name: '형상', value: 9 },
				{ name: '혼입', value: 6 },
				{ name: '공정누락', value: 3 },
				{ name: '액고임', value: 3 },
				{ name: '기타', value: 1 },
			],
		},
	};

	const [data, setData] = useState(initialDashboardData);

	// Force re-render when initialDashboardData changes (for hot reload)
	useEffect(() => {
		setData(initialDashboardData);
	}, [
		initialDashboardData.sales.deliveryRate,
		initialDashboardData.sales.deadlineRate,
		initialDashboardData.purchase.deliveryRate,
		initialDashboardData.purchase.deadlineRate,
		initialDashboardData.equipment.efficiency1,
		initialDashboardData.equipment.efficiency2,
		initialDashboardData.equipment.efficiency3,
		initialDashboardData.equipment.actualQuantity,
		initialDashboardData.equipment.plannedQuantity,
	]);

	//   // Update functions
	//   const updateSalesDeliveryRate = (newValue: number) => {
	//     setData(prev => ({
	//       ...prev,
	//       sales: { ...prev.sales, deliveryRate: newValue }
	//     }));
	//   };

	//   const updateSalesDeadlineRate = (newValue: number) => {
	//     setData(prev => ({
	//       ...prev,
	//       sales: { ...prev.sales, deadlineRate: newValue }
	//     }));
	//   };

	//   const updatePurchaseDeliveryRate = (newValue: number) => {
	//     setData(prev => ({
	//       ...prev,
	//       purchase: { ...prev.purchase, deliveryRate: newValue }
	//     }));
	//   };

	//   const updatePurchaseDeadlineRate = (newValue: number) => {
	//     setData(prev => ({
	//       ...prev,
	//       purchase: { ...prev.purchase, deadlineRate: newValue }
	//     }));
	//   };

	//   const updateEquipmentEfficiency = (newValue: number) => {
	//     setData(prev => ({
	//       ...prev,
	//       equipment: { ...prev.equipment, efficiency: newValue }
	//     }));
	//   };

	//   const updateEquipmentProgress = (newValue: number) => {
	//     setData(prev => ({
	//       ...prev,
	//       equipment: { ...prev.equipment, progress: newValue }
	//     }));
	//   };

	//   const updateEquipmentClassification = (newData: Array<{name: string, value: number}>) => {
	//     setData(prev => ({
	//       ...prev,
	//       equipment: { ...prev.equipment, classification: newData }
	//     }));
	//   };

	// Check if device is mobile
	// const isMobile = useIsMobile();

	// // Render mobile version if on mobile device
	// if (isMobile) {
	// 	return <MobileDashboard data={data} />;
	// }

	// Render desktop version
	return <DesktopDashboard data={data} />;
};

export default Dashboard;
