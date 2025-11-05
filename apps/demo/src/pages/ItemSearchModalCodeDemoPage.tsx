import React from 'react';
import { PreviewCodeTabs } from '../components/PreviewCodeTabs';
import ItemSearchModalDemo from './demo/ItemSearchModalDemo';

const codeString = `import React, { useState } from 'react';
import { ItemSearchModal } from '@repo/radix-ui/components';

const columns = [
  { key: 'code', title: '선택', dataIndex: 'code' },
  { key: 'date', title: '품목코드', dataIndex: 'date' },
  { key: 'status', title: '품목명(규격)', dataIndex: 'status' },
  { key: 'desc', title: '검색항목내용', dataIndex: 'desc' },
];

const data = [
  { code: '#3066', date: 'Jan 6, 2025', status: 'Paid', desc: 'Monthly subscription' },
  { code: '#3065', date: 'Jan 6, 2025', status: 'Paid', desc: 'Monthly subscription' },
  { code: '#3064', date: 'Jan 6, 2025', status: 'Paid', desc: 'Monthly subscription' },
  { code: '#3063', date: 'Jan 5, 2025', status: 'Paid', desc: 'Monthly subscription' },
  { code: '#3062', date: 'Jan 5, 2025', status: 'Refunded', desc: 'Monthly subscription' },
  { code: '#3061', date: 'Jan 5, 2025', status: 'Paid', desc: 'Monthly subscription' },
];

const dropdownOptions = [
  { label: 'My품목1', value: 'my1' },
  { label: 'My품목2', value: 'my2' },
];

export default function ItemSearchModalDemo() {
  const [open, setOpen] = useState(false);
  const [switchChecked, setSwitchChecked] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [dropdownValue, setDropdownValue] = useState(dropdownOptions[0].value);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const handleRowSelect = (row, checked) => {
    setSelectedRowKeys(prev =>
      checked ? [...prev, row.code] : prev.filter(key => key !== row.code)
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <button
        onClick={() => setOpen(true)}
        className="mb-6 px-4 py-2 bg-violet-600 text-white rounded shadow"
      >
        품목검색 모달 열기
      </button>
      <ItemSearchModal
        open={open}
        onClose={() => setOpen(false)}
        title="품목검색"
        columns={columns}
        data={data}
        onSearch={v => alert('검색: ' + v)}
        onSwitchChange={setSwitchChecked}
        switchChecked={switchChecked}
        searchValue={searchValue}
        onSearchValueChange={setSearchValue}
        dropdownOptions={dropdownOptions}
        onDropdownChange={setDropdownValue}
        dropdownValue={dropdownValue}
        onRowSelect={handleRowSelect}
        selectedRowKeys={selectedRowKeys}
        onNew={() => alert('신규')}
        onMyItems={() => alert('My품목')}
      />
    </div>
  );
}
`;

const ItemSearchModalCodeDemoPage: React.FC = () => (
  <div className="min-h-screen w-full bg-gray-50 px-4 py-10">
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Item Search Modal Demo</h1>
      <p className="text-sm text-gray-500 mb-6">
        아래는 ItemSearchModal 컴포넌트의 사용 예시입니다. Preview 탭에서 결과를, Code 탭에서 코드를 확인할 수 있습니다.
      </p>
      <PreviewCodeTabs
        preview={<ItemSearchModalDemo />}
        code={
          <pre className="bg-gray-200 p-4 text-sm rounded overflow-x-auto whitespace-pre-wrap">
            {codeString}
          </pre>
        }
      />
    </div>
  </div>
);

export default ItemSearchModalCodeDemoPage; 