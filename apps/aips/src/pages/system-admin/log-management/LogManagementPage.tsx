import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from '@repo/i18n';
import {
	FileText,
	Search,
	Filter,
	Download,
	Trash2,
	AlertTriangle,
	Info,
	CheckCircle,
	XCircle,
	Clock,
	User,
	Database,
} from 'lucide-react';
import { EchartComponent } from '@repo/echart';
import {
	useDataTableColumns,
	ColumnConfig,
	useDataTable,
} from '@repo/radix-ui/hook';
import { DatatableComponent } from '@aips/components/datatable/DatatableComponent';
import { RadixIconButton } from '@radix-ui/components';

interface SystemLog {
	id: number;
	timestamp: string;
	level: 'info' | 'warning' | 'error' | 'debug' | 'critical';
	module: string;
	message: string;
	userId?: string;
	ipAddress?: string;
	sessionId?: string;
	details?: string;
	stackTrace?: string;
}

interface LogFilter {
	level: string[];
	module: string[];
	dateRange: {
		start: string;
		end: string;
	};
	searchText: string;
}

// Dummy data for system logs
const systemLogData: SystemLog[] = [
	{
		id: 1,
		timestamp: '2024-01-15 15:30:00',
		level: 'info',
		module: 'User Authentication',
		message: 'User admin logged in successfully',
		userId: 'admin',
		ipAddress: '192.168.1.100',
		sessionId: 'sess_12345',
	},
	{
		id: 2,
		timestamp: '2024-01-15 15:29:45',
		level: 'warning',
		module: 'Database Connection',
		message: 'Database connection pool reaching capacity limit',
		userId: 'system',
		ipAddress: '192.168.1.1',
		sessionId: 'sess_system',
		details: 'Current pool size: 85/100',
	},
	{
		id: 3,
		timestamp: '2024-01-15 15:28:30',
		level: 'error',
		module: 'API Gateway',
		message: 'Failed to process request: timeout',
		userId: 'user123',
		ipAddress: '192.168.1.150',
		sessionId: 'sess_67890',
		details: 'Request ID: req_456, Timeout: 30s',
		stackTrace:
			'Error: Request timeout\n    at processRequest (/api/gateway.js:45:12)',
	},
	{
		id: 4,
		timestamp: '2024-01-15 15:27:15',
		level: 'debug',
		module: 'Cache Service',
		message: 'Cache miss for key: user_profile_123',
		userId: 'system',
		ipAddress: '192.168.1.1',
		sessionId: 'sess_system',
	},
	{
		id: 5,
		timestamp: '2024-01-15 15:26:00',
		level: 'critical',
		module: 'System Monitor',
		message: 'CPU usage exceeded 90% threshold',
		userId: 'system',
		ipAddress: '192.168.1.1',
		sessionId: 'sess_system',
		details: 'Current CPU: 95%, Memory: 87%, Disk: 45%',
	},
	{
		id: 6,
		timestamp: '2024-01-15 15:25:45',
		level: 'info',
		module: 'Backup Service',
		message: 'Scheduled backup completed successfully',
		userId: 'system',
		ipAddress: '192.168.1.1',
		sessionId: 'sess_system',
		details: 'Backup size: 2.5 GB, Duration: 45 minutes',
	},
	{
		id: 7,
		timestamp: '2024-01-15 15:24:30',
		level: 'warning',
		module: 'Security Monitor',
		message: 'Multiple failed login attempts detected',
		userId: 'unknown',
		ipAddress: '203.0.113.45',
		sessionId: 'sess_unknown',
		details: 'IP blocked for 15 minutes due to 5 failed attempts',
	},
	{
		id: 8,
		timestamp: '2024-01-15 15:23:15',
		level: 'error',
		module: 'Email Service',
		message: 'Failed to send notification email',
		userId: 'system',
		ipAddress: '192.168.1.1',
		sessionId: 'sess_system',
		details: 'SMTP server unreachable, retry in 5 minutes',
		stackTrace:
			'Error: Connection refused\n    at sendEmail (/services/email.js:78:15)',
	},
];

