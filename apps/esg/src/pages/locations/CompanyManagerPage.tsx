import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
	useChargerListQuery,
	useCreateCharger,
	useUpdateCharger,
	useDeleteCharger,
} from '@esg/hooks/charger';
import {
	SplitPanelComponent,
	StyledContainer,
	PaperComponent,
	DynamicFormComponent,
	DynamicFormRef,
	BaseModalComponent,
} from '@repo/moornmo-ui/components';
import { useActionButtons } from '@moornmo/hooks';
import {
	gridOptions,
	columns,
	formConfigs,
} from './configs/CompanyManagerConfig';
import { GroupTreeNavigation } from '@esg/components/treeNavigation';
import { useDialog } from '@esg/hooks/utils/useDialog';
import { ToastoGridComponent } from '@repo/toasto/components/grid';
import { CompanySelect } from '@esg/components/forms/selects/CompanySelect';
import { useSnackbarNotifier } from '@esg/hooks/utils/UseSnackBar';
import { CompanyManager } from '@esg/types/company_manager';

export const CompanyManagerPage: React.FC = () => {
	const { showSnackbar } = useSnackbarNotifier();
	const { showDialog } = useDialog();
	const queryClient = useQueryClient();

	// State Management
	const modalFormRef = useRef<DynamicFormRef>(null);
	const gridRef = useRef<any>(null);
	const [openModal, setOpenModal] = useState(false);
	const [mode, setMode] = useState<'create' | 'edit'>('create');
	const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');
	const [data, setData] = useState<CompanyManager[]>([]);
	const [selectedGridRow, setSelectedGridRow] =
		useState<CompanyManager | null>(null);
	const [editingRow, setEditingRow] = useState<CompanyManager | null>(null);

	// Debug selected row changes (removed verbose logs)
	useEffect(() => {}, [selectedGridRow]);
	useEffect(() => {}, [editingRow]);

	// Data Hooks
	const chargerList = useChargerListQuery(selectedCompanyId);

	// Debug company selection (removed verbose logs)
	useEffect(() => {}, [selectedCompanyId]);
	const { create, update, remove } = {
		create: useCreateCharger(),
		update: useUpdateCharger(),
		remove: useDeleteCharger(),
	};

	// Action Buttons
	const {
		setCreate,
		setEdit,
		setDelete,
		setCreateHandler,
		setEditHandler,
		setDeleteHandler,
	} = useActionButtons();

	// Modal Handlers
	const openCreateModal = () => {
		if (!selectedCompanyId) {
			showSnackbar({
				message: '회사를 선택해주세요.',
				severity: 'info',
				duration: 3000,
			});
			return;
		}
		setMode('create');
		setOpenModal(true);
	};

	const openEditModal = () => {
		// Try to get selected row from grid reference as backup
		let currentSelectedRow = selectedGridRow;

		if (!currentSelectedRow && gridRef.current) {
			try {
				const grid = gridRef.current?.getGridInstance?.();
				if (grid) {
					// 1) Checked rows via checkbox
					const checkedRows = grid.getCheckedRows?.();
					if (checkedRows && checkedRows.length > 0) {
						currentSelectedRow = checkedRows[0];
					}
					// 2) Focused row (when user clicked a row but not checkbox)
					if (!currentSelectedRow && grid.getFocusedCell) {
						const focused = grid.getFocusedCell();
						if (focused && typeof focused.rowKey !== 'undefined') {
							currentSelectedRow = grid.getRow(focused.rowKey);
						}
					}
				}
			} catch {}
		}

		if (!currentSelectedRow && data && data.length > 0) {
			// If no row selected but data exists, ask user to select
			showSnackbar({
				message:
					'테이블에서 수정할 담당자를 먼저 클릭하여 선택해주세요.',
				severity: 'info',
				duration: 4000,
			});
			return;
		}

		if (!currentSelectedRow) {
			showSnackbar({
				message: '수정할 데이터가 없습니다.',
				severity: 'error',
				duration: 3000,
			});
			return;
		}

		setSelectedGridRow(currentSelectedRow);
		setEditingRow(currentSelectedRow);
		setMode('edit');
		setOpenModal(true);
	};

	const onSaveCharger = () => {
		const modalForm = modalFormRef.current;
		if (!modalForm) return;

		// Validate (non-blocking in edit mode to avoid false negatives)
		try {
			modalForm.onValidation?.();
		} catch {}
		try {
			// Do not block save; just warn if form reports invalid
			if (modalForm.isFormValid && !modalForm.isFormValid()) {
				console.warn(
					'⚠️ form reports invalid; proceeding to save anyway'
				);
			}
		} catch {}

		const formData = modalForm.getFormData();

		if (mode === 'create') {
			// ✅ Match exact Swagger example format
			const payload: {
				companyId: number;
				username: any;
				password: any;
				name: any;
				department?: string;
				phone?: string;
				address?: string;
				addressDetail?: string;
			} = {
				companyId: Number(selectedCompanyId),
				username: formData.login_id || 'admin@company.co.kr',
				password: formData.login_password || '1234',
				name: formData.user_name || '담당자',
			};

			// Add optional fields
			if (formData.department) {
				payload.department = String(formData.department);
			}
			if (formData.user_phone) {
				// Format phone number properly: 010-1234-5678
				let phone = formData.user_phone.replace(/[^\d]/g, '');
				if (phone.length === 11) {
					phone = phone.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
				}
				payload.phone = phone || '010-0000-0000';
			}
			if (formData.address) payload.address = formData.address;
			if (formData.addressDetail)
				payload.addressDetail = formData.addressDetail;

			create.mutate(
				payload, // ✅ Fixed: Direct payload, not nested object
				{
					onSuccess: () => {
						showSnackbar({
							message: '담당자가 성공적으로 등록되었습니다.',
							severity: 'success',
							duration: 3000,
						});
						setOpenModal(false);
						// Reset form only if API exists
						try {
							(modalForm as any)?.reset?.();
						} catch {}
						// Refresh list
						queryClient.invalidateQueries({
							queryKey: ['chargerList', selectedCompanyId],
						});
						chargerList.refetch().catch(() => {});
					},
					onError: (error) => {
						console.error('Create error:', error);
						showSnackbar({
							message: '담당자 등록에 실패했습니다.',
							severity: 'error',
							duration: 4000,
						});
					},
				}
			);
		} else if (mode === 'edit' && (selectedGridRow || editingRow)) {
			// ✅ Build FULL DTO for PUT /charger/{id}
			const base = (editingRow || selectedGridRow || {}) as any;
			const resolvedDepartment = (
				formData.department ??
				base.department ??
				''
			).toString();
			let resolvedPhone = (
				formData.user_phone ??
				base.user_phone ??
				base.phone ??
				''
			).toString();
			if (resolvedPhone) {
				const digits = resolvedPhone.replace(/[^\d]/g, '');
				resolvedPhone =
					digits.length === 11
						? digits.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3')
						: resolvedPhone;
			}
			// Send payload EXACTLY as ChargerUpdateRequest
			const targetId = Number((selectedGridRow || editingRow)?.id);
			const updatePayload: any = {
				id: targetId,
				companyId: Number(selectedCompanyId),
				name: (
					formData.user_name ??
					base.name ??
					base.user_name ??
					''
				).toString(),
				department: resolvedDepartment || undefined,
				phone: resolvedPhone || undefined,
				address:
					(formData.address ?? base.address ?? '').toString() ||
					undefined,
				addressDetail:
					(
						formData.addressDetail ??
						base.addressDetail ??
						''
					).toString() || undefined,
				isUse:
					typeof base.is_use === 'boolean'
						? base.is_use
						: typeof base.isUse === 'boolean'
							? base.isUse
							: true,
			};

			// Determine id robustly
			const sourceRow = selectedGridRow || editingRow;
			if (!targetId) {
				showSnackbar({
					message: '선택된 담당자 ID를 찾을 수 없습니다.',
					severity: 'error',
					duration: 3000,
				});
				return;
			}

			update.mutate(
				{ id: targetId, data: updatePayload },
				{
					onSuccess: () => {
						showSnackbar({
							message: '담당자가 성공적으로 수정되었습니다.',
							severity: 'success',
							duration: 3000,
						});
						setOpenModal(false);
						setSelectedGridRow(null);
						// Ensure latest data without breaking logic
						queryClient.invalidateQueries({
							queryKey: ['chargerList', selectedCompanyId],
						});
						chargerList.refetch().catch(() => {});
					},
					onError: (error: any) => {
						console.error('Update error:', error);
						const errMsg =
							(error && (error.errorMessage || error.message)) ||
							'담당자 수정에 실패했습니다.';
						showSnackbar({
							message: errMsg,
							severity: 'error',
							duration: 4000,
						});
					},
				}
			);
		}
	};

	const handleDelete = () => {
		let currentSelectedRow = selectedGridRow;

		// Try to resolve selection from grid if state is empty
		if (!currentSelectedRow && gridRef.current) {
			try {
				const grid = gridRef.current?.getGridInstance?.();
				if (grid) {
					const checkedRows = grid.getCheckedRows?.();
					if (checkedRows && checkedRows.length > 0) {
						currentSelectedRow = checkedRows[0];
					}
					if (!currentSelectedRow && grid.getFocusedCell) {
						const focused = grid.getFocusedCell();
						if (focused && typeof focused.rowKey !== 'undefined') {
							currentSelectedRow = grid.getRow(focused.rowKey);
						}
					}
				}
			} catch {}
		}

		if (!currentSelectedRow) {
			showSnackbar({
				message: '삭제할 담당자를 선택해주세요.',
				severity: 'error',
				duration: 3000,
			});
			return;
		}

		setSelectedGridRow(currentSelectedRow);

		showDialog({
			title: '담당자 삭제 확인',
			content:
				'선택한 담당자를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.',
			confirmText: '삭제',
			cancelText: '취소',
			severity: 'error',
			onConfirm: () => {
				const row = currentSelectedRow;
				if (row) {
					remove.mutate(row.id, {
						onSuccess: () => {
							showSnackbar({
								message: '성공적으로 삭제되었습니다.',
								severity: 'success',
								duration: 3000,
							});
							setSelectedGridRow(null);
						},
						onError: () => {
							showSnackbar({
								message: '삭제에 실패했습니다.',
								severity: 'error',
								duration: 4000,
							});
						},
					});
				}
			},
		});
	};

	// Effects
	useEffect(() => {
		setCreate(true);
		setCreateHandler(openCreateModal);
		setEdit(true);
		setEditHandler(openEditModal);
		setDelete(true);
		setDeleteHandler(handleDelete);
	}, []);

	useEffect(() => {
		setEditHandler(openEditModal);
		setDeleteHandler(handleDelete);
	}, [selectedGridRow]);

	useEffect(() => {
		setCreateHandler(() => {
			if (!selectedCompanyId) {
				showSnackbar({
					message: '회사를 선택해주세요.',
					severity: 'info',
					duration: 3000,
				});
				return;
			}
			openCreateModal();
		});
	}, [selectedCompanyId]);

	// Data Synchronization - Connect charger query to grid data
	useEffect(() => {
		if (chargerList.isLoading) return;
		if (chargerList.isError) {
			setData([]);
			return;
		}
		if (chargerList.data && Array.isArray(chargerList.data)) {
			setData(chargerList.data);
		} else {
			setData([]);
		}
	}, [
		chargerList.data,
		chargerList.isLoading,
		chargerList.isError,
		selectedCompanyId,
	]);

	// Modal Form Data Population for Edit Mode
	useEffect(() => {
		if (openModal && mode === 'edit' && selectedGridRow) {
			const modalForm = modalFormRef.current;
			if (modalForm) {
				modalForm.setFormData({
					user_name: selectedGridRow.name,
					login_id: selectedGridRow.username,
					department: selectedGridRow.department,
					user_phone: selectedGridRow.phone,
					address: (selectedGridRow as any).address ?? '',
					addressDetail: (selectedGridRow as any).addressDetail ?? '',
				});
			}
		}
	}, [mode, openModal, selectedGridRow, selectedCompanyId]);

	// Auto-fill required company field in create mode
	useEffect(() => {
		if (openModal && mode === 'create' && selectedCompanyId) {
			try {
				const modalForm = modalFormRef.current as any;
				modalForm?.setFormData?.({
					company_name: Number(selectedCompanyId),
				});
				modalForm?.onValidation?.();
			} catch {}
		}
	}, [openModal, mode, selectedCompanyId]);

	return (
		<>
			<BaseModalComponent
				open={openModal}
				title={`담당자 ${mode === 'edit' ? '수정' : '등록'}`}
				onSave={onSaveCharger}
				onClose={() => {
					setOpenModal(false);
					setSelectedGridRow(null);
					// Safely reset the form if API is available
					const modalForm = modalFormRef.current as any;
					try {
						modalForm?.reset?.();
					} catch {}
				}}
			>
				<DynamicFormComponent
					ref={modalFormRef}
					config={formConfigs}
					otherTypeElements={{
						companySelect: CompanySelect,
					}}
				/>
			</BaseModalComponent>

			<SplitPanelComponent
				direction="horizontal"
				sizes={[20, 80]}
				minSize={200}
				overflow="hidden"
			>
				<StyledContainer>
					<PaperComponent
						sx={{
							height: '100%',
							padding: '1rem',
							overflow: 'auto',
						}}
						evolution={0}
					>
						<GroupTreeNavigation
							allowTypes={['GROUP', 'COMPANY', 'WORKPLACE']}
							onSelected={(nodeId) => {
								// For now, let's use the nodeId directly and see what happens
								setSelectedCompanyId(nodeId);
								setSelectedGridRow(null); // Clear selection when changing company
							}}
							allowSelectedType={['COMPANY', 'WORKPLACE']}
						/>
					</PaperComponent>
				</StyledContainer>

				<StyledContainer>
					<PaperComponent
						sx={{
							height: '100%',
							overflow: 'auto',
						}}
						evolution={0}
					>
						{chargerList.error ? (
							<div
								style={{
									display: 'flex',
									justifyContent: 'center',
									alignItems: 'center',
									height: '200px',
									color: 'red',
								}}
							>
								데이터 로딩 중 오류가 발생했습니다.
							</div>
						) : (
							<ToastoGridComponent
								columns={columns}
								gridOptions={gridOptions}
								data={(selectedCompanyId ? data : []) as any}
								ref={gridRef}
								onRowCheckChange={(id, row) => {
									setSelectedGridRow(row || null);
								}}
								customEvents={{
									click: (e: any) => {
										try {
											const grid =
												gridRef.current?.getGridInstance?.();
											if (!grid) return;
											const row = grid.getRow(e?.rowKey);
											if (row) setSelectedGridRow(row);
										} catch {}
									},
									dblclick: (e: any) => {
										try {
											const grid =
												gridRef.current?.getGridInstance?.();
											if (!grid) return;
											const row = grid.getRow(e?.rowKey);
											if (row) {
												setSelectedGridRow(row);
												setMode('edit');
												setOpenModal(true);
											}
										} catch {}
									},
								}}
							/>
						)}
					</PaperComponent>
				</StyledContainer>
			</SplitPanelComponent>
		</>
	);
};
