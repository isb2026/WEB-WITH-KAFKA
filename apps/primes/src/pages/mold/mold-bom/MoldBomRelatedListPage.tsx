import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageTemplate } from '@primes/templates';
import { MoldBomMasterDto } from '@primes/types/mold';
import { MoldBomMasterListPanel } from './pannel/MoldBomMasterListPanel';
import { MoldBomDetailListPanel } from './pannel/MoldBomDetailListPanel';

interface MoldBomRelatedListPageProps {}

export const MoldBomRelatedListPage: React.FC<MoldBomRelatedListPageProps> = () => {
	const navigate = useNavigate();
	const [selectedMaster, setSelectedMaster] = useState<MoldBomMasterDto | null>(null);

	const handleMasterSelect = (master: MoldBomMasterDto | null) => {
		setSelectedMaster(master);
	};

	const handleEditClick = (item: MoldBomMasterDto) => {
		// 선택된 데이터를 state로 전달하면서 register 페이지로 이동
		navigate('/mold/bom/register', { 
			state: { 
				editMode: true, 
				editData: item 
			} 
		});
	};

	return (
		<PageTemplate
			firstChildWidth="30%"
			splitterSizes={[30, 70]}
			splitterMinSize={[430, 800]}
			splitterGutterSize={6}
		>
			<MoldBomMasterListPanel
				onMasterSelect={handleMasterSelect}
				onEditClick={handleEditClick}
			/>
			
			<MoldBomDetailListPanel
				selectedMasterId={selectedMaster?.id || null}
			/>
		</PageTemplate>
	);
};

export default MoldBomRelatedListPage;