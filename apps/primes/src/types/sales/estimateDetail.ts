import { Pageable, Sort } from '../common';
import { EstimateMaster } from './estimateMaster';

export interface GetAllEstimateDetailListPayload {
	page: number;
	size: number;
}

export interface EstimateDetailListResponse {
	totalElements: number;
	totalPages: number;
	size: number;
	content: EstimateDetail[];
	number: number;
	sort: Sort;
	numberOfElements: number;
	pageable: Pageable;
	first: boolean;
	last: boolean;
	empty: boolean;
}

export interface EstimateDetail {
	tenantId: number;        
	isUse: boolean;          
	isDelete: boolean;       
	createdAt: string;       
	createdBy: string;       
	updatedAt: string;       
	updatedBy: string;       
	id: number;              
	estimateMasterId: number;
	itemId: number;          
	itemNo: number;          
	itemNumber: string;      
	itemName: string;        
	itemSpec: string;        
	unit: string;            
	number: number;          
	currencyUnit: string;    
	unitPrice: number;       
	netPrice: number;        
	vat: number;             
	grossPrice: number;      
	memo: string;            
	estimateMaster: EstimateMaster[];
}

export interface CreateEstimateDetailPayload {
	dataList: {
		estimateMasterId: number;
		itemId: number;
		itemNo: number;
		itemNumber: string;
		itemName: string;
		itemSpec: string;
		unit: string;
		number: number;
		currencyUnit: string;
		unitPrice: number;
		netPrice: number;
		vat: number;
		grossPrice: number;
		memo: string;
	}[];
}

export interface UpdateEstimateDetailPayload {
	itemId: number;          
	itemNo: number;          
	itemNumber: string;      
	itemName: string;        
	itemSpec: string;        
	unit: string;     		
	number: number;   		
	currencyUnit: string;    
	unitPrice: number;       
	netPrice: number;        
	vat: number;             
	grossPrice: number;      
	memo: string;            
	isUse: boolean;          
}

export interface GetSearchEstimateDetailListPayload {
	page: number;
	size: number;
	searchRequest: SearchEstimateDetailRequest;
}

export interface SearchEstimateDetailRequest {
	createdAtEnd?: string;
	createdAtStart?: string;
	updatedAtEnd?: string;
	updatedBy?: string;
	updatedAtStart?: string;
	isDelete?: boolean;
	id?: number;
	isUse?: boolean;
	createdBy?: string;
}