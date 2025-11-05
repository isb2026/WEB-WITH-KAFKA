import React, { forwardRef, useMemo } from 'react';

type Company = {
	reg_no: string;
	name: string;
	ceo: string;
	address: string;
	biz_type?: string;
	biz_item?: string;
};

type Row = {
	no: number;
	item_name: string;
	spec: string;
	qty: number;
	unit_price: number;
	supply_amt: number;
	vat_amt: number;
	remark?: string;
};

export type StatementData = {
	doc_no: string;
	issue_date: string; // yyyy-mm-dd
	tissue_date?: string; // backward-compat optional
	supplier: Company;
	buyer: Company;
	tax_rate: number; // e.g. 0.1
	stamp_image_url?: string; // optional
	rows: Row[];
	totals: {
		total_supply: number;
		total_vat: number;
		grand_total: number;
		amount_in_words: string;
	};
};

const fmt = (n: number) => new Intl.NumberFormat('ko-KR').format(n);

const HeaderCell: React.FC<{
	children: React.ReactNode;
	accent?: 'red' | 'blue';
	noLeft?: boolean;
	noTop?: boolean;
}> = ({ children, accent, noLeft, noTop }) => (
	<div
		className={`flex items-center justify-center text-[12px] font-semibold min-h-[28px] py-1 border-[0.5px] ${
			accent === 'red'
				? 'border-red-500'
				: accent === 'blue'
					? 'border-blue-600'
					: 'border-slate-400'
		} border-l ${noLeft ? 'border-l-0' : ''} border-t ${noTop ? 'border-t-0' : ''} bg-white`}
	>
		{children}
	</div>
);

const Cell: React.FC<{
	children?: React.ReactNode;
	className?: string;
	accent?: 'red' | 'blue';
	noLeft?: boolean;
	noTop?: boolean;
}> = ({ children, className, accent, noLeft, noTop }) => (
	<div
		className={`text-[12px] px-2 py-1 min-h-[28px] border-[0.5px] ${
			accent === 'red'
				? 'border-red-500'
				: accent === 'blue'
					? 'border-blue-600'
					: 'border-slate-400'
		} border-l ${noLeft ? 'border-l-0' : ''} border-t ${noTop ? 'border-t-0' : ''} flex items-start whitespace-pre-wrap break-words leading-[1.25] ${className || ''}`}
	>
		{children}
	</div>
);

const ItemHeader: React.FC<{ accent: 'red' | 'blue' }> = ({ accent }) => (
	<div className="grid grid-cols-[48px_1fr_120px_80px_120px_120px_80px]">
		<HeaderCell accent={accent} noLeft noTop>
			번호
		</HeaderCell>
		<HeaderCell accent={accent} noTop>
			품명[품번]
		</HeaderCell>
		<HeaderCell accent={accent} noTop>
			규격
		</HeaderCell>
		<HeaderCell accent={accent} noTop>
			수량
		</HeaderCell>
		<HeaderCell accent={accent} noTop>
			단가
		</HeaderCell>
		<HeaderCell accent={accent} noTop>
			공급가액
		</HeaderCell>
		<HeaderCell accent={accent} noTop>
			세액
		</HeaderCell>
	</div>
);

const ItemRow: React.FC<{ r: Row; accent: 'red' | 'blue' }> = ({
	r,
	accent,
}) => (
	<div className="grid grid-cols-[48px_1fr_120px_80px_120px_120px_80px]">
		<Cell className="justify-center" accent={accent} noLeft>
			{r.no}
		</Cell>
		<Cell accent={accent}>{r.item_name}</Cell>
		<Cell className="justify-center" accent={accent}>
			{r.spec}
		</Cell>
		<Cell className="justify-end" accent={accent}>
			{fmt(r.qty)}
		</Cell>
		<Cell className="justify-end" accent={accent}>
			{fmt(r.unit_price)}
		</Cell>
		<Cell className="justify-end" accent={accent}>
			{fmt(r.supply_amt)}
		</Cell>
		<Cell className="justify-end" accent={accent}>
			{fmt(r.vat_amt)}
		</Cell>
	</div>
);

