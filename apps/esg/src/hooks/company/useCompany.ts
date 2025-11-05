import { useMemo } from 'react';
import { CompanyTreeNode } from '@esg/types/company';
import { BaseTreeNode } from '@repo/moornmo-ui/components';
import { useCompanyTreeQuery } from './useCompanyTreeQuery';
import { useCreateCompany } from './useCreateCompany';
import { useUpdateCompany } from './useUpdateCompany';
import { useDeleteCompany } from './useDeleteCompany';

// BaseTreeNode: { id, name, level, isOpen?, children? }
// 여기에 companyType, companyId, children: CompanyTreeDataNode[] 를 추가
export interface CompanyTreeDataNode extends BaseTreeNode {
	companyType: 'COMPANY' | 'GROUP' | 'WORKPLACE';
	companyId: number | string;
	children: CompanyTreeDataNode[];
}

export const useCompany = () => {
	// const { data, isLoading, error } = useCompanyTreeQuery();
	const create = useCreateCompany();
	const update = useUpdateCompany();
	const remove = useDeleteCompany();

	/**
	 * 트리 데이터를 렌더링용으로 변환
	 * @param data 원본 CompanyTreeNode[]
	 * @param level 현재 깊이 (0부터 시작)
	 * @param allowTypes 허용할 companyType 배열
	 */
	// const makeCompanyTreeData = (
	// 	data: CompanyTreeNode[],
	// 	level: number,
	// 	allowTypes: ('GROUP' | 'COMPANY' | 'WORKPLACE')[]
	// ): CompanyTreeDataNode[] => {
	// 	// Add validation to ensure data is an array
	// 	if (!Array.isArray(data)) {
	// 		console.warn('makeCompanyTreeData: data is not an array', data);
	// 		return [];
	// 	}

	// 	return data.reduce<CompanyTreeDataNode[]>((acc, item) => {
	// 		// 1) 자식부터 재귀 변환
	// 		const children = item.children
	// 			? makeCompanyTreeData(item.children, level + 1, allowTypes)
	// 			: [];

	// 		// 2) 자신 혹은 자식 중 허용된 타입이 있으면 포함
	// 		if (allowTypes.includes(item.companyType) || children.length > 0) {
	// 			acc.push({
	// 				id: item.companyId ? item.companyId.toString() : '',
	// 				name: item.name,
	// 				level: level + 1,
	// 				isOpen: level == 0 ? true : false,
	// 				children,
	// 				companyType: item.companyType,
	// 				companyId: Number(item.companyId),
	// 			});
	// 		}

	// 		return acc;
	// 	}, []);
	// };

	return {
		// tree: { data, isLoading, error },
		create,
		update,
		remove,
		// makeCompanyTreeData,
	};
};
