# TreeView Component

계층적 데이터를 트리 구조로 표시하는 컴포넌트입니다. Radix UI Accordion을 기반으로 구현되었습니다.

## Features

- ✅ **커스텀 아이콘**: 각 노드에 ReactNode 형태의 아이콘 지원
- ✅ **스타일 커스터마이징**: 각 요소별 className 커스터마이징 가능
- ✅ **확장 아이콘 커스터마이징**: 기본 확장 아이콘 변경 가능
- ✅ **클릭 이벤트**: 노드 클릭 시 콜백 함수 실행
- ✅ **반응형 디자인**: Tailwind CSS 기반 스타일링
- ✅ **접근성**: Radix UI 기반으로 키보드 네비게이션 지원

## Types

### TreeNode

```typescript
export type TreeNode = {
	id: string; // 고유 식별자
	label: string; // 표시될 텍스트
	icon?: ReactNode; // 노드 아이콘 (선택사항)
	children?: TreeNode[]; // 자식 노드들 (선택사항)
	disabled?: boolean; // 비활성화 여부 (선택사항)
};
```

### TreeViewClassNames

```typescript
export type TreeViewClassNames = {
	root?: string; // 루트 컨테이너 스타일
	item?: string; // 각 아이템 컨테이너 스타일
	header?: string; // 헤더 스타일
	trigger?: string; // 트리거 버튼 스타일
	content?: string; // 콘텐츠 영역 스타일
	leafItem?: string; // 리프 노드 스타일
	expandIcon?: string; // 확장 아이콘 스타일
	selectedItem?: string; // 선택된 아이템 스타일
	selectedLeafItem?: string; // 선택된 리프 노드 스타일
	checkbox?: string; // 체크박스 스타일
	checkedItem?: string; // 체크된 아이템 스타일
	checkedLeafItem?: string; // 체크된 리프 노드 스타일
};
```

## Props

| Prop                | Type                                          | Default            | Description          |
| ------------------- | --------------------------------------------- | ------------------ | -------------------- |
| `data`              | `TreeNode[]`                                  | -                  | 트리 데이터 (필수)   |
| `classNames`        | `TreeViewClassNames`                          | `{}`               | 커스텀 스타일 클래스 |
| `defaultExpandIcon` | `ReactNode`                                   | `<ChevronRight />` | 기본 확장 아이콘     |
| `selectedNodeId`    | `string`                                      | -                  | 선택된 노드 ID       |
| `checkedNodeIds`    | `string[]`                                    | `[]`               | 체크된 노드 ID 배열  |
| `showCheckbox`      | `boolean`                                     | `false`            | 체크박스 표시 여부   |
| `onNodeClick`       | `(node: TreeNode) => void`                    | -                  | 노드 클릭 콜백       |
| `onNodeCheck`       | `(nodeId: string, checked: boolean) => void`  | -                  | 노드 체크 콜백       |
| `onExpandToggle`    | `(nodeId: string, expanded: boolean) => void` | -                  | 확장/축소 토글 콜백  |

## Usage Examples

### 기본 사용법

```tsx
import { TreeView, TreeNode } from '@repo/radix-ui/components';

const data: TreeNode[] = [
	{
		id: '1',
		label: '루트 노드',
		children: [
			{ id: '1-1', label: '자식 노드 1' },
			{ id: '1-2', label: '자식 노드 2' },
		],
	},
];

<TreeView data={data} />;
```

### 아이콘과 함께 사용

```tsx
import { TreeView, TreeNode } from '@repo/radix-ui/components';
import { Package, Cog, Wrench } from 'lucide-react';

const data: TreeNode[] = [
	{
		id: 'product',
		label: '완제품',
		icon: <Package className="text-blue-600" />,
		children: [
			{
				id: 'assembly',
				label: '조립품',
				icon: <Cog className="text-green-600" />,
				children: [
					{
						id: 'part',
						label: '부품',
						icon: <Wrench className="text-orange-500" />,
					},
				],
			},
		],
	},
];

<TreeView data={data} />;
```

### 커스텀 스타일링

```tsx
import { TreeView, TreeViewClassNames } from '@repo/radix-ui/components';
import { ChevronDown } from 'lucide-react';

const customStyles: TreeViewClassNames = {
	root: 'border-gray-300 shadow-lg',
	item: 'border-gray-200',
	trigger: 'hover:bg-blue-50 font-semibold',
	content: 'bg-gray-50',
	leafItem: 'hover:bg-green-50 text-gray-700',
	expandIcon: 'text-blue-500',
};

<TreeView
	data={data}
	classNames={customStyles}
	defaultExpandIcon={<ChevronDown className="h-4 w-4" />}
	onNodeClick={(node) => console.log('클릭:', node)}
/>;
```

### 체크박스 기능이 있는 예제

