import { useState, useEffect, useRef } from 'react';
import {
	DynamicForm,
	FormField,
} from '@primes/components/form/DynamicFormComponent';
import { useCreateMoldDispose, useUpdateMoldDispose } from '@primes/hooks';
import { MoldDisposeDto, MoldDisposeCreateRequest } from '@primes/types/mold';
import { toast } from 'sonner';
import { useTranslation } from '@repo/i18n';
import { MoldInstanceSelectComponent } from '@primes/components/customSelect/MoldInstanceSelectComponent';
import { ItemSelectComponent } from '@primes/components/customSelect/ItemSelectComponent';
import { ProductionCommandSelectComponent } from '@primes/components/customSelect/ProductionCommandSelectComponent';
import { CommandProgressSelectComponent } from '@primes/components/customSelect/CommandProgressSelectComponent';
import { UserSelectComponent } from '@primes/components/customSelect/UserSelectComponent';
import { FetchApiGet } from '@primes/utils/request';

interface MoldDisposeRegisterPageProps {
	onClose?: () => void;
	moldDisposeData?: MoldDisposeDto;
	page?: number;
	size?: number;
	searchRequest?: any;
}

interface MoldDisposeRegisterData {
	[key: string]: any;
}

export const MoldDisposeRegisterPage: React.FC<
	MoldDisposeRegisterPageProps
