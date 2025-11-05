import { useRef, useState, useMemo } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { DynamicForm } from '@primes/components/form/DynamicFormComponent';
import FormComponent from '@primes/components/form/FormComponent';
import { useMoldOrderMaster } from '@primes/hooks';
import { RadixButton } from '@radix-ui/components';
import { Check, RotateCw } from 'lucide-react';
import { MoldOrderMasterDto } from '@primes/types/mold';
import { UseMutationResult } from '@tanstack/react-query';
import { useTranslation } from '@repo/i18n';
import { ItemProgressSelectComponent } from '@primes/components/customSelect/ItemProgressSelectComponent';
import { ItemSelectComponent } from '@primes/components/customSelect/ItemSelectComponent';
import { useItemProgressFieldQuery } from '@primes/hooks/init/itemProgress/useItemProgressFieldQuery';

// Utility function to get today's date in 'YYYY-MM-DD' format
const getTodayDateString = () => {
	const today = new Date();
	const year = today.getFullYear();
	const month = (today.getMonth() + 1).toString().padStart(2, '0');
	const day = today.getDate().toString().padStart(2, '0');
	return `${year}-${month}-${day}`;
};

interface MoldOrderRegisterFormProps {
	onSuccess?: (res: MoldOrderMasterDto) => void;
	onError?: (error: Error) => void;
	onReset?: () => void;
	masterData?: MoldOrderMasterDto;
	updateMaster?: UseMutationResult<
		MoldOrderMasterDto,
		Error,
		{ id: number | string; data: Partial<MoldOrderMasterDto> },
		void
	>;
	isEditMode?: boolean;
}

