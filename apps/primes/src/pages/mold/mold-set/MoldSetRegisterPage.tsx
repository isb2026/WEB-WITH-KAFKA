import { useRef, useState, useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';
import { PageTemplate } from '@primes/templates';
import DatatableComponent from '@primes/components/datatable/DatatableComponent';
import { DraggableDialog, RadixButton, RadixBadge } from '@radix-ui/components';
import { ArrowLeft, Package, Settings } from 'lucide-react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { useDataTable, useDataTableColumns } from '@radix-ui/hook';
import { DynamicForm } from '@primes/components/form/DynamicFormComponent';
import FormComponent from '@primes/components/form/FormComponent';
import { Check, RotateCw } from 'lucide-react';
import { DeleteConfirmDialog } from '@primes/components/common/DeleteConfirmDialog';
import { useTranslation } from '@repo/i18n';
import { toast } from 'sonner';
import { useCreateMoldSet, useUpdateMoldSet } from '@primes/hooks';
import { useCreateMoldSetDetailBatch } from '@primes/hooks/mold/mold-set';
import { ItemSelectComponent } from '@primes/components/customSelect/ItemSelectComponent';
import { ItemProgressSelectComponent } from '@primes/components/customSelect/ItemProgressSelectComponent';
import { MachineSelectComponent } from '@primes/components/customSelect/MachineSelectComponent';
import { MoldInstanceSelectComponent } from '@primes/components/customSelect/MoldInstanceSelectComponent';
import { getMoldBomMasterList, getMoldBomDetailList, getMoldBomDetailSetAssignedInstances } from '@primes/services/mold/moldBomService';
import { MoldBomDetailDto, MoldBomDetailSetAssignedInstanceDto } from '@primes/types/mold';

// BOM 기반 SET 데이터 타입 정의
export type BomSetDataType = {
	id: string;
	moldMasterId: number;
	moldBomDetailId: number;
	moldSetDetailId: number | null;
	moldCode: string;
	moldName: string;
	moldStandard: string;
	assignedInstanceId?: number | null;
	assignedInstanceCode?: string | null;
	assignedInstanceName?: string | null;
	isAssigned: boolean;
	[key: string]: any;
};

// BOM 기반 SET 컬럼 정의
export const bomSetColumns = [
	{
		accessorKey: 'moldCode',
		header: '금형 코드',
		size: 120,
	},
	{
		accessorKey: 'moldName',
		header: '금형명',
		size: 150,
	},
	{
		accessorKey: 'moldStandard',
		header: '금형 규격',
		size: 150,
	},
	{
		accessorKey: 'isAssigned',
		header: '실금형 할당',
		size: 100,
		cell: ({ getValue, row }: { getValue: () => any; row: any }) => {
			const isAssigned = getValue();
			const assignedInstanceCode = row.original.assignedInstanceCode;
			const assignedInstanceName = row.original.assignedInstanceName;
			
			if (isAssigned && assignedInstanceCode && assignedInstanceName) {
				return (
					<div className="flex flex-col gap-1">
						<span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 w-fit">
							할당완료
						</span>
						<span className="text-xs text-gray-600 truncate">
							{assignedInstanceCode}
						</span>
						<span className="text-xs text-gray-600 truncate">
							{assignedInstanceName}
						</span>
					</div>
				);
			}
			
			return (
				<span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 w-fit">
					미할당
				</span>
			);
		},
	},
	{
		accessorKey: 'assignedInstanceCode',
		header: '할당된 실금형 코드',
		size: 150,
		cell: ({ getValue }: { getValue: () => any }) => {
			const value = getValue();
			if (value) {
				return (
					<span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
						{value}
					</span>
				);
			}
			return (
				<span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
					미할당
				</span>
			);
		},
	},
	{
		accessorKey: 'assignedInstanceName',
		header: '할당된 실금형명',
		size: 150,
		cell: ({ getValue }: { getValue: () => any }) => {
			const value = getValue();
			if (value) {
				return (
					<span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
						{value}
					</span>
				);
			}
			return (
				<span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
					미할당
				</span>
			);
		},
	},
];

interface MoldSetRegisterPageProps {
	onSuccess?: () => void;
}

export const MoldSetMasterDetailRegisterPage: React.FC<
	MoldSetRegisterPageProps
> = ({ onSuccess }) => {
	const { t } = useTranslation('dataTable');
	const { t: tCommon } = useTranslation('common');
	const [searchParams] = useSearchParams();
	const location = useLocation();

	// URL 파라미터에서 수정 모드 확인
	const editId = searchParams.get('id');
	const mode = searchParams.get('mode');
	const urlEditMode = mode === 'edit' && editId;

	// location.state에서 편집 모드와 데이터 확인 (우선순위: location.state > URL params)
	const stateEditMode = location.state?.editMode;
	const stateEditData = location.state?.editData;
	const isEditMode = stateEditMode || urlEditMode;
	
	// 디버깅: 전달된 데이터 확인

	// Add the create/update mutation hooks
	const createMoldSet = useCreateMoldSet(0, 30);
	const updateMoldSet = useUpdateMoldSet(0, 30);
	const createMoldSetDetailBatch = useCreateMoldSetDetailBatch();

	// 수정할 데이터 상태
	const [moldSetData, setMoldSetData] = useState<any>(null);
	const [isLoadingMoldSet, setIsLoadingMoldSet] = useState(false);

	const formMethodsRef = useRef<UseFormReturn<
		Record<string, unknown>
	> | null>(null);
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const processedColumns =
		useDataTableColumns<BomSetDataType>(bomSetColumns);

	// BOM 기반 SET 상태 관리
	const [openInstanceModal, setOpenInstanceModal] = useState(false);
	const [openUnassignModal, setOpenUnassignModal] = useState(false);
	const [selectedBomItem, setSelectedBomItem] = useState<BomSetDataType | null>(null);
	const [newMasterId, setNewMasterId] = useState<number | null>(null);
	const [isCreated, setIsCreated] = useState(false);
	const [isDetailsSaved, setIsDetailsSaved] = useState(false);
	const [formMethods, setFormMethods] = useState<UseFormReturn<
		Record<string, unknown>
	> | null>(null);
	
	// 제품 선택 상태
	const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
	const [selectedItemValue, setSelectedItemValue] = useState<string>('');
	const [selectedItemData, setSelectedItemData] = useState<{
		itemId: number;
		itemNo?: string;
		itemNumber?: string;
		itemName?: string;
		itemSpec?: string;
	} | null>(null);

	// 공정 및 설비 선택 상태
	const [selectedProgressId, setSelectedProgressId] = useState<string>('');
	const [selectedMachineId, setSelectedMachineId] = useState<number | null>(null);
	const [selectedMachineValue, setSelectedMachineValue] = useState<string>('');
	const [selectedMachineName, setSelectedMachineName] = useState<string>('');

	// 참조 제품 및 공정 상태
	const [selectedRefItemId, setSelectedRefItemId] = useState<number | null>(null);
	const [selectedRefItemValue, setSelectedRefItemValue] = useState<string>('');
	const [selectedRefProgressId, setSelectedRefProgressId] = useState<string>('');

	// BOM 데이터 상태 (제품의 MoldMaster 목록)
	const [bomData, setBomData] = useState<BomSetDataType[]>([]);
	const [isLoadingBom, setIsLoadingBom] = useState(false);

	// 실금형 선택 상태
	const [selectedMoldInstanceId, setSelectedMoldInstanceId] = useState<string>('');
	const [selectedMoldInstanceData, setSelectedMoldInstanceData] = useState<{
		id: string;
		moldInstanceName: string;
		moldInstanceCode?: string;
		moldCode?: string;
		grade?: string;
		moldLife?: number;
		keepPlace?: string;
		moldInstanceStandard?: string;
	} | null>(null);

	// 데이터 테이블 초기화 (BOM 데이터 사용)
	const { table, toggleRowSelection, selectedRows } = useDataTable(
		bomData,
		processedColumns,
		30,
		1,
		0,
		bomData.length,
		() => {}
	);

	// 제품 선택 시 BOM 조회 (Master -> Detail 2단계)
	const loadBomData = async (itemId: number, moldBomMasterId?: number) => {
		if (!itemId) return;
		
		setIsLoadingBom(true);
		try {
			let bomMasterId = moldBomMasterId;
			
			// moldBomMasterId가 제공되지 않은 경우 제품별 MoldBomMaster 조회
			if (!bomMasterId) {
				const masterResponse = await getMoldBomMasterList({ itemId }, 0, 100);
				
				if (masterResponse.status !== 'success' || !masterResponse.data || masterResponse.data.length === 0) {
					setBomData([]);
					toast.info('해당 제품에 대한 BOM Master가 없습니다.');
					return;
				}

				// 첫 번째 BOM Master 사용 (일반적으로 제품당 하나의 BOM Master)
				bomMasterId = masterResponse.data[0].id;
			}

			// 새로운 API로 Set Assigned Instances 조회
			const assignedInstancesResponse = await getMoldBomDetailSetAssignedInstances(bomMasterId);
			
			if (assignedInstancesResponse.status === 'success' && assignedInstancesResponse.data) {
				// 새로운 API 응답에서 금형 목록 추출
				let assignedInstances = [];
				
				if (Array.isArray(assignedInstancesResponse.data)) {
					assignedInstances = assignedInstancesResponse.data;
				} else {
					setBomData([]);
					toast.info('Set Assigned Instances 데이터 구조를 인식할 수 없습니다.');
					return;
				}
				
				// Set Assigned Instances 데이터를 SET 데이터 형식으로 변환
				const bomSetData: BomSetDataType[] = assignedInstances.map((instance: MoldBomDetailSetAssignedInstanceDto, index: number) => {
					const isAssigned = !!(instance.assignedMoldInstanceCode && instance.assignedMoldInstanceName);
					
					return {
						id: `bom-${instance.moldBomDetailId || index}`,
						moldMasterId: instance.moldMasterId || 0,
						moldBomDetailId: instance.moldBomDetailId || 0,
						moldSetDetailId: instance.moldSetDetailId,
						moldCode: instance.moldCode,
						moldName: instance.moldName,
						moldStandard: instance.moldStandard,
						isAssigned,
						assignedInstanceId: instance.moldInstanceId,
						assignedInstanceCode: instance.assignedMoldInstanceCode,
						assignedInstanceName: instance.assignedMoldInstanceName,
					};
				});
				
				setBomData(bomSetData);
				toast.success(`${bomSetData.length}개의 금형이 조회되었습니다.`);
			} else {
				setBomData([]);
				toast.info('해당 BOM Master에 대한 Set Assigned Instances가 없습니다.');
			}
		} catch (error) {
			console.error('BOM 조회 오류:', error);
			toast.error('BOM 조회 중 오류가 발생했습니다.');
			setBomData([]);
		} finally {
			setIsLoadingBom(false);
		}
	};

	// 제품 선택 시 BOM 자동 조회
	useEffect(() => {
		if (selectedItemId && !isCreated) {
			loadBomData(selectedItemId);
		}
	}, [selectedItemId, isCreated]);

	// 수정 모드일 때 데이터 로드
	useEffect(() => {
		const loadMoldSetData = async () => {
			if (isEditMode) {
				setIsLoadingMoldSet(true);
				try {
					let data;
					
					// location.state에서 데이터가 있으면 우선 사용
					if (stateEditData) {
						data = {
							id: stateEditData.id,
							moldSetName: stateEditData.moldSetName,
							moldSetDate: stateEditData.moldSetDate,
							place: stateEditData.place,
							isDefault: stateEditData.isDefault,
							itemId: stateEditData.itemId,
							itemNo: stateEditData.itemNo,
							itemName: stateEditData.itemName,
							itemNumber: stateEditData.itemNumber,
							itemSpec: stateEditData.itemSpec,
							progressId: stateEditData.progressId,
							machineId: stateEditData.machineId,
							machineName: stateEditData.machineName,
							refItemId: stateEditData.refItemId,
							refProgressId: stateEditData.refProgressId,
							moldBomMasterId: stateEditData.moldBomMasterId,
							createdBy: stateEditData.createdBy,
							createdAt: stateEditData.createdAt,
							updatedBy: stateEditData.updatedBy,
							updatedAt: stateEditData.updatedAt,
							moldSetDetails: stateEditData.moldSetDetails || []
						};
					} else if (editId) {
						// URL 파라미터로만 편집 모드인 경우 (실제 데이터 로드 필요)
						data = {
							id: parseInt(editId),
							moldSetName: '',
							moldSetDate: '',
							place: '',
							isDefault: false,
							itemId: null,
							itemName: '',
							itemNumber: '',
							progressId: null,
							machineId: null,
							machineName: '',
							refItemId: null,
							refProgressId: null,
							moldSetDetails: []
						};
					}
					
					if (data) {
						setMoldSetData(data);
					}
				} catch (error) {
					console.error('데이터 로드 실패:', error);
					toast.error('데이터를 불러오는 중 오류가 발생했습니다.');
				} finally {
					setIsLoadingMoldSet(false);
				}
			}
		};

		loadMoldSetData();
	}, [isEditMode, editId, stateEditData]);

	// 수정 모드일 때 기존 데이터 로드
	useEffect(() => {
		if (isEditMode && moldSetData && formMethodsRef.current) {
			const data = moldSetData;
			
			// 폼 필드 설정
			formMethodsRef.current.setValue('moldSetName', data.moldSetName);
			formMethodsRef.current.setValue('moldSetDate', data.moldSetDate ? new Date(data.moldSetDate).toISOString().split('T')[0] : '');
			formMethodsRef.current.setValue('place', data.place);
			formMethodsRef.current.setValue('isDefault', data.isDefault);

			// 제품 정보 설정
			if (data.itemId) {
				setSelectedItemId(data.itemId);
				// ItemSelectComponent가 value(itemId)를 받아서 자동으로 데이터를 로드할 것임
				// setSelectedItemValue는 컴포넌트에서 자동으로 설정됨
				if (data.itemName || data.itemNumber) {
					setSelectedItemData({
						itemId: data.itemId,
						itemNo: data.itemNo,
						itemNumber: data.itemNumber,
						itemName: data.itemName,
						itemSpec: data.itemSpec,
					});
				}
			}

			// 공정 및 설비 정보 설정
			if (data.progressId) {
				setSelectedProgressId(data.progressId.toString());
			}
			if (data.machineId) {
				setSelectedMachineId(data.machineId);
				setSelectedMachineName(data.machineName || '');
			}

			// 참조 제품 및 공정 정보 설정
			if (data.refItemId) {
				setSelectedRefItemId(data.refItemId);
			}
			if (data.refProgressId) {
				setSelectedRefProgressId(data.refProgressId.toString());
			}

			// 수정 모드에서 새로운 API를 사용하여 할당된 실금형 데이터 로드
			if (data.moldBomMasterId && data.itemId) {
				loadBomData(data.itemId, data.moldBomMasterId);
			} else if (data.itemId) {
				loadBomData(data.itemId);
			}

			// 수정 모드에서는 이미 생성된 상태로 설정
			setIsCreated(true);
			setNewMasterId(data.id);
		}
	}, [isEditMode, moldSetData]);

	const handleFormReady = (
		methods: UseFormReturn<Record<string, unknown>>
	) => {
		formMethodsRef.current = methods;
		setFormMethods(methods);
	};

	// BOM 항목에 실금형 할당 핸들러
	const handleAssignInstance = () => {
		if (selectedRows.size === 0) {
			toast.error('실금형을 할당할 금형을 선택해주세요.');
			return;
		}

		const selectedId = Array.from(selectedRows)[0] as string;
		
		// 선택된 행의 인덱스로 BOM 항목 찾기
		const selectedIndex = parseInt(selectedId);
		const bomItem = bomData[selectedIndex];

		if (bomItem) {
			setSelectedBomItem(bomItem);
			setOpenInstanceModal(true);
		} else {
			toast.error('선택된 금형 정보를 찾을 수 없습니다.');
		}
	};

	// 실금형 선택 모달 제출 핸들러
	const handleMoldInstanceSelect = async () => {
		if (!selectedBomItem) {
			toast.error('할당할 금형을 선택해주세요.');
			return;
		}

		if (!selectedMoldInstanceId) {
			toast.error('실금형을 선택해주세요.');
			return;
		}

		try {
			// 선택된 실금형 ID로 상세 정보 조회
			const moldInstanceId = parseInt(selectedMoldInstanceId);
			const { getMoldInstanceById } = await import('@primes/services/mold/moldInstanceService');
			const response = await getMoldInstanceById(moldInstanceId);
			
			if (response.status === 'success' && response.data) {
				const moldInstanceData = response.data;
				
				// BOM 데이터에서 해당 항목 업데이트
				setBomData((prev) =>
					prev.map((item) =>
						item.id === selectedBomItem.id
							? {
									...item,
									isAssigned: true,
									assignedInstanceId: moldInstanceData.id,
									assignedInstanceCode: moldInstanceData.moldInstanceCode || moldInstanceData.id?.toString(),
									assignedInstanceName: moldInstanceData.moldInstanceName || 'N/A',
								}
							: item
					)
				);

				setIsDetailsSaved(false); // 새 데이터가 할당되면 저장 상태 초기화
				setOpenInstanceModal(false);
				setSelectedMoldInstanceId('');
				setSelectedMoldInstanceData(null);
				setSelectedBomItem(null);
				
				// 즉시 선택된 항목만 저장
				await handleSaveSingleItem(selectedBomItem, moldInstanceData.id);
				
				toast.success('실금형이 할당되었습니다.');
			} else {
				toast.error('실금형 정보를 불러올 수 없습니다.');
			}
		} catch (error) {
			console.error('Error fetching mold instance details:', error);
			toast.error('실금형 정보를 불러오는 중 오류가 발생했습니다.');
		}
	};

	// 실금형 할당 해제 모달 열기
	const handleUnassignInstance = () => {
		if (selectedRows.size === 0) {
			toast.error('할당을 해제할 금형을 선택해주세요.');
			return;
		}

		const selectedId = Array.from(selectedRows)[0] as string;
		const selectedIndex = parseInt(selectedId);
		const bomItem = bomData[selectedIndex];

		if (bomItem && bomItem.isAssigned) {
			setSelectedBomItem(bomItem);
			setOpenUnassignModal(true);
		} else {
			toast.error('할당된 실금형이 없습니다.');
		}
	};

	// 실금형 할당 해제 확인 핸들러
	const handleConfirmUnassign = async () => {
		if (!selectedBomItem) return;

		setBomData((prev) =>
			prev.map((item) =>
				item.id === selectedBomItem.id
					? {
							...item,
							isAssigned: false,
							assignedInstanceId: undefined,
							assignedInstanceCode: undefined,
							assignedInstanceName: undefined,
						}
					: item
			)
		);
		
		setIsDetailsSaved(false);
		setOpenUnassignModal(false);
		setSelectedBomItem(null);
		
		// 즉시 선택된 항목만 저장 (할당 해제)
		await handleSaveSingleItemUnassign(selectedBomItem);
		
		toast.success('실금형 할당이 해제되었습니다.');
	};


	// 단일 항목 할당 해제 핸들러
	const handleSaveSingleItemUnassign = async (bomItem: BomSetDataType) => {
		if (!selectedItemId) {
			toast.error('제품을 선택해주세요.');
			return;
		}

		try {
			let masterId = newMasterId;

			// 마스터가 아직 생성되지 않았다면 먼저 생성
			if (!masterId) {
				if (formMethodsRef.current) {
					const formData = formMethodsRef.current.getValues();
					const masterData = {
						...formData,
						itemId: selectedItemId,
						itemNo: selectedItemData?.itemNo || undefined,
						itemNumber: selectedItemData?.itemNumber || undefined,
						itemName: selectedItemData?.itemName || undefined,
						itemSpec: selectedItemData?.itemSpec || undefined,
						progressId: selectedProgressId,
						machineId: selectedMachineId,
					};

					const { createMoldSet } = await import('@primes/services/mold/moldSetService');
					const masterResponse = await createMoldSet(masterData);
					
					if (masterResponse.status === 'success' && masterResponse.data) {
						masterId = masterResponse.data.id;
						setNewMasterId(masterId);
					} else {
						toast.error('마스터 생성에 실패했습니다.');
						return;
					}
				} else {
					toast.error('폼 데이터를 가져올 수 없습니다.');
					return;
				}
			}

			// 할당 해제를 위한 DELETE 요청 (moldSetDetailId 필요)
			if (bomItem.moldSetDetailId) {
				const { deleteMoldSetDetail } = await import('@primes/services/mold/moldSetService');
				await deleteMoldSetDetail([bomItem.moldSetDetailId]);
				
				// 관련 쿼리 캐시 무효화
				queryClient.invalidateQueries({ queryKey: ['moldSet'] });
				queryClient.invalidateQueries({ queryKey: ['moldBomDetailSetAssignedInstances'] });
				
				setIsDetailsSaved(true);
				toast.success('실금형 할당이 성공적으로 해제되었습니다.');
			}
		} catch (error: any) {
			console.error('Error unassigning single item:', error);
			toast.error(`할당 해제 중 오류가 발생했습니다: ${error.message}`);
		}
	};

	// 단일 항목 저장 핸들러 (실금형 할당/해제 시 사용)
	const handleSaveSingleItem = async (bomItem: BomSetDataType, moldInstanceId: number) => {
		if (!selectedItemId) {
			toast.error('제품을 선택해주세요.');
			return;
		}

		try {
			let masterId = newMasterId;

			// 마스터가 아직 생성되지 않았다면 먼저 생성
			if (!masterId) {
				if (formMethodsRef.current) {
					const formData = formMethodsRef.current.getValues();
					const masterData = {
						...formData,
						itemId: selectedItemId,
						itemNo: selectedItemData?.itemNo || undefined,
						itemNumber: selectedItemData?.itemNumber || undefined,
						itemName: selectedItemData?.itemName || undefined,
						itemSpec: selectedItemData?.itemSpec || undefined,
						progressId: selectedProgressId,
						machineId: selectedMachineId,
					};

					const { createMoldSet } = await import('@primes/services/mold/moldSetService');
					const masterResponse = await createMoldSet(masterData);
					
					if (masterResponse.status === 'success' && masterResponse.data) {
						masterId = masterResponse.data.id;
						setNewMasterId(masterId);
					} else {
						toast.error('마스터 생성에 실패했습니다.');
						return;
					}
				} else {
					toast.error('폼 데이터를 가져올 수 없습니다.');
					return;
				}
			}

			// 선택된 항목만 전송
			const detailItem = {
				moldSetMasterId: masterId!,
				moldBomDetailId: bomItem.moldBomDetailId,
				moldInstanceId: moldInstanceId,
			};


			const { createMoldSetDetailBatch } = await import('@primes/services/mold/moldSetService');
			await createMoldSetDetailBatch([detailItem]);
			
			// 관련 쿼리 캐시 무효화
			queryClient.invalidateQueries({ queryKey: ['moldSet'] });
			queryClient.invalidateQueries({ queryKey: ['moldBomDetailSetAssignedInstances'] });
			
			setIsDetailsSaved(true);
			toast.success('실금형이 성공적으로 할당되었습니다.');
		} catch (error: any) {
			console.error('Error saving single item:', error);
			toast.error(`저장 중 오류가 발생했습니다: ${error.message}`);
		}
	};

	// BOM 기반 SET 상세 데이터 저장 핸들러
	const handleSaveDetails = async () => {
		// 할당된 실금형이 있는 BOM 항목들만 필터링
		const assignedItems = bomData.filter(item => item.isAssigned && item.assignedInstanceId);

		if (assignedItems.length === 0) {
			toast.error('저장할 실금형이 없습니다. 최소 하나 이상의 실금형을 할당해주세요.');
			return;
		}

		if (!selectedItemId) {
			toast.error('제품을 선택해주세요.');
			return;
		}

		try {
			let masterId = newMasterId;

			// 마스터가 아직 생성되지 않았다면 먼저 생성
			if (!masterId) {
				if (formMethodsRef.current) {
					const formData = formMethodsRef.current.getValues();
					const masterData = {
						...formData,
						itemId: selectedItemId,
						itemNo: selectedItemData?.itemNo || undefined,
						itemNumber: selectedItemData?.itemNumber || undefined,
						itemName: selectedItemData?.itemName || undefined,
						itemSpec: selectedItemData?.itemSpec || undefined,
						progressId: selectedProgressId ? parseInt(selectedProgressId) : undefined,
						machineId: selectedMachineId || undefined,
						machineName: selectedMachineName || undefined,
						refItemId: selectedRefItemId || undefined,
						refProgressId: selectedRefProgressId ? parseInt(selectedRefProgressId) : undefined,
					};

					const masterResult = await new Promise((resolve, reject) => {
						createMoldSet.mutate(masterData, {
							onSuccess: (res: any) => {
								resolve(res);
							},
							onError: (error: any) => {
								reject(error);
							},
						});
					});

					masterId = (masterResult as any).id;
					setNewMasterId(masterId);
					setIsCreated(true);
				} else {
					toast.error('폼 데이터를 가져올 수 없습니다.');
					return;
				}
			}

			// BOM 기반 SET 상세 데이터를 API 형식에 맞게 변환
			const detailList = assignedItems.map((item) => {
				
				return {
					moldSetMasterId: masterId!,
					moldBomDetailId: item.moldBomDetailId,
					moldInstanceId: item.assignedInstanceId!,
				};
			});

			createMoldSetDetailBatch.mutate(detailList, {
				onSuccess: () => {
					setIsDetailsSaved(true);
					toast.success(`금형 SET이 성공적으로 저장되었습니다. (${assignedItems.length}개 실금형)`);
				},
				onError: (error: any) => {
					console.error('Error saving mold set details:', error);
					toast.error(`저장 중 오류가 발생했습니다: ${error.message}`);
				},
			});
		} catch (error: any) {
			console.error('Error creating mold set master:', error);
			toast.error(`마스터 생성 중 오류가 발생했습니다: ${error.message}`);
		}
	};


	// BOM 기반 SET 마스터 폼 스키마
	const masterFormSchema = [
		{
			name: 'moldSetName',
			label: '금형세트명',
			type: 'text',
			placeholder: '금형세트명을 입력하세요',
			required: true,
			maxLength: 50,
			disabled: isCreated && !isEditMode,
		},
		{
			name: 'moldSetDate',
			label: '세트 등록일',
			type: 'date',
			placeholder: '등록일을 선택하세요',
			required: false,
			defaultValue: new Date().toISOString().split('T')[0], // 오늘 날짜
			disabled: isCreated && !isEditMode,
		},
		{
			name: 'place',
			label: '보관장소',
			type: 'text',
			placeholder: '보관장소를 입력하세요',
			required: false,
			disabled: isCreated && !isEditMode,
		},
		{
			name: 'isDefault',
			label: '기본세트여부',
			type: 'checkbox',
			required: false,
			defaultValue: true,
			disabled: isCreated && !isEditMode,
		},
	];

	// BOM 기반 리셋 핸들러
	const handleResetForm = () => {
		if (formMethodsRef.current) {
			formMethodsRef.current.reset();
			setIsCreated(false);
			setNewMasterId(null);
			setSelectedItemId(null);
			setSelectedItemValue('');
			setSelectedItemData(null);
			setSelectedProgressId('');
			setSelectedMachineId(null);
			setSelectedMachineValue('');
			setSelectedMachineName('');
			setSelectedRefItemId(null);
			setSelectedRefItemValue('');
			setSelectedRefProgressId('');
			setBomData([]); // BOM 데이터 초기화
			setIsDetailsSaved(false);
		}
	};

	const handleSubmitForm = () => {
		if (formMethodsRef.current) {
			formMethodsRef.current.handleSubmit((data) => {
				// 필수 필드 검증
				if (!selectedItemId) {
					toast.error('품목을 선택해주세요.');
					return;
				}

				const formData = {
					...data,
					itemId: selectedItemId ?? undefined,
					itemNo: selectedItemData?.itemNo || undefined,
					itemNumber: selectedItemData?.itemNumber || undefined,
					itemName: selectedItemData?.itemName || undefined,
					itemSpec: selectedItemData?.itemSpec || undefined,
					progressId: selectedProgressId
						? parseInt(selectedProgressId)
						: undefined,
					machineId: selectedMachineId ?? undefined,
					machineName: selectedMachineName || undefined,
					refItemId: selectedRefItemId ?? undefined,
					refProgressId: selectedRefProgressId
						? parseInt(selectedRefProgressId)
						: undefined,
				};

				// 수정 모드인지 확인하여 적절한 API 호출
				const mutation = isEditMode ? updateMoldSet : createMoldSet;
				const mutationData = isEditMode ? { id: parseInt(editId!), ...formData } : formData;

				mutation.mutate(mutationData, {
					onSuccess: (res: any) => {
						const message = isEditMode ? '금형 SET이 성공적으로 수정되었습니다.' : '금형 SET이 성공적으로 저장되었습니다.';
						toast.success(message);
						
						if (!isEditMode && res.id && typeof res.id === 'number') {
							setNewMasterId(res.id);
						}
						setIsCreated(true);
						if (onSuccess) {
							onSuccess();
						}
					},
					onError: (error: any) => {
						const message = isEditMode ? '수정 중 오류가 발생했습니다' : '저장 중 오류가 발생했습니다';
						toast.error(`${message}: ${error.message}`);
					},
				});
			})();
		}
	};

	const MoldSetInfoActionButtons = () => (
		<div className="flex items-center gap-2.5">
			<RadixButton
				className={`flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border ${
					isCreated && !isEditMode
						? 'bg-gray-300 cursor-not-allowed'
						: 'bg-Colors-Brand-600 text-white'
				}`}
				onClick={handleResetForm}
				disabled={isCreated && !isEditMode}
			>
				<RotateCw
					size={16}
					className={isCreated && !isEditMode ? 'text-gray-400' : 'text-white'}
				/>
				{tCommon('pages.mold.set.reset')}
			</RadixButton>
			<RadixButton
				className={`flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border ${
					isCreated && !isEditMode
						? 'bg-gray-300 cursor-not-allowed'
						: 'bg-Colors-Brand-600 text-white'
				}`}
				onClick={handleSubmitForm}
				disabled={isCreated && !isEditMode}
			>
				<Check
					size={16}
					className={isCreated && !isEditMode ? 'text-gray-400' : 'text-white'}
				/>
				{isEditMode ? '수정' : tCommon('pages.mold.set.save')}
			</RadixButton>
		</div>
	);

	return (
		<>
			{/* 실금형 할당 모달 */}
			<DraggableDialog
				open={openInstanceModal}
				onOpenChange={(open: boolean) => {
					setOpenInstanceModal(open);
					if (!open) {
						setSelectedMoldInstanceId('');
						setSelectedBomItem(null);
					}
				}}
				title={`실금형 할당 - ${selectedBomItem?.moldName || ''}`}
				content={
					<div className="p-2 space-y-3">
						{selectedBomItem && (
							<div className="bg-blue-50 p-3 rounded-lg">
								<h4 className="font-medium text-blue-900 mb-2">할당 대상 금형 정보</h4>
								<div className="space-y-1 text-sm text-blue-800">
									<p><strong>금형 코드:</strong> {selectedBomItem.moldCode}</p>
									<p><strong>금형명:</strong> {selectedBomItem.moldName}</p>
									<p><strong>규격:</strong> {selectedBomItem.moldStandard}</p>
									<p><strong>할당 상태:</strong> 
										<span className={`ml-2 px-2 py-1 rounded text-xs ${
											selectedBomItem.isAssigned 
												? 'bg-green-100 text-green-800' 
												: 'bg-orange-100 text-orange-800'
										}`}>
											{selectedBomItem.isAssigned ? '할당완료' : '미할당'}
										</span>
									</p>
									{selectedBomItem.isAssigned && (
										<div className="mt-2 pt-2 border-t border-blue-200">
											<p className="text-blue-700 text-xs">현재 할당: {selectedBomItem.assignedInstanceName}</p>
										</div>
									)}
								</div>
							</div>
						)}
						
						<div className="bg-green-50 p-2 rounded-lg">
							<p className="text-green-800 text-sm">
								💡 해당 금형과 호환되는 실금형만 표시됩니다.
							</p>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								할당할 실금형 선택{' '}
								<span className="text-red-400">*</span>
							</label>
							{(() => {
								const searchParams = {
									moldMasterId: selectedBomItem?.moldMasterId,
								};
								
								return (
									<MoldInstanceSelectComponent
										fieldKey="moldInstanceName"
										placeholder="실금형을 선택하세요"
										value={selectedMoldInstanceId}
										onChange={(value) =>
											setSelectedMoldInstanceId(value)
										}
										onMoldInstanceDataChange={(data) =>
											setSelectedMoldInstanceData(data)
										}
										className="w-full"
										searchParams={searchParams}
									/>
								);
							})()}
						</div>

						{selectedMoldInstanceData && (
							<div className="bg-gray-50 p-3 rounded-lg">
								<h5 className="font-medium text-gray-900 mb-2">선택된 실금형 정보</h5>
								<div className="text-sm text-gray-600 space-y-1">
									<p><strong>실금형 코드:</strong> {selectedMoldInstanceData.moldInstanceCode}</p>
									<p><strong>실금형명:</strong> {selectedMoldInstanceData.moldInstanceName}</p>
									<p><strong>등급:</strong> {selectedMoldInstanceData.grade || 'N/A'}</p>
									<p><strong>보관장소:</strong> {selectedMoldInstanceData.keepPlace || 'N/A'}</p>
								</div>
							</div>
						)}

						<div className="flex justify-end gap-2 pt-4">
							<RadixButton
								className="px-4 py-2 border rounded-lg text-sm"
								onClick={() => setOpenInstanceModal(false)}
							>
								취소
							</RadixButton>
							<RadixButton
								className="px-4 py-2 bg-Colors-Brand-600 text-white rounded-lg text-sm hover:bg-Colors-Brand-700"
								onClick={handleMoldInstanceSelect}
								disabled={!selectedMoldInstanceId}
							>
								{selectedBomItem?.isAssigned ? '재할당' : '할당'}
							</RadixButton>
						</div>
					</div>
				}
			/>

			{/* 실금형 할당 해제 확인 모달 */}
			<DraggableDialog
				open={openUnassignModal}
				onOpenChange={(open: boolean) => {
					setOpenUnassignModal(open);
					if (!open) {
						setSelectedBomItem(null);
					}
				}}
				title="실금형 할당 해제"
				content={
					<div className="p-4 space-y-4">
						{selectedBomItem && (
							<div className="bg-orange-50 p-4 rounded-lg">
								<h4 className="font-medium text-orange-900 mb-3">할당 해제할 금형 정보</h4>
								<div className="space-y-2 text-sm text-orange-800">
									<p><strong>금형 코드:</strong> {selectedBomItem.moldCode}</p>
									<p><strong>금형명:</strong> {selectedBomItem.moldName}</p>
									<p><strong>규격:</strong> {selectedBomItem.moldStandard}</p>
									{selectedBomItem.isAssigned && (
										<div className="mt-3 pt-3 border-t border-orange-200">
											<p className="font-medium text-orange-900 mb-1">현재 할당된 실금형:</p>
											<p><strong>실금형 코드:</strong> {selectedBomItem.assignedInstanceCode}</p>
											<p><strong>실금형명:</strong> {selectedBomItem.assignedInstanceName}</p>
										</div>
									)}
								</div>
							</div>
						)}
						<div className="bg-yellow-50 p-3 rounded-lg">
							<p className="text-yellow-800 text-sm">
								⚠️ 이 작업을 수행하면 할당된 실금형이 해제됩니다. 계속하시겠습니까?
							</p>
						</div>
						<div className="flex justify-end gap-2 pt-4">
							<RadixButton
								className="px-4 py-2 border rounded-lg text-sm"
								onClick={() => setOpenUnassignModal(false)}
							>
								취소
							</RadixButton>
							<RadixButton
								className="px-4 py-2 bg-orange-600 text-white rounded-lg text-sm hover:bg-orange-700"
								onClick={handleConfirmUnassign}
							>
								할당 해제
							</RadixButton>
						</div>
					</div>
				}
			/>

			{/* 메인 페이지 */}
			<div className="max-w-full mx-auto p-4 h-full flex flex-col">
				<div className="flex justify-between items-center gap-2 mb-3">
					<RadixButton
						className="flex gap-2 px-3 py-2 rounded-lg text-sm items-center border"
						onClick={() => navigate(-1)}
					>
						<ArrowLeft
							size={16}
							className="text-muted-foreground"
						/>
						{t('tabs.goBack')}
					</RadixButton>
					{isEditMode && (
						<div className="text-sm text-gray-600">
							{isLoadingMoldSet ? '데이터 로딩 중...' : `수정 모드 (ID: ${editId})`}
						</div>
					)}
				</div>

				<PageTemplate
					firstChildWidth="30%"
					splitterSizes={[25, 75]}
					splitterMinSize={[310, 550]}
					splitterGutterSize={8}
				>
					{/* 마스터 폼 */}
					<div className="border rounded-lg overflow-auto h-full">
						<FormComponent
							title={isEditMode ? "금형 SET 수정" : "금형 SET 등록"}
							actionButtons={<MoldSetInfoActionButtons />}
						>
							<div className="space-y-4">
								{/* 제품 선택 */}
								<div className="mb-4">
									<div className="flex items-center mb-2">
										<label className="w-32 text-sm font-medium text-gray-700">
											{t('columns.item')}{' '}
											<span className="text-red-400">*</span>
										</label>
										<div className="flex-1">
											<ItemSelectComponent
												placeholder="제품을 선택하세요 (BOM 자동 조회)"
												value={selectedItemId?.toString()}
												onChange={(value) => {
													setSelectedItemValue(value);
												}}
												onItemIdChange={(itemId) => {
													setSelectedItemId(itemId);
													// 제품이 변경되면 공정 선택 초기화
													setSelectedProgressId('');
													// 설비 선택도 초기화
													setSelectedMachineId(null);
													setSelectedMachineValue('');
													setSelectedMachineName('');
												}}
												onItemDataChange={(itemData) => {
													setSelectedItemData(itemData);
												}}
												displayFields={[
													'itemName',
													'itemSpec',
												]}
												className="w-full"
												disabled={isCreated && !isEditMode}
											/>
										</div>
									</div>
									{selectedItemData && (
										<div className="bg-blue-50 p-3 rounded-lg text-sm">
											<p className="text-blue-800">
												<strong>선택된 제품:</strong> {selectedItemData.itemName} ({selectedItemData.itemNumber})
											</p>
											<p className="text-blue-600 mt-1">
												제품의 BOM을 기반으로 금형 SET을 구성합니다. 각 금형에 실금형을 할당해주세요.
											</p>
										</div>
									)}
								</div>

								{/* 공정 선택 */}
								<div className="flex items-center mb-4">
									<label className="w-32 text-sm font-medium text-gray-700">
										{t('columns.progressName')}
									</label>
									<div className="flex-1">
										<ItemProgressSelectComponent
											placeholder="공정을 선택하세요"
											value={selectedProgressId}
											onChange={(value) => {
												setSelectedProgressId(value);
												// 공정이 변경되면 설비 선택 초기화
												setSelectedMachineId(null);
												setSelectedMachineValue('');
												setSelectedMachineName('');
											}}
											itemId={selectedItemId ?? undefined}
											disabled={!selectedItemId || (isCreated && !isEditMode)}
											className="w-full"
										/>
									</div>
								</div>

								{/* 설비 선택 */}
								<div className="flex items-center mb-4">
									<label className="w-32 text-sm font-medium text-gray-700">
										설비
									</label>
									<div className="flex-1">
										<MachineSelectComponent
											placeholder="설비를 선택하세요"
											value={selectedMachineId?.toString()}
											onChange={(value) => {
												setSelectedMachineValue(value);
											}}
											onMachineIdChange={(machineId) => {
												setSelectedMachineId(machineId);
											}}
											onMachineNameChange={(machineName) => {
												setSelectedMachineName(machineName);
											}}
											disabled={!selectedProgressId || (isCreated && !isEditMode)}
											searchParams={{
												isUse: true,
												isNotwork: false,
											}}
											className="w-full"
										/>
									</div>
								</div>

								{/* 참조제품 선택 */}
								<div className="flex items-center mb-4">
									<label className="w-32 text-sm font-medium text-gray-700">
										참조{t('columns.item')}
									</label>
									<div className="flex-1">
										<ItemSelectComponent
											placeholder="참조제품을 선택하세요"
											value={selectedRefItemValue}
											onChange={(value) => {
												setSelectedRefItemValue(value);
											}}
											onItemIdChange={(itemId) => {
												setSelectedRefItemId(itemId);
												// 참조제품이 변경되면 참조공정 선택 초기화
												setSelectedRefProgressId('');
											}}
											displayFields={[
												'itemName',
												'itemSpec',
											]}
											className="w-full"
											disabled={isCreated && !isEditMode}
										/>
									</div>
								</div>

								{/* 참조공정 선택 */}
								<div className="flex items-center mb-4">
									<label className="w-32 text-sm font-medium text-gray-700">
										참조{t('columns.progressName')}
									</label>
									<div className="flex-1">
										<ItemProgressSelectComponent
											placeholder="참조공정을 선택하세요"
											value={selectedRefProgressId}
											onChange={(value) => {
												setSelectedRefProgressId(value);
											}}
											itemId={selectedRefItemId ?? undefined}
											disabled={!selectedRefItemId || (isCreated && !isEditMode)}
											className="w-full"
										/>
									</div>
								</div>

								{/* BOM 기반 SET 기본 정보 */}
								<DynamicForm
									onFormReady={handleFormReady}
									fields={masterFormSchema}
									visibleSaveButton={false}
								/>
							</div>
						</FormComponent>
					</div>

					{/* BOM 기반 SET 구성 테이블 */}
					<div className="border rounded-lg overflow-hidden h-full">
						<DatatableComponent
							columns={processedColumns}
							table={table}
							data={bomData}
							tableTitle={`금형 SET`}
							rowCount={bomData.length}
							defaultPageSize={30}
							actionButtons={
								(() => {
									// 버튼 활성화 조건 계산
									const hasSelection = selectedRows.size > 0;
									const hasBomData = bomData.length > 0;
									const selectedItem = hasSelection ? bomData[parseInt(Array.from(selectedRows)[0])] : null;
									const isSelectedItemAssigned = selectedItem?.isAssigned || false;
									
									const canAssign = hasSelection && hasBomData && !isSelectedItemAssigned;
									const canUnassign = hasSelection && hasBomData && isSelectedItemAssigned;
									const assignedCount = bomData.filter(item => item.isAssigned).length;
									
									return (
										<div className="flex items-center gap-2.5">
											<RadixButton
												className={`flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border ${
													!canAssign
														? 'bg-gray-200 text-gray-400 cursor-not-allowed'
														: 'bg-Colors-Brand-600 text-white hover:bg-Colors-Brand-700'
												}`}
												onClick={handleAssignInstance}
												disabled={!canAssign}
											>
												<Package size={16} />
												실금형 할당
											</RadixButton>
											<RadixButton
												className={`flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border ${
													!canUnassign
														? 'bg-gray-200 text-gray-400 cursor-not-allowed'
														: 'bg-orange-600 text-white hover:bg-orange-700'
												}`}
												onClick={handleUnassignInstance}
												disabled={!canUnassign}
											>
												<Settings size={16} />
												할당 해제
											</RadixButton>
										</div>
									);
								})()
							}
							useSearch={false}
							usePageNation={false}
							useSummary={true}
							toggleRowSelection={toggleRowSelection}
							selectedRows={selectedRows}
							enableSingleSelect={true}
						/>
					</div>
				</PageTemplate>
			</div>
		</>
	);
};

export default MoldSetMasterDetailRegisterPage;

