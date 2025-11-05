import React, { useState } from 'react';
import { RadixButton, RadixIconButton } from '@repo/radix-ui/components';
import { Plus, Edit, Trash2, Search } from 'lucide-react';

interface VendorData {
	id: number;
	compCode: string;
	compName: string;
	compType: string;
	status: string;
	createdAt: string;
}

const mockVendors: VendorData[] = [
	{
		id: 1,
		compCode: 'V001',
		compName: '삼성전자',
		compType: '대기업',
		status: '활성',
		createdAt: '2024-01-15',
	},
	{
		id: 2,
		compCode: 'V002',
		compName: 'LG화학',
		compType: '대기업',
		status: '활성',
		createdAt: '2024-01-20',
	},
	{
		id: 3,
		compCode: 'V003',
		compName: '현대자동차',
		compType: '대기업',
		status: '활성',
		createdAt: '2024-02-01',
	},
];

const VendorListPage: React.FC = () => {
	const [vendors] = useState<VendorData[]>(mockVendors);
	const [searchTerm, setSearchTerm] = useState('');

	const filteredVendors = vendors.filter(
		(vendor) =>
			vendor.compName.toLowerCase().includes(searchTerm.toLowerCase()) ||
			vendor.compCode.toLowerCase().includes(searchTerm.toLowerCase())
	);

	return (
		<div className="space-y-6 h-full">
			{/* Page Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold text-foreground">
						거래처 관리
					</h1>
					<p className="text-muted-foreground">
						거래처 정보를 관리하고 조회할 수 있습니다
					</p>
				</div>
				<RadixIconButton className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
					<Plus size={16} />새 거래처 등록
				</RadixIconButton>
			</div>

			{/* Search Bar */}
			<div className="bg-card p-6 rounded-lg border border-border">
				<div className="flex items-center gap-4">
					<div className="flex-1 relative">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
						<input
							type="text"
							placeholder="거래처명 또는 코드로 검색..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
						/>
					</div>
					<RadixButton className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2">
						검색
					</RadixButton>
				</div>
			</div>

			{/* Data Table */}
			<div className="bg-card rounded-lg border border-border overflow-hidden">
				<div className="p-6 border-b border-border">
					<h2 className="text-lg font-semibold">
						거래처 목록 ({filteredVendors.length}건)
					</h2>
				</div>

				<div className="overflow-x-auto">
					<table className="w-full">
						<thead className="bg-muted/50">
							<tr>
								<th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
									거래처 코드
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
									거래처명
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
									유형
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
									상태
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
									등록일
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
									작업
								</th>
							</tr>
						</thead>
						<tbody className="bg-background divide-y divide-border">
							{filteredVendors.map((vendor) => (
								<tr
									key={vendor.id}
									className="hover:bg-muted/25 transition-colors"
								>
									<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
										{vendor.compCode}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
										{vendor.compName}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
										{vendor.compType}
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
											{vendor.status}
										</span>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
										{vendor.createdAt}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
										<div className="flex items-center gap-2">
											<RadixIconButton className="p-1 text-blue-600 hover:bg-blue-100 rounded">
												<Edit size={16} />
											</RadixIconButton>
											<RadixIconButton className="p-1 text-red-600 hover:bg-red-100 rounded">
												<Trash2 size={16} />
											</RadixIconButton>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				{filteredVendors.length === 0 && (
					<div className="p-12 text-center">
						<p className="text-muted-foreground">
							검색 결과가 없습니다.
						</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default VendorListPage;
