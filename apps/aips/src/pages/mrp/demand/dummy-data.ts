// Demand data interface
export interface DemandData {
	id: number;
	productCode: string;
	productName: string;
	customerName: string;
	demandDate: string;
	requiredQuantity: number;
	forecastQuantity: number;
	actualDemand: number;
	priority: 'High' | 'Medium' | 'Low';
	status: 'Planned' | 'Confirmed' | 'In Production' | 'Completed';
	dueDate: string;
	category: string;
	unitPrice: number;
}

export const demandDummyData: DemandData[] = [
	{
		id: 1,
		productCode: 'PRD001',
		productName: 'Steel Frame Assembly',
		customerName: 'AutoTech Industries',
		demandDate: '2024-01-20',
		requiredQuantity: 500,
		forecastQuantity: 480,
		actualDemand: 520,
		priority: 'High',
		status: 'Confirmed',
		dueDate: '2024-02-15',
		category: 'Automotive',
		unitPrice: 125.50
	},
	{
		id: 2,
		productCode: 'PRD002',
		productName: 'Electronic Control Unit',
		customerName: 'TechCorp Solutions',
		demandDate: '2024-01-22',
		requiredQuantity: 200,
		forecastQuantity: 220,
		actualDemand: 195,
		priority: 'High',
		status: 'In Production',
		dueDate: '2024-02-10',
		category: 'Electronics',
		unitPrice: 285.00
	},
	{
		id: 3,
		productCode: 'PRD003',
		productName: 'Plastic Housing Unit',
		customerName: 'Global Manufacturing',
		demandDate: '2024-01-25',
		requiredQuantity: 1000,
		forecastQuantity: 950,
		actualDemand: 0,
		priority: 'Medium',
		status: 'Planned',
		dueDate: '2024-03-01',
		category: 'Components',
		unitPrice: 45.75
	},
	{
		id: 4,
		productCode: 'PRD004',
		productName: 'Precision Gear Set',
		customerName: 'MechTech Ltd',
		demandDate: '2024-01-18',
		requiredQuantity: 150,
		forecastQuantity: 160,
		actualDemand: 150,
		priority: 'Low',
		status: 'Completed',
		dueDate: '2024-01-30',
		category: 'Mechanical',
		unitPrice: 95.25
	},
	{
		id: 5,
		productCode: 'PRD005',
		productName: 'Sensor Module Array',
		customerName: 'Smart Systems Inc',
		demandDate: '2024-01-28',
		requiredQuantity: 300,
		forecastQuantity: 280,
		actualDemand: 0,
		priority: 'Medium',
		status: 'Confirmed',
		dueDate: '2024-02-20',
		category: 'Electronics',
		unitPrice: 165.00
	},
	{
		id: 6,
		productCode: 'PRD006',
		productName: 'Hydraulic Cylinder',
		customerName: 'Heavy Industries Co',
		demandDate: '2024-01-30',
		requiredQuantity: 75,
		forecastQuantity: 80,
		actualDemand: 0,
		priority: 'High',
		status: 'Planned',
		dueDate: '2024-02-25',
		category: 'Industrial',
		unitPrice: 450.00
	}
];
