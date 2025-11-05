import { TabPanelTemplate } from '@primes/templates/TabPanelTemplate';
import { Item } from '@primes/types/item';
import { IniItemDesignPage } from './IniItemDesignPage';
import { IniItemDetailInfoPage } from './IniItemDetailInfoPage';
import { IniItemProgressPage } from './IniItemProgressPage';
import { IniItemCheckListPage } from './IniItemCheckListPage';
import { IniItemMoldInfoPage } from './IniItemMoldInfoPage';
import { IniItemStockInfoPage } from './IniItemStockInfoPage';
import { useTranslation } from '@i18n/index';

interface IniItemListPagePannelProps {
	item?: Item;
	onClose?: () => void;
}

export const IniItemListPagePannel = ({
	item,
	onClose,
}: IniItemListPagePannelProps) => {
	const { t } = useTranslation('dataTable');

	const tabs = [
		{
			id: 'basicInfo',
			label: t('columns.basicInfo'),
			value: 'basicInfo',
			content: () => <IniItemDetailInfoPage item={item} />,
		},
		{
			id: 'progressInfo',
			label: t('columns.progressInfo'),
			value: 'progressInfo',
			content: () => <IniItemProgressPage item={item} />,
		},
		{
			id: 'checkList',
			label: t('columns.checkList'),
			value: 'checkList',
			content: () => <IniItemCheckListPage item={item} />,
		},

		{
			id: 'moldList',
			label: t('columns.moldList'),
			value: 'moldList',
			content: () => <IniItemMoldInfoPage item={item} />,
		},
		{
			id: 'stockInfo',
			label: t('columns.stockInfo'),
			value: 'stockInfo',
			content: () => <IniItemStockInfoPage item={item} />,
		},
		{
			id: 'designInfo	',
			label: t('columns.designInfo'),
			value: 'designInfo',
			content: () => <IniItemDesignPage />,
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
				title: item?.itemName,
				subtitle: item?.itemNumber,
				onClose: onClose,
				showCloseButton: !!onClose,
			}}
		/>
	);
};
