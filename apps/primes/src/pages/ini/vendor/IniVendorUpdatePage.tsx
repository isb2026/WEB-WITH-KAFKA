import { useEffect, useRef, useState } from 'react';
import {
	DynamicForm,
	FormField,
} from '@primes/components/form/DynamicFormComponent';
import { updateVendorPayload } from '@primes/types/vendor';
import { useTranslation } from '@repo/i18n';
import { CodeSelectComponent } from '@primes/components/customSelect/CodeSelectComponent';
import { UseFormReturn } from 'react-hook-form';
import { useUpdateVendor } from '@primes/hooks';

interface IniVendorUpdatePageProps {
	vendorData?: any;
	onSubmit?: (id: number, data: any) => void;
	onClose?: () => void;
}

export const IniVendorUpdatePage = ({
	vendorData,
	onClose,
}: IniVendorUpdatePageProps) => {
	const { t } = useTranslation('dataTable');
	const formMethodsRef = useRef<UseFormReturn<
		Record<string, unknown>
	> | null>(null);
	const [formMethods, setFormMethods] = useState<UseFormReturn<
		Record<string, unknown>
	> | null>(null);
	const vendorFormSchema: FormField[] = [
		{
			name: 'compName',
			label: t('columns.compName'),
			type: 'text',
			placeholder: '거래처명을 입력해주세요',
			formatMessage: '거래처 명을 입력해주세요',
			required: true,
			defaultValue: vendorData?.compName,
		},
		{
			name: 'compCode',
			label: t('columns.compCode'),
			type: 'text',
			placeholder: '거래처 코드를 입력하세요',
			required: true,
			defaultValue: vendorData?.compCode,
		},
		{
			name: 'compType',
			label: t('columns.compType'),
			type: 'compType',
			required: true,
			placeholder: '선택하세요',
			fieldKey: 'COM-006',
			defaultValue: vendorData?.compType?.toString(),
		},
		{
			name: 'ceoName',
			label: t('columns.ceoName'),
			type: 'text',
			placeholder: '대표자명을 입력해주세요',
			defaultValue: vendorData?.ceoName,
		},
		{
			name: 'licenseNo',
			label: t('columns.licenseNo'),
			type: 'text',
			placeholder: '000-00-00000',
			pattern: /^\d{3}-\d{2}-\d{5}$/,
			formatMessage: '형식: 000-00-00000',
			mask: '999-99-99999',
			defaultValue: vendorData?.licenseNo,
		},
		{
			name: 'compEmail',
			label: t('columns.compEmail'),
			type: 'email',
			placeholder: '입력해주세요',
			defaultValue: vendorData?.compEmail,
		},
		{
			name: 'telNumber',
			label: t('columns.telNumber'),
			type: 'tel',
			placeholder: '000-0000-0000',
			pattern: /^\d{2,3}-\d{3,4}-\d{4}$/,
			formatMessage: '형식: 000-0000-0000',
			maskAutoDetect: true,
			defaultValue: vendorData?.telNumber,
		},
		{
			name: 'faxNumber',
			label: t('columns.faxNumber'),
			type: 'tel',
			placeholder: '000-0000-0000',
			pattern: /^\d{2,3}-\d{3,4}-\d{4}$/,
			formatMessage: '형식: 000-0000-0000',
			maskAutoDetect: true,
			defaultValue: vendorData?.faxNumber,
		},
		{
			name: 'zipCode',
			label: t('columns.zipCode'),
			type: 'text',
			placeholder: '우편번호를 입력해주세요',
			defaultValue: vendorData?.zipCode,
		},
		{
			name: 'addressMst',
			label: t('columns.address'),
			type: 'text',
			placeholder: '소재지를 입력해주세요',
			defaultValue: vendorData?.addressMst,
		},
		{
			name: 'addressDtl',
			label: t('columns.addressDetail'),
			type: 'text',
			placeholder: '상세 주소를 입력해주세요',
			defaultValue: vendorData?.addressDtl,
		},
	];
	const { mutate: updateVendor } = useUpdateVendor();

	const handleFormReady = (
		methods: UseFormReturn<Record<string, unknown>>
	) => {
		formMethodsRef.current = methods;
		setFormMethods(methods);
	};

	const handleSubmit = (data: Partial<updateVendorPayload>) => {
		// Call onSubmit and then close the dialog
		updateVendor({ id: vendorData.id, data });
		if (onClose) onClose();
	};

	useEffect(() => {
		console.log('vendorData', vendorData);
		if (formMethods && vendorData) {
			formMethods.reset(vendorData);
		}
	}, [vendorData, formMethods]);

	return (
		<div className="max-w-full mx-auto">
			<DynamicForm
				fields={vendorFormSchema}
				onSubmit={handleSubmit}
				otherTypeElements={{
					compType: CodeSelectComponent,
				}}
				onFormReady={handleFormReady}
			/>
		</div>
	);
};
