import { toPascalCase, toCamelCase } from '../utils/stringUtils.js';

// 폼 필드 검증 및 개선
const improveFormFields = (formFields) => {
	if (!formFields || formFields.length === 0) {
		return [
			{
				name: 'name',
				label: '이름',
				type: 'text',
				placeholder: '이름을 입력하세요',
				required: true,
				maxLength: 100,
			},
			{
				name: 'code',
				label: '코드',
				type: 'text',
				placeholder: '코드를 입력하세요',
				required: true,
				maxLength: 50,
			},
			{
				name: 'description',
				label: '설명',
				type: 'textarea',
				placeholder: '설명을 입력하세요',
				required: false,
				maxLength: 500,
			},
			{
				name: 'status',
				label: '상태',
				type: 'select',
				placeholder: '상태를 선택하세요',
				required: true,
				options: [
					{ value: 'active', label: '활성' },
					{ value: 'inactive', label: '비활성' },
				],
			},
		];
	}

	// 기존 필드 개선
	const improvedFields = formFields.map((field) => {
		const improved = { ...field };

		// 필수 필드 기본값 설정
		if (!improved.label) {
			improved.label = improved.name;
		}

		if (!improved.placeholder) {
			improved.placeholder = `${improved.label}을(를) 입력하세요`;
		}

		// 타입별 기본 설정
		if (improved.type === 'textarea' && !improved.rows) {
			improved.rows = 3;
		}

		if (improved.type === 'number' && !improved.min) {
			improved.min = 0;
		}

		return improved;
	});

	return improvedFields;
};

