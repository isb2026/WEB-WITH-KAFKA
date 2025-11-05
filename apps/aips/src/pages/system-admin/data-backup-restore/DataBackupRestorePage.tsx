import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from '@repo/i18n';
import {
	Download,
	Upload,
	Database,
	Clock,
	CheckCircle,
	XCircle,
	AlertTriangle,
	HardDrive,
	RefreshCw,
} from 'lucide-react';
import { EchartComponent } from '@repo/echart';
import {
	useDataTableColumns,
	ColumnConfig,
	useDataTable,
} from '@repo/radix-ui/hook';
import { DatatableComponent } from '@aips/components/datatable/DatatableComponent';
import { RadixIconButton } from '@radix-ui/components';

interface BackupLog {
	id: number;
	backupType: 'full' | 'incremental' | 'differential';
	status: 'completed' | 'failed' | 'in-progress';
	startTime: string;
	endTime?: string;
	duration?: string;
	size: string;
	location: string;
	initiatedBy: string;
	message?: string;
	errorDetails?: string;
}

interface RestoreLog {
	id: number;
	backupId: number;
	status: 'completed' | 'failed' | 'in-progress';
	startTime: string;
	endTime?: string;
	duration?: string;
	restoredBy: string;
	message?: string;
	errorDetails?: string;
}

// Dummy data for backup logs
const backupLogData: BackupLog[] = [
	{
		id: 1,
		backupType: 'full',
		status: 'completed',
		startTime: '2024-01-15 02:00:00',
		endTime: '2024-01-15 02:45:00',
		duration: '45 minutes',
		size: '2.5 GB',
		location: '/backups/full_20240115_020000.zip',
		initiatedBy: 'System',
		message: 'Full backup completed successfully',
	},
	{
		id: 2,
		backupType: 'incremental',
		status: 'completed',
		startTime: '2024-01-15 14:00:00',
		endTime: '2024-01-15 14:15:00',
		duration: '15 minutes',
		size: '150 MB',
		location: '/backups/incremental_20240115_140000.zip',
		initiatedBy: 'System',
		message: 'Incremental backup completed successfully',
	},
	{
		id: 3,
		backupType: 'full',
		status: 'failed',
		startTime: '2024-01-14 02:00:00',
		endTime: '2024-01-14 02:10:00',
		duration: '10 minutes',
		size: '0 MB',
		location: '/backups/failed_20240114_020000.zip',
		initiatedBy: 'System',
		message: 'Backup failed due to insufficient disk space',
		errorDetails: 'Disk space: 1.2 GB available, Required: 2.5 GB',
	},
	{
		id: 4,
		backupType: 'differential',
		status: 'in-progress',
		startTime: '2024-01-15 18:00:00',
		location: '/backups/differential_20240115_180000.zip',
		size: '0 MB',
		initiatedBy: 'Admin User',
		message: 'Differential backup in progress',
	},
];

// Dummy data for restore logs
const restoreLogData: RestoreLog[] = [
	{
		id: 1,
		backupId: 1,
		status: 'completed',
		startTime: '2024-01-10 10:00:00',
		endTime: '2024-01-10 10:30:00',
		duration: '30 minutes',
		restoredBy: 'Admin User',
		message: 'Full system restore completed successfully',
	},
	{
		id: 2,
		backupId: 2,
		status: 'failed',
		startTime: '2024-01-12 15:00:00',
		endTime: '2024-01-12 15:05:00',
		duration: '5 minutes',
		restoredBy: 'Admin User',
		message: 'Restore failed due to corrupted backup file',
		errorDetails: 'Backup file checksum validation failed',
	},
];

