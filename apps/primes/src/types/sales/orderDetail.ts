import { Pageable, Sort } from '../common';

export interface GetAllOrderDetailListPayload {
	page: number;
	size: number;
}

export interface OrderDetailListResponse {
	totalElements: number;
	totalPages: number;
	size: number;
	content: OrderDetail[];
	number: number;
	sort: Sort;
	numberOfElements: number;
	pageable: Pageable;
	first: boolean;
	last: boolean;
	empty: boolean;
}

export interface OrderDetail {
	tenantId: number;        
	isUse: boolean;          
	isDelete: boolean;       
	createdAt: string;       
	createdBy: string;       
	updatedAt: string;       
	updatedBy: string;       
	id: number;              
	orderMasterId: number;
	itemId: number;          
	itemNo: number;          
	itemNumber: string;      
	itemName: string;        
	orderUnit: string;       
	orderNumber: number;     
	currencyUnit: string;    
	unitPrice: number;       
	netPrice: number;        
	vat: number;             
	grossPrice: number;      
	requestDate: string;     
	orderMaster: any[];
}

export interface CreateOrderDetailPayload {
	orderMasterId: number;
	itemId: number;
	itemNo: number;
	itemNumber: string;
	itemName: string;
	orderUnit: string;
	orderNumber: number;
	currencyUnit: string;
	unitPrice: number;
	netPrice: number;
	vat: number;
	grossPrice: number;
	requestDate: string;
}

export interface OrderDetailItem {
	orderMasterId: number;
	itemId: number;
	itemNo: number;
	itemNumber: string;
	itemName: string;
	orderUnit: string;
	orderNumber: number;
	currencyUnit: string;
	unitPrice: number;
	netPrice: number;
	vat: number;
	grossPrice: number;
	requestDate: string;
	isUse?: boolean;
}

export interface UpdateOrderDetailPayload {
	itemId: number;          
	itemNo: number;          
	itemNumber: string;      
	itemName: string;        
	orderUnit: string;       
	orderNumber: number;     
	currencyUnit: string;    
	unitPrice: number;       
	netPrice: number;        
	vat: number;             
	grossPrice: number;      
	requestDate: string;     
	isUse: boolean;          
}

export interface GetSearchOrderDetailListPayload {
	page: number;
	size: number;
	searchRequest: SearchOrderDetailRequest;
}

export interface SearchOrderDetailRequest {
	createdAtEnd?: string;
	createdAtStart?: string;
	updatedAtEnd?: string;
	updatedBy?: string;
	updatedAtStart?: string;
	isDelete?: boolean;
	id?: number;
	isUse?: boolean;
	createdBy?: string;
	orderMasterId?: number;
	itemId?: number;
	itemNo?: number;
	itemNumber?: string;
	itemName?: string;
	requestDate?: string;
} 