import { useReportList } from './useReportList';
import { useCreateReport } from './useCreateReport';
import { useDeleteReport } from './useDeleteReport';
import { useUpdateReport } from './useUpdateReport';

interface reportParams {
	page: number;
	size: number;
	reportId?: number | null;
}
export const useReport = ({ page, size, reportId = null }: reportParams) => {
	const reportList = useReportList(page, size);
	const create = useCreateReport();
	const update = useUpdateReport();
	const remove = useDeleteReport();

	return {
		reportList,
		create,
		update,
		remove,
	};
};
