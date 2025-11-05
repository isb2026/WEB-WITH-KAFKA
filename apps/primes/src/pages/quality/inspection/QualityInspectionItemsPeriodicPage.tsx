import React, { useState, useMemo, useEffect } from 'react';
import { Plus, Trash2, Search, Upload } from 'lucide-react';
import { PageTemplate } from '@primes/templates';
import DatatableComponent from '@primes/components/datatable/DatatableComponent';
import { useDataTable } from '@repo/radix-ui/hook';
import { RadixIconButton, DraggableDialog } from '@repo/radix-ui/components';
import { RadixButton } from '@repo/radix-ui/components';
import { useTranslation } from '@repo/i18n';
import { inspectionData, classificationData, mockImages } from '../mock-data';
import { ImageGallery } from '@repo/swiper';
import { useResponsive, useTheme } from '@primes/hooks';
import { FloraEditor } from '@repo/flora-editor';
import { DeleteConfirmDialog } from '@primes/components/common/DeleteConfirmDialog';
import { DynamicForm } from '@primes/components/form/DynamicFormComponent';
import { useInspectionPeriodicFormSchema } from '@primes/schemas/inspection';
import { UseFormReturn } from 'react-hook-form';
import { useRef } from 'react';

const QualityInspectionItemsPeriodicPage: React.FC = () => {
	const { t } = useTranslation('dataTable');
	const { t: tCommon } = useTranslation('common');
	const { isMobile, isTablet, isDesktop } = useResponsive();
	const { theme } = useTheme(); // 'dark' or 'light'

	// Get the form schema using the hook
	const inspectionPeriodicFormSchema = useInspectionPeriodicFormSchema();

	// Column definitions
	const classificationColumns = useMemo(
		() => [
			{
				accessorKey: 'itemName',
				header: t('columns.itemName'),
				size: 180,
			},
			{
				accessorKey: 'itemNo',
				header: t('columns.itemNo'),
				size: 120,
			},
			{
				accessorKey: 'itemSpec',
				header: t('columns.itemSpec'),
				size: 150,
			},
		],
		[t]
	);

	const inspectionColumns = useMemo(
		() => [
			{
				accessorKey: 'itemName',
				header: t('columns.itemName'),
				size: 150,
			},
			{
				accessorKey: 'inspectionCriteria',
				header: t('columns.inspectionCriteria'),
				size: 150,
			},
			{
				accessorKey: 'specification',
				header: t('columns.specification'),
				size: 120,
			},
			{
				accessorKey: 'upperLimit',
				header: t('columns.upperLimit'),
				size: 80,
			},
			{
				accessorKey: 'lowerLimit',
				header: t('columns.lowerLimit'),
				size: 80,
			},
			{
				accessorKey: 'inspectionCount',
				header: t('columns.inspectionCount'),
				size: 80,
			},
			{
				accessorKey: 'judgmentCriteria',
				header: t('columns.judgmentCriteria'),
				size: 100,
			},
			{
				accessorKey: 'precautions',
				header: t('columns.precautions'),
				size: 150,
			},
			{
				accessorKey: 'inspectionEquipment',
				header: t('columns.inspectionEquipment'),
				size: 150,
			},
		],
		[t]
	);

	// State management
	const [editorContent, setEditorContent] = useState('');
	const [uploadedImages, setUploadedImages] = useState<string[]>([]);
	const [activeSlideIndex, setActiveSlideIndex] = useState(0);
	const [openAddDialog, setOpenAddDialog] = useState(false);
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const formMethodsRef = useRef<UseFormReturn<
		Record<string, unknown>
	> | null>(null);

	const allImages = [...mockImages, ...uploadedImages];

	// Event handlers
	const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const files = event.target.files;
		if (!files) return;

		const newImages: string[] = [];
		Array.from(files).forEach((file) => {
			if (file.type.startsWith('image/')) {
				newImages.push(URL.createObjectURL(file));
			}
		});

		if (newImages.length > 0) {
			const currentTotalImages =
				mockImages.length + uploadedImages.length;
			setUploadedImages((prev) => [...prev, ...newImages]);
			setActiveSlideIndex(currentTotalImages);
		}
	};

	const handleAdd = () => setOpenAddDialog(true);
	const handleDelete = () =>
		inspectionTable.selectedRows.size > 0 && setOpenDeleteDialog(true);

	const handleInspectionFormSubmit = (data: Record<string, unknown>) => {
		const newItem = {
			id: Date.now(),
			itemName: (data.itemName as string) ?? '',
			inspectionCriteria: (data.inspectionCriteria as string) ?? '',
			specification: (data.specification as string) ?? '',
			upperLimit: (data.upperLimit as string) ?? '',
			lowerLimit: (data.lowerLimit as string) ?? '',
			inspectionCount: (data.inspectionCount as string) ?? '',
			judgmentCriteria: (data.judgmentCriteria as string) ?? '',
			precautions: (data.precautions as string) ?? '',
			inspectionEquipment: (data.inspectionEquipment as string) ?? '',
		};
		console.log('New inspection item:', newItem);
		setOpenAddDialog(false);
	};

	const handleDeleteConfirm = () => {
		setOpenDeleteDialog(false);
		// TODO: Remove from inspection data
	};

	const handleFormReady = (
		methods: UseFormReturn<Record<string, unknown>>
	) => {
		formMethodsRef.current = methods;
	};

	// Table setup
	const classificationTable = useDataTable(
		classificationData,
		classificationColumns,
		10,
		1,
		0,
		classificationData.length
	);

	const inspectionTable = useDataTable(
		inspectionData,
		inspectionColumns,
		10,
		1,
		0,
		inspectionData.length
	);

	// Cleanup uploaded image URLs on unmount
	useEffect(() => {
		return () => {
			uploadedImages.forEach((url) => {
				if (url.startsWith('blob:')) URL.revokeObjectURL(url);
			});
		};
	}, [uploadedImages]);

	const LeftSidebar = () => (
		<div className="h-full flex flex-col">
			<div className="flex-1 overflow-hidden">
				<DatatableComponent
					table={classificationTable.table}
					columns={classificationColumns}
					data={classificationData}
					tableTitle={tCommon(
						'pages.titles.inspectionClassification'
					)}
					rowCount={classificationData.length}
					useSearch={false}
					usePageNation={false}
					selectedRows={classificationTable.selectedRows}
					toggleRowSelection={classificationTable.toggleRowSelection}
					headerOffset="210px"
					actionButtons={
						<div className="flex gap-1">
							<RadixButton
								variant="outline"
								className={`flex gap-1 px-2.5 py-1.5 rounded-lg ${isMobile ? 'text-xs' : 'text-sm'} items-center border bg-Colors-Brand-700 text-white`}
							>
								<Search
									size={isMobile ? 14 : 16}
									className="text-muted-foreground text-white"
								/>
								{tCommon('table.search.searchF3')}
							</RadixButton>
						</div>
					}
				/>
			</div>
		</div>
	);

	const RightMainPanel = () => (
		<div className="h-full flex flex-col gap-2">
			{/* Main Inspection Table */}
			<div className="overflow-hidden border rounded-lg">
				<div className="h-full flex flex-col">
					<DatatableComponent
						table={inspectionTable.table}
						columns={inspectionColumns}
						data={inspectionData}
						tableTitle={tCommon('pages.titles.inspectionItems')}
						rowCount={inspectionData.length}
						useSearch={false}
						usePageNation={false}
						selectedRows={inspectionTable.selectedRows}
						toggleRowSelection={(rowId: string) => {
							inspectionTable.toggleRowSelection(rowId);
							// 선택된 행의 데이터 저장
							const isCurrentlySelected =
								inspectionTable.selectedRows.has(rowId);
							if (!isCurrentlySelected) {
								inspectionData.find(
									(_, index) => index.toString() === rowId
								);
							}
						}}
						headerOffset="600px"
						actionButtons={
							<div className="flex justify-end gap-2">
								<RadixIconButton
									onClick={handleAdd}
									className={`flex gap-1.5 px-2.5 py-1.5 rounded-lg ${isMobile ? 'text-xs' : 'text-sm'} items-center border `}
								>
									<Plus size={14} />
									{tCommon('tabs.actions.add')}
								</RadixIconButton>
								<RadixIconButton
									onClick={handleDelete}
									disabled={
										inspectionTable.selectedRows.size === 0
									}
									className={`flex gap-1.5 px-2.5 py-1.5 rounded-lg ${isMobile ? 'text-xs' : 'text-sm'} items-center border ${inspectionTable.selectedRows.size === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
								>
									<Trash2 size={16} />
									{tCommon('delete')}
								</RadixIconButton>
							</div>
						}
					/>
				</div>
			</div>

			{/* Bottom Split: Image Viewer + Formula Editor - Responsive */}
			<div
				className={`flex-1 flex gap-2 ${isMobile ? 'flex-col h-auto' : 'h-60'}`}
			>
				{/* Image Viewer */}
				<div
					className={`${isMobile ? 'w-full h-48' : isTablet ? 'w-1/2' : 'w-1/2'} flex flex-col border rounded-lg overflow-hidden`}
				>
					<div className="px-2 py-2 border-b flex items-center justify-between">
						<div className="text-base font-bold">
							{tCommon('tabs.actions.ProgressImageViewer')}
						</div>
						<RadixIconButton
							onClick={() =>
								document.getElementById('image-upload')?.click()
							}
							className={`flex gap-1.5 px-2 py-1.5 rounded-lg ${isMobile ? 'text-xs' : 'text-sm'} items-center border hover:bg-gray-50`}
						>
							<Upload size={14} />
						</RadixIconButton>
						<input
							id="image-upload"
							type="file"
							multiple
							accept="image/*"
							onChange={handleImageUpload}
							className="hidden"
						/>
					</div>
					<ImageGallery
						images={allImages}
						className=""
						mainSwiperClassName="rounded-lg overflow-hidden"
						thumbsSwiperClassName=""
						showNavigation={true}
						spaceBetween={10}
						thumbsPerView={isMobile ? 2 : 4}
						initialSlide={activeSlideIndex}
					/>
				</div>

				{/* Rich Text Editor */}
				<div
					className={`${isMobile ? 'w-full' : isTablet ? 'w-1/2' : 'w-1/2'} flex flex-col border rounded-lg`}
				>
					<div className="px-2 py-2.5 border-b">
						<div className="text-base font-bold">
							{tCommon('tabs.actions.formulaEditor')}
						</div>
					</div>
					<FloraEditor
						value={editorContent}
						onChange={setEditorContent}
						placeholder="Enter your formula, notes, or rich text content..."
						className="h-full"
						isDesktop={isDesktop}
						theme={theme}
					/>
				</div>
			</div>
		</div>
	);

	return (
		<div className={`max-w-full mx-auto h-full flex flex-col`}>
			{/* Main Layout - Stack on mobile, side-by-side on desktop */}
			{isMobile || isTablet ? (
				<div className="flex-1 flex flex-col gap-4">
					{/* Mobile/Tablet Stack Layout */}
					<div
						className={`border rounded-lg ${isMobile ? 'h-80' : 'h-96'}`}
					>
						<LeftSidebar />
					</div>
					<div className="flex-1">
						<RightMainPanel />
					</div>
				</div>
			) : (
				/* Desktop Layout */
				<PageTemplate
					firstChildWidth="25%"
					splitterSizes={[25, 75]}
					splitterMinSize={[300, 600]}
					splitterGutterSize={6}
				>
					<div className="border rounded-lg h-full">
						<LeftSidebar />
					</div>
					<div className="">
						<RightMainPanel />
					</div>
				</PageTemplate>
			)}

			{/* Add Dialog */}
			<DraggableDialog
				open={openAddDialog}
				onOpenChange={(open: boolean) => {
					setOpenAddDialog(open);
				}}
				title={tCommon('tabs.actions.add')}
				content={
					<DynamicForm
						onFormReady={handleFormReady}
						fields={inspectionPeriodicFormSchema.map((field) => ({
							...field,
							disabled: false, // TODO: Add loading state from create mutation
						}))}
						onSubmit={handleInspectionFormSubmit}
						submitButtonText={tCommon('save')}
						visibleSaveButton={true}
					/>
				}
			/>

			{/* Delete Confirmation Dialog */}
			<DeleteConfirmDialog
				isOpen={openDeleteDialog}
				onOpenChange={setOpenDeleteDialog}
				onConfirm={handleDeleteConfirm}
				title="검사 항목 삭제"
				description={`선택된 ${inspectionTable.selectedRows.size}개의 항목을 삭제하시겠습니까?`}
			/>
		</div>
	);
};

export default QualityInspectionItemsPeriodicPage;
