import React, { useState } from 'react';
import { useTranslation } from '@repo/i18n';
import { PageTemplate } from '@primes/templates';
import { RadixButton } from '@radix-ui/components';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MoldInoutCommandPanel } from './pannel/MoldInoutCommandPanel';
import { MoldInoutInstancePanel } from './pannel/MoldInoutInstancePanel';
import { MoldInoutModalPanel } from './pannel/MoldInoutModalPanel';
import { MoldInoutInformationDto } from '@primes/types/mold';

interface MoldInoutInformationRegisterPageProps {
	onClose?: () => void;
	selectedInoutInformation?: MoldInoutInformationDto;
	isEditMode?: boolean;
	onSuccess?: () => void;
}

export const MoldInoutInformationRegisterPage: React.FC<
	MoldInoutInformationRegisterPageProps
> = () => {
	const { t: tCommon } = useTranslation('common');
	const navigate = useNavigate();

	// 기본 상태 관리
	const [selectedCommandId, setSelectedCommandId] = useState<number | null>(null);
	const [selectedItemId, setSelectedItemId] = useState<number | undefined>(undefined);
	const [isInoutModalOpen, setIsInoutModalOpen] = useState(false);
	const [isInputModalOpen, setIsInputModalOpen] = useState(false);
	const [refetchRecords, setRefetchRecords] = useState<(() => void) | null>(null);

	// MoldInoutInstancePanel에서 refetch 함수를 받아오는 콜백
	const handleRefetchReady = (refetchFn: () => void) => {
		setRefetchRecords(() => refetchFn);
	};

	// 투입 성공 후 데이터 새로고침
	const handleInputSuccess = () => {
		if (refetchRecords) {
			refetchRecords();
		}
	};

	// 작업지시 선택 핸들러 (itemId도 함께 관리)
	const handleCommandSelect = (commandId: number | null, itemId?: number) => {
		setSelectedCommandId(commandId);
		setSelectedItemId(itemId);
	};

	return (
		<>
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
						{tCommon('pages.mold.inout.backToInout')}
					</RadixButton>
				</div>

				<PageTemplate
					firstChildWidth="50%"
					splitterSizes={[50, 50]}
					splitterMinSize={[400, 400]}
					splitterGutterSize={8}
				>
					<MoldInoutCommandPanel
						selectedCommandId={selectedCommandId}
						onCommandSelect={handleCommandSelect}
					/>
					
					<MoldInoutInstancePanel
						selectedCommandId={selectedCommandId}
						onNewWindowRegister={() => setIsInoutModalOpen(true)}
						onInputModalOpen={() => setIsInputModalOpen(true)}
						onRefetchReady={handleRefetchReady}
					/>
				</PageTemplate>
			</div>

			<MoldInoutModalPanel
				isInoutModalOpen={isInoutModalOpen}
				setIsInoutModalOpen={setIsInoutModalOpen}
				isInputModalOpen={isInputModalOpen}
				setIsInputModalOpen={setIsInputModalOpen}
				selectedCommandId={selectedCommandId}
				selectedItemId={selectedItemId}
				onSuccess={handleInputSuccess}
			/>
		</>
	);
};

export default MoldInoutInformationRegisterPage;