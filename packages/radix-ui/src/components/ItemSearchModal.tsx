import React from 'react';
import { RadixSwitch } from '@repo/radix-ui/components';
import { Button } from '@repo/radix-ui/components';
import { RadixDialogRoot, RadixDialogContent, RadixDialogClose } from '@repo/radix-ui/components';


// Minimal Input component
const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>((props, ref) => (
  <input
    ref={ref}
    className={
      'border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white'
    }
    {...props}
  />
));

// Table with compact header, sort icons, and compact rows
const Table = ({ columns, data, onRowSelect, selectedRowKeys }: { columns: any[]; data: any[]; onRowSelect: (row: any, checked: boolean) => void; selectedRowKeys: (string | number)[] }) =>
  <div className="overflow-x-auto rounded-xl border border-gray-300 bg-white">
    <table className="min-w-full text-sm">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-5 py-3 font-semibold text-gray-600 text-sm border-b border-gray-200 whitespace-nowrap w-12 text-left align-middle">
            <input type="checkbox" disabled className="accent-violet-600 align-middle" />
          </th>
          {columns.map((col) => (
            <th key={col.key} className="px-5 py-3 font-semibold text-gray-600 text-sm border-b border-gray-200 whitespace-nowrap text-left align-middle">
              <span className="inline-flex items-center gap-1">
                {col.title}
                <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 16 16"><path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </span>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, i) => (
          <tr key={row.key || i}>
            <td className="px-5 py-3 border-b border-gray-100 text-center align-middle">
              <input
                type="checkbox"
                checked={selectedRowKeys.includes(row.code)}
                onChange={e => onRowSelect(row, e.target.checked)}
                className="accent-violet-600 align-middle"
              />
            </td>
            {columns.map((col, idx) => (
              <td
                key={col.key}
                className={
                  idx === 0
                    ? "px-5 py-3 border-b border-gray-100 whitespace-nowrap align-middle text-gray-900 text-sm font-bold"
                    : "px-5 py-3 border-b border-gray-100 whitespace-nowrap align-middle text-gray-700 text-sm font-normal"
                }
              >
                {col.render ? col.render(row[col.dataIndex], row, i) : row[col.dataIndex]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>;

// Pill badge for status
const StatusBadge = ({ status }: { status: string }) => {
  if (status === 'Paid') {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200 gap-1">
        <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
        Paid
      </span>
    );
  }
  if (status === 'Refunded') {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-white text-gray-600 border border-gray-200 gap-1">
        <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 5v6h6" /><path strokeLinecap="round" strokeLinejoin="round" d="M19 12a7 7 0 1 1-7-7" /></svg>
        Refunded
      </span>
    );
  }
  return null;
};

interface ItemSearchModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  columns: any[];
  data: any[];
  onSearch: (value: string) => void;
  onSwitchChange: (checked: boolean) => void;
  switchChecked: boolean;
  searchValue: string;
  onSearchValueChange: (value: string) => void;
  dropdownOptions: { label: string; value: string }[];
  onDropdownChange: (value: string) => void;
  dropdownValue: string;
  onRowSelect: (row: any, checked: boolean) => void;
  selectedRowKeys: (string | number)[];
  onNew: () => void;
  onMyItems: () => void;
}

export const ItemSearchModal: React.FC<ItemSearchModalProps> = ({
  open,
  onClose,
  title,
  columns,
  data,
  onSearch,
  onSwitchChange,
  switchChecked,
  searchValue,
  onSearchValueChange,
  onRowSelect,
  selectedRowKeys,
  onNew,
  onMyItems,
}) => {
  // Patch columns to inject status badge rendering for 'status' column
  const patchedColumns = columns.map(col =>
    col.key === 'status'
      ? { ...col, render: (value: string) => <StatusBadge status={value} /> }
      : col
  );

  // const buttonDefaultStyle = {
  //   backgroundColor: 'white',
  //   borderColor: '#d1d5db', // Tailwind gray-300
  //   color: '#111827',
  //   borderWidth: '1px',
  //   borderStyle: 'solid',
  // };

  return (
    <RadixDialogRoot open={open} onOpenChange={onClose}>
      <RadixDialogContent className="max-w-2xl w-full p-0 rounded-2xl shadow-2xl border-2 border-gray-300 bg-white overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200 bg-white">
          <div className="text-base font-medium text-gray-900">{title}</div>
          <RadixDialogClose asChild>
            <button className="w-8 h-8 flex items-center justify-center  bg-white text-gray-400 text-xl p-0 focus:outline-none">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </RadixDialogClose>
        </div>
        {/* Filter Bar */}
        <div className="flex items-center px-6 py-4 border-b border-gray-100 bg-gray-50 min-h-[60px] gap-3 text-sm">
          <RadixSwitch checked={switchChecked} onCheckedChange={onSwitchChange} color="violet" className="scale-110 focus:outline-none focus:ring-0" />
          <span className="text-xs text-gray-700 ml-2 mr-4 align-middle font-medium leading-tight whitespace-pre">사용중단포함</span>
          <div className="relative flex-1 max-w-[400px]">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" strokeLinecap="round" /></svg>
            </span>
            <Input
              value={searchValue}
              onChange={e => onSearchValueChange(e.target.value)}
              placeholder="검색"
              className="w-[250px] h-10 pl-12 pr-4 py-3 text-base border border-gray-400 border-solid rounded-lg bg-white"
            />
          </div>
          <div className="flex-1" />
          <div className="flex gap-2 ml-2">
            <Button
              onClick={() => onSearch(searchValue)}
              className="rounded-full px-6 py-2 text-base border border-gray-400 border-solid shadow-none font-normal min-w-[100px] h-16"
              style={{
                backgroundColor: '#7c3aed',
                color: 'white',
                fontSize: '16px',
                fontWeight: 'bold',
                minWidth: '100px',
                height: '40px'
              }}
            >
              검색(F3)
            </Button>
            <Button
              onClick={() => {}}
              className="rounded-full px-6 py-2 text-base border border-gray-400 border-solid shadow-none font-normal min-w-[100px] h-16"
              style={{
                backgroundColor: 'white',
                color: 'black',
                fontSize: '16px',
                fontWeight: 'bold',
                minWidth: '100px',
                height: '40px',
                border: '1px solid #9ca3af'
              }}
            >
              옵션
            </Button>
          </div>
        </div>
        {/* Table Section */}
        <div className="px-6 py-2 max-h-[480px] overflow-y-auto bg-white">
          <Table columns={patchedColumns} data={data} onRowSelect={onRowSelect} selectedRowKeys={selectedRowKeys} />
        </div>
        {/* Footer Bar */}
        <div className="flex items-center px-6 py-3 border-t border-gray-200 bg-gray-50">
          <div className="flex gap-2">
            <Button
              onClick={onNew}
              className="rounded-full px-6 py-2 text-base border border-gray-400 border-solid shadow-none font-normal min-w-[100px] h-16 focus:ring-2 focus:ring-violet-300"
              style={{
                backgroundColor: 'white',
                color: 'black',
                fontSize: '16px',
                fontWeight: 'bold',
                minWidth: '100px',
                height: '40px',
                border: '1px solid #9ca3af'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = '#f3f4f6';
                e.currentTarget.style.borderColor = '#a3a3a3';
                e.currentTarget.style.cursor = 'pointer';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.borderColor = '#9ca3af';
                e.currentTarget.style.cursor = 'pointer';
              }}
            >
              신규(F2)
            </Button>
            <Button
              onClick={onMyItems}
              className="rounded-full px-6 py-2 text-base border border-gray-400 border-solid shadow-none font-normal min-w-[100px] h-16 focus:ring-2 focus:ring-violet-300 flex items-center gap-2"
              style={{
                backgroundColor: 'white',
                color: 'black',
                fontSize: '16px',
                fontWeight: 'bold',
                minWidth: '100px',
                height: '40px',
                border: '1px solid #9ca3af'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = '#f3f4f6';
                e.currentTarget.style.borderColor = '#a3a3a3';
                e.currentTarget.style.cursor = 'pointer';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.borderColor = '#9ca3af';
                e.currentTarget.style.cursor = 'pointer';
              }}
            >
              My품목
              <svg className="w-4 h-4 ml-2 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 16 16"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6l4 4 4-4"/></svg>
            </Button>
          </div>
        </div>
      </RadixDialogContent>
    </RadixDialogRoot>
  );
}; 