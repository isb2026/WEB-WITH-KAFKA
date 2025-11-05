import { useState, useMemo } from 'react';
import { useTranslation } from '@repo/i18n';
import {
	AlertTriangle,
	CheckCircle,
	XCircle,
	Database,
	FileText,
	AlertCircle,
} from 'lucide-react';
import { EchartComponent } from '@repo/echart';
import {
	useDataTableColumns,
	ColumnConfig,
	useDataTable,
} from '@repo/radix-ui/hook';
import { DatatableComponent } from '@aips/components/datatable/DatatableComponent';

interface ValidationLog {
	id: number;
	entityType: string;
	entityName: string;
	validationType: 'data-integrity' | 'business-rule' | 'format' | 'reference';
	status: 'passed' | 'failed' | 'warning';
	message: string;
	severity: 'low' | 'medium' | 'high' | 'critical';
	validatedBy: string;
	validatedAt: string;
	resolvedAt?: string;
	resolvedBy?: string;
}

interface WarningItem {
	id: number;
	entityType: string;
	entityName: string;
	warningType: 'duplicate' | 'incomplete' | 'outdated' | 'inconsistent';
	description: string;
	impact: 'low' | 'medium' | 'high';
	createdAt: string;
	acknowledged: boolean;
	acknowledgedBy?: string;
	acknowledgedAt?: string;
}

// Dummy data for validation logs
const validationLogData: ValidationLog[] = [
	{
		id: 1,
		entityType: 'Product Master',
		entityName: 'PROD-001',
		validationType: 'data-integrity',
		status: 'passed',
		message: 'All required fields are present and valid',
		severity: 'low',
		validatedBy: 'System',
		validatedAt: '2024-01-15 10:30:00',
	},
	{
		id: 2,
		entityType: 'BOM',
		entityName: 'BOM-001',
		validationType: 'business-rule',
		status: 'failed',
		message: 'Circular reference detected in BOM structure',
		severity: 'critical',
		validatedBy: 'System',
		validatedAt: '2024-01-15 10:35:00',
	},
	{
		id: 3,
		entityType: 'Routing',
		entityName: 'ROUTE-001',
		validationType: 'format',
		status: 'warning',
		message: 'Process time format is inconsistent',
		severity: 'medium',
		validatedBy: 'System',
		validatedAt: '2024-01-15 10:40:00',
	},
	{
		id: 4,
		entityType: 'Machine Master',
		entityName: 'MACH-001',
		validationType: 'reference',
		status: 'passed',
		message: 'All referenced work centers exist',
		severity: 'low',
		validatedBy: 'System',
		validatedAt: '2024-01-15 10:45:00',
	},
	{
		id: 5,
		entityType: 'Work Center',
		entityName: 'WC-001',
		validationType: 'business-rule',
		status: 'failed',
		message: 'Capacity exceeds plant maximum limit',
		severity: 'high',
		validatedBy: 'System',
		validatedAt: '2024-01-15 10:50:00',
	},
];

// Dummy data for warnings
const warningData: WarningItem[] = [
	{
		id: 1,
		entityType: 'Product Master',
		entityName: 'PROD-002',
		warningType: 'duplicate',
		description: 'Product code already exists in another plant',
		impact: 'medium',
		createdAt: '2024-01-15 09:00:00',
		acknowledged: false,
	},
	{
		id: 2,
		entityType: 'BOM',
		entityName: 'BOM-002',
		warningType: 'incomplete',
		description: 'Missing component quantities for some operations',
		impact: 'high',
		createdAt: '2024-01-15 09:15:00',
		acknowledged: true,
		acknowledgedBy: 'Admin User',
		acknowledgedAt: '2024-01-15 09:30:00',
	},
	{
		id: 3,
		entityType: 'Routing',
		entityName: 'ROUTE-002',
		warningType: 'outdated',
		description: 'Process parameters not updated for 6 months',
		impact: 'low',
		createdAt: '2024-01-15 09:30:00',
		acknowledged: false,
	},
	{
		id: 4,
		entityType: 'Machine Master',
		entityName: 'MACH-002',
		warningType: 'inconsistent',
		description: 'Maintenance schedule conflicts with production plan',
		impact: 'medium',
		createdAt: '2024-01-15 09:45:00',
		acknowledged: false,
	},
];

