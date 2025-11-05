import React from 'react';
import { ShoppingCart, Package, Cog } from 'lucide-react';
import { EchartComponent } from '@repo/echart/components';
import { createDeliveryRateChartOption, createDeliveryDeadlineChartOption } from '../charts/DeliveryRateChart';
import { createSalesLineChartOption } from '../charts/SalesLineChart';
import { createEquipmentEfficiencyOption, createEquipmentProgressBarOption, createEquipmentPieChartOption } from '../charts/EquipmentEfficiencyChart';
import { useTrendIcon } from '../../hooks/useTrendIcon';
import trendUp1 from '../../pages/img/trend-up-01.png';
import trendDown1 from '../../pages/img/trend-down-01.png';

interface MobileDashboardProps {
  data: any;
}

const MobileDashboard: React.FC<MobileDashboardProps> = ({ data }) => {
  // Use trend icon hooks with dynamic data
  const { iconSrc: salesDeliveryIcon, iconColor: salesDeliveryColor } = useTrendIcon({ percentage: data.sales.deliveryRate });
  const { iconSrc: salesDeadlineIcon, iconColor: salesDeadlineColor } = useTrendIcon({ percentage: data.sales.deadlineRate });
  const { iconSrc: purchaseDeliveryIcon, iconColor: purchaseDeliveryColor } = useTrendIcon({ percentage: data.purchase.deliveryRate });
  const { iconSrc: purchaseDeadlineIcon, iconColor: purchaseDeadlineColor } = useTrendIcon({ percentage: data.purchase.deadlineRate });

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Mobile Header */}
      {/* <div className="mb-6">
        <h1 className="text-gray-500 text-sm mb-2">Mobile 홈 대시보드</h1>
      </div> */}

      {/* Sales Section */}
      <div className="mb-6">
        {/* Sales Header */}
        <div className="flex items-center justify-between bg-white rounded-lg p-4 mb-4 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <ShoppingCart className="text-purple-600 w-5 h-5" />
            </div>
            <span className="text-lg font-semibold text-gray-900">영업</span>
          </div>
          <button className="text-gray-400">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 3a1.5 1.5 0 100 3 1.5 1.5 0 000-3zM10 8.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3zM10 14a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" />
            </svg>
          </button>
        </div>

        {/* Sales Cards */}
        <div className="space-y-4">
          {/* Delivery Rate Card */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <p className="text-sm font-medium text-gray-700 mb-3">7월 납품율</p>
            <div className="flex items-center justify-between">
              <div className="relative w-32 h-32">
                <EchartComponent 
                  options={createDeliveryRateChartOption(data.sales.deliveryRate)} 
                  styles={{ width: '128px', height: '128px' }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-bold text-gray-900">{data.sales.deliveryRate}%</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <img src={salesDeliveryIcon} alt="trend-icon" className="w-4 h-4" />
                <span className={`text-sm font-medium ${salesDeliveryColor}`}>10%</span>
              </div>
            </div>
          </div>

          {/* Deadline Rate Card */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <p className="text-sm font-medium text-gray-700 mb-3">7월 납기율</p>
            <div className="flex items-center justify-between">
              <div className="relative w-32 h-32">
                <EchartComponent 
                  options={createDeliveryDeadlineChartOption(data.sales.deadlineRate)} 
                  styles={{ width: '128px', height: '128px' }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-bold text-gray-900">{data.sales.deadlineRate}%</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <img src={salesDeadlineIcon} alt="trend-icon" className="w-4 h-4" />
                <span className={`text-sm font-medium ${salesDeadlineColor}`}>10%</span>
              </div>
            </div>
          </div>

          {/* Sales Performance Card */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            {/* KPI Grid */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center">
                <p className="text-xs text-gray-600 mb-1">월 매출액 목표</p>
                <div className="flex items-center justify-center gap-1">
                  <p className="text-lg font-bold text-gray-900">{data.sales.kpis.monthlyTarget.value}</p>
                  <img src={data.sales.kpis.monthlyTarget.trend >= 0 ? trendUp1 : trendDown1} alt="trend" className="w-3 h-3" />
                  <span className={`text-xs font-medium ${data.sales.kpis.monthlyTarget.trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {Math.abs(data.sales.kpis.monthlyTarget.trend)}%
                  </span>
                </div>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-600 mb-1">연 매출액 목표</p>
                <div className="flex items-center justify-center gap-1">
                  <p className="text-lg font-bold text-gray-900">{data.sales.kpis.yearlyTarget.value}</p>
                  <img src={data.sales.kpis.yearlyTarget.trend >= 0 ? trendUp1 : trendDown1} alt="trend" className="w-3 h-3" />
                  <span className={`text-xs font-medium ${data.sales.kpis.yearlyTarget.trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {Math.abs(data.sales.kpis.yearlyTarget.trend)}%
                  </span>
                </div>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-600 mb-1">월 매출액 실적</p>
                <div className="flex items-center justify-center gap-1">
                  <p className="text-lg font-bold text-gray-900">{data.sales.kpis.monthlyActual.value}</p>
                  <img src={data.sales.kpis.monthlyActual.trend >= 0 ? trendUp1 : trendDown1} alt="trend" className="w-3 h-3" />
                  <span className={`text-xs font-medium ${data.sales.kpis.monthlyActual.trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {Math.abs(data.sales.kpis.monthlyActual.trend)}%
                  </span>
                </div>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-600 mb-1">연 매출액 실적</p>
                <div className="flex items-center justify-center gap-1">
                  <p className="text-lg font-bold text-gray-900">{data.sales.kpis.yearlyActual.value}</p>
                  <img src={data.sales.kpis.yearlyActual.trend >= 0 ? trendUp1 : trendDown1} alt="trend" className="w-3 h-3" />
                  <span className={`text-xs font-medium ${data.sales.kpis.yearlyActual.trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {Math.abs(data.sales.kpis.yearlyActual.trend)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Line Chart */}
            <div className="w-full h-32">
              <EchartComponent 
                options={createSalesLineChartOption(data.sales.lineChart)} 
                styles={{ width: '100%', height: '128px' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Purchase Section */}
      <div className="mb-6">
        {/* Purchase Header */}
        <div className="flex items-center justify-between bg-white rounded-lg p-4 mb-4 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <Package className="text-purple-600 w-5 h-5" />
            </div>
            <span className="text-lg font-semibold text-gray-900">구매</span>
          </div>
          <button className="text-gray-400">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 3a1.5 1.5 0 100 3 1.5 1.5 0 000-3zM10 8.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3zM10 14a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" />
            </svg>
          </button>
        </div>

        

        {/* Purchase Cards */}
        <div className="space-y-4">
          {/* Delivery Rate Card */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <p className="text-sm font-medium text-gray-700 mb-3">7월 납품율</p>
            <div className="flex items-center justify-between">
              <div className="relative w-32 h-32">
                <EchartComponent 
                  options={createDeliveryRateChartOption(data.purchase.deliveryRate)} 
                  styles={{ width: '128px', height: '128px' }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-bold text-gray-900">{data.purchase.deliveryRate}%</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <img src={purchaseDeliveryIcon} alt="trend-icon" className="w-4 h-4" />
                <span className={`text-sm font-medium ${purchaseDeliveryColor}`}>10%</span>
              </div>
            </div>
          </div>

          

          {/* Deadline Rate Card */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <p className="text-sm font-medium text-gray-700 mb-3">7월 납기율</p>
            <div className="flex items-center justify-between">
              <div className="relative w-32 h-32">
                <EchartComponent 
                  options={createDeliveryDeadlineChartOption(data.purchase.deadlineRate)} 
                  styles={{ width: '128px', height: '128px' }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-bold text-gray-900">{data.purchase.deadlineRate}%</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <img src={purchaseDeadlineIcon} alt="trend-icon" className="w-4 h-4" />
                <span className={`text-sm font-medium ${purchaseDeadlineColor}`}>10%</span>
              </div>
            </div>
          </div>

          {/* Purchase Performance Card */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            {/* KPI Grid */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center">
                <p className="text-xs text-gray-600 mb-1">월 매출액 목표</p>
                <div className="flex items-center justify-center gap-1">
                  <p className="text-lg font-bold text-gray-900">{data.purchase.kpis.monthlyTarget.value}</p>
                  <img src={data.purchase.kpis.monthlyTarget.trend >= 0 ? trendUp1 : trendDown1} alt="trend" className="w-3 h-3" />
                  <span className={`text-xs font-medium ${data.purchase.kpis.monthlyTarget.trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {Math.abs(data.purchase.kpis.monthlyTarget.trend)}%
                  </span>
                </div>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-600 mb-1">연 매출액 목표</p>
                <div className="flex items-center justify-center gap-1">
                  <p className="text-lg font-bold text-gray-900">{data.purchase.kpis.yearlyTarget.value}</p>
                  <img src={data.purchase.kpis.yearlyTarget.trend >= 0 ? trendUp1 : trendDown1} alt="trend" className="w-3 h-3" />
                  <span className={`text-xs font-medium ${data.purchase.kpis.yearlyTarget.trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {Math.abs(data.purchase.kpis.yearlyTarget.trend)}%
                  </span>
                </div>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-600 mb-1">월 매출액 실적</p>
                <div className="flex items-center justify-center gap-1">
                  <p className="text-lg font-bold text-gray-900">{data.purchase.kpis.monthlyActual.value}</p>
                  <img src={data.purchase.kpis.monthlyActual.trend >= 0 ? trendUp1 : trendDown1} alt="trend" className="w-3 h-3" />
                  <span className={`text-xs font-medium ${data.purchase.kpis.monthlyActual.trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {Math.abs(data.purchase.kpis.monthlyActual.trend)}%
                  </span>
                </div>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-600 mb-1">연 매출액 실적</p>
                <div className="flex items-center justify-center gap-1">
                  <p className="text-lg font-bold text-gray-900">{data.purchase.kpis.yearlyActual.value}</p>
                  <img src={data.purchase.kpis.yearlyActual.trend >= 0 ? trendUp1 : trendDown1} alt="trend" className="w-3 h-3" />
                  <span className={`text-xs font-medium ${data.purchase.kpis.yearlyActual.trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {Math.abs(data.purchase.kpis.yearlyActual.trend)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Line Chart */}
            <div className="w-full h-32">
              <EchartComponent 
                options={createSalesLineChartOption(data.purchase.lineChart)} 
                styles={{ width: '100%', height: '128px' }}
              />
            </div>
          </div>
        </div>
      </div>

      

      

      {/* Equipment Section */}
      <div className="mb-6">
        {/* Equipment Header */}
        <div className="flex items-center justify-between bg-white rounded-lg p-4 mb-4 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <Cog className="text-purple-600 w-5 h-5" />
            </div>
            <span className="text-lg font-semibold text-gray-900">설비</span>
          </div>
          <button className="text-gray-400">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 3a1.5 1.5 0 100 3 1.5 1.5 0 000-3zM10 8.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3zM10 14a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" />
            </svg>
          </button>
        </div>

        

        

        {/* Equipment Cards */}
        <div className="space-y-4">
          {/* Equipment Efficiency Card */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">설비 종합효율</h3>
            
            {/* Three Efficiency Circles */}
            <div className="flex justify-center gap-6 mb-6">
              <div className="flex flex-col items-center">
                <div className="relative w-16 h-16">
                  <EchartComponent 
                    options={createEquipmentEfficiencyOption(data.equipment.efficiency1, '50%')} 
                    styles={{ width: '64px', height: '64px' }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-bold text-gray-900">{data.equipment.efficiency1}%</span>
                  </div>
                </div>
                <p className="text-xs text-gray-700 mt-1">설비 종합효율</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="relative w-16 h-16">
                  <EchartComponent 
                    options={createEquipmentEfficiencyOption(data.equipment.efficiency2, '50%')} 
                    styles={{ width: '64px', height: '64px' }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-bold text-gray-900">{data.equipment.efficiency2}%</span>
                  </div>
                </div>
                <p className="text-xs text-gray-700 mt-1">설비 종합효율</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="relative w-16 h-16">
                  <EchartComponent 
                    options={createEquipmentEfficiencyOption(data.equipment.efficiency3, '50%')} 
                    styles={{ width: '64px', height: '64px' }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-bold text-gray-900">{data.equipment.efficiency3}%</span>
                  </div>
                </div>
                <p className="text-xs text-gray-700 mt-1">설비 종합효율</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-xs text-gray-600">일 실적 수량</span>
                  <span className="text-sm font-bold text-gray-900">{data.equipment.actualQuantity.toLocaleString()}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm font-bold text-gray-900 mx-2">/</span>
                  <div className="flex flex-col items-end">
                    <span className="text-xs text-gray-600">일 계획 수량</span>
                    <span className="text-sm font-bold text-gray-900">{data.equipment.plannedQuantity.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              <div className="w-full h-2">
                <EchartComponent 
                  options={createEquipmentProgressBarOption(Math.round((data.equipment.actualQuantity / data.equipment.plannedQuantity) * 100))}
                  styles={{ width: '100%', height: '8px' }}
                />
              </div>
            </div>
          </div>

          {/* Equipment Classification Card */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">설비 종합효율</h3>
            
            {/* Pie Chart and Grid */}
            <div className="flex flex-col items-center">
              {/* Pie Chart */}
              <div className="mb-4">
                <EchartComponent 
                  options={createEquipmentPieChartOption(data.equipment.classification)} 
                  styles={{ width: '200px', height: '200px' }}
                />
              </div>
              
              {/* Grid Layout */}
              <div className="grid grid-cols-2 gap-4 w-full">
                {data.equipment.classification.map((item: any, index: number) => {
                  const colors = ['bg-blue-400', 'bg-purple-400', 'bg-pink-400', 'bg-green-400', 'bg-orange-400', 'bg-indigo-500'];
                  return (
                    <div key={index} className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${colors[index] || 'bg-gray-400'}`}></div>
                      <span className="text-sm text-gray-700">{item.name}</span>
                      <span className="text-sm font-bold text-gray-900 ml-auto">{item.value}건</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileDashboard; 