import React, { useEffect, useState, useRef } from 'react';
import {
	DynamicFormComponent,
	DynamicFormRef,
	BaseModalComponent,
} from '@repo/moornmo-ui/components';
import { GroupConfig } from '@moornmo/types';
import { Box } from '@mui/material';
import { useActionButtons } from '@moornmo/hooks';
import {
	ToastoGridComponent,
	BasicToastoGridProps,
} from '@repo/toasto/components/grid';
import { SearchBarTemplate } from './SearchBarTemplate';
import { SearchOption } from '@moornmo/types/searchForm';
import { SideModalComponent } from '../molecules/SideModalComponent';
import { DialogType, useAppContext } from '@falcon/providers';

export interface SinglePageTemplateProps extends BasicToastoGridProps {
	useModalForCreate?: boolean;
	useModalForEdit?: boolean;
	onCreate?: (payload?: any) => void;
	onEdit?: (payload?: any) => void;
	onDelete?: (payload?: any) => void;
	modalTitleKey?: string;
	modalFormConfigs?: GroupConfig[];
	searchAble?: boolean;
	searchConfigs?: SearchOption[];
	searchSubmit?: (e?: any) => void;
	otherTypeElements?: Record<string, React.ElementType>;
	initialFormValues?: Record<string, any>;
	useSideModal?: boolean;
}

