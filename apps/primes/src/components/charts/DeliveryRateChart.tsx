import { EChartsOption } from '@repo/echart/components';

export const createDeliveryRateChartOption = (rate: number): EChartsOption => ({
  tooltip: {
    trigger: 'item',
    formatter: '{b}: {c}%',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 8,
    textStyle: {
      color: '#333',
      fontSize: 12
    }
  },
  series: [
    {
      name: '납품율',
      type: 'pie',
      radius: ['60%', '80%'],
      center: ['50%', '60%'],
      startAngle: 180,
      endAngle: 360,
      data: [
        { 
          value: rate, 
          name: 'Delivery Rate',
          itemStyle: { color: '#6A53B1' } // Purple color
        },
        { 
          value: 100 - rate, 
          name: 'Remaining',
          itemStyle: { color: '#E5E7EB' } // Light gray color
        }
      ],
      label: {
        show: false
      },
      emphasis: {
        scale: false
      }
    }
  ]
});

export const deliveryRateChartOption = createDeliveryRateChartOption(80);

export const createDeliveryDeadlineChartOption = (rate: number): EChartsOption => ({
  tooltip: {
    trigger: 'item',
    formatter: '{b}: {c}%',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 8,
    textStyle: {
      color: '#333',
      fontSize: 12
    }
  },
  series: [
    {
      name: '납기율',
      type: 'pie',
      radius: ['60%', '80%'],
      center: ['50%', '60%'],
      startAngle: 180,
      endAngle: 360,
      data: [
        { 
          value: rate, 
          name: 'Delivery Deadline Rate',
          itemStyle: { color: '#6A53B1' } // Purple color
        },
        { 
          value: 100 - rate, 
          name: 'Remaining',
          itemStyle: { color: '#E5E7EB' } // Light gray color
        }
      ],
      label: {
        show: false
      },
      emphasis: {
        scale: false
      }
    }
  ]
});

export const deliveryDeadlineChartOption = createDeliveryDeadlineChartOption(70); 