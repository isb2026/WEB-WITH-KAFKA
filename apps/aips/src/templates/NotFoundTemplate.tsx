import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '@repo/i18n';

const NotFoundTemplate: React.FC = () => {
	const navigate = useNavigate();
	const { t } = useTranslation('common');

	const handleGoHome = () => {
		navigate('/');
	};

	return (
		<div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
			<div className="text-6xl mb-4">🔍</div>
			<h1 className="text-3xl font-bold mb-4">{t('notFound.title')}</h1>
			<p className="text-gray-600 mb-6">
				{t('notFound.description')}
			</p>
			<button
				onClick={handleGoHome}
				className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
			>
				{t('notFound.goToHome')}
			</button>
		</div>
	);
};

export default NotFoundTemplate; 