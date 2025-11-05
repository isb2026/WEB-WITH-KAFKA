import React, { useEffect, useState, useRef } from 'react';
import {
	SplitPanelComponent,
	StyledContainer,
	PaperComponent,
	BaseModalComponent,
	DynamicFormRef,
	DynamicFormComponent,
} from '@repo/moornmo-ui/components';
import {
	ToastoGridComponent,
	BasicToastoGridProps,
} from '@repo/toasto/components/grid';
import { useActionButtons } from '@moornmo/hooks';
import { createCompanyPayload } from '@esg/types/company';
import {
	columns,
	gridOptions,
	modalFormConfigs,
} from './configs/WorkPlaceConfig';
import { useSnackbarNotifier } from '@esg/hooks/utils/UseSnackBar';
import { useDialog } from '@esg/hooks/utils/useDialog';
import { GroupTreeNavigation } from '@esg/components/treeNavigation';
import { useGroupCompaniesListQuery } from '@esg/hooks/group/useGroupCompaniesListQuery';
import { useCompany } from '@esg/hooks/company';

export const WorkPlacePage: React.FC = () => {
	const { showSnackbar } = useSnackbarNotifier();
	const { showDialog } = useDialog();

	const {
		setCreate,
		setEdit,
		setDelete,
		setCreateHandler,
		setEditHandler,
		setDeleteHandler,
	} = useActionButtons();
	const gridRef = useRef<any>(null);
	const modalFormRef = useRef<DynamicFormRef>(null);
	const [data, setData] = useState<any[]>([]);
	// const [page, setPage] = useState<number>(1);
	// const [size, setSize] = useState<number>(30);
	const [mode, setMode] = useState<'create' | 'edit'>('create');
	const [openModal, setOpenModal] = useState(false);
	const [selectedGridRow, setSelectedGridRow] = useState<null | any>(null);
	const [selectedGroupId, setSelectedGroupId] = useState<null | number>(null);
	const groupCompaniesList = useGroupCompaniesListQuery(selectedGroupId);
	const { create, update, remove } = useCompany();

	const openCreateModal = () => {
		setMode('create');
		setOpenModal(true);
	};

	const openEditModal = () => {
		if (!selectedGridRow) return alert('수정할 항목을 선택해주세요.');
		setMode('edit');
		setOpenModal(true);
	};

	const onSaveCompany = () => {
		if (modalFormRef.current) {
			const FormData = modalFormRef.current.getFormData();
			const payload: createCompanyPayload = {
				...FormData,
				companyType: 'WORKPLACE',
				groupId: selectedGroupId,
				address: FormData.address?.roadAddress,
				addressDetail: FormData.address?.detailAddress
					? FormData.address?.detailAddress
					: null,
				postcode: FormData.address.zipCode
					? Number(FormData.address.zipCode)
					: null,
			};
			if (mode == 'create') {
				create.mutate(
					{ data: payload },
					{
						onSuccess: () => {
							showSnackbar({
								message: '성공적으로 등록되었습니다.',
								severity: 'success',
								duration: 3000,
							});
						},
						onError: () => {
							showSnackbar({
								message: '등록에 실패했습니다.',
								severity: 'error',
								duration: 4000,
							});
						},
					}
				);
			} else if (mode == 'edit') {
				update.mutate(
					{ id: selectedGridRow.id, data: payload },
					{
						onSuccess: () => {
							showSnackbar({
								message: '성공적으로 수정되었습니다.',
								severity: 'success',
								duration: 3000,
							});
						},
						onError: () => {
							showSnackbar({
								message: '수정에 실패했습니다.',
								severity: 'error',
								duration: 4000,
							});
						},
					}
				);
			}

			setOpenModal(false);
		}
	};

	const handleDelete = () => {
		if (!selectedGridRow) {
			showSnackbar({
				message: '삭제할 사업장을 선택해주세요.',
				severity: 'error',
				duration: 3000,
			});
			return;
		}

		showDialog({
			title: '사업장 삭제 확인',
			content:
				'선택한 사업장를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.',
			confirmText: '삭제',
			cancelText: '취소',
			severity: 'error',
			onConfirm: () => {
				const selectedCompanyId = selectedGridRow?.id;
				if (selectedCompanyId) {
					remove.mutate(Number(selectedCompanyId), {
						onSuccess: () => {
							showSnackbar({
								message: '성공적으로 삭제되었습니다.',
								severity: 'success',
								duration: 3000,
							});
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
			if (!selectedGroupId) {
				showSnackbar({
					message: '그룹을 선택해주세요.',
					severity: 'info',
					duration: 3000,
				});
				return;
			}
			openCreateModal();
		});
	}, [selectedGroupId]);

	useEffect(() => {
		if (groupCompaniesList.data) {
			const _data = groupCompaniesList.data.filter((d: any) => {
				return d.companyType == 'WORKPLACE';
			});
			setData(_data);
		}
	}, [groupCompaniesList.data]);

	useEffect(() => {
		if (openModal && mode == 'edit' && selectedGridRow) {
			const modalForm = modalFormRef.current;
			if (modalForm) {
				modalForm.setFormData({
					...selectedGridRow,
					groupId: selectedGroupId,
					address: {
						zipCode: selectedGridRow?.postcode,
						roadAddress: selectedGridRow?.address,
						detailAddress: selectedGridRow?.addressDetail,
					},
				});
			}
		}
	}, [mode, openModal]);

	return (
		<>
			<BaseModalComponent
				open={openModal}
				title={`사업장 ${mode === 'edit' ? '수정' : '등록'}`}
				onSave={() => {
					onSaveCompany();
				}}
				onClose={() => setOpenModal(false)}
			>
				<DynamicFormComponent
					ref={modalFormRef}
					config={modalFormConfigs}
				/>
			</BaseModalComponent>
			<SplitPanelComponent
				direction="horizontal"
				sizes={[20, 80]}
				minSize={200}
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
							allowTypes={['GROUP', 'WORKPLACE']}
							onSelected={(groupId) => {
								setSelectedGroupId(Number(groupId));
							}}
							allowSelectedType={['GROUP']}
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
						<ToastoGridComponent
							columns={columns}
							gridOptions={gridOptions}
							data={data}
							ref={gridRef}
							onRowCheckChange={(id, row) => {
								setSelectedGridRow(row);
								console.log('row', row);
							}}
						/>
						{/* <SinglePageTemplate
						columns={columns}
						gridOptions={gridOptions}
						data={data}
						modalFormConfigs={modalFormConfigs}
						useModalForCreate={true}
						useModalForEdit={true}
						modalTitleKey="사업장"
						useSideModal={true}
						onCreate={(form) => {
							const formData = form.getFormData();
							const payload = {
								groupId: selectedGroupId,
								companyType: 'COMPANY',
								...formData,
								address: formData.address?.roadAddress,
								postcode: Number(formData.address?.zipCode),
								addressDetail: formData.address?.detailAddress,
							};
							create.mutate(
								{ data: payload },
								{
									onSuccess: () => {
										showSnackbar({
											message:
												'사업장이 성공적으로 등록되었습니다.',
											severity: 'success',
											duration: 3000,
										});
									},
									onError: () => {
										showSnackbar({
											message:
												'사업장 등록에 실패했습니다.',
											severity: 'error',
											duration: 4000,
										});
									},
								}
							);
						}}
						onEdit={(e) => {}}
						onDelete={(row) => {
							const selectedCompanyId = row?.id;
							if (!selectedCompanyId) {
								showSnackbar({
									message: '삭제할 사업장를 선택해주세요.',
									severity: 'error',
									duration: 3000,
								});
								return;
							} else {
								showDialog({
									title: '사업장 삭제 확인',
									content:
										'선택한 사업장을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.',
									confirmText: '삭제',
									cancelText: '취소',
									severity: 'error',
									onConfirm: () => {
										if (selectedCompanyId) {
											remove.mutate(
												Number(selectedCompanyId),
												{
													onSuccess: () => {
														showSnackbar({
															message:
																'성공적으로 삭제되었습니다.',
															severity: 'success',
															duration: 3000,
														});
													},
													onError: () => {
														showSnackbar({
															message:
																'삭제에 실패했습니다.',
															severity: 'error',
															duration: 4000,
														});
													},
												}
											);
										}
									},
								});
							}
						}}
					/> */}
					</PaperComponent>
				</StyledContainer>
			</SplitPanelComponent>
		</>
	);
};
