import React, { forwardRef } from 'react';
import { Box } from '@mui/material';
import {
	useUploadDataTable,
	UploadExcelDataTableRefType,
} from './hooks/useUploadDataTable';
import { ToastoGridComponent } from '../grid/ToastoGrid';

export const UploadExcelDataTable = forwardRef<UploadExcelDataTableRefType>(
	(props, ref) => {
		const { inputRef, gridColumns, gridData, handleFileUpload } =
			useUploadDataTable(ref);

		return (
			<Box>
				<input
					type="file"
					accept=".xlsx,.xls,.csv"
					style={{ display: 'none' }}
					ref={inputRef}
					onChange={handleFileUpload}
				/>
				<Box minHeight="340px" width="100%">
					<ToastoGridComponent
						data={gridData}
						columns={gridColumns}
						gridOptions={{
							scrollX: true,
							scrollY: true,
							bodyHeight: 'fitToParent',
						}}
					/>
				</Box>
			</Box>
		);
	}
);
