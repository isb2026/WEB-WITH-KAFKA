import { useState } from 'react';
import {
	DynamicForm,
	FormField,
} from '@primes/components/form/DynamicFormComponent';
import {
	useCreateMoldRepair,
	useUpdateMoldRepair,
} from '@primes/hooks';
import { MoldRepairDto } from '@primes/types/mold';
import { useTranslation } from '@repo/i18n';
import { VendorSelectComponent } from '@primes/components/customSelect/VendorSelectComponent';
import { MoldInstanceSelectComponent } from '@primes/components/customSelect/MoldInstanceSelectComponent';
import { UserSelectComponent } from '@primes/components/customSelect/UserSelectComponent';

// 애니메이션 스타일 추가
const animationStyles = `
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes slideDown {
    from {
      opacity: 0;
      max-height: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      max-height: 1000px;
      transform: translateY(0);
    }
  }
  
  .animate-fadeIn {
    animation: fadeIn 0.5s ease-out;
  }
  
  .animate-slideDown {
    animation: slideDown 0.6s ease-out;
  }
`;

// 스타일을 head에 추가
if (typeof document !== 'undefined' && !document.getElementById('mold-repair-animations')) {
  const style = document.createElement('style');
  style.id = 'mold-repair-animations';
  style.textContent = animationStyles;
  document.head.appendChild(style);
}

interface MoldRepairRegisterPageProps {
	onClose?: () => void;
	selectedRepair?: MoldRepairDto | null;
	isEditMode?: boolean;
	onSuccess?: () => void;
}

interface MoldRepairRegisterData {
	moldInstanceId?: string;
	cost?: string;
	isEnd?: boolean;
	moldVendorId?: string;
	repairContents?: string;
	accountMonth?: string;
	inMonth?: string;
	isClose?: boolean;
	closeName?: string;
	closeTime?: string;
	isAdmit?: boolean;
	admitName?: string;
	admitTime?: string;
	repairPicture?: string;
	endRequestDate?: string;
	previousMoldLife?: string;
	afterMoldLife?: string;
	[key: string]: any;
}

