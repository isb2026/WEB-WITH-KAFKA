import React, { useRef, useState, useMemo, useEffect } from 'react';
import {
	StyledContainer,
	SplitPanelComponent,
} from '@repo/moornmo-ui/components';
import {
	detailGridColumns,
	detailGridOptions,
	formConfigs,
} from './configs/CollectAccountConfig';
import { Paper } from '@mui/material';

import { SinglePageTemplate } from '@repo/moornmo-ui/components';
import { GroupTreeNavigation } from '@esg/components/treeNavigation';
import { useAccount } from '@esg/hooks/account/useAccount';
import {
	CompanySelect,
	AccountStyleSelect,
	ChargerSelect,
} from '@esg/components/forms/selects';
import { useAccountStyleField } from '@esg/hooks/accountStyle/useAccountStyleFieldQuery';
import { CompanyAccountSelect } from '@esg/components/forms/selects/CompanyAccountSelect';
import { useSnackbarNotifier } from '@esg/hooks/utils/UseSnackBar';
import { useDialog } from '@esg/hooks/utils/useDialog';
import { AccountDashboardPage } from './AccountDashboardPage';

export const AccountPage: React.FC = () => {
	const detailGridRef = useRef<any>(null);
	const [gridData, setGridData] = useState<any[]>([]);
	const [selectedRow, setSelectedRow] = useState<any | null>(null);
	const [selectedCompId, setSelectedCompId] = useState<null | string>(null);
	const [page, setPage] = useState<number>(0);
	const [showDashboard, setShowDashboard] = useState<boolean>(false);
	const [selectedAccountForDashboard, setSelectedAccountForDashboard] =
		useState<any | null>(null);
	const { list, create, update, remove } = useAccount({
		page: page,
		size: 30,
		searchRequest: selectedCompId
			? {
					companyId: Number(selectedCompId),
				}
			: undefined,
	});
	const { showSnackbar } = useSnackbarNotifier();
	const { showDialog } = useDialog();

	useEffect(() => {
		if (!selectedCompId) return setGridData([]);
		if (list.data?.content) {
			const _list = list.data.content.map((item: any) => {
				const style = item.accountStyle;
				const dataType = style.dataType;

				return {
					...item,
					scope: dataType.ghgScope ?? '',
					unit: dataType.uom ?? '',
					useMeter: item.meterId ? 'Y' : 'N',
					account_style_name: item.accountStyle?.caption ?? '',
					chargerId: item.charger?.id,
					chargerUsername: item.charger?.username,
					chargerName: item.charger?.name,
					chargerDepartment: item.charger?.department,
				};
			});
			setGridData(_list);
		}
	}, [list.data, selectedCompId]);

	// 관리항목명 클릭 핸들러
	const handleAccountNameClick = (accountData: any) => {
		setSelectedAccountForDashboard(accountData);
		setShowDashboard(true);
	};

	// 대시보드에서 뒤로가기 핸들러
	const handleBackFromDashboard = () => {
		setShowDashboard(false);
		setSelectedAccountForDashboard(null);
	};

	// 대시보드 모드일 때 대시보드 컴포넌트 렌더링
	if (showDashboard && selectedAccountForDashboard) {
		return (
			<AccountDashboardPage
				accountData={selectedAccountForDashboard}
				onBack={handleBackFromDashboard}
			/>
		);
	}

	return (
		<SplitPanelComponent
			direction={'horizontal'}
			sizes={[20, 80]}
			minSize={200}
			onDrag={(e) => {
				if (detailGridRef.current) {
					detailGridRef.current.getGridInstance().refreshLayout();
				}
			}}
		>
			<StyledContainer>
				<Paper
					sx={{
						height: '100%',
						width: '100%',
						overflow: 'hidden',
					}}
					className="p-3"
				>
					<GroupTreeNavigation
						allowTypes={['GROUP', 'COMPANY', 'WORKPLACE']}
						onSelected={(id) => {
							setSelectedCompId(id);
							// setSelectedCompId(id);
						}}
						allowSelectedType={['COMPANY', 'WORKPLACE']}
					/>
				</Paper>
			</StyledContainer>
			<SinglePageTemplate
				columns={detailGridColumns}
				gridOptions={detailGridOptions}
				data={gridData}
				modalTitleKey={'관리항목'}
				useModalForCreate={true}
				useModalForEdit={true}
				customEvents={{
					click: (e: any) => {
						const idx =
							typeof e?.rowKey === 'number' ? e.rowKey : -1;
						if (idx >= 0 && idx < gridData.length) {
							const clickedRow = gridData[idx];
							setSelectedRow(clickedRow);

							// 관리항목명 컬럼 클릭 시 대시보드 열기
							if (e?.columnName === 'name') {
								handleAccountNameClick(clickedRow);
							}
						}
					},
					check: (e: any) => {
						const idx =
							typeof e?.rowKey === 'number' ? e.rowKey : -1;
						if (idx >= 0 && idx < gridData.length)
							setSelectedRow(gridData[idx]);
					},
				}}
				onCreate={(formRef) => {
					if (formRef) {
						try {
							const payload = formRef.getFormData();
							create.mutate(
								{
									data: {
										...payload,
										accountStyleId: Number(
											payload.accountStyleId
										),
										companyId: Number(payload.companyId),
										chargerId: payload.chargerId
											? Number(payload.chargerId)
											: undefined,
										chargerUsername:
											payload.chargerId || undefined,
									},
								},
								{
									onSuccess: () => {
										showSnackbar({
											message:
												'관리항목이 성공적으로 등록되었습니다.',
											severity: 'success',
											duration: 3000,
										});
									},
									onError: () => {
										showSnackbar({
											message:
												'관리항목 등록에 실패했습니다.',
											severity: 'error',
											duration: 4000,
										});
									},
								}
							);
						} catch (error) {}
					}
				}}
				onEdit={(formRef) => {
					if (!formRef) return;
					try {
						const payload = formRef.getFormData();
						const row = selectedRow;
						const id = row?.id ?? payload.id;
						if (!id) return;
						const updateBody = {
							id: Number(id),
							accountStyleId: Number(
								payload.accountStyleId ??
									row?.accountStyleId ??
									row?.accountStyle?.id
							),
							meterId: payload.meterId
								? Number(payload.meterId)
								: undefined,
							isUse:
								typeof row?.isUse === 'boolean'
									? row.isUse
									: true,
							name: String(payload.name ?? row?.name ?? ''),
							supplier: payload.supplier
								? String(payload.supplier)
								: undefined,
							companyId: Number(
								payload.companyId ??
									selectedCompId ??
									row?.companyId
							),
							chargerId: payload.chargerId
								? Number(payload.chargerId)
								: undefined,
							chargerUsername: payload.chargerId || undefined,
						};
						update.mutate(
							{ id: Number(id), data: updateBody },
							{
								onSuccess: () => {
									showSnackbar({
										message:
											'관리항목이 성공적으로 수정되었습니다.',
										severity: 'success',
										duration: 3000,
									});
								},
								onError: () => {
									showSnackbar({
										message:
											'관리항목 수정에 실패했습니다.',
										severity: 'error',
										duration: 4000,
									});
								},
							}
						);
					} catch {}
				}}
				onDelete={(rowParam) => {
					const target =
						rowParam && rowParam.id ? rowParam : selectedRow;
					if (!target || !target.id) {
						showSnackbar({
							message: '삭제할 관리항목을 선택해주세요.',
							severity: 'error',
							duration: 3000,
						});
						return;
					}
					showDialog({
						title: '관리항목 삭제 확인',
						content:
							'선택한 관리항목을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.',
						confirmText: '삭제',
						cancelText: '취소',
						severity: 'error',
						onConfirm: () => {
							remove.mutate(Number(target.id), {
								onSuccess: () => {
									showSnackbar({
										message:
											'관리항목이 성공적으로 삭제되었습니다.',
										severity: 'success',
										duration: 3000,
									});
									setSelectedRow(null);
								},
								onError: () => {
									showSnackbar({
										message:
											'관리항목 삭제에 실패했습니다.',
										severity: 'error',
										duration: 4000,
									});
								},
							});
						},
					});
				}}
				initialFormValues={{
					supplier: null,
					meterId: null,
					companyId: selectedCompId,
					unit: 'unit',
				}}
				modalFormConfigs={formConfigs}
				otherTypeElements={{
					companySelect: CompanySelect,
					accountSelect: CompanyAccountSelect,
					accountStyleSelect: AccountStyleSelect,
					chargerSelect: ChargerSelect,
				}}
			/>
		</SplitPanelComponent>
	);
};
