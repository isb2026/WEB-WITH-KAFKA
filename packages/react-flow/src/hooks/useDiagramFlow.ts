import { useState, useCallback } from 'react';
import { 
  applyNodeChanges, 
  applyEdgeChanges, 
  addEdge,
  useReactFlow,
  OnNodesChange,
  OnEdgesChange,
  OnConnect
} from '@xyflow/react';
import { DiagramNode, DiagramEdge } from '../types';

interface UseDiagramFlowProps {
  initialNodes?: DiagramNode[];
  initialEdges?: DiagramEdge[];
}

export const useDiagramFlow = ({ 
  initialNodes = [], 
  initialEdges = [] 
}: UseDiagramFlowProps = {}) => {
  const [nodes, setNodes] = useState<DiagramNode[]>(initialNodes);
  const [edges, setEdges] = useState<DiagramEdge[]>(initialEdges);
  const { addNodes, screenToFlowPosition } = useReactFlow();

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((ns) => applyNodeChanges(changes, ns)),
    []
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((es) => applyEdgeChanges(changes, es)),
    []
  );

  const onConnect: OnConnect = useCallback(
    (params) => setEdges((es) => addEdge({ ...params, animated: false }, es)),
    []
  );

  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      const txt = event.dataTransfer.getData('application/reactflow');
      if (!txt) return;

      try {
        const payload = JSON.parse(txt);
        const position = screenToFlowPosition({
          x: event.clientX,
          y: event.clientY,
        });

        const newNode: DiagramNode = {
          id: 'drop-' + Math.random().toString(36).slice(2, 8),
          type: payload.shape,
          position,
          data: { 
            label: payload.label, 
            color: payload.color 
          },
        };

        addNodes([newNode]);
      } catch (error) {
        console.error('Failed to parse drop data:', error);
      }
    },
    [addNodes, screenToFlowPosition]
  );

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  return {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    handleDrop,
    handleDragOver,
  };
};
