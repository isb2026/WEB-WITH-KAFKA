import React, { useState, useMemo } from 'react';
import { RadixIconButton, RadixSelect } from '@radix-ui/components';
import { Settings, Calendar, Filter, Download, Upload } from 'lucide-react';
import { useTranslation } from '@repo/i18n';
import { GanttChart } from '@repo/gantt-charts';
import { Task, ViewMode } from '@repo/gantt-charts';

interface MachineSchedule {
	id: string;
	machineCode: string;
	machineName: string;
	capacity: number;
	status: 'available' | 'maintenance' | 'breakdown';
}

interface JobSchedule {
	id: string;
	jobCode: string;
	jobName: string;
	machineId: string;
	startDate: Date;
	endDate: Date;
	priority: 'high' | 'medium' | 'low';
	status: 'scheduled' | 'in-progress' | 'completed' | 'delayed';
	quantity: number;
	notes?: string;
}

const MachineSchedulingPage: React.FC = () => {
	const { t } = useTranslation('common');
	const [selectedMachine, setSelectedMachine] = useState<string>('all');
	const [selectedDate, setSelectedDate] = useState<string>(
		new Date().toISOString().split('T')[0]
	);
	const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.Day);

	// Mock data for machines
	const machines: MachineSchedule[] = [
		{
			id: 'M001',
			machineCode: 'M001',
			machineName: '조립 설비 A',
			capacity: 100,
			status: 'available',
		},
		{
			id: 'M002',
			machineCode: 'M002',
			machineName: '도장 설비 B',
			capacity: 80,
			status: 'available',
		},
		{
			id: 'M003',
			machineCode: 'M003',
			machineName: '검사 설비 C',
			capacity: 120,
			status: 'maintenance',
		},
		{
			id: 'M004',
			machineCode: 'M004',
			machineName: '포장 설비 D',
			capacity: 150,
			status: 'available',
		},
		{
			id: 'M005',
			machineCode: 'M005',
			machineName: '가공 설비 E',
			capacity: 90,
			status: 'breakdown',
		},
	];

	// Mock data for job schedules
	const jobSchedules: JobSchedule[] = [
		{
			id: 'J001',
			jobCode: 'J001',
			jobName: '제품 A 조립',
			machineId: 'M001',
			startDate: new Date('2024-01-15T08:00:00'),
			endDate: new Date('2024-01-15T16:00:00'),
			priority: 'high',
			status: 'scheduled',
			quantity: 100,
			notes: '긴급 주문',
		},
		{
			id: 'J002',
			jobCode: 'J002',
			jobName: '제품 B 도장',
			machineId: 'M002',
			startDate: new Date('2024-01-15T09:00:00'),
			endDate: new Date('2024-01-15T17:00:00'),
			priority: 'medium',
			status: 'scheduled',
			quantity: 80,
			notes: '일반 주문',
		},
		{
			id: 'J003',
			jobCode: 'J003',
			jobName: '제품 C 검사',
			machineId: 'M003',
			startDate: new Date('2024-01-15T10:00:00'),
			endDate: new Date('2024-01-15T14:00:00'),
			priority: 'low',
			status: 'scheduled',
			quantity: 120,
			notes: '검사 설비 점검 중',
		},
		{
			id: 'J004',
			jobCode: 'J004',
			jobName: '제품 D 포장',
			machineId: 'M004',
			startDate: new Date('2024-01-15T08:00:00'),
			endDate: new Date('2024-01-15T12:00:00'),
			priority: 'high',
			status: 'in-progress',
			quantity: 150,
			notes: '진행 중',
		},
		{
			id: 'J005',
			jobCode: 'J005',
			jobName: '제품 E 가공',
			machineId: 'M005',
			startDate: new Date('2024-01-15T13:00:00'),
			endDate: new Date('2024-01-15T18:00:00'),
			priority: 'medium',
			status: 'delayed',
			quantity: 90,
			notes: '설비 고장으로 지연',
		},
	];

	// Convert job schedules to Gantt tasks
	const ganttTasks: Task[] = useMemo(() => {
		return jobSchedules.map((job) => {
			const machine = machines.find((m) => m.id === job.machineId);
			return {
				id: job.id,
				name: `${job.jobCode} - ${job.jobName}`,
				start: job.startDate,
				end: job.endDate,
				progress:
					job.status === 'completed'
						? 100
						: job.status === 'in-progress'
							? 50
							: 0,
				type: 'task',
				hideChildren: false,
				project: machine?.machineName || 'Unknown',
				dependencies: [],
				styles: {
					backgroundColor: getPriorityColor(job.priority),
					progressColor: getStatusColor(job.status),
					progressSelectedColor: getStatusColor(job.status),
				},
			};
		});
	}, [jobSchedules, machines]);

	// Filter machines based on selection
	const filteredMachines =
		selectedMachine === 'all'
			? machines
			: machines.filter((m) => m.id === selectedMachine);

	// Filter job schedules based on selection
	const filteredJobSchedules =
		selectedMachine === 'all'
			? jobSchedules
			: jobSchedules.filter((j) => j.machineId === selectedMachine);

	function getPriorityColor(priority: string): string {
		switch (priority) {
			case 'high':
				return '#EF4444';
			case 'medium':
				return '#F59E0B';
			case 'low':
				return '#10B981';
			default:
				return '#6B7280';
		}
	}

	function getStatusColor(status: string): string {
		switch (status) {
			case 'completed':
				return '#10B981';
			case 'in-progress':
				return '#3B82F6';
			case 'delayed':
				return '#EF4444';
			case 'scheduled':
				return '#6B7280';
			default:
				return '#6B7280';
		}
	}

	const handleMachineChange = (machineId: string) => {
		setSelectedMachine(machineId);
	};

	const handleDateChange = (date: string) => {
		setSelectedDate(date);
	};

	const handleViewModeChange = (mode: ViewMode) => {
		setViewMode(mode);
	};

	const handleExportSchedule = () => {
		// 실제로는 스케줄 데이터를 내보내는 로직
		console.log('Export schedule');
	};

	const handleImportSchedule = () => {
		// 실제로는 스케줄 데이터를 가져오는 로직
		console.log('Import schedule');
	};

	return (
		<div className="space-y-6">
			{/* Machine Status Summary */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
				{filteredMachines.map((machine) => (
					<div
						key={machine.id}
						className={`p-4 rounded-lg border ${
							machine.status === 'available'
								? 'bg-green-50 border-green-200'
								: machine.status === 'maintenance'
									? 'bg-yellow-50 border-yellow-200'
									: 'bg-red-50 border-red-200'
						}`}
					>
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-gray-600">
									{machine.machineCode}
								</p>
								<p className="text-lg font-semibold text-gray-800">
									{machine.machineName}
								</p>
								<p className="text-sm text-gray-500">
									용량: {machine.capacity}
								</p>
							</div>
							<div
								className={`w-3 h-3 rounded-full ${
									machine.status === 'available'
										? 'bg-green-500'
										: machine.status === 'maintenance'
											? 'bg-yellow-500'
											: 'bg-red-500'
								}`}
							/>
						</div>
						<div className="mt-2">
							<span
								className={`px-2 py-1 rounded-full text-xs font-medium ${
									machine.status === 'available'
										? 'bg-green-100 text-green-800'
										: machine.status === 'maintenance'
											? 'bg-yellow-100 text-yellow-800'
											: 'bg-red-100 text-red-800'
								}`}
							>
								{machine.status === 'available'
									? '가용'
									: machine.status === 'maintenance'
										? '점검중'
										: '고장'}
							</span>
						</div>
					</div>
				))}
			</div>

			{/* Gantt Chart */}
			<GanttChart locale="kor" headerOffset={470} />
		</div>
	);
};

export default MachineSchedulingPage;
