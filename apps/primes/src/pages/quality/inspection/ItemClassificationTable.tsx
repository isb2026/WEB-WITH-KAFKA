import React from 'react';
import { Search } from 'lucide-react';
import DatatableComponent from '@primes/components/datatable/DatatableComponent';
import { useDataTable } from '@repo/radix-ui/hook';
import { RadixButton } from '@repo/radix-ui/components';
import { useTranslation } from '@repo/i18n';
import { useResponsive } from '@primes/hooks';
import { ItemSearchRequest } from '@primes/types/item';

interface ItemClassificationTableProps {
  itemData: any[];
  itemTotalCount: number;
  isLoading: boolean;
  error: any;
  itemSearchRequest: ItemSearchRequest;
  selectedRows: Set<string>;
  onItemSelect: (itemId: number) => void;
  onSearch: (searchTerm: string) => void;
  onSearchReset: () => void;
}

const ItemClassificationTable: React.FC<ItemClassificationTableProps> = ({
  itemData,
  itemTotalCount,
  isLoading,
  error,
  itemSearchRequest,
  selectedRows,
  onItemSelect,
  onSearch,
  onSearchReset
}) => {
  const { t } = useTranslation('dataTable');
  const { t: tCommon } = useTranslation('common');
  const { isMobile } = useResponsive();

  // Column definitions
  const classificationColumns = React.useMemo(
    () => [
      {
        accessorKey: 'itemName',
        header: t('columns.itemName'),
        size: 180,
      },
      {
        accessorKey: 'itemNumber',
        header: t('columns.itemNumber'),
        size: 120,
      },
      {
        accessorKey: 'itemSpec',
        header: t('columns.itemSpec'),
        size: 150,
      },
    ],
    [t]
  );

  // Table setup
  const classificationTable = useDataTable(
    itemData,
    classificationColumns,
    10,
    1,
    0,
    itemTotalCount
  );

  // Row selection handler
  const handleRowSelection = (rowIndex: string) => {
    const index = parseInt(rowIndex);
    const selectedItem = itemData[index];
    if (selectedItem) {
      onItemSelect(selectedItem.id);
    }
  };

  // Search handler
  const handleSearch = () => {
    const searchTerm = prompt(tCommon('table.search.enterSearchTerm') || '검색어를 입력하세요:');
    if (searchTerm !== null) {
      onSearch(searchTerm);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="text-sm text-gray-500">아이템 목록을 불러오는 중...</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="text-sm text-red-500">
          아이템 목록을 불러오는데 실패했습니다: {error.message}
        </div>
      </div>
    );
  }

  return (
    <DatatableComponent
      table={classificationTable.table}
      columns={classificationColumns}
      data={itemData}
      tableTitle={tCommon('pages.titles.inspectionClassification')}
      rowCount={itemTotalCount}
      useSearch={false}
      usePageNation={false}
      enableSingleSelect={true}
      selectedRows={selectedRows}
      toggleRowSelection={handleRowSelection}
      headerOffset="210px"
      actionButtons={
        <div className="flex gap-1">
          <RadixButton
            variant="outline"
            onClick={handleSearch}
            className={`flex gap-1 px-2.5 py-1.5 rounded-lg ${isMobile ? 'text-xs' : 'text-sm'} items-center border bg-Colors-Brand-700 text-white`}
          >
            <Search
              size={isMobile ? 14 : 16}
              className="text-muted-foreground text-white"
            />
            {tCommon('table.search.searchF3')}
          </RadixButton>
          {(itemSearchRequest.itemName || itemSearchRequest.itemNumber) && (
            <RadixButton
              variant="outline"
              onClick={onSearchReset}
              className={`flex gap-1 px-2.5 py-1.5 rounded-lg ${isMobile ? 'text-xs' : 'text-sm'} items-center border bg-gray-500 text-white`}
            >
              초기화
            </RadixButton>
          )}
        </div>
      }
    />
  );
};

export default ItemClassificationTable;