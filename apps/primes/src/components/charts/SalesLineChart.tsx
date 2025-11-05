import { EChartsOption } from '@repo/echart/components';

export const createSalesLineChartOption = (data: number[]): EChartsOption => ({
  tooltip: {
    trigger: 'axis',
    formatter: function(params: any) {
      let result = params[0].axisValue + '<br/>';
      params.forEach((param: any) => {
        result += param.marker + param.seriesName + ': ' + param.value + '<br/>';
      });
      return result;
    },
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 8,
    textStyle: {
      color: '#333',
      fontSize: 12
    }
  },
  grid: {
    left: 25,
    right: 25,
    top: 25,
    bottom: 25,
    containLabel: false
  },
  xAxis: {
    type: 'category',
    data: [
      '1월', '3월', '5월', '7월', '9월', '11월',
      '12월'
    ],
    axisLine: { lineStyle: { color: '#E5E7EB' } },
    axisLabel: { color: '#6B7280', fontSize: 12 }
  },
  yAxis: {
    type: 'value',
    show: false
  },
  series: [
    {
      name: 'Top Line',
      type: 'line',
      data: data,
      lineStyle: { color: '#6A53B1', width: 3, type: 'solid' },
      smooth: true,
      showSymbol: false
    },
    {
      name: 'Middle Line',
      type: 'line',
      data: data.map(val => val * 0.8),
      lineStyle: { color: '#8B5CF6', width: 2, type: 'dotted' },
      smooth: true,
      showSymbol: false
    },
    {
      name: 'Bottom Line',
      type: 'line',
      data: data.map(val => val * 0.6),
      lineStyle: { color: '#A78BFA', width: 2, type: 'dotted' },
      smooth: true,
      showSymbol: false
    }
  ]
});

export const salesLineChartOption = createSalesLineChartOption([150, 230, 224, 218, 135, 147, 260]); 