const StampComponent: React.FC<{
	stampImageUrl?: string;
	companyName: string;
}> = ({ stampImageUrl, companyName }) => {
	if (!stampImageUrl) return null;

	return (
		<div className="absolute top-0 right-0 z-10 pointer-events-none">
			<img
				src={stampImageUrl}
				alt={`${companyName} 인감`}
				className="w-16 h-16 object-contain"
				style={{
					filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.3))',
				}}
			/>
		</div>
	);
};

const CompanyTable: React.FC<{
	title: string;
	c: Company;
	accent: 'red' | 'blue';
	stampImageUrl?: string;
	showStamp?: boolean;
}> = ({ title, c, accent, stampImageUrl, showStamp = false }) => (
	<div
		className={`${accent === 'red' ? 'border-red-500' : 'border-blue-600'} border-[0.5px] relative`}
	>
		<div
			className={`border-b ${accent === 'red' ? 'border-red-500' : 'border-blue-600'} h-8 flex items-center justify-center font-bold tracking-widest bg-slate-50 text-slate-700`}
		>
			{title}
		</div>
		<div
			className={`grid grid-cols-[120px_1fr_120px_1fr] gap-0 text-[12px]`}
		>
			<Cell
				className="justify-center bg-slate-50"
				accent={accent}
				noLeft
				noTop
			>
				등록번호
			</Cell>
			<Cell className="col-span-3" accent={accent} noTop>
				{c.reg_no}
			</Cell>
			<Cell className="justify-center bg-slate-50" accent={accent} noLeft>
				상호
			</Cell>
			<Cell className="col-span-3" accent={accent}>
				{c.name}
			</Cell>
			<Cell className="justify-center bg-slate-50" accent={accent} noLeft>
				성 명{' '}
			</Cell>
			<Cell className="col-span-3" accent={accent}>
				{c.ceo}
			</Cell>
			<Cell className="justify-center bg-slate-50" accent={accent} noLeft>
				주소
			</Cell>
			<Cell
				className="col-span-3 whitespace-pre-wrap break-words h-[40px] relative"
				accent={accent}
			>
				{c.address}
				{showStamp && title === '공급자' && (
					<StampComponent
						stampImageUrl={stampImageUrl}
						companyName={c.name}
					/>
				)}
			</Cell>
			<Cell className="justify-center bg-slate-50" accent={accent} noLeft>
				업태
			</Cell>
			<Cell accent={accent}>{c.biz_type || ''}</Cell>
			<Cell className="justify-center bg-slate-50" accent={accent} noLeft>
				종목
			</Cell>
			<Cell accent={accent}>{c.biz_item || ''}</Cell>
		</div>
	</div>
);

const TotalsBar: React.FC<{
	supply: number;
	vat: number;
	total: number;
	accent: 'red' | 'blue';
}> = ({ supply, vat, total, accent }) => (
	<div
		className={`${accent === 'red' ? 'border-red-500' : 'border-blue-600'} border-[0.5px]`}
	>
		<div
			className={`grid grid-cols-[120px_1fr_120px_1fr_120px_1fr] text-[12px]`}
		>
			<Cell
				className="justify-center bg-slate-50"
				accent={accent}
				noLeft
				noTop
			>
				공급가액
			</Cell>
			<Cell className="justify-end" accent={accent} noTop>
				{fmt(supply)}
			</Cell>
			<Cell
				className="justify-center bg-slate-50"
				accent={accent}
				noLeft
				noTop
			>
				VAT
			</Cell>
			<Cell className="justify-end" accent={accent} noTop>
				{fmt(vat)}
			</Cell>
			<Cell
				className={`justify-center ${accent === 'red' ? 'bg-red-50' : 'bg-blue-50'} font-semibold`}
				noTop
			>
				합계
			</Cell>
			<Cell className="justify-end font-bold" accent={accent} noTop>
				{fmt(total)}
			</Cell>
		</div>
	</div>
);

