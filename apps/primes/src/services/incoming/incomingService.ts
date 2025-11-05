import apiClient from '@primes/utils/apiClient';
import { SearchIncomingMasterRequest } from '@primes/types/purchase/incomingMaster';
import { SearchIncomingDetailRequest } from '@primes/types/purchase/incomingDetail';

export const incomingService = {
	// Get incoming master list
	getIncomingMasterList: async (params?: SearchIncomingMasterRequest & {
		page?: number;
		size?: number;
		sort?: string;
	}) => {
		const apiParams = {
			page: params?.page || 0,
			size: params?.size || 10,
			...params
		};
		
		const response = await apiClient.get('/purchase/incoming/master', { params: apiParams });
		return response.data;
	},

	// Get incoming detail list
	getIncomingDetailList: async (params?: SearchIncomingDetailRequest & {
		page?: number;
		size?: number;
		sort?: string;
	}) => {
		const apiParams = {
			page: params?.page || 0,
			size: params?.size || 10,
			...params
		};
		
		const response = await apiClient.get('/purchase/incoming/detail', { params: apiParams });
		return response.data;
	},

	// Create incoming
	createIncoming: async (data: {
		incomingCode: string;
		vendorNo: number;
		vendorName: string;
		incomingDate: string;
		currencyUnit: string;
	}) => {
		const response = await apiClient.post('/purchase/incoming/master', data);
		return response.data;
	},

	// Update incoming
	updateIncoming: async (payload: {
		id: number;
		data: Partial<{
			incomingCode: string;
			vendorNo: number;
			vendorName: string;
			incomingDate: string;
			currencyUnit: string;
		}>;
	}) => {
		const response = await apiClient.put(`/purchase/incoming/master/${payload.id}`, payload.data);
		return response.data;
	},

	// Delete incoming
	deleteIncoming: async (id: number) => {
		const response = await apiClient.delete(`/purchase/incoming/master/${id}`);
		return response.data;
	},
}; 