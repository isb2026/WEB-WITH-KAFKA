import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from '@repo/i18n';
import {
	Settings,
	Save,
	RefreshCw,
	Database,
	Server,
	Globe,
	Shield,
	Bell,
	Monitor,
	Key,
	Eye,
	EyeOff,
} from 'lucide-react';
import { EchartComponent } from '@repo/echart';
import {
	RadixIconButton,
	RadixSelect,
	RadixSelectItem,
} from '@radix-ui/components';

interface ConfigParameter {
	id: string;
	name: string;
	value: string;
	description: string;
	category:
		| 'database'
		| 'server'
		| 'security'
		| 'notification'
		| 'monitoring'
		| 'general';
	type: 'string' | 'number' | 'boolean' | 'select';
	options?: string[];
	required: boolean;
	encrypted: boolean;
	lastModified: string;
	modifiedBy: string;
}

interface ConfigCategory {
	id: string;
	name: string;
	icon: React.ComponentType<{ size?: number | string }>;
	description: string;
	parameterCount: number;
}

// Dummy data for configuration parameters
const configParameters: ConfigParameter[] = [
	// Database settings
	{
		id: 'db_host',
		name: 'Database Host',
		value: 'localhost',
		description: 'Database server hostname or IP address',
		category: 'database',
		type: 'string',
		required: true,
		encrypted: false,
		lastModified: '2024-01-15 10:00:00',
		modifiedBy: 'admin',
	},
	{
		id: 'db_port',
		name: 'Database Port',
		value: '5432',
		description: 'Database server port number',
		category: 'database',
		type: 'number',
		required: true,
		encrypted: false,
		lastModified: '2024-01-15 10:00:00',
		modifiedBy: 'admin',
	},
	{
		id: 'db_name',
		name: 'Database Name',
		value: 'aips_production',
		description: 'Database name',
		category: 'database',
		type: 'string',
		required: true,
		encrypted: false,
		lastModified: '2024-01-15 10:00:00',
		modifiedBy: 'admin',
	},
	{
		id: 'db_password',
		name: 'Database Password',
		value: '********',
		description: 'Database user password',
		category: 'database',
		type: 'string',
		required: true,
		encrypted: true,
		lastModified: '2024-01-15 10:00:00',
		modifiedBy: 'admin',
	},

	// Server settings
	{
		id: 'server_port',
		name: 'Server Port',
		value: '3000',
		description: 'Application server port',
		category: 'server',
		type: 'number',
		required: true,
		encrypted: false,
		lastModified: '2024-01-15 10:00:00',
		modifiedBy: 'admin',
	},
	{
		id: 'server_timeout',
		name: 'Request Timeout',
		value: '30000',
		description: 'Request timeout in milliseconds',
		category: 'server',
		type: 'number',
		required: false,
		encrypted: false,
		lastModified: '2024-01-15 10:00:00',
		modifiedBy: 'admin',
	},
	{
		id: 'server_environment',
		name: 'Environment',
		value: 'production',
		description: 'Application environment',
		category: 'server',
		type: 'select',
		options: ['development', 'staging', 'production'],
		required: true,
		encrypted: false,
		lastModified: '2024-01-15 10:00:00',
		modifiedBy: 'admin',
	},

	// Security settings
	{
		id: 'security_jwt_secret',
		name: 'JWT Secret',
		value: '********',
		description: 'JWT token signing secret',
		category: 'security',
		type: 'string',
		required: true,
		encrypted: true,
		lastModified: '2024-01-15 10:00:00',
		modifiedBy: 'admin',
	},
	{
		id: 'security_session_timeout',
		name: 'Session Timeout',
		value: '3600',
		description: 'User session timeout in seconds',
		category: 'security',
		type: 'number',
		required: false,
		encrypted: false,
		lastModified: '2024-01-15 10:00:00',
		modifiedBy: 'admin',
	},
	{
		id: 'security_password_policy',
		name: 'Password Policy',
		value: 'strong',
		description: 'Password strength requirement',
		category: 'security',
		type: 'select',
		options: ['weak', 'medium', 'strong'],
		required: true,
		encrypted: false,
		lastModified: '2024-01-15 10:00:00',
		modifiedBy: 'admin',
	},

	// Notification settings
	{
		id: 'notification_email_enabled',
		name: 'Email Notifications',
		value: 'true',
		description: 'Enable email notifications',
		category: 'notification',
		type: 'boolean',
		required: false,
		encrypted: false,
		lastModified: '2024-01-15 10:00:00',
		modifiedBy: 'admin',
	},
	{
		id: 'notification_smtp_host',
		name: 'SMTP Host',
		value: 'smtp.company.com',
		description: 'SMTP server hostname',
		category: 'notification',
		type: 'string',
		required: false,
		encrypted: false,
		lastModified: '2024-01-15 10:00:00',
		modifiedBy: 'admin',
	},

	// Monitoring settings
	{
		id: 'monitoring_enabled',
		name: 'System Monitoring',
		value: 'true',
		description: 'Enable system monitoring',
		category: 'monitoring',
		type: 'boolean',
		required: false,
		encrypted: false,
		lastModified: '2024-01-15 10:00:00',
		modifiedBy: 'admin',
	},
	{
		id: 'monitoring_interval',
		name: 'Monitoring Interval',
		value: '60',
		description: 'Monitoring check interval in seconds',
		category: 'monitoring',
		type: 'number',
		required: false,
		encrypted: false,
		lastModified: '2024-01-15 10:00:00',
		modifiedBy: 'admin',
	},
];

