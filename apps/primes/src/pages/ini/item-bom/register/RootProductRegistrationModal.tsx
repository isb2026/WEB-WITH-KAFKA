import React from 'react';
import { DraggableDialog } from '@repo/radix-ui/components';
import {
	DynamicForm,
	FormField,
} from '@primes/components/form/DynamicFormComponent';
import { MbomCreateRequest } from '@primes/types/ini/mbom';
import { toast } from 'sonner';

interface RootProductRegistrationModalProps {
	isOpen: boolean;
	onClose: () => void;
	productOptions: { label: string; value: string }[];
	onSubmit: (data: MbomCreateRequest) => Promise<void>;
}

export const RootProductRegistrationModal: React.FC<
	RootProductRegistrationModalProps
> = ({ isOpen, onClose, productOptions, onSubmit }) => {
	// 완제품 등록 폼 스키마
	const rootProductFormSchema: FormField[] = [
		{
			name: 'itemId',
			label: '제품 선택',
			type: 'select',
			required: true,
			placeholder: '제품을 선택하세요',
			options: productOptions,
		},
	];

	// 완제품 등록 핸들러
	const handleSubmit = async (data: Record<string, unknown>) => {
		try {
			const createRequest: MbomCreateRequest = {
				parentItemId: null, // 완제품이므로 부모 없음
				itemId: Number(data.itemId),
				isRoot: true, // 완제품이므로 true
				inputNum: 1, // 완제품은 기본 1개
				inputUnitCode: 'EA',
				inputUnit: 'EA',
			};

			await onSubmit(createRequest);
			toast.success('완제품이 성공적으로 등록되었습니다.');
			onClose();
		} catch (error) {
			console.error('완제품 등록 실패:', error);
			toast.error('완제품 등록 중 오류가 발생했습니다.');
		}
	};

	return (
		<DraggableDialog
			open={isOpen}
			onOpenChange={onClose}
			title="완제품 등록"
			content={
				<div className="p-2">
					<div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
						<h4 className="text-sm font-medium text-blue-800 mb-1">
							안내
						</h4>
						<p className="text-xs text-blue-600">
							선택한 제품이 BOM의 최상위 완제품으로 등록됩니다.
						</p>
					</div>

					<DynamicForm
						fields={rootProductFormSchema}
						onSubmit={handleSubmit}
						submitButtonText="완제품 등록"
						visibleSaveButton={true}
					/>
				</div>
			}
		/>
	);
};
