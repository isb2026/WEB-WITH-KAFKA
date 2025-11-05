import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from '@repo/i18n';
import {
	Users,
	UserPlus,
	Shield,
	Lock,
	CheckCircle,
	XCircle,
	Trash2,
	Key,
	Pen,
	Plus,
} from 'lucide-react';
import { EchartComponent } from '@repo/echart';
import {
	useDataTableColumns,
	ColumnConfig,
	useDataTable,
} from '@repo/radix-ui/hook';
import { DatatableComponent } from '@aips/components/datatable/DatatableComponent';
import { RadixIconButton } from '@repo/radix-ui/components';
import { DraggableDialog } from '@repo/radix-ui/components';
import { DeleteConfirmDialog } from '@aips/components/common/DeleteConfirmDialog';
import { toast } from 'sonner';

interface User {
	id: number;
	username: string;
	email: string;
	fullName: string;
	department: string;
	role: string;
	status: 'active' | 'inactive' | 'locked';
	lastLogin?: string;
	createdAt: string;
	permissions: string[];
}

interface Role {
	id: number;
	name: string;
	description: string;
	permissions: string[];
	userCount: number;
	createdAt: string;
}

// Dummy data for users
const userData: User[] = [
	{
		id: 1,
		username: 'admin',
		email: 'admin@company.com',
		fullName: 'System Administrator',
		department: 'IT',
		role: 'Super Admin',
		status: 'active',
		lastLogin: '2024-01-15 14:30:00',
		createdAt: '2024-01-01',
		permissions: ['all'],
	},
	{
		id: 2,
		username: 'manager1',
		email: 'manager1@company.com',
		fullName: 'Production Manager',
		department: 'Production',
		role: 'Manager',
		status: 'active',
		lastLogin: '2024-01-15 13:45:00',
		createdAt: '2024-01-02',
		permissions: ['read', 'write', 'approve'],
	},
	{
		id: 3,
		username: 'operator1',
		email: 'operator1@company.com',
		fullName: 'Production Operator',
		department: 'Production',
		role: 'Operator',
		status: 'active',
		lastLogin: '2024-01-15 12:15:00',
		createdAt: '2024-01-03',
		permissions: ['read', 'write'],
	},
	{
		id: 4,
		username: 'viewer1',
		email: 'viewer1@company.com',
		fullName: 'Quality Inspector',
		department: 'Quality',
		role: 'Viewer',
		status: 'inactive',
		lastLogin: '2024-01-10 09:20:00',
		createdAt: '2024-01-04',
		permissions: ['read'],
	},
	{
		id: 5,
		username: 'testuser',
		email: 'testuser@company.com',
		fullName: 'Test User',
		department: 'Testing',
		role: 'Tester',
		status: 'locked',
		lastLogin: '2024-01-08 16:45:00',
		createdAt: '2024-01-05',
		permissions: ['read'],
	},
];

// Dummy data for roles
const roleData: Role[] = [
	{
		id: 1,
		name: 'Super Admin',
		description: 'Full system access with all permissions',
		permissions: ['all'],
		userCount: 1,
		createdAt: '2024-01-01',
	},
	{
		id: 2,
		name: 'Manager',
		description: 'Department management with approval rights',
		permissions: ['read', 'write', 'approve', 'delete'],
		userCount: 3,
		createdAt: '2024-01-01',
	},
	{
		id: 3,
		name: 'Operator',
		description: 'Standard user with read/write access',
		permissions: ['read', 'write'],
		userCount: 8,
		createdAt: '2024-01-01',
	},
	{
		id: 4,
		name: 'Viewer',
		description: 'Read-only access to assigned modules',
		permissions: ['read'],
		userCount: 5,
		createdAt: '2024-01-01',
	},
	{
		id: 5,
		name: 'Tester',
		description: 'Limited access for testing purposes',
		permissions: ['read'],
		userCount: 2,
		createdAt: '2024-01-01',
	},
];