const EnvironmentSettingsPage: React.FC = () => {
	const { t } = useTranslation('common');
	const [activeCategory, setActiveCategory] = useState<string>('database');
	const [parameters, setParameters] =
		useState<ConfigParameter[]>(configParameters);
	const [editingParams, setEditingParams] = useState<{
		[key: string]: string;
	}>({});
	const [showEncrypted, setShowEncrypted] = useState<{
		[key: string]: boolean;
	}>({});
	const [hasChanges, setHasChanges] = useState(false);

	// Configuration categories
	const categories: ConfigCategory[] = [
		{
			id: 'database',
			name: 'Database',
			icon: Database,
			description: 'Database connection and configuration settings',
			parameterCount: parameters.filter((p) => p.category === 'database')
				.length,
		},
		{
			id: 'server',
			name: 'Server',
			icon: Server,
			description: 'Application server configuration',
			parameterCount: parameters.filter((p) => p.category === 'server')
				.length,
		},
		{
			id: 'security',
			name: 'Security',
			icon: Shield,
			description: 'Security and authentication settings',
			parameterCount: parameters.filter((p) => p.category === 'security')
				.length,
		},
		{
			id: 'notification',
			name: 'Notifications',
			icon: Bell,
			description: 'Email and notification settings',
			parameterCount: parameters.filter(
				(p) => p.category === 'notification'
			).length,
		},
		{
			id: 'monitoring',
			name: 'Monitoring',
			icon: Monitor,
			description: 'System monitoring configuration',
			parameterCount: parameters.filter(
				(p) => p.category === 'monitoring'
			).length,
		},
	];

	// Get parameters for current category
	const categoryParameters = useMemo(() => {
		return parameters.filter((p) => p.category === activeCategory);
	}, [parameters, activeCategory]);

	// Handle parameter value change
	const handleParameterChange = (paramId: string, value: string) => {
		setEditingParams((prev) => ({
			...prev,
			[paramId]: value,
		}));
		setHasChanges(true);
	};

	// Save all changes
	const handleSaveChanges = () => {
		const updatedParameters = parameters.map((param) => ({
			...param,
			value:
				editingParams[param.id] !== undefined
					? editingParams[param.id]
					: param.value,
			lastModified: new Date().toISOString(),
			modifiedBy: 'admin',
		}));

		setParameters(updatedParameters);
		setEditingParams({});
		setHasChanges(false);

		// Simulate API call
		console.log('Saving configuration changes...');
	};

	// Reset changes
	const handleResetChanges = () => {
		setEditingParams({});
		setHasChanges(false);
	};

	// Toggle encrypted value visibility
	const toggleEncrypted = (paramId: string) => {
		setShowEncrypted((prev) => ({
			...prev,
			[paramId]: !prev[paramId],
		}));
	};

	// Render parameter input based on type
	const renderParameterInput = (param: ConfigParameter) => {
		const currentValue =
			editingParams[param.id] !== undefined
				? editingParams[param.id]
				: param.value;
		const isEncrypted = param.encrypted && !showEncrypted[param.id];

		switch (param.type) {
			case 'boolean':
				return (
					<RadixSelect
						value={currentValue}
						onValueChange={(value) =>
							handleParameterChange(param.id, value)
						}
						placeholder="Select option"
					>
						<RadixSelectItem value="true">Enabled</RadixSelectItem>
						<RadixSelectItem value="false">
							Disabled
						</RadixSelectItem>
					</RadixSelect>
				);

			case 'select':
				return (
					<RadixSelect
						value={currentValue}
						onValueChange={(value) =>
							handleParameterChange(param.id, value)
						}
						placeholder="Select option"
					>
						{param.options?.map((option) => (
							<RadixSelectItem key={option} value={option}>
								{option}
							</RadixSelectItem>
						))}
					</RadixSelect>
				);

			case 'number':
				return (
					<input
						type="number"
						value={currentValue}
						onChange={(e) =>
							handleParameterChange(param.id, e.target.value)
						}
						className="w-full px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
				);

			default:
				return (
					<div className="relative">
						<input
							type={isEncrypted ? 'password' : 'text'}
							value={currentValue}
							onChange={(e) =>
								handleParameterChange(param.id, e.target.value)
							}
							className="w-full px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
						{param.encrypted && (
							<RadixIconButton
								onClick={() => toggleEncrypted(param.id)}
								className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
							>
								{showEncrypted[param.id] ? (
									<EyeOff size={16} />
								) : (
									<Eye size={16} />
								)}
							</RadixIconButton>
						)}
					</div>
				);
		}
	};

	// Chart data for configuration overview
	const chartOption = {
		title: {
			text: 'Configuration Parameters by Category',
			left: 'center',
		},
		tooltip: {
			trigger: 'item',
			formatter: '{a} <br/>{b}: {c} ({d}%)',
		},
		legend: {
			orient: 'vertical',
			left: 'left',
		},
		series: [
			{
				name: 'Parameters',
				type: 'pie',
				radius: '50%',
				data: categories.map((cat) => ({
					value: cat.parameterCount,
					name: cat.name,
				})),
				emphasis: {
					itemStyle: {
						shadowBlur: 10,
						shadowOffsetX: 0,
						shadowColor: 'rgba(0, 0, 0, 0.5)',
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
						<Settings className="h-8 w-8 text-blue-600" />
						<div>
							<p className="text-sm text-gray-600">
								Total Parameters
							</p>
							<p className="text-2xl font-bold text-gray-900">
								{parameters.length}
							</p>
						</div>
					</div>
				</div>
				<div className="p-4 rounded-lg border bg-white">
					<div className="flex items-center gap-3">
						<Key className="h-8 w-8 text-red-600" />
						<div>
							<p className="text-sm text-gray-600">Encrypted</p>
							<p className="text-2xl font-bold text-gray-900">
								{parameters.filter((p) => p.encrypted).length}
							</p>
						</div>
					</div>
				</div>
				<div className="p-4 rounded-lg border bg-white">
					<div className="flex items-center gap-3">
						<Shield className="h-8 w-8 text-green-600" />
						<div>
							<p className="text-sm text-gray-600">Required</p>
							<p className="text-2xl font-bold text-gray-900">
								{parameters.filter((p) => p.required).length}
							</p>
						</div>
					</div>
				</div>
				<div className="p-4 rounded-lg border bg-white">
					<div className="flex items-center gap-3">
						<Globe className="h-8 w-8 text-purple-600" />
						<div>
							<p className="text-sm text-gray-600">Categories</p>
							<p className="text-2xl font-bold text-gray-900">
								{categories.length}
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

			{/* Category Navigation */}
			<div className="flex items-center justify-between">
				<nav className="flex space-x-2 overflow-x-auto">
					{categories.map((category) => (
						<button
							key={category.id}
							onClick={() => setActiveCategory(category.id)}
							className={`inline-flex gap-2 items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-foreground hover:bg-[#F5F5F5] dark:hover:bg-[#22262F] ${
								activeCategory === category.id
									? 'bg-[#F5F5F5] dark:bg-[#22262F]'
									: ''
							}`}
						>
							<div className="flex items-center gap-2">
								<category.icon size={16} />
								{category.name} ({category.parameterCount})
							</div>
						</button>
					))}
				</nav>
				<div className="flex items-center gap-2">
					<RadixIconButton
						onClick={handleResetChanges}
						className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border"
					>
						<RefreshCw size={16} />
						Reset
					</RadixIconButton>

					<RadixIconButton
						onClick={handleSaveChanges}
						className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border bg-Colors-Brand-700 hover:bg-Colors-Brand-800 text-white"
					>
						<Save size={16} />
						Save Changes
					</RadixIconButton>
				</div>
			</div>

			{/* Configuration Forms */}
			<div className="rounded-lg border space-y-6 p-6">
				{categoryParameters.map((param) => (
					<div
						key={param.id}
						className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start"
					>
						<div className="md:col-span-1">
							<label className="block text-sm font-medium text-gray-700 mb-2">
								{param.name}
								{param.required && (
									<span className="text-red-500 ml-1">*</span>
								)}
							</label>
							<p className="text-xs text-gray-500">
								{param.description}
							</p>
						</div>
						<div className="md:col-span-1">
							{renderParameterInput(param)}
						</div>
						<div className="md:col-span-1">
							<div className="text-xs text-gray-500 space-y-1">
								<div>Last modified: {param.lastModified}</div>
								<div>By: {param.modifiedBy}</div>
								{param.encrypted && (
									<div className="text-orange-600">
										Encrypted
									</div>
								)}
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default EnvironmentSettingsPage;
