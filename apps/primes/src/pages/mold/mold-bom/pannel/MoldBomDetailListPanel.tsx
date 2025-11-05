import React, { useState, useEffect } from 'react';
import { useTranslation } from '@repo/i18n';
import DatatableComponent from '@primes/components/datatable/DatatableComponent';
import { useDataTable } from '@repo/radix-ui/hook';
import { useMoldBomDetailByMasterId } from '@primes/hooks/mold/mold-bom';
import { MoldBomDetailDto, MoldBomMasterDto } from '@primes/types/mold';
import { moldBomDetailRelatedColumns } from '@primes/schemas/mold';

const PAGE_SIZE = 30;

interface MoldBomDetailListPanelProps {
	selectedMasterId: number | null;
}

export const MoldBomDetailListPanel: React.FC<MoldBomDetailListPanelProps> = ({
	selectedMasterId,
}) => {
	const { t: tCommon } = useTranslation('common');

	// Detail Table State
	const [detailData, setDetailData] = useState<MoldBomDetailDto[]>([]);

	// API hooks
	const { data: listByMasterId, isLoading: detailLoading } =
		useMoldBomDetailByMasterId(selectedMasterId || 0, 0, PAGE_SIZE);

	// Detail table data table hook
	const {
		table: detailTable,
		toggleRowSelection: toggleDetailRowSelection,
		selectedRows: selectedDetailRows,
	} = useDataTable(
		detailData,
		moldBomDetailRelatedColumns,
		0,
		1,
		0,
		detailData.length,
		() => {}
	);

	// Convert MoldBomMasterDto to MoldBomDetailDto format
	const convertMasterToDetail = (masterData: any): MoldBomDetailDto => {
		return {
			id: masterData.id,
			tenantId: masterData.tenantId,
			isDelete: masterData.isDelete,
			isUse: true,
			moldBomMasterId: masterData.id,
			parentId: masterData.parentId || 0,
			isRoot: masterData.isRoot || false,
			moldMasterId: masterData.id,
			moldMaster: {
				id: masterData.id,
				tenantId: masterData.tenantId,
				isDelete: masterData.isDelete,
				isUse: true,
				moldType: '',
				moldCode: masterData.moldCode || '',
				moldName: masterData.moldName || '',
				moldStandard: masterData.moldStandard || '',
				lifeCycle: masterData.lifeCycle || 0,
				moldPrice: masterData.moldPrice || 0,
				safeStock: masterData.safeStock || 0,
				currentStock: 0,
				manageType: masterData.manageType || '',
				moldDesign: '',
				moldDesignCode: '',
				moldPicture: '',
				keepPlace: masterData.keepPlace || '',
				createdBy: masterData.createdBy,
				createdAt: masterData.createdAt,
				updatedBy: masterData.updatedBy,
				updatedAt: masterData.updatedAt,
				moldDisposes: [],
				moldInstances: [],
				moldItemRelations: [],
				moldLifeChangeHistorys: [],
				moldLocations: [],
				moldOrderDetails: [],
				moldPriceChangeHistorys: [],
				moldUsingInformations: [],
			},
			moldTypeCode: masterData.moldTypeCode || '',
			moldTypeName: masterData.moldTypeName || '',
			parentItemCode: '',
			parentItemName: '',
			quantity: 1,
			childItemCode: masterData.moldCode || '',
			childItemName: masterData.moldName || '',
			num: masterData.num || 0,
			isManage: masterData.isManage || false,
			leftSer: masterData.leftSer || 0,
			rightSer: masterData.rightSer || 0,
			subOrder: masterData.subOrder || 0,
			createdBy: masterData.createdBy,
			createdAt: masterData.createdAt,
			updatedBy: masterData.updatedBy,
			updatedAt: masterData.updatedAt,
		};
	};

	// Update detail data when API response changes
	useEffect(() => {
		if (listByMasterId?.data && Array.isArray(listByMasterId.data)) {
			// Check if the data is MoldBomMasterDto format (has moldCode, moldName directly)
			const isMasterFormat = listByMasterId.data.length > 0 && 
				'moldCode' in listByMasterId.data[0] && 
				'moldName' in listByMasterId.data[0];
			
			if (isMasterFormat) {
				// Convert MoldBomMasterDto to MoldBomDetailDto
				const convertedData = listByMasterId.data.map((item: any) => convertMasterToDetail(item));
				setDetailData(convertedData);
			} else {
				setDetailData(listByMasterId.data);
			}
		} else if (Array.isArray(listByMasterId)) {
			setDetailData(listByMasterId);
		} else if (!selectedMasterId) {
			setDetailData([]);
		}
	}, [listByMasterId, selectedMasterId]);

	return (
		<div className="h-full">
			{/* Detail List */}
			<div className="border rounded-lg h-full overflow-hidden">
				<DatatableComponent
					table={detailTable}
					columns={moldBomDetailRelatedColumns}
					data={detailData}
					tableTitle={tCommon('pages.mold.bom.detail')}
					rowCount={detailData.length}
					useSearch={false}
					usePageNation={false}
					selectedRows={selectedDetailRows}
					toggleRowSelection={toggleDetailRowSelection}
					useSummary={true}
				/>
			</div>
		</div>
	);
};
