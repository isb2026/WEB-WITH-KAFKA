import React from 'react';
import { WorkingDetail } from '@primes/types/production/working';
import { InfoGrid } from '@primes/components/common/InfoGrid';
import { useTranslation } from '@repo/i18n';

interface ProductionWorkingListData {
	id: number;
	commandId?: number;
	commandNo?: string;
	commandGroupNo?: string;
	commandProgressSeq?: string;
	workDate?: string;
	shift?: string;
	lotNo?: string;
	itemId?: number;
	itemNo?: number;
	itemName?: string;
	itemNumber?: string;
	itemSpec?: string;
	progressId?: number;
	progressTypeCode?: string;
	progressName?: string;
	machineId?: number;
	machineCode?: string;
	machineName?: string;
	lineNo?: string;
	workAmount?: number;
	workWeight?: number;
	workUnit?: string;
	startTime?: string;
	endTime?: string;
	boxAmt?: number;
	isClose?: boolean;
	isOutsourcing?: boolean;
	outsourcingVendorId?: number;
	outsourcingVendorName?: string;
	jobType?: string;
	badStatusCode?: string;
	badReasonCode?: string;
	workBy?: string;
	inOut?: boolean;
	createdAt?: string;
	updatedAt?: string;
	[key: string]: unknown;
}

interface WorkingInfoPageProps {
	workings?: ProductionWorkingListData[];
}

export const WorkingInfoPage: React.FC<WorkingInfoPageProps> = ({
	workings = [],
}) => {
	const { t } = useTranslation('dataTable');

	if (!workings || workings.length === 0) {
		return (
			<div className="flex items-center justify-center h-32 text-gray-500">
				작업 정보가 없습니다.
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
									{t('columns.workDate')}
								</th>
								<th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									{t('columns.machineCode')}
								</th>
								<th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									{t('columns.machineName')}
								</th>
								<th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									{t('columns.shift')}
								</th>
								<th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
									{t('columns.workAmount')}
								</th>
								<th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
									{t('columns.workWeight')}
								</th>
								<th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
									{t('columns.workUnit')}
								</th>
								<th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
									{t('columns.jobType')}
								</th>
								<th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
									{t('columns.boxAmt')}
								</th>
								<th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
									{t('columns.startTime')}
								</th>
								<th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
									{t('columns.endTime')}
								</th>
							</tr>
						</thead>
						<tbody className="bg-white divide-y divide-gray-200">
							{workings.map((working) => (
								<tr key={working.id} className="hover:bg-gray-50">
									<td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
										{working.workDate || '-'}
									</td>
									<td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
										{working.machineCode || '-'}
									</td>
									<td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
										{working.machineName || '-'}
									</td>
									<td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
										{working.shift || '-'}
									</td>
									<td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 text-right">
										{working.workAmount ? working.workAmount.toLocaleString() : '-'}
									</td>
									<td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 text-right">
										{working.workWeight ? working.workWeight.toLocaleString() : '-'}
									</td>
									<td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 text-center">
										{working.workUnit || '-'}
									</td>
									<td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 text-center">
										{working.jobType || '-'}
									</td>
									<td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 text-center">
										{working.boxAmt ? working.boxAmt.toLocaleString() : '-'}
									</td>
									<td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 text-center">
										{working.startTime || '-'}
									</td>
									<td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 text-center">
										{working.endTime || '-'}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
			
			{/* 등록정보와 수정정보 */}
			{workings.length > 0 && (
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
						data={workings[0] as any}
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