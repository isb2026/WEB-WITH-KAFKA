import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
	getRecordMatrix,
	saveRecordMatrix,
	RecordMatrixRequest,
	RecordMatrixResponse,
} from '@esg/services/recordMatrixService';
import { useAccountByCompanyQuery } from '@esg/hooks/account';

interface UseRecordMatrixParams {
	companyId: string | number;
	year: number;
	enabled?: boolean;
}

// Record Matrix 조회 Hook (Account 기반 fallback 포함)
export const useRecordMatrixQuery = ({
	companyId,
	year,
	enabled = true,
}: UseRecordMatrixParams) => {
	// 1. 회사별 관리항목 조회 (fallback용)
	const accountsQuery = useAccountByCompanyQuery({
		companyId,
		enabled: enabled && !!companyId,
	});
	// 2. Record Matrix 조회
	return useQuery({
		queryKey: ['record-matrix', companyId, year],
		queryFn: async (): Promise<RecordMatrixResponse> => {
			// Account 기반 빈 매트릭스 생성 함수
			const createEmptyMatrix = (): RecordMatrixResponse => {
				if (!accountsQuery.data?.content) {
					throw new Error('회사별 관리항목을 찾을 수 없습니다.');
				}

				const accounts = accountsQuery.data.content.filter(
					(acc: any) => acc.isUse
				);

				const emptyRecords = accounts.map((account: any) => ({
					accountId: account.id,
					accountName: account.name,
					unit: account?.accountStyle?.dataType?.uom || '',
					accountStyleName:
						account.accountStyle?.name ||
						account.accountStyleName ||
						'',
					monthlyQuantities: Array(12).fill(null), // 12개월 모두 null
					monthlyCosts: Array(12).fill(null),
				}));

				return {
					companyId: Number(companyId),
					accountYear: year,
					year,
					records: emptyRecords,
				};
			};

			try {
				// 먼저 Matrix API로 데이터 조회 시도
				const matrixData = await getRecordMatrix(
					Number(companyId),
					year
				);
				// Matrix API 응답이 성공했지만 records가 빈 배열인 경우
				if (
					!matrixData ||
					!matrixData.records ||
					matrixData.records.length === 0
				) {
					return createEmptyMatrix();
				}

				// records의 각 항목에 monthlyQuantities가 있는지 확인
				const validRecords = matrixData.records.map((record) => ({
					...record,
					monthlyQuantities: Array.isArray(record.monthlyQuantities)
						? record.monthlyQuantities
						: Array(12).fill(null),
				}));

				// 정상적으로 데이터가 있는 경우
				return {
					...matrixData,
					records: validRecords,
				};
			} catch (error) {
				return createEmptyMatrix();
			}
		},
		enabled: enabled && !!companyId && !!year && !!accountsQuery.data,
		staleTime: 1000 * 30, // 30초간 캐시 유지 (더 빠른 업데이트)
		gcTime: 1000 * 60 * 2, // 2분간 가비지 컬렉션 방지
		retry: 1, // Matrix API 실패 시 Account 기반으로 fallback하므로 재시도 1회만
		retryDelay: 1000,
	});
};

// Record Matrix 저장 Hook
export const useSaveRecordMatrix = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (payload: RecordMatrixRequest) => saveRecordMatrix(payload),
		onSuccess: (data, variables) => {
			console.log('🔄 Record Matrix 저장 성공, 캐시 업데이트 시작...', {
				companyId: variables.companyId,
				year: variables.year,
				data: data,
			});

			// 1. 정확한 쿼리 키로 무효화
			queryClient.invalidateQueries({
				queryKey: ['record-matrix'],
			});
			console.log('✅ 쿼리 무효화 완료');

			// 2. records 관련 쿼리도 무효화
			queryClient.invalidateQueries({
				queryKey: ['records'],
			});
			console.log('✅ records 쿼리 무효화 완료');
		},
		onError: (error) => {
			console.error('Record Matrix 저장 실패:', error);
		},
	});
};

