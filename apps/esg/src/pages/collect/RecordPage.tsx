import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
	BaseModalComponent,
	DynamicFormComponent,
	SplitPanelComponent,
	StyledContainer,
	PaperComponent,
} from '@moornmo/components';
import { ToastoGridComponent } from '@toasto/src/components/grid';
import { GroupTreeNavigation } from '@esg/components/treeNavigation';
import { RecordHistoryPanel } from '@esg/components/records/RecordHistoryPanel';
import {
	formConfigs,
	recordGridOptions,
	recordGridColumns,
} from './configs/RecordConfig';
import { useActionButtons } from '@moornmo/hooks';
import { useSnackbarNotifier } from '@esg/hooks/utils/UseSnackBar';
import { useDialog } from '@esg/hooks/utils/useDialog';
import { CompanyAccountSelect } from '@esg/components/forms/selects/CompanyAccountSelect';
import { CompanySelect } from '@esg/components/forms/selects/CompanySelect';
import { commaNumber } from '@repo/utils';
import {
	useRecordMatrixQuery,
	useSaveRecordMatrix,
	convertGridDataToMatrix,
	convertMatrixToGridData,
} from '@esg/hooks/records';
import { useAccountByCompanyQuery } from '@esg/hooks/account';

// 기존 monthlyGrid 설정은 RecordConfig.ts의 recordGrid 설정으로 대체됨