const LogManagementPage: React.FC = () => {
	const { t } = useTranslation('common');
	const [filters, setFilters] = useState<LogFilter>({
		level: [],
		module: [],
		dateRange: {
			start: '',
			end: '',
		},
		searchText: '',
	});

	// Filter logs based on current filters
	const filteredLogs = useMemo(() => {
		return systemLogData.filter((log) => {
			// Level filter
			if (
				filters.level.length > 0 &&
				!filters.level.includes(log.level)
			) {
				return false;
			}

			// Module filter
			if (
				filters.module.length > 0 &&
				!filters.module.includes(log.module)
			) {
				return false;
			}

			// Date range filter
			if (
				filters.dateRange.start &&
				new Date(log.timestamp) < new Date(filters.dateRange.start)
			) {
				return false;
			}
			if (
				filters.dateRange.end &&
				new Date(log.timestamp) > new Date(filters.dateRange.end)
			) {
				return false;
			}

			// Search text filter
			if (
				filters.searchText &&
				!log.message
					.toLowerCase()
					.includes(filters.searchText.toLowerCase())
			) {
				return false;
			}

			return true;
		});
	}, [filters]);

	// System logs table configuration
	const logColumns = useMemo<ColumnConfig<SystemLog>[]>(
		() => [
			{
				accessorKey: 'timestamp',
				header: 'Timestamp',
				size: 150,
				align: 'left' as const,
			},
			{
				accessorKey: 'level',
				header: 'Level',
				size: 100,
				align: 'left' as const,
				cell: ({ row }: { row: { original: SystemLog } }) => {
					const level = row.original.level;
					const levelConfig: Record<string, { color: string; icon: React.ComponentType<{ size?: number | string }> }> = {
						info: {
							color: 'bg-blue-100 text-blue-800',
							icon: Info,
						},
						warning: {
							color: 'bg-yellow-100 text-yellow-800',
							icon: AlertTriangle,
						},
						error: {
							color: 'bg-red-100 text-red-800',
							icon: XCircle,
						},
						debug: {
							color: 'bg-gray-100 text-gray-800',
							icon: FileText,
						},
						critical: {
							color: 'bg-purple-100 text-purple-800',
							icon: AlertTriangle,
						},
					};
					const config = levelConfig[level];
					const Icon = config.icon;
					return (
						<span
							className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${config.color}`}
						>
							<Icon size={12} />
							{level.toUpperCase()}
						</span>
					);
				},
			},
			{
				accessorKey: 'module',
				header: 'Module',
				size: 150,
				align: 'left' as const,
			},
			{
				accessorKey: 'message',
				header: 'Message',
				size: 300,
				align: 'left' as const,
			},
			{
				accessorKey: 'userId',
				header: 'User ID',
				size: 120,
				align: 'left' as const,
				cell: ({ row }: { row: { original: SystemLog } }) => row.original.userId || '-',
			},
			{
				accessorKey: 'ipAddress',
				header: 'IP Address',
				size: 130,
				align: 'left' as const,
				cell: ({ row }: { row: { original: SystemLog } }) => row.original.ipAddress || '-',
			},
			{
				accessorKey: 'details',
				header: 'Details',
				size: 200,
				align: 'left' as const,
				cell: ({ row }: { row: { original: SystemLog } }) => row.original.details || '-',
			},
		],
		[]
	);

	const processedLogColumns = useDataTableColumns(logColumns);

	const {
		table: logTable,
		selectedRows: selectedLogs,
		toggleRowSelection: toggleLogSelection,
	} = useDataTable(
		filteredLogs,
		processedLogColumns,
		30,
		0,
		0,
		filteredLogs.length,
		undefined
	);

	// Chart data for log analytics
	const chartOption = {
		title: {
			text: 'Log Distribution by Level (Last 24 Hours)',
			left: 'center',
		},
		tooltip: {
			trigger: 'axis',
		},
		legend: {
			data: ['Info', 'Warning', 'Error', 'Debug', 'Critical'],
			top: '10%',
		},
		xAxis: {
			type: 'category',
			data: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
		},
		yAxis: {
			type: 'value',
			name: 'Log Count',
		},
		series: [
			{
				name: 'Info',
				type: 'line',
				data: [12, 8, 15, 22, 18, 14],
				itemStyle: { color: '#3B82F6' },
			},
			{
				name: 'Warning',
				type: 'line',
				data: [3, 2, 5, 8, 6, 4],
				itemStyle: { color: '#F59E0B' },
			},
			{
				name: 'Error',
				type: 'line',
				data: [1, 0, 2, 3, 2, 1],
				itemStyle: { color: '#EF4444' },
			},
			{
				name: 'Debug',
				type: 'line',
				data: [8, 5, 10, 15, 12, 9],
				itemStyle: { color: '#6B7280' },
			},
			{
				name: 'Critical',
				type: 'line',
				data: [0, 0, 1, 2, 1, 0],
				itemStyle: { color: '#8B5CF6' },
			},
		],
	};

	return (
		<div className="space-y-4">
			{/* Statistics Cards */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				<div className="p-4 rounded-lg border">
					<div className="flex items-center gap-3">
						<FileText className="h-8 w-8 text-blue-600" />
						<div>
							<p className="text-sm text-gray-600">Total Logs</p>
							<p className="text-2xl font-bold text-gray-900">
								{systemLogData.length}
							</p>
						</div>
					</div>
				</div>
				<div className="p-4 rounded-lg border">
					<div className="flex items-center gap-3">
						<AlertTriangle className="h-8 w-8 text-yellow-600" />
						<div>
							<p className="text-sm text-gray-600">Warnings</p>
							<p className="text-2xl font-bold text-gray-900">
								{
									systemLogData.filter(
										(log) => log.level === 'warning'
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
							<p className="text-sm text-gray-600">Errors</p>
							<p className="text-2xl font-bold text-gray-900">
								{
									systemLogData.filter(
										(log) => log.level === 'error'
									).length
								}
							</p>
						</div>
					</div>
				</div>
				<div className="p-4 rounded-lg border">
					<div className="flex items-center gap-3">
						<AlertTriangle className="h-8 w-8 text-purple-600" />
						<div>
							<p className="text-sm text-gray-600">Critical</p>
							<p className="text-2xl font-bold text-gray-900">
								{
									systemLogData.filter(
										(log) => log.level === 'critical'
									).length
								}
							</p>
						</div>
					</div>
				</div>
			</div>

			<div className="p-6 rounded-lg border">
				<EchartComponent
					options={chartOption}
					styles={{ height: '400px' }}
				/>
			</div>

			<div className="rounded-lg border">
				<DatatableComponent
					data={filteredLogs}
					table={logTable}
					columns={logColumns}
					tableTitle="System Logs"
					rowCount={filteredLogs.length}
					useSearch={false}
					usePageNation={false}
					toggleRowSelection={toggleLogSelection}
					selectedRows={selectedLogs}
					useEditable={false}
				/>
			</div>
		</div>
	);
};

export default LogManagementPage;
