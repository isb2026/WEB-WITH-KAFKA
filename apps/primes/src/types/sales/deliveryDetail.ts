import { Pageable, Sort } from '../common';

export interface GetAllDeliveryDetailListPayload {
	page: number;
	size: number;
}

export interface DeliveryDetailListResponse {
	totalElements: number;
	totalPages: number;
	size: number;
	content: DeliveryDetail[];
	number: number;
	sort: Sort;
	numberOfElements: number;
	pageable: Pageable;
	first: boolean;
	last: boolean;
	empty: boolean;
}

export interface DeliveryDetail {
	tenantId: number;        
	isUse: boolean;          
	isDelete: boolean;       
	createdAt: string;       
	createdBy: string;       
	updatedAt: string;       
	updatedBy: string;       
	id: number;              
	deliveryMasterId: number;
	itemId: number;          
	itemNo: number;          
	itemNumber: string;      
	itemName: string;        
	itemSpec: string;        
	deliveryUnit: string;    
	deliveryAmount: number;  
	currencyUnit: string;    
	unitPrice: number;       
	netPrice: number;        
	vat: number;             
	grossPrice: number;      
	memo: string;            
	deliveryMaster: any[];
}

export interface CreateDeliveryDetailPayload {
		deliveryMasterId: number;
		itemId: number;
		itemNo: number;
		itemNumber: string;
		itemName: string;
		itemSpec: string;
		deliveryUnit: string;
		deliveryAmount: number;
		currencyUnit: string;
		unitPrice: number;
		netPrice: number;
		vat: number;
		grossPrice: number;
		memo: string;
}

export interface DeliveryDetailItem {
	deliveryMasterId: number;
	itemId: number;
	itemNo: number;
	itemNumber: string;
	itemName: string;
	itemSpec: string;
	deliveryUnit: string;
	deliveryAmount: number;
	currencyUnit: string;
	unitPrice: number;
	netPrice: number;
	vat: number;
	grossPrice: number;
	memo: string;
	isUse?: boolean;
}

export interface UpdateDeliveryDetailPayload {
	itemId: number;          
	itemNo: number;          
	itemNumber: string;      
	itemName: string;        
	itemSpec: string;        
	deliveryUnit: string;    
	deliveryAmount: number;  
	currencyUnit: string;    
	unitPrice: number;       
	netPrice: number;        
	vat: number;             
	grossPrice: number;      
	memo: string;            
	isUse: boolean;          
}

export interface GetSearchDeliveryDetailListPayload {
	page: number;
	size: number;
	searchRequest: SearchDeliveryDetailRequest;
}

export interface SearchDeliveryDetailRequest {
	createdAtEnd?: string;
	createdAtStart?: string;
	updatedAtEnd?: string;
	updatedBy?: string;
	updatedAtStart?: string;
	isDelete?: boolean;
	id?: number;
	isUse?: boolean;
	createdBy?: string;
	deliveryMasterId?: number;
	itemId?: number;
	itemNo?: number;
	itemNumber?: string;
	itemName?: string;
} 