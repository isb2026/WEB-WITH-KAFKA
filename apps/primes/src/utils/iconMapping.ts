import * as LucideIcons from 'lucide-react';

const iconMap: Record<string, keyof typeof LucideIcons> = {
	// Dashboard & Analytics
	BarChart2: 'BarChart2',
	BarChart3: 'BarChart3',
	BarChart: 'BarChart',
	PieChart: 'PieChart',
	LineChart: 'LineChart',
	Activity: 'Activity',
	TrendingUp: 'TrendingUp',
	TrendingDown: 'TrendingDown',
	Analytics: 'BarChart3',
	Overview: 'Activity',

	// Planning & Scheduling
	Calendar: 'Calendar',
	CalendarCheck: 'CalendarCheck',
	Clock: 'Clock',
	Target: 'Target',
	Planning: 'Target',
	Optimization: 'Zap',

	// Production & Manufacturing
	Factory: 'Factory',
	Settings: 'Settings',
	Zap: 'Zap',
	Cog: 'Cog',
	Production: 'Factory',
	Manufacturing: 'Settings',
	Work: 'Wrench',
	Wrench: 'Wrench',

	// Quality & Inspection
	CheckCircle: 'CheckCircle',
	Shield: 'Shield',
	Eye: 'Eye',
	Search: 'Search',
	Quality: 'Shield',
	Inspection: 'Eye',
	Check: 'CheckCircle',
	Test: 'TestTube',
	TestTube: 'TestTube',

	// Inventory & Warehouse
	Package: 'Package',
	Box: 'Package',
	Truck: 'Truck',
	Warehouse: 'Warehouse',
	Inventory: 'Package',
	Stock: 'Box',
	Delivery: 'Truck',
	Storage: 'Warehouse',

	// Sales & Customer
	Users: 'Users',
	ShoppingCart: 'ShoppingCart',
	FileText: 'FileText',
	FileCheck2: 'FileCheck2',
	Sales: 'ShoppingCart',
	Customer: 'Users',
	Order: 'FileText',
	Invoice: 'Receipt',
	Receipt: 'Receipt',

	// Admin & Management
	UserCog: 'UserCog',
	Key: 'Key',
	Lock: 'Lock',
	Admin: 'UserCog',
	Management: 'Settings',
	Security: 'Shield',
	Access: 'Key',

	// Common Actions
	Plus: 'Plus',
	PlusCircle: 'PlusCircle',
	Edit: 'Edit',
	Trash: 'Trash',
	Download: 'Download',
	Upload: 'Upload',
	Print: 'Printer',
	Printer: 'Printer',
	Save: 'Save',
	Refresh: 'RefreshCw',
	RefreshCw: 'RefreshCw',
	List: 'List',
	Table: 'Table',
	Building: 'Building',
	Monitor: 'Monitor',
	ListTree: 'ListTree',
	Code: 'Code',
	Boxes: 'Boxes',
	User: 'User',
	CalendarDays: 'CalendarDays',
	CalendarDay: 'Calendar',
	ClipboardCheck: 'ClipboardCheck',
	CheckSquare: 'CheckSquare',
	ClipboardList: 'ClipboardList',
	PackageCheck: 'PackageCheck',
	StretchHorizontal: 'StretchHorizontal',
	Bolt: 'Bolt',
	Building2: 'Building2',
	Gauge: 'Gauge',
	Microscope: 'Microscope',
	QrCode: 'QrCode',
	Tag: 'Tag',
	Globe: 'Globe',
	Tool: 'Wrench',
	Inbox: 'Inbox',

	// Navigation
	Home: 'Home',
	ArrowRight: 'ArrowRight',
	ArrowLeft: 'ArrowLeft',
	ChevronRight: 'ChevronRight',
	ChevronLeft: 'ChevronLeft',

	// Status & Feedback
	Success: 'CheckCircle',
	Error: 'XCircle',
	Warning: 'AlertTriangle',
	Info: 'Info',
	XCircle: 'XCircle',
	AlertTriangle: 'AlertTriangle',

	// Data & Files
	Database: 'Database',
	File: 'File',
	Folder: 'Folder',
	Spreadsheet: 'FileSpreadsheet',
	FileSpreadsheet: 'FileSpreadsheet',
	Document: 'FileText',

	// Communication
	Message: 'MessageSquare',
	MessageSquare: 'MessageSquare',
	Mail: 'Mail',
	Phone: 'Phone',
	Chat: 'MessageCircle',
	MessageCircle: 'MessageCircle',

	// Time & Date
	Time: 'Clock',
	Date: 'Calendar',
	History: 'History',
	Timer: 'Timer',

	// Location & Maps
	Map: 'Map',
	MapPin: 'MapPin',
	Navigation: 'Navigation',
	Location: 'MapPin',

	// Finance & Money
	DollarSign: 'DollarSign',
	CreditCard: 'CreditCard',
	Wallet: 'Wallet',
	Banknote: 'Banknote',
	Money: 'DollarSign',

	// Additional mappings for custom or non-Lucide icons
	Input: 'Download',
	InstallMobile: 'Upload',
	BuildCircle: 'Wrench',
	DeleteForever: 'Trash',
	ReportProblem: 'AlertTriangle',
	Undo: 'RotateCcw',
	Label: 'Tag',
	Pause: 'Pause',
	Block: 'Ban',
	Visibility: 'Eye',
	FactCheck: 'ClipboardCheck',
	Assignment: 'ClipboardList',
	AssignmentTurnedIn: 'ClipboardCheck',
	AddTask: 'Plus',
	Today: 'Calendar',
	Checklist: 'ClipboardList',
	ChecklistRtl: 'ClipboardList',
	HowToReg: 'UserCheck',
	Grade: 'Star',
	CalendarMonth: 'Calendar',
	WaterDrop: 'Droplet',
	Schedule: 'Clock',
	PlayArrow: 'Play',
	Tune: 'SlidersHorizontal',
	Build: 'Wrench',
	Server: 'Server',
	Brain: 'Brain',
	Layers2: 'Layers2',
	ChartBarStacked: 'ChartBarStacked',
	ChartBar: 'ChartBar',
	ChartPie: 'ChartPie',
	ChartLine: 'ChartLine',
	// Default fallback
	default: 'Circle',

	// Additional semantic mappings for better icon selection
	대시보드: 'BarChart2',
	개요: 'Activity',
	분석: 'TrendingUp',
	관리: 'Settings',
	목록: 'List',
	상세: 'FileText',
	생성: 'Plus',
	사용자: 'Users',
	공급업체: 'Building',
	품목: 'Package',
	터미널: 'Monitor',
	BOM: 'ListTree',
	코드: 'Code',
	주문: 'ShoppingCart',
	계획: 'Target',
	스케줄링: 'Clock',
	최적화: 'Zap',
	난품: 'Boxes',
	리포트: 'FileText',
	설비: 'Cog',
	라인: 'Settings',
	단말기: 'Monitor',
	관리자: 'User',
	점검: 'ClipboardCheck',
	일일: 'Calendar',
	검사: 'Eye',
	품질: 'Shield',
	구매: 'ShoppingCart',
	판매: 'ShoppingCart',
	생산: 'Factory',
	금형: 'Settings',
	QR: 'QrCode',
	태그: 'Tag',
	국가: 'Globe',
	공장: 'Building',
	도구: 'Wrench',
	KPI: 'Target',
	// Mold-specific icons
	MoldInstance: 'Boxes',
	MoldInout: 'RefreshCw',
	MoldItemRelation: 'ListTree',
};

/**
 * @param iconName
 * @returns
 */
export const getIconComponent = (iconName: string): React.ElementType => {
	const mappedIcon = iconMap[iconName] || iconMap.default;
	return (LucideIcons[mappedIcon] as React.ElementType) || LucideIcons.Circle;
};

/**
 * @param iconName
 * @returns
 */
export const isValidIcon = (iconName: string): boolean => {
	return iconName in LucideIcons;
};

/**
 
 * @returns 
 */
export const getAvailableIcons = (): string[] => {
	return Object.keys(LucideIcons).filter(
		(key) =>
			typeof LucideIcons[key as keyof typeof LucideIcons] === 'function'
	);
};
