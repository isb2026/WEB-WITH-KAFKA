// import { EChartsOption } from '@repo/echart/components';

// interface TrendIndicatorProps {
//   value: number; // +10, -5, etc.
//   size?: number; // optional size, default is 16
// }

// export const createTrendIndicatorOption = (
//   value: number,
//   size: number = 16
// ): EChartsOption => {
//   const isPositive = value >= 0;
//   const color = '#10B981';

//   // Up-down-up zigzag pattern
//   const lineData = isPositive
//     ? [
//         [0.1, 0.3],  // start low
//         [0.3, 0.6],  // up
//         [0.5, 0.4],  // down
//         [0.7, 0.8],  // up again
//       ]
//     : [
//         [0.1, 0.7],  // start high
//         [0.3, 0.4],  // down
//         [0.5, 0.6],  // up
//         [0.7, 0.2],  // down again
//         [0.9, 0.1]   // end low
//       ];

//   return {
//     grid: { left: 0, right: 0, top: 0, bottom: 0 },
//     xAxis: { type: 'value', show: false,  max: 1 },
//     yAxis: { type: 'value', show: false,  max: 1 },
//     series: [
//       {
//         type: 'line',
//         data: lineData,
//         lineStyle: {
//           color,
//           width: 2
//         },
//         showSymbol: false,
//         smooth: false,
//         animation: false,
//       }
//     ]
//   };
// };
