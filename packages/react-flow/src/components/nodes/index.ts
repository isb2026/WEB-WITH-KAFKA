export { BaseNode } from './BaseNode';
export {
  RoundRectNode,
  RectNode,
  CircleNode,
  DiamondNode,
  HexagonNode,
  ParallelogramNode,
  TriangleNode,
  CylinderNode,
  ArrowRectNode,
  PlusNode,
} from './ShapeNodes';

import {
  RoundRectNode,
  RectNode,
  CircleNode,
  DiamondNode,
  HexagonNode,
  ParallelogramNode,
  TriangleNode,
  CylinderNode,
  ArrowRectNode,
  PlusNode,
} from './ShapeNodes';

export const nodeTypes = {
  roundRect: RoundRectNode,
  rect: RectNode,
  circle: CircleNode,
  diamond: DiamondNode,
  hexagon: HexagonNode,
  parallelogram: ParallelogramNode,
  triangle: TriangleNode,
  cylinder: CylinderNode,
  arrowRect: ArrowRectNode,
  plus: PlusNode,
};
