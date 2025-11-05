import React, { useState, useEffect } from 'react';
import { DraggableDialog } from '@radix-ui/components';
import { DynamicForm } from '@primes/components/form/DynamicFormComponent';
import { MoldInstanceSelectComponent } from '@primes/components/customSelect';
import { moldInoutFormSchema, moldInputFormSchema } from '@primes/schemas/mold/moldInoutInformationSchemas';
import { getMoldInstanceById } from '@primes/services/mold/moldInstanceService';
import { useInputMoldInstances } from '@primes/hooks/mold/mold-instance/useInputMoldInstances';
import { useMoldBom } from '@primes/hooks/mold/mold-bom/useMoldBom';
import { MoldInstanceDto, MoldBomMasterDto, MoldBomDetailDto, MoldBomDetailSearchResponse } from '@primes/types/mold';
import { toast } from 'sonner';
import { RadixButton } from '@radix-ui/components';
import { Save, X } from 'lucide-react';

interface MoldInoutModalPanelProps {
	isInoutModalOpen: boolean;
	setIsInoutModalOpen: (open: boolean) => void;
	isInputModalOpen: boolean;
	setIsInputModalOpen: (open: boolean) => void;
	selectedCommandId: number | null;
	selectedItemId?: number; // BOM 조회를 위한 itemId
	onSuccess?: () => void; // 투입 성공 후 콜백
}