const CopyBlock: React.FC<{
	data: StatementData;
	accent: 'red' | 'blue';
	copyLabel: string;
}> = ({ data, accent, copyLabel }) => (
	<div className="p-3">
		<div>
			{/* Unified Header */}
			<div className={`py-1`}>
				<div className="text-center text-[26px] font-bold tracking-[0.3rem] mb-4">
					거래명세표
				</div>

				<hr className="border-y-[1.6px] border-dashed border-slate-300 h-2" />

				<div className="flex items-center justify-between text-[11px] leading-5 mt-4">
					<div>거래명세서 번호: {data.doc_no}</div>
					<div
						className={`${accent === 'red' ? 'text-red-600' : 'text-blue-700'}`}
					>
						({copyLabel})
					</div>
					<div>{data.issue_date || data.tissue_date}</div>
				</div>
			</div>

			{/* Supplier/Buyer tables - unified block */}
			<div className="grid grid-cols-2 gap-0">
				<CompanyTable
					title="공급자"
					c={data.supplier}
					accent={accent}
					stampImageUrl={data.stamp_image_url}
					showStamp={true}
				/>
				<CompanyTable
					title="공급받는자"
					c={data.buyer}
					accent={accent}
					stampImageUrl={data.stamp_image_url}
					showStamp={true}
				/>
			</div>

			{/* 합계 금액 (words) */}
			<div
				className={`${accent === 'red' ? 'border-red-500' : 'border-blue-600'} border-[0.5px]`}
			>
				<div className="grid grid-cols-[120px_1fr] text-[12px]">
					<Cell
						className="justify-center bg-slate-50"
						accent={accent}
						noLeft
						noTop
					>
						합계 금액
					</Cell>
					<Cell className="font-semibold" accent={accent} noTop>
						{data.totals.amount_in_words}
					</Cell>
				</div>
			</div>

			{/* Items table */}
			<div
				className={`${accent === 'red' ? 'border-red-500' : 'border-blue-600'} border-[0.5px]`}
			>
				<ItemHeader accent={accent} />
				{data.rows.map((r) => (
					<ItemRow key={r.no} r={r} accent={accent} />
				))}
				{Array.from({ length: Math.max(0, 8 - data.rows.length) }).map(
					(_, i) => (
						<div
							key={`empty-${i}`}
							className="grid grid-cols-[48px_1fr_120px_80px_120px_120px_80px]"
						>
							{Array.from({ length: 7 }).map((__, j) => (
								<Cell key={j} accent={accent} noLeft={j === 0}>
									&nbsp;
								</Cell>
							))}
						</div>
					)
				)}
			</div>

			{/* Totals */}
			<TotalsBar
				supply={data.totals.total_supply}
				vat={data.totals.total_vat}
				total={data.totals.grand_total}
				accent={accent}
			/>
		</div>
	</div>
);

type Props = {
	data: StatementData;
};

export const TransactionStatement = forwardRef<HTMLDivElement, Props>(
	({ data }, ref) => {
		const containerRef = React.useRef<HTMLDivElement>(null);

		const generateSupplierPdf = async () => {};

		const generateBuyerPdf = async () => {};

		// assure shape and fallbacks
		const normalized = useMemo(() => {
			return {
				...data,
				rows: (data.rows || []).map((r, idx) => ({
					no: r.no ?? idx + 1,
					item_name: r.item_name || '',
					spec: r.spec || '',
					qty: r.qty || 0,
					unit_price: r.unit_price || 0,
					supply_amt: r.supply_amt || 0,
					vat_amt: r.vat_amt || 0,
					remark: r.remark || '',
				})),
			};
		}, [data]);

		return (
			<div className="space-y-6">
				<div className="no-print flex gap-2">
					<button
						onClick={generateSupplierPdf}
						className="px-3 py-1.5 bg-red-600 text-white rounded hover:bg-red-700"
					>
						공급자용 PDF
					</button>
					<button
						onClick={generateBuyerPdf}
						className="px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700"
					>
						공급받는자용 PDF
					</button>
				</div>
				<div ref={ref}>
					<div
						ref={containerRef}
						className="bg-white w-[900px] mx-auto"
					>
						{/* Upper - supplier copy (red tone) */}
						<div data-copy="supplier">
							<CopyBlock
								data={normalized}
								accent="red"
								copyLabel="공급자 보관용"
							/>
						</div>
						<hr className="border-t-2 border-dotted border-slate-300 m-4" />
						{/* Lower - buyer copy (blue tone) */}
						<div data-copy="buyer">
							<CopyBlock
								data={normalized}
								accent="blue"
								copyLabel="공급받는자 보관용"
							/>
						</div>
					</div>
				</div>
				<style>{`
				@media print {
					.no-print{display:none}
				}
			`}</style>
			</div>
		);
	}
);

export default TransactionStatement;