export const SinglePageTemplate: React.FC<SinglePageTemplateProps> = ({
	columns,
	gridOptions,
	data = [],
	usePagination,
	pageNation,
	useModalForCreate = false,
	useModalForEdit = false,
	onCreate,
	onEdit,
	onDelete,
	modalTitleKey,
	modalFormConfigs,
	searchAble = false,
	searchConfigs = [],
	searchSubmit = () => {},
	customEvents,
	singleCheck = false,
	otherTypeElements = {},
	initialFormValues = {},
	useSideModal = false,
}) => {
	const gridRef = useRef<any>(null);
	const { config } = useAppContext();
	// runtime dialog mode, starts as default
	const [currentDialogType, setCurrentDialogType] = useState<DialogType>(
		config.dialogType
	);

	const modalFormRef = useRef<DynamicFormRef>(null);
	const sideFormRef = useRef<DynamicFormRef>(null);

	const {
		setCreate,
		setEdit,
		setDelete,
		setCreateHandler,
		setEditHandler,
		setDeleteHandler,
	} = useActionButtons();

	const [mode, setMode] = useState<'create' | 'edit'>('create');
	const [openModal, setOpenModal] = useState(false);
	const [isSideModalOpen, setIsSideModalOpen] = useState(false);
	const [initialValues, setInitialValues] = useState<
		Record<string, any> | undefined
	>(initialFormValues);
	const [selectedGridRow, setSelectedGridRow] = useState(null);

	// CREATE setup
	useEffect(() => {
		setCreate(!!(useModalForCreate && onCreate));
		if (useModalForCreate || onCreate) {
			setCreateHandler(() => {
				if (modalFormConfigs && onCreate) {
					setMode('create');
					// open default or page
					if (config.dialogType === 'side') {
						setCurrentDialogType('side');
						setIsSideModalOpen(true);
						setOpenModal(false);
					} else {
						setCurrentDialogType('popup');
						setOpenModal(true);
						setIsSideModalOpen(false);
					}
				} else {
					onCreate?.();
				}
			});
		}
	}, [
		useModalForCreate,
		modalFormConfigs,
		onCreate,
		setCreate,
		setCreateHandler,
		config.dialogType,
	]);

	// EDIT setup
	useEffect(() => {
		setEdit(!!(useModalForEdit && onEdit));
		if (useModalForEdit || onEdit) {
			setEditHandler(() => {
				if (modalFormConfigs && onEdit) {
					setMode('edit');
					const rows = gridRef.current
						.getGridInstance()
						.getCheckedRows();
					if (rows.length !== 1) {
						alert(
							rows.length === 0
								? '행을 선택해주세요.'
								: '한 행만 선택해주세요.'
						);
						setOpenModal(false);
						setIsSideModalOpen(false);
						return;
					} else {
						setInitialValues(rows[0]);
					}
					setSelectedGridRow(
						gridRef.current.getGridInstance().getRow(rows[0].rowKey)
					);
					// open based on default
					if (config.dialogType === 'side') {
						setCurrentDialogType('side');
						setIsSideModalOpen(true);
						setOpenModal(false);
					} else {
						setCurrentDialogType('popup');
						console.log('modalFormRef', modalFormRef.current);
						setOpenModal(true);
						setIsSideModalOpen(false);
					}
				} else {
					onEdit?.(gridRef.current);
				}
			});
		}
	}, [
		useModalForEdit,
		modalFormConfigs,
		onEdit,
		setEdit,
		setEditHandler,
		config.dialogType,
	]);

	// DELETE setup
	useEffect(() => {
		setDelete(Boolean(onDelete));
		if (onDelete) {
			setDeleteHandler(() => {
				try {
					const grid = gridRef.current?.getGridInstance?.();
					const rows = grid?.getCheckedRows?.() || [];
					if (!rows || rows.length !== 1) {
						alert(rows.length === 0 ? '행을 선택해주세요.' : '한 행만 선택해주세요.');
						return;
					}
					const row = grid.getRow?.(rows[0].rowKey) ?? rows[0];
					setSelectedGridRow(row);
					onDelete(row);
				} catch (e) {
					onDelete(null as any);
				}
			});
		}
	}, [onDelete, selectedGridRow, setDelete, setDeleteHandler]);

	const handleSave = async () => {
		const ref = currentDialogType === 'side' ? sideFormRef : modalFormRef;
		try {
			if (mode === 'create') {
				await onCreate?.(ref.current);
			} else {
				await onEdit?.(ref.current);
			}
			// 성공 시에만 모달 닫기
			setOpenModal(false);
			setIsSideModalOpen(false);
		} catch (error) {
			// 실패 시 모달은 열어둠
			console.error('Save failed:', error);
		}
	};

	return (
		<>
			{modalFormConfigs && (
				<BaseModalComponent
					open={openModal && currentDialogType === 'popup'}
					title={`${modalTitleKey ?? ''} ${mode === 'edit' ? '수정' : '등록'}`}
					onSave={handleSave}
					onClose={() => setOpenModal(false)}
					useSideMode={true}
					setSideModalOpen={(v) => {
						setCurrentDialogType('side');
						setIsSideModalOpen(v);
						setOpenModal(false);
					}}
				>
					<DynamicFormComponent
						ref={modalFormRef}
						config={modalFormConfigs}
						initialValues={initialValues}
						otherTypeElements={otherTypeElements}
					/>
				</BaseModalComponent>
			)}

			<Box sx={{ width: '100%', flex: '1 1 80%' }}>
				<Box
					sx={{
						display: 'flex',
						position: 'relative',
						height: '100%',
					}}
				>
					<Box
						sx={{
							width: isSideModalOpen ? '70%' : '100%',
							pr: isSideModalOpen ? 1 : 0,
							transition: 'width 0.2s',
							height: '100% !important',
						}}
					>
						{searchAble && (
							<SearchBarTemplate
								searchConfigs={searchConfigs}
								searchSubmit={searchSubmit}
							/>
						)}
						<ToastoGridComponent
							ref={gridRef}
							columns={columns}
							data={data}
							gridOptions={gridOptions}
							usePagination={usePagination}
							pageNation={pageNation}
							useSearch={searchAble}
							customEvents={customEvents}
							singleCheck={singleCheck}
							onRowCheckChange={(_id, row) =>
								setSelectedGridRow(row)
							}
						/>
					</Box>

					{useSideModal && modalFormConfigs && (
						<SideModalComponent
							title={`${modalTitleKey ?? ''} ${mode === 'edit' ? '수정' : '등록'}`}
							open={
								isSideModalOpen && currentDialogType === 'side'
							}
							onSave={handleSave}
							onClose={() => setIsSideModalOpen(false)}
							setOpenModal={(v) => {
								setCurrentDialogType('popup');
								setOpenModal(v);
								setIsSideModalOpen(false);
							}}
						>
							<DynamicFormComponent
								ref={sideFormRef}
								config={modalFormConfigs}
								initialValues={initialValues}
								otherTypeElements={otherTypeElements}
								forceFullRow
								formStyle="py-3"
							/>
						</SideModalComponent>
					)}
				</Box>
			</Box>
		</>
	);
};