const UserAccessManagementPage: React.FC = () => {
	const { t } = useTranslation('common');
	const [activeTab, setActiveTab] = useState<'users' | 'roles'>('users');
	const [selectedUser, setSelectedUser] = useState<User | null>(null);
	const [selectedRole, setSelectedRole] = useState<Role | null>(null);
	const [showUserForm, setShowUserForm] = useState(false);
	const [showRoleForm, setShowRoleForm] = useState(false);
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [deleteType, setDeleteType] = useState<'user' | 'role'>('user');
	const [isAddMode, setIsAddMode] = useState(false);

	// User table configuration
	const userColumns = useMemo<ColumnConfig<User>[]>(
		() => [
			{
				accessorKey: 'username',
				header: 'Username',
				size: 120,
				align: 'left' as const,
			},
			{
				accessorKey: 'fullName',
				header: 'Full Name',
				size: 150,
				align: 'left' as const,
			},
			{
				accessorKey: 'email',
				header: 'Email',
				size: 200,
				align: 'left' as const,
			},
			{
				accessorKey: 'department',
				header: 'Department',
				size: 120,
				align: 'left' as const,
			},
			{
				accessorKey: 'role',
				header: 'Role',
				size: 120,
				align: 'left' as const,
				cell: ({ row }: { row: { original: User } }) => (
					<span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
						{row.original.role}
					</span>
				),
			},
			{
				accessorKey: 'status',
				header: 'Status',
				size: 100,
				align: 'left' as const,
				cell: ({ row }: { row: { original: User } }) => {
					const status = row.original.status;
					const statusConfig: Record<string, { color: string; icon: React.ComponentType<{ size?: number | string }> }> = {
						active: {
							color: 'bg-green-100 text-green-800',
							icon: CheckCircle,
						},
						inactive: {
							color: 'bg-gray-100 text-gray-800',
							icon: XCircle,
						},
						locked: {
							color: 'bg-red-100 text-red-800',
							icon: Lock,
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
				accessorKey: 'lastLogin',
				header: 'Last Login',
				size: 150,
				align: 'left' as const,
				cell: ({ row }: { row: { original: User } }) =>
					row.original.lastLogin || 'Never',
			},
			{
				accessorKey: 'permissions',
				header: 'Permissions',
				size: 200,
				align: 'left' as const,
				cell: ({ row }: { row: { original: User } }) => (
					<div className="flex flex-wrap gap-1">
						{row.original.permissions.map((permission: string, index: number) => (
							<span
								key={index}
								className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
							>
								{permission}
							</span>
						))}
					</div>
				),
			},
		],
		[]
	);

	// Role table configuration
	const roleColumns = useMemo<ColumnConfig<Role>[]>(
		() => [
			{
				accessorKey: 'name',
				header: 'Role Name',
				size: 150,
				align: 'left' as const,
			},
			{
				accessorKey: 'description',
				header: 'Description',
				size: 300,
				align: 'left' as const,
			},
			{
				accessorKey: 'permissions',
				header: 'Permissions',
				size: 200,
				align: 'left' as const,
				cell: ({ row }: { row: { original: Role } }) => (
					<div className="flex flex-wrap gap-1">
						{row.original.permissions.map((permission: string, index: number) => (
							<span
								key={index}
								className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700"
							>
								{permission}
							</span>
						))}
					</div>
				),
			},
			{
				accessorKey: 'userCount',
				header: 'Users',
				size: 80,
				align: 'left' as const,
			},
			{
				accessorKey: 'createdAt',
				header: 'Created',
				size: 120,
				align: 'left' as const,
			},
		],
		[]
	);

	const processedUserColumns = useDataTableColumns(userColumns);
	const processedRoleColumns = useDataTableColumns(roleColumns);

	// Handlers for edit and delete operations
	const handleEditUser = () => {
		if (selectedUser) {
			setIsAddMode(false);
			setShowUserForm(true);
		} else {
			toast.warning('Please select a user to edit.');
		}
	};

	const handleDeleteUser = () => {
		if (selectedUser) {
			setDeleteType('user');
			setOpenDeleteDialog(true);
		} else {
			toast.warning('Please select a user to delete.');
		}
	};

	const handleEditRole = () => {
		if (selectedRole) {
			setIsAddMode(false);
			setShowRoleForm(true);
		} else {
			toast.warning('Please select a role to edit.');
		}
	};

	const handleDeleteRole = () => {
		if (selectedRole) {
			setDeleteType('role');
			setOpenDeleteDialog(true);
		} else {
			toast.warning('Please select a role to delete.');
		}
	};

	const handleAddUser = () => {
		setIsAddMode(true);
		setShowUserForm(true);
	};

	const handleAddRole = () => {
		setIsAddMode(true);
		setShowRoleForm(true);
	};

	const handleCloseUserForm = () => {
		setShowUserForm(false);
		setIsAddMode(false);
	};

	const handleCloseRoleForm = () => {
		setShowRoleForm(false);
		setIsAddMode(false);
	};

	const handleDeleteConfirm = () => {
		if (deleteType === 'user' && selectedUser) {
			// Handle user deletion logic here
			toast.success(`User "${selectedUser.username}" has been deleted.`);
			setOpenDeleteDialog(false);
		} else if (deleteType === 'role' && selectedRole) {
			// Handle role deletion logic here
			toast.success(`Role "${selectedRole.name}" has been deleted.`);
			setOpenDeleteDialog(false);
		}
	};

	const {
		table: userTable,
		selectedRows: selectedUsers,
		toggleRowSelection: toggleUserSelection,
	} = useDataTable(
		userData,
		processedUserColumns,
		30,
		0,
		0,
		userData.length,
		undefined
	);

	const {
		table: roleTable,
		selectedRows: selectedRoles,
		toggleRowSelection: toggleRoleSelection,
	} = useDataTable(
		roleData,
		processedRoleColumns,
		30,
		0,
		0,
		roleData.length,
		undefined
	);

	// Track selected rows and update selected items
	useEffect(() => {
		if (selectedUsers.size > 0) {
			const selectedRowIndex = Array.from(selectedUsers)[0];
			const rowIndex: number = parseInt(selectedRowIndex);
			const currentRow: User = userData[rowIndex];
			setSelectedUser(currentRow);
		} else {
			setSelectedUser(null);
		}
	}, [selectedUsers, userData]);

	useEffect(() => {
		if (selectedRoles.size > 0) {
			const selectedRowIndex = Array.from(selectedRoles)[0];
			const rowIndex: number = parseInt(selectedRowIndex);
			const currentRow: Role = roleData[rowIndex];
			setSelectedRole(currentRow);
		} else {
			setSelectedRole(null);
		}
	}, [selectedRoles, roleData]);

	// Chart data for user statistics
	const chartOption = {
		title: {
			text: 'User Distribution by Role',
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
				name: 'Users by Role',
				type: 'pie',
				radius: '50%',
				data: roleData.map((role) => ({
					value: role.userCount,
					name: role.name,
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
				<div className="p-4 rounded-lg border">
					<div className="flex items-center gap-3">
						<Users className="h-8 w-8 text-blue-600" />
						<div>
							<p className="text-sm text-gray-600">Total Users</p>
							<p className="text-2xl font-bold text-gray-900">
								{userData.length}
							</p>
						</div>
					</div>
				</div>
				<div className="p-4 rounded-lg border">
					<div className="flex items-center gap-3">
						<CheckCircle className="h-8 w-8 text-green-600" />
						<div>
							<p className="text-sm text-gray-600">
								Active Users
							</p>
							<p className="text-2xl font-bold text-gray-900">
								{
									userData.filter(
										(user) => user.status === 'active'
									).length
								}
							</p>
						</div>
					</div>
				</div>
				<div className="p-4 rounded-lg border">
					<div className="flex items-center gap-3">
						<Lock className="h-8 w-8 text-red-600" />
						<div>
							<p className="text-sm text-gray-600">
								Locked Users
							</p>
							<p className="text-2xl font-bold text-gray-900">
								{
									userData.filter(
										(user) => user.status === 'locked'
									).length
								}
							</p>
						</div>
					</div>
				</div>
				<div className="p-4 rounded-lg border">
					<div className="flex items-center gap-3">
						<Shield className="h-8 w-8 text-purple-600" />
						<div>
							<p className="text-sm text-gray-600">Total Roles</p>
							<p className="text-2xl font-bold text-gray-900">
								{roleData.length}
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* Chart */}
			<div className="p-4 rounded-lg border">
				<EchartComponent
					options={chartOption}
					styles={{ height: '400px' }}
				/>
			</div>

			{/* Tab Navigation */}
			<div>
				<nav className="flex space-x-1">
					<button
						onClick={() => setActiveTab('users')}
						className={`inline-flex gap-2 items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-foreground hover:bg-[#F5F5F5] dark:hover:bg-[#22262F] ${
							activeTab === 'users'
								? 'bg-[#F5F5F5] dark:bg-[#22262F]'
								: ''
						}`}
					>
						Backup Management
					</button>
					<button
						onClick={() => setActiveTab('roles')}
						className={`inline-flex gap-2 items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-foreground hover:bg-[#F5F5F5] dark:hover:bg-[#22262F] ${
							activeTab === 'roles'
								? 'bg-[#F5F5F5] dark:bg-[#22262F]'
								: ''
						}`}
					>
						Restore Operations
					</button>
				</nav>
			</div>

			<div className="border rounded-lg">
				{activeTab === 'users' && (
					<DatatableComponent
						data={userData}
						table={userTable}
						columns={userColumns}
						tableTitle="User List"
						rowCount={userData.length}
						useSearch={true}
						usePageNation={false}
						toggleRowSelection={toggleUserSelection}
						selectedRows={selectedUsers}
						useEditable={false}
						enableSingleSelect={true}
						actionButtons={
							<div className="flex gap-2">
								<RadixIconButton
									onClick={handleEditUser}
									className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border"
								>
									<Pen size={16} />
									{t('edit')}
								</RadixIconButton>
								<RadixIconButton
									onClick={handleDeleteUser}
									className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border"
								>
									<Trash2 size={16} />
									{t('delete')}
								</RadixIconButton>

								<RadixIconButton
									onClick={handleAddUser}
									className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border bg-Colors-Brand-700 hover:bg-Colors-Brand-800 text-white"
								>
									<UserPlus size={16} />
									Add User
								</RadixIconButton>
							</div>
						}
					/>
				)}

				{activeTab === 'roles' && (
					<DatatableComponent
						data={roleData}
						table={roleTable}
						columns={roleColumns}
						tableTitle="Role Management"
						rowCount={roleData.length}
						useSearch={true}
						usePageNation={false}
						toggleRowSelection={toggleRoleSelection}
						selectedRows={selectedRoles}
						useEditable={false}
						enableSingleSelect={true}
						actionButtons={
							<div className="flex gap-2">
								<RadixIconButton
									onClick={handleEditRole}
									className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border"
								>
									<Pen size={16} />
									{t('edit')}
								</RadixIconButton>
								<RadixIconButton
									onClick={handleDeleteRole}
									className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border"
								>
									<Trash2 size={16} />
									{t('delete')}
								</RadixIconButton>

								<RadixIconButton
									onClick={handleAddRole}
									className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border bg-Colors-Brand-700 hover:bg-Colors-Brand-800 text-white"
								>
									<Key size={16} />
									Add Role
								</RadixIconButton>
							</div>
						}
					/>
				)}
			</div>

			{/* Role Form Modal */}
			<DraggableDialog
				open={showRoleForm}
				onOpenChange={setShowRoleForm}
				title={isAddMode ? 'Add New Role' : 'Edit Role'}
				content={
					<div className="p-6">
						<p className="text-gray-600">
							{isAddMode
								? 'Create a new role with specific permissions.'
								: 'Edit role information and permissions.'}
						</p>
						<div className="mt-4 flex justify-end gap-2">
							<RadixIconButton
								onClick={handleCloseRoleForm}
								className="px-4 py-2 border rounded-lg"
							>
								Close
							</RadixIconButton>
						</div>
					</div>
				}
			/>

			{/* User Form Modal */}
			<DraggableDialog
				open={showUserForm}
				onOpenChange={setShowUserForm}
				title={isAddMode ? 'Add New User' : 'Edit User'}
				content={
					<div className="p-6">
						<p className="text-gray-600">
							{isAddMode
								? 'Create a new user account.'
								: 'Edit user information and permissions.'}
						</p>
						<div className="mt-4 flex justify-end gap-2">
							<RadixIconButton
								onClick={handleCloseUserForm}
								className="px-4 py-2 border rounded-lg"
							>
								Close
							</RadixIconButton>
						</div>
					</div>
				}
			/>

			{/* Delete Confirmation Dialog */}
			<DeleteConfirmDialog
				isOpen={openDeleteDialog}
				onOpenChange={setOpenDeleteDialog}
				onConfirm={handleDeleteConfirm}
				isDeleting={false}
				title={deleteType === 'user' ? 'Delete User' : 'Delete Role'}
				description={
					deleteType === 'user' && selectedUser
						? `Are you sure you want to delete user "${selectedUser.username}"? This action cannot be undone.`
						: deleteType === 'role' && selectedRole
							? `Are you sure you want to delete role "${selectedRole.name}"? This action cannot be undone.`
							: 'Are you sure you want to delete this item? This action cannot be undone.'
				}
			/>
		</div>
	);
};

export default UserAccessManagementPage;
