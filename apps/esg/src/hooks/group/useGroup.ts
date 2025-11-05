import { BaseTreeNode } from '@repo/moornmo-ui/components';
import { useGroupTreeQuery } from './useGroupTreeQuery';
import { useCreateGroup } from './useCreateGroup';
import { useUpdateGroup } from './useUpdateGroup';
import { useDeleteGroup } from './useDeleteGroup';
import { GroupTreeNode } from '@esg/types/group';
import { useGroupListQuery } from './useGroupListQuery';

export interface GroupTreeDataNode extends BaseTreeNode {
	companyType: 'COMPANY' | 'GROUP' | 'WORKPLACE';
	companyId: number | string;
	children: GroupTreeDataNode[];
}

export const useGroup = (params?: { page: number; size: number }) => {
	const { data, isLoading, error } = useGroupTreeQuery();
	const list = useGroupListQuery(
		params ? params : { page: null, size: null }
	);
	const create = useCreateGroup();
	const update = useUpdateGroup();
	const remove = useDeleteGroup();

	/**
	 * 트리 데이터를 렌더링용으로 변환
	 * @param data 원본 CompanyTreeNode[]
	 * @param level 현재 깊이 (0부터 시작)
	 * @param allowTypes 허용할 companyType 배열
	 */
	const makeGroupTreeData = (
		data: GroupTreeNode[],
		level: number,
		allowTypes: ('GROUP' | 'COMPANY' | 'WORKPLACE')[]
	): GroupTreeDataNode[] => {
		const result = data.reduce<GroupTreeDataNode[]>((acc, item) => {
			// Initialize classification and portfolio nodes
			const classificationNode: GroupTreeDataNode = {
				id: `${item.groupId}-classification`,
				name: 'Classification',
				level: level + 1,
				isOpen: false,
				children: [],
				companyType: 'GROUP',
				companyId: item.groupId,
			};

			const portfolioNode: GroupTreeDataNode = {
				id: `${item.groupId}-portfolio`,
				name: 'Portfolio',
				level: level + 1,
				isOpen: false,
				children: [],
				companyType: 'GROUP',
				companyId: item.groupId,
			};

			// Process classification groups
			const classificationChildren = item.classification
				? item.classification.reduce<GroupTreeDataNode[]>(
						(classAcc, classItem) => {
							const children = classItem.children
								? makeGroupTreeData(
										classItem.children,
										level + 2,
										allowTypes
									)
								: [];
							const companyNodes = classItem.companies
								? classItem.companies
										.filter((company) =>
											allowTypes.includes(
												company.companyType
											)
										)
										.map((company) => ({
											id: company.id.toString(),
											name: company.name,
											level: level + 3,
											isOpen: false,
											children: [],
											companyType: company.companyType,
											companyId: company.id,
										}))
								: [];
							classAcc.push({
								id: classItem.groupId.toString(),
								name: classItem.groupName,
								level: level + 2,
								isOpen: false,
								children: [...children, ...companyNodes],
								companyType: 'GROUP',
								companyId: classItem.groupId,
							});
							return classAcc;
						},
						[]
					)
				: [];

			// Process portfolio groups
			const portfolioChildren = item.portfolio
				? item.portfolio.reduce<GroupTreeDataNode[]>(
						(portAcc, portItem) => {
							const children = portItem.children
								? makeGroupTreeData(
										portItem.children,
										level + 2,
										allowTypes
									)
								: [];
							const companyNodes = portItem.companies
								? portItem.companies
										.filter((company: any) =>
											allowTypes.includes(
												company.companyType
											)
										)
										.map((company: any) => ({
											id: company.id.toString(),
											name: company.name,
											level: level + 3,
											isOpen: false,
											children: [],
											companyType: company.companyType,
											companyId: company.id,
										}))
								: [];
							portAcc.push({
								id: portItem.groupId.toString(),
								name: portItem.groupName,
								level: level + 2,
								isOpen: false,
								children: [...children, ...companyNodes],
								companyType: 'GROUP',
								companyId: portItem.groupId,
							});
							return portAcc;
						},
						[]
					)
				: [];

			// Prepare non-empty child folders
			const childFolders: GroupTreeDataNode[] = [];
			if (classificationChildren.length > 0) {
				classificationNode.children = classificationChildren;
				childFolders.push(classificationNode);
			}
			if (portfolioChildren.length > 0) {
				portfolioNode.children = portfolioChildren;
				childFolders.push(portfolioNode);
			}

			// Add the main group node with only non-empty folders as children
			acc.push({
				id: item.groupId.toString(),
				name: item.groupName,
				level: level,
				isOpen: level === 0,
				children: childFolders,
				companyType: 'GROUP',
				companyId: item.groupId,
			});

			return acc;
		}, []);

		return result;
	};

	return {
		tree: { data, isLoading, error },
		create,
		update,
		remove,
		list,
		makeGroupTreeData,
	};
};
