import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useTranslation } from '@repo/i18n';
import { DynamicForm } from '@primes/components/form/DynamicFormComponent';
import {
	NotworkMasterFieldSelect,
	NotworkDetailFieldSelect,
} from '@primes/components/production/notwork';

// Types
import { NotworkMaster, NotworkDetail } from '@primes/types/production/notwork';

// Schemas
import {
	notworkMasterFormSchema,
	notworkDetailFormSchema,
} from '@primes/schemas/production';

interface ProductionNotworkRegisterPageProps {
	mode: 'create' | 'edit';
	type: 'master' | 'detail';
	data?: NotworkMaster | NotworkDetail | null;
	masterId?: number; // Detail 생성 시 필요
	onSubmit: (data: Record<string, unknown>) => void;
	onClose?: () => void;
	onFormReady?: (methods: UseFormReturn<Record<string, unknown>>) => void;
}

export const ProductionNotworkRegisterPage: React.FC<
	ProductionNotworkRegisterPageProps
> = ({ mode, type, data, masterId, onSubmit, onFormReady }) => {
	const { t: tCommon } = useTranslation('common');

	// 스키마 선택
	const formSchema =
		type === 'master' ? notworkMasterFormSchema : notworkDetailFormSchema;

	// 기본값 설정
	const getDefaultValues = () => {
		if (mode === 'edit' && data) {
			return data as unknown as Record<string, unknown>;
		}

		// 새로 생성할 때 기본값
		if (type === 'detail' && masterId) {
			return {
				notworkMasterId: masterId,
			};
		}

		return {};
	};

	// Form Submit Handler
	const handleSubmit = (formData: Record<string, unknown>) => {
		// Detail 생성 시 masterId 자동 추가
		if (type === 'detail' && masterId) {
			formData.notworkMasterId = masterId;
		}

		onSubmit(formData);
	};

	// otherTypeElements 설정 (Field API 기반 Custom Select)
	const otherTypeElements: Record<string, React.ElementType> =
		type === 'master'
			? {
					// Master용 Field Select 컴포넌트들
					notworkMachineCodeSelect: (props: any) => (
						<NotworkMasterFieldSelect
							{...props}
							fieldKey="machineCode"
							placeholder="장비코드를 선택하세요"
						/>
					),
					notworkMachineNameSelect: (props: any) => (
						<NotworkMasterFieldSelect
							{...props}
							fieldKey="machineName"
							placeholder="장비명을 선택하세요"
						/>
					),
				}
			: {
					// Detail용 Field Select 컴포넌트들
					notworkCodeSelect: (props: any) => (
						<NotworkDetailFieldSelect
							{...props}
							fieldKey="notworkCode"
							placeholder="비가동 코드를 선택하세요"
						/>
					),
					notworkNameSelect: (props: any) => (
						<NotworkDetailFieldSelect
							{...props}
							fieldKey="notworkName"
							placeholder="비가동명을 선택하세요"
						/>
					),
					notworkReasonCodeSelect: (props: any) => (
						<NotworkDetailFieldSelect
							{...props}
							fieldKey="notworkReasonCode"
							placeholder="비가동 사유코드를 선택하세요"
						/>
					),
				};

	return (
		<DynamicForm
			fields={formSchema}
			initialData={getDefaultValues()}
			onSubmit={handleSubmit}
			onFormReady={onFormReady}
			otherTypeElements={otherTypeElements}
			submitButtonText={
				mode === 'edit'
					? tCommon('update', '수정')
					: tCommon('register', '등록')
			}
		/>
	);
};
