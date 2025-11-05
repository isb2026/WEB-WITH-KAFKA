import { TabPanelTemplate } from '@primes/templates/TabPanelTemplate';
import { VendorDto } from '@primes/types/vendor';
import { IniVendorDetailPage } from './iniVendorDetailPage';
import { IniVendorChargerInfoPage } from './IniVendorChargerInfoPage';
import { IniVendorAccountPage } from './IniVendroAccountPage';

interface IniVendorListPagePannelProps {
	vendor: VendorDto;
	onClose?: () => void;
}

export const IniVendorListPagePannel = ({
	vendor,
	onClose,
}: IniVendorListPagePannelProps) => {
	const tabs = [
		{
			id: 'basicInfo',
			label: '기본정보',
			value: 'basicInfo',
			content: () => <IniVendorDetailPage vendor={vendor} />,
		},
		{
			id: 'contactInfo',
			label: '담당자 정보',
			value: 'contactInfo',
			content: () => <IniVendorChargerInfoPage vendor={vendor} />,
		},

		{
			id: 'accountInfo',
			label: '계좌정보',
			value: 'accountInfo',
			content: () => <IniVendorAccountPage vendor={vendor} />,
		},
		// {
		// 	id: 'comment',
		// 	label: '댓글',
		// 	value: 'comment',
		// 	content: () => <div>댓글</div>,
		// },
	];
	return (
		<TabPanelTemplate
			isOpen={true}
			tabs={tabs}
			defaultValue="basicInfo"
			isClosing={false}
			header={{
				title: vendor?.compName,
				subtitle: vendor?.compCode,
				onClose: onClose,
				showCloseButton: !!onClose,
			}}
		/>
	);
};
