import React, { useState, useMemo } from 'react';
import { RadixIconButton, RadixSelect } from '@radix-ui/components';
import {
	ArrowUpDown,
	GripVertical,
	Save,
	RefreshCw,
	GanttChart,
	List,
} from 'lucide-react';
import { useTranslation } from '@repo/i18n';
import { GanttChart as GanttChartComponent } from '@repo/gantt-charts';
import { Task, ViewMode } from '@repo/gantt-charts';

interface WorkPriority {
	id: string;
	workOrderNumber: string;
	productName: string;
	machineName: string;
	priority: 'high' | 'medium' | 'low';
	status: 'scheduled' | 'in-progress' | 'pending';
	startDate: Date;
	endDate: Date;
	quantity: number;
	dueDate: Date;
	notes?: string;
}

const WorkPriorityAdjustmentPage: React.FC = () => {
	const { t } = useTranslation('common');
	const [workItems, setWorkItems] = useState<WorkPriority[]>([
		{
			id: '1',
			workOrderNumber: 'WO-2024-001',
			productName: '제품 A',
			machineName: '조립 설비 A',
			priority: 'high',
			status: 'scheduled',
			startDate: new Date('2024-01-15T08:00:00'),
			endDate: new Date('2024-01-15T16:00:00'),
			quantity: 100,
			dueDate: new Date('2024-01-20'),
			notes: '긴급 주문',
		},
		{
			id: '2',
			workOrderNumber: 'WO-2024-002',
			productName: '제품 B',
			machineName: '도장 설비 B',
			priority: 'medium',
			status: 'scheduled',
			startDate: new Date('2024-01-15T09:00:00'),
			endDate: new Date('2024-01-15T17:00:00'),
			quantity: 80,
			dueDate: new Date('2024-01-22'),
			notes: '일반 주문',
		},
		{
			id: '3',
			workOrderNumber: 'WO-2024-003',
			productName: '제품 C',
			machineName: '검사 설비 C',
			priority: 'low',
			status: 'pending',
			startDate: new Date('2024-01-16T08:00:00'),
			endDate: new Date('2024-01-16T16:00:00'),
			quantity: 120,
			dueDate: new Date('2024-01-25'),
			notes: '검토 필요',
		},
		{
			id: '4',
			workOrderNumber: 'WO-2024-004',
			productName: '제품 D',
			machineName: '포장 설비 D',
			priority: 'high',
			status: 'in-progress',
			startDate: new Date('2024-01-15T08:00:00'),
			endDate: new Date('2024-01-15T12:00:00'),
			quantity: 150,
			dueDate: new Date('2024-01-18'),
			notes: '진행 중',
		},
		{
			id: '5',
			workOrderNumber: 'WO-2024-005',
			productName: '제품 E',
			machineName: '가공 설비 E',
			priority: 'medium',
			status: 'pending',
			startDate: new Date('2024-01-17T08:00:00'),
			endDate: new Date('2024-01-17T18:00:00'),
			quantity: 90,
			dueDate: new Date('2024-01-24'),
			notes: '설비 점검 후 시작',
		},
	]);

	return (
		<div className="space-y-4">
			{/* Priority Summary */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<div className="bg-white p-4 rounded-lg border">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-gray-600">
								높은 우선순위
							</p>
							<p className="text-2xl font-bold text-red-600">
								{
									workItems.filter(
										(item) => item.priority === 'high'
									).length
								}
							</p>
						</div>
						<div className="w-3 h-3 rounded-full bg-red-500" />
					</div>
				</div>
				<div className="bg-white p-4 rounded-lg border">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-gray-600">
								보통 우선순위
							</p>
							<p className="text-2xl font-bold text-yellow-600">
								{
									workItems.filter(
										(item) => item.priority === 'medium'
									).length
								}
							</p>
						</div>
						<div className="w-3 h-3 rounded-full bg-yellow-500" />
					</div>
				</div>
				<div className="bg-white p-4 rounded-lg border">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-gray-600">
								낮은 우선순위
							</p>
							<p className="text-2xl font-bold text-green-600">
								{
									workItems.filter(
										(item) => item.priority === 'low'
									).length
								}
							</p>
						</div>
						<div className="w-3 h-3 rounded-full bg-green-500" />
					</div>
				</div>
			</div>

			<GanttChartComponent locale="kor" headerOffset={410} />
		</div>
	);
};

export default WorkPriorityAdjustmentPage;