> = ({ onClose, moldDisposeData, page = 0, size = 30, searchRequest = {} }) => {
	const { t } = useTranslation('dataTable');
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
	const [selectedCommandData, setSelectedCommandData] = useState<any>(null);
	const formRef = useRef<any>(null);
	
	const createMoldDispose = useCreateMoldDispose(page, size, searchRequest);
	const updateMoldDispose = useUpdateMoldDispose();
	const isEditMode = !!moldDisposeData;



	const formSchema: FormField[] = [
		{
			name: 'moldInstanceId',
			label: t('columns.moldInstance') || '실금형',
			type: 'moldInstanceSelect',
			placeholder: '실금형을 선택하세요',
			required: true,
		},
		{
			name: 'commandId',
			label: t('columns.command') || '작업지시번호',
			type: 'productionCommandSelect',
			placeholder: '작업지시번호를 선택하세요',
			required: true,
		},
		{
			name: 'itemId',
			label: t('columns.item') || '품목',
			type: 'text',
			placeholder: '작업지시번호를 선택하면 자동 입력됩니다',
			readOnly: true,
			required: true,
		},
		{
			name: 'progressId',
			label: t('columns.progress') || '공정',
			type: 'text',
			placeholder: '작업지시번호를 선택하면 자동 입력됩니다',
			readOnly: true,
			required: true,
		},
		{
			name: 'machineName',
			label: t('columns.machineName') || '설비명',
			type: 'text',
			placeholder: '작업지시번호를 선택하면 자동 입력됩니다',
			readOnly: true,
			required: true,
		},
		{
			name: 'reduceDate',
			label: t('columns.reduceDate') || '폐기 날짜',
			type: 'date',
			placeholder: t('placeholders.selectDisposeDate') || 'Select dispose date',
			defaultValue: new Date().toISOString().split('T')[0],
			required: true,
		},
		{
			name: 'reduceNum',
			label: t('columns.reduceNum') || '폐기 수량',
			type: 'number',
			placeholder: t('placeholders.enterDisposeQuantity') || 'Enter dispose quantity',
			defaultValue: 1,
			required: false,
		},
	];

	const handleSubmit = async (data: MoldDisposeRegisterData) => {
		if (isSubmitting) return;

		setIsSubmitting(true);

		try {
			// Transform the data to match the API requirements
			const transformedData: MoldDisposeCreateRequest = {
				// Always include required fields with default values
				moldMasterId: data.moldInstanceId
					? Number(data.moldInstanceId)
					: 151965799616512,
				itemId: 1, // 기본값 사용
				progressId: 1, // 기본값 사용
				commandId: Number(data.commandId) || 1,
				machineName: data.machineName as string,
				reduceDate: data.reduceDate ? new Date(data.reduceDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
				reduceNum: data.reduceNum ? Number(data.reduceNum) : 1,
				useName: data.useName as string,
			};

			if (isEditMode && moldDisposeData) {
				// Update existing mold dispose
				await updateMoldDispose.mutateAsync({
					id: moldDisposeData.id,
					data: transformedData,
				});
				toast.success('금형 폐기가 성공적으로 수정되었습니다.');
			} else {
				// Create new mold dispose
				await createMoldDispose.mutateAsync(transformedData);
				toast.success('금형 폐기가 성공적으로 등록되었습니다.');
			}

			onClose && onClose();
		} catch (error: any) {
			console.error('처리 실패:', error);
			console.error('Error response:', error.response?.data);
			console.error('Error status:', error.response?.status);
			const action = isEditMode ? '수정' : '등록';
			toast.error(
				`${action} 중 오류가 발생했습니다: ${error.response?.data?.message || error.message}`
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	// Prepare initial values for edit mode
	const getInitialValues = () => {
		if (!moldDisposeData) return {};

		return {
			moldInstanceId: moldDisposeData.moldMasterId?.toString() || '',
			itemId: '', // readonly 필드이므로 빈 값으로 시작
			progressId: '', // readonly 필드이므로 빈 값으로 시작
			commandId: moldDisposeData.commandId?.toString() || '',
			machineName: moldDisposeData.machineName || '',
			reduceDate: moldDisposeData.reduceDate ? new Date(moldDisposeData.reduceDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
			reduceNum: moldDisposeData.reduceNum || 1,
			useName: moldDisposeData.useName || '',
		};
	};

	const handleCommandChange = async (commandData: any) => {
		if (!commandData || !commandData.commandId) {
			return;
		}

		// 즉시 기본 정보 설정
		setTimeout(() => {
			if (formRef.current) {
				const updates: any = {};
				
				// 품목 정보 설정
				if (commandData.itemName) {
					updates.itemId = commandData.itemName;
				} else if (commandData.itemNumber) {
					updates.itemId = commandData.itemNumber;
				} else if (commandData.itemId) {
					updates.itemId = `품목 ID: ${commandData.itemId}`;
				} else {
					updates.itemId = '품목 정보 없음';
				}
				
				// 설비명 설정
				if (commandData.machineName) {
					updates.machineName = commandData.machineName;
				} else if (commandData.machineId) {
					updates.machineName = `설비 ID: ${commandData.machineId}`;
				} else {
					updates.machineName = '설비 정보 없음';
				}
				
				// 공정 정보는 API 호출 후 업데이트
				updates.progressId = '공정 정보 로딩 중...';
				
				// 필드 업데이트
				Object.keys(updates).forEach(fieldName => {
					try {
						formRef.current.setValue(fieldName, updates[fieldName]);
					} catch (error) {
						console.error(`${fieldName} 업데이트 실패:`, error);
					}
				});
			}
		}, 100);

		// API 호출 (병렬로 두 개의 API 호출)
		try {			
			// 두 개의 API를 병렬로 호출
			const [commandResponse, progressResponse] = await Promise.all([
				FetchApiGet(`/production/command?id=${commandData.commandId}&page=0&size=10`),
				FetchApiGet(`/production/command-progress?commandId=${commandData.commandId}&page=0&size=10`)
			]);
			
			// API 응답 데이터로 readonly 필드들 업데이트
			setTimeout(() => {
				if (formRef.current) {
					try {
						const updates: any = {};
						
						// 1. Command API 응답에서 데이터 추출
						if (commandResponse.status === 'success' && commandResponse.data) {
							const commandData = commandResponse.data;
							
							// 품목 정보 (itemId readonly 필드)
							if (commandData.itemName) {
								updates.itemId = commandData.itemName;
							} else if (commandData.itemNumber) {
								updates.itemId = commandData.itemNumber;
							} else if (commandData.itemId) {
								updates.itemId = `품목 ID: ${commandData.itemId}`;
							}
							
							// 설비명 (machineName readonly 필드)
							if (commandData.machineName) {
								updates.machineName = commandData.machineName;
							} else if (commandData.machineId) {
								updates.machineName = `설비 ID: ${commandData.machineId}`;
							}
							
							// 배열 형태의 응답 처리
							if (commandData.content && Array.isArray(commandData.content) && commandData.content.length > 0) {
								const firstCommand = commandData.content[0];
								
								if (!updates.itemId && firstCommand.itemName) {
									updates.itemId = firstCommand.itemName;
								}
								if (!updates.machineName && firstCommand.machineName) {
									updates.machineName = firstCommand.machineName;
								}
							}
						}
						
						// 2. Command-Progress API 응답에서 공정 정보 추출
						let progressInfo = '공정 정보 없음';
						if (progressResponse.status === 'success' && progressResponse.data) {
							const progressData = progressResponse.data;
							
							if (progressData.content && Array.isArray(progressData.content) && progressData.content.length > 0) {
								const firstProgress = progressData.content[0];
								progressInfo = firstProgress.progressName || firstProgress.name || `공정 ${firstProgress.progressId}`;
							} else if (progressData.progressName) {
								progressInfo = progressData.progressName;
							} else if (progressData.name) {
								progressInfo = progressData.name;
							}
						}
						updates.progressId = progressInfo;
						
						// 3. 모든 readonly 필드 업데이트
						Object.keys(updates).forEach(fieldName => {
							try {
								formRef.current.setValue(fieldName, updates[fieldName]);
							} catch (error) {
								console.error(`❌ ${fieldName} API 업데이트 실패:`, error);
							}
						});
						
					} catch (error) {
						console.error('API 응답 처리 중 오류:', error);
						formRef.current.setValue('progressId', '데이터 처리 오류');
					}
				}
			}, 200);
			
		} catch (error) {
			console.error('🌐 API 호출 실패:', error);
			setTimeout(() => {
				if (formRef.current) {
					formRef.current.setValue('progressId', '공정 정보 로딩 실패');
				}
			}, 200);
		}
	};

	const handleCancel = () => {
		onClose && onClose();
	};

	return (
		<div className="max-w-full mx-auto">
			<DynamicForm
				fields={formSchema}
				onSubmit={handleSubmit}
				submitButtonText={isEditMode ? '수정' : '등록'}
				initialData={getInitialValues()}
				onFormReady={(methods) => {
					formRef.current = methods;
				}}
				otherTypeElements={{
					moldInstanceSelect: (props: any) => (
						<MoldInstanceSelectComponent 
							{...props} 
							onChange={(value) => {
								props.onChange(value);
							}}
						/>
					),
					itemSelect: (props: any) => (
						<ItemSelectComponent 
							{...props} 
							onChange={(value) => {
								props.onChange(value);
							}}
						/>
					),
					productionCommandSelect: (props: any) => (
						<ProductionCommandSelectComponent 
							{...props} 
							onChange={(value) => {
								if (value && typeof value === 'object') {
									// DynamicForm에는 commandId만 전달
									props.onChange(value.commandId?.toString() || '');
									// 필드 매핑
									handleCommandChange(value);
								} else {
									props.onChange(value || '');
								}
							}}
						/>
					),
					commandProgressSelect: (props: any) => (
						<CommandProgressSelectComponent 
							{...props} 
							onChange={(value) => {
								props.onChange(value);
							}}
						/>
					),
					userSelect: (props: any) => (
						<UserSelectComponent 
							{...props} 
							onChange={(value) => {
								props.onChange(value);
							}}
						/>
					),
				}}
			/>
		</div>
	);
};

export default MoldDisposeRegisterPage;
