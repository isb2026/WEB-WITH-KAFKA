import { GroupConfig } from '@repo/moornmo-ui/types';

export interface CompanyTreeNode {
  id: string;
  name: string;
  level: number;
  is_group?: boolean;
  parent_id?: string | null;
  _children?: CompanyTreeNode[];
}

// Sample tree data structure - this will be replaced with real data from API
export const companyTreeData = [
  {
    id: 'samsung',
    name: '삼성',
    level: 0,
    is_group: true,
    parent_id: null,
    _children: [
      {
        id: 'samsung-electronics',
        name: '삼성전자',
        level: 1,
        is_group: true,
        parent_id: 'samsung',
        _children: [
          {
            id: 'samsung-electro-mechanics',
            name: '삼성전기',
            level: 2,
            is_group: true,
            parent_id: 'samsung-electronics'
          }
        ]
      },
      {
        id: 'samsung-trading',
        name: '삼성물산',
        level: 1,
        is_group: true,
        parent_id: 'samsung'
      }
    ]
  }
];

// Function to filter tree based on user's company
export const filterTreeByUserCompany = (
  tree: CompanyTreeNode[],
  userCompanyId: string
): CompanyTreeNode[] => {
  const findCompanyAndChildren = (
    nodes: CompanyTreeNode[],
    targetId: string
  ): CompanyTreeNode[] | null => {
    for (const node of nodes) {
      if (node.id === targetId) {
        return [node];
      }
      if (node._children) {
        const found = findCompanyAndChildren(node._children, targetId);
        if (found) {
          return found;
        }
      }
    }
    return null;
  };

  return findCompanyAndChildren(tree, userCompanyId) || [];
}; 