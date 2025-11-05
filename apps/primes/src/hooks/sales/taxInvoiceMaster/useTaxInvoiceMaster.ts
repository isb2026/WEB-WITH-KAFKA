import { useCreateTaxInvoiceMaster } from './useCreateTaxInvoiceMaster';
import { useUpdateTaxInvoiceMaster } from './useUpdateTaxInvoiceMaster';
import { useDeleteTaxInvoiceMaster } from './useDeleteTaxInvoiceMaster';
import { useTaxInvoiceMasterListQuery } from './useTaxInvoiceMasterListQuery';

export const useTaxInvoiceMaster = (params: { page: number; size: number }) => {
	const list = useTaxInvoiceMasterListQuery(params);
	const create = useCreateTaxInvoiceMaster(params.page, params.size);
	const update = useUpdateTaxInvoiceMaster(params.page, params.size);
	const remove = useDeleteTaxInvoiceMaster(params.page, params.size);

	return {
		list,
		create,
		update,
		remove,
	};
}; 