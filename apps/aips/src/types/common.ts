// 공통 타입 정의

export interface BaseEntity {
    id: number;
    createdAt: string;
    updatedAt: string;
    createdBy?: string;
    updatedBy?: string;
}

export interface PaginationParams {
    page: number;
    size: number;
    sort?: string;
    direction?: 'asc' | 'desc';
}

export interface PaginationResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
    empty: boolean;
}

export interface SearchParams {
    keyword?: string;
    startDate?: string;
    endDate?: string;
    status?: string;
    [key: string]: any;
}

export interface SelectOption {
    id: string | number;
    value: string;
    label: string;
    disabled?: boolean;
}

export interface FormField {
    name: string;
    label: string;
    type: string;
    required?: boolean;
    placeholder?: string;
    options?: SelectOption[];
    validation?: {
        min?: number;
        max?: number;
        pattern?: string;
        message?: string;
    };
}

export interface TabItem {
    id: string;
    label: string;
    content?: React.ReactNode;
    icon?: React.ReactNode;
    to?: string;
    disabled?: boolean;
}

export interface MenuItem {
    id: string;
    label: string;
    icon?: React.ReactNode;
    to?: string;
    children?: MenuItem[];
    disabled?: boolean;
}

export interface NotificationItem {
    id: string;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    timestamp: string;
    read: boolean;
}

export interface User {
    id: number;
    username: string;
    email: string;
    name: string;
    role: string;
    avatar?: string;
    lastLoginAt?: string;
    isActive: boolean;
}

export interface ApiError {
    code: string;
    message: string;
    details?: any;
}

// 상태 관리 관련 타입
export interface LoadingState {
    isLoading: boolean;
    error?: string | null;
}

export interface AsyncState<T> extends LoadingState {
    data?: T;
}

// 테이블 관련 타입
export interface TableColumn {
    key: string;
    title: string;
    dataIndex: string;
    width?: number;
    sortable?: boolean;
    filterable?: boolean;
    render?: (value: any, record: any) => React.ReactNode;
}

export interface TableProps<T = any> {
    data: T[];
    columns: TableColumn[];
    loading?: boolean;
    pagination?: {
        current: number;
        pageSize: number;
        total: number;
        onChange: (page: number, pageSize: number) => void;
    };
    rowSelection?: {
        selectedRowKeys: string[];
        onChange: (selectedRowKeys: string[]) => void;
    };
}

// 차트 관련 타입
export interface ChartData {
    name: string;
    value: number;
    color?: string;
}

export interface TimeSeriesData {
    timestamp: string;
    value: number;
    category?: string;
}