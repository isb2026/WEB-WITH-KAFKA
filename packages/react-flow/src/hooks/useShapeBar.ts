import { useCallback, useRef } from 'react';
import { useReactFlow, useViewport } from '@xyflow/react';
import { ShapeKey, DiagramNode } from '../types';
import { DEFAULT_NODE_SIZES } from '../constants/shapes';

export const useShapeBar = () => {
  const { addNodes } = useReactFlow();
  const { x, y, zoom } = useViewport();
  const idCounter = useRef(2);

  const addShape = useCallback(
    (shape: ShapeKey, color: string, label: string) => {
      const idStr = `n-${idCounter.current++}`;
      
      // Calculate position in flow coordinates
      const flowX = (-x + 240) / zoom;
      const flowY = (-y + 140) / zoom;

      const newNode: DiagramNode = {
        id: idStr,
        type: shape,
        position: { x: flowX, y: flowY },
        data: { label, color },
        style: { 
          ...DEFAULT_NODE_SIZES[shape], 
          background: color 
        },
      };

      addNodes([newNode]);
    },
    [addNodes, x, y, zoom]
  );

  const createDragData = useCallback((shape: ShapeKey, label: string, color: string) => {
    return JSON.stringify({
      shape,
      label,
      color,
    });
  }, []);

  return {
    addShape,
    createDragData,
  };
};
