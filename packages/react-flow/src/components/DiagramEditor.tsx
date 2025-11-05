import React, { useMemo } from 'react';
import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  ReactFlowProvider,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

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
} from './nodes/ShapeNodes';
import { ShapeBar } from './ShapeBar';
import { useDiagramFlow } from '../hooks';
import { DiagramNode, DiagramEdge } from '../types';

// Node types configuration
const nodeTypes = {
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

// Initial data
const initialNodes: DiagramNode[] = [
  {
    id: 'n-1',
    type: 'roundRect',
    position: { x: 520, y: 60 },
    data: { label: 'round-rectangle', color: '#61a6ff' },
    style: { background: '#61a6ff' },
  },
];

const initialEdges: DiagramEdge[] = [];

/** -------- Inner canvas: uses hooks and lives UNDER the provider -------- */
interface DiagramCanvasProps {
  initialNodes?: DiagramNode[];
  initialEdges?: DiagramEdge[];
}

const DiagramCanvas: React.FC<DiagramCanvasProps> = ({
  initialNodes: propInitialNodes = initialNodes,
  initialEdges: propInitialEdges = initialEdges,
}) => {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    handleDrop,
    handleDragOver,
  } = useDiagramFlow({
    initialNodes: propInitialNodes,
    initialEdges: propInitialEdges,
  });

  const proOptions = useMemo(() => ({ hideAttribution: true }), []);

  return (
    <>
      <ShapeBar />
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        proOptions={proOptions}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="p-2 h-full bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden"
      >
        <Controls />
        <MiniMap zoomable pannable />
        <Background gap={16} />
      </ReactFlow>
    </>
  );
};

/** -------- Main component: provides the provider -------- */
interface DiagramEditorProps {
  className?: string;
  initialNodes?: DiagramNode[];
  initialEdges?: DiagramEdge[];
}

const DiagramEditor: React.FC<DiagramEditorProps> = ({
  className = '',
  initialNodes,
  initialEdges,
}) => {
  return (
    <div className={`w-full h-full relative ${className}`}>
      <ReactFlowProvider>
        <DiagramCanvas 
          initialNodes={initialNodes}
          initialEdges={initialEdges}
        />
      </ReactFlowProvider>
    </div>
  );
};

export default DiagramEditor;
