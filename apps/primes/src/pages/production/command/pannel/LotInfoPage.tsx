import React from 'react';
import { Lot } from '@primes/types/production/lot';
import { InfoGrid } from '@primes/components/common/InfoGrid';
import { useTranslation } from '@repo/i18n';

interface LotInfoPageProps {
	lots?: Lot[];
}

export const LotInfoPage: React.FC<LotInfoPageProps> = ({
	lots = [],
}) => {
	const { t } = useTranslation('dataTable');

	if (!lots || lots.length === 0) {
		return (
			<div className="flex items-center justify-center h-32 text-gray-500">
				LOT 정보가 없습니다.
			</div>
		);
	}

	// LOT가 하나인 경우 InfoGrid로 표시
	if (lots.length === 1) {
		const lot = lots[0];
		const lotInfoKeys = [
			{ key: 'lotNo', label: t('columns.lotNo') },
			{ key: 'itemNumber', label: t('columns.itemNumber') },
			{ key: 'itemName', label: t('columns.itemName') },
			{ key: 'itemSpec', label: t('columns.itemSpec') },
			{ key: 'progressName', label: t('columns.progressName') },
			{ key: 'lotAmount', label: t('columns.lotAmount') },
			{ key: 'lotWeight', label: t('columns.lotWeight') },
			{ key: 'restAmount', label: t('columns.restAmount') },
			{ key: 'restWeight', label: t('columns.restWeight') },
			{ key: 'lotUnit', label: t('columns.lotUnit') },
			{
				key: 'systemInfo',
				label: t('columns.registerInfo'),
				template: '[{createdBy}] {createdAt}',
			},
			{
				key: 'updateInfo',
				label: t('columns.updateInfo'),
				template: '[{updatedBy}] {updatedAt}',
			},
		];

		return (
			<InfoGrid
				columns="grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3"
				classNames={{
					container: 'rounded shadow-sm h-full',
					item: 'flex gap-2 items-center p-2',
					label: 'text-gray-700 text-sm',
					value: 'font-bold text-xs',
				}}
				maxHeight="100%"
				data={lot as any}
				keys={lotInfoKeys}
				systemFields={['systemInfo', 'updateInfo']}
				systemColumns="grid-cols-2"
			/>
		);
	}

	// LOT가 여러 개인 경우 테이블로 표시
	return (
		<div className="h-full flex flex-col">
			<div className="flex-1 overflow-auto">
				<div className="overflow-x-auto">
					<table className="min-w-full divide-y divide-gray-200">
						<thead className="bg-gray-50 sticky top-0">
							<tr>
								<th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									{t('columns.lotNo')}
								</th>
								<th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
									{t('columns.lotAmount')}
								</th>
								<th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
									{t('columns.lotWeight')}
								</th>
								<th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
									{t('columns.restAmount')}
								</th>
								<th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
									{t('columns.restWeight')}
								</th>
								<th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
									{t('columns.lotUnit')}
								</th>
							</tr>
						</thead>
						<tbody className="bg-white divide-y divide-gray-200">
							{lots.map((lot) => (
								<tr key={lot.id} className="hover:bg-gray-50">
									<td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
										{lot.lotNo}
									</td>
									<td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 text-right">
										{lot.lotAmount ? lot.lotAmount.toLocaleString() : '-'}
									</td>
									<td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 text-right">
										{lot.lotWeight ? lot.lotWeight.toLocaleString() : '-'}
									</td>
									<td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 text-right">
										{lot.restAmount ? lot.restAmount.toLocaleString() : '-'}
									</td>
									<td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 text-right">
										{lot.restWeight ? lot.restWeight.toLocaleString() : '-'}
									</td>
									<td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 text-center">
										{lot.lotUnit || '-'}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
			
			{/* 등록정보와 수정정보 */}
			<div className="mt-4 border-t pt-4">
				<InfoGrid
					columns="grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3"
					classNames={{
						container: 'rounded shadow-sm h-full',
						item: 'flex gap-2 items-center p-2',
						label: 'text-gray-700 text-sm',
						value: 'font-bold text-xs',
					}}
					maxHeight="100%"
					data={lots[0] as any}
					keys={[
						{
							key: 'systemInfo',
							label: t('columns.registerInfo'),
							template: '[{createdBy}] {createdAt}',
						},
						{
							key: 'updateInfo',
							label: t('columns.updateInfo'),
							template: '[{updatedBy}] {updatedAt}',
						},
					]}
					systemFields={['systemInfo', 'updateInfo']}
					systemColumns="grid-cols-2"
				/>
			</div>
		</div>
	);
};