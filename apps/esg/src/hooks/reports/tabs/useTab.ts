import { useUpdateBlock } from './useUpdateBlock';
import { useCreateTab } from './useCreateTab';
import { useDeleteTab } from './useDeleteTab';
import { useUpdateTab } from './useUpdateTab';

export const useTab = (reportId: number, tabId: number) => {
	const createTab = useCreateTab(reportId || 0);
	const deleteTab = useDeleteTab(reportId || 0);
	const updateTab = useUpdateTab(reportId || 0);
	const updateTabBlocks = useUpdateBlock(tabId, reportId);
	return {
		createTab,
		deleteTab,
		updateTab,
		updateTabBlocks,
	};
};
