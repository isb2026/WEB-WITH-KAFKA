import React, { useMemo, useState } from 'react';
import { useVendor } from '@primes/hooks/init/vendor/useVendor';
import { VendorSearchRequest, VendorDto } from '@primes/types/vendor';
import { RadixButton } from '@radix-ui/components/Button';

interface VendorSearchDialogProps {
	searchTerm: string;
	columnId: string;
	rowData: Record<string, string | number>;
	onItemSelect: (vendor: VendorDto) => void;
	onClose: () => void;
}

interface VendorColumn {
	accessorKey: keyof VendorDto;
	header: string;
	size: number;
}

export const VendorSearchDialog: React.FC<VendorSearchDialogProps> = ({
	searchTerm,
	columnId,
	rowData,
	onItemSelect,
	onClose,
}) => {
	// Track selected rows to allow multi-selection feedback
	const [selectedRowIds, setSelectedRowIds] = useState<Set<string | number>>(
		new Set()
	);

	// Create search request dynamically from field values
	const searchRequest: VendorSearchRequest = {
		isUse: true,
	};

	// Map field names to VendorSearchRequest properties with proper typing
	const fieldToSearchMap: Record<string, keyof VendorSearchRequest> = {
		compCode: 'compCode',
		compType: 'compType',
		compName: 'compName',
		ceoName: 'ceoName',
		compEmail: 'compEmail',
		telNumber: 'telNumber',
		faxNumber: 'faxNumber',
		zipCode: 'zipCode',
		addressDtl: 'addressDtl',
		addressMst: 'addressMst',
		licenseNo: 'licenseNo',
	};

	// Build search request from all filled fields in the row
	Object.entries(rowData).forEach(([fieldName, fieldValue]) => {
		if (fieldValue && fieldValue !== '' && fieldToSearchMap[fieldName]) {
			const searchField = fieldToSearchMap[fieldName];

			// Handle numeric fields
			if (searchField === 'id') {
				searchRequest[searchField] = Number(fieldValue);
			} else {
				// Handle string fields with proper type assertion
				(searchRequest as any)[searchField] = fieldValue as string;
			}
		}
	});

	// If no fields are filled, use the current search term for the specific column
	if (Object.keys(searchRequest).length === 1) {
		// Only has isUse: true
		const searchField = fieldToSearchMap[columnId];
		if (searchField) {
			if (searchField === 'id') {
				searchRequest[searchField] = searchTerm
					? Number(searchTerm)
					: undefined;
			} else {
				(searchRequest as any)[searchField] = searchTerm;
			}
		}
	}

	// Use the vendor hook to fetch data
	const { list } = useVendor({
		searchRequest,
		page: 0,
		size: 20,
	});

	const { data: response, isLoading, error } = list;

	// Extract data from response
	const vendors = useMemo(() => {
		if (!response) return [];

		if (Array.isArray(response)) return response;
		if (response.content && Array.isArray(response.content))
			return response.content;

		return [];
	}, [response]);

	// Create simple columns for the vendor list with proper typing
	const vendorColumns: VendorColumn[] = [
		{
			accessorKey: 'compCode',
			header: '거래처코드',
			size: 120,
		},
		{
			accessorKey: 'compType',
			header: '거래처구분',
			size: 120,
		},
		{
			accessorKey: 'compName',
			header: '거래처명',
			size: 200,
		},
		{
			accessorKey: 'ceoName',
			header: '대표자명',
			size: 120,
		},
		{
			accessorKey: 'telNumber',
			header: '전화번호',
			size: 120,
		},
		{
			accessorKey: 'licenseNo',
			header: '사업자번호',
			size: 150,
		},
	];

	// Helper function to safely get vendor value for display
	const getVendorValue = (
		vendor: VendorDto,
		key: keyof VendorDto
	): string => {
		const value = vendor[key];
		if (value === null || value === undefined) return '-';
		if (typeof value === 'string' || typeof value === 'number')
			return String(value);
		if (Array.isArray(value))
			return value.length > 0 ? `${value.length}개` : '-';
		return String(value);
	};

	return (
		<div>
			<div className="max-h-80 overflow-auto border rounded-lg">
				<table className="w-full">
					<thead className="sticky top-0 bg-gray-50 z-10">
						<tr>
							{vendorColumns.map((column) => (
								<th
									key={column.accessorKey}
									className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b bg-gray-50"
									style={{ width: column.size }}
								>
									{column.header}
								</th>
							))}
						</tr>
					</thead>

					{/* centered status row */}
					{(isLoading ||
						error ||
						(!isLoading && vendors.length === 0)) && (
						<tbody>
							<tr>
								<td
									colSpan={vendorColumns.length}
									className="p-0"
								>
									<div className="flex items-center justify-center h-56">
										{isLoading ? (
											<div className="flex items-center justify-center gap-2">
												<div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-300 border-t-blue-500"></div>
											</div>
										) : error ? (
											<div className="text-sm text-red-500">
												검색 중 오류가 발생했습니다.
											</div>
										) : (
											<div className="text-sm text-gray-500">
												검색 결과가 없습니다.
											</div>
										)}
									</div>
								</td>
							</tr>
						</tbody>
					)}

					{/* data rows */}
					{!isLoading && !error && vendors.length > 0 && (
						<tbody>
							{vendors.map((vendor: VendorDto, index: number) => {
								const rowKey = vendor.id ?? index;
								const isSelected = selectedRowIds.has(rowKey);
								return (
									<tr
										key={rowKey}
										className={`${isSelected ? 'bg-Colors-Brand-600 text-white hover:bg-Colors-Brand-600' : 'bg-white hover:bg-gray-50'} cursor-pointer border-b`}
										onClick={() => {
											onItemSelect(vendor);
											setSelectedRowIds((prev) => {
												const next = new Set(prev);
												next.add(rowKey);
												return next;
											});
										}}
									>
										{vendorColumns.map((column) => (
											<td
												key={column.accessorKey}
												className={`px-3 py-2 text-sm ${isSelected ? 'text-white' : 'text-gray-900'}`}
											>
												<span
													className={`${isSelected ? 'text-white hover:border-b hover:border-white' : 'hover:text-blue-600 hover:border-b hover:border-blue-600'} cursor-pointer`}
													onClick={(e) => {
														e.stopPropagation();
														onItemSelect(vendor);
														onClose();
													}}
												>
													{getVendorValue(
														vendor,
														column.accessorKey
													)}
												</span>
											</td>
										))}
									</tr>
								);
							})}
						</tbody>
					)}
				</table>
			</div>

			{/* Close Button */}
			<div className="flex justify-end pt-3">
				<RadixButton
					className="px-4 py-1.5 rounded-lg text-sm items-center border"
					onClick={() => {
						// Ensure we close the dialog and trigger focus logic
						onClose();
					}}
				>
					확인
				</RadixButton>
			</div>
		</div>
	);
};
