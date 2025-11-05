import React, { useEffect, useMemo, useState } from 'react';
import { SinglePageTemplate } from '@repo/moornmo-ui/components';
import { useGroup } from '@esg/hooks/group/useGroup';
import {
	modalFormConfigs,
	columns,
	gridOptions,
} from './configs/CompanyGroupConfig';
import { GroupSelect } from '@esg/components/forms/selects/GroupSelect';
import { useSnackbarNotifier } from '@esg/hooks/utils/UseSnackBar';
import { useDialog } from '@esg/hooks/utils/useDialog';

export const CompanyGroupPage: React.FC = () => {
	const { showSnackbar } = useSnackbarNotifier();
	const { showDialog } = useDialog();
	const [page, setPage] = useState<number>(1);
	const [size, setSize] = useState<number>(30);
	const { create, update, remove, list } = useGroup({
		page: page - 1,
		size: size,
	});
	const makeGridData = (rows: any[]) => {
		const buildTree = (items: any[], parentId: any = null): any[] => {
			return items
				.filter((item: any) => item.parentId === parentId)
				.map((item: any) => {
					const children = buildTree(items, item.groupId);
					return {
						...item,
						_attributes: {
							expanded: true,
						},
						_children: children.length > 0 ? children : undefined,
					};
				});
		};

		return buildTree(rows);
	};

	const data = useMemo(() => {
		const content = list?.data?.content ?? [];
		return makeGridData(content);
	}, [list?.data?.content]);

	return (
		<SinglePageTemplate
			columns={columns}
			gridOptions={gridOptions}
			data={data}
			useModalForCreate={true}
			useModalForEdit={true}
			modalFormConfigs={modalFormConfigs}
			otherTypeElements={{
				groupSelect: GroupSelect,
			}}
			modalTitleKey="그룹"
			usePagination={true}
			onCreate={async (formInstence: any) => {
				// 필드별 검증 트리거
				formInstence.onValidation();
				const formData = formInstence.getFormData();
				// parentId 직접 검증 (0도 유효값 허용)
				if (formData.parentId === null || formData.parentId === undefined || formData.parentId === '') {
					showSnackbar({
						message: '소속을 선택해주세요.',
						severity: 'error',
						duration: 3000,
					});
					throw new Error('Validation failed');
				}
				
				return new Promise((resolve, reject) => {
					create.mutate(
						{ data: formData },
						{
							onSuccess: () => {
								showSnackbar({
									message: '그룹이 성공적으로 등록되었습니다.',
									severity: 'success',
									duration: 3000,
								});
								resolve(); // 성공 시 모달 닫기
							},
							onError: () => {
								showSnackbar({
									message: '그룹 등록에 실패했습니다.',
									severity: 'error',
									duration: 4000,
								});
								reject(new Error('Create failed')); // 실패 시 모달 열어둠
							},
						}
					);
				});
			}}
			onEdit={async (formInstence: any) => {
				// 필드별 검증 트리거
				formInstence.onValidation();
				const formData = formInstence.getFormData();
				// parentId 직접 검증 (0도 유효값 허용)
				if (formData.parentId === null || formData.parentId === undefined || formData.parentId === '') {
					showSnackbar({
						message: '소속을 선택해주세요.',
						severity: 'error',
						duration: 3000,
					});
					throw new Error('Validation failed');
				}
				return new Promise((resolve, reject) => {
					update.mutate(
						{ id: formData.groupId, data: formData },
						{
							onSuccess: () => {
								showSnackbar({
									message: '그룹이 성공적으로 수정되었습니다.',
									severity: 'success',
									duration: 3000,
								});
								resolve(); // 성공 시 모달 닫기
							},
							onError: () => {
								showSnackbar({
									message: '그룹 수정에 실패했습니다.',
									severity: 'error',
									duration: 4000,
								});
								reject(new Error('Update failed')); // 실패 시 모달 열어둠
							},
						}
					);
				});
			}}
			onDelete={(row: any) => {
				const selectedGroupId =
					row?.id ?? row?.groupId ?? row?.group_id ?? row?.groupid;
				if (!selectedGroupId) {
					showSnackbar({
						message: '삭제할 그룹을 선택해주세요.',
						severity: 'error',
						duration: 3000,
					});
					return;
				} else {
					showDialog({
						title: '그룹 삭제 확인',
						content:
							'선택한 그룹을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.',
						confirmText: '삭제',
						cancelText: '취소',
						severity: 'error',
						onConfirm: () => {
							if (selectedGroupId) {
								remove.mutate(Number(selectedGroupId), {
									onSuccess: () => {
										showSnackbar({
											message:
												'그룹이 성공적으로 삭제되었습니다.',
											severity: 'success',
											duration: 3000,
										});
									},
									onError: () => {
										showSnackbar({
											message:
												'그룹 삭제에 실패했습니다.',
											severity: 'error',
											duration: 4000,
										});
									},
								});
							}
						},
					});
				}
			}}
			pageNation={{
				totalItems: list ? list.data?.totalElements : 0,
				itemPerpage: size,
				page: page,
				onPageChange: (page: number) => {
					setPage(page);
				},
			}}
		/>
	);
};
