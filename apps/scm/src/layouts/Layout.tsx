import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
	Home,
	TrendingUp,
	ShoppingCart,
	Package,
	Truck,
	Users,
	BarChart3,
	Link as LinkIcon,
	Settings,
	ChevronDown,
	ChevronRight,
	Menu,
	X,
} from 'lucide-react';

const Layout: React.FC = () => {
	const location = useLocation();
	const [sidebarOpen, setSidebarOpen] = useState(true);
	const [expandedGroups, setExpandedGroups] = useState<string[]>([
		'dashboard',
	]);

	const menuGroups = [
		{
			id: 'dashboard',
			name: '대시보드',
			icon: Home,
			items: [
				{ name: '외주 SCM 대시보드', href: '/', icon: Home },
				{
					name: '작업 현황 모니터링',
					href: '/dashboard/workload',
					icon: BarChart3,
				},
				{
					name: '긴급 알림',
					href: '/dashboard/alerts',
					icon: TrendingUp,
				},
				{ name: '외주 KPI', href: '/dashboard/kpi', icon: BarChart3 },
			],
		},
		{
			id: 'order',
			name: '주문 관리',
			icon: ShoppingCart,
			items: [
				{
					name: '주문 목록',
					href: '/order/list',
					icon: ShoppingCart,
				},
				{
					name: '주문 접수',
					href: '/order/receive',
					icon: ShoppingCart,
				},
				{
					name: '소재 확인',
					href: '/order/material-check',
					icon: Package,
				},
				{
					name: '작업 지시서 발행',
					href: '/order/work-order',
					icon: ShoppingCart,
				},
				{
					name: '주문 일정 관리',
					href: '/order/schedule',
					icon: TrendingUp,
				},
				{
					name: '진행 상황 추적',
					href: '/order/tracking',
					icon: BarChart3,
				},
			],
		},
		{
			id: 'process',
			name: '공정 관리',
			icon: Settings,
			items: [
				{
					name: '공정 진행 관리',
					href: '/process/management',
					icon: Settings,
				},
				{
					name: '실시간 모니터링',
					href: '/process/monitoring',
					icon: BarChart3,
				},
				{
					name: '공정 완료 보고',
					href: '/process/completion',
					icon: Settings,
				},
				{ name: '지연 관리', href: '/process/delay', icon: TrendingUp },
				{
					name: '재작업 관리',
					href: '/process/rework',
					icon: Settings,
				},
			],
		},
		{
			id: 'quality',
			name: '품질 검사 관리',
			icon: BarChart3,
			items: [
				{
					name: '인수 검사',
					href: '/quality/incoming',
					icon: BarChart3,
				},
				{
					name: '공정 중 검사',
					href: '/quality/in-process',
					icon: BarChart3,
				},
				{ name: '완료 검사', href: '/quality/final', icon: BarChart3 },
				{ name: '불량 처리', href: '/quality/defect', icon: BarChart3 },
				{
					name: '품질 성적서',
					href: '/quality/certificate',
					icon: BarChart3,
				},
				{
					name: '검사 기준 관리',
					href: '/quality/standards',
					icon: Settings,
				},
			],
		},
		{
			id: 'shipping',
			name: '출하 배송 관리',
			icon: Truck,
			items: [
				{
					name: '출하 준비',
					href: '/shipping/preparation',
					icon: Truck,
				},
				{ name: '배송 관리', href: '/shipping/delivery', icon: Truck },
				{ name: '직납 처리', href: '/shipping/direct', icon: Truck },
				{ name: '배송 추적', href: '/shipping/tracking', icon: Truck },
				{ name: '반품 처리', href: '/shipping/return', icon: Truck },
			],
		},
		{
			id: 'settlement',
			name: '정산 관리',
			icon: ShoppingCart,
			items: [
				{
					name: '거래명세서 발행',
					href: '/settlement/statement',
					icon: ShoppingCart,
				},
				{
					name: '가공비 정산',
					href: '/settlement/processing-cost',
					icon: ShoppingCart,
				},
				{
					name: '세금계산서 발행',
					href: '/settlement/tax-invoice',
					icon: ShoppingCart,
				},
				{
					name: '대금 결제',
					href: '/settlement/payment',
					icon: ShoppingCart,
				},
				{
					name: '정산 이력',
					href: '/settlement/history',
					icon: BarChart3,
				},
			],
		},
		{
			id: 'material',
			name: '소재/제품 관리',
			icon: Package,
			items: [
				{
					name: '소재 재고',
					href: '/material/inventory',
					icon: Package,
				},
				{
					name: '제품 확인',
					href: '/material/product-check',
					icon: Package,
				},
				{
					name: '소재 할당',
					href: '/material/allocation',
					icon: Package,
				},
				{
					name: '소재 부족 관리',
					href: '/material/shortage',
					icon: Package,
				},
				{
					name: '소재/제품 반납',
					href: '/material/return',
					icon: Package,
				},
			],
		},
		{
			id: 'mes_integration',
			name: 'MES 연동',
			icon: LinkIcon,
			items: [
				{
					name: 'MES 데이터 동기화',
					href: '/mes/sync',
					icon: LinkIcon,
				},
				{ name: '주문 연동', href: '/mes/order', icon: LinkIcon },
				{
					name: '진행 상황 피드백',
					href: '/mes/progress',
					icon: LinkIcon,
				},
				{
					name: '품질 정보 연동',
					href: '/mes/quality',
					icon: LinkIcon,
				},
				{
					name: '완료 보고 연동',
					href: '/mes/completion',
					icon: LinkIcon,
				},
			],
		},
		{
			id: 'partner',
			name: '협력업체 관리',
			icon: Users,
			items: [
				{
					name: '협력업체 관리',
					href: '/partner/management',
					icon: Users,
				},
				{
					name: '협력업체 평가',
					href: '/partner/evaluation',
					icon: Users,
				},
				{
					name: '가공 계약 관리',
					href: '/partner/contract',
					icon: Users,
				},
				{
					name: '가공 성과 관리',
					href: '/partner/performance',
					icon: Users,
				},
				{ name: '협력업체 포털', href: '/partner/portal', icon: Users },
				{
					name: '협력업체 인증',
					href: '/partner/certification',
					icon: Users,
				},
			],
		},
		{
			id: 'analytics',
			name: '분석 및 리포트',
			icon: BarChart3,
			items: [
				{
					name: '주문 현황 분석',
					href: '/analytics/order',
					icon: BarChart3,
				},
				{
					name: '품질 분석',
					href: '/analytics/quality',
					icon: BarChart3,
				},
				{
					name: '가공비 분석',
					href: '/analytics/cost',
					icon: BarChart3,
				},
				{
					name: '납기 분석',
					href: '/analytics/delivery',
					icon: BarChart3,
				},
				{
					name: '협력업체 분석',
					href: '/analytics/partner',
					icon: BarChart3,
				},
				{
					name: '정기 리포트',
					href: '/analytics/reports',
					icon: BarChart3,
				},
			],
		},
	];

	const toggleGroup = (groupId: string) => {
		setExpandedGroups((prev) =>
			prev.includes(groupId)
				? prev.filter((id) => id !== groupId)
				: [...prev, groupId]
		);
	};

	return (
		<div className="min-h-screen bg-background flex">
			{/* Sidebar */}
			<aside
				className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-card border-r border-border transition-all duration-300 flex flex-col`}
			>
				{/* Header */}
				<div className="h-16 flex items-center justify-between px-4 border-b border-border">
					{sidebarOpen && (
						<h1 className="text-lg font-semibold text-foreground">
							SCM System
						</h1>
					)}
					<button
						onClick={() => setSidebarOpen(!sidebarOpen)}
						className="p-2 rounded-md hover:bg-muted"
					>
						{sidebarOpen ? <X size={16} /> : <Menu size={16} />}
					</button>
				</div>

				{/* Navigation */}
				<nav className="flex-1 overflow-y-auto py-4">
					{menuGroups.map((group) => {
						const GroupIcon = group.icon;
						const isExpanded = expandedGroups.includes(group.id);

						return (
							<div key={group.id} className="mb-2">
								{/* Group Header */}
								<button
									onClick={() => toggleGroup(group.id)}
									className="w-full flex items-center justify-between px-4 py-2 text-sm font-medium text-foreground hover:text-foreground hover:bg-muted transition-colors"
								>
									<div className="flex items-center gap-3">
										<GroupIcon size={16} />
										{sidebarOpen && (
											<span>{group.name}</span>
										)}
									</div>
									{sidebarOpen &&
										(isExpanded ? (
											<ChevronDown size={16} />
										) : (
											<ChevronRight size={16} />
										))}
								</button>

								{/* Group Items */}
								{isExpanded && sidebarOpen && (
									<div className="ml-4 space-y-1">
										{group.items.map((item) => {
											const ItemIcon = item.icon;
											const isActive =
												location.pathname === item.href;

											return (
												<Link
													key={item.href}
													to={item.href}
													className={`flex items-center gap-3 px-4 py-2 text-sm rounded-md transition-colors ${
														isActive
															? 'bg-primary text-primary-foreground'
															: 'text-foreground hover:text-foreground hover:bg-muted'
													}`}
												>
													<ItemIcon size={14} />
													<span>{item.name}</span>
												</Link>
											);
										})}
									</div>
								)}
							</div>
						);
					})}
				</nav>

				{/* Settings */}
				<div className="border-t border-border p-4">
					<Link
						to="/settings"
						className="flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
					>
						<Settings size={16} />
						{sidebarOpen && <span>시스템 설정</span>}
					</Link>
				</div>
			</aside>

			{/* Main Content */}
			<div className="flex-1 flex flex-col">
				{/* Top Header */}
				<header className="h-16 bg-card border-b border-border flex items-center justify-between px-6">
					<div className="flex items-center gap-4">
						<h2 className="text-lg font-semibold text-foreground">
							Supply Chain Management
						</h2>
					</div>
					<div className="flex items-center gap-4">
						<span className="text-sm text-foreground">
							MES 연동 상태:{' '}
							<span className="text-green-600">정상</span>
						</span>
					</div>
				</header>

				{/* Page Content */}
				<main className="flex-1 p-6">
					<Outlet />
				</main>
			</div>
		</div>
	);
};

export default Layout;