export const RecordPage: React.FC = () => {
	const { showSnackbar } = useSnackbarNotifier();
	const { showDialog } = useDialog();
	const formRef = useRef<any>(null);

	// 상태 관리
	const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
	const [selectedYear, setSelectedYear] = useState<number>(
		new Date().getFullYear()
	);
	const [selectedRecordId, setSelectedRecordId] = useState<number | null>(
		null
	);
	const [selectedRecordData, setSelectedRecordData] = useState<any>(null);
	const [mode, setMode] = useState<'create' | 'edit'>('create');
	const [openModal, setOpenModal] = useState<boolean>(false);
	const [monthlyGridData, setMonthlyGridData] = useState<any[]>([]);

	const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);

	// 히스토리 모달 상태
	const [showHistoryModal, setShowHistoryModal] = useState<boolean>(false);
	const [historyAccountId, setHistoryAccountId] = useState<
		string | number | null
	>(null);
	const [historyAccountName, setHistoryAccountName] = useState<string>('');

	// API hooks
	const recordMatrixQuery = useRecordMatrixQuery({
		companyId: selectedGroupId || '',
		year: selectedYear,
		enabled: !!selectedGroupId,
	});

	const accountQuery = useAccountByCompanyQuery({
		companyId: selectedGroupId || '',
		enabled: !!selectedGroupId,
	});

	const saveRecordMatrix = useSaveRecordMatrix();

	// 액션 버튼 설정
	const {
		setCreate,
		setEdit,
		setDelete,
		setCreateHandler,
		setEditHandler,
		setDeleteHandler,
	} = useActionButtons();
	// 액션 버튼 초기화
	useEffect(() => {
		setCreate(false);
		setEdit(false);
		setDelete(false);
	}, []);

	// 🔄 Account와 Record 데이터를 합집합으로 처리하는 함수
	const combineAccountAndRecordData = useCallback(
		(accounts: any[], records: any) => {
			// 🛡️ Null 체크 추가
			const safeAccounts = accounts || [];
			const safeRecords = records || null;

			// Account 데이터를 Map으로 변환 (빠른 조회를 위해)
			const accountMap = new Map();
			safeAccounts.forEach((account: any) => {
				accountMap.set(account.id, {
					id: account.id,
					name: account.name,
					unit: account.accountStyle?.dataType?.uom || '',
					styleName: account.accountStyle?.caption || '',
				});
			});

			// Record 데이터를 Map으로 변환
			const recordMap = new Map();
			if (safeRecords && safeRecords.records) {
				safeRecords.records.forEach((record: any) => {
					// monthlyData를 월별 필드로 변환
					const monthlyFields: { [key: string]: number } = {
						jan: 0,
						feb: 0,
						mar: 0,
						apr: 0,
						may: 0,
						jun: 0,
						jul: 0,
						aug: 0,
						sep: 0,
						oct: 0,
						nov: 0,
						dec: 0,
					};

					// monthlyData가 존재하는지 확인 후 처리
					if (
						record.monthlyData &&
						Array.isArray(record.monthlyData)
					) {
						record.monthlyData.forEach((monthData: any) => {
							if (
								monthData.exists &&
								monthData.quantity !== null
							) {
								const monthNames = [
									'jan',
									'feb',
									'mar',
									'apr',
									'may',
									'jun',
									'jul',
									'aug',
									'sep',
									'oct',
									'nov',
									'dec',
								];
								const monthField =
									monthNames[monthData.month - 1];
								if (monthField) {
									monthlyFields[monthField] =
										monthData.quantity;
								}
							}
						});
					}

					// 합계 계산
					const total = Object.values(monthlyFields).reduce(
						(sum, val) => sum + val,
						0
					);

					recordMap.set(record.accountId, {
						id: record.accountId,
						accountName: record.accountName,
						unit: record.uom || '',
						accountStyleName: record.accountStyleCaption || '',
						...monthlyFields,
						total: total,
					});
				});
			}

			// 🎯 합집합 처리: Account 중심으로 모든 항목 포함
			const finalData: any[] = [];

			// 1. Account에 있는 모든 항목 처리
			accountMap.forEach((account, accountId) => {
				const recordData = recordMap.get(accountId);

				if (recordData) {
					// Account + Record 모두 있는 경우 (정상 데이터)
					finalData.push({
						accountId: accountId,
						accountName: account.name,
						unit: account.unit,
						accountStyleName: account.styleName,
						jan: recordData.jan,
						feb: recordData.feb,
						mar: recordData.mar,
						apr: recordData.apr,
						may: recordData.may,
						jun: recordData.jun,
						jul: recordData.jul,
						aug: recordData.aug,
						sep: recordData.sep,
						oct: recordData.oct,
						nov: recordData.nov,
						dec: recordData.dec,
						total: recordData.total,
						isNewAccount: false,
						isOrphanRecord: false,
					});
				} else {
					// Account만 있는 경우 (새로운 관리항목) - 빈 Row로 표시
					finalData.push({
						accountId: accountId,
						accountName: account.name,
						unit: account.unit,
						accountStyleName: account.styleName,
						jan: 0,
						feb: 0,
						mar: 0,
						apr: 0,
						may: 0,
						jun: 0,
						jul: 0,
						aug: 0,
						sep: 0,
						oct: 0,
						nov: 0,
						dec: 0,
						total: 0,
						isNewAccount: true, // 🆕 새 관리항목 표시
						isOrphanRecord: false,
					});
				}
			});

			// 2. Record에만 있는 항목 처리 (삭제된 관리항목)
			recordMap.forEach((record, accountId) => {
				if (!accountMap.has(accountId)) {
					finalData.push({
						accountId: accountId,
						accountName: record.accountName,
						unit: record.unit,
						accountStyleName: record.accountStyleName,
						jan: record.jan,
						feb: record.feb,
						mar: record.mar,
						apr: record.apr,
						may: record.may,
						jun: record.jun,
						jul: record.jul,
						aug: record.aug,
						sep: record.sep,
						oct: record.oct,
						nov: record.nov,
						dec: record.dec,
						total: record.total,
						isNewAccount: false,
						isOrphanRecord: true, // 🗑️ 삭제된 관리항목 표시
					});
				}
			});

			console.log('✅ Final Combined Data:', finalData);
			return finalData;
		},
		[]
	);

	// API 데이터가 로드되면 그리드 데이터 업데이트 (Account 중심 합집합 처리)
	React.useEffect(() => {
		console.log('🔍 selectedGroupId:', selectedGroupId);

		if (selectedGroupId) {
			// 실제 API 사용 (그룹이 선택된 경우)
			if (
				accountQuery.data &&
				!accountQuery.isLoading &&
				!accountQuery.error
			) {
				console.log('🔄 Processing Real API data...');
				console.log('Account Data:', accountQuery.data);
				console.log('Record Data:', recordMatrixQuery.data);

				const accounts = accountQuery.data?.content || [];
				const records = recordMatrixQuery.data || null;

				const finalGridData = combineAccountAndRecordData(
					accounts,
					records
				);

				console.log('✅ Final Grid Data:', finalGridData);
				setMonthlyGridData(finalGridData);
				setHasUnsavedChanges(false);
			} else if (accountQuery.isLoading) {
				console.log('⏳ Loading Account data...');
			} else if (accountQuery.error) {
				console.error('❌ Account data error:', accountQuery.error);
			}
		} else {
			// 그룹이 선택되지 않았을 때는 빈 그리드 표시
			console.log('ℹ️ No group selected, showing empty grid');
			setMonthlyGridData([]);
			setHasUnsavedChanges(false);
		}
	}, [
		selectedGroupId,
		accountQuery.data,
		accountQuery.isLoading,
		accountQuery.error,
		recordMatrixQuery.data,
		combineAccountAndRecordData,
	]);

	// 핸들러 함수들
	const handleGroupSelect = useCallback(
		(id: string) => {
			if (hasUnsavedChanges) {
				showDialog({
					title: '저장되지 않은 변경사항',
					content:
						'저장되지 않은 변경사항이 있습니다. 다른 사업장을 선택하시겠습니까?',
					confirmText: '선택',
					cancelText: '취소',
					onConfirm: () => {
						setSelectedGroupId(id);
						setSelectedRecordId(null);
						setSelectedRecordData(null);
						setHasUnsavedChanges(false);
					},
				});
			} else {
				setSelectedGroupId(id);
				setSelectedRecordId(null);
				setSelectedRecordData(null);
				setHasUnsavedChanges(false);
			}
		},
		[hasUnsavedChanges, showDialog]
	);

	// 연도 변경 핸들러
	const handleYearChange = useCallback(
		(year: number) => {
			if (hasUnsavedChanges) {
				showDialog({
					title: '저장되지 않은 변경사항',
					content:
						'저장되지 않은 변경사항이 있습니다. 연도를 변경하시겠습니까?',
					confirmText: '변경',
					cancelText: '취소',
					onConfirm: () => {
						setSelectedYear(year);
						setHasUnsavedChanges(false);
						// 새로운 연도 데이터 로드
						if (selectedGroupId) {
							handleGroupSelect(selectedGroupId);
						}
					},
				});
			} else {
				setSelectedYear(year);
				// 새로운 연도 데이터 로드
				if (selectedGroupId) {
					handleGroupSelect(selectedGroupId);
				}
			}
		},
		[hasUnsavedChanges, selectedGroupId, handleGroupSelect, showDialog]
	);

	// 그리드 데이터 변경 핸들러
	const handleGridDataChange = useCallback(
		(e: any) => {
			let changes = [];

			// 다양한 TUI Grid 이벤트 구조 처리
			if (e.changes && Array.isArray(e.changes)) {
				// afterChange 이벤트 구조
				changes = e.changes;
			} else if (e.rowKey !== undefined && e.columnName !== undefined) {
				// editingFinish 이벤트 구조
				changes = [
					{
						rowKey: e.rowKey,
						columnName: e.columnName,
						value: e.value,
						prevValue: e.prevValue,
					},
				];
			} else if (
				e.instance &&
				e.rowKey !== undefined &&
				e.columnName !== undefined
			) {
				// 다른 이벤트 구조
				changes = [
					{
						rowKey: e.rowKey,
						columnName: e.columnName,
						value: e.value,
						prevValue: e.prevValue,
					},
				];
			}

			if (changes.length > 0) {
				changes.forEach((change: any) => {
					const { rowKey, columnName, value } = change;

					// 월별 데이터 업데이트
					const updatedData = [...monthlyGridData];
					const targetRow = updatedData[rowKey];

					if (targetRow) {
						// 값 처리: 빈 문자열이면 빈 문자열로, 아니면 입력된 값 그대로 저장
						targetRow[columnName] = value === '' ? '' : value;

						// 합계 자동 계산 (숫자로 변환 가능한 값만)
						const monthColumns = [
							'jan',
							'feb',
							'mar',
							'apr',
							'may',
							'jun',
							'jul',
							'aug',
							'sep',
							'oct',
							'nov',
							'dec',
						];
						targetRow.total = monthColumns.reduce((sum, month) => {
							const numValue = Number(targetRow[month]);
							return sum + (isNaN(numValue) ? 0 : numValue);
						}, 0);

						setMonthlyGridData(updatedData);
						setHasUnsavedChanges(true);
					}
				});
			}
		},
		[monthlyGridData]
	);

	// 월별 데이터 저장
	const handleSaveMonthlyData = useCallback(async () => {
		if (!selectedGroupId || !monthlyGridData.length) {
			showSnackbar({
				message: '저장할 데이터가 없습니다.',
				severity: 'warning',
				duration: 3000,
			});
			return;
		}

		try {
			const matrixPayload = convertGridDataToMatrix(
				Number(selectedGroupId),
				selectedYear,
				monthlyGridData
			);

			await saveRecordMatrix.mutateAsync(matrixPayload);

			setHasUnsavedChanges(false);
			showSnackbar({
				message: `${selectedYear}년 월별 사용량 데이터가 저장되었습니다.`,
				severity: 'success',
				duration: 3000,
			});
		} catch (error) {
			showSnackbar({
				message: '데이터 저장 중 오류가 발생했습니다.',
				severity: 'error',
				duration: 4000,
			});
		}
	}, [
		selectedGroupId,
		selectedYear,
		monthlyGridData,
		hasUnsavedChanges,
		showSnackbar,
		saveRecordMatrix,
	]);

	const handleRecordSelect = (e: any) => {
		const { rowKey, columnName } = e;
		const target = monthlyGridData[rowKey];

		console.log(
			'Grid Click - rowKey:',
			rowKey,
			'columnName:',
			columnName,
			'target:',
			target
		);

		// 관리항목명 클릭 시 히스토리 모달 열기
		if (columnName === 'accountName' && target) {
			console.log('Opening history modal for:', target.accountName);
			setHistoryAccountId(target.accountId || target.id);
			setHistoryAccountName(target.accountName || '관리항목');
			setShowHistoryModal(true);
		} else {
			// 다른 셀 클릭 시 기존 선택 로직
			setSelectedRecordId(target.id);
			setSelectedRecordData(target);
		}
	};

	const handleRecordUnselect = () => {
		setSelectedRecordId(null);
		setSelectedRecordData(null);
	};

	// 히스토리 모달 닫기
	const handleCloseHistoryModal = () => {
		setShowHistoryModal(false);
		setHistoryAccountId(null);
		setHistoryAccountName('');
	};

	const openCreateModal = () => {
		if (!selectedGroupId) {
			showSnackbar({
				message: '먼저 그룹/사업장을 선택해주세요.',
				severity: 'warning',
				duration: 3000,
			});
			return;
		}

		setMode('create');
		setOpenModal(true);

		// 모달이 열린 후 초기값 설정
		setTimeout(() => {
			if (formRef.current) {
				const initialData: any = {
					companyId: Number(selectedGroupId),
				};
				formRef.current.setFormData(initialData);
			}
		}, 100);
	};

	const openEditModal = () => {
		if (!selectedRecordId) {
			showSnackbar({
				message: '수정할 관리항목을 선택해주세요.',
				severity: 'info',
				duration: 3000,
			});
			return;
		}
		setMode('edit');
		setOpenModal(true);
	};

	const handleDelete = () => {
		if (!selectedRecordId) {
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
				// 목업 데이터에서 삭제
				setMonthlyGridData((prev) =>
					prev.filter((item) => item.id !== selectedRecordId)
				);

				showSnackbar({
					message: '관리항목이 성공적으로 삭제되었습니다.',
					severity: 'success',
					duration: 3000,
				});
				setSelectedRecordId(null);
				setSelectedRecordData(null);
			},
		});
	};

	const onSaveRecord = () => {
		if (!formRef.current) return;

		const formData = formRef.current.getFormData();
		console.log('Form Data:', formData);

		// 목업 데이터 처리 (실제 API 호출 대신)
		if (mode === 'create') {
			// 새로운 관리항목 추가 (목업)
			const newItem = {
				id: Date.now(),
				accountName: formData.accountName || '새 관리항목',
				unit: formData.unit || 'unit',
				accountStyleName: formData.accountStyleName || '기타',
				jan: 0,
				feb: 0,
				mar: 0,
				apr: 0,
				may: 0,
				jun: 0,
				jul: 0,
				aug: 0,
				sep: 0,
				oct: 0,
				nov: 0,
				dec: 0,
				total: 0,
			};

			setMonthlyGridData((prev) => [...prev, newItem]);
			setOpenModal(false);
			showSnackbar({
				message: '관리항목이 성공적으로 등록되었습니다.',
				severity: 'success',
				duration: 3000,
			});
		} else if (mode === 'edit' && selectedRecordId) {
			// 기존 관리항목 수정 (목업)
			setMonthlyGridData((prev) =>
				prev.map((item) =>
					item.id === selectedRecordId
						? { ...item, ...formData }
						: item
				)
			);
			setOpenModal(false);
			showSnackbar({
				message: '관리항목이 성공적으로 수정되었습니다.',
				severity: 'success',
				duration: 3000,
			});
		}
	};

	// 모달 데이터 설정
	useEffect(() => {
		if (
			openModal &&
			mode === 'edit' &&
			selectedRecordData &&
			formRef.current
		) {
			formRef.current.setFormData({
				...selectedRecordData,
				companyId: Number(selectedGroupId),
			});
		}
	}, [openModal, mode, selectedRecordData, selectedGroupId]);

	return (
		<>
			{/* 히스토리 모달 */}
			<BaseModalComponent
				open={showHistoryModal}
				title={`변경 이력 - ${historyAccountName}`}
				onClose={handleCloseHistoryModal}
				size="lg"
			>
				{showHistoryModal && historyAccountId && (
					<RecordHistoryPanel
						accountId={historyAccountId}
						accountName={historyAccountName}
						onClose={handleCloseHistoryModal}
					/>
				)}
			</BaseModalComponent>

			<BaseModalComponent
				open={openModal}
				title={`관리항목 ${mode === 'edit' ? '수정' : '등록'}`}
				onSave={onSaveRecord}
				onClose={() => setOpenModal(false)}
			>
				<DynamicFormComponent
					ref={formRef}
					config={formConfigs}
					initialValues={{}}
					otherTypeElements={{
						accountSelect: CompanyAccountSelect,
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
				{/* 좌측: 그룹 트리 네비게이션 */}
				<StyledContainer>
					<PaperComponent
						sx={{
							height: '100%',
							padding: '1rem',
							overflow: 'auto',
						}}
					>
						<GroupTreeNavigation
							allowTypes={['GROUP', 'COMPANY', 'WORKPLACE']}
							onSelected={handleGroupSelect}
							allowSelectedType={['COMPANY', 'WORKPLACE']}
						/>
					</PaperComponent>
				</StyledContainer>

				{/* 우측: 관리항목별 월별 데이터 그리드 */}
				<StyledContainer>
					<PaperComponent
						sx={{
							height: '100%',
							overflow: 'hidden',
							display: 'flex',
							flexDirection: 'column',
						}}
						className="p-3"
					>
						<div className="mb-3">
							<div className="d-flex justify-content-between align-items-center mb-2">
								<h5 className="mb-0">관리항목별 월별 데이터</h5>
								<div className="d-flex align-items-center gap-3">
									{/* 연도 선택기 */}
									<div className="d-flex align-items-center gap-2">
										<label className="form-label mb-0">
											연도:
										</label>
										<select
											className="form-select form-select-sm"
											style={{ width: '100px' }}
											value={selectedYear}
											onChange={(e) =>
												handleYearChange(
													Number(e.target.value)
												)
											}
											disabled={!selectedGroupId}
										>
											{Array.from(
												{ length: 10 },
												(_, i) => {
													const year =
														new Date().getFullYear() -
														5 +
														i;
													return (
														<option
															key={year}
															value={year}
														>
															{year}
														</option>
													);
												}
											)}
										</select>
									</div>

									{/* 저장 버튼 */}
									{selectedGroupId && (
										<button
											className={`btn btn-sm ${hasUnsavedChanges ? 'btn-warning' : 'btn-success'}`}
											onClick={handleSaveMonthlyData}
											disabled={
												!monthlyGridData.length ||
												saveRecordMatrix.isPending
											}
										>
											{saveRecordMatrix.isPending ? (
												<>
													<span className="spinner-border spinner-border-sm me-1" />
													저장 중...
												</>
											) : hasUnsavedChanges ? (
												'💾 저장 필요'
											) : (
												'✅ 저장됨'
											)}
										</button>
									)}
								</div>
							</div>
						</div>

						<div style={{ flex: 1, overflow: 'hidden' }}>
							<style>
								{`
									.clickable-cell {
										cursor: pointer !important;
										text-decoration: underline;
									}
									.clickable-cell:hover {
										background-color: #f8f9fa !important;
									}
								`}
							</style>
							<ToastoGridComponent
								key={`grid-${selectedGroupId}-${selectedYear}-${monthlyGridData.length}`} // 강제 리렌더링
								gridOptions={recordGridOptions}
								columns={recordGridColumns}
								data={monthlyGridData}
								customEvents={{
									afterChange: handleGridDataChange, // 데이터 변경 이벤트
									editingFinish: handleGridDataChange, // 편집 완료 이벤트 (대안)
									click: handleRecordSelect,
								}}
								minHeight="400px"
								usePagination={false} // 월별 데이터는 페이징 없이 전체 표시
							/>
						</div>

						{/* {selectedRecordData && (
							<div className="mt-3 p-3 bg-light rounded">
								<h6 className="mb-2">선택된 관리항목 정보</h6>
								<div className="row">
									<div className="col-md-6">
										<strong>항목명:</strong> {selectedRecordData.accountName}
									</div>
									<div className="col-md-3">
										<strong>분류:</strong> {selectedRecordData.accountStyleName}
									</div>
									<div className="col-md-3">
										<strong>단위:</strong> {selectedRecordData.unit}
									</div>
								</div>
								<div className="mt-2">
									<strong>연간 총계:</strong> {commaNumber(selectedRecordData.total)} {selectedRecordData.unit}
								</div>
							</div>
						)} */}
					</PaperComponent>
				</StyledContainer>
			</SplitPanelComponent>
		</>
	);
};
