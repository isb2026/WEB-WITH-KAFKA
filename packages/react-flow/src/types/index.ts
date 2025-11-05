import { Node, Edge } from '@xyflow/react';

export interface ShapeData extends Record<string, unknown> {
  label?: string;
  color?: string;
}

export interface NodeComponentProps {
  data: ShapeData;
  id: string;
}

export type ShapeKey = 
  | 'roundRect'
  | 'rect'
  | 'circle'
  | 'diamond'
  | 'hexagon'
  | 'parallelogram'
  | 'triangle'
  | 'cylinder'
  | 'arrowRect'
  | 'plus';

export interface ShapeConfig {
  key: ShapeKey;
  label: string;
  color: string;
  icon: React.ReactNode;
}

export interface DragPayload {
  shape: ShapeKey;
  label: string;
  color: string;
}

export type DiagramNode = Node<ShapeData>;
export type DiagramEdge = Edge;
