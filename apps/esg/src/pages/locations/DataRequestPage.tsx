import React, {
	useRef,
	useState,
	useEffect,
	useCallback,
	useMemo,
} from 'react';
import {
	SplitPanelComponent,
	StyledContainer,
	PaperComponent,
	BaseModalComponent,
} from '@repo/moornmo-ui/components';
import { useActionButtons } from '@moornmo/hooks';
import { useDataRequest } from '@esg/hooks/request/useDataRequest';
import { GroupTreeNavigation } from '@esg/components/treeNavigation';
import {
	gridOptions,
	columns,
	modalGridColumns,
} from './configs/DataRequestConfig';
import { ToastoGridComponent } from '@repo/toasto/components/grid';
import { Card, Form, Row, Col } from 'react-bootstrap';
import { DataRequestListResponse } from '@esg/types/request';
import { useAccount } from '@esg/hooks/account/useAccount';
import { CompanySelect } from '@esg/components/forms/selects';
import { useSnackbarNotifier } from '@esg/hooks/utils/UseSnackBar';
import { Spinner } from '@repo/moornmo-ui/components';

const DEFAULT_PAGE_SIZE = 30;

export const DataRequestPage: React.FC = () => {
	// Action Buttons
	const {
		setCreate,
		setEdit,
		setDelete,
		setCreateHandler,
		setEditHandler,
		setDeleteHandler,
	} = useActionButtons();
	// Refs
	const gridRef = useRef<any>(null);
	const modalGridRef = useRef<any>(null);
	const { showSnackbar } = useSnackbarNotifier();

	// State Management
	const [openModal, setOpenModal] = useState(false);
	const openCreateModal = () => {
		setSelectedModalCompanyId(selectedCompanyId ?? undefined); // ✅ 초기값 복사
		setOpenModal(true);
	};
	const [page, setPage] = useState(0);
	const [data, setData] = useState<any[]>([]);

	const [modalData, setModalData] = useState<any[]>([]);
	const [modalPage, setModalPage] = useState(0);

	const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');
	const [selectedModalCompanyId, setSelectedModalCompanyId] = useState<
		string | null
	>(null);
	const [selectedMonth, setSelectedMonth] = useState<string>('');
	const { dataRequestList, createDataRequest } = useDataRequest({
		page,
		size: DEFAULT_PAGE_SIZE,
		searchRequest: {
			companyId: Number(selectedCompanyId),
		},
	});

	const { list: accountList } = useAccount({
		page: modalPage,
		size: 30,
		searchRequest: selectedModalCompanyId
			? {
					companyId: Number(selectedModalCompanyId),
				}
			: {},
	});

	const handleSave = () => {
		const selectedRows = modalGridRef.current.getSelectedRows();
		const selectedAccountIds = selectedRows.map((row: any) => row.id);
		if (selectedAccountIds.length === 0) {
			showSnackbar({
				message: '계정을 선택해주세요.',
				severity: 'error',
				duration: 3000,
			});
			return;
		}
		if (!selectedMonth) {
			showSnackbar({
				message: '회계년월을 선택해주세요.',
				severity: 'error',
				duration: 3000,
			});
			return;
		}
		const payload = {
			accounts: selectedAccountIds,
			companyId: Number(selectedModalCompanyId),
			accountMonth: selectedMonth.replace(/-/g, ''),
		};
		createDataRequest.mutate(payload, {
			onSuccess: () => {
				try {
					showSnackbar({
						message: '데이터 요청이 성공적으로 등록되었습니다.',
					});
					setOpenModal(false);
					setSelectedModalCompanyId(null);
					setSelectedMonth('');
					// modalGridRef.current.clearSelection();
				} catch (error) {
					console.error('onSuccess 콜백에서 에러 발생:', error);
				}
			},
			onError: (error) => {
				showSnackbar({
					message: '데이터 요청에 실패했습니다.',
					severity: 'error',
					duration: 3000,
				});
			},
		});
	};
	// Effects
	useEffect(() => {
		setCreate(true);
		setCreateHandler(openCreateModal);
		setEdit(false);
		setDelete(false);
	}, []);

	useEffect(() => {
		const res = dataRequestList.data as
			| DataRequestListResponse
			| null
			| undefined;
		if (res && Array.isArray(res.data)) {
			const mapped = res.data.map((item: any) => ({
				...item,
				accountName: item.account.name,
				accountStyleName: item.accountStyle,
				companyName: item.company.name,
				unit: item?.accountStyle?.dataType?.uom,
				accountManager: item?.charger?.name,
			}));
			setData(mapped as any[]);
		} else {
			setData([]);
		}
	}, [dataRequestList.data]);

	useEffect(() => {
		if (accountList.data?.content) {
			const _accountList = accountList.data.content.map((item: any) => ({
				...item,
				account_style_name: item.accountStyle.caption,
				useMeter: item.meterId ? '연동' : '미연동',
				unit: item.accountStyle.dataType.uom,
				accountManager: item?.charger?.name,
			}));
			setModalData(_accountList as any[]);
		}
	}, [accountList.data?.content]);

	return (
		<>
			<BaseModalComponent
				open={openModal}
				title="데이터 요청"
				onClose={() => setOpenModal(false)}
				onSave={handleSave}
				size="xl"
				styles={{
					modalBody: {
						minHeight: '400px',
						overflow: 'hidden',
					},
				}}
			>
				<Card
					className="shadow-none d-flex gap-3 flex-row w-100"
					style={{
						height: '50vh',
						overflow: 'hidden',
					}}
				>
					{createDataRequest.isPending && (
						<div className="d-flex justify-content-center align-items-center w-100 h-100">
							<Spinner />
						</div>
					)}
					{!createDataRequest.isPending && (
						<>
							<Form
								className="px-3 h-100"
								style={{ flexShrink: 0, flexGrow: 0 }}
							>
								<Row>
									<Col xs={12} md={12} className="mb-3">
										<Form.Group
											className="d-flex align-items-center"
											style={{
												gap: 8,
												justifyContent: 'space-between',
											}}
										>
											<Form.Label
												className="my-0"
												style={{
													width: 100,
													flexShrink: 0,
													flexGrow: 0,
												}}
											>
												회사
											</Form.Label>
											<div className="w-100">
												<CompanySelect
													name="companyId"
													value={
														selectedModalCompanyId ??
														undefined
													}
													onChange={(v) =>
														setSelectedModalCompanyId(
															v
														)
													}
													filter={{
														companyType: 'COMPANY',
													}}
													fieldName="name"
												/>
											</div>
										</Form.Group>
									</Col>
								</Row>

								<Row>
									<Col xs={12} md={12} className="mb-3">
										<Form.Group
											className="d-flex align-items-center"
											style={{
												gap: 8,
												justifyContent: 'space-between',
											}}
										>
											<Form.Label
												className="my-0 required"
												style={{
													width: 100,
													flexShrink: 0,
													flexGrow: 0,
												}}
											>
												회계년월
											</Form.Label>
											<div className="w-100">
												<Form.Control
													onChange={(e) => {
														setSelectedMonth(
															e.target.value
														);
													}}
													type="month"
												/>
											</div>
										</Form.Group>
									</Col>
								</Row>
							</Form>
							<div className="flex-1 h-100 border">
								<ToastoGridComponent
									ref={modalGridRef}
									columns={modalGridColumns}
									data={
										selectedModalCompanyId ? modalData : []
									}
									gridOptions={{
										rowHeaders: ['checkbox'],
									}}
									minHeight={'50vh'}
								/>
							</div>
						</>
					)}
				</Card>
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
							allowTypes={['GROUP', 'COMPANY', 'WORKPLACE']}
							onSelected={(nodeId) => {
								setSelectedCompanyId(nodeId);
								// setSelectedModalCompanyId(nodeId);
							}}
							allowSelectedType={['COMPANY', 'WORKPLACE']}
						/>
					</PaperComponent>
				</StyledContainer>
				<StyledContainer width="100%">
					<PaperComponent
						sx={{
							height: '100%',
							overflow: 'auto',
						}}
						evolution={0}
					>
						<ToastoGridComponent
							columns={columns}
							data={data}
							gridOptions={{
								rowHeaders: ['rowNum'],
								bodyHeight: 440,
							}}
						/>
					</PaperComponent>
				</StyledContainer>
			</SplitPanelComponent>
		</>
	);
};

export default DataRequestPage;