export const MoldInoutModalPanel: React.FC<MoldInoutModalPanelProps> = ({
	isInoutModalOpen,
	setIsInoutModalOpen,
	isInputModalOpen,
	setIsInputModalOpen,
	selectedCommandId,
	selectedItemId,
	onSuccess,
}) => {
	const inputMoldInstances = useInputMoldInstances();
	
	// 선택된 moldInstance들을 관리하는 상태 (인스턴스 ID와 위치 ID를 함께 저장)
	const [selectedInstances, setSelectedInstances] = useState<Record<number, { instanceId: number; locationId: number }>>({});
	
	// 선택된 인스턴스의 전체 데이터를 저장하는 상태
	const [selectedInstanceData, setSelectedInstanceData] = useState<Record<number, any>>({});
	
	// MoldBomMaster 조회
	const { list: moldBomList } = useMoldBom({
		searchRequest: selectedItemId ? { itemId: selectedItemId } : {},
		page: 0,
		size: 100,
	});

	// BOM 데이터에서 detail 리스트 추출
	const bomDetails = React.useMemo(() => {
		if (!moldBomList.data?.data || moldBomList.data.data.length === 0) return [];
		
		const master = moldBomList.data.data[0]; // 첫 번째 master 사용
		return master.moldBomDetail || [];
	}, [moldBomList.data?.data]);

	// 모달이 열릴 때마다 선택된 인스턴스 초기화
	useEffect(() => {
		if (isInoutModalOpen) {
			setSelectedInstances({});
		}
	}, [isInoutModalOpen]);

	// BOM 기반 투입 처리
	const handleBomInput = async () => {
		if (!selectedCommandId) {
			toast.error('작업지시를 선택해주세요.');
			return;
		}

		if (!selectedItemId) {
			toast.error('아이템을 선택해주세요.');
			return;
		}

		// 선택된 인스턴스가 있는지 확인
		const selectedInstanceData = Object.values(selectedInstances).filter(data => data.instanceId > 0);
		if (selectedInstanceData.length === 0) {
			toast.error('투입할 금형을 선택해주세요.');
			return;
		}

		try {
			const today = new Date().toISOString().split('T')[0];
			
			// 각 인스턴스별로 투입 요청 생성 (위치 ID 포함)
			const inputRequests = selectedInstanceData.map(data => ({
				moldInstanceIds: [data.instanceId],
				moldLocationId: data.locationId,
				inputDate: today,
				outCommandId: selectedCommandId,
				stock: 1,
			}));
			
			// 모든 투입 요청을 병렬로 처리
			await Promise.all(
				inputRequests.map(request => 
					inputMoldInstances.mutateAsync(request)
				)
			);
			
			setIsInoutModalOpen(false);
			toast.success(`${selectedInstanceData.length}개 금형 투입이 완료되었습니다.`);
			
			// 투입 성공 후 데이터 새로고침
			onSuccess?.();
		} catch (error) {
			console.error('Error inputting mold instances:', error);
			toast.error('금형 투입 중 오류가 발생했습니다.');
		}
	};

	// 인스턴스 선택 핸들러 (MoldInstanceSelectComponent에서 전달받은 데이터 사용)
	const handleInstanceSelect = (detailId: number, instanceData: any) => {
		const instanceId = Number(instanceData.id);
		const locationId = instanceData?.moldLocations?.[0]?.id;
		
		setSelectedInstances(prev => ({
			...prev,
			[detailId]: { instanceId, locationId }
		}));
		
		setSelectedInstanceData(prev => ({
			...prev,
			[detailId]: instanceData
		}));
	};

	// Handle mold input form submission
	const handleMoldInputSubmit = async (formData: any) => {
		if (!selectedCommandId) {
			toast.error('작업지시를 먼저 선택해주세요.');
			return;
		}

		try {
			const inputRequest = {
				moldInstanceIds: Array.isArray(formData.moldInstanceIds) 
					? formData.moldInstanceIds 
					: [formData.moldInstanceIds],
				moldLocationId: formData.moldLocationId,
				inputDate: formData.inputDate,
				outMachineId: formData.outMachineId,
				outMachineName: formData.outMachineName,
				outCommandId: selectedCommandId,
				outCommandNo: formData.outCommandNo,
				outItemId: formData.outItemId,
				outItemNo: formData.outItemNo,
				outItemName: formData.outItemName,
				outProgressId: formData.outProgressId,
				outProgressName: formData.outProgressName,
				stock: formData.stock,
			};
			
			await inputMoldInstances.mutateAsync(inputRequest);
			
			setIsInputModalOpen(false);
			toast.success('금형 투입이 완료되었습니다.');
		} catch (error) {
			console.error('Error inputting mold instances:', error);
			toast.error('금형 투입 중 오류가 발생했습니다.');
		}
	};

	return (
		<>
			{/* BOM 기반 투입 모달 */}
			<DraggableDialog
				open={isInoutModalOpen}
				onOpenChange={setIsInoutModalOpen}
				title="금형 투입 (BOM 기반)"
				content={
					<div className="w-full max-w-4xl max-h-[85vh] overflow-visible flex flex-col">
						{/* BOM Detail 리스트 */}
						<div className="flex-1 p-2">
							{bomDetails.length > 0 ? (
								<div className="space-y-4">
									{bomDetails.map((detail) => (
										<div key={detail.id} className="border rounded-lg p-4 bg-white">
											<div className="flex items-center justify-between mb-3">
												<div className="flex-1">
													<h4 className="font-medium text-gray-800">
														{detail.moldMaster?.moldName || detail.moldTypeName || 'Unknown Mold'}
													</h4>
													<p className="text-sm text-gray-600">
														코드: {detail.moldMaster?.moldCode || 'N/A'} | 
														수량: {detail.num || 1} | 
														타입: {detail.moldTypeName || 'N/A'}
													</p>
												</div>
												<div className="text-sm text-gray-500">
													{selectedInstances[detail.id] ? '선택됨' : '미선택'}
												</div>
											</div>
											
											{/* MoldInstance 선택 */}
											<div className="mt-3">
												<label className="block text-sm font-medium text-gray-700 mb-2">
													투입할 금형 인스턴스 선택
												</label>
												<MoldInstanceSelectComponent
													value={selectedInstances[detail.id] ? String(selectedInstances[detail.id].instanceId) : ''}
													onChange={(value) => {
														// onChange는 MoldInstanceSelectComponent 내부에서 처리됨
													}}
													onMoldInstanceDataChange={(data) => {
														// 전체 인스턴스 데이터를 받아서 위치 정보와 함께 저장
														handleInstanceSelect(detail.id, data);
													}}
													placeholder="금형 인스턴스를 선택하세요"
													searchParams={{
														moldMasterId: detail.moldMasterId,
														isInput: false
													}}
												/>
											</div>
										</div>
									))}
								</div>
							) : (
								<div className="flex items-center justify-center h-32 text-gray-500">
									<p>해당 아이템에 대한 BOM 데이터가 없습니다.</p>
								</div>
							)}
						</div>

						{/* 하단 버튼 */}
						<div className="p-2 flex justify-end">
							<button
								type="button"
								className={`px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
									Object.values(selectedInstances).filter(data => data.instanceId > 0).length === 0
										? 'bg-gray-400 cursor-not-allowed'
										: 'bg-Colors-Brand-600 hover:bg-Colors-Brand-700'
								}`}
								onClick={handleBomInput}
								disabled={Object.values(selectedInstances).filter(data => data.instanceId > 0).length === 0}
							>
								투입
							</button>
						</div>
					</div>
				}
			/>

			{/* Input Modal */}
			<DraggableDialog
				open={isInputModalOpen}
				onOpenChange={setIsInputModalOpen}
				title="금형투입 등록"
				content={
					<DynamicForm
						onFormReady={(methods) => {
							if (methods) {
								methods.setValue('moldLocationId', 1);
								methods.setValue('inputDate', new Date().toISOString().split('T')[0]);
								methods.setValue('outMachineId', 100);
								methods.setValue('outMachineName', '사출기-001');
								methods.setValue('outItemId', 200);
								methods.setValue('outItemNo', 1);
								methods.setValue('outItemName', '플라스틱 부품 A');
								methods.setValue('outProgressId', 300);
								methods.setValue('outProgressName', '사출성형');
								methods.setValue('stock', 1);
							}
							return undefined;
						}}
						fields={moldInputFormSchema}
						onSubmit={handleMoldInputSubmit}
						submitButtonText="투입"
						visibleSaveButton={true}
						otherTypeElements={{
							moldInstanceSelect: (props: any) => (
								<MoldInstanceSelectComponent 
									{...props} 
									searchParams={{ isInput: true }}
								/>
							),
						}}
					/>
				}
			/>
		</>
	);
};
