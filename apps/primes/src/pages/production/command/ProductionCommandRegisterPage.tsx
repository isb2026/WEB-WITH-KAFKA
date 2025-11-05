import { useState, useRef, useEffect } from 'react';
import {
	DynamicForm,
	FormField,
} from '@primes/components/form/DynamicFormComponent';
import { UseFormReturn } from 'react-hook-form';
import { useTranslation } from '@repo/i18n';
import { useCommandFormSchema } from '@primes/schemas/production';
import {
	CodeSelectComponent,
	ItemSelectComponent,
	PlanSelectComponent,
} from '@primes/components/customSelect';
import { BinaryToggleComponent } from '@primes/components/customSelect';
import { useCommand } from '@primes/hooks/production/useCommand';
import { useItem } from '@primes/hooks/init/item/useItem';
import { useProgress } from '@primes/hooks/init/progress/useProgress';
import { UpdateCommandPayload } from '@primes/types/production';
import { toast } from 'sonner';

interface ProductionCommandRegisterPageProps {
	onClose?: () => void;
	data?: any;
	mode?: 'create' | 'edit';
}

interface ProductionCommandRegisterData {
	planId?: number;
	planCode?: string;
	accountMon?: string;
	itemId?: number;
	itemNo?: number;
	itemNumber?: string;
	itemName?: string;
	itemSpec?: string;
	commandAmount?: number;
	commandWeight?: number;
	unit?: string;
	startDate?: string;
	endDate?: string;
	startTime?: string;
	endTime?: string;
	status?: string;
	isClose?: boolean;
	closeBy?: string;
	closeAt?: string;
	progressList?: any[];
	progressId?: number;
	progressTypeCode?: string;
	progressName?: string;
	progressOrder?: number;
	isOutsourcing?: boolean;
	unitTypeCode?: string;
	unitTypeName?: string;
	unitWeight?: number;
	[key: string]: unknown;
}

export const ProductionCommandRegisterPage: React.FC<
	ProductionCommandRegisterPageProps
