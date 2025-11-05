import { useEffect, useRef, useState } from 'react';
import {
	DynamicForm,
	FormField,
} from '@primes/components/form/DynamicFormComponent';
import { FileUploadComponent } from '@primes/components/form/FileUploadComponent';
import { useCreateVendor } from '@primes/hooks/init/vendor/useCreateVendor';
import { useUpdateVendor } from '@primes/hooks/init/vendor/useUpdateVendor';
import { CodeSelectComponent } from '@primes/components/customSelect/CodeSelectComponent';
import { useTranslation } from '@repo/i18n';
import { createVendorPayload } from '@primes/types/vendor';
import { useFileUpload } from '@primes/hooks/common/useFileUpload';

interface IniVendorRegisterPageProps {
	vendorData?: any;
	onSubmit?: (id: number, data: any) => void;
	onClose?: () => void;
	mode?: 'create' | 'edit';
	initialData?: any; // 수정 모드일 때 기존 데이터
}

export const IniVendorRegisterPage = ({
	vendorData,
	onClose,
	mode = 'create',
	initialData,
}: IniVendorRegisterPageProps) => {
	const { t } = useTranslation('dataTable');
	const create = useCreateVendor();
	const update = useUpdateVendor();
	const { handleFileUpload } = useFileUpload();

	// defaultValue 제거하고 formMethods 사용
	const [formMethods, setFormMethods] = useState<any>(null);

	const handleFormReady = (methods: any) => {
		setFormMethods(methods);
	};

	// useEffect를 사용하여 수정 모드일 때만 폼 초기화
	useEffect(() => {
		if (mode === 'edit' && initialData && formMethods) {
			// IniCodeRegisterPage와 동일한 패턴으로 수정
			formMethods.reset(initialData); // ← 전체 객체를 그대로 전달
			
			// Add a small delay to ensure the form is properly initialized
			setTimeout(() => {
				// Specifically set the compType value to ensure it's properly set
				if (initialData.compType) {
					formMethods.setValue('compType', initialData.compType);
					
					// Force trigger to update the component
					formMethods.trigger('compType');
				}
			}, 100);
		}
	}, [mode, initialData, formMethods, vendorData]);

	// 수정 모드일 때 기존 데이터를 기본값으로 설정
	const vendorFormSchema: FormField[] = [
		// 1. Company Name (Required / Check for Duplicates)
		{
			name: 'compName',
			label: t('columns.compName'),
			type: 'text',
			placeholder: '거래처명을 입력해주세요',
			formatMessage: '거래처 명을 입력해주세요',
			required: true,
			defaultValue: vendorData?.compName,
		},
		// 2. Company Type (Optional)
		{
			name: 'compType',
			label: t('columns.compType'),
			type: 'compType',
			required: false,
			placeholder: '선택하세요',
			fieldKey: 'COM-006',
			valueKey: 'codeValue',
			defaultValue: vendorData?.compType,
		},
		// 3. Business Registration Number (Check for Duplicates)
		{
			name: 'licenseNo',
			label: t('columns.licenseNo'),
			type: 'text',
			placeholder: '000-00-00000',
			// Temporarily remove pattern and mask to test if they're causing the issue
			// pattern: /^\d{3}-\d{2}-\d{5}$/,
			// formatMessage: '형식: 000-00-00000',
			// mask: '999-99-99999',
			defaultValue: vendorData?.licenseNo,
		},
		// 4. CEO Name
		{
			name: 'ceoName',
			label: t('columns.ceoName'),
			type: 'text',
			placeholder: '대표자명을 입력해주세요',
			defaultValue: vendorData?.ceoName,
		},
		// 5. Email (Required)
		{
			name: 'compEmail',
			label: t('columns.compEmail'),
			type: 'email',
			placeholder: '이메일을 입력해주세요',
			required: true,
			defaultValue: vendorData?.compEmail,
		},
		// 6. Phone Number (Required)
		{
			name: 'telNumber',
			label: t('columns.telNumber'),
			type: 'tel',
			placeholder: '000-0000-0000',
			pattern: /^\d{2,3}-\d{3,4}-\d{4}$/,
			formatMessage: '형식: 000-0000-0000',
			maskAutoDetect: true,
			required: true,
			defaultValue: vendorData?.telNumber,
		},
		// 7. Fax Number
		{
			name: 'faxNumber',
			label: t('columns.faxNumber'),
			type: 'tel',
			placeholder: '000-0000-0000',
			pattern: /^\d{2,3}-\d{3,4}-\d{4}$/,
			formatMessage: '형식: 000-0000-0000',
			maskAutoDetect: true,
		},
		// 8. Business Type
		{
			name: 'businessType',
			label: t('columns.businessType'),
			type: 'text',
			placeholder: '업종을 입력해주세요',
		},
		// 9. Industry
		{
			name: 'industry',
			label: t('columns.industry'),
			type: 'text',
			placeholder: '산업을 입력해주세요',
		},
		// 10. Address 1
		{
			name: 'zipCode',
			label: t('columns.zipCode'),
			type: 'text',
			maxLength: 5,
			placeholder: '우편번호를 입력해주세요',
			pattern: /^\d{5}$/,
			formatMessage: '5자리 숫자만 입력 가능합니다',
		},
		{
			name: 'addressMst',
			label: t('columns.addressMst'),
			type: 'text',
			placeholder: '주소를 입력해주세요',
			required: false,
		},
		// 11. Address 2
		{
			name: 'addressDtl',
			label: t('columns.addressDtl'),
			type: 'text',
			placeholder: '상세주소를 입력하세요',
			required: false,
		},
		// 12. Memo
		{
			name: 'memo',
			label: t('columns.memo'),
			type: 'text',
			placeholder: '메모를 입력해주세요',
		},
		// 13. Usage Status
		{
			name: 'usageStatus',
			label: t('columns.usageStatus'),
			type: 'select',
			placeholder: '사용상태를 선택해주세요',
			options: [
				{ value: 'ACTIVE', label: '사용' },
				{ value: 'INACTIVE', label: '미사용' },
			],
			defaultValue: 'ACTIVE',
		},
		// 14. Add File
		{
			name: 'attachments',
			label: t('columns.attachments'),
			type: 'fileUpload',
			placeholder: '파일을 첨부해주세요',
		},
	];

	const handleSubmit = (data: createVendorPayload) => {
		// 데이터가 비어있는지 확인
		if (!data || Object.keys(data).length === 0) {
			alert('폼 데이터가 비어있습니다. 다시 시도해주세요.');
			return;
		}

		// 서비스 레이어에서 cleanedParams 처리를 하므로 데이터를 그대로 전송
		// addressSearch는 UI용이므로 제외
		const {
			compName,
			compType,
			ceoName,
			licenseNo,
			compEmail,
			telNumber,
			faxNumber,
			businessType,
			industry,
			zipCode,
			addressDtl,
			addressMst,
			memo,
			usageStatus,
			attachments,
		} = data;

		const submitData = {
			compName: compName || '', // 필수 필드
			compType: compType || '', // 선택 필드
			ceoName: ceoName || '',
			licenseNo: licenseNo || '',
			compEmail: compEmail || '', // 필수 필드
			telNumber: telNumber || '', // 필수 필드
			faxNumber: faxNumber || '',
			businessType: businessType || '',
			industry: industry || '',
			zipCode: zipCode || '',
			addressDtl: addressDtl || '',
			addressMst: addressMst || '',
			memo: memo || '',
			usageStatus: usageStatus || 'ACTIVE',
			attachments: attachments || [],
			isUse: usageStatus === 'ACTIVE', // Usage Status에 따라 설정
		};

		// 수정 모드인지 생성 모드인지에 따라 다른 API 호출
		if (mode === 'edit' && initialData?.id) {
			// 수정 모드
			update.mutate(
				{
					id: initialData.id,
					data: submitData,
				},
				{
					onSuccess: (response) => {
						if (onClose) onClose();
					},
					onError: (error) => {
						console.error('Vendor 수정 오류:', error);
					},
				}
			);
		} else {
			// 생성 모드
			create.mutate(
				{ dataList: [submitData] as any },
				{
					onSuccess: (response) => {
						if (onClose) onClose();
					},
					onError: (error) => {
						console.error('Vendor 생성 오류:', error);
					},
				}
			);
		}
	};

	// Prepare the initial data with proper structure
	const formInitialData = mode === 'edit' && initialData ? {
		...initialData,
		compType: initialData.compType || vendorData?.compType,
	} : undefined;

	return (
		<div className="max-w-full mx-auto">
			<DynamicForm
				fields={vendorFormSchema}
				onSubmit={handleSubmit}
				otherTypeElements={{
					compType: CodeSelectComponent,
					fileUpload: (props: any) => (
						<FileUploadComponent
							{...props}
							maxFiles={5}
							maxFileSize={10}
							accept="image/*"
							handleFileUpload={handleFileUpload}
						/>
					),
				}}
				onFormReady={handleFormReady}
				initialData={formInitialData}
			/>
		</div>
	);
};
