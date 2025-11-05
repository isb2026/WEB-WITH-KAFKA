import React from 'react';
import { useTranslation } from '@repo/i18n';
import { RadixIconButton } from '@repo/radix-ui/components';
import { X, Save } from 'lucide-react';

interface IniItemBomRegisterPageProps {
	onClose?: () => void;
}

export const IniItemBomRegisterPage: React.FC<IniItemBomRegisterPageProps> = ({
	onClose,
}) => {
	const { t } = useTranslation('common');

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// TODO: BOM 등록 로직 구현
		console.log('BOM 등록 처리');
		onClose?.();
	};

	const handleCancel = () => {
		onClose?.();
	};

	return (
		<div className="p-6">
			<form onSubmit={handleSubmit} className="space-y-6">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							{t('fields.itemCode')}
						</label>
						<input
							type="text"
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							placeholder={t('placeholders.enterItemCode')}
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							{t('fields.itemName')}
						</label>
						<input
							type="text"
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							placeholder={t('placeholders.enterItemName')}
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							{t('fields.bomVersion')}
						</label>
						<input
							type="text"
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							placeholder={t('placeholders.enterBomVersion')}
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							{t('fields.status')}
						</label>
						<select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
							<option value="">{t('common.selectOption')}</option>
							<option value="active">{t('status.active')}</option>
							<option value="inactive">
								{t('status.inactive')}
							</option>
						</select>
					</div>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						{t('fields.description')}
					</label>
					<textarea
						rows={4}
						className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						placeholder={t('placeholders.enterDescription')}
					/>
				</div>

				<div className="flex justify-end gap-3 pt-4 border-t">
					<RadixIconButton
						type="button"
						variant="outline"
						onClick={handleCancel}
						className="flex items-center gap-2 px-4 py-2"
					>
						<X size={16} />
						{t('actions.cancel')}
					</RadixIconButton>
					<RadixIconButton
						type="submit"
						className="bg-Colors-Brand-700 text-white hover:bg-Colors-Brand-800 flex items-center gap-2 px-4 py-2"
					>
						<Save size={16} />
						{t('actions.save')}
					</RadixIconButton>
				</div>
			</form>
		</div>
	);
};
