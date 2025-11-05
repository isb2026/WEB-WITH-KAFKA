import React from 'react';
import { RadixButton } from '@repo/radix-ui/components';
import { BarChart3, Users, Package, ShoppingCart } from 'lucide-react';

const Dashboard: React.FC = () => {
	return (
		<div className="space-y-6 h-full">
			{/* Page Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold text-foreground">
						대시보드
					</h1>
					<p className="text-foreground">
						외주 SCM 시스템 현황을 한눈에 확인하세요
					</p>
				</div>
			</div>

			{/* Quick Stats Cards */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				<div className="bg-card p-6 rounded-lg border border-border">
					<div className="flex items-center gap-4">
						<div className="p-3 bg-blue-100 rounded-lg">
							<Users className="h-6 w-6 text-blue-600" />
						</div>
						<div>
							<p className="text-sm text-foreground">거래처</p>
							<p className="text-2xl font-bold">150</p>
						</div>
					</div>
				</div>

				<div className="bg-card p-6 rounded-lg border border-border">
					<div className="flex items-center gap-4">
						<div className="p-3 bg-green-100 rounded-lg">
							<Package className="h-6 w-6 text-green-600" />
						</div>
						<div>
							<p className="text-sm text-foreground">제품</p>
							<p className="text-2xl font-bold">1,250</p>
						</div>
					</div>
				</div>

				<div className="bg-card p-6 rounded-lg border border-border">
					<div className="flex items-center gap-4">
						<div className="p-3 bg-orange-100 rounded-lg">
							<ShoppingCart className="h-6 w-6 text-orange-600" />
						</div>
						<div>
							<p className="text-sm text-foreground">주문</p>
							<p className="text-2xl font-bold">85</p>
						</div>
					</div>
				</div>

				<div className="bg-card p-6 rounded-lg border border-border">
					<div className="flex items-center gap-4">
						<div className="p-3 bg-purple-100 rounded-lg">
							<BarChart3 className="h-6 w-6 text-purple-600" />
						</div>
						<div>
							<p className="text-sm text-foreground">매출</p>
							<p className="text-2xl font-bold">₩ 125M</p>
						</div>
					</div>
				</div>
			</div>

			{/* Quick Actions */}
			<div className="bg-card p-6 rounded-lg border border-border">
				<h2 className="text-xl font-semibold mb-4">빠른 작업</h2>
				<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
					<RadixButton className="p-4 h-auto flex flex-col items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200">
						<Users className="h-8 w-8" />
						<span>거래처 관리</span>
					</RadixButton>

					<RadixButton className="p-4 h-auto flex flex-col items-center gap-2 bg-green-50 hover:bg-green-100 text-green-700 border border-green-200">
						<Package className="h-8 w-8" />
						<span>제품 관리</span>
					</RadixButton>

					<RadixButton className="p-4 h-auto flex flex-col items-center gap-2 bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200">
						<ShoppingCart className="h-8 w-8" />
						<span>주문 관리</span>
					</RadixButton>

					<RadixButton className="p-4 h-auto flex flex-col items-center gap-2 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200">
						<BarChart3 className="h-8 w-8" />
						<span>분석 리포트</span>
					</RadixButton>
				</div>
			</div>

			{/* Welcome Message */}
			<div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-lg text-white">
				<h2 className="text-2xl font-bold mb-2">
					ERP 시스템에 오신 것을 환영합니다!
				</h2>
				<p className="text-blue-100 mb-4">
					모든 비즈니스 프로세스를 효율적으로 관리하고 데이터 기반
					의사결정을 내리세요.
				</p>
				<RadixButton className="bg-white text-blue-600 hover:bg-blue-50">
					시작하기
				</RadixButton>
			</div>
		</div>
	);
};

export default Dashboard;
