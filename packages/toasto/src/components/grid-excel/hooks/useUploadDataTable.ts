import { useRef, useState, useImperativeHandle, ForwardedRef } from 'react';
import * as XLSX from 'xlsx';
import { BasicToastoGridProps } from '../../grid/ToastoGrid';

export type UploadExcelDataTableRefType = {
	triggerUpload: () => void;
};

interface HookResult {
	inputRef: React.RefObject<HTMLInputElement>;
	gridColumns: BasicToastoGridProps['columns'];
	gridData: any[];
	triggerUpload: () => void;
	handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
}

export const useUploadDataTable = (
	ref: ForwardedRef<UploadExcelDataTableRefType>
): HookResult => {
	const inputRef = useRef<HTMLInputElement>(null);
	const [gridColumns, setGridColumns] = useState<
		BasicToastoGridProps['columns']
	>([]);
	const [gridData, setGridData] = useState<any[]>([]);
	const triggerUpload = () => inputRef.current?.click();

	const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;
		const ext = file.name.split('.').pop()!.toLowerCase();
		let wb: XLSX.WorkBook;
		if (ext === 'csv') {
			const text = await file.text();
			wb = XLSX.read(text, { type: 'string' });
		} else {
			const data = await file.arrayBuffer();
			wb = XLSX.read(data, { type: 'array' });
		}

		const sheetName = wb.SheetNames[0];
		const ws = wb.Sheets[sheetName];
		const json: any[] = XLSX.utils.sheet_to_json(ws, { defval: '' });

		if (json.length === 0) {
			setGridColumns([]);
			setGridData([]);
			return;
		}

		const firstRow = json[0];
		const columns = Object.keys(firstRow).map((key) => ({
			header: key === '__EMPTY' || key === '0' ? '#' : key,
			name: key,
			editor: 'text' as const,
		}));
		setGridColumns(columns);
		setGridData(json);
	};

	useImperativeHandle(ref, () => ({ triggerUpload }));

	return { inputRef, gridColumns, gridData, triggerUpload, handleFileUpload };
};