> = ({ onClose, mode, data }) => {
	const { t } = useTranslation('dataTable');
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
	const formMethodsRef = useRef<UseFormReturn<
		Record<string, unknown>
	> | null>(null);
	const [formMethods, setFormMethods] = useState<UseFormReturn<
		Record<string, unknown>
	> | null>(null);
	const commandFormSchema: FormField[] = useCommandFormSchema();

	const createMutation = useCommand({ page: 0, size: 30 }).create;
	const updateMutation = useCommand({ page: 0, size: 30 }).update;

	const { list: itemList } = useItem({ page: 0, size: 1000 });

	// 선택된 itemId에 따른 progress 데이터
	const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
	const { list: progressList } = useProgress({
		page: 0,
		size: 1000,
		searchRequest: selectedItemId ? { itemId: selectedItemId } : undefined,
	});

	// item 선택 시 해당 item의 모든 progress를 배열로 설정
	useEffect(() => {
		if (!formMethods || !selectedItemId || !progressList.data) return;

		const progressResponse = progressList.data;
		let allProgressList: any[] = [];

		if (progressResponse) {
			if ('content' in progressResponse) {
				allProgressList = (progressResponse as any).content || [];
			} else if (Array.isArray(progressResponse)) {
				allProgressList = progressResponse;
			}
		}

		if (allProgressList.length > 0) {
			formMethods.setValue('progressList', allProgressList);

			const firstProgress = allProgressList[0];
			if (firstProgress) {
				formMethods.setValue('progressId', firstProgress.id);
				formMethods.setValue(
					'progressTypeCode',
					firstProgress.progressTypeCode
				);
				formMethods.setValue(
					'progressName',
					firstProgress.progressName
				);
				formMethods.setValue(
					'progressOrder',
					firstProgress.progressOrder
				);
				formMethods.setValue(
					'isOutsourcing',
					firstProgress.isOutsourcing
				);
				// 공정에서 단중 정보 가져오기 (null이 아닌 경우만)
				if (firstProgress.unitTypeCode) {
					formMethods.setValue(
						'unitTypeCode',
						firstProgress.unitTypeCode
					);
				}
				if (firstProgress.unitTypeName) {
					formMethods.setValue(
						'unitTypeName',
						firstProgress.unitTypeName
					);
				}
				if (
					firstProgress.unitWeight !== null &&
					firstProgress.unitWeight !== undefined
				) {
					formMethods.setValue(
						'unitWeight',
						firstProgress.unitWeight
					);
				}
			}
		}
	}, [formMethods, selectedItemId, progressList.data]);

	const handleSubmit = async (formData: ProductionCommandRegisterData) => {
		if (isSubmitting) return;

		setIsSubmitting(true);

		try {
			const transformAccountMon = (
				accountMon: string | undefined
			): string => {
				if (!accountMon) return '';
				return accountMon.replace('-', '');
			};

			// datetime 값을 날짜와 시간으로 분리하는 함수
			const splitDateTime = (dateTimeString: string | undefined) => {
				if (!dateTimeString)
					return { date: undefined, time: undefined };

				try {
					const [datePart, timePart] = dateTimeString.split('T');
					return {
						date: datePart || undefined,
						time: timePart ? `${timePart}:00` : undefined,
					};
				} catch (error) {
					return { date: undefined, time: undefined };
				}
			};

			const startDateTime = splitDateTime(formData.startDate);
			const endDateTime = splitDateTime(formData.endDate);

			// 데이터 변환 로직
			const processedData = {
				accountMon: transformAccountMon(formData.accountMon),
				planId: formData.planId ? Number(formData.planId) : undefined,
				planCode: formData.planCode
					? String(formData.planCode)
					: undefined,
				itemId: formData.itemId ? Number(formData.itemId) : undefined,
				itemNo: formData.itemNo ? Number(formData.itemNo) : undefined,
				itemNumber: formData.itemNumber
					? String(formData.itemNumber)
					: undefined,
				itemName: formData.itemName
					? String(formData.itemName)
					: undefined,
				itemSpec: formData.itemSpec
					? String(formData.itemSpec)
					: undefined,
				commandAmount: formData.commandAmount
					? Number(formData.commandAmount)
					: undefined,
				commandWeight: formData.commandWeight
					? Number(formData.commandWeight)
					: undefined,
				unit: formData.unit ? String(formData.unit) : undefined,
				startDate: startDateTime.date,
				endDate: endDateTime.date,
				startTime:
					startDateTime.time || formData.startTime
						? String(startDateTime.time || formData.startTime)
						: undefined,
				endTime:
					endDateTime.time || formData.endTime
						? String(endDateTime.time || formData.endTime)
						: undefined,
				status: formData.status ? String(formData.status) : undefined,
				isClose:
					typeof formData.isClose === 'boolean'
						? formData.isClose
						: false,
				closeBy: formData.closeBy
					? String(formData.closeBy)
					: undefined,
				closeAt: formData.closeAt
					? String(formData.closeAt)
					: undefined,
				unitTypeCode: formData.unitTypeCode
					? String(formData.unitTypeCode)
					: undefined,
				unitTypeName: formData.unitTypeName
					? String(formData.unitTypeName)
					: undefined,
				unitWeight: formData.unitWeight
					? Number(formData.unitWeight)
					: undefined,
			};

			if (mode === 'create') {
				// progressList의 각 공정별로 Command 생성
				const progressList = (formData.progressList as any[]) || [];

				if (progressList.length === 0) {
					const progressId = formData.progressId;
					const progressName = formData.progressName;
					const progressTypeCode = formData.progressTypeCode;
					const progressOrder = formData.progressOrder;
					const isOutsourcing = formData.isOutsourcing;

					if (progressId || progressName) {
						// 개별 progress 필드가 있으면 사용
						const commandWithProgress = {
							...processedData,
							progressId: progressId
								? Number(progressId)
								: undefined,
							progressTypeCode: progressTypeCode || undefined,
							progressName: progressName || undefined,
							progressOrder: progressOrder
								? Number(progressOrder)
								: undefined,
							isOutsourcing: Boolean(isOutsourcing) || false,
							unitTypeCode: formData.unitTypeCode || undefined,
							unitTypeName: formData.unitTypeName || undefined,
							unitWeight: formData.unitWeight || undefined,
						};

						const commandResult = await createMutation.mutateAsync([
							commandWithProgress,
						]);
						toast.success('작업지시가 성공적으로 등록되었습니다.');
					} else {
						// 공정 정보가 전혀 없는 경우 기본 Command만 생성
						const commandResult = await createMutation.mutateAsync([
							processedData,
						]);
						toast.success('작업지시가 성공적으로 등록되었습니다.');
					}
				} else {
					// 각 공정별로 Command 생성
					const commandsToCreate = progressList.map(
						(progress: any) => ({
							...processedData,
							progressId: Number(progress.id) || 0,
							progressTypeCode: progress.progressTypeCode || '',
							progressName: progress.progressName || '',
							progressOrder: Number(progress.progressOrder) || 0,
							isOutsourcing:
								Boolean(progress.isOutsourcing) || false,
							unitTypeCode:
								progress.unitTypeCode ||
								formData.unitTypeCode ||
								'',
							unitTypeName:
								progress.unitTypeName ||
								formData.unitTypeName ||
								'',
							unitWeight:
								progress.unitWeight !== null &&
								progress.unitWeight !== undefined
									? progress.unitWeight
									: formData.unitWeight || 0,
						})
					);

					const commandResult =
						await createMutation.mutateAsync(commandsToCreate);
					toast.success(
						`${progressList.length}개 공정의 작업지시가 성공적으로 등록되었습니다.`
					);
				}
			} else if (mode === 'edit' && data) {
				await updateMutation.mutateAsync({
					id: data.id,
					data: {
						...processedData,
						id: data.id,
					} as UpdateCommandPayload,
				});
				toast.success('작업지시가 성공적으로 수정되었습니다.');
			}

			handleCancel();
		} catch (error) {
			console.error('등록 실패:', error);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleCancel = () => {
		onClose && onClose();
	};

	const handleFormReady = (
		methods: UseFormReturn<Record<string, unknown>>
	) => {
		formMethodsRef.current = methods;
		setFormMethods(methods);
	};

	const handleItemChange = (itemId: number) => {
		if (formMethodsRef.current) {
			// 선택된 itemId 상태 업데이트 (progress 데이터 로딩을 위해)
			setSelectedItemId(itemId);

			// 아이템 데이터에서 item 정보 찾기
			const response = itemList.data;
			let selectedItem = null;

			if (response) {
				// ItemListResponse인 경우 content에서 배열 추출
				if ('content' in response) {
					selectedItem = (response as any).content.find(
						(item: any) => item.id === itemId
					);
				}
				// 이미 배열인 경우
				else if (Array.isArray(response)) {
					selectedItem = (response as any[]).find(
						(item: any) => item.id === itemId
					);
				}
			}

			// Item 정보 설정
			if (selectedItem) {
				formMethodsRef.current.setValue('itemId', itemId);
				formMethodsRef.current.setValue('itemNo', selectedItem.itemNo);
				formMethodsRef.current.setValue(
					'itemNumber',
					selectedItem.itemNumber
				);
				formMethodsRef.current.setValue(
					'itemName',
					selectedItem.itemName
				);
				formMethodsRef.current.setValue(
					'itemSpec',
					selectedItem.itemSpec
				);
				formMethodsRef.current.setValue(
					'unit',
					selectedItem.itemUnit || selectedItem.unit || ''
				);

				// 단중 정보 자동 설정 (제품에서 가져온 정보)
				// 제품 정보에서 단중 관련 정보가 있다면 설정
				if (selectedItem.unitTypeCode) {
					formMethodsRef.current.setValue(
						'unitTypeCode',
						selectedItem.unitTypeCode
					);
				}
				if (selectedItem.unitTypeName) {
					formMethodsRef.current.setValue(
						'unitTypeName',
						selectedItem.unitTypeName
					);
				}
				if (selectedItem.unitWeight) {
					formMethodsRef.current.setValue(
						'unitWeight',
						selectedItem.unitWeight
					);
				}
			}
		}
	};

	useEffect(() => {
		if (formMethods && mode === 'edit' && data) {
			const transformAccountMon = (
				accountMon: string | undefined
			): string => {
				if (!accountMon || accountMon.length !== 6) return '';
				const year = accountMon.substring(0, 4);
				const month = accountMon.substring(4, 6);
				return `${year}-${month}`;
			};

			const combineDateTime = (
				date: string | undefined,
				time: string | undefined
			): string => {
				if (!date) return '';
				if (!time) return date;

				const timeWithoutSeconds = time.substring(0, 5);
				return `${date}T${timeWithoutSeconds}`;
			};

			// edit 모드에서 itemId가 있으면 해당 item의 progress를 로딩하기 위해 selectedItemId 설정
			if (data.itemId && data.itemId !== selectedItemId) {
				setSelectedItemId(data.itemId);
			}

			const defaultValues = {
				planId: data.planId || 0,
				planCode: data.planCode || '',
				commandNo: data.commandNo || '',
				commandGroupNo: data.commandGroupNo || '',
				commandProgressSeq: data.commandProgressSeq || '',
				accountMon: transformAccountMon(data.accountMon),
				itemId: data.itemId || 0,
				itemNo: data.itemNo || 0,
				itemNumber: data.itemNumber || '',
				itemName: data.itemName || '',
				itemSpec: data.itemSpec || '',
				commandAmount: data.commandAmount || 0,
				commandWeight: data.commandWeight || 0,
				unit: data.unit || '',
				startDate: combineDateTime(data.startDate, data.startTime),
				endDate: combineDateTime(data.endDate, data.endTime),
				startTime: data.startTime || '',
				endTime: data.endTime || '',
				status: data.status || data.statusCode || '',
				isClose: data.isClose || false,
				closeBy: data.closeBy || '',
				closeAt: data.closeAt || '',
				progressId: data.progressId || 0,
				progressName: data.progressName || '',
				progressTypeCode: data.progressTypeCode || '',
				progressOrder: data.progressOrder || 0,
				isOutsourcing: data.isOutsourcing || false,
				unitTypeCode: data.unitTypeCode || '',
				unitTypeName: data.unitTypeName || '',
				unitWeight: data.unitWeight || 0,
			};
			console.log('defaultValues', defaultValues);
			formMethods.reset(defaultValues);
		}
	}, [mode, data, formMethods, selectedItemId]);

	return (
		<div className="max-w-full mx-auto">
			<DynamicForm
				fields={commandFormSchema.filter((field) => {
					// 등록 모드에서는 commandNo 필드 제외
					if (mode === 'create' && field.name === 'commandNo') {
						return false;
					}
					return true;
				})}
				onSubmit={handleSubmit}
				onFormReady={handleFormReady}
				otherTypeElements={{
					planSelect: (props: any) => (
						<PlanSelectComponent
							{...props}
							onPlanDataChange={(planData: {
								planId: number;
								planCode: string;
							}) => {
								if (formMethodsRef.current) {
									formMethodsRef.current.setValue(
										'planId',
										planData.planId
									);
									formMethodsRef.current.setValue(
										'planCode',
										planData.planCode
									);
								}
							}}
						/>
					),
					itemId: (props: any) => (
						<ItemSelectComponent
							{...props}
							onItemIdChange={(itemId: number) => {
								handleItemChange(itemId);
							}}
						/>
					),
					codeSelect: (props: any) => (
						<CodeSelectComponent
							{...props}
							onChange={(value: string) => {
								props.onChange(value);
							}}
							selectWithoutSearch={true}
						/>
					),
					isClose: (props: any) => {
						return (
							<BinaryToggleComponent
								value={Boolean(props.value) ? 'true' : 'false'}
								onChange={(value) => {
									props.onChange(value === 'true');
								}}
								falseLabel="마감되지 않음"
								trueLabel="마감"
							/>
						);
					},
				}}
			/>
		</div>
	);
};

export default ProductionCommandRegisterPage;