export const MoldOrderRegisterForm = (props: MoldOrderRegisterFormProps) => {
	const { t } = useTranslation('dataTable');
	const { t: tCommon } = useTranslation('common');
	const { onSuccess, onReset } = props;
	const { createMoldOrderMaster } = useMoldOrderMaster({
		page: 0,
		size: 30,
	});
	const [isCreated, setIsCreated] = useState(false);
	const [currentItemId, setCurrentItemId] = useState<number | null>(null);
	const [selectedProgressId, setSelectedProgressId] = useState<string>('');

	// 현재 선택된 itemId에 대한 progress 옵션들을 가져오기
	const { data: progressOptions } = useItemProgressFieldQuery(
		'progressName',
		!!currentItemId,
		currentItemId || undefined
	);

	// ItemProgressSelectComponent를 래핑해서 현재 itemId를 전달
	const ProgressSelectWithItemId = (props: any) => {
		const currentFormItemId = formMethodsRef.current?.getValues('itemId');
		console.log(
			'ProgressSelectWithItemId - currentFormItemId:',
			currentFormItemId
		);
		console.log(
			'ProgressSelectWithItemId - currentItemId state:',
			currentItemId
		);
		console.log('ProgressSelectWithItemId - props:', props);

		return (
			<ItemProgressSelectComponent
				{...props}
				itemId={currentFormItemId || currentItemId}
				onChange={(value: string) => {
					// 선택된 progressId 저장
					setSelectedProgressId(value);
					console.log('Progress selected value:', value);
					
					// 원래 onChange 호출
					if (props.onChange) {
						props.onChange(value);
					}
				}}
			/>
		);
	};

	const otherTypeElements = useMemo(
		() => ({
			item: ItemSelectComponent,
			progressName: ProgressSelectWithItemId,
		}),
		[currentItemId, progressOptions] // currentItemId와 progressOptions가 변경될 때 재생성
	);

	const moldOrderFormSchema = useMemo(
		() => [
			{
				name: 'moldType',
				label: t('columns.moldType'),
				type: 'text',
				placeholder: 'M',
				required: false, // 백엔드에 @NotNull 없음
				maxLength: 1,
				defaultValue: props.masterData?.moldType || 'M',
				disabled: isCreated,
			},
			{
				name: 'accountMonth',
				label: t('columns.accountMonth'),
				type: 'text',
				placeholder: `YYYYMM 형식 (예: ${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')})`,
				required: false,
				maxLength: 6,
				defaultValue:
					props.masterData?.accountMonth ||
					`${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}`,
				disabled: isCreated,
				title: 'YYYYMM 형식으로 입력해주세요 (예: 202502)',
			},
			{
				name: 'orderDate',
				label: t('columns.orderDate'),
				type: 'date',
				defaultValue:
					props.masterData?.orderDate || getTodayDateString(),
				required: false, // 백엔드에 @NotNull 없음
				disabled: isCreated,
			},
			{
				name: 'inRequestDate',
				label: t('columns.inRequestDate'),
				type: 'date',
				defaultValue:
					props.masterData?.inRequestDate || getTodayDateString(),
				required: false,
				disabled: isCreated,
			},
			{
				name: 'itemId',
				label: t('columns.item'),
				type: 'item',
				placeholder: '제품을 선택해주세요',
				fieldKey: 'progressName',
			},
			{
				name: 'progressId',
				label: t('columns.progressName'),
				type: 'progressName',
				placeholder: '공정을 선택해주세요',
				fieldKey: 'progressName',
			},
			{
				name: 'isDev',
				label: t('columns.isDev'),
				type: 'select',
				options: [
					{ label: '아니오', value: 'false' },
					{ label: '예', value: 'true' },
				],
				defaultValue: props.masterData?.isDev?.toString() || 'false',
				required: false, // 백엔드에 @NotNull 없음
				disabled: isCreated,
			},
			{
				name: 'isChange',
				label: t('columns.isChange'),
				type: 'select',
				options: [
					{ label: '아니오', value: 'false' },
					{ label: '예', value: 'true' },
				],
				defaultValue: props.masterData?.isChange?.toString() || 'false',
				required: false, // 백엔드에 @NotNull 없음
				disabled: isCreated,
			},
		],
		[t, props.masterData, props.isEditMode, isCreated]
	);

	const formMethodsRef = useRef<UseFormReturn<
		Record<string, unknown>
	> | null>(null);

	const handleFormReady = (
		methods: UseFormReturn<Record<string, unknown>>
	) => {
		formMethodsRef.current = methods;

		// itemId 변경 감지
		const subscription = methods.watch((value, { name }) => {
			console.log('Form watch - name:', name, 'value:', value);
			if (name === 'itemId') {
				const newItemId = value.itemId as number;
				console.log(
					'itemId changed - newItemId:',
					newItemId,
					'currentItemId:',
					currentItemId
				);
				if (newItemId !== currentItemId) {
					setCurrentItemId(newItemId);
					// itemId가 변경되면 progressId와 progressName 초기화
					setSelectedProgressId('');
					methods.setValue('progressId', '');
				}
			}
		});

		return () => subscription.unsubscribe();
	};

	const handleResetForm = () => {
		if (formMethodsRef.current) {
			formMethodsRef.current.reset();
			// Reset form fields to default values
			formMethodsRef.current.setValue('orderDate', getTodayDateString());
			setIsCreated(false);
			if (onReset) {
				onReset();
			}
		}
	};

	const handleSubmitForm = () => {
		if (formMethodsRef.current) {
			formMethodsRef.current.handleSubmit(CreateMasterData)();
		}
	};

	const OrderInfoActionButtons = () => (
		<div className="flex items-center gap-2.5">
			<RadixButton
				className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border bg-Colors-Brand-600 text-white"
				onClick={handleResetForm}
			>
				<RotateCw
					size={16}
					className="text-muted-foreground text-white"
				/>
				{tCommon('pages.form.reset')}
			</RadixButton>
			<RadixButton
				className={`flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border ${
					isCreated
						? 'bg-gray-300 cursor-not-allowed'
						: 'bg-Colors-Brand-600 text-white'
				}`}
				onClick={handleSubmitForm}
				disabled={isCreated}
			>
				<Check
					size={16}
					className={isCreated ? 'text-gray-400' : 'text-white'}
				/>
				{tCommon('pages.form.save')}
			</RadixButton>
		</div>
	);

	const CreateMasterData = (data: Record<string, unknown>) => {
		if (!formMethodsRef.current) return;

		// accountMonth 검증
		const accountMonth = data.accountMonth as string;
		if (accountMonth && !/^\d{4}(0[1-9]|1[0-2])$/.test(accountMonth)) {
			alert('발주월은 YYYYMM 형식으로 입력해주세요 (예: 202502)');
			return;
		}

		// Transform data to match the expected format
		const transformData = (formData: Record<string, unknown>) => {
			const ensureNumber = (
				value: any,
				defaultValue?: number
			): number | undefined => {
				if (!value && !defaultValue) return undefined;
				const num = Number(value);
				return isNaN(num) || num === 0 ? defaultValue : num;
			};

			// progressName을 선택된 progressId에서 찾기
			const getProgressName = () => {
				// 선택된 progressId가 있고 progressOptions가 있으면 해당하는 이름 찾기
				if (selectedProgressId && progressOptions && Array.isArray(progressOptions)) {
					const selectedOption = progressOptions.find(
						(option: any) => option.id?.toString() === selectedProgressId
					);
					if (selectedOption) {
						return selectedOption.value || selectedOption.name || selectedOption.progressName;
					}
				}
				// 기존 데이터가 있으면 사용
				return props.masterData?.progressName || null;
			};

			// Transform data - only use form data or existing masterData
			const result: any = {
				accountMonth:
					(formData.accountMonth as string) ||
					props.masterData?.accountMonth,
				orderDate:
					(formData.orderDate as string) ||
					props.masterData?.orderDate,
				inRequestDate:
					(formData.inRequestDate as string) ||
					props.masterData?.inRequestDate,
				progressName: getProgressName(),
				moldType:
					(formData.moldType as string) || props.masterData?.moldType,
				itemId: ensureNumber(formData.itemId, props.masterData?.itemId),
				progressId: ensureNumber(
					formData.progressId,
					props.masterData?.progressId
				),
				isDev:
					formData.isDev === 'true' ||
					formData.isDev === true ||
					props.masterData?.isDev,
				isChange:
					formData.isChange === 'true' ||
					formData.isChange === true ||
					props.masterData?.isChange,
			};

			return result;
		};

		if (props.isEditMode && props.updateMaster && props.masterData) {
			// Update data without completion/approval and incoming fields
			const safeUpdateData = {
				accountMonth: data.accountMonth as string,
				progressName: data.progressName as string,
				orderDate: data.orderDate as string,
				inRequestDate: data.inRequestDate as string,
			};

			props.updateMaster.mutate(
				{
					id: props.masterData.id,
					data: safeUpdateData,
				},
				{
					onSuccess: (res) => {
						if (onSuccess) {
							onSuccess(res);
						}
					},
				}
			);
		} else {
			// Create new mold order
			const transformedData = transformData(data);
			createMoldOrderMaster.mutate(transformedData, {
				onSuccess: (res) => {
					if (onSuccess) {
						onSuccess(res);
					}
					setIsCreated(true);
				},
			});
		}
	};

	return (
		<FormComponent
			title={
				props.isEditMode
					? tCommon('pages.mold.orders.edit')
					: tCommon('pages.mold.orders.register')
			}
			actionButtons={<OrderInfoActionButtons />}
		>
			<div className="max-w-full mx-auto">
				<DynamicForm
					onFormReady={handleFormReady}
					fields={moldOrderFormSchema}
					visibleSaveButton={false}
					otherTypeElements={otherTypeElements}
				/>
			</div>
		</FormComponent>
	);
};
