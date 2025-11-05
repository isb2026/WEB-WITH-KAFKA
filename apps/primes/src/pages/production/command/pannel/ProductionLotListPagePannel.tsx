import { TabPanelTemplate } from '@primes/templates/TabPanelTemplate';
import { LotInfoPage } from '@primes/pages/production/command/pannel/LotInfoPage';
import { WorkingInfoPage } from '@primes/pages/production/command/pannel/WorkingInfoPage';
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

interface ProductionLotListPagePannelProps {
	lots?: Lot[];
	workings?: ProductionWorkingListData[];
	molds?: MoldInstanceDto[];
	onClose?: () => void;
}

export const ProductionLotListPagePannel = ({
	lots,
    workings,
    molds,
	onClose,
}: ProductionLotListPagePannelProps) => {
	const { t } = useTranslation('dataTable');

	const tabs = [
		{
			id: 'basicInfo',
			label: t('columns.basicInfo'),
			value: 'basicInfo',
			content: () => <LotInfoPage lots={lots} />,
		},
		{
			id: 'workingInfo',
			label: t('columns.workingInfo'),
			value: 'workingInfo',
			content: () => <WorkingInfoPage workings={workings} />,
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
				title: t('columns.lotNo'),
				subtitle: lots?.[0]?.lotNo,
				onClose: onClose,
				showCloseButton: !!onClose,
			}}
		/>
	);
};
