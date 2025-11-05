// import { useEffect, useState } from 'react';
// import { useCompany } from '@esg/hooks/locations/company/useComany';
// import { group } from 'console';
// // const { companyTotalList, getCompanyListForTree } = useCompany();

// // let _CompanyGroupList = [
// // 	{
// // 		group_id: 1,
// // 		group_name: '무른모 그룹',
// // 		group_type_id: 1,
// // 		group_type: 'Classification Group',
// // 		companys: getCompanyListForTree(companyTotalList),
// // 	},
// // 	{
// // 		group_id: 2,
// // 		group_name: '영완 그룹',
// // 		group_type: 'Portfolio',
// // 		group_type_id: 2,
// // 		companys: getCompanyListForTree(companyTotalList),
// // 	},
// // ];

// export const useCompanyGroup = () => {
// 	const [companyGroupList, setCompanyGroupList] = useState(_CompanyGroupList);

// 	const getCompanyGroupList = () => {
// 		return companyGroupList;
// 	};

// 	const getCompanyGroupById = (groupId: number) => {
// 		return companyGroupList.find((group) => group.group_id === groupId);
// 	};

// 	const addCompanyGroup = (newGroup: any) => {
// 		setCompanyGroupList((prev) => [...prev, newGroup]);
// 	};

// 	const updateCompanyGroup = (updatedGroup: any) => {
// 		setCompanyGroupList((prev) =>
// 			prev.map((group) =>
// 				group.group_id === updatedGroup.group_id ? updatedGroup : group
// 			)
// 		);
// 	};

// 	return {
// 		companyGroupList,
// 		getCompanyGroupList,
// 		getCompanyGroupById,
// 		addCompanyGroup,
// 		updateCompanyGroup,
// 	};
// };
