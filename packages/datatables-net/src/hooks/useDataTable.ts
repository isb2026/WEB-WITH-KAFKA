import { useState, useCallback } from 'react';

export interface UseDataTableOptions {
  initialSelectedRows?: any[];
  onSelectionChange?: (selectedRows: any[]) => void;
}

export const useDataTable = (options: UseDataTableOptions = {}) => {
  const { initialSelectedRows = [], onSelectionChange } = options;
  
  const [selectedRows, setSelectedRows] = useState<any[]>(initialSelectedRows);
  
  const handleRowSelect = useCallback((rows: any[]) => {
    setSelectedRows(rows);
    if (onSelectionChange) {
      onSelectionChange(rows);
    }
  }, [onSelectionChange]);
  
  return {
    selectedRows,
    setSelectedRows,
    handleRowSelect,
  };
};

export default useDataTable;