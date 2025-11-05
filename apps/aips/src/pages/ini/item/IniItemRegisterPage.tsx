import { useState } from 'react';

import { useItem } from '@primes/hooks';
import { useFileUpload } from '@primes/hooks/common/useFileUpload';
import { toast } from 'sonner';
import { Item } from '@primes/types/item';
import { useTranslation } from '@repo/i18n';
import { UseFormReturn } from 'react-hook-form';
import {
	DynamicForm,
	FormField,
} from '@aips/components/form/DynamicFormComponent';

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
	const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(
		itemsData?.imageUrl || null
	);
	const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
	const { create, update } = useItem({ page: 0, size: 30 });
	const { uploadState, handleFileUpload, resetUpload } = useFileUpload();
	const { t } = useTranslation('dataTable');
	const { t: tCommon } = useTranslation('common');
	const editMode: boolean = !!itemsData;

	const formSchema: FormField[] = [
		{
			name: 'itemNo',
			label: t('columns.itemNo'),
			type: 'number',
			required: false,
		},
		{
			name: 'itemNumber',
			label: t('columns.itemNumber'),
			type: 'text',
			required: false,
			maxLength: 45,
		},
		{
			name: 'itemName',
			label: t('columns.itemName'),
			type: 'text',
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
			required: false,
			maxLength: 45,
		},
		{
			name: 'itemType1',
			label: t('columns.itemType1'),
			type: 'text',
			required: false,
			maxLength: 3,
		},
		{
			name: 'itemType2',
			label: t('columns.itemType2'),
			type: 'text',
			required: false,
			maxLength: 3,
		},
		{
			name: 'itemType3',
			label: t('columns.itemType3'),
			type: 'text',
			required: false,
			maxLength: 3,
		},
		{
			name: 'itemUnit',
			label: t('columns.itemUnit'),
			type: 'text',
			required: false,
			maxLength: 3,
		},
		{
			name: 'lotSize',
			label: t('columns.lotSize'),
			type: 'text',
			required: false,
			maxLength: 3,
		},
	];

	// File upload handler
	const handleImageUpload = async (files: File[]) => {
		if (files.length === 0) return;

		// Check if adding new files would exceed the limit
		const newFilesCount = files.length;
		const currentFilesCount = uploadedFiles.length;

		if (currentFilesCount + newFilesCount > 3) {
			toast.error(tCommon('fileUpload.maxImagesError'));
			return;
		}

		// Process each file
		const newUploadedFiles = [...uploadedFiles];

		for (const file of files) {
			// Store the actual file for preview
			newUploadedFiles.push(file);

			const result = await handleFileUpload(file);

			if (result) {
				// For now, store the first image URL (you may want to store multiple URLs)
				if (!uploadedImageUrl) {
					setUploadedImageUrl(result.data.filePath);
				}
			}
		}

		setUploadedFiles(newUploadedFiles);
		toast.success(
			tCommon('fileUpload.uploadSuccess', { count: files.length })
		);
	};

	const handleSubmit = async (data: IniItemRegisterData) => {
		if (isSubmitting) return;

		setIsSubmitting(true);

		// Include uploaded image URL in the form data
		const formDataWithImage = {
			...data,
			imageUrl: uploadedImageUrl || undefined,
		};

		if (editMode) {
			console.log('itemsData', itemsData);
			console.log('submitData', formDataWithImage);
			const id = Number(data.id);
			update.mutate(
				{
					id: id,
					data: formDataWithImage,
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
				await create.mutateAsync({ data: formDataWithImage } as any);
				toast.success('등록이 완료되었습니다.');
				onClose && onClose();
			} catch (error) {
				console.error('등록 실패:', error);
				toast.error('등록 중 오류가 발생했습니다.');
			} finally {
				setIsSubmitting(false);
			}
		}
	};

	return (
		<div className="max-w-full mx-auto space-y-6">
			{/* Product Image Upload Section */}
			<div className="flex items-center mb-4">
				<label className="w-32 text-sm font-medium text-gray-700">
					{tCommon('fileUpload.productImage')}
				</label>
				<div className="flex-1">
					{/* Custom File Upload Row Style */}
					<div className="flex items-center gap-3 p-3 border rounded-md hover:border-Colors-Brand-500 transition-colors">
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
								document.getElementById('file-input')?.click()
							}
							className="px-4 py-2 text-sm bg-Colors-Brand-700 text-white rounded hover:bg-Colors-Brand-800 transition-colors"
						>
							{tCommon('fileUpload.selectFile')}
						</button>
					</div>

					{/* Hidden File Input */}
					<input
						id="file-input"
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
														URL.createObjectURL(
															file
														);
													window.open(
														blobUrl,
														'_blank'
													);
												}}
												title={tCommon(
													'fileUpload.clickToView'
												)}
											>
												<img
													src={URL.createObjectURL(
														file
													)}
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
														if (
															file.name.length >
															50
														) {
															const extension =
																file.name
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
													{(
														file.size /
														1024 /
														1024
													).toFixed(2)}{' '}
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
												onClick={() => {
													const newFiles =
														uploadedFiles.filter(
															(_, i) =>
																i !== index
														);
													setUploadedFiles(newFiles);
													if (newFiles.length === 0) {
														setUploadedImageUrl(
															null
														);
														resetUpload();
													}
													const fileInput =
														document.getElementById(
															'file-input'
														) as HTMLInputElement;
													if (fileInput)
														fileInput.value = '';
												}}
												className="p-2 text-red-400 hover:text-red-600 transition-colors"
												title={tCommon(
													'fileUpload.delete'
												)}
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

							{/* Show warning if more than 3 images */}
							{uploadedFiles.length > 3 && (
								<div className="p-2 bg-yellow-50 border border-yellow-200 rounded-md">
									<p className="text-sm text-yellow-800">
										{tCommon('fileUpload.previewLimit', {
											total: uploadedFiles.length,
										})}
									</p>
								</div>
							)}
						</div>
					)}
				</div>
			</div>

			{/* Item Form */}
			<DynamicForm
				onFormReady={onFormReady}
				fields={formSchema}
				onSubmit={handleSubmit}
			/>
		</div>
	);
};

export default IniItemRegisterPage;
