import { useState, useEffect } from 'react';
import {
	DynamicForm,
	FormField,
} from '@primes/components/form/DynamicFormComponent';
import { useTranslation } from '@repo/i18n';
import {
	CodeSelectComponent,
	BinaryToggleComponent,
	ProgressTypeCodeSelectComponent,
} from '@primes/components/customSelect';
import { useProgress } from '@primes/hooks';
import { getItemProgressFormSchema } from '@primes/schemas/ini/itemProgressSchemas';

interface IniItemProgressRegisterPageProps {
	onClose?: () => void;
	mode?: 'create' | 'update';
	selectedProgress?: any;
	productId: string;
	progressData?: any;
	onSuccess?: () => void;
}

interface IniItemProgressRegisterData {
	[key: string]: any;
}

export const IniItemProgressRegisterPage: React.FC<
	IniItemProgressRegisterPageProps
> = ({
	onClose,
	mode,
	selectedProgress,
	productId,
	progressData,
	onSuccess,
}) => {
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

	const [isOutsourcing, setIsOutsourcing] = useState<boolean>(false);
	const [formMethods, setFormMethods] = useState<any>(null);
	const { t } = useTranslation('dataTable');
	const { create, update } = useProgress({
		page: 0,
		size: 30,
		searchRequest: {
			itemId: Number(productId?.trim()),
		},
	});

	// 폼 메서드가 준비되면 watch를 설정
	const handleFormReady = (methods: any) => {
		setFormMethods(methods);

		// Debug: Monitor form state changes
		const subscription = methods.watch((value: any, { name }: any) => {
			if (name === 'isOutsourcing') {
				setIsOutsourcing(value.isOutsourcing === 'true');
			}
			// progressTypeCode와 unitTypeCode는 이제 Select 컴포넌트에서 직접 처리
		});
		return () => subscription.unsubscribe();
	};

	// 스키마에서 폼 필드 정의 가져오기 (번역 적용)
	const formSchema = getItemProgressFormSchema(t);

	const handleSubmit = async (
		data: IniItemProgressRegisterData,
		event?: React.BaseSyntheticEvent
	) => {
		if (isSubmitting) return;
		setIsSubmitting(true);
		if (mode === 'create') {
			try {
				// Map form data to backend schema field names
				const {
					progressSequence,
					progressTypeCode,
					progressTypeName,
					progressName,
					lotSize,
					defaultCycleTime,
					progressDefaultSpec,
					safetyProgressInventoryQty,
					keyManagementContents,
					lotUnit,
					optimalProgressInventoryQty,
					unitTypeCode,
					unitTypeName,
					unitWeight,
					// Frontend-only fields (not sent to backend for now)
					processUnitPrice,
					cumulativeUnitPrice,
					inspectionRequired,
					fileAttachment,
				} = data;

				// Clean up: Remove excessive logging, focus on core issue
				console.log('🔍 Submit Data Check:', {
					progressTypeCode: progressTypeCode || 'MISSING',
					progressSequence: progressSequence,
					progressName: progressName,
				});

				// Validate and clean numeric inputs
				const cleanProgressSequence =
					progressSequence &&
					typeof progressSequence === 'string' &&
					progressSequence.trim() !== '' &&
					!isNaN(Number(progressSequence))
						? Number(progressSequence)
						: undefined;

				const cleanLotSize =
					lotSize &&
					typeof lotSize === 'string' &&
					lotSize.trim() !== '' &&
					!isNaN(Number(lotSize))
						? Number(lotSize)
						: undefined;

				const cleanDefaultCycleTime =
					defaultCycleTime &&
					typeof defaultCycleTime === 'string' &&
					defaultCycleTime.trim() !== '' &&
					!isNaN(Number(defaultCycleTime))
						? Number(defaultCycleTime)
						: undefined;

				const submitData = {
					itemId: Number(productId), // 필수: 아이템 ID
					progressOrder:
						cleanProgressSequence &&
						cleanProgressSequence > 0 &&
						cleanProgressSequence < 1000
							? cleanProgressSequence
							: undefined,
					progressTypeCode: progressTypeCode || '',
					progressTypeName: progressTypeName || '', // 선택된 옵션의 label 값
					progressName: progressName || '',
					lotSize: cleanLotSize,
					lotUnit: lotUnit || '',
					defaultCycleTime: cleanDefaultCycleTime,
					optimalProgressInventoryQty: optimalProgressInventoryQty
						? Number(optimalProgressInventoryQty)
						: undefined,
					safetyProgressInventoryQty: safetyProgressInventoryQty
						? Number(safetyProgressInventoryQty)
						: undefined,
					progressDefaultSpec: progressDefaultSpec || '',
					keyManagementContents: keyManagementContents || '',
					unitTypeCode: unitTypeCode || '',
					unitTypeName: unitTypeName || '', // 선택된 옵션의 label 값
					unitWeight: unitWeight ? Number(unitWeight) : undefined,
				};

				console.log('🚀 Final Submit Data:', submitData);

				// 서비스에서 기대하는 형식으로 전달 (단일 객체)
				create.mutate(
					{
						data: submitData,
					},
					{
						onSuccess: () => {
							onSuccess?.();
						},
					}
				);
			} catch (error) {
				// 오류 처리는 React Query에서 자동으로 처리됨
			} finally {
				setIsSubmitting(false);
			}
		} else if (mode === 'update' && progressData) {
			try {
				const {
					progressOrder,
					progressName,
					progressTypeCode,
					progressTypeName,
					unitTypeCode,
					unitTypeName,
					unitWeight,
					isOutsourcing,
					defaultCycleTime,
					optimalProgressInventoryQty,
					safetyProgressInventoryQty,
				} = data;

				const updateData = {
					...data,
					progressOrder: progressOrder
						? Number(progressOrder)
						: undefined,
					progressName:
						progressName || progressData?.progressName || '',
					progressTypeCode: progressTypeCode || '',
					progressTypeName: progressTypeName || '',
					unitTypeCode: unitTypeCode || '',
					unitTypeName: unitTypeName || '',
					unitWeight: unitWeight ? Number(unitWeight) : undefined,
					isOutsourcing: isOutsourcing === 'true',
					defaultCycleTime: Number(defaultCycleTime) || undefined,
					optimalProgressInventoryQty:
						Number(optimalProgressInventoryQty) || undefined,
					safetyProgressInventoryQty:
						Number(safetyProgressInventoryQty) || undefined,
				};

				update.mutate(
					{
						id: progressData.id,
						data: updateData,
					},
					{
						onSuccess: () => {
							onSuccess?.();
						},
					}
				);
			} catch (error) {
				// 오류 처리는 React Query에서 자동으로 처리됨
			} finally {
				setIsSubmitting(false);
			}
		}
	};

	const handleCancel = () => {
		onClose && onClose();
	};

	useEffect(() => {
		if (formMethods && mode === 'update' && progressData) {
			formMethods.reset({
				...progressData,
				// Map backend progressOrder to frontend progressSequence field
				progressSequence:
					progressData?.progressOrder ||
					progressData?.progressSequence,
				progressTypeCode: progressData?.progressTypeCode,
				progressTypeName: progressData?.progressTypeName || '',
				// Initialize progressName from backend data (prefer progressName)
				progressName:
					progressData?.progressName ||
					progressData?.progressTypeName ||
					'',
				unitTypeCode: progressData?.unitTypeCode || '',
				unitTypeName: progressData?.unitTypeName || '',
				unitWeight: progressData?.unitWeight || '',
				lotSize: progressData?.lotSize,
				defaultCycleTime: progressData?.defaultCycleTime,
				progressDefaultSpec: progressData?.progressDefaultSpec,
				optimalProgressInventoryQty:
					progressData?.optimalProgressInventoryQty,
				safetyProgressInventoryQty:
					progressData?.safetyProgressInventoryQty,
				keyManagementContents: progressData?.keyManagementContents,
				// Frontend-only fields (set to default values for now)
				processUnitPrice: 0,
				cumulativeUnitPrice: 0,
				inspectionRequired: 'false',
				fileAttachment: null,
			});
			formMethods.setValue(
				'progressTypeCode',
				progressData?.progressTypeCode
			);
			formMethods.setValue('unitTypeCode', progressData?.unitTypeCode);
		}
	}, [progressData, formMethods, mode]);

	return (
		<div className="max-w-full mx-auto">
			<div className="max-h-[70vh] overflow-y-auto pr-2">
				<DynamicForm
					fields={formSchema}
					onSubmit={handleSubmit}
					onFormReady={handleFormReady}
					otherTypeElements={{
						progressTypeCode: (props: any) => (
							<ProgressTypeCodeSelectComponent
								{...props}
								onDataChange={(data) => {
									// progressTypeCode와 progressTypeName을 동시에 설정
									formMethods?.setValue(
										'progressTypeCode',
										data.code
									);
									formMethods?.setValue(
										'progressTypeName',
										data.name
									);
								}}
							/>
						),
						unitTypeCode: (props: any) => (
							<CodeSelectComponent
								{...props}
								onDataChange={(data) => {
									// unitTypeCode와 unitTypeName을 동시에 설정
									formMethods?.setValue(
										'unitTypeCode',
										data.code
									);
									formMethods?.setValue(
										'unitTypeName',
										data.name
									);
								}}
							/>
						),
						isOutsourcing: (props: any) => (
							<BinaryToggleComponent
								{...props}
								falseLabel={t('labels.internalProcess')}
								trueLabel={t('labels.outsourcing')}
							/>
						),
					}}
					submitButtonText={
						mode === 'create'
							? t('buttons.register')
							: t('buttons.update')
					}
					visibleSaveButton={true}
				/>
			</div>
		</div>
	);
};

export default IniItemProgressRegisterPage;
