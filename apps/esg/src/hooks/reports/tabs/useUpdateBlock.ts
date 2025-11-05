import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateReportTabBlock } from '@esg/services';
import { BlockPayload } from '@esg/types/report';

export const useUpdateBlock = (tabId: number, reportId: number) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: BlockPayload) =>
			updateReportTabBlock(reportId, tabId, data),
		onMutate: async (newData) => {
			await queryClient.cancelQueries({ queryKey: ['report', reportId] });
			const previousReport = queryClient.getQueryData([
				'report',
				reportId,
			]);

			const parsedBlocks = JSON.parse(newData.blocks);

			queryClient.setQueryData(['report', reportId], (old: any) => {
				const tabIndex = old.tabs.findIndex(
					(tab: any) => tab.tabId === tabId
				);
				if (tabIndex === -1) return old;

				const newTabs = [...old.tabs];
				newTabs[tabIndex] = {
					...old.tabs[tabIndex],
					blocks: parsedBlocks,
				};

				return {
					...old,
					tabs: newTabs,
				};
			});

			return { previousReport };
		},
		onError: (err, newData, context) => {
			queryClient.setQueryData(
				['report', reportId],
				context?.previousReport
			);
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ['report', reportId] });
		},
	});
};
