import React from 'react';
import DatatableComponent from '@primes/components/datatable/DatatableComponent';
import { useDataTable } from '@radix-ui/hook';
import { useTranslation } from '@repo/i18n';
import { useCommand } from '@primes/hooks/production/useCommand';
import { commandTableColumns } from '@primes/schemas/mold/moldInoutInformationSchemas';
import { useState, useEffect } from 'react';

interface MoldInoutCommandPanelProps {
	selectedCommandId: number | null;
	onCommandSelect: (commandId: number | null, itemId?: number) => void;
}

export const MoldInoutCommandPanel: React.FC<MoldInoutCommandPanelProps> = ({
	selectedCommandId,
	onCommandSelect,
}) => {
	const { t: tCommon } = useTranslation('common');
	const [commandPage, setCommandPage] = useState<number>(0);
	const [commandData, setCommandData] = useState<any[]>([]);
	const [commandTotalElements, setCommandTotalElements] = useState<number>(0);
	const [commandPageCount, setCommandPageCount] = useState<number>(0);
	const DEFAULT_PAGE_SIZE = 30;

	// Production Command API 호출
	const {
		list: { data: commandApiData },
	} = useCommand({
		searchRequest: {},
		page: commandPage,
		size: DEFAULT_PAGE_SIZE,
	});

	// Command data processing
	useEffect(() => {
		if (commandApiData) {
			if (
				commandApiData.data &&
				commandApiData.data.content &&
				Array.isArray(commandApiData.data.content)
			) {
				setCommandData(commandApiData.data.content);
				setCommandTotalElements(commandApiData.data.totalElements);
				setCommandPageCount(commandApiData.data.totalPages);
			} else if (Array.isArray(commandApiData)) {
				setCommandData(commandApiData);
				setCommandTotalElements(commandApiData.length);
				setCommandPageCount(
					Math.ceil(commandApiData.length / DEFAULT_PAGE_SIZE)
				);
			} else {
				const extractedData = (commandApiData.data ||
					commandApiData) as any;
				if (Array.isArray(extractedData)) {
					setCommandData(extractedData);
					setCommandTotalElements(extractedData.length);
					setCommandPageCount(
						Math.ceil(extractedData.length / DEFAULT_PAGE_SIZE)
					);
				} else {
					setCommandData([]);
					setCommandTotalElements(0);
					setCommandPageCount(0);
				}
			}
		} else {
			setCommandData([]);
			setCommandTotalElements(0);
			setCommandPageCount(0);
		}
	}, [commandApiData]);

	const { table, selectedRows, toggleRowSelection } = useDataTable(
		commandData,
		commandTableColumns,
		DEFAULT_PAGE_SIZE,
		commandPageCount,
		commandPage,
		commandTotalElements,
		(pagination: { pageIndex: number }) =>
			setCommandPage(pagination.pageIndex)
	);

	// Handle command row selection changes
	useEffect(() => {
		const handleRowSelect = (ids: string[]) => {
			if (ids.length > 0) {
				const rowIndex = parseInt(ids[0]);
				if (
					!isNaN(rowIndex) &&
					rowIndex >= 0 &&
					rowIndex < commandData.length
				) {
					const selectedData = commandData[rowIndex];
					const newCommandId = selectedData?.id || null;
					const itemId = selectedData?.itemId || undefined;
					onCommandSelect(newCommandId, itemId);
				} else {
					onCommandSelect(null);
				}
			} else {
				onCommandSelect(null);
			}
		};

		const selectedData = Array.from(selectedRows);
		handleRowSelect(selectedData);
	}, [selectedRows, commandData, onCommandSelect]);

	return (
		<div className="border rounded-lg overflow-hidden">
			<DatatableComponent
				table={table}
				columns={commandTableColumns}
				data={commandData}
				tableTitle={tCommon(
					'pages.production.command.list',
					'작업지시 목록'
				)}
				rowCount={commandTotalElements}
				defaultPageSize={30}
				useSearch={false}
				toggleRowSelection={toggleRowSelection}
				selectedRows={selectedRows}
				enableSingleSelect={true}
			/>
		</div>
	);
};