// 등록 페이지 템플릿을 생성하는 함수 - 개선된 버전
export const RegisterPageGenerater = (
	pageKey,
	formFields,
	hookName,
	pageTitle,
	isModal = true,
	pageType = 'singlePage' // 페이지 타입 추가
) => {
	const improvedFormFields = improveFormFields(formFields);
	const formFieldsArray = JSON.stringify(improvedFormFields, null, 2);

	// 데이터 타입명 생성
	const dataTypeName = `${toPascalCase(pageKey.replace(/Page$/, ''))}Data`;

	// hookName에서 하이픈 제거
	const cleanHookName = toCamelCase(hookName.replace(/^use/, ''));
	const finalHookName = `use${toPascalCase(cleanHookName)}`;

	// 페이지 타입에 따라 등록 방식 결정
	if (pageType === 'singlePage' || isModal) {
		// SinglePage용 모달 등록 페이지 (단순한 폼)
		return `import { useState } from 'react';
import {
	DynamicForm,
	FormField,
} from '@primes/components/form/DynamicFormComponent';

interface ${pageKey}Props {
	onClose?: () => void;
}

interface ${dataTypeName} {
	[key: string]: any;
}

export const ${pageKey}: React.FC<${pageKey}Props> = ({ onClose }) => {
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

	const formSchema: FormField[] = ${formFieldsArray};

	const handleSubmit = async (data: ${dataTypeName}) => {
		if (isSubmitting) return;
		
		setIsSubmitting(true);
		
		try {
			// TODO: API 호출 로직 구현
			console.log('등록 데이터:', data);
			console.log('등록이 완료되었습니다.');
			onClose && onClose();
		} catch (error) {
			console.error('등록 실패:', error);
			console.error('등록 중 오류가 발생했습니다.');
		} finally {
			setIsSubmitting(false);
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
			/>
		</div>
	);
};

export default ${pageKey};`;
	} else {
		// MasterDetailPage용 등록 페이지 (PageTemplate + 마스터폼 + 상세테이블)
		return `import { useRef, useEffect, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { PageTemplate } from '@primes/templates';
import DatatableComponent from '@primes/components/datatable/DatatableComponent';
import { DraggableDialog, RadixButton } from '@radix-ui/components';
import { ArrowLeft, Plus, Edit, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDataTable, useDataTableColumns } from '@radix-ui/hook';
import { DynamicForm } from '@primes/components/form/DynamicFormComponent';
import { RegisterFormTemplate } from '@primes/templates/RegisterFormTemplate';
import { DeleteConfirmDialog } from '@primes/components/common/DeleteConfirmDialog';

// 데이터 타입 정의
export type DataTableDataType = {
	id: string;
	[key: string]: any;
};

// 상세 컬럼 정의
export const detailColumns = [
	{
		accessorKey: 'id',
		header: 'ID',
		size: 100,
		minSize: 80,
	},
	// 추가 컬럼은 필요에 따라 정의
];

interface ${dataTypeName} {
	[key: string]: any;
}

export const ${pageKey}: React.FC = () => {
	const formMethodsRef = useRef<UseFormReturn<Record<string, unknown>> | null>(null);
	const navigate = useNavigate();
	const processedColumns = useDataTableColumns<DataTableDataType>(detailColumns);
	
	// 상태 관리
	const [openModal, setOpenModal] = useState(false);
	const [editModal, setEditModal] = useState(false);
	const [selectedDetail, setSelectedDetail] = useState<DataTableDataType | null>(null);
	const [newMasterId, setNewMasterId] = useState<number | null>(null);
	const [formMethods, setFormMethods] = useState<UseFormReturn<Record<string, unknown>> | null>(null);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [selectedDetailToDelete, setSelectedDetailToDelete] = useState<DataTableDataType | null>(null);

	// 데이터 테이블 초기화 (빈 데이터로 시작)
	const { table, toggleRowSelection, selectedRows } = useDataTable(
		[],
		processedColumns,
		30,
		1,
		0,
		40,
		() => {}
	);

	const handleFormReady = (methods: UseFormReturn<Record<string, unknown>>) => {
		formMethodsRef.current = methods;
		setFormMethods(methods);
	};

	// 상세 추가 모달 제출 핸들러
	const handleDetailFormSubmit = (data: Record<string, unknown>) => {
		if (!newMasterId) {
			console.error('Master ID is required');
			return;
		}

		// TODO: 상세 데이터 생성 로직 구현
		console.log('상세 데이터 추가:', data);
		setOpenModal(false);
		if (formMethods) {
			formMethods.reset();
		}
	};

	// 상세 수정 모달 제출 핸들러
	const handleEditFormSubmit = (data: Record<string, unknown>) => {
		if (!selectedDetail) {
			console.error('No detail selected for editing');
			return;
		}

		// TODO: 상세 데이터 수정 로직 구현
		console.log('상세 데이터 수정:', data);
		setEditModal(false);
		setSelectedDetail(null);
		if (formMethods) {
			formMethods.reset();
		}
	};

	// 상세 삭제 확인 핸들러
	const handleDeleteConfirm = () => {
		if (!selectedDetailToDelete) {
			console.error('No detail selected for deletion');
			return;
		}

		// TODO: 상세 데이터 삭제 로직 구현
		console.log('상세 데이터 삭제:', selectedDetailToDelete.id);
		setDeleteDialogOpen(false);
		setSelectedDetailToDelete(null);
	};

	// 액션 버튼 핸들러들
	const handleAddClick = () => {
		setOpenModal(true);
	};

	const handleEditClick = (detail: DataTableDataType) => {
		setSelectedDetail(detail);
		setEditModal(true);
	};

	const handleDeleteClick = (detail: DataTableDataType) => {
		setSelectedDetailToDelete(detail);
		setDeleteDialogOpen(true);
	};

	// 수정 폼에 데이터 채우기
	const populateEditForm = (methods: UseFormReturn<Record<string, unknown>>, detail: DataTableDataType) => {
		const defaultValues: Record<string, string | number> = {
			// TODO: 상세 데이터 필드에 맞게 수정
			id: detail.id,
		};

		Object.entries(defaultValues).forEach(([key, value]) =>
			methods.setValue(key, value)
		);
	};

	// 상세 폼 스키마 (기본값)
	const detailFormSchema = [
		{
			name: 'id',
			label: 'ID',
			type: 'text',
			placeholder: 'ID를 입력하세요',
			required: true,
		},
		// TODO: 실제 상세 필드에 맞게 수정
	];

	// 마스터 폼 스키마
	const masterFormSchema = ${formFieldsArray};

	return (
		<>
			{/* 상세 추가 모달 */}
			<DraggableDialog
				open={openModal}
				onOpenChange={(open: boolean) => {
					setOpenModal(open);
				}}
				title="상세 추가"
				content={
					<DynamicForm
						onFormReady={handleFormReady}
						fields={detailFormSchema}
						onSubmit={handleDetailFormSubmit}
						submitButtonText="저장"
						visibleSaveButton={true}
					/>
				}
			/>

			{/* 상세 수정 모달 */}
			<DraggableDialog
				open={editModal}
				onOpenChange={(open: boolean) => {
					setEditModal(open);
					if (!open) {
						setSelectedDetail(null);
					}
				}}
				title="상세 수정"
				content={
					<DynamicForm
						onFormReady={(methods) => {
							handleFormReady(methods);
							if (selectedDetail && methods) {
								populateEditForm(methods, selectedDetail);
							}
						}}
						fields={detailFormSchema}
						onSubmit={handleEditFormSubmit}
						submitButtonText="수정"
						visibleSaveButton={true}
					/>
				}
			/>

			{/* 삭제 확인 다이얼로그 */}
			<DeleteConfirmDialog
				isOpen={deleteDialogOpen}
				onOpenChange={(open) => setDeleteDialogOpen(open)}
				onConfirm={handleDeleteConfirm}
				isDeleting={false}
				title="상세 삭제"
				description="선택한 상세를 삭제하시겠습니까? 이 작업은 취소할 수 없습니다."
			/>

			{/* 메인 페이지 */}
			<div className="max-w-full mx-auto p-4 h-full flex flex-col">

				<div className="flex justify-between items-center gap-2 mb-3">
					<RadixButton
						className="flex gap-2 px-3 py-2 rounded-lg text-sm items-center border"
						onClick={() => navigate(-1)}
					>
						<ArrowLeft size={16} className="text-muted-foreground" />
						뒤로가기
					</RadixButton>
				</div>

				<PageTemplate
					firstChildWidth="30%"
					splitterSizes={[25, 75]}
					splitterMinSize={[310, 550]}
					splitterGutterSize={8}
				>
					{/* 마스터 폼 */}
					<div className="border rounded-lg overflow-auto h-[calc(100vh-210px)]">
						<RegisterFormTemplate
							title="${pageTitle}"
							formSchema={masterFormSchema}
							onSuccess={(res: any) => {
								if (res.id && typeof res.id === 'number') {
									setNewMasterId(res.id);
								}
							}}
							onReset={() => {
								setNewMasterId(null);
							}}
						/>
					</div>

					{/* 상세 테이블 */}
					<div className="border rounded-lg overflow-hidden">
						<DatatableComponent
							columns={processedColumns}
							table={table}
							data={[]}
							tableTitle="상세 정보"
							rowCount={0}
							defaultPageSize={30}
							actionButtons={
								<div className="flex items-center gap-2.5">
									<RadixButton
										className={\`flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border \${newMasterId === null ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-Colors-Brand-600 text-gray-200'}\`}
										onClick={handleAddClick}
										disabled={newMasterId === null}
									>
										<Plus size={16} />
										추가
									</RadixButton>
									<RadixButton
										className={\`flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border \${selectedRows.length === 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-Colors-Brand-600 text-white'}\`}
										onClick={() => selectedRows.length > 0 && handleEditClick(selectedRows[0])}
										disabled={selectedRows.length === 0}
									>
										<Edit size={16} />
										수정
									</RadixButton>
									<RadixButton
										className={\`flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border \${selectedRows.length === 0 ? 'cursor-not-allowed bg-gray-200 text-gray-400' : 'bg-red-600 text-white'}\`}
										onClick={() => selectedRows.length > 0 && handleDeleteClick(selectedRows[0])}
										disabled={selectedRows.length === 0}
									>
										<Trash2 size={16} />
										삭제
									</RadixButton>
								</div>
							}
							useSearch={true}
							toggleRowSelection={toggleRowSelection}
							selectedRows={selectedRows}
							headerOffset="220px"
						/>
					</div>
				</PageTemplate>
			</div>
		</>
	);
};

export default ${pageKey};`;
	}
};
