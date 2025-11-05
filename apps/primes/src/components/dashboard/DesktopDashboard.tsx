import React from 'react';
import { ShoppingCart, Package, Cog } from 'lucide-react';
import { EchartComponent } from '@repo/echart/components';
import {
	createDeliveryRateChartOption,
	createDeliveryDeadlineChartOption,
} from '../charts/DeliveryRateChart';
import { createSalesLineChartOption } from '../charts/SalesLineChart';
import {
	createEquipmentEfficiencyOption,
	createEquipmentLineChartOption,
	createEquipmentProgressBarOption,
	createEquipmentPieChartOption,
} from '../charts/EquipmentEfficiencyChart';
import { useTrendIcon } from '../../hooks/useTrendIcon';
import trendUp1 from '../../pages/img/trend-up-01.png';
import trendDown1 from '../../pages/img/trend-down-01.png';

interface DesktopDashboardProps {
	data: any;
}

const DesktopDashboard: React.FC<DesktopDashboardProps> = ({ data }) => {
	// Use trend icon hooks with dynamic data
	const { iconSrc: salesDeliveryIcon, iconColor: salesDeliveryColor } =
		useTrendIcon({ percentage: data.sales.deliveryRate });
	const { iconSrc: salesDeadlineIcon, iconColor: salesDeadlineColor } =
		useTrendIcon({ percentage: data.sales.deadlineRate });
	const { iconSrc: purchaseDeliveryIcon, iconColor: purchaseDeliveryColor } =
		useTrendIcon({ percentage: data.purchase.deliveryRate });
	const { iconSrc: purchaseDeadlineIcon, iconColor: purchaseDeadlineColor } =
		useTrendIcon({ percentage: data.purchase.deadlineRate });

	return (
		<div className="w-full h-full overflow-auto">
			<div className="w-full mx-auto px-4 py-4 space-y-4 h-full">
				{/* Row 1 - Sales and Purchase sections aligned horizontally */}
				<div className="space-y-3">
					{/* Sales and Purchase Headers - Aligned in same row */}
					<div className="flex items-center flex-col xl:flex-row gap-4">
						<div className="flex-1 w-full">
							{/* Sales Header */}
							<div className="h-12 bg-white border border-gray-200 rounded-lg shadow-sm px-4 flex items-center justify-between mb-4">
								<div className="flex items-center gap-2">
									<ShoppingCart className="text-purple-600 w-6 h-6" />
									<span className="text-lg font-semibold text-gray-900">
										영업
									</span>
								</div>
								<button className="text-gray-400 hover:text-gray-600 transition">
									<svg
										className="w-5 h-5"
										fill="currentColor"
										viewBox="0 0 20 20"
									>
										<path d="M10 3a1.5 1.5 0 100 3 1.5 1.5 0 000-3zM10 8.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3zM10 14a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" />
									</svg>
								</button>
							</div>

							{/* Sales Section */}
							<div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-4">
								{/* Left column - Two small cards stacked vertically */}
								<div className="flex flex-col gap-4">
									{/* Small Card 1 - Delivery Rate */}
									<div className="h-48 bg-white border border-gray-200 rounded-lg shadow-sm p-4">
										<p
											className="text-lg font-semibold text-gray-700 mb-2"
											style={{
												fontFamily:
													'var(--font-family-body)',
												fontWeight: 600,
												lineHeight:
													'var(--line-height-text-lg)',
												letterSpacing: '0%',
											}}
										>
											7월 납품율
										</p>
										<div className="flex items-center justify-between h-full">
											<div className="relative w-45 h-45">
												<EchartComponent
													options={createDeliveryRateChartOption(
														data.sales.deliveryRate
													)}
													styles={{
														width: '180px',
														height: '180px',
													}}
												/>
												<div className="absolute inset-0 flex items-center justify-center">
													<span className="text-3xl font-bold text-gray-900">
														{
															data.sales
																.deliveryRate
														}
														%
													</span>
												</div>
											</div>
											<div className="flex items-center gap-1 self-start mt-2 -ml-1">
												<img
													src={salesDeliveryIcon}
													alt="trend-icon"
													className="w-4 h-4"
												/>
												<span
													className={`text-sm font-medium ${salesDeliveryColor}`}
												>
													10%
												</span>
											</div>
										</div>
									</div>

									{/* Small Card 2 - Deadline Rate */}
									<div className="h-48 bg-white border border-gray-200 rounded-lg shadow-sm p-4">
										<p
											className="text-lg font-semibold text-gray-700 mb-2"
											style={{
												fontFamily:
													'var(--font-family-body)',
												fontWeight: 600,
												lineHeight:
													'var(--line-height-text-lg)',
												letterSpacing: '0%',
											}}
										>
											7월 납기율
										</p>
										<div className="flex items-center justify-between h-full">
											<div className="relative w-45 h-45">
												<EchartComponent
													options={createDeliveryDeadlineChartOption(
														data.sales.deadlineRate
													)}
													styles={{
														width: '180px',
														height: '180px',
													}}
												/>
												<div className="absolute inset-0 flex items-center justify-center">
													<span className="text-3xl font-bold text-gray-900">
														{
															data.sales
																.deadlineRate
														}
														%
													</span>
												</div>
											</div>
											<div className="flex items-center gap-1 self-start mt-2 -ml-1">
												<img
													src={salesDeadlineIcon}
													alt="trend-icon"
													className="w-4 h-4"
												/>
												<span
													className={`text-sm font-medium ${salesDeadlineColor}`}
												>
													10%
												</span>
											</div>
										</div>
									</div>
								</div>
								{/* Right column - Large card spanning height of two small cards */}
								<div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 lg:h-[calc(2*12rem+1rem)]">
									{/* KPI Cards Grid */}
									<div className="grid grid-cols-2 gap-4 mb-4">
										<div className="text-center md:text-left">
											<p className="text-base text-gray-600 mb-1">
												월 매출액 목표
											</p>
											<div className="flex items-center justify-center md:justify-start gap-1">
												<p className="text-2xl font-bold text-gray-900">
													{
														data.sales.kpis
															.monthlyTarget.value
													}
												</p>
												<img
													src={
														data.sales.kpis
															.monthlyTarget
															.trend >= 0
															? trendUp1
															: trendDown1
													}
													alt="trend"
													className="w-3 h-3"
												/>
												<span
													className={`text-xs font-medium ${data.sales.kpis.monthlyTarget.trend >= 0 ? 'text-green-600' : 'text-red-600'}`}
												>
													{Math.abs(
														data.sales.kpis
															.monthlyTarget.trend
													)}
													%
												</span>
											</div>
										</div>
										<div className="text-center md:text-left">
											<p className="text-base text-gray-600 mb-1">
												연 매출액 목표
											</p>
											<div className="flex items-center justify-center md:justify-start gap-1">
												<p className="text-2xl font-bold text-gray-900">
													{
														data.sales.kpis
															.yearlyTarget.value
													}
												</p>
												<img
													src={
														data.sales.kpis
															.yearlyTarget
															.trend >= 0
															? trendUp1
															: trendDown1
													}
													alt="trend"
													className="w-3 h-3"
												/>
												<span
													className={`text-xs font-medium ${data.sales.kpis.yearlyTarget.trend >= 0 ? 'text-green-600' : 'text-red-600'}`}
												>
													{Math.abs(
														data.sales.kpis
															.yearlyTarget.trend
													)}
													%
												</span>
											</div>
										</div>
										<div className="text-center md:text-left">
											<p className="text-base text-gray-600 mb-1">
												월 매출액 실적
											</p>
											<div className="flex items-center justify-center md:justify-start gap-1">
												<p className="text-2xl font-bold text-gray-900">
													{
														data.sales.kpis
															.monthlyActual.value
													}
												</p>
												<img
													src={
														data.sales.kpis
															.monthlyActual
															.trend >= 0
															? trendUp1
															: trendDown1
													}
													alt="trend"
													className="w-3 h-3"
												/>
												<span
													className={`text-xs font-medium ${data.sales.kpis.monthlyActual.trend >= 0 ? 'text-green-600' : 'text-red-600'}`}
												>
													{Math.abs(
														data.sales.kpis
															.monthlyActual.trend
													)}
													%
												</span>
											</div>
										</div>
										<div className="text-center md:text-left">
											<p className="text-base text-gray-600 mb-1">
												연 매출액 실적
											</p>
											<div className="flex items-center justify-center md:justify-start gap-1">
												<p className="text-2xl font-bold text-gray-900">
													{
														data.sales.kpis
															.yearlyActual.value
													}
												</p>
												<img
													src={
														data.sales.kpis
															.yearlyActual
															.trend >= 0
															? trendUp1
															: trendDown1
													}
													alt="trend"
													className="w-3 h-3"
												/>
												<span
													className={`text-xs font-medium ${data.sales.kpis.yearlyActual.trend >= 0 ? 'text-green-600' : 'text-red-600'}`}
												>
													{Math.abs(
														data.sales.kpis
															.yearlyActual.trend
													)}
													%
												</span>
											</div>
										</div>
									</div>

									{/* Line Chart */}
									<div className="w-full h-32 mt-4">
										<EchartComponent
											options={createSalesLineChartOption(
												data.sales.lineChart
											)}
											styles={{
												width: '100%',
												height: '128px',
												marginTop: '115px',
											}}
										/>
									</div>
								</div>
							</div>
						</div>

						<div className="flex-1 w-full">
							{/* Purchase Header */}
							<div className="h-12 bg-white border border-gray-200 rounded-lg shadow-sm px-4 flex items-center justify-between mb-4">
								<div className="flex items-center gap-2">
									<Package className="text-purple-600 w-6 h-6" />
									<span className="text-lg font-semibold text-gray-900">
										구매
									</span>
								</div>
								<button className="text-gray-400 hover:text-gray-600 transition">
									<svg
										className="w-5 h-5"
										fill="currentColor"
										viewBox="0 0 20 20"
									>
										<path d="M10 3a1.5 1.5 0 100 3 1.5 1.5 0 000-3zM10 8.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3zM10 14a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" />
									</svg>
								</button>
							</div>

							{/* Purchase Section */}
							<div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-4">
								{/* Left column - Two small cards stacked vertically */}
								<div className="flex flex-col gap-4">
									{/* Small Card 1 - Delivery Rate */}
									<div className="h-48 bg-white border border-gray-200 rounded-lg shadow-sm p-4">
										<p
											className="text-lg font-semibold text-gray-700 mb-2"
											style={{
												fontFamily:
													'var(--font-family-body)',
												fontWeight: 600,
												lineHeight:
													'var(--line-height-text-lg)',
												letterSpacing: '0%',
											}}
										>
											7월 납품율
										</p>
										<div className="flex items-center justify-between h-full">
											<div className="relative w-45 h-45">
												<EchartComponent
													options={createDeliveryRateChartOption(
														data.purchase
															.deliveryRate
													)}
													styles={{
														width: '180px',
														height: '180px',
													}}
												/>
												<div className="absolute inset-0 flex items-center justify-center">
													<span className="text-3xl font-bold text-gray-900">
														{
															data.purchase
																.deliveryRate
														}
														%
													</span>
												</div>
											</div>
											<div className="flex items-center gap-1 self-start mt-2 -ml-1">
												<img
													src={purchaseDeliveryIcon}
													alt="trend-icon"
													className="w-4 h-4"
												/>
												<span
													className={`text-sm font-medium ${purchaseDeliveryColor}`}
												>
													10%
												</span>
											</div>
										</div>
									</div>

									{/* Small Card 2 - Deadline Rate */}
									<div className="h-48 bg-white border border-gray-200 rounded-lg shadow-sm p-4">
										<p
											className="text-lg font-semibold text-gray-700 mb-2"
											style={{
												fontFamily:
													'var(--font-family-body)',
												fontWeight: 600,
												lineHeight:
													'var(--line-height-text-lg)',
												letterSpacing: '0%',
											}}
										>
											7월 납기율
										</p>
										<div className="flex items-center justify-between h-full">
											<div className="relative w-45 h-45">
												<EchartComponent
													options={createDeliveryDeadlineChartOption(
														data.purchase
															.deadlineRate
													)}
													styles={{
														width: '180px',
														height: '180px',
													}}
												/>
												<div className="absolute inset-0 flex items-center justify-center">
													<span className="text-3xl font-bold text-gray-900">
														{
															data.purchase
																.deadlineRate
														}
														%
													</span>
												</div>
											</div>
											<div className="flex items-center gap-1 self-start mt-2 -ml-1">
												<img
													src={purchaseDeadlineIcon}
													alt="trend-icon"
													className="w-4 h-4"
												/>
												<span
													className={`text-sm font-medium ${purchaseDeadlineColor}`}
												>
													10%
												</span>
											</div>
										</div>
									</div>
								</div>

								{/* Right column - Large card spanning height of two small cards */}
								<div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 lg:h-[calc(2*12rem+1rem)]">
									{/* KPI Cards Grid */}
									<div className="grid grid-cols-2 gap-4 mb-4">
										<div className="text-center md:text-left">
											<p className="text-base text-gray-600 mb-1">
												월 매출액 목표
											</p>
											<div className="flex items-center justify-center md:justify-start gap-1">
												<p className="text-2xl font-bold text-gray-900">
													{
														data.purchase.kpis
															.monthlyTarget.value
													}
												</p>
												<img
													src={
														data.purchase.kpis
															.monthlyTarget
															.trend >= 0
															? trendUp1
															: trendDown1
													}
													alt="trend"
													className="w-3 h-3"
												/>
												<span
													className={`text-xs font-medium ${data.purchase.kpis.monthlyTarget.trend >= 0 ? 'text-green-600' : 'text-red-600'}`}
												>
													{Math.abs(
														data.purchase.kpis
															.monthlyTarget.trend
													)}
													%
												</span>
											</div>
										</div>
										<div className="text-center md:text-left">
											<p className="text-base text-gray-600 mb-1">
												연 매출액 목표
											</p>
											<div className="flex items-center justify-center md:justify-start gap-1">
												<p className="text-2xl font-bold text-gray-900">
													{
														data.purchase.kpis
															.yearlyTarget.value
													}
												</p>
												<img
													src={
														data.purchase.kpis
															.yearlyTarget
															.trend >= 0
															? trendUp1
															: trendDown1
													}
													alt="trend"
													className="w-3 h-3"
												/>
												<span
													className={`text-xs font-medium ${data.purchase.kpis.yearlyTarget.trend >= 0 ? 'text-green-600' : 'text-red-600'}`}
												>
													{Math.abs(
														data.purchase.kpis
															.yearlyTarget.trend
													)}
													%
												</span>
											</div>
										</div>
										<div className="text-center md:text-left">
											<p className="text-base text-gray-600 mb-1">
												월 매출액 실적
											</p>
											<div className="flex items-center justify-center md:justify-start gap-1">
												<p className="text-2xl font-bold text-gray-900">
													{
														data.purchase.kpis
															.monthlyActual.value
													}
												</p>
												<img
													src={
														data.purchase.kpis
															.monthlyActual
															.trend >= 0
															? trendUp1
															: trendDown1
													}
													alt="trend"
													className="w-3 h-3"
												/>
												<span
													className={`text-xs font-medium ${data.purchase.kpis.monthlyActual.trend >= 0 ? 'text-green-600' : 'text-red-600'}`}
												>
													{Math.abs(
														data.purchase.kpis
															.monthlyActual.trend
													)}
													%
												</span>
											</div>
										</div>
										<div className="text-center md:text-left">
											<p className="text-base text-gray-600 mb-1">
												연 매출액 실적
											</p>
											<div className="flex items-center justify-center md:justify-start gap-1">
												<p className="text-2xl font-bold text-gray-900">
													{
														data.purchase.kpis
															.yearlyActual.value
													}
												</p>
												<img
													src={
														data.purchase.kpis
															.yearlyActual
															.trend >= 0
															? trendUp1
															: trendDown1
													}
													alt="trend"
													className="w-3 h-3"
												/>
												<span
													className={`text-xs font-medium ${data.purchase.kpis.yearlyActual.trend >= 0 ? 'text-green-600' : 'text-red-600'}`}
												>
													{Math.abs(
														data.purchase.kpis
															.yearlyActual.trend
													)}
													%
												</span>
											</div>
										</div>
									</div>

									{/* Line Chart */}
									<div className="w-full h-32 mt-3">
										<EchartComponent
											options={createSalesLineChartOption(
												data.purchase.lineChart
											)}
											styles={{
												width: '100%',
												height: '128px',
												marginTop: '115px',
											}}
										/>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Row 2 - Equipment Section */}
				<div className="space-y-3">
					{/* Equipment Header */}
					<div className="h-12 bg-white border border-gray-200 rounded-lg shadow-sm px-4 flex items-center justify-between">
						<div className="flex items-center gap-2">
							<Cog className="text-purple-600 w-6 h-6" />
							<span className="text-lg font-semibold text-gray-900">
								설비
							</span>
						</div>
						<button className="text-gray-400 hover:text-gray-600 transition">
							<svg
								className="w-5 h-5"
								fill="currentColor"
								viewBox="0 0 20 20"
							>
								<path d="M10 3a1.5 1.5 0 100 3 1.5 1.5 0 000-3zM10 8.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3zM10 14a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" />
							</svg>
						</button>
					</div>

					{/* Equipment Cards Grid */}
					<div className="flex flex-col xl:flex-row gap-4">
						{/* Equipment Efficiency Card */}
						<div
							className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 flex-1 w-full"
							// style={{ height: '338px' }}
						>
							<h3 className="text-lg font-bold text-gray-900 mb-4">
								설비 종합효율
							</h3>

							{/* Three Efficiency Circles */}
							<div className="flex justify-center gap-4 mb-20">
								<div className="flex flex-col items-center">
									<div className="relative w-30 h-30">
										<EchartComponent
											options={createEquipmentEfficiencyOption(
												data.equipment.efficiency1,
												'50%'
											)}
											styles={{
												width: '80px',
												height: '80px',
											}}
										/>
										<div className="absolute inset-0 flex items-center justify-center">
											<span className="text-sm font-bold text-gray-900">
												{data.equipment.efficiency1}%
											</span>
										</div>
									</div>
									<p className="text-xs text-gray-700 mt-1">
										설비 종합효율
									</p>
								</div>
								<div className="flex flex-col items-center">
									<div className="relative w-20 h-20">
										<EchartComponent
											options={createEquipmentEfficiencyOption(
												data.equipment.efficiency2,
												'50%'
											)}
											styles={{
												width: '80px',
												height: '80px',
											}}
										/>
										<div className="absolute inset-0 flex items-center justify-center">
											<span className="text-sm font-bold text-gray-900">
												{data.equipment.efficiency2}%
											</span>
										</div>
									</div>
									<p className="text-xs text-gray-700 mt-1">
										설비 종합효율
									</p>
								</div>
								<div className="flex flex-col items-center">
									<div className="relative w-20 h-20">
										<EchartComponent
											options={createEquipmentEfficiencyOption(
												data.equipment.efficiency3,
												'50%'
											)}
											styles={{
												width: '80px',
												height: '80px',
											}}
										/>
										<div className="absolute inset-0 flex items-center justify-center">
											<span className="text-sm font-bold text-gray-900">
												{data.equipment.efficiency3}%
											</span>
										</div>
									</div>
									<p className="text-xs text-gray-700 mt-1">
										설비 종합효율
									</p>
								</div>
							</div>

							{/* Progress Bar */}
							<div className="space-y-2">
								<div className="flex items-center justify-between">
									<div className="flex flex-col">
										<span className="text-xs text-gray-600">
											일 실적 수량
										</span>
										<span className="text-lg font-bold text-gray-900">
											{data.equipment.actualQuantity.toLocaleString()}
										</span>
									</div>
									<div className="flex items-center">
										<span className="text-lg font-bold text-gray-900 mx-2">
											/
										</span>
										<div className="flex flex-col items-end">
											<span className="text-xs text-gray-600">
												일 계획 수량
											</span>
											<span className="text-lg font-bold text-gray-900">
												{data.equipment.plannedQuantity.toLocaleString()}
											</span>
										</div>
									</div>
								</div>
								<div className="w-full h-2">
									<EchartComponent
										options={createEquipmentProgressBarOption(
											Math.round(
												(data.equipment.actualQuantity /
													data.equipment
														.plannedQuantity) *
													100
											)
										)}
										styles={{
											width: '100%',
											height: '8px',
										}}
									/>
								</div>
							</div>
						</div>

						{/* Equipment Classification Card */}
						<div
							className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 flex-1 w-full"
							// style={{ height: '338px' }}
						>
							<h3 className="text-lg font-bold text-gray-900 mb-4">
								설비 종합효율
							</h3>

							{/* Pie Chart and Grid */}
							<div className="flex flex-col lg:flex-row items-center gap-4">
								{/* Pie Chart */}
								<div className="flex-1 flex justify-center">
									<EchartComponent
										options={createEquipmentPieChartOption(
											data.equipment.classification
										)}
										styles={{
											width: '250px',
											height: '250px',
										}}
									/>
								</div>

								{/* Grid Layout */}
								<div className="flex-1">
									<div className="grid grid-cols-3 gap-4">
										{data.equipment.classification.map(
											(item: any, index: number) => {
												const colors = [
													'bg-blue-400',
													'bg-purple-400',
													'bg-pink-400',
													'bg-green-400',
													'bg-orange-400',
													'bg-indigo-500',
												];
												return (
													<div
														key={index}
														className="flex items-start gap-2"
													>
														<div
															className={`w-3 h-3 rounded-full mt-1 ${colors[index] || 'bg-gray-400'}`}
														></div>
														<div className="flex flex-col">
															<span className="text-sm text-gray-600">
																{item.name}
															</span>
															<span className="text-lg font-bold text-gray-900">
																{item.value}건
															</span>
														</div>
													</div>
												);
											}
										)}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default DesktopDashboard;
