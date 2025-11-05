import { useState, useEffect } from 'react';

export const useSidebarMode = () => {
  const [sidebarMode, setSidebarMode] = useState<number>(() => {
    const saved = localStorage.getItem('sidebarMode');
    return saved ? parseInt(saved) : 1;
  });

  useEffect(() => {
    localStorage.setItem('sidebarMode', sidebarMode.toString());
  }, [sidebarMode]);

  const handleModeChange = (mode: number) => {
    setSidebarMode(mode);
  };

  return {
    sidebarMode,
    setSidebarMode,
    handleModeChange,
    isStyle2: sidebarMode === 2,
    isStyle1: sidebarMode === 1,
    isCollapsible: sidebarMode === 1,
    isIconPanel: sidebarMode === 2
  };
}; 