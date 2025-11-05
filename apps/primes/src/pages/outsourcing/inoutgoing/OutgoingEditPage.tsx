import React from 'react';
import { useTranslation } from '@repo/i18n';
import { useParams } from 'react-router-dom';

export const OutgoingEditPage: React.FC = () => {
	const { t } = useTranslation(['common', 'menu']);
	const { id } = useParams<{ id: string }>();

	return (
		<div className="p-6">
			<div className="mb-6">
				<h1 className="text-2xl font-bold text-gray-900 mb-2">
					출고 수정 (ID: {id})
				</h1>
				<p className="text-gray-600">출고 정보를 수정합니다.</p>
			</div>

			<div className="bg-white rounded-lg shadow p-6">
				<div className="text-center py-12">
					<h3 className="text-lg font-medium text-gray-900 mb-2">
						출고 수정 폼
					</h3>
					<p className="text-gray-500">
						실제 구현 시 출고 수정 폼 컴포넌트가 여기에 들어갑니다.
					</p>
				</div>
			</div>
		</div>
	);
};
