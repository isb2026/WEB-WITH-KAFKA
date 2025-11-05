import { useCreatePlan } from './useCreatePlan';
import { useUpdatePlan } from './useUpdatePlan';
import { useDeletePlan } from './useDeletePlan';
import { usePlanListQuery } from './usePlanListQuery';
import { PlanSearchRequest } from '@primes/types/production';

interface PlanParams {
	page?: number;
	size?: number;
	searchRequest?: PlanSearchRequest;
}

export const usePlans = (params: PlanParams = {}) => {
	const list = usePlanListQuery(params);
	const create = useCreatePlan();
	const update = useUpdatePlan();
	const remove = useDeletePlan();

	return { list, create, update, remove };
};