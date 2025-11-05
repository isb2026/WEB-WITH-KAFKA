import React, { useState } from 'react';
import {
    PaperComponent,
    Spinner
} from '@moornmo/components';
import { Pagination } from 'react-bootstrap';
import {
    useRecordHistoryQuery
} from '@esg/hooks/records/useRecordHistory';
import { Activity } from 'lucide-react';
import { commaNumber } from '@repo/utils';

interface RecordHistoryPanelProps {
    accountId: string | number;
    accountName?: string;
    onClose: () => void;
}

export const RecordHistoryPanel: React.FC<RecordHistoryPanelProps> = ({
    accountId,
    accountName = '관리항목',
    onClose,
}) => {
    const [currentPage, setCurrentPage] = useState(0);
    const pageSize = 10;

    const { data, isLoading, error } = useRecordHistoryQuery({
        accountId,
        page: currentPage,
        size: pageSize,
    });

    const historyContent = data?.content || [];
    const totalElements = data?.totalElements || 0;
    const totalPages = data?.totalPages || 0;





    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };



    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString);
        return {
            date: date.toLocaleDateString('ko-KR'),
            time: date.toLocaleTimeString('ko-KR', {
                hour: '2-digit',
                minute: '2-digit'
            }),
        };
    };

    // 필드명을 한글로 변환 (청구 관련 필드 제외)
    const getFieldDisplayName = (fieldName: string) => {
        const fieldMap: { [key: string]: string } = {
            'quantity': '사용량',
            'accountMonth': '계정월',
            'meterName': '미터명',
            'meterSerialNo': '미터번호',
            'createdBy': '생성자',
            'updatedBy': '수정자'
        };
        return fieldMap[fieldName] || fieldName;
    };

    // 청구 관련 필드 및 ID 제외 함수
    const shouldShowField = (fieldName: string) => {
        const excludeFields = [
            'totalCost', 'amountToPay', 'invoiceOn', 'paidOn',
            'payableOn', 'reference', 'invoiceMemo', 'id'
        ];
        return !excludeFields.includes(fieldName);
    };

    // UserAgent 간단 표시 (브라우저 정보만)
    const formatUserAgent = (userAgent: string) => {
        if (!userAgent) return '-';

        // Chrome, Safari, Firefox 등 브라우저 정보 추출
        if (userAgent.includes('Chrome')) return 'Chrome';
        if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) return 'Safari';
        if (userAgent.includes('Firefox')) return 'Firefox';
        if (userAgent.includes('Edge')) return 'Edge';

        return 'Other';
    };

    // 필드 값 포맷팅
    const formatFieldValue = (value: any) => {
        if (value === null || value === undefined) return '-';
        if (typeof value === 'number') return commaNumber(value);
        if (typeof value === 'string' && value.includes('-') && value.length === 10) {
            // 날짜 형식인 경우
            return value;
        }
        return value.toString();
    };

    if (isLoading) {
        return (
            <PaperComponent sx={{ height: '100%', padding: '2rem' }}>
                <div className="d-flex justify-content-center align-items-center h-100">
                    <Spinner />
                </div>
            </PaperComponent>
        );
    }

    if (error) {
        return (
            <PaperComponent sx={{ height: '100%', padding: '2rem' }}>
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="mb-0">변경 이력</h5>
                    <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={onClose}
                    >
                        닫기
                    </button>
                </div>
                <div className="alert alert-warning">
                    <h6 className="alert-heading">API 연결 오류</h6>
                    <p className="mb-2">
                        <strong>오류:</strong> {error.message}
                    </p>
                    <hr />
                    <p className="mb-0 small">
                        API 엔드포인트: <code>/audit-log/record/account/{accountId}</code><br />
                        관리항목 ID: <code>{accountId}</code>
                    </p>
                </div>
            </PaperComponent>
        );
    }

    return (
        <PaperComponent
            sx={{
                height: '100%',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            {/* 헤더 */}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                    <h5 className="mb-1">변경 이력</h5>
                    <small className="text-muted">
                        {accountName} (ID: {accountId})
                    </small>
                </div>
                <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={onClose}
                >
                    닫기
                </button>
            </div>

            {/* 통계 정보 */}
            <div className="row mb-3">
                <div className="col-6">
                    <div className="card border-0 bg-light">
                        <div className="card-body p-2 text-center">
                            <small className="text-muted">총 변경 횟수</small>
                            <div className="h6 mb-0">{totalElements}회</div>
                        </div>
                    </div>
                </div>
                <div className="col-6">
                    <div className="card border-0 bg-light">
                        <div className="card-body p-2 text-center">
                            <small className="text-muted">최근 변경</small>
                            <div className="h6 mb-0">
                                {historyContent[0]?.createdAt ?
                                    formatDateTime(historyContent[0].createdAt).date :
                                    '-'
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 변경 이력 목록 */}
            <div className="flex-grow-1 overflow-auto">
                {historyContent.length === 0 ? (
                    <div className="text-center py-4">
                        <div className="text-muted">
                            <Activity size={48} className="mb-2 opacity-50" />
                            <p>변경 이력이 없습니다.</p>
                        </div>
                    </div>
                ) : (
                    <div className="history-list">
                        {historyContent.map((log: any) => {
                            const dateTime = formatDateTime(log.createdAt);

                            return (
                                <div key={log.auditLogId} className="history-item mb-3 p-3 border rounded">
                                    {/* 헤더 - 액션, 사용자, 시간 */}
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <div className="d-flex align-items-center gap-2">
                                            <span className={`badge ${log.action === 'CREATE' ? 'bg-success' : log.action === 'UPDATE' ? 'bg-warning' : 'bg-danger'}`}>
                                                {log.action === 'CREATE' ? '생성' : log.action === 'UPDATE' ? '수정' : '삭제'}
                                            </span>
                                            <span className="fw-bold">{log.userId}</span>
                                        </div>
                                        <small className="text-muted">
                                            {dateTime.date} {dateTime.time}
                                        </small>
                                    </div>

                                    {/* 접속 정보 */}
                                    <div className="mb-3 p-2 bg-light rounded">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <small className="text-muted">
                                                    <strong>IP 주소:</strong> {log.ipAddress || '-'}
                                                </small>
                                            </div>
                                            <div className="col-md-6">
                                                <small className="text-muted">
                                                    <strong>브라우저:</strong> {formatUserAgent(log.userAgent)}
                                                </small>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 변경된 데이터 (청구 관련 제외) */}
                                    {log.changedData && (
                                        <div className="changed-data">
                                            <div className="row">
                                                {Object.entries(log.changedData)
                                                    .filter(([key]) => shouldShowField(key))
                                                    .map(([key, value]: [string, any]) => (
                                                        <div key={key} className="col-md-6 col-lg-4 mb-2">
                                                            <div className="small">
                                                                <strong className="text-primary">{getFieldDisplayName(key)}:</strong>
                                                                <div className="text-dark">{formatFieldValue(value)}</div>
                                                            </div>
                                                        </div>
                                                    ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* 페이지네이션 */}
            {totalPages > 1 && (
                <div className="mt-3 d-flex justify-content-center">
                    <Pagination>
                        <Pagination.First
                            onClick={() => handlePageChange(0)}
                            disabled={currentPage === 0}
                        />
                        <Pagination.Prev
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 0}
                        />

                        {/* 페이지 번호들 */}
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            const startPage = Math.max(0, currentPage - 2);
                            const pageNum = startPage + i;

                            if (pageNum >= totalPages) return null;

                            return (
                                <Pagination.Item
                                    key={pageNum}
                                    active={pageNum === currentPage}
                                    onClick={() => handlePageChange(pageNum)}
                                >
                                    {pageNum + 1}
                                </Pagination.Item>
                            );
                        })}

                        <Pagination.Next
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage >= totalPages - 1}
                        />
                        <Pagination.Last
                            onClick={() => handlePageChange(totalPages - 1)}
                            disabled={currentPage >= totalPages - 1}
                        />
                    </Pagination>
                </div>
            )}
        </PaperComponent>
    );
};