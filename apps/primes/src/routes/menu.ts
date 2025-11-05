// menus.ts
import { MenuType, ServiceType } from '@primes/types/menus';
import { InitServiceMenus } from './iniRoute';
import { SalesServiceMenus } from './salesRoute';
import { PurchaseServiceMenus } from './PurchaseRoute';
import { ProductionServiceMenus } from './ProductionRoute';
import { MoldServiceMenus } from './MoldRoute';
import { MachineServiceMenus } from './MachineRoute';
// import { QmsServiceMenus } from './QmsRoute'; // 임시 주석처리
import { QualityServiceMenus } from './QualityRoute';
import { OutsourcingServiceMenus } from './OutsourcingRoute';
// import { EquipmentServiceMenus } from './equipmentRoute';
// import { MeasurementServiceMenus } from './measurementRoute';

export const PrimesMenus: (MenuType | { type: 'divider' })[] = [
	InitServiceMenus,
	SalesServiceMenus,
	PurchaseServiceMenus,
	ProductionServiceMenus,
	QualityServiceMenus,
	OutsourcingServiceMenus,
	MoldServiceMenus,
	// QmsServiceMenus, // 임시 주석처리
	MachineServiceMenus,
	// EquipmentServiceMenus,
	// MeasurementServiceMenus,
];

/** Helper: strip dividers so Services.menus is always MenuType[] */
const onlyMenus = (arr: (MenuType | { type: 'divider' })[]): MenuType[] =>
	arr.filter((x): x is MenuType => !('type' in x));

/** All current menus belong to the PRIMES service. Others exist but are empty for now. */
export const Services: ServiceType[] = [
	{
		id: 'primes',
		label: 'services.primes',
		desc: 'services.primesDesc',
		icon: 'Layers2',
		menus: onlyMenus(PrimesMenus),
	},
	{
		id: 'spc',
		label: 'services.spc',
		desc: 'services.spcDesc',
		icon: 'ChartBarStacked',
		menus: [],
	},
	{
		id: 'aps',
		label: 'services.aps',
		desc: 'services.apsDesc',
		icon: 'Calendar',
		menus: [],
	},
	{
		id: 'erp',
		label: 'services.erp',
		desc: 'services.erpDesc',
		icon: 'Server',
		menus: [],
	},
	{
		id: 'wms',
		label: 'services.wms',
		desc: 'services.wmsDesc',
		icon: 'Box',
		menus: [],
	},
	{
		id: 'scm',
		label: 'services.scm',
		desc: 'services.scmDesc',
		icon: 'Truck',
		menus: [],
	},
	{
		id: 'pms',
		label: 'services.pms',
		desc: 'services.pmsDesc',
		icon: 'Folder',
		menus: [],
	},
	{
		id: 'plm',
		label: 'services.plm',
		desc: 'services.plmDesc',
		icon: 'Document',
		menus: [],
	},
	{
		id: 'ai',
		label: 'services.ai',
		desc: 'services.aiDesc',
		icon: 'Brain',
		menus: [],
	},
	{
		id: 'digitalTwin',
		label: 'services.digitalTwin',
		desc: 'services.digitalTwinDesc',
		icon: 'Factory',
		menus: [],
	},
	{
		id: 'groupware',
		label: 'services.groupware',
		desc: 'services.groupwareDesc',
		icon: 'Users',
		menus: [],
	},
];
