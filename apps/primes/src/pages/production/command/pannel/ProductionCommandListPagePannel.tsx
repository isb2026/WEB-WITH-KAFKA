import { TabPanelTemplate } from '@primes/templates/TabPanelTemplate';
import { CommandInfoPage } from '@primes/pages/production/command/pannel/CommandInfoPage';
import { LotInfoPage } from '@primes/pages/production/command/pannel/LotInfoPage';
import { WorkingInfoPage } from '@primes/pages/production/command/pannel/WorkingInfoPage';
import { MoldInfoPage } from '@primes/pages/production/command/pannel/MoldInfoPage';
import { Command } from '@primes/types/production/command';
import { Lot } from '@primes/types/production/lot';
import { MoldInstanceDto } from '@primes/types/mold';
import { useTranslation } from '@repo/i18n';

interface ProductionWorkingListData {
	id: number;
	commandId?: number;
	commandNo?: string;
	commandGroupNo?: string;
	commandProgressSeq?: string;
	workDate?: string;
	shift?: string;
	lotNo?: string;
	itemId?: number;
	itemNo?: number;
	itemName?: string;
	itemNumber?: string;
	itemSpec?: string;
	progressId?: number;
	progressTypeCode?: string;
	progressName?: string;
	machineId?: number;
	machineCode?: string;
	machineName?: string;
	lineNo?: string;
	workAmount?: number;
	workWeight?: number;
	workUnit?: string;
	startTime?: string;
	endTime?: string;
	boxAmt?: number;
	isClose?: boolean;
	isOutsourcing?: boolean;
	outsourcingVendorId?: number;
	outsourcingVendorName?: string;
	jobType?: string;
	badStatusCode?: string;
	badReasonCode?: string;
	workBy?: string;
	inOut?: boolean;
	createdAt?: string;
	updatedAt?: string;
	[key: string]: unknown;
}

interface ProductionCommandListPagePannelProps {
	command?: Command;
	lots?: Lot[];
	workings?: ProductionWorkingListData[];
	molds?: MoldInstanceDto[];
	onClose?: () => void;
}

export const ProductionCommandListPagePannel = ({
	command,
    lots,
    workings,
    molds,
	onClose,
}: ProductionCommandListPagePannelProps) => {
	const { t } = useTranslation('dataTable');

	const tabs = [
		{
			id: 'basicInfo',
			label: t('columns.basicInfo'),
			value: 'basicInfo',
			content: () => <CommandInfoPage command={command} />,
		},
		{
			id: 'lotInfo',
			label: t('columns.lotInfo'),
			value: 'lotInfo',
			content: () => <LotInfoPage lots={lots} />,
		},
		{
			id: 'workingInfo',
			label: t('columns.workingInfo'),
			value: 'workingInfo',
			content: () => <WorkingInfoPage workings={workings} />,
		},
		{
			id: 'moldInfo',
			label: t('columns.moldList'),
			value: 'moldInfo',
			content: () => <MoldInfoPage molds={molds} />,
		},
		{
			id: 'comment',
			label: t('columns.comment'),
			value: 'comment',
			content: () => <div>댓글 내용</div>,
		},
	];

	return (
		<TabPanelTemplate
			isOpen={true}
			tabs={tabs}
			defaultValue="basicInfo"
			isClosing={false}
			header={{
				title: t('columns.commandNo'),
				subtitle: command?.commandNo,
				onClose: onClose,
				showCloseButton: !!onClose,
			}}
		/>
	);
};
