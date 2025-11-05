import { BarcodeGenerator } from '@repo/react-barcode';

interface ProductionCommandMovePaperProps {
	lotData: {
		lotNo: string;
		itemName: string;
		itemSpec: string;
		workOrderQuantity: string;
		chargingQuantity: string;
		rawMaterial: string;
		heatNo: string;
		rawMaterialCode: string;
		incomingWeight: string;
	};
	processSteps: Array<{
		sequence: number;
		processName: string;
		equipment: string;
		workQuantity: number;
		workWeight: number;
		workDate: string;
		worker: string;
		qualityCheck: string;
	}>;
	companyName?: string;
}

export const ProductionCommandMovePaper = ({
	lotData,
	processSteps,
	companyName = '로트추적시스템',
}: ProductionCommandMovePaperProps) => {
	const currentDateTime = new Date()
		.toLocaleString('ko-KR', {
			year: '2-digit',
			month: '2-digit',
			day: '2-digit',
			hour: '2-digit',
			minute: '2-digit',
			hour12: false,
		})
		.replace(/\./g, '. ')
		.replace(',', ' 오후 ');

	// Inline styles for table cells to ensure proper alignment in print
	const cellStyle = {
		textAlign: 'center' as const,
		verticalAlign: 'top' as const,
		padding: '3px 8px 13px 8px', // top, right, bottom, left - minimal top padding, more bottom
		border: '1px solid #9ca3af',
	};

	// Reduced height style for Process Details Table
	const processDetailsCellStyle = {
		textAlign: 'center' as const,
		verticalAlign: 'top' as const,
		padding: '2px 6px 8px 6px', // top, right, bottom, left - reduced padding for smaller height
		border: '1px solid #9ca3af',
	};

	const barcodeCellStyle = {
		textAlign: 'center' as const,
		verticalAlign: 'top' as const,
		padding: '1px 3px 6px 3px', // top, right, bottom, left - reduced padding for smaller height
		border: '1px solid #9ca3af',
	};

	return (
		<>
			<style>
				{`
					@media print {
						/* Force everything on one page */
						@page {
							size: A4;
							margin: 10mm;
						}
						
						/* Ensure all content fits on one page */
						#production-command-move-paper {
							page-break-inside: avoid !important;
							break-inside: avoid !important;
							height: auto !important;
							max-height: none !important;
							transform: scale(0.85) !important;
							transform-origin: top left !important;
							width: 117.6% !important;
						}
						
						/* Prevent page breaks within special notes section */
						.special-notes-section {
							page-break-inside: avoid !important;
							break-inside: avoid !important;
							page-break-before: avoid !important;
							break-before: avoid !important;
						}
						
						/* Very compact spacing for print */
						#production-command-move-paper {
							font-size: 10px !important;
							line-height: 1.1 !important;
							padding: 8px !important;
						}
						
						#production-command-move-paper .mb-4 {
							margin-bottom: 4px !important;
						}
						
						#production-command-move-paper .mb-6 {
							margin-bottom: 6px !important;
						}
						
						#production-command-move-paper .mb-2 {
							margin-bottom: 2px !important;
						}
						
						#production-command-move-paper table {
							border-collapse: collapse !important;
							margin-bottom: 4px !important;
						}
						
						#production-command-move-paper td,
						#production-command-move-paper th {
							text-align: center !important;
							vertical-align: middle !important;
							padding: 6px 3px !important;
							border: 1px solid #9ca3af !important;
							font-size: 9px !important;
							line-height: 1.2 !important;
						}
						
						#production-command-move-paper .barcode-cell {
							padding: 5px 2px !important;
							vertical-align: middle !important;
						}
						
						/* Reduce header spacing */
						#production-command-move-paper h1 {
							font-size: 16px !important;
							margin-bottom: 4px !important;
						}
						
						/* Very compact barcode section */
						#production-command-move-paper .h-12 {
							height: 30px !important;
						}
						
						/* Reduce special notes height */
						#production-command-move-paper .h-8 {
							height: 30px !important;
						}
						
						/* Compact text sizes */
						#production-command-move-paper .text-xs {
							font-size: 8px !important;
						}
						
						#production-command-move-paper .text-sm {
							font-size: 9px !important;
						}
					}
				`}
			</style>
			<div
				className="bg-white p-4 max-w-4xl mx-auto print:p-2 print:max-w-none"
				id="production-command-move-paper"
			>
				{/* Header */}
				<div className="flex justify-between items-start mb-2">
					<div className="text-xs text-gray-600">
						{currentDateTime}
					</div>
					<div className="text-right">
						<div className="text-sm font-bold">{companyName}</div>
						<div className="text-xs text-gray-600">
							{companyName} - 공정이동표 출력모드
						</div>
					</div>
				</div>

				{/* Title and Barcode */}
				<div className="text-center mb-2">
					<h1 className="text-xl font-bold mb-1">공정 이동표</h1>
					<div className="w-full h-12 flex items-center justify-center mb-1">
						<BarcodeGenerator
							value={lotData.lotNo}
							height={30}
							width={2}
							fontSize={10}
						/>
					</div>
					<div className="text-sm">
						LOT No:{' '}
						<span className="font-bold">{lotData.lotNo}</span>
					</div>
				</div>

				{/* Product Information Table */}
				<div className="mb-3">
					<table
						className="w-full border-collapse border border-gray-400 text-sm print:text-sm"
						style={{ borderCollapse: 'collapse' }}
					>
						<tbody>
							<tr>
								<td
									className="border border-gray-400 px-2 py-1 font-bold whitespace-nowrap w-20 text-center align-middle print:text-center print:align-middle print:px-2 print:py-2"
									style={cellStyle}
								>
									품&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;명
								</td>
								<td
									className="border border-gray-400 px-2 py-1 text-center align-middle print:text-center print:align-middle print:px-2 print:py-2"
									style={cellStyle}
								>
									{lotData.itemName}
								</td>
								<td
									className="border border-gray-400 px-2 py-1 font-bold whitespace-nowrap w-20 text-center align-middle print:text-center print:align-middle print:px-2 print:py-2"
									style={cellStyle}
								>
									작&nbsp;업&nbsp;지&nbsp;시&nbsp;량
								</td>
								<td
									className="border border-gray-400 px-2 py-1 text-center align-middle print:text-center print:align-middle print:px-2 print:py-2"
									style={cellStyle}
								>
									{lotData.workOrderQuantity}
								</td>
								<td
									className="border border-gray-400 px-2 py-1 font-bold whitespace-nowrap w-20 text-center align-middle print:text-center print:align-middle print:px-2 print:py-2"
									style={cellStyle}
								>
									장&nbsp;&nbsp;입&nbsp;&nbsp;량
								</td>
								<td
									className="border border-gray-400 px-2 py-1 text-center align-middle print:text-center print:align-middle print:px-2 print:py-2"
									style={cellStyle}
								>
									{lotData.chargingQuantity}
								</td>
							</tr>
							<tr>
								<td
									className="border border-gray-400 px-2 py-1 font-bold whitespace-nowrap text-center align-middle print:text-center print:align-middle print:px-2 print:py-2"
									style={cellStyle}
								>
									규&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;격
								</td>
								<td
									className="border border-gray-400 px-2 py-1 text-center align-middle print:text-center print:align-middle print:px-2 print:py-2"
									style={cellStyle}
								>
									{lotData.itemSpec}
								</td>
								<td
									className="border border-gray-400 px-2 py-1 font-bold whitespace-nowrap w-20 text-center align-middle print:text-center print:align-middle print:px-2 print:py-2"
									style={cellStyle}
								>
									원&nbsp;소&nbsp;재&nbsp;재&nbsp;질
								</td>
								<td
									className="border border-gray-400 px-2 py-1 text-center align-middle print:text-center print:align-middle print:px-2 print:py-2"
									style={cellStyle}
								>
									{lotData.rawMaterial}
								</td>
								<td
									className="border border-gray-400 px-2 py-1 font-bold whitespace-nowrap w-20 text-center align-middle print:text-center print:align-middle print:px-2 print:py-2"
									style={cellStyle}
								>
									Heat-No
								</td>
								<td
									className="border border-gray-400 px-2 py-1 text-center align-middle print:text-center print:align-middle print:px-2 print:py-2"
									style={cellStyle}
								>
									{lotData.heatNo}
								</td>
							</tr>
							<tr>
								<td
									className="border border-gray-400 px-2 py-1 font-bold whitespace-nowrap text-center align-middle print:text-center print:align-middle print:px-2 print:py-2"
									style={cellStyle}
								>
									원&nbsp;소&nbsp;재&nbsp;코&nbsp;드
								</td>
								<td
									className="border border-gray-400 px-2 py-1 text-center align-middle print:text-center print:align-middle print:px-2 print:py-2"
									style={cellStyle}
								>
									{lotData.rawMaterialCode}
								</td>
								<td
									className="border border-gray-400 px-2 py-1 font-bold whitespace-nowrap text-center align-middle print:text-center print:align-middle print:px-2 print:py-2"
									style={cellStyle}
								>
									BOX - NO
								</td>
								<td
									className="border border-gray-400 px-2 py-1 text-center align-middle print:text-center print:align-middle print:px-2 print:py-2"
									style={cellStyle}
								>
									{lotData.lotNo}
								</td>
								<td
									className="border border-gray-400 px-2 py-1 font-bold whitespace-nowrap text-center align-middle print:text-center print:align-middle print:px-2 print:py-2"
									style={cellStyle}
								>
									입&nbsp;고&nbsp;중&nbsp;량
								</td>
								<td
									className="border border-gray-400 px-2 py-1 text-center align-middle print:text-center print:align-middle print:px-2 print:py-2"
									style={cellStyle}
								>
									{lotData.incomingWeight}
								</td>
							</tr>
						</tbody>
					</table>
				</div>

				{/* Process Details Table */}
				<div className="mb-3">
					<table
						className="w-full border-collapse border border-gray-400 text-xs print:text-xs"
						style={{ borderCollapse: 'collapse' }}
					>
						<thead>
							<tr>
								<th
									className="border border-gray-400 px-2 py-1 font-bold whitespace-nowrap text-center align-middle print:text-center print:align-middle print:px-2 print:py-2"
									style={processDetailsCellStyle}
								>
									순&nbsp;&nbsp;번
								</th>
								<th
									className="border border-gray-400 px-2 py-1 font-bold whitespace-nowrap text-center align-middle print:text-center print:align-middle print:px-2 print:py-2"
									style={processDetailsCellStyle}
								>
									공&nbsp;정&nbsp;명
								</th>
								<th
									className="border border-gray-400 px-2 py-1 font-bold whitespace-nowrap text-center align-middle print:text-center print:align-middle print:px-2 print:py-2"
									style={processDetailsCellStyle}
								>
									Barcode
								</th>
								<th
									className="border border-gray-400 px-2 py-1 font-bold whitespace-nowrap text-center align-middle print:text-center print:align-middle print:px-2 print:py-2"
									style={processDetailsCellStyle}
								>
									설&nbsp;비&nbsp;/&nbsp;업&nbsp;체
								</th>
								<th
									className="border border-gray-400 px-2 py-1 font-bold whitespace-nowrap text-center align-middle print:text-center print:align-middle print:px-2 print:py-2"
									style={processDetailsCellStyle}
								>
									작업수량
								</th>
								<th
									className="border border-gray-400 px-2 py-1 font-bold whitespace-nowrap text-center align-middle print:text-center print:align-middle print:px-2 print:py-2"
									style={processDetailsCellStyle}
								>
									작&nbsp;업&nbsp;중&nbsp;량
								</th>
								<th
									className="border border-gray-400 px-2 py-1 font-bold whitespace-nowrap text-center align-middle print:text-center print:align-middle print:px-2 print:py-2"
									style={processDetailsCellStyle}
								>
									작&nbsp;업&nbsp;일
								</th>
								<th
									className="border border-gray-400 px-2 py-1 font-bold whitespace-nowrap text-center align-middle print:text-center print:align-middle print:px-2 print:py-2"
									style={processDetailsCellStyle}
								>
									작&nbsp;업&nbsp;자
								</th>
								<th
									className="border border-gray-400 px-2 py-1 font-bold whitespace-nowrap text-center align-middle print:text-center print:align-middle print:px-2 print:py-2"
									style={processDetailsCellStyle}
								>
									품질확인
								</th>
							</tr>
						</thead>
						<tbody>
							{processSteps.map((step, index) => (
								<tr key={index}>
									<td
										className="border border-gray-400 px-2 py-1 text-center align-middle print:text-center print:align-middle print:px-2 print:py-2"
										style={processDetailsCellStyle}
									>
										{step.sequence}
									</td>
									<td
										className="border border-gray-400 px-2 py-1 text-center align-middle print:text-center print:align-middle print:px-2 print:py-2"
										style={processDetailsCellStyle}
									>
										{step.processName}
									</td>
									<td
										className="border border-gray-400 px-1 py-1 text-center align-middle print:text-center print:align-middle print:px-1 print:py-2 barcode-cell"
										style={barcodeCellStyle}
									>
										<div className="inline-block">
											<BarcodeGenerator
												value={`${lotData.lotNo}-${step.sequence}`}
												height={40}
												width={1}
												displayValue={false}
											/>
										</div>
									</td>
									<td
										className="border border-gray-400 px-2 py-1 text-center align-middle print:text-center print:align-middle print:px-2 print:py-2"
										style={processDetailsCellStyle}
									>
										{step.equipment}
									</td>
									<td
										className="border border-gray-400 px-2 py-1 text-center align-middle print:text-center print:align-middle print:px-2 print:py-2"
										style={processDetailsCellStyle}
									>
										{step.workQuantity}
									</td>
									<td
										className="border border-gray-400 px-2 py-1 text-center align-middle print:text-center print:align-middle print:px-2 print:py-2"
										style={processDetailsCellStyle}
									>
										{step.workWeight.toFixed(2)}
									</td>
									<td
										className="border border-gray-400 px-2 py-1 text-center align-middle print:text-center print:align-middle print:px-2 print:py-2"
										style={processDetailsCellStyle}
									>
										{step.workDate}
									</td>
									<td
										className="border border-gray-400 px-2 py-1 text-center align-middle print:text-center print:align-middle print:px-2 print:py-2"
										style={processDetailsCellStyle}
									>
										{step.worker}
									</td>
									<td
										className="border border-gray-400 px-2 py-1 text-center align-middle print:text-center print:align-middle print:px-2 print:py-2"
										style={processDetailsCellStyle}
									>
										{step.qualityCheck}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				{/* Special Notes */}
				<div className="mb-2 special-notes-section">
					<div className="text-sm font-bold mb-1">특이사항</div>
					<div className="border border-gray-400 h-8 p-1 text-xs"></div>
				</div>
			</div>
		</>
	);
};
