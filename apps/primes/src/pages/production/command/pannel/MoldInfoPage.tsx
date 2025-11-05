import React from 'react';
import { MoldInstanceDto } from '@primes/types/mold';
import { InfoGrid } from '@primes/components/common/InfoGrid';
import { useTranslation } from '@repo/i18n';

interface MoldInfoPageProps {
	molds?: MoldInstanceDto[];
}

export const MoldInfoPage: React.FC<MoldInfoPageProps> = ({
	molds = [],
}) => {
	const { t } = useTranslation('dataTable');

	if (!molds || molds.length === 0) {
		return (
			<div className="flex items-center justify-center h-32 text-gray-500">
				금형 정보가 없습니다.
			</div>
		);
	}

	return (
		<div className="h-full flex flex-col">
			<div className="flex-1 overflow-auto">
				<div className="overflow-x-auto">
					<table className="min-w-full divide-y divide-gray-200">
						<thead className="bg-gray-50 sticky top-0">
							<tr>
								<th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									{t('columns.moldCode')}
								</th>
								<th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									{t('columns.instanceCode')}
								</th>
								<th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									{t('columns.instanceName')}
								</th>
								<th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									{t('columns.instanceNumber')}
								</th>
								<th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									{t('columns.instanceStandard')}
								</th>
								<th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
									{t('columns.maxCount')}
								</th>
								<th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
									{t('columns.currentCount')}
								</th>
								<th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
									{t('columns.grade')}
								</th>
								<th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
									{t('columns.keepPlace')}
								</th>
							</tr>
						</thead>
						<tbody className="bg-white divide-y divide-gray-200">
							{molds.map((mold) => (
								<tr key={mold.id} className="hover:bg-gray-50">
									<td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
										{mold.moldCode}
									</td>
									<td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
										{mold.moldInstanceCode}
									</td>
									<td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
										{mold.moldInstanceName || '-'}
									</td>
									<td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
										{mold.moldInstanceNumber || '-'}
									</td>
									<td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
										{mold.moldInstanceStandard || '-'}
									</td>
									<td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 text-right">
										{mold.maxCount ? mold.maxCount.toLocaleString() : '-'}
									</td>
									<td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 text-right">
										{mold.currentCount ? mold.currentCount.toLocaleString() : '-'}
									</td>
									<td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 text-center">
										{mold.grade || '-'}
									</td>
									<td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 text-center">
										{mold.keepPlace || '-'}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
			
			{molds.length > 0 && (
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
						data={molds[0] as any}
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
			)}
		</div>
	);
};