const MasterDataValidationPage: React.FC = () => {
	const { t } = useTranslation('common');
	const [activeTab, setActiveTab] = useState<'logs' | 'warnings'>('logs');

	// Validation logs table configuration
	const validationLogColumns = useMemo<ColumnConfig<ValidationLog>[]>(
		() => [
			{
				accessorKey: 'entityType',
				header: 'Entity Type',
				size: 150,
				align: 'left' as const,
			},
			{
				accessorKey: 'entityName',
				header: 'Entity Name',
				size: 120,
				align: 'left' as const,
			},
			{
				accessorKey: 'validationType',
				header: 'Validation Type',
				size: 140,
				align: 'left' as const,
				cell: ({ row }: { row: { original: ValidationLog } }) => (
					<span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
						{row.original.validationType.replace('-', ' ')}
					</span>
				),
			},
			{
				accessorKey: 'status',
				header: 'Status',
				size: 100,
				align: 'left' as const,
				cell: ({ row }: { row: { original: ValidationLog } }) => {
					const status = row.original.status;
					const statusConfig: Record<string, { color: string; icon: React.ComponentType<{ size?: number | string }> }> = {
						passed: {
							color: 'bg-green-100 text-green-800',
							icon: CheckCircle,
						},
						failed: {
							color: 'bg-red-100 text-red-800',
							icon: XCircle,
						},
						warning: {
							color: 'bg-yellow-100 text-yellow-800',
							icon: AlertTriangle,
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
				accessorKey: 'severity',
				header: 'Severity',
				size: 100,
				align: 'left' as const,
				cell: ({ row }: { row: { original: ValidationLog } }) => {
					const severity = row.original.severity;
					const severityConfig: Record<string, string> = {
						low: 'bg-gray-100 text-gray-800',
						medium: 'bg-yellow-100 text-yellow-800',
						high: 'bg-orange-100 text-orange-800',
						critical: 'bg-red-100 text-red-800',
					};
					return (
						<span
							className={`px-2 py-1 rounded-full text-xs font-medium ${severityConfig[severity]}`}
						>
							{severity}
						</span>
					);
				},
			},
			{
				accessorKey: 'message',
				header: 'Message',
				size: 300,
				align: 'left' as const,
			},
			{
				accessorKey: 'validatedBy',
				header: 'Validated By',
				size: 120,
				align: 'left' as const,
			},
			{
				accessorKey: 'validatedAt',
				header: 'Validated At',
				size: 150,
				align: 'left' as const,
			},
		],
		[]
	);

	// Warnings table configuration
	const warningColumns = useMemo<ColumnConfig<WarningItem>[]>(
		() => [
			{
				accessorKey: 'entityType',
				header: 'Entity Type',
				size: 150,
				align: 'left' as const,
			},
			{
				accessorKey: 'entityName',
				header: 'Entity Name',
				size: 120,
				align: 'left' as const,
			},
			{
				accessorKey: 'warningType',
				header: 'Warning Type',
				size: 140,
				align: 'left' as const,
				cell: ({ row }: { row: { original: WarningItem } }) => (
					<span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
						{row.original.warningType}
					</span>
				),
			},
			{
				accessorKey: 'description',
				header: 'Description',
				size: 300,
				align: 'left' as const,
			},
			{
				accessorKey: 'impact',
				header: 'Impact',
				size: 100,
				align: 'left' as const,
				cell: ({ row }: { row: { original: WarningItem } }) => {
					const impact = row.original.impact;
					const impactConfig: Record<string, string> = {
						low: 'bg-gray-100 text-gray-800',
						medium: 'bg-yellow-100 text-yellow-800',
						high: 'bg-red-100 text-red-800',
					};
					return (
						<span
							className={`px-2 py-1 rounded-full text-xs font-medium ${impactConfig[impact]}`}
						>
							{impact}
						</span>
					);
				},
			},
			{
				accessorKey: 'acknowledged',
				header: 'Status',
				size: 100,
				align: 'left' as const,
				cell: ({ row }: { row: { original: WarningItem } }) => (
					<span
						className={`px-2 py-1 rounded-full text-xs font-medium ${
							row.original.acknowledged
								? 'bg-green-100 text-green-800'
								: 'bg-red-100 text-red-800'
						}`}
					>
						{row.original.acknowledged ? 'Acknowledged' : 'Pending'}
					</span>
				),
			},
			{
				accessorKey: 'createdAt',
				header: 'Created At',
				size: 150,
				align: 'left' as const,
			},
		],
		[]
	);

	const processedValidationLogColumns =
		useDataTableColumns(validationLogColumns);
	const processedWarningColumns = useDataTableColumns(warningColumns);

	const {
		table: validationLogTable,
		selectedRows: selectedValidationLogs,
		toggleRowSelection: toggleValidationLogSelection,
	} = useDataTable(
		validationLogData,
		processedValidationLogColumns,
		30,
		0,
		0,
		validationLogData.length,
		undefined
	);

	const {
		table: warningTable,
		selectedRows: selectedWarnings,
		toggleRowSelection: toggleWarningSelection,
	} = useDataTable(
		warningData,
		processedWarningColumns,
		30,
		0,
		0,
		warningData.length,
		undefined
	);

	// Chart data for validation statistics
	const chartOption = {
		title: {
			text: 'Master Data Validation Overview',
			left: 'center',
		},
		tooltip: {
			trigger: 'item',
		},
		legend: {
			orient: 'vertical',
			left: 'left',
		},
		series: [
			{
				name: 'Validation Results',
				type: 'pie',
				radius: '50%',
				data: [
					{
						value: validationLogData.filter(
							(log) => log.status === 'passed'
						).length,
						name: 'Passed',
						itemStyle: { color: '#10B981' },
					},
					{
						value: validationLogData.filter(
							(log) => log.status === 'failed'
						).length,
						name: 'Failed',
						itemStyle: { color: '#EF4444' },
					},
					{
						value: validationLogData.filter(
							(log) => log.status === 'warning'
						).length,
						name: 'Warning',
						itemStyle: { color: '#F59E0B' },
					},
				],
				emphasis: {
					itemStyle: {
						shadowBlur: 10,
						shadowOffsetX: 0,
						shadowColor: 'rgba(0, 0,0, 0.5)',
					},
				},
			},
		],
	};

	return (
		<div className="space-y-4">
			{/* Statistics Cards */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				<div className="p-4 rounded-lg border bg-white">
					<div className="flex items-center gap-3">
						<Database className="h-8 w-8 text-blue-600" />
						<div>
							<p className="text-sm text-gray-600">
								Total Validations
							</p>
							<p className="text-2xl font-bold text-gray-900">
								{validationLogData.length}
							</p>
						</div>
					</div>
				</div>
				<div className="p-4 rounded-lg border bg-white">
					<div className="flex items-center gap-3">
						<CheckCircle className="h-8 w-8 text-green-600" />
						<div>
							<p className="text-sm text-gray-600">Passed</p>
							<p className="text-2xl font-bold text-gray-900">
								{
									validationLogData.filter(
										(log) => log.status === 'passed'
									).length
								}
							</p>
						</div>
					</div>
				</div>
				<div className="p-4 rounded-lg border bg-white">
					<div className="flex items-center gap-3">
						<XCircle className="h-8 w-8 text-red-600" />
						<div>
							<p className="text-sm text-gray-600">Failed</p>
							<p className="text-2xl font-bold text-gray-900">
								{
									validationLogData.filter(
										(log) => log.status === 'failed'
									).length
								}
							</p>
						</div>
					</div>
				</div>
				<div className="p-4 rounded-lg border bg-white">
					<div className="flex items-center gap-3">
						<AlertTriangle className="h-8 w-8 text-yellow-600" />
						<div>
							<p className="text-sm text-gray-600">
								Active Warnings
							</p>
							<p className="text-2xl font-bold text-gray-900">
								{
									warningData.filter(
										(warning) => !warning.acknowledged
									).length
								}
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
						onClick={() => setActiveTab('logs')}
						className={`inline-flex gap-2 items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-foreground hover:bg-[#F5F5F5] dark:hover:bg-[#22262F] ${
							activeTab === 'logs'
								? 'bg-[#F5F5F5] dark:bg-[#22262F]'
								: ''
						}`}
					>
						<FileText size={16} />
						Validation Logs ({validationLogData.length})
					</button>
					<button
						onClick={() => setActiveTab('warnings')}
						className={`inline-flex gap-2 items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-foreground hover:bg-[#F5F5F5] dark:hover:bg-[#22262F] ${
							activeTab === 'warnings'
								? 'bg-[#F5F5F5] dark:bg-[#22262F]'
								: ''
						}`}
					>
						<AlertCircle size={16} />
						Warning List ({warningData.length})
					</button>
				</nav>
			</div>

			<div className="rounded-lg border">
				{activeTab === 'logs' && (
					<DatatableComponent
						data={validationLogData}
						table={validationLogTable}
						columns={validationLogColumns}
						tableTitle="Validation Logs"
						rowCount={validationLogData.length}
						useSearch={true}
						usePageNation={false}
						toggleRowSelection={toggleValidationLogSelection}
						selectedRows={selectedValidationLogs}
						useEditable={false}
					/>
				)}

				{activeTab === 'warnings' && (
					<DatatableComponent
						data={warningData}
						table={warningTable}
						columns={warningColumns}
						tableTitle="Warning List"
						rowCount={warningData.length}
						useSearch={true}
						usePageNation={false}
						toggleRowSelection={toggleWarningSelection}
						selectedRows={selectedWarnings}
						useEditable={false}
					/>
				)}
			</div>
		</div>
	);
};

export default MasterDataValidationPage;