// 그리드 데이터를 Matrix API 형식으로 변환하는 유틸리티 함수
export const convertGridDataToMatrix = (
	companyId: number,
	year: number,
	gridData: any[]
): RecordMatrixRequest => {
	const records = gridData.map((row) => {
		console.log('row', row);
		// 월별 값 변환 헬퍼 함수
		const convertValue = (value: any): number | null => {
			// 빈 문자열, null, undefined인 경우 null 반환
			if (value === '' || value == null) {
				return null;
			}
			// 숫자로 변환 가능한 경우 숫자 반환 (0 포함)
			const numValue = Number(value);
			return isNaN(numValue) ? null : numValue;
		};

		const monthlyQuantities = [
			convertValue(row.jan),
			convertValue(row.feb),
			convertValue(row.mar),
			convertValue(row.apr),
			convertValue(row.may),
			convertValue(row.jun),
			convertValue(row.jul),
			convertValue(row.aug),
			convertValue(row.sep),
			convertValue(row.oct),
			convertValue(row.nov),
			convertValue(row.dec),
		];

		return {
			accountId: row.accountId,
			accountName: row.accountName,
			monthlyQuantities,
			// monthlyCosts는 필요시 추가
		};
	});

	const payload = {
		companyId,
		accountYear: year,
		year,
		records,
	};

	return payload;
};

// Matrix API 응답을 그리드 데이터로 변환하는 유틸리티 함수
export const convertMatrixToGridData = (
	matrixResponse: RecordMatrixResponse
): any[] => {
	if (!matrixResponse || !matrixResponse.records) {
		return [];
	}

	return matrixResponse.records.map((record) => {
		// Matrix API가 monthlyData 구조로 응답하는 경우 처리
		let quantities = Array(12).fill(null);

		if (
			(record as any).monthlyData &&
			Array.isArray((record as any).monthlyData)
		) {
			// monthlyData에서 quantity 값들을 추출하여 12개월 배열로 변환
			(record as any).monthlyData.forEach((monthData: any) => {
				if (monthData.month >= 1 && monthData.month <= 12) {
					quantities[monthData.month - 1] = monthData.quantity;
				}
			});
		} else if (Array.isArray(record.monthlyQuantities)) {
			// 기존 monthlyQuantities 구조 처리
			quantities = record.monthlyQuantities;
		}

		const [jan, feb, mar, apr, may, jun, jul, aug, sep, oct, nov, dec] =
			quantities;

		// 합계 계산 (null은 0으로 처리)
		const total = quantities.reduce((sum, value) => sum + (value || 0), 0);

		const gridRow = {
			accountId: record.accountId,
			accountName: record.accountName || '관리항목',
			unit: (record as any).uom || (record as any).unit || '', // uom 또는 unit 정보
			accountStyleName: (record as any).accountStyleName || '',
			accountStyleCaption: (record as any).accountStyleCaption || '',
			year: matrixResponse.year,
			// 실제 값이 있으면 표시, null이면 빈 문자열 (그리드에서 편집 가능하도록)
			jan: jan !== null && jan !== undefined ? jan : '',
			feb: feb !== null && feb !== undefined ? feb : '',
			mar: mar !== null && mar !== undefined ? mar : '',
			apr: apr !== null && apr !== undefined ? apr : '',
			may: may !== null && may !== undefined ? may : '',
			jun: jun !== null && jun !== undefined ? jun : '',
			jul: jul !== null && jul !== undefined ? jul : '',
			aug: aug !== null && aug !== undefined ? aug : '',
			sep: sep !== null && sep !== undefined ? sep : '',
			oct: oct !== null && oct !== undefined ? oct : '',
			nov: nov !== null && nov !== undefined ? nov : '',
			dec: dec !== null && dec !== undefined ? dec : '',
			total,
		};

		return gridRow;
	});
};
