import { useState, useEffect, useMemo, useCallback } from 'react';
import {
	DynamicForm,
	FormField,
} from '@primes/components/form/DynamicFormComponent';
import { useCreateItem } from '@primes/hooks/init/item/useCreateItem';
import { useUpdateItem } from '@primes/hooks/init/item/useUpdateItem';
import { getFileUrl as getFileUrlService } from '@primes/services/common/fileService';
import { toast } from 'sonner';
import { Item } from '@primes/types/item';
import { useTranslation } from '@repo/i18n';
import { UseFormReturn } from 'react-hook-form';
import { CodeSelectComponent } from '@primes/components/customSelect/CodeSelectComponent';
import FileUploadComponent from '@primes/components/form/FileUploadComponent';

interface IniItemRegisterPageProps {
	onClose?: () => void;
	itemsData?: Item;
	onFormReady?: (methods: UseFormReturn<IniItemRegisterData>) => void;
}

interface IniItemRegisterData {
	[key: string]: unknown;
}

export const IniItemRegisterPage: React.FC<IniItemRegisterPageProps> = ({
	onClose,
	itemsData,
	onFormReady,
}) => {
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
	const [currentFileUrls, setCurrentFileUrls] = useState<any[]>([]);
	const create = useCreateItem();
	const update = useUpdateItem();
	const { t } = useTranslation('dataTable');
	const { t: tCommon } = useTranslation('common');
	const editMode: boolean = !!itemsData;

	// Memoize getFileUrl to prevent recreation on every render
	const getFileUrl = useCallback(
		(url: string, size?: 'thumb' | 'medium' | 'large') => {
			return getFileUrlService(url, size);
		},
		[]
	);

	// 기존 아이템의 파일들을 초기 상태로 설정 - only run when itemsData.id changes
	useEffect(() => {
		if (itemsData?.fileUrls && itemsData.fileUrls.length > 0) {
			setCurrentFileUrls([...itemsData.fileUrls]);
		} else {
			setCurrentFileUrls([]);
		}
	}, [itemsData?.id]); // Only depend on ID to prevent infinite loops

	const formSchema: FormField[] = useMemo(
		() => [
			// itemNo field is hidden from frontend but kept in logic for backend compatibility
			// {
			// 	name: 'itemNo',
			// 	label: t('columns.itemNo'),
			// 	type: 'number',
			// 	placeholder: '아이템번호를 입력하세요',
			// 	required: false,
			// },
		{
			name: 'itemNumber',
			label: t('columns.itemNumber'),
			type: 'text',
			placeholder: '품번을 입력하세요',
			required: false,
			maxLength: 45,
		},
		{
			name: 'itemName',
			label: t('columns.itemName'),
			type: 'text',
			placeholder: '제품명을 입력하세요',
			required: false,
			maxLength: 255, // rows: 3,
		},
		{
			name: 'itemSpec',
			label: t('columns.itemSpec'),
			type: 'text',
			placeholder: '5mm x 10mm',
			required: false,
			maxLength: 255, // rows: 3,
		},
		{
			name: 'itemModel',
			label: t('columns.itemModel'),
			type: 'text',
			placeholder: '모델명을 입력하세요',
			required: false,
			maxLength: 45,
		},
		{
			name: 'itemType1Code',
			label: t('columns.itemType1'),
			type: 'itemType1',
			required: false,
			labelKey: 'codeName',
			valueKey: 'codeValue',
			fieldKey: 'PRD-001',
			placeholder: '대분류를 선택해주세요',
		},
		{
			name: 'itemType2Code',
			label: t('columns.itemType2'),
			type: 'itemType2',
			labelKey: 'codeName',
			valueKey: 'codeValue',
			fieldKey: 'PRD-003',
			placeholder: '중분류를 선택해주세요',
			required: false,
		},
		{
			name: 'itemType3Code',
			label: t('columns.itemType3'),
			type: 'itemType3',
			labelKey: 'codeName',
			valueKey: 'codeValue',
			fieldKey: 'PRD-004',
			placeholder: '소분류를 선택해주세요',
			required: false,
		},
		{
			name: 'itemUnit',
			label: t('columns.itemUnit'),
			type: 'itemUnit',
			placeholder: '단위를 선택해주세요',
			labelKey: 'codeName',
				valueKey: 'codeName', // Use codeName (3-letter unit) instead of codeValue
			required: false,
			fieldKey: 'PRD-006',
		},
			{
				name: 'lotSizeCode',
				label: t('columns.lotSize'),
				type: 'lotSize',
				placeholder: 'Lot 사이즈를 선택해주세요',
				labelKey: 'codeName',
				valueKey: 'codeValue',
				required: false,
				fieldKey: 'PRD-007',
			},
		{
			name: 'optimalInventoryQty',
			label: t('columns.optimalInventoryQty'),
			type: 'number',
			required: false,
			placeholder: '적정재고량을 입력하세요',
		},
		{
			name: 'safetyInventoryQty',
			label: t('columns.safetyInventoryQty'),
			type: 'number',
			required: false,
			placeholder: '안전재고량을 입력하세요',
		},
		{
			name: 'fileUrls',
			label: tCommon('fileUpload.productImage'),
			type: 'fileUpload',
			required: false,
			placeholder: '제품 이미지를 업로드하세요',
		},
		],
		[t, tCommon, editMode]
	); // Memoize with dependencies

	const handleSubmit = useCallback(
		async (data: IniItemRegisterData) => {
		if (isSubmitting) return;

		setIsSubmitting(true);

		// 데이터 타입 변환 및 정리
		const processedData: any = {
				// Note: isUse and itemNo are only included for edit mode - create mode auto-generates them
				...(editMode && {
					isUse:
						itemsData?.isUse !== undefined ? itemsData.isUse : true,
					// Use existing itemNo from itemsData since field is hidden from form
					itemNo: itemsData?.itemNo
						? Number(itemsData.itemNo)
						: undefined,
				}),
			optimalInventoryQty: data.optimalInventoryQty
				? Number(data.optimalInventoryQty)
				: 0,
			safetyInventoryQty: data.safetyInventoryQty
				? Number(data.safetyInventoryQty)
				: 0,
			// 문자열 필드들 - 빈 문자열을 undefined로 변환
			itemNumber:
				data.itemNumber &&
				typeof data.itemNumber === 'string' &&
				data.itemNumber.trim()
					? data.itemNumber.trim()
					: undefined,
			itemName:
				data.itemName &&
				typeof data.itemName === 'string' &&
				data.itemName.trim()
					? data.itemName.trim()
					: undefined,
			itemSpec:
				data.itemSpec &&
				typeof data.itemSpec === 'string' &&
				data.itemSpec.trim()
					? data.itemSpec.trim()
					: undefined,
			itemModel:
				data.itemModel &&
				typeof data.itemModel === 'string' &&
				data.itemModel.trim()
					? data.itemModel.trim()
					: undefined,
			itemType1Code:
				data.itemType1Code &&
				typeof data.itemType1Code === 'string' &&
				data.itemType1Code.trim()
					? data.itemType1Code.trim()
					: undefined,
			itemType2Code:
				data.itemType2Code &&
				typeof data.itemType2Code === 'string' &&
				data.itemType2Code.trim()
					? data.itemType2Code.trim()
					: undefined,
			itemType3Code:
				data.itemType3Code &&
				typeof data.itemType3Code === 'string' &&
				data.itemType3Code.trim()
					? data.itemType3Code.trim()
					: undefined,
			itemUnit:
				data.itemUnit &&
				typeof data.itemUnit === 'string' &&
				data.itemUnit.trim()
					? data.itemUnit.trim()
					: undefined,
			lotSizeCode:
				data.lotSizeCode &&
				typeof data.lotSizeCode === 'string' &&
				data.lotSizeCode.trim()
					? data.lotSizeCode.trim()
						: 'PRD-007-001', // Provide default value if not selected
		};

		// 파일 URL 처리: 기존 파일 + 새 업로드 파일 병합
		const mergedFileUrls: any[] = [];

			// 기존 파일 (edit mode) - 최적화된 처리
			if (editMode && currentFileUrls?.length > 0) {
				mergedFileUrls.push(
					...currentFileUrls.map((file: any, index: number) => ({
						...(file.id !== undefined &&
							file.id !== null && { id: Number(file.id) }),
					url: file.url,
					ownerType: 'ITEM_IMG',
					sortOrder: index + 1,
					isPrimary: !!(file.isPrimary || index === 0),
						description:
							file.description || `Item image ${index + 1}`,
					}))
				);
			}

			// 새 업로드 파일 - 최적화된 처리
			if (
				data.fileUrls &&
				Array.isArray(data.fileUrls) &&
				data.fileUrls.length > 0
			) {
				const newFiles = (data.fileUrls as any[])
					.map((f: any) => {
						const url =
					typeof f === 'string'
						? f
								: f?.url || f?.filePath || f?.name || '';
						return typeof url === 'string' && url.trim()
							? url.trim()
							: null;
					})
					.filter((url): url is string => Boolean(url))
					.map((url: string, index: number) => ({
					url,
					ownerType: 'ITEM_IMG',
						sortOrder: mergedFileUrls.length + index + 1,
						isPrimary: mergedFileUrls.length === 0 && index === 0,
						description: `Item image ${mergedFileUrls.length + index + 1}`,
					}));

				mergedFileUrls.push(...newFiles);
		}

		if (mergedFileUrls.length > 0) {
			processedData.fileUrls = mergedFileUrls;
		}

		if (editMode) {
			const id = Number(itemsData?.id);
			update.mutate(
				{
					id: id,
					data: processedData,
				},
				{
					onSuccess: () => {
						onClose && onClose();
						setIsSubmitting(false);
					},
					onError: () => {
						setIsSubmitting(false);
					},
				}
			);
		} else {
			try {
				await create.mutateAsync(processedData);
				toast.success('등록이 완료되었습니다.');
				onClose && onClose();
			} catch (error) {
				toast.error('등록 중 오류가 발생했습니다.');
			} finally {
				setIsSubmitting(false);
			}
		}
		},
		[
			isSubmitting,
			editMode,
			itemsData,
			currentFileUrls,
			create,
			update,
			onClose,
		]
	); // Memoize with dependencies

	return (
		<div className="max-w-full mx-auto space-y-6 h-full">
			<DynamicForm
				onFormReady={onFormReady}
				fields={formSchema}
				onSubmit={handleSubmit}
				initialData={
					itemsData
						? (itemsData as unknown as Record<string, unknown>)
						: undefined
				}
				otherTypeElements={useMemo(
					() => ({
					itemType1: CodeSelectComponent,
					itemType2: CodeSelectComponent,
					itemType3: CodeSelectComponent,
					lotSize: CodeSelectComponent,
					itemUnit: CodeSelectComponent,
					fileUpload: (props: any) => (
						<FileUploadComponent
							{...props}
							existingFiles={currentFileUrls}
							editMode={editMode}
							getFileUrl={getFileUrl}
							maxFiles={3}
							maxFileSize={10}
						/>
					),
					}),
					[currentFileUrls, editMode, getFileUrl]
				)}
			/>
		</div>
	);
};

export default IniItemRegisterPage;