const DataBackupRestorePage: React.FC = () => {
	const { t } = useTranslation('common');
	const [activeTab, setActiveTab] = useState<'backup' | 'restore'>('backup');
	const [backupLocation, setBackupLocation] = useState('/backups');
	const [isBackupRunning, setIsBackupRunning] = useState(false);
	const [isRestoreRunning, setIsRestoreRunning] = useState(false);

	// Backup logs table configuration
	const backupLogColumns = useMemo<ColumnConfig<BackupLog>[]>(
		() => [
			{
				accessorKey: 'id',
				header: 'ID',
				size: 80,
				align: 'left' as const,
			},
			{
				accessorKey: 'backupType',
				header: 'Type',
				size: 120,
				align: 'left' as const,
				cell: ({ row }: { row: { original: BackupLog } }) => (
					<span
						className={`px-2 py-1 rounded-full text-xs font-medium ${
							row.original.backupType === 'full'
								? 'bg-blue-100 text-blue-800'
								: row.original.backupType === 'incremental'
									? 'bg-green-100 text-green-800'
									: 'bg-purple-100 text-purple-800'
						}`}
					>
						{row.original.backupType}
					</span>
				),
			},
			{
				accessorKey: 'status',
				header: 'Status',
				size: 120,
				align: 'left' as const,
				cell: ({ row }: { row: { original: BackupLog } }) => {
					const status = row.original.status;
					const statusConfig: Record<string, { color: string; icon: React.ComponentType<{ size?: number | string }> }> = {
						completed: {
							color: 'bg-green-100 text-green-800',
							icon: CheckCircle,
						},
						failed: {
							color: 'bg-red-100 text-red-800',
							icon: XCircle,
						},
						'in-progress': {
							color: 'bg-blue-100 text-blue-800',
							icon: RefreshCw,
						},
					};
					const config = statusConfig[status];
					const Icon = config.icon;
					return (
						<span
							className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${config.color}`}
						>
							<Icon size={12} />
							{status}
						</span>
					);
				},
			},
			{
				accessorKey: 'startTime',
				header: 'Start Time',
				size: 150,
				align: 'left' as const,
			},
			{
				accessorKey: 'duration',
				header: 'Duration',
				size: 120,
				align: 'left' as const,
				cell: ({ row }: { row: { original: BackupLog } }) => row.original.duration || '-',
			},
			{
				accessorKey: 'size',
				header: 'Size',
				size: 100,
				align: 'left' as const,
			},
			{
				accessorKey: 'location',
				header: 'Location',
				size: 300,
				align: 'left' as const,
			},
			{
				accessorKey: 'initiatedBy',
				header: 'Initiated By',
				size: 120,
				align: 'left' as const,
			},
			{
				accessorKey: 'message',
				header: 'Message',
				size: 250,
				align: 'left' as const,
			},
		],
		[]
	);

	// Restore logs table configuration
	const restoreLogColumns = useMemo<ColumnConfig<RestoreLog>[]>(
		() => [
			{
				accessorKey: 'id',
				header: 'ID',
				size: 80,
				align: 'left' as const,
			},
			{
				accessorKey: 'backupId',
				header: 'Backup ID',
				size: 100,
				align: 'left' as const,
			},
			{
				accessorKey: 'status',
				header: 'Status',
				size: 120,
				align: 'left' as const,
				cell: ({ row }: { row: { original: RestoreLog } }) => {
					const status = row.original.status;
					const statusConfig: Record<string, { color: string; icon: React.ComponentType<{ size?: number | string }> }> = {
						completed: {
							color: 'bg-green-100 text-green-800',
							icon: CheckCircle,
						},
						failed: {
							color: 'bg-red-100 text-red-800',
							icon: XCircle,
						},
						'in-progress': {
							color: 'bg-blue-100 text-blue-800',
							icon: RefreshCw,
						},
					};
					const config = statusConfig[status];
					const Icon = config.icon;
					return (
						<span
							className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${config.color}`}
						>
							<Icon size={12} />
							{status}
						</span>
					);
				},
			},
			{
				accessorKey: 'startTime',
				header: 'Start Time',
				size: 150,
				align: 'left' as const,
			},
			{
				accessorKey: 'duration',
				header: 'Duration',
				size: 120,
				align: 'left' as const,
				cell: ({ row }: { row: { original: RestoreLog } }) => row.original.duration || '-',
			},
			{
				accessorKey: 'restoredBy',
				header: 'Restored By',
				size: 120,
				align: 'left' as const,
			},
			{
				accessorKey: 'message',
				header: 'Message',
				size: 250,
				align: 'left' as const,
			},
		],
		[]
	);

	const processedBackupLogColumns = useDataTableColumns(backupLogColumns);
	const processedRestoreLogColumns = useDataTableColumns(restoreLogColumns);

	const {
		table: backupLogTable,
		selectedRows: selectedBackupLogs,
		toggleRowSelection: toggleBackupLogSelection,
	} = useDataTable(
		backupLogData,
		processedBackupLogColumns,
		30,
		0,
		0,
		backupLogData.length,
		undefined
	);

	const {
		table: restoreLogTable,
		selectedRows: selectedRestoreLogs,
		toggleRowSelection: toggleRestoreLogSelection,
	} = useDataTable(
		restoreLogData,
		processedRestoreLogColumns,
		30,
		0,
		0,
		restoreLogData.length,
		undefined
	);

	// Chart data for backup statistics
	const chartOption = {
		title: {
			text: 'Backup Statistics (Last 30 Days)',
			left: 'center',
		},
		tooltip: {
			trigger: 'axis',
		},
		legend: {
			data: ['Full', 'Incremental', 'Differential'],
			top: '10%',
		},
		xAxis: {
			type: 'category',
			data: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
		},
		yAxis: {
			type: 'value',
			name: 'Backup Count',
		},
		series: [
			{
				name: 'Full',
				type: 'bar',
				data: [2, 2, 2, 2],
				itemStyle: { color: '#3B82F6' },
			},
			{
				name: 'Incremental',
				type: 'bar',
				data: [7, 7, 7, 7],
				itemStyle: { color: '#10B981' },
			},
			{
				name: 'Differential',
				type: 'bar',
				data: [2, 2, 2, 2],
				itemStyle: { color: '#8B5CF6' },
			},
		],
	};

	const handleBackup = async () => {
		setIsBackupRunning(true);
		// Simulate backup process
		setTimeout(() => {
			setIsBackupRunning(false);
		}, 3000);
	};

	const handleRestore = async (backupId: number) => {
		setIsRestoreRunning(true);
		// Simulate restore process
		setTimeout(() => {
			setIsRestoreRunning(false);
		}, 5000);
	};

	return (
		<div className="space-y-4">
			{/* Statistics Cards */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				<div className="p-4 rounded-lg border">
					<div className="flex items-center gap-3">
						<Database className="h-8 w-8 text-blue-600" />
						<div>
							<p className="text-sm text-gray-600">
								Total Backups
							</p>
							<p className="text-2xl font-bold text-gray-900">
								{backupLogData.length}
							</p>
						</div>
					</div>
				</div>
				<div className="p-4 rounded-lg border">
					<div className="flex items-center gap-3">
						<CheckCircle className="h-8 w-8 text-green-600" />
						<div>
							<p className="text-sm text-gray-600">Successful</p>
							<p className="text-2xl font-bold text-gray-900">
								{
									backupLogData.filter(
										(log) => log.status === 'completed'
									).length
								}
							</p>
						</div>
					</div>
				</div>
				<div className="p-4 rounded-lg border">
					<div className="flex items-center gap-3">
						<XCircle className="h-8 w-8 text-red-600" />
						<div>
							<p className="text-sm text-gray-600">Failed</p>
							<p className="text-2xl font-bold text-gray-900">
								{
									backupLogData.filter(
										(log) => log.status === 'failed'
									).length
								}
							</p>
						</div>
					</div>
				</div>
				<div className="p-4 rounded-lg border">
					<div className="flex items-center gap-3">
						<HardDrive className="h-8 w-8 text-purple-600" />
						<div>
							<p className="text-sm text-gray-600">Total Size</p>
							<p className="text-2xl font-bold text-gray-900">
								{backupLogData
									.filter((log) => log.status === 'completed')
									.reduce((total, log) => {
										const size = parseFloat(
											log.size
												.replace(' GB', '')
												.replace(' MB', '')
										);
										return (
											total +
											(log.size.includes('GB')
												? size
												: size / 1024)
										);
									}, 0)
									.toFixed(1)}{' '}
								GB
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* Chart */}
			<div className="p-6 rounded-lg border">
				<EchartComponent
					options={chartOption}
					styles={{ height: '400px' }}
				/>
			</div>

			{/* Tab Navigation */}
			<div>
				<nav className="flex space-x-1">
					<button
						onClick={() => setActiveTab('backup')}
						className={`inline-flex gap-2 items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-foreground hover:bg-[#F5F5F5] dark:hover:bg-[#22262F] ${
							activeTab === 'backup'
								? 'bg-[#F5F5F5] dark:bg-[#22262F]'
								: ''
						}`}
					>
						Backup Management
					</button>
					<button
						onClick={() => setActiveTab('restore')}
						className={`inline-flex gap-2 items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-foreground hover:bg-[#F5F5F5] dark:hover:bg-[#22262F] ${
							activeTab === 'restore'
								? 'bg-[#F5F5F5] dark:bg-[#22262F]'
								: ''
						}`}
					>
						Restore Operations
					</button>
				</nav>
			</div>

			{/* Datatable */}
			<div className="rounded-lg border">
				{activeTab === 'backup' && (
					<DatatableComponent
						data={backupLogData}
						table={backupLogTable}
						columns={backupLogColumns}
						tableTitle="Backup Logs"
						rowCount={backupLogData.length}
						useSearch={true}
						usePageNation={false}
						toggleRowSelection={toggleBackupLogSelection}
						selectedRows={selectedBackupLogs}
						useEditable={false}
					/>
				)}

				{activeTab === 'restore' && (
					<DatatableComponent
						data={restoreLogData}
						table={restoreLogTable}
						columns={restoreLogColumns}
						tableTitle="Restore Logs"
						rowCount={restoreLogData.length}
						useSearch={true}
						usePageNation={false}
						toggleRowSelection={toggleRestoreLogSelection}
						selectedRows={selectedRestoreLogs}
						useEditable={false}
					/>
				)}
			</div>
		</div>
	);
};

export default DataBackupRestorePage;
