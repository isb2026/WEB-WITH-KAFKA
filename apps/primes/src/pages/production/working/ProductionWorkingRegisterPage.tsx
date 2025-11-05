import React, { useState } from 'react';
import { useTranslation } from '@repo/i18n';
import { useNavigate } from 'react-router-dom';
import { PageTemplate } from '@primes/templates';
import { RadixButton, DraggableDialog } from '@radix-ui/components';
import { ArrowLeft } from 'lucide-react';
import { ProductionWorkingRegisterForm } from './ProductionWorkingRegisterForm';
import { MoldInputInfo } from './MoldInputInfo';
import { ItemInputInfo } from './ItemInputInfo';

export const ProductionWorkingRegisterPage: React.FC = () => {
	const { t } = useTranslation('common');
	const navigate = useNavigate();
	const [selectedCommand, setSelectedCommand] = useState<any>(null);
	const [selectedProgressId, setSelectedProgressId] = useState<
		number | undefined
	>(undefined);
	const [showConfirmDialog, setShowConfirmDialog] = useState(false);
	const [formRef, setFormRef] = useState<any>(null);

	const handleCommandChange = (command: any) => {
		setSelectedCommand(command);

		const progressId = command?.progressId || command?.progressInfo?.id;
		if (progressId) {
			setSelectedProgressId(progressId);
		} else {
			setSelectedProgressId(undefined);
		}
	};

	const handleFormDataChange = (response: any) => {
		console.log('작업 등록 완료:', response);
		setShowConfirmDialog(true);
	};

	const handleFormReady = (formMethods: any) => {
		setFormRef(formMethods);
	};

	const handleConfirmYes = () => {
		setShowConfirmDialog(false);
		if (formRef) {
			formRef.reset();
		}
		setSelectedCommand(null);
		setSelectedProgressId(undefined);
	};

	const handleConfirmNo = () => {
		setShowConfirmDialog(false);
		navigate('/production/working/list');
	};

	return (
		<div className="production-working-register max-w-full mx-auto p-4 h-full flex flex-col">
			<div className="flex justify-between items-center gap-2 mb-6">
				<RadixButton
					className="flex gap-2 px-3 py-2 rounded-lg text-sm items-center border"
					onClick={() => navigate('/production/working/list')}
				>
					<ArrowLeft size={16} />
					뒤로가기
				</RadixButton>
			</div>
			<PageTemplate splitterSizes={[35, 65]} splitterMinSize={[500, 700]}>
				<div className="border rounded-lg h-full overflow-visible">
					<ProductionWorkingRegisterForm
						onCommandChange={handleCommandChange}
						onFormDataChange={handleFormDataChange}
						onFormReady={handleFormReady}
					/>
				</div>
				<div className="h-full overflow-hidden">
					<div className="grid grid-rows-2 h-full gap-4">
						<div className="h-full">
							<ItemInputInfo
								selectedCommand={selectedCommand}
								selectedProgressId={selectedProgressId}
							/>
						</div>
						<div className="h-full">
							<MoldInputInfo selectedCommand={selectedCommand} />
						</div>
					</div>
				</div>
			</PageTemplate>

			<DraggableDialog
				open={showConfirmDialog}
				onOpenChange={setShowConfirmDialog}
				title="작업 등록 완료"
				content={
					<div className="p-4">
						<p className="text-gray-700 mb-4">
							작업 등록이 완료되었습니다. 추가로 작업 등록을
							진행하시겠습니까?
						</p>
						<div className="flex justify-end gap-2">
							<RadixButton
								className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50"
								onClick={handleConfirmNo}
							>
								아니오
							</RadixButton>
							<RadixButton
								className="px-4 py-2 text-sm bg-Colors-Brand-600 text-white rounded-lg hover:bg-Colors-Brand-700"
								onClick={handleConfirmYes}
							>
								예
							</RadixButton>
						</div>
					</div>
				}
			/>
		</div>
	);
};

export default ProductionWorkingRegisterPage;