```tsx
import {
	TreeView,
	TreeNode,
	TreeViewClassNames,
} from '@repo/radix-ui/components';
import { useState } from 'react';
import { Package, Cog, Wrench, ChevronDown } from 'lucide-react';

const CheckboxTreeExample = () => {
	const [selectedNodeId, setSelectedNodeId] = useState<string | undefined>();
	const [checkedNodeIds, setCheckedNodeIds] = useState<string[]>([]);

	const data: TreeNode[] = [
		{
			id: 'product-1',
			label: '제품 A',
			icon: <Package className="text-blue-600" />,
			children: [
				{
					id: 'assembly-1',
					label: '조립품 A-1',
					icon: <Cog className="text-green-600" />,
					children: [
						{
							id: 'part-1',
							label: '부품 A-1-1',
							icon: <Wrench className="text-orange-500" />,
						},
					],
				},
			],
		},
	];

	const customStyles: TreeViewClassNames = {
		selectedItem: 'bg-blue-100 border-blue-300',
		selectedLeafItem:
			'bg-blue-200 border-blue-300 text-blue-900 font-semibold',
		checkedItem: 'bg-green-100 border-green-300',
		checkedLeafItem:
			'bg-green-200 border-green-300 text-green-900 font-semibold',
		checkbox: 'text-green-600 focus:ring-green-500',
	};

	const handleNodeCheck = (nodeId: string, checked: boolean) => {
		if (checked) {
			setCheckedNodeIds((prev) => [...prev, nodeId]);
		} else {
			setCheckedNodeIds((prev) => prev.filter((id) => id !== nodeId));
		}
	};

	return (
		<TreeView
			data={data}
			classNames={customStyles}
			selectedNodeId={selectedNodeId}
			checkedNodeIds={checkedNodeIds}
			showCheckbox={true}
			onNodeClick={(node) => setSelectedNodeId(node.id)}
			onNodeCheck={handleNodeCheck}
			onExpandToggle={(nodeId, expanded) =>
				console.log('확장:', nodeId, expanded)
			}
			defaultExpandIcon={<ChevronDown className="h-4 w-4" />}
		/>
	);
};
```

### 선택 기능이 있는 예제

```tsx
import {
	TreeView,
	TreeNode,
	TreeViewClassNames,
} from '@repo/radix-ui/components';
import { useState } from 'react';
import { Package, Cog, Wrench, ChevronDown } from 'lucide-react';

const SelectableTreeExample = () => {
	const [selectedNodeId, setSelectedNodeId] = useState<string | undefined>();

	const data: TreeNode[] = [
		{
			id: 'product-1',
			label: '제품 A',
			icon: <Package className="text-blue-600" />,
			children: [
				{
					id: 'assembly-1',
					label: '조립품 A-1',
					icon: <Cog className="text-green-600" />,
					children: [
						{
							id: 'part-1',
							label: '부품 A-1-1',
							icon: <Wrench className="text-orange-500" />,
						},
					],
				},
			],
		},
	];

	const customStyles: TreeViewClassNames = {
		selectedItem: 'bg-blue-100 border-blue-300',
		selectedLeafItem:
			'bg-blue-200 border-blue-300 text-blue-900 font-semibold',
	};

	return (
		<TreeView
			data={data}
			classNames={customStyles}
			selectedNodeId={selectedNodeId}
			onNodeClick={(node) => setSelectedNodeId(node.id)}
			defaultExpandIcon={<ChevronDown className="h-4 w-4" />}
		/>
	);
};
```

### BOM 구조 예제

```tsx
import { TreeView, TreeNode } from '@repo/radix-ui/components';
import { Package, Cog, Wrench } from 'lucide-react';

const bomData: TreeNode[] = [
	{
		id: 'bom-1',
		label: '제품 A (완제품)',
		icon: <Package className="text-blue-600" />,
		children: [
			{
				id: 'bom-1-1',
				label: '부품 A-1 (조립품)',
				icon: <Cog className="text-green-600" />,
				children: [
					{
						id: 'bom-1-1-1',
						label: '원자재 A-1-1',
						icon: <Wrench className="text-orange-500" />,
					},
				],
			},
		],
	},
];

<TreeView
	data={bomData}
	onNodeClick={(node) => {
		// BOM 노드 클릭 시 상세 정보 표시
		console.log('선택된 BOM 항목:', node);
	}}
/>;
```

## Styling

### 기본 스타일

- 루트: `w-full border rounded-md bg-white`
- 아이템: `border-b border-gray-100 last:border-b-0`
- 트리거: `flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50`
- 리프 노드: `flex items-center gap-2 pl-4 py-2 text-sm hover:bg-gray-50 cursor-pointer`
- 선택된 아이템: `bg-blue-50 border-blue-200`
- 선택된 리프 노드: `bg-blue-100 border-blue-200 text-blue-900`

### 커스터마이징

각 요소의 스타일은 `classNames` prop을 통해 오버라이드할 수 있습니다.

## Accessibility

- 키보드 네비게이션 지원 (Tab, Enter, Space)
- ARIA 속성 자동 적용 (Radix UI 기반)
- 스크린 리더 호환성

## Best Practices

1. **성능**: 대량의 데이터는 가상화 고려
2. **아이콘**: 일관된 아이콘 세트 사용 권장
3. **스타일**: 프로젝트 디자인 시스템과 일치하는 색상 사용
4. **접근성**: 의미있는 label 텍스트 제공

## Migration from v1

v1에서 v2로 마이그레이션 시 주요 변경사항:

```tsx
// v1 (이전)
<TreeView data={data} />

// v2 (현재)
<TreeView
	data={data}
	classNames={{ root: 'custom-style' }}
	defaultExpandIcon={<CustomIcon />}
	onNodeClick={handleClick}
/>
```
