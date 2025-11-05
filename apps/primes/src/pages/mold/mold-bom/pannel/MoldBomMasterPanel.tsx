import React from 'react';
import { MoldBomRegisterForm } from '../MoldBomRegisterForm';
import { MoldBomMasterDto } from '@primes/types/mold';

interface MoldBomMasterPanelProps {
	editMode?: boolean;
	editData?: MoldBomMasterDto | null;
	onSuccess?: (res: any) => void;
	onReset?: () => void;
}

export const MoldBomMasterPanel: React.FC<MoldBomMasterPanelProps> = ({
	editMode,
	editData,
	onSuccess,
	onReset,
}) => {
	return (
		<div className="border rounded-lg overflow-auto flex-1">
			<MoldBomRegisterForm
				editMode={editMode}
				editData={editData}
				onSuccess={onSuccess}
				onReset={onReset}
			/>
		</div>
	);
};
