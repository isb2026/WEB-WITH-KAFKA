import { useAccountListQuery } from './useAccountListQuery';
import { useCreateAccount } from './useCreateAccount';

// import { useCompanyTreeQuery } from './useCompanyTreeQuery';
// import { useCompanyDetailQuery } from './useCompanyDetailQuery';
// import { useCreateCompany } from './useCreateCompany';
// import { useUpdateCompany } from './useUpdateCompany';
import { useDeleteAccount } from './useDeleteAccount';
import { useUpdateAccount } from './useUpdateAccount';
import { SearchAccountRequest } from '@esg/types/account';

export const useAccount = (params: {
	page: number;
	size: number;
	companyId?: number | null;
	searchRequest?: SearchAccountRequest;
}) => {
	const list = useAccountListQuery(params);
	const create = useCreateAccount(params.page, params.size, params.companyId);
	const update = useUpdateAccount(params.page, params.size, params.companyId);
	const remove = useDeleteAccount();

	return {
		list,
		create,
		update,
		remove,
	};
};
