import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getRecordAuditLogsByAccountId, searchAuditLogs } from '@esg/services/auditLogService';

// API 응답 구조 타입 정의 (전달받은 구조 기반)
interface ApiResponse<T> {
    status: string;
    data: {
        totalElements: number;
        totalPages: number;
        size: number;
        content: T[];
        number: number;
        sort: {
            empty: boolean;
            sorted: boolean;
            unsorted: boolean;
        };
        numberOfElements: number;
        pageable: {
            offset: number;
            sort: {
                empty: boolean;
                sorted: boolean;
                unsorted: boolean;
            };
            paged: boolean;
            pageNumber: number;
            pageSize: number;
            unpaged: boolean;
        };
        first: boolean;
        last: boolean;
        empty: boolean;
    };
    message: string;
}

// 감사 로그 항목 타입 (실제 API 구조에 맞춤)
export interface AuditLogItem {
    auditLogId: number;
    userId: string;
    action: string;
    changedData: {
        [key: string]: any; // 실제 API에서는 단순 값 형태
    };
    ipAddress: string;
    userAgent: string;
    createdAt: string;
}

interface UseRecordHistoryParams {
    accountId: string | number;
    companyId?: string | number;
    enabled?: boolean;
    page?: number;
    size?: number;
}

interface RecordHistoryFilter {
    userId?: string;
    action?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    size?: number;
}

// 변경 필드 타입
interface FieldChange {
    field: string;
    before: any;
    after: any;
}

// 월별 데이터 변경 타입
interface MonthlyDataChange {
    field: string;
    before: number;
    after: number;
    change: number;
}

// 특정 관리항목의 변경이력 조회 (표준 패턴)
export const useRecordHistoryQuery = ({
    accountId,
    enabled = true,
    page = 0,
    size = 20,
}: UseRecordHistoryParams) => {
    return useQuery({
        queryKey: ['record-history', accountId, page, size],
        queryFn: () => getRecordAuditLogsByAccountId(accountId, page, size),
        enabled: enabled && !!accountId,
        placeholderData: keepPreviousData,
        staleTime: 1000 * 60 * 3,
        gcTime: 1000 * 60 * 3,
        retry: 1,
        retryDelay: 1000,
    });
};

// 복합 조건으로 레코드 변경이력 검색
export const useRecordHistorySearchQuery = ({
    accountId,
    enabled = true,
    ...filters
}: UseRecordHistoryParams & RecordHistoryFilter) => {
    return useQuery({
        queryKey: ['record-history-search', accountId, filters],
        queryFn: () => searchAuditLogs({
            targetTable: 'record',
            ...filters,
        }),
        enabled: enabled && !!accountId,
        staleTime: 1000 * 60 * 2,
        gcTime: 1000 * 60 * 5,
    });
};

// 변경이력 데이터 파싱 유틸리티 (실제 API 구조에 맞춤)
export const parseRecordHistoryData = (auditLog: any) => {
    try {
        const changes: FieldChange[] = [];

        if (auditLog.changedData) {
            // 실제 API에서는 changedData가 단순 객체 형태
            Object.entries(auditLog.changedData).forEach(([field, value]) => {
                // CREATE 액션의 경우 before는 null, after는 현재 값
                // UPDATE 액션의 경우 현재 값만 표시 (before/after 구분이 없음)
                changes.push({
                    field,
                    before: auditLog.action === 'CREATE' ? null : '-',
                    after: value,
                });
            });
        }

        return {
            ...auditLog,
            changes,
            monthlyChanges: [], // 실제 API에서는 월별 데이터가 다른 형태일 수 있음
        };
    } catch (error) {
        console.error('변경이력 데이터 파싱 오류:', error);
        return {
            ...auditLog,
            changes: [],
            monthlyChanges: [],
        };
    }
};



