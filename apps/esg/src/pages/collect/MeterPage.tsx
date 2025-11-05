import React, { useRef, useState, useMemo, useEffect } from 'react';
import {
	StyledContainer,
	SplitPanelComponent,
	PaperComponent,
} from '@repo/moornmo-ui/components';

import {
	detailGridColumns,
	detailGridOptions,
	formConfigs,
	detailGridDataSample,
} from './configs/MeterConfig';

import { SinglePageTemplate } from '@repo/moornmo-ui/components';
import { AccountData } from '@esg/sample/account';
import { GroupConfig } from '@repo/moornmo-ui/types';
import { GroupTreeNavigation } from '@esg/components/treeNavigation/GroupTreeNavigation';

// Import the snackbar hook
import { useSnackbarNotifier } from '@esg/hooks/utils/UseSnackBar';
import { useDialog } from '@esg/hooks/utils/useDialog';

export const MeterPage: React.FC = () => {
	const detailGridRef = useRef<any>(null);
	const [gridData, setGridData] = useState<any[]>([]);
	const [modalFormConfigs, setModalFormConfigs] = useState<GroupConfig[]>([]);
	const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);

	// Add snackbar hook
	const { showSnackbar } = useSnackbarNotifier();
	const { showDialog } = useDialog();

	const handleDelete = (payload: any) => {
		console.log('onDelete', payload);
		showDialog({
			title: '미터기 삭제 확인',
			content:
				'선택한 미터기를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.',
			confirmText: '삭제',
			cancelText: '취소',
			severity: 'error',
			onConfirm: () => {
				// Add actual delete logic here when available
				showSnackbar({
					message: '미터기가 성공적으로 삭제되었습니다.',
					severity: 'success',
					duration: 3000,
				});
			},
		});
	};

	// 그룹 선택 시 미터기 데이터 로드 (실제로는 API 호출)
	useEffect(() => {
		if (selectedGroupId) {
			// TODO: 실제 API 호출로 해당 그룹의 미터기 목록 조회
			console.log('Selected Group ID:', selectedGroupId);
			// 임시로 샘플 데이터 사용
			setGridData(detailGridDataSample);
		} else {
			setGridData([]);
		}
	}, [selectedGroupId]);

	useMemo(() => {
		const _formConfigs = formConfigs.map((config) => {
			if (config.fields) {
				config.fields = config.fields.map((field) => {
					if (field.name === 'account_style_name') {
						return {
							...field,
							props: {
								required: true,
								options: AccountData.map((account) => ({
									label: account.account_style_name,
									value: Number(account.id),
								})),
							},
						};
					}
					return field;
				});
			}
			return config;
		});
		setModalFormConfigs(_formConfigs);
	}, [AccountData, formConfigs]);

	return (
		<SplitPanelComponent
			direction={'horizontal'}
			sizes={[20, 80]}
			minSize={200}
			onDrag={() => {
				detailGridRef.current?.getGridInstance().refreshLayout();
			}}
		>
			{/* 좌측: 그룹 트리 네비게이션 (기존 마스터 그리드 대체) */}
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
						onSelected={(groupId) => {
							setSelectedGroupId(groupId);
							// 그룹 선택 시 해당 그룹의 미터기 데이터 로드
							setGridData(detailGridDataSample);
						}}
						allowSelectedType={['GROUP', 'COMPANY', 'WORKPLACE']}
					/>
				</PaperComponent>
			</StyledContainer>

			{/* 우측: 미터기 관리 (기존 디테일 영역) */}
			<StyledContainer>
				<PaperComponent
					sx={{
						height: '100%',
						overflow: 'hidden',
					}}
					evolution={0}
					className="p-3"
				>
					<SinglePageTemplate
						columns={detailGridColumns}
						gridOptions={detailGridOptions}
						data={gridData}
						modalTitleKey={'미터기'}
						useModalForCreate={true}
						onCreate={(payload) => {
							console.log('onCreate', payload);
							showSnackbar({
								message: '미터기가 성공적으로 등록되었습니다.',
								severity: 'success',
								duration: 3000,
							});
						}}
						onEdit={(payload) => {
							console.log('onEdit', payload);
							showSnackbar({
								message: '미터기가 성공적으로 수정되었습니다.',
								severity: 'success',
								duration: 3000,
							});
						}}
						onDelete={handleDelete}
						modalFormConfigs={modalFormConfigs}
					/>
				</PaperComponent>
			</StyledContainer>
		</SplitPanelComponent>
	);
};
