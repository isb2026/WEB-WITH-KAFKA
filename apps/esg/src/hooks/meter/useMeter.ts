import { useCreateMeter } from './useCreateMeter';
import { useUpdateMeter } from './useUpdateMeter';
import { useDeleteMeter } from './useDeleteMeter';
import { useMeterListQuery } from './useMeterListQuery';
import { useMeterDetailQuery } from './useMeterDetailQuery';

export const useMeter = (params: { page: number; size: number }) => {
	const list = useMeterListQuery(params);
	const create = useCreateMeter();
	const update = useUpdateMeter();
	const remove = useDeleteMeter();
	const byId = useMeterDetailQuery;

	return { list, create, update, remove, byId };
};