// 월별 데이터 변경 감지 (새로운 API 구조에 맞춤)
export const getMonthlyDataChanges = (changedData: AuditLogItem['changedData']): MonthlyDataChange[] => {
    if (!changedData) return [];

    const monthNames = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
    const changes: MonthlyDataChange[] = [];

    monthNames.forEach((month, index) => {
        if (changedData[month]) {
            const change = changedData[month];
            changes.push({
                field: `${index + 1}월`,
                before: Number(change.before) || 0,
                after: Number(change.after) || 0,
                change: (Number(change.after) || 0) - (Number(change.before) || 0),
            });
        }
    });

    return changes;
};

// 목업 데이터 생성 함수 (API 연결 전 테스트용) - 기존 패턴 참고
export const createMockRecordHistoryData = (accountId: string | number): ApiResponse<AuditLogItem> => {
    console.log('Creating mock data for accountId:', accountId);
    const mockData: AuditLogItem[] = [
        {
            auditLogId: 1,
            userId: "admin@company.com",
            action: "UPDATE",
            changedData: {
                jan: {
                    before: 12000,
                    after: 12500
                },
                feb: {
                    before: 13000,
                    after: 13200
                },
                mar: {
                    before: 11500,
                    after: 11800
                }
            },
            ipAddress: "192.168.1.100",
            userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            createdAt: new Date().toISOString()
        },
        {
            auditLogId: 2,
            userId: "manager@company.com",
            action: "UPDATE",
            changedData: {
                apr: {
                    before: 10500,
                    after: 10900
                },
                may: {
                    before: 11800,
                    after: 12100
                }
            },
            ipAddress: "192.168.1.101",
            userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
            createdAt: new Date(Date.now() - 3600000).toISOString() // 1시간 전
        },
        {
            auditLogId: 3,
            userId: "operator@company.com",
            action: "CREATE",
            changedData: {
                accountName: {
                    before: null,
                    after: "전력 사용량"
                },
                unit: {
                    before: null,
                    after: "kWh"
                },
                accountStyleName: {
                    before: null,
                    after: "에너지"
                }
            },
            ipAddress: "192.168.1.102",
            userAgent: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36",
            createdAt: new Date(Date.now() - 86400000).toISOString() // 1일 전
        }
    ];

    return {
        status: "success",
        data: {
            totalElements: mockData.length,
            totalPages: 1,
            size: 20,
            content: mockData,
            number: 0,
            sort: {
                empty: false,
                sorted: true,
                unsorted: false
            },
            numberOfElements: mockData.length,
            pageable: {
                offset: 0,
                sort: {
                    empty: false,
                    sorted: true,
                    unsorted: false
                },
                paged: true,
                pageNumber: 0,
                pageSize: 20,
                unpaged: false
            },
            first: true,
            last: true,
            empty: false
        },
        message: "조회 성공"
    };
};

// 목업 데이터를 사용하는 훅 (개발/테스트용) - 기존 패턴과 동일한 설정
export const useMockRecordHistoryQuery = ({
    accountId,
    enabled = true,
    page = 0,
    size = 20,
}: UseRecordHistoryParams) => {
    return useQuery({
        queryKey: ['mock-record-history', accountId, page, size],
        queryFn: async (): Promise<ApiResponse<AuditLogItem>> => {
            // 기존 패턴과 동일한 에러 처리 구조
            try {
                // API 호출 시뮬레이션 (지연 시간 추가)
                await new Promise(resolve => setTimeout(resolve, 500));

                const mockResponse = createMockRecordHistoryData(accountId);

                // 페이징 처리 시뮬레이션
                const startIndex = page * size;
                const endIndex = startIndex + size;
                const paginatedContent = mockResponse.data.content.slice(startIndex, endIndex);

                return {
                    ...mockResponse,
                    data: {
                        ...mockResponse.data,
                        content: paginatedContent,
                        number: page,
                        size: size,
                        numberOfElements: paginatedContent.length,
                        first: page === 0,
                        last: endIndex >= mockResponse.data.totalElements,
                    }
                };
            } catch (error) {
                throw new Error(`관리항목 ${accountId}의 변경이력 조회 실패`);
            }
        },
        enabled: enabled && !!accountId,
        staleTime: 1000 * 60 * 3, // 기존 패턴과 동일
        gcTime: 1000 * 60 * 5,
        retry: 1,
        retryDelay: 1000,
    });
};