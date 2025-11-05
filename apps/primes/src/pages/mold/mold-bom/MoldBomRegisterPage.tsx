import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from '@repo/i18n';
import { PageTemplate } from '@primes/templates';
import { RadixButton } from '@radix-ui/components';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MoldBomMasterPanel } from './pannel/MoldBomMasterPanel';
import { MoldBomDetailPanel } from './pannel/MoldBomDetailPanel';
import { MoldBomModalPanel } from './pannel/MoldBomModalPanel';
import { MoldBomMasterDto } from '@primes/types/mold';

interface MoldBomRegisterPageProps {
	onClose?: () => void;
}

export const MoldBomRegisterPage: React.FC<MoldBomRegisterPageProps> = ({
	onClose,
}) => {
	const { t: tCommon } = useTranslation('common');
	const navigate = useNavigate();
	const location = useLocation();
	const [newMasterId, setNewMasterId] = useState<number | null>(null);
	const [editMode, setEditMode] = useState<boolean>(false);
	const [editData, setEditData] = useState<MoldBomMasterDto | null>(null);
	const modalRef = useRef<any>(null);

	// location state에서 편집 데이터 확인
	useEffect(() => {
		if (location.state) {
			const { editMode: isEditMode, editData: data } = location.state as {
				editMode?: boolean;
				editData?: MoldBomMasterDto;
			};
			
			if (isEditMode && data) {
				setEditMode(true);
				setEditData(data);
				setNewMasterId(data.id);
			}
		}
	}, [location.state]);

	// 모달 핸들러들
	const handleAddClick = () => {
		modalRef.current?.openAddModal();
	};

	const handleEditClick = (detail: any) => {
		modalRef.current?.openEditModal(detail);
	};

	const handleDeleteClick = (detail: any) => {
		modalRef.current?.openDeleteDialog(detail);
	};

	const handleModalSuccess = () => {
		// 모달 성공 후 처리
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
						{tCommon('pages.mold.bom.backToBom')}
					</RadixButton>
				</div>

				<PageTemplate
					firstChildWidth="30%"
					splitterSizes={[25, 75]}
					splitterMinSize={[310, 550]}
					splitterGutterSize={8}
				>
					<MoldBomMasterPanel
						editMode={editMode}
						editData={editData}
						onSuccess={(res: any) => {
							if (res.id && typeof res.id === 'number') {
								setNewMasterId(res.id);
							}
						}}
						onReset={() => {
							setNewMasterId(null);
							setEditMode(false);
							setEditData(null);
						}}
					/>
					
					<MoldBomDetailPanel
						newMasterId={newMasterId}
						onAddClick={handleAddClick}
						onEditClick={handleEditClick}
						onDeleteClick={handleDeleteClick}
					/>
				</PageTemplate>
			</div>

			<MoldBomModalPanel
				ref={modalRef}
				newMasterId={newMasterId}
				onSuccess={handleModalSuccess}
			/>
		</>
	);
};

export default MoldBomRegisterPage;