export const MoldRepairRegisterPage: React.FC<MoldRepairRegisterPageProps> = ({
	onClose,
	onSuccess,
	selectedRepair,
	isEditMode = false,
}) => {
	const { t } = useTranslation('dataTable');
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
	const [isCompleted, setIsCompleted] = useState<boolean>(
		isEditMode ? Boolean(selectedRepair?.isEnd) : false
	);
	const [isClosed, setIsClosed] = useState<boolean>(
		isEditMode ? Boolean(selectedRepair?.isClose) : false
	);
	const [isAdmitted, setIsAdmitted] = useState<boolean>(
		isEditMode ? Boolean(selectedRepair?.isAdmit) : false
	);
	const createMoldRepair = useCreateMoldRepair(0, 30);
	const updateMoldRepair = useUpdateMoldRepair();



	const baseFormSchema: FormField[] = [
		{
			name: 'moldInstanceId',
			label: t('columns.moldInstance'),
			type: 'moldInstanceSelect',
			placeholder: '실금형을 선택하세요',
			required: false,
		},
		{
			name: 'moldVendorId',
			label: t('columns.vendor'),
			type: 'vendorSelect',
			placeholder: t('placeholders.enterMoldVendorId') || '금형 공급업체를 선택하세요',
			required: false,
		},
		{
			name: 'cost',
			label: t('columns.cost'),
			type: 'number',
			placeholder: t('placeholders.enterRepairCost') || '수리 비용을 입력하세요',
			required: false,
		},
		{
			name: 'accountMonth',
			label: t('columns.accountMonth'),
			type: 'dateMonth',
			placeholder: t('placeholders.enterAccountMonth') || '회계년월을 선택하세요',
			required: false,
			defaultValue: (() => {
				const now = new Date();
				const year = now.getFullYear();
				const month = String(now.getMonth() + 1).padStart(2, '0');
				return `${year}-${month}`;
			})(),
		},
		{
			name: 'previousMoldLife',
			label: t('columns.moldLife') || 'Previous Mold Life',
			type: 'number',
			placeholder: t('placeholders.enterPreviousMoldLife') || '금형 수명을 입력하세요',
			required: false,
		},
		{
			name: 'out_date',
			label: t('columns.out_date'),
			type: 'date',
			placeholder: t('placeholders.selectOutDate'),
			required: false,
		},
		// 완료 구분선
		{
			name: 'completionDivider',
			label: '',
			type: 'divider',
			placeholder: '✨ 완료 정보 입력',
			required: false,
		},
		{
			name: 'isEnd',
			label: t('columns.isEnd'),
			type: 'customCheckbox',
			placeholder: t('placeholders.selectEndStatus') || '완료 여부를 선택하세요',
			required: false,
		},
		// 마감 구분선
		{
			name: 'closeDivider',
			label: '',
			type: 'divider',
			placeholder: '🔒 마감 정보 입력',
			required: false,
		},
		{
			name: 'isClose',
			label: t('columns.isClose'),
			type: 'customCheckbox',
			placeholder: t('placeholders.selectCloseStatus') || '마감 여부를 선택하세요',
			required: false,
		},
	];

	// 완료 여부 조건부 필드들
	const completionFields: FormField[] = [
		{
			name: 'repairContents',
			label: t('columns.repairContents'),
			type: 'animatedTextarea',
			placeholder: t('placeholders.enterRepairContents') || '수리 내용을 입력하세요',
			required: false,
		},
		{
			name: 'afterMoldLife',
			label: t('columns.afterMoldLife') || 'After Mold Life',
			type: 'animatedNumber',
			placeholder: t('placeholders.enterAfterMoldLife') || '수리 후 금형 수명을 입력하세요',
			required: false,
		},
		{
			name: 'in_date',
			label: t('columns.in_date'),
			type: 'date',
			placeholder: t('placeholders.selectInRepairDate'),
			required: false,
		},
		{
			name: 'endRequestDate',
			label: t('columns.endRequestDate') || 'End Request Date',
			type: 'animatedDate',
			placeholder: t('placeholders.selectEndRequestDate') || '종료 요청 날짜를 선택하세요',
			required: false,
		},
		{
			name: 'repairPicture',
			label: t('columns.repairPicture') || '수리 사진',
			type: 'animatedFileUpload',
			placeholder: t('placeholders.enterRepairPicture') || '수리 사진을 업로드하세요',
			required: false,
		},
		{
			name: 'inMonth',
			label: t('columns.inMonth'),
			type: 'animatedDateMonth',
			placeholder: t('placeholders.enterInMonth') || '입고 월을 선택하세요',
			required: false,
		},
	];

	// 마감 여부 조건부 필드들
	const closeFields: FormField[] = [
		{
			name: 'closeName',
			label: t('columns.closeName'),
			type: 'animatedUserSelect',
			placeholder: t('placeholders.enterCloseName') || '마감 담당자를 선택하세요',
			required: false,
		},
		{
			name: 'closeTime',
			label: t('columns.closeTime'),
			type: 'animatedDatetime',
			placeholder: t('placeholders.selectCloseTime') || '마감 시간을 선택하세요',
			required: false,
		},
	];

	// 승인 여부 조건부 필드들
	const admitFields: FormField[] = [
		{
			name: 'admitName',
			label: t('columns.admitName'),
			type: 'animatedUserSelect',
			placeholder: t('placeholders.enterAdmitName') || '승인 담당자를 선택하세요',
			required: false,
		},
		{
			name: 'admitTime',
			label: t('columns.admitTime'),
			type: 'animatedDatetime',
			placeholder: t('placeholders.selectAdmitTime') || '승인 시간을 선택하세요',
			required: false,
		},
	];

	// 동적으로 formSchema 생성 - 각 체크박스 바로 아래에 조건부 필드들 배치
	const formSchema: FormField[] = [];
	
	// 기본 필드들을 하나씩 추가하면서 체크박스 뒤에 조건부 필드들 삽입
	baseFormSchema.forEach((field) => {
		formSchema.push(field);
		
		// 완료 여부 체크박스 뒤에 완료 관련 필드들 추가
		if (field.name === 'isEnd' && isCompleted) {
			formSchema.push(...completionFields);
		}
		
		// 마감 여부 체크박스 뒤에 마감 관련 필드들 추가
		if (field.name === 'isClose' && isClosed) {
			formSchema.push(...closeFields);
		}
		
		// 승인 여부 체크박스는 baseFormSchema에 없으므로 별도 처리
	});
	
	// 승인 구분선과 체크박스는 항상 표시
	formSchema.push({
		name: 'admitDivider',
		label: '',
		type: 'divider',
		placeholder: '✅ 승인 정보 입력',
		required: false,
	});
	formSchema.push({
		name: 'isAdmit',
		label: t('columns.isAdmit'),
		type: 'customCheckbox',
		placeholder: t('placeholders.selectAdmitStatus') || '승인 여부를 선택하세요',
		required: false,
	});
	
	// 승인 여부가 체크된 경우에만 승인 관련 필드들 추가
	if (isAdmitted) {
		formSchema.push(...admitFields);
	}

	const handleSubmit = async (data: MoldRepairRegisterData) => {
		if (isSubmitting) return;

		setIsSubmitting(true);

		try {
			// Transform data to match API expectations
			const transformedData: {
				moldInstanceId: number | null;
				cost: number | null;
				moldVendorId: number | null;
				previousMoldLife: number | null;
				afterMoldLife: number | null;
				endRequestDate: string | null;
				closeTime: string | null;
				admitTime: string | null;
				isEnd: boolean;
				isClose: boolean;
				isAdmit: boolean;
				[key: string]: any;
			} = {
				...data,
				// Convert string numbers to actual numbers
				moldInstanceId: data.moldInstanceId
					? parseInt(data.moldInstanceId)
					: null,
				cost: data.cost ? parseFloat(data.cost) : null,
				moldVendorId: data.moldVendorId
					? parseInt(data.moldVendorId)
					: null,
				previousMoldLife: data.previousMoldLife
					? parseInt(data.previousMoldLife)
					: null,
				afterMoldLife: data.afterMoldLife
					? parseInt(data.afterMoldLife)
					: null,

				// Handle empty date strings - convert to null
				endRequestDate:
					data.endRequestDate && data.endRequestDate.trim() !== ''
						? data.endRequestDate
						: null,

				// Handle datetime fields
				closeTime:
					data.closeTime && data.closeTime.trim() !== ''
						? data.closeTime
						: null,
				admitTime:
					data.admitTime && data.admitTime.trim() !== ''
						? data.admitTime
						: null,

				// Ensure boolean fields are properly set
				isEnd: Boolean(data.isEnd),
				isClose: Boolean(data.isClose),
				isAdmit: Boolean(data.isAdmit),
			};

			// Remove any undefined or empty string values
			Object.keys(transformedData).forEach((key) => {
				if (
					transformedData[key as keyof typeof transformedData] === undefined ||
					transformedData[key as keyof typeof transformedData] === ''
				) {
					delete transformedData[key as keyof typeof transformedData];
				}
			});

			// Clean the transformed data - remove undefined values and convert to proper types
			const cleanData = (obj: any) => {
				const cleaned: any = {};
				Object.keys(obj).forEach(key => {
					const value = obj[key];
					if (value !== undefined && value !== null && value !== '') {
						cleaned[key] = value;
					}
				});
				return cleaned;
			};

			const cleanedTransformedData = cleanData(transformedData);

			console.log('=== FORM SUBMISSION DEBUG ===');
			console.log('Raw form data:', data);
			console.log('Transformed data:', transformedData);
			console.log('Cleaned data:', cleanedTransformedData);
			console.log('Is edit mode:', isEditMode);
			console.log('Selected repair ID:', selectedRepair?.id);

			if (isEditMode && selectedRepair) {
				// Update existing mold repair
				console.log('Updating mold repair with ID:', selectedRepair.id);
				await updateMoldRepair.mutateAsync({
					id: selectedRepair.id,
					data: cleanedTransformedData,
				});
			} else {
				// Create new mold repair
				console.log('Creating new mold repair');
				await createMoldRepair.mutateAsync([cleanedTransformedData]);
			}

			// Call the success callback to refresh the list with a small delay
			if (onSuccess) {
				setTimeout(() => {
					onSuccess();
				}, 100);
			}
			onClose && onClose();
		} catch (error) {
			console.error(isEditMode ? '수정 실패:' : '등록 실패:', error);
			console.error(
				isEditMode
					? '수정 중 오류가 발생했습니다.'
					: '등록 중 오류가 발생했습니다.'
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleCancel = () => {
		onClose && onClose();
	};

	return (
		<div className="w-[800px] h-[70vh] mx-auto flex flex-col">
			<div className="flex-1 overflow-y-auto overflow-x-hidden px-4">
			<DynamicForm
				key={
					isEditMode && selectedRepair
						? `edit-${selectedRepair.id}-${selectedRepair.moldInstanceId}`
						: 'create'
			}
				fields={formSchema}
				onSubmit={handleSubmit}
				submitButtonText={isEditMode ? '수정' : '등록'}
					otherTypeElements={{
						moldInstanceSelect: (props: any) => (
							<MoldInstanceSelectComponent 
								{...props} 
								onChange={(value) => {
									props.onChange(value);
								}}
							/>
						),
						vendorSelect: (props: any) => (
							<VendorSelectComponent 
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
						customCheckbox: (props: any) => (
							<div className="flex items-center p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200 hover:border-Colors-Brand-300 transition-all duration-200">
								<div className="relative flex items-center">
									<input
										type="checkbox"
										checked={Boolean(props.value)}
									onChange={(e) => {
										const newValue = e.target.checked;
										props.onChange(newValue);
										if (props.name === 'isEnd') {
											setIsCompleted(newValue);
										} else if (props.name === 'isClose') {
											setIsClosed(newValue);
										} else if (props.name === 'isAdmit') {
											setIsAdmitted(newValue);
										}
									}}
										className="w-5 h-5 text-Colors-Brand-600 bg-white border-2 border-gray-300 rounded-md focus:ring-Colors-Brand-500 focus:ring-2 focus:ring-offset-2 transition-all duration-200 cursor-pointer"
									/>
									{Boolean(props.value) && (
										<div className="absolute inset-0 flex items-center justify-center pointer-events-none">
											<svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
												<path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
											</svg>
										</div>
									)}
								</div>
								<label className="ml-3 text-sm font-medium text-gray-700 cursor-pointer select-none">
									{props.placeholder}
								</label>
								{Boolean(props.value) && (
									<div className="ml-auto">
										<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
											완료
										</span>
									</div>
								)}
							</div>
						),
						divider: (props: any) => (
							<div className="my-6">
								<div className="relative">
									<div className="absolute inset-0 flex items-center">
										<div className="w-full border-t border-gray-300"></div>
									</div>
									<div className="relative flex justify-center text-sm">
										<span className="px-4 bg-white text-gray-500 font-medium">
											{props.placeholder || '✨ 완료 정보 입력'}
										</span>
									</div>
								</div>
							</div>
						),
						customFileUpload: (props: any) => (
							<div className="flex items-center gap-3 p-3 border rounded-md hover:border-Colors-Brand-500 transition-colors">
								<div className="flex items-center justify-center w-8 h-8 bg-Colors-Brand-100 rounded">
									<svg
										className="w-4 h-4 text-Colors-Brand-600"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
										/>
									</svg>
								</div>
								<div className="flex-1">
									<p className="text-sm text-gray-700 font-medium">
										파일을 여기로 끌어다 놓기
									</p>
									<p className="text-xs text-gray-500">
										또는 클릭하여 파일 선택 (최대 2개 파일, 개당 최대 5MB)
									</p>
								</div>
								<button
									type="button"
									onClick={() => {
										const input = document.createElement('input');
										input.type = 'file';
										input.accept = 'image/*';
										input.multiple = true;
										input.onchange = (e: any) => {
											const files = Array.from(e.target.files || []);
											if (files.length > 0) {
												// 파일 처리 로직
												props.onChange(files);
											}
										};
										input.click();
									}}
									className="px-4 py-2 text-sm bg-Colors-Brand-700 text-white rounded hover:bg-Colors-Brand-800 transition-colors"
								>
									파일 선택
								</button>
							</div>
						),
						animatedNumber: (props: any) => (
							<div>
								<input
									type="number"
									value={props.value || ''}
									onChange={(e) => props.onChange(e.target.value)}
									placeholder={props.placeholder}
									className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white focus:border-Colors-Brand-500 focus:ring-2 focus:ring-Colors-Brand-200 transition-all duration-200"
								/>
							</div>
						),
						animatedDate: (props: any) => (
							<div>
								<input
									type="date"
									value={props.value || ''}
									onChange={(e) => props.onChange(e.target.value)}
									className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white focus:border-Colors-Brand-500 focus:ring-2 focus:ring-Colors-Brand-200 transition-all duration-200"
								/>
							</div>
						),
						animatedDateMonth: (props: any) => (
							<div>
								<input
									type="month"
									value={props.value || ''}
									onChange={(e) => props.onChange(e.target.value)}
									className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white focus:border-Colors-Brand-500 focus:ring-2 focus:ring-Colors-Brand-200 transition-all duration-200"
								/>
							</div>
						),
						animatedFileUpload: (props: any) => (
							<div className="w-full">
								<div className="flex flex-col gap-2 p-3 border-2 border-dashed border-gray-300 rounded-lg bg-gradient-to-r from-yellow-50 to-orange-50 hover:border-Colors-Brand-400 transition-all duration-300 max-w-full">
									<div className="flex items-center gap-2">
										<div className="flex items-center justify-center w-8 h-8 bg-Colors-Brand-100 rounded-full flex-shrink-0">
											<svg
												className="w-4 h-4 text-Colors-Brand-600"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
												/>
											</svg>
										</div>
										<div className="flex-1 min-w-0">
											<p className="text-sm text-gray-700 font-medium truncate">
												📸 수리 사진 업로드
											</p>
											<p className="text-xs text-gray-500 truncate">
												파일 선택 (최대 2개, 5MB)
											</p>
										</div>
									</div>
									<button
										type="button"
										onClick={() => {
											const input = document.createElement('input');
											input.type = 'file';
											input.accept = 'image/*';
											input.multiple = true;
											input.onchange = (e: any) => {
												const files = Array.from(e.target.files || []);
												if (files.length > 0) {
													props.onChange(files);
												}
											};
											input.click();
										}}
										className="w-full px-3 py-2 text-sm bg-Colors-Brand-600 text-white rounded-lg hover:bg-Colors-Brand-700 transition-all duration-200"
									>
										📁 파일 선택
									</button>
								</div>
							</div>
						),
						animatedTextarea: (props: any) => (
							<div className="w-full">
								<textarea
									value={props.value || ''}
									onChange={(e) => props.onChange(e.target.value)}
									placeholder={props.placeholder}
									rows={3}
									className="w-full max-w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white focus:border-Colors-Brand-500 focus:ring-2 focus:ring-Colors-Brand-200 transition-all duration-200 resize-none"
								/>
							</div>
						),
						animatedUserSelect: (props: any) => (
							<div className="w-full">
								<UserSelectComponent 
									{...props} 
									onChange={(value) => {
										props.onChange(value);
								}}
								/>
							</div>
						),
						animatedDatetime: (props: any) => (
							<div className="w-full">
								<input
									type="datetime-local"
									value={props.value || ''}
									onChange={(e) => props.onChange(e.target.value)}
									className="w-full max-w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white focus:border-Colors-Brand-500 focus:ring-2 focus:ring-Colors-Brand-200 transition-all duration-200"
								/>
							</div>
						),
					}}
				initialData={
					isEditMode && selectedRepair
						? {
								...selectedRepair,
								// Convert numbers to strings for form fields
								moldInstanceId: selectedRepair.moldInstanceId?.toString() || '',
								cost: selectedRepair.cost?.toString() || '',
								moldVendorId: selectedRepair.moldVendorId?.toString() || '',
								previousMoldLife: selectedRepair.previousMoldLife?.toString() || '',
								afterMoldLife: selectedRepair.afterMoldLife?.toString() || '',
							}
						: undefined
				}
			/>
			</div>
		</div>
	);
};

export default MoldRepairRegisterPage;
