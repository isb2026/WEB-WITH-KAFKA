import { useState } from 'react';
import {
	DynamicForm,
	FormField,
} from '@primes/components/form/DynamicFormComponent';
import { useMold } from '@primes/hooks';
import { useTranslation } from '@repo/i18n';
import { MoldMasterCreateRequest, MoldMasterDto } from '@primes/types/mold';
import { toast } from 'sonner';
import { useMoldFileUpload } from '@primes/hooks/mold/useMoldFileUpload';
import { CodeSelectComponent } from '@primes/components/customSelect/CodeSelectComponent';

interface MoldRegisterPageProps {
	onClose?: () => void;
	moldData?: MoldMasterDto;
}

export const MoldRegisterPage: React.FC<MoldRegisterPageProps> = ({
	onClose,
	moldData,
}) => {
	const { t } = useTranslation('dataTable');
	const { t: tCommon } = useTranslation('common');
	const { createMold, updateMold } = useMold({ page: 0, size: 30 });
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
	const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
	const [uploadedFilePaths, setUploadedFilePaths] = useState<string[]>([]);
	const isEditMode = !!moldData;

	// Mold-specific file upload hook
	const { uploadState, handleMoldPictureUpload } = useMoldFileUpload();

	const formSchema: FormField[] = [
		{
			name: 'moldType',
			label: t('columns.moldType'),
			type: 'moldTypeSelect',
			placeholder: t('placeholders.selectMoldType') || 'Select mold type',
			required: true,
			fieldKey: 'MLD-001',
		},
		{
			name: 'moldCode',
			label: t('columns.moldCode'),
			type: 'text',
			placeholder: t('placeholders.enterMoldCode') || 'Enter mold code',
			required: true,
		},
		{
			name: 'moldName',
			label: t('columns.moldName'),
			type: 'text',
			placeholder: t('placeholders.enterMoldName') || 'Enter mold name',
			required: true,
		},
		{
			name: 'moldStandard',
			label: t('columns.moldStandard'),
			type: 'text',
			placeholder: t('placeholders.enterMoldStandard') || 'Enter mold standard',
			required: true,
		},
		{
			name: 'lifeCycle',
			label: t('columns.lifeCycle'),
			type: 'number',
			placeholder: t('placeholders.enterLifeCycle') || 'Enter life cycle',
			required: true, // ✅ Now required to match backend
		},
		{
			name: 'moldPrice',
			label: t('columns.moldPrice'),
			type: 'number',
			placeholder: t('placeholders.enterMoldPrice') || 'Enter mold price',
			required: true, // ✅ Now required to match backend
		},
		{
			name: 'safeStock',
			label: t('columns.safeStock'),
			type: 'number',
			placeholder: t('placeholders.enterSafeStock') || 'Enter safe stock',
			required: false,
		},
		{
			name: 'currentStock',
			label: t('columns.currentStock'),
			type: 'number',
			placeholder: t('placeholders.enterCurrentStock') || 'Enter current stock',
			required: false,
		},
		{
			name: 'manageType',
			label: t('columns.manageType'),
			type: 'select',
			placeholder: t('placeholders.selectManageType') || 'Select manage type',
			required: true,
			options: [
				{ label: '발주용', value: '0' },
				{ label: '수명관리', value: '1' },
				{ label: '수량관리', value: '2' },
			],
		},
		{
			name: 'moldDesign',
			label: t('columns.moldDesign'),
			type: 'text',
			placeholder: t('placeholders.enterMoldDesign') || 'Enter mold design',
			required: false,
			maxLength: 50,
		},
		{
			name: 'moldDesignCode',
			label: t('columns.moldDesignCode'),
			type: 'text',
			placeholder: t('placeholders.enterMoldDesignCode') || 'Enter mold design code',
			required: false,
			maxLength: 30,
		},
		{
			name: 'moldPicture',
			label: t('columns.moldPicture'),
			type: 'moldPictureUpload',
			placeholder: t('placeholders.uploadMoldPicture') || 'Upload mold picture',
			required: false,
		},
		{
			name: 'keepPlace',
			label: t('columns.keepPlace'),
			type: 'text',
			placeholder: t('placeholders.enterKeepPlace') || 'Enter keep place',
			required: false,
			maxLength: 50,
		},
	];

	// Handle image upload
	const handleImageUpload = async (files: File[]) => {
		if (files.length > 3) {
			toast.error(tCommon('fileUpload.maxImagesError'));
			return;
		}

		const newFiles = [...uploadedFiles, ...files];
		setUploadedFiles(newFiles);

		// Upload each file
		for (const file of files) {
			const result = await handleMoldPictureUpload(file);
			if (result) {
				setUploadedFilePaths((prev) => [...prev, result.data.filePath]);
				toast.success(
					tCommon('fileUpload.uploadSuccess', { count: files.length })
				);
			}
		}
	};

	// Remove uploaded file
	const removeUploadedFile = (index: number) => {
		const newFiles = uploadedFiles.filter((_, i) => i !== index);
		const newPaths = uploadedFilePaths.filter((_, i) => i !== index);
		setUploadedFiles(newFiles);
		setUploadedFilePaths(newPaths);
	};

	// Custom mold picture upload component
	const MoldPictureUploadComponent = () => (
		<div className="w-full">
			{/* File Upload Interface */}
			<div className="flex items-center gap-3 p-3 border border-gray-300 rounded-md hover:border-Colors-Brand-500 transition-colors bg-white">
				<div className="flex items-center justify-center w-8 h-8 bg-Colors-Brand-100 rounded">
					<svg
						className="w-4 h-4 text-Colors-Brand-600"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
						/>
					</svg>
				</div>
				<div className="flex-1">
					<p className="text-sm text-gray-700 font-medium">
						{tCommon('fileUpload.dragDrop')}
					</p>
					<p className="text-xs text-gray-500">
						{tCommon('fileUpload.clickToSelect')}
					</p>
				</div>
				<button
					type="button"
					onClick={() =>
						document.getElementById('mold-file-input')?.click()
					}
					className="px-4 py-2 text-sm bg-Colors-Brand-700 text-white rounded hover:bg-Colors-Brand-800 transition-colors"
				>
					{tCommon('fileUpload.selectFile')}
				</button>
			</div>

			{/* Hidden File Input */}
			<input
				id="mold-file-input"
				type="file"
				accept="image/*"
				multiple
				onChange={(e) => {
					const files = Array.from(e.target.files || []);
					if (files.length > 0) {
						handleImageUpload(files);
					}
				}}
				className="hidden"
			/>

			{/* Upload Progress */}
			{uploadState.isUploading && (
				<div className="mt-2 bg-Colors-Brand-50 border border-Colors-Brand-200 rounded-md p-3">
					<div className="flex items-center justify-between text-sm text-gray-700 mb-2">
						<span className="font-medium">
							{tCommon('fileUpload.uploading')}
						</span>
						<span className="text-Colors-Brand-600 font-semibold">
							{uploadState.progress}%
						</span>
					</div>
					<div className="w-full bg-gray-200 rounded-full h-2">
						<div
							className="bg-gradient-to-r from-Colors-Brand-500 to-Colors-Brand-600 h-2 rounded-full transition-all duration-500 ease-out"
							style={{
								width: `${uploadState.progress}%`,
							}}
						/>
					</div>
				</div>
			)}

			{/* Error Display */}
			{uploadState.error && (
				<div className="mt-2 text-red-600 text-sm">
					{uploadState.error}
				</div>
			)}

			{/* Multiple Image Preview */}
			{uploadedFiles.length > 0 && (
				<div className="mt-3 space-y-2">
					{uploadedFiles.slice(0, 3).map((file, index) => (
						<div
							key={index}
							className="p-3 border border-Colors-Brand-200 rounded-md bg-Colors-Brand-50 max-w-full overflow-hidden"
						>
							<div className="flex items-center gap-3 min-w-0">
								{/* Image Thumbnail */}
								<div className="flex-shrink-0">
									<div
										className="w-12 h-12 bg-white border border-gray-200 rounded-lg overflow-hidden cursor-pointer hover:border-Colors-Brand-300 transition-colors"
										onClick={() => {
											const blobUrl =
												URL.createObjectURL(file);
											window.open(blobUrl, '_blank');
										}}
										title={tCommon(
											'fileUpload.clickToView'
										)}
									>
										<img
											src={URL.createObjectURL(file)}
											alt={file.name}
											className="w-full h-full object-cover"
										/>
									</div>
								</div>

								{/* File Info */}
								<div className="flex-1 min-w-0 overflow-hidden">
									<div className="flex items-center gap-2 min-w-0">
										<svg
											className="w-4 h-4 text-Colors-Brand-500 flex-shrink-0"
											fill="currentColor"
											viewBox="0 0 20 20"
										>
											<path
												fillRule="evenodd"
												d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
												clipRule="evenodd"
											/>
										</svg>
										<p
											className="text-sm font-medium text-Colors-Brand-800 truncate min-w-0"
											title={file.name}
										>
											{(() => {
												if (file.name.length > 50) {
													const extension = file.name
														.split('.')
														.pop();
													const nameWithoutExt =
														file.name.substring(
															0,
															file.name.lastIndexOf(
																'.'
															)
														);
													return `${nameWithoutExt.substring(0, 45)}...${extension ? `.${extension}` : ''}`;
												}
												return file.name;
											})()}
										</p>
									</div>
									<div className="flex items-center gap-4 mt-1">
										<span className="text-xs text-Colors-Brand-600 whitespace-nowrap">
											{(file.size / 1024 / 1024).toFixed(
												2
											)}{' '}
											MB
										</span>
										<span className="text-xs text-Colors-Brand-600 whitespace-nowrap">
											{tCommon(
												'fileUpload.uploadComplete'
											)}
										</span>
									</div>
								</div>

								{/* Actions */}
								<div className="flex items-center flex-shrink-0">
									{/* Remove Button */}
									<button
										type="button"
										onClick={() =>
											removeUploadedFile(index)
										}
										className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
										title={tCommon('fileUpload.delete')}
									>
										<svg
											className="w-4 h-4"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
											/>
										</svg>
									</button>
								</div>
							</div>
						</div>
					))}

					{/* Show limit warning if more than 3 files */}
					{uploadedFiles.length > 3 && (
						<div className="text-amber-600 text-sm bg-amber-50 border border-amber-200 rounded-md p-2">
							{tCommon('fileUpload.previewLimit', {
								total: uploadedFiles.length,
							})}
						</div>
					)}
				</div>
			)}
		</div>
	);

	const handleSubmit = async (data: Record<string, unknown>) => {
		if (isSubmitting) return;

		setIsSubmitting(true);

		try {
			// Validate required fields (moldCode 제거)
			if (
				!data.moldType ||
				!data.moldName ||
				!data.moldStandard ||
				!data.manageType
			) {
				toast.error('필수 필드를 모두 입력해주세요.');
				return;
			}

			// ✅ FIXED: Better validation for numeric fields
			if (
				data.lifeCycle === undefined ||
				data.lifeCycle === null ||
				data.lifeCycle === '' ||
				Number(data.lifeCycle) <= 0
			) {
				toast.error('수명주기는 0보다 큰 값을 입력해주세요.');
				return;
			}

			if (
				data.moldPrice === undefined ||
				data.moldPrice === null ||
				data.moldPrice === '' ||
				Number(data.moldPrice) <= 0
			) {
				toast.error('금형가격은 0보다 큰 값을 입력해주세요.');
				return;
			}

			// Clean the data by removing undefined and null values
			const cleanData: Record<string, any> = {};

			// Required fields - these must be present and not empty
			cleanData.moldType = String(data.moldType || '').trim();
			cleanData.moldName = String(data.moldName || '').trim();
			cleanData.moldStandard = String(data.moldStandard || '').trim();
			cleanData.manageType = String(data.manageType || '').trim();

			// Validate required fields are not empty after trimming
			if (
				!cleanData.moldType ||
				!cleanData.moldName ||
				!cleanData.moldStandard ||
				!cleanData.manageType
			) {
				toast.error('필수 필드를 모두 입력해주세요.');
				return;
			}

			// Handle required numeric fields - must be provided and valid
			const lifeCycleNum = Number(data.lifeCycle);
			const moldPriceNum = Number(data.moldPrice);

			if (isNaN(lifeCycleNum) || lifeCycleNum <= 0) {
				toast.error('수명주기는 0보다 큰 숫자를 입력해주세요.');
				return;
			}

			if (isNaN(moldPriceNum) || moldPriceNum <= 0) {
				toast.error('금형가격은 0보다 큰 숫자를 입력해주세요.');
				return;
			}

			cleanData.lifeCycle = lifeCycleNum;
			cleanData.moldPrice = moldPriceNum;

			// Handle optional numeric fields
			if (
				data.safeStock !== undefined &&
				data.safeStock !== null &&
				data.safeStock !== ''
			) {
				const safeStockNum = Number(data.safeStock);
				if (!isNaN(safeStockNum) && safeStockNum >= 0) {
					cleanData.safeStock = safeStockNum;
				}
			}

			if (
				data.currentStock !== undefined &&
				data.currentStock !== null &&
				data.currentStock !== ''
			) {
				const currentStockNum = Number(data.currentStock);
				if (!isNaN(currentStockNum) && currentStockNum >= 0) {
					cleanData.currentStock = currentStockNum;
				}
			}

			// Handle optional string fields - only add if they have values
			if (data.moldDesign && String(data.moldDesign).trim()) {
				cleanData.moldDesign = String(data.moldDesign).trim();
			}
			if (data.moldDesignCode && String(data.moldDesignCode).trim()) {
				cleanData.moldDesignCode = String(data.moldDesignCode).trim();
			}
			if (data.keepPlace && String(data.keepPlace).trim()) {
				cleanData.keepPlace = String(data.keepPlace).trim();
			}

			// Handle mold picture - use uploaded file paths or existing value
			if (uploadedFilePaths.length > 0) {
				cleanData.moldPicture = uploadedFilePaths.join(',');
			} else if (data.moldPicture && String(data.moldPicture).trim()) {
				cleanData.moldPicture = String(data.moldPicture).trim();
			}

			if (isEditMode && moldData) {
				await updateMold.mutateAsync({
					id: moldData.id,
					data: cleanData,
				});
				toast.success('금형이 성공적으로 수정되었습니다.');
			} else {
				const createRequest: MoldMasterCreateRequest = {
					moldType: cleanData.moldType,
					moldName: cleanData.moldName,
					moldStandard: cleanData.moldStandard,
					lifeCycle: cleanData.lifeCycle,
					moldPrice: cleanData.moldPrice,
					manageType: cleanData.manageType,
					// Optional fields
					...(cleanData.safeStock !== undefined && {
						safeStock: cleanData.safeStock,
					}),
					...(cleanData.currentStock !== undefined && {
						currentStock: cleanData.currentStock,
					}),
					...(cleanData.moldDesign && {
						moldDesign: cleanData.moldDesign,
					}),
					...(cleanData.moldDesignCode && {
						moldDesignCode: cleanData.moldDesignCode,
					}),
					...(cleanData.moldPicture && {
						moldPicture: cleanData.moldPicture,
					}),
					...(cleanData.keepPlace && {
						keepPlace: cleanData.keepPlace,
					}),
				};

				await createMold.mutateAsync(createRequest);
				toast.success('금형이 성공적으로 등록되었습니다.');
			}

			onClose && onClose();
		} catch (error: any) {
			const action = isEditMode ? '수정' : '등록';
			toast.error(
				`${action} 중 오류가 발생했습니다: ${error.response?.data?.message || error.message}`
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	// Prepare initial values for edit mode
	const getInitialValues = () => {
		if (!moldData) return {};

		return {
			moldType: moldData.moldType || '',
			moldName: moldData.moldName || '',
			moldStandard: moldData.moldStandard || '',
			lifeCycle: moldData.lifeCycle || 0,
			moldPrice: moldData.moldPrice || 0,
			safeStock: moldData.safeStock || 0,
			currentStock: moldData.currentStock || 0,
			manageType: moldData.manageType || '',
			moldDesign: moldData.moldDesign || '',
			moldDesignCode: moldData.moldDesignCode || '',
			keepPlace: moldData.keepPlace || '',
		};
	};

	return (
		<div className="max-w-full mx-auto">
			<DynamicForm
				fields={formSchema}
				onSubmit={handleSubmit}
				submitButtonText={isEditMode ? '수정' : '등록'}
				initialData={getInitialValues()}
				otherTypeElements={{
					moldPictureUpload: MoldPictureUploadComponent,
					moldTypeSelect: CodeSelectComponent,
				}}
			/>
		</div>
	);
};

export default MoldRegisterPage;
