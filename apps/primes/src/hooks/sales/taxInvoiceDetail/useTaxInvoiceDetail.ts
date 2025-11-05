import { useCreateTaxInvoiceDetail } from './useCreateTaxInvoiceDetail';
import { useUpdateTaxInvoiceDetail } from './useUpdateTaxInvoiceDetail';
import { useDeleteTaxInvoiceDetail } from './useDeleteTaxInvoiceDetail';
import { useTaxInvoiceDetailListQuery, useTaxInvoiceDetailListByMasterIdQuery } from './useTaxInvoiceDetailListQuery';

export const useTaxInvoiceDetail = (params: { page: number; size: number; taxInvoiceMasterId?: number }) => {
	const list = useTaxInvoiceDetailListQuery(params);
	const listByMasterId = useTaxInvoiceDetailListByMasterIdQuery(
		params.taxInvoiceMasterId || 0,
		params.page,
		params.size
	);
	const create = useCreateTaxInvoiceDetail(params.page, params.size);
	const update = useUpdateTaxInvoiceDetail(params.page, params.size);
	const remove = useDeleteTaxInvoiceDetail(params.page, params.size);

	return {
		list,
		listByMasterId,
		create,
		update,
		remove,
	};
};
