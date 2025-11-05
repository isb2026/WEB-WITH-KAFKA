import { VendorDto } from '@primes/types/vendor';
import { InfoGrid } from '@primes/components/common/InfoGrid';
import { useTranslation } from '@repo/i18n';
interface IniVendorDetailPageProps {
	vendor: VendorDto;
}
export const IniVendorDetailPage = ({ vendor }: IniVendorDetailPageProps) => {
	const { t } = useTranslation('dataTable');

	const VendorInfoGridKeys = [
		{ key: 'compCode', label: t('columns.compCode') },
		{ key: 'compTypeName', label: t('columns.compType') },
		{ key: 'compName', label: t('columns.compName') },
		{ key: 'licenseNo', label: t('columns.licenseNo') },
		{ key: 'ceoName', label: t('columns.ceoName') },
		{ key: 'compEmail', label: t('columns.compEmail') },
		{ key: 'telNumber', label: t('columns.telNumber') },
		{ key: 'faxNumber', label: t('columns.faxNumber') },
		{ key: 'zipCode', label: t('columns.zipcode') },
		{ key: 'addressMst', label: t('columns.address') },
		{ key: 'addressDtl', label: t('columns.addressDetail') },
		{ key: 'isUse', label: t('columns.isUse') },
		{
			key: 'systemInfo',
			label: '등록 정보',
			template: '[{createdBy}] {createdAt}',
		},
		{
			key: 'updateInfo',
			label: '수정 정보',
			template: '[{updatedBy}] {updatedAt}',
		},
	];

	return (
		<InfoGrid
			columns="grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3"
			classNames={{
				container: 'rounded shadow-sm h-full',
				item: 'flex gap-2 items-center p-2',
				label: 'text-gray-700 text-sm',
				value: 'font-bold text-xs',
			}}
			maxHeight="100%"
			data={vendor as any}
			keys={VendorInfoGridKeys}
			systemFields={['systemInfo', 'updateInfo']}
			systemColumns="grid-cols-2"
		/>
	);